import { TrayModel, SimulationState, ViewOptions, Point } from '../types';
import { DEG, HEADS, LAYER_COLORS } from './constants';
import { fmt } from './model';

export interface ViewportTransform {
  sc: number;
  cx: number;
  cy: number;
}

export function computeViewport(
  w: number,
  h: number,
  modelR: number,
  zoom: number,
  px: number,
  py: number
): ViewportTransform {
  const base = (Math.min(w, h) / 2 - 80) / Math.max(modelR, 1);
  const sc = base * zoom;
  return {
    sc,
    cx: w / 2 + px,
    cy: h / 2 + py,
  };
}

export function renderCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  model: TrayModel,
  state: SimulationState | null,
  options: ViewOptions,
  zoom: number,
  px: number,
  py: number,
  hoverPoint: Point | null
) {
  if (!w || !h || !model) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.direction = 'ltr';

  const { sc, cx, cy } = computeViewport(w, h, model.R, zoom, px, py);
  const R = model.R;
  const Rp = R * sc;
  const theta = state ? state.theta : 0;

  // Coordinate transform taking tray rotation into account
  const transformPoint = (x: number, y: number, thDeg: number): [number, number] => {
    const c = Math.cos(thDeg * DEG);
    const s = Math.sin(thDeg * DEG);
    return [cx + (x * c - y * s) * sc, cy + (x * s + y * c) * sc];
  };

  // 1. Stage background - Clean Samsung One UI 8 Light porcelain workbench
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.85);
  bg.addColorStop(0, '#f8fafc');
  bg.addColorStop(1, '#eef2f6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // 2. Light engineering grid lines
  const gridSteps = [2, 5, 10, 20, 50, 100, 200, 500];
  const gs = gridSteps.find((g) => g * sc >= 28) || 200;

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
  ctx.beginPath();
  for (let wx = Math.ceil(-cx / sc / gs) * gs; wx * sc + cx <= w; wx += gs) {
    const X = Math.round(wx * sc + cx) + 0.5;
    ctx.moveTo(X, 0);
    ctx.lineTo(X, h);
  }
  for (let wy = Math.ceil(-cy / sc / gs) * gs; wy * sc + cy <= h; wy += gs) {
    const Y = Math.round(wy * sc + cy) + 0.5;
    ctx.moveTo(0, Y);
    ctx.lineTo(w, Y);
  }
  ctx.stroke();

  // Subtle center axes
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Tray disk with One UI 8 elegant metallic bevel and drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, Rp, 0, Math.PI * 2);
  const trayGrad = ctx.createRadialGradient(cx - Rp * 0.2, cy - Rp * 0.2, Rp * 0.1, cx, cy, Rp);
  trayGrad.addColorStop(0, '#ffffff');
  trayGrad.addColorStop(0.7, '#f8fafc');
  trayGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = trayGrad;
  ctx.fill();
  ctx.restore();

  // Tray brushed rim boundary
  ctx.save();
  ctx.lineWidth = Math.max(2.5, 3 * sc * 0.08);
  ctx.strokeStyle = '#cbd5e1';
  ctx.stroke();

  // Inner border highlight
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#2563eb';
  ctx.stroke();
  ctx.restore();

  // 4. Head sectors (0°, 120°, 240°)
  if (options.sectors) {
    HEADS.forEach((hConfig) => {
      const a0 = (hConfig.angle + theta) * DEG;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, Rp, a0, a0 + 120 * DEG);
      ctx.closePath();
      ctx.fillStyle = hConfig.color + '12';
      ctx.fill();
      ctx.strokeStyle = hConfig.color + '44';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  // 5. Angular degree ticks around the rim
  ctx.lineWidth = 1;
  for (let d = 0; d < 360; d += 10) {
    const isMajor = d % 30 === 0;
    const a = (d + theta) * DEG;
    const len = isMajor ? 10 : 5;
    ctx.strokeStyle = isMajor ? 'rgba(71, 85, 105, 0.7)' : 'rgba(148, 163, 184, 0.45)';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * Rp, cy + Math.sin(a) * Rp);
    ctx.lineTo(cx + Math.cos(a) * (Rp - len), cy + Math.sin(a) * (Rp - len));
    ctx.stroke();

    if (options.labels && isMajor && Rp > 85) {
      ctx.fillStyle = 'rgba(71, 85, 105, 0.85)';
      ctx.font = '500 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${d}°`, cx + Math.cos(a) * (Rp - 22), cy + Math.sin(a) * (Rp - 22));
    }
  }

  // 6. Concentric Layer Rings
  if (options.rings) {
    model.layers.forEach((L) => {
      if (L.r <= 0) return;
      ctx.beginPath();
      ctx.arc(cx, cy, L.r * sc, 0, Math.PI * 2);
      const col = LAYER_COLORS[L.i % LAYER_COLORS.length];
      ctx.strokeStyle = col + '55';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  // 7. Drilled Hole Points
  const rp = Math.max(model.toolR * sc, 2.5);
  const firing =
    state && state.cur && state.cur.type === 'fire' && !state.done ? state.cur : null;

  model.layers.forEach((L) => {
    const layerColor = LAYER_COLORS[L.i % LAYER_COLORS.length];

    for (const q of L.pts) {
      const [x, y] = transformPoint(q.x, q.y, theta);
      if (x < -30 || y < -30 || x > w + 30 || y > h + 30) continue;

      const isDrilled = !state || q.j < state.counts[L.i];
      const col = options.heads ? HEADS[q.head].color : layerColor;

      ctx.beginPath();
      ctx.arc(x, y, rp, 0, Math.PI * 2);

      if (isDrilled) {
        // Drilled hole: smooth metallic dark countersink
        const holeGrad = ctx.createRadialGradient(x - rp * 0.2, y - rp * 0.2, rp * 0.1, x, y, rp);
        holeGrad.addColorStop(0, '#1e293b');
        holeGrad.addColorStop(0.85, '#0f172a');
        holeGrad.addColorStop(1, '#334155');
        ctx.fillStyle = holeGrad;
        ctx.fill();

        // Rim chamfer
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = col;
        ctx.stroke();
      } else {
        // Pending point: clean dashed circle
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = col + '77';
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();
      }

      // Overlap / collision indicator
      if (q.bad) {
        ctx.beginPath();
        ctx.arc(x, y, rp + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // Active drilling plunge animation
      if (firing && firing.layer === L.i && q.j === firing.j && state) {
        const pulse = state.u;
        ctx.beginPath();
        ctx.arc(x, y, rp + 2 + 6 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - pulse * 0.6).toFixed(2)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Hover ring
      if (hoverPoint && hoverPoint.layer === q.layer && hoverPoint.k === q.k) {
        ctx.beginPath();
        ctx.arc(x, y, rp + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Point index label if zoomed in sufficiently
      if (options.labels && rp >= 8.5) {
        ctx.fillStyle = isDrilled ? '#ffffff' : '#1e293b';
        ctx.font = `600 ${Math.min(rp * 1.05, 12)}px JetBrains Mono, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(q.k + 1), x, y + 0.5);
      }
    }
  });

  // 8. Machine Center Spindle
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#2563eb';
  ctx.fill();
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();

  // 9. Three Synchronized Machine Drill Heads (T1 @ 0°, T2 @ 120°, T3 @ 240°)
  const outerSpindleR = Rp + 26;

  HEADS.forEach((hConfig) => {
    const a = hConfig.angle * DEG;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const nx = -uy;
    const ny = ux;

    if (state) {
      const currentRadius = state.headR * sc;

      // Guide rail
      ctx.strokeStyle = hConfig.color;
      ctx.lineWidth = 2.8;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(cx + ux * outerSpindleR, cy + uy * outerSpindleR);
      ctx.lineTo(cx + ux * currentRadius, cy + uy * currentRadius);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Active Drill Toolhead Chuck
      const toolX = cx + ux * currentRadius;
      const toolY = cy + uy * currentRadius;
      const toolRadius = Math.max(model.toolR * sc, 4);

      ctx.beginPath();
      ctx.arc(toolX, toolY, toolRadius, 0, Math.PI * 2);
      ctx.fillStyle = hConfig.color + '44';
      ctx.fill();
      ctx.strokeStyle = hConfig.color;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Tool reticle
      ctx.beginPath();
      ctx.moveTo(toolX - toolRadius - 4, toolY);
      ctx.lineTo(toolX + toolRadius + 4, toolY);
      ctx.moveTo(toolX, toolY - toolRadius - 4);
      ctx.lineTo(toolX, toolY + toolRadius + 4);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Plunge spark flash
      if (firing) {
        const glowGrad = ctx.createRadialGradient(
          toolX,
          toolY,
          0,
          toolX,
          toolY,
          toolRadius * 3 + 8
        );
        const sparkIntensity = state ? (0.8 * (1 - state.u)).toFixed(2) : '0';
        glowGrad.addColorStop(0, `rgba(37, 99, 235, ${sparkIntensity})`);
        glowGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
        ctx.beginPath();
        ctx.arc(toolX, toolY, toolRadius * 3 + 8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }
    }

    // Outer Head Housing Pointer & Tag
    ctx.beginPath();
    ctx.moveTo(cx + ux * outerSpindleR, cy + uy * outerSpindleR);
    ctx.lineTo(cx + ux * (outerSpindleR + 14) + nx * 7, cy + uy * (outerSpindleR + 14) + ny * 7);
    ctx.lineTo(cx + ux * (outerSpindleR + 14) - nx * 7, cy + uy * (outerSpindleR + 14) - ny * 7);
    ctx.closePath();
    ctx.fillStyle = hConfig.color;
    ctx.fill();

    // Head Badge Label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${hConfig.id} · ${hConfig.angle}°`, cx + ux * (outerSpindleR + 32), cy + uy * (outerSpindleR + 32));
  });

  // 10. Measurement scale bar in bottom-left
  const niceScaleMm = [1, 2, 5, 10, 20, 50, 100, 200, 500].find((v) => v * sc >= 65) || 200;
  const barPx = niceScaleMm * sc;
  const bx = 18;
  const by = h - 20;

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx, by - 5);
  ctx.lineTo(bx, by);
  ctx.lineTo(bx + barPx, by);
  ctx.lineTo(bx + barPx, by - 5);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.font = '600 11px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${niceScaleMm} مم`, bx, by - 6);

  // 11. HUD status overlay (Zoom & Tray Rotation)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(71, 85, 105, 0.9)';
  ctx.font = '600 11px JetBrains Mono, monospace';
  ctx.fillText(`ZOOM ${Math.round(zoom * 100)}%`, 18, 16);
  if (state) {
    ctx.fillText(`ROT ${fmt(-theta, 1)}°`, 18, 34);
  }
}
