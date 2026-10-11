import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { TrayModel, SimulationState, ViewOptions, Point } from '../types';
import { renderCanvas, computeViewport } from '../core/render';
import { HEADS, LAYER_COLORS, DEG } from '../core/constants';
import { fmt, clamp } from '../core/model';
import { Translations, Language, translations } from '../core/i18n';

interface CanvasStageProps {
  model: TrayModel;
  state: SimulationState | null;
  options: ViewOptions;
  onChangeOptions: (opts: ViewOptions) => void;
  t?: Translations;
  lang?: Language;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  model,
  state,
  options,
  onChangeOptions,
  t: propT,
  lang = 'ar',
}) => {
  const t = propT || translations[lang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // References for drag & pinch state
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    moved: boolean;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    moved: false,
  });

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ dist: number; startZoom: number } | null>(null);

  // Redraw Canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !model) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    renderCanvas(
      ctx,
      w,
      h,
      dpr,
      model,
      state,
      options,
      zoom,
      pan.x,
      pan.y,
      hoverPoint
    );
  }, [model, state, options, zoom, pan, hoverPoint]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Window resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      redraw();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [redraw]);

  // Zoom controls
  const handleZoom = (factor: number) => {
    setZoom((prev) => clamp(prev * factor, 0.4, 60));
  };

  const handleResetFit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHoverPoint(null);
    setTooltipPos(null);
  };

  // Hit testing for hover / tap tooltip
  const hitTest = (clientX: number, clientY: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas || !model) return null;

    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const { sc, cx, cy } = computeViewport(w, h, model.R, zoom, pan.x, pan.y);
    const theta = (state ? state.theta : 0) * DEG;
    const dx = (mx - cx) / sc;
    const dy = (my - cy) / sc;

    // Counter rotate by -theta
    const c = Math.cos(-theta);
    const s = Math.sin(-theta);
    const tx = dx * c - dy * s;
    const ty = dx * s + dy * c;

    let bestPoint: Point | null = null;
    let minDistance = Math.max(model.toolR, 10 / sc);

    for (const p of model.all) {
      const dist = Math.hypot(p.x - tx, p.y - ty);
      if (dist < minDistance) {
        minDistance = dist;
        bestPoint = p;
      }
    }

    return bestPoint;
  };

  // Pointer event handlers for touch & mouse
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        moved: false,
      };
    } else if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchRef.current = { dist, startZoom: zoom };
      dragRef.current.active = false;
      setTooltipPos(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Handle 2-finger pinch zoom
    if (pointersRef.current.size === 2 && pinchRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchRef.current.dist > 0) {
        const factor = currentDist / pinchRef.current.dist;
        setZoom(clamp(pinchRef.current.startZoom * factor, 0.4, 60));
      }
      return;
    }

    // Handle 1-finger drag / pan
    if (dragRef.current.active && pointersRef.current.size === 1) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      if (!dragRef.current.moved && Math.hypot(dx, dy) > 4) {
        dragRef.current.moved = true;
        setIsDragging(true);
        setTooltipPos(null);
      }

      if (dragRef.current.moved) {
        setPan({
          x: dragRef.current.startPanX + dx,
          y: dragRef.current.startPanY + dy,
        });
        return;
      }
    }

    // Handle mouse hover (when no button is pressed)
    if (e.pointerType === 'mouse' && !dragRef.current.active) {
      const target = hitTest(e.clientX, e.clientY);
      setHoverPoint(target);

      if (target && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      } else {
        setTooltipPos(null);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    if (dragRef.current.active) {
      // If it was a quick tap without drag on touch screen
      if (!dragRef.current.moved) {
        const target = hitTest(e.clientX, e.clientY);
        setHoverPoint(target);
        if (target && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        } else {
          setTooltipPos(null);
        }
      }
      dragRef.current.active = false;
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    setZoom((prev) => clamp(prev * factor, 0.4, 60));
  };

  return (
    <div className="oneui-card p-4 md:p-5 flex flex-col gap-3.5">
      {/* 1. Stage Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* View toggles chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChangeOptions({ ...options, sectors: !options.sectors })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
              options.sectors
                ? 'bg-blue-50 border-[#2563eb]/40 text-[#2563eb]'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'
            }`}
          >
            {t.viewSectors}
          </button>

          <button
            type="button"
            onClick={() => onChangeOptions({ ...options, heads: !options.heads })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
              options.heads
                ? 'bg-blue-50 border-[#2563eb]/40 text-[#2563eb]'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'
            }`}
          >
            {t.viewHeads}
          </button>

          <button
            type="button"
            onClick={() => onChangeOptions({ ...options, rings: !options.rings })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
              options.rings
                ? 'bg-blue-50 border-[#2563eb]/40 text-[#2563eb]'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'
            }`}
          >
            {t.viewRings}
          </button>

          <button
            type="button"
            onClick={() => onChangeOptions({ ...options, labels: !options.labels })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
              options.labels
                ? 'bg-blue-50 border-[#2563eb]/40 text-[#2563eb]'
                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'
            }`}
          >
            {t.viewLabels}
          </button>
        </div>

        {/* Zoom Action Buttons */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-2xl border border-[#cbd5e1]/60">
          <button
            type="button"
            onClick={() => handleZoom(0.8)}
            className="w-8 h-8 rounded-xl bg-white hover:bg-[#e2e8f0] flex items-center justify-center text-[#475569] shadow-xs transition-all cursor-pointer"
            title={lang === 'ar' ? 'تصغير' : 'Zoom arrière'}
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetFit}
            className="w-8 h-8 rounded-xl bg-white hover:bg-[#e2e8f0] flex items-center justify-center text-[#475569] shadow-xs transition-all cursor-pointer"
            title={lang === 'ar' ? 'ملاءمة للشاشة (100%)' : 'Ajuster à l\'écran (100%)'}
            aria-label="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom(1.25)}
            className="w-8 h-8 rounded-xl bg-white hover:bg-[#e2e8f0] flex items-center justify-center text-[#475569] shadow-xs transition-all cursor-pointer"
            title={lang === 'ar' ? 'تكبير' : 'Zoom avant'}
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-h-[68vh] mx-auto rounded-3xl overflow-hidden border border-[#d8e0ec] shadow-inner bg-[#f8fafc] touch-none select-none"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          role="img"
          aria-label="محاكاة صينية الشاي الصناعية"
        />

        {/* Hover / Tap Tooltip */}
        {hoverPoint && tooltipPos && (
          <div
            style={{
              left: Math.min(Math.max(tooltipPos.x + 14, 8), (containerRef.current?.offsetWidth || 300) - 180),
              top: Math.min(Math.max(tooltipPos.y + 14, 8), (containerRef.current?.offsetHeight || 300) - 120),
            }}
            className="absolute pointer-events-none z-20 bg-white/95 backdrop-blur-md border border-[#2563eb]/40 rounded-2xl px-3.5 py-2.5 shadow-lg text-xs leading-relaxed text-[#1e293b] text-left"
            dir="ltr"
          >
            <div className="font-bold flex items-center justify-between gap-3 text-[#2563eb] border-b border-[#f1f5f9] pb-1 mb-1">
              <span>{lang === 'ar' ? `الطبقة L${hoverPoint.layer + 1}` : `Couche L${hoverPoint.layer + 1}`}</span>
              <span className="font-mono text-[11px] text-[#475569]">
                #{hoverPoint.k + 1}
              </span>
            </div>
            <div className="text-[11px] text-[#64748b]">
              <div>
                {lang === 'ar' ? 'الرأس:' : 'Tête :'} {' '}
                <strong className="text-[#0f172a] font-mono">
                  {HEADS[hoverPoint.head].id} ({HEADS[hoverPoint.head].angle}°)
                </strong>
              </div>
              <div>
                {lang === 'ar' ? 'الزاوية:' : 'Angle :'} {' '}
                <strong className="text-[#0f172a] font-mono">
                  {fmt(hoverPoint.a, 2)}°
                </strong>
              </div>
              <div>
                {lang === 'ar' ? 'الإحداثيات:' : 'Coord :'} X={fmt(hoverPoint.x, 2)} , Y={fmt(hoverPoint.y, 2)} mm
              </div>
              <div className="mt-1 pt-1 border-t border-[#f1f5f9]">
                {state && hoverPoint.j < state.counts[hoverPoint.layer] ? (
                  <span className="text-[#059669] font-bold">✔ {lang === 'ar' ? 'تم الحفر' : 'Percé'}</span>
                ) : (
                  <span className="text-amber-600 font-bold">⏳ {lang === 'ar' ? 'بانتظار الحفر' : 'En attente'}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Visual Legend Strip */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#64748b] pt-1" dir="ltr">
        {/* Layer dots */}
        {model.layers.map((l) => (
          <span key={l.i} className="flex items-center gap-1.5 font-medium">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: LAYER_COLORS[l.i % LAYER_COLORS.length] }}
            />
            <span>L{l.i + 1} ({fmt(l.r, 0)} mm)</span>
          </span>
        ))}

        {/* Head markers */}
        {HEADS.map((h) => (
          <span key={h.id} className="flex items-center gap-1.5 font-medium">
            <span
              className="w-2.5 h-2.5 rounded-xs inline-block"
              style={{ backgroundColor: h.color }}
            />
            <span className="font-mono">{h.id} @ {h.angle}°</span>
          </span>
        ))}

        <span className="flex items-center gap-1.5 font-medium text-red-600">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-red-500 inline-block" />
          <span>{lang === 'ar' ? 'تداخل محظور' : 'Collision interdite'}</span>
        </span>
      </div>
    </div>
  );
};
