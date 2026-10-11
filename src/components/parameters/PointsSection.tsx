import React from 'react';
import { TrayParams, TrayModel } from '../../types';
import { NumberStepper } from '../NumberStepper';
import { Translations, Language } from '../../core/i18n';
import { LAYER_COLORS } from '../../core/constants';
import { sanitizeN } from '../../core/model';

interface PointsSectionProps {
  params: TrayParams;
  t: Translations;
  lang: Language;
  onChange: (updated: Partial<TrayParams>) => void;
  handleCustomLayerPoints: (idx: number, val: number) => void;
  handleCustomLayerStepAngle: (idx: number, val: number) => void;
  handleCustomLayerOffset: (idx: number, val: number) => void;
}

export const PointsSection: React.FC<PointsSectionProps> = ({
  params, t, lang, onChange, handleCustomLayerPoints, handleCustomLayerStepAngle, handleCustomLayerOffset
}) => (
  <div className="px-5 pb-5 pt-1 flex flex-col gap-3.5 border-t border-[#f1f5f9]">
    <div className="flex bg-[#f1f5f9] p-1 rounded-xl border border-[#e2e8f0]">
      <button type="button" onClick={() => onChange({ mode: 'all' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer select-none ${params.mode === 'all' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
        {t.modeAll}
      </button>
      <button type="button" onClick={() => onChange({ mode: 'custom' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer select-none ${params.mode === 'custom' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
        {t.modeCustom}
      </button>
    </div>

    {params.mode === 'all' ? (
      <>
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
            <label htmlFor="basePts">{t.basePoints}</label>
            <span className="text-[11px] text-[#2563eb] font-semibold">
              {params.rawBase / 3} {t.pointsPerHead}
            </span>
          </div>
          <NumberStepper id="basePts" value={params.rawBase} min={3} max={120} step={3} onChange={(val) => onChange({ rawBase: sanitizeN(val) })} />
          <p className="text-[11px] text-[#64748b] mt-1 font-mono">
            {lang === 'ar' ? `خطوة دوران السيرفو للرأس الواحد = ${(360 / params.rawBase).toFixed(2)}°` : `Pas de rotation du servo par tête = ${(360 / params.rawBase).toFixed(2)}°`}
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
            <label htmlFor="addAngle">{t.offsetAngle}</label>
            <span className="text-[11px] text-[#64748b]">{params.addAngle}°</span>
          </div>
          <NumberStepper id="addAngle" value={params.addAngle} min={-90} max={90} step={0.5} unit="°" onChange={(val) => onChange({ addAngle: val })} />
          <p className="text-[11px] text-[#64748b] mt-1">
            {lang === 'ar' ? `الطبقة i تُزاح بمقدار i × ${params.addAngle}° لمنع اصطفاف الثقوب خطياً وتحقيق مظهر دوامي.` : `La couche i est décalée de i × ${params.addAngle}° pour éviter l'alignement radial et créer un motif régulier.`}
          </p>
        </div>
      </>
    ) : (
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 flex flex-col gap-3">
        <span className="text-xs font-semibold text-[#475569]">{t.customModeHeader}</span>
        <div className="flex flex-col gap-3 divide-y divide-[#e2e8f0]">
          {Array.from({ length: params.layers }).map((_, idx) => {
            const c = params.custom[idx] || { n: params.rawBase, off: idx * params.addAngle };
            const color = LAYER_COLORS[idx % LAYER_COLORS.length];
            return (
              <div key={idx} className="pt-2.5 first:pt-0 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5" style={{ color }}>
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                    {lang === 'ar' ? `الطبقة L${idx + 1}` : `Couche L${idx + 1}`}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748b]">
                    {t.customModeStepAngle} {(360 / c.n).toFixed(1)}°
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-[#64748b] block mb-1">{t.customModePoints} (n)</span>
                    <NumberStepper value={c.n} min={3} max={120} step={3} size="small" onChange={(val) => handleCustomLayerPoints(idx, val)} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b] block mb-1">{t.customModeStepAngle} (°)</span>
                    <NumberStepper value={Math.round((c.stepAngle || 360 / c.n) * 10) / 10} min={3} max={120} step={0.5} size="small" onChange={(val) => handleCustomLayerStepAngle(idx, val)} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b] block mb-1">{t.customModeOffset} (°)</span>
                    <NumberStepper value={c.off} min={-90} max={90} step={0.5} size="small" onChange={(val) => handleCustomLayerOffset(idx, val)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
