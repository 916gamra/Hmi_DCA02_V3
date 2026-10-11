import React from 'react';
import { Sliders, Calculator } from 'lucide-react';
import { TrayParams, TrayModel } from '../../types';
import { NumberStepper } from '../NumberStepper';
import { Translations, Language } from '../../core/i18n';

interface LayersSectionProps {
  params: TrayParams;
  model: TrayModel;
  t: Translations;
  lang: Language;
  onChange: (updated: Partial<TrayParams>) => void;
  setSpacingUnit: (unit: 'cm' | 'mm') => void;
  setRLastUnit: (unit: 'cm' | 'mm') => void;
  handleSpacing: (val: number) => void;
  handleRLast: (val: number) => void;
  onAutoCalculateSpacing: () => void;
  d1: number;
  radialMovement: number;
  isSpacingSafe: boolean;
}

export const LayersSection: React.FC<LayersSectionProps> = ({
  params, model, t, lang, onChange, setSpacingUnit, setRLastUnit, handleSpacing, handleRLast, onAutoCalculateSpacing, d1, radialMovement, isSpacingSafe
}) => (
  <div className="px-5 pb-5 pt-1 flex flex-col gap-3.5 border-t border-[#f1f5f9]">
    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
        <label htmlFor="layers">{t.layersCount}</label>
        <span className="text-[11px] text-[#2563eb] font-bold">
          {params.layers} {lang === 'ar' ? 'من 7' : '/ 7'}
        </span>
      </div>
      <NumberStepper
        id="layers"
        value={params.layers}
        min={1}
        max={7}
        step={1}
        onChange={(val) => onChange({ layers: Math.min(7, Math.max(1, Math.round(val))) })}
      />
    </div>

    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
        <label htmlFor="spacing">{t.spacing}</label>
        <div className="flex bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]">
          <button type="button" onClick={() => setSpacingUnit('cm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.spacingU === 'cm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
            {lang === 'ar' ? 'سم' : 'cm'}
          </button>
          <button type="button" onClick={() => setSpacingUnit('mm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.spacingU === 'mm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
            {lang === 'ar' ? 'مم' : 'mm'}
          </button>
        </div>
      </div>
      <NumberStepper
        id="spacing"
        value={params.spacingDisplay}
        min={params.spacingU === 'cm' ? 0.1 : 1}
        max={params.spacingU === 'cm' ? 30 : 300}
        step={params.spacingU === 'cm' ? 0.1 : 1}
        unit={params.spacingU}
        onChange={handleSpacing}
      />
      <span className="text-[11px] text-[#2563eb] font-semibold font-mono block mt-1">
        ΔD = {params.spacing} {lang === 'ar' ? 'مم' : 'mm'}
      </span>
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-2.5 mt-2 space-y-1 text-[11px]">
        <div className="flex justify-between text-[#0f172a]">
          <span>{t.spacingLaw}</span>
          <span className="font-mono font-bold">
            {lang === 'ar' ? `D_التالية = D_السابقة − ${params.spacing} مم` : `D_suiv = D_préc − ${params.spacing} mm`}
          </span>
        </div>
        <div className="flex justify-between text-[#475569]">
          <span>{t.servoRadialCourse}</span>
          <span className="font-mono font-bold text-[#059669]">
            {radialMovement.toFixed(1)} {lang === 'ar' ? 'مم' : 'mm'} ({params.spacing} ÷ 2)
          </span>
        </div>
        {!isSpacingSafe && (
          <p className="text-red-600 font-semibold text-[10px] pt-1 border-t border-red-100">
            {lang === 'ar' ? `⚠ تحذير: حركة الرأس الشعاعية (${radialMovement.toFixed(1)} مم) أقل من قطر الأداة (${params.tool} مم) — يحدث تداخل!` : `⚠ Attention : Course radiale (${radialMovement.toFixed(1)} mm) < diamètre outil (${params.tool} mm) — collision !`}
          </p>
        )}
      </div>
    </div>

    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
        <label htmlFor="rLast">{t.lastLayerD}</label>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]">
            <button type="button" onClick={() => setRLastUnit('cm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.rLastU === 'cm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
              {lang === 'ar' ? 'سم' : 'cm'}
            </button>
            <button type="button" onClick={() => setRLastUnit('mm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.rLastU === 'mm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
              {lang === 'ar' ? 'مم' : 'mm'}
            </button>
          </div>
          <button type="button" onClick={onAutoCalculateSpacing} className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer select-none active:scale-95">
            <Calculator className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'ar' ? '⚙ احسب التباعد تلقائياً' : '⚙ Auto'}</span>
          </button>
        </div>
      </div>
      <NumberStepper
        id="rLast"
        value={params.rLastDisplay}
        min={0}
        max={params.rLastU === 'cm' ? Math.max(1, d1 / 10 - 0.1) : Math.max(10, d1 - 1)}
        step={params.rLastU === 'cm' ? 0.5 : 1}
        unit={params.rLastU}
        onChange={handleRLast}
      />
      <div className="mt-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 text-xs flex flex-col gap-2">
        <div className="flex items-center justify-between font-bold text-[#1e40af] text-[11px] border-b border-blue-200/60 pb-1.5">
          <span>{t.mathDocTitle}</span>
          <span className="font-mono">{params.layers} {lang === 'ar' ? 'طبقات' : 'couches'}</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-[#1e3a8a] leading-relaxed">
          <p>
            <strong>{t.mathDocMarginTitle}</strong> {t.mathDocMarginDesc}
            <br />
            <span className="font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
              D₁ = {params.trayD} − {params.margin} = {d1.toFixed(1)} {lang === 'ar' ? 'مم' : 'mm'}
            </span>
            <span className="text-[10px] text-[#475569] block mt-0.5">{t.mathDocMarginNote}</span>
          </p>
          <p>
            <strong>{t.mathDocUniformSpacing}</strong>{' '}
            {lang === 'ar' ? 'يقسم المسافة بين محيط أول طبقة ومحيط آخر طبقة بالتساوي:' : 'Divise uniformément la distance entre le premier et le dernier diamètre :'}
            <br />
            <span className="font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
              ΔD = (D₁ − D_fin) ÷ ({params.layers} − 1)
            </span>
          </p>
          <p>
            <strong>{t.mathDocServoMove}</strong>
            <br />
            {t.mathDocServoMoveDesc}
            <strong className="font-mono text-[#059669] mr-1">
              {(params.spacing / 2).toFixed(1)} {lang === 'ar' ? 'مم' : 'mm'}
            </strong>
            {params.spacing / 2 < params.tool && (
              <span className="text-red-600 font-bold block mt-0.5">
                {lang === 'ar' ? `⚠ خطر: المسافة أقل من قطر الأداة (${params.tool} مم) — يحدث تداخل!` : `⚠ Danger : Course inférieure au diamètre outil (${params.tool} mm) — collision !`}
              </span>
            )}
          </p>
        </div>
        <div className="pt-2 border-t border-blue-200/60">
          <span className="text-[10px] font-bold text-[#1e40af] block mb-1.5">{t.layerDistributionTitle}</span>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: params.layers }).map((_, idx) => {
              const layerD = d1 - idx * params.spacing;
              const isLast = idx === params.layers - 1;
              return (
                <div key={idx} className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border ${isLast ? 'bg-amber-100/80 border-amber-300 text-amber-900' : idx === 0 ? 'bg-blue-100/80 border-blue-300 text-blue-900' : 'bg-white border-blue-200 text-[#0f172a]'}`}>
                  L{idx + 1}: {layerD.toFixed(1)} {lang === 'ar' ? 'مم' : 'mm'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);
