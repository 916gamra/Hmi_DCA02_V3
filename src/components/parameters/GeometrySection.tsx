import React from 'react';
import { Disc } from 'lucide-react';
import { TrayParams, TrayModel } from '../../types';
import { NumberStepper } from '../NumberStepper';
import { Translations, Language } from '../../core/i18n';

interface GeometrySectionProps {
  params: TrayParams;
  t: Translations;
  lang: Language;
  onChange: (updated: Partial<TrayParams>) => void;
  setTrayUnit: (unit: 'cm' | 'mm') => void;
  setMarginUnit: (unit: 'cm' | 'mm') => void;
  handleTrayDiameter: (val: number) => void;
  handleMargin: (val: number) => void;
  d1: number;
}

export const GeometrySection: React.FC<GeometrySectionProps> = ({
  params, t, lang, onChange, setTrayUnit, setMarginUnit, handleTrayDiameter, handleMargin, d1
}) => (
  <div className="px-5 pb-5 pt-1 flex flex-col gap-3.5 border-t border-[#f1f5f9]">
    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
        <label htmlFor="trayD">{t.trayDiameter}</label>
        <div className="flex bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]">
          <button type="button" onClick={() => setTrayUnit('cm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.trayU === 'cm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
            {lang === 'ar' ? 'سم' : 'cm'}
          </button>
          <button type="button" onClick={() => setTrayUnit('mm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.trayU === 'mm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
            {lang === 'ar' ? 'مم' : 'mm'}
          </button>
        </div>
      </div>
      <NumberStepper
        id="trayD"
        value={params.trayDDisplay}
        min={params.trayU === 'cm' ? 5 : 50}
        max={params.trayU === 'cm' ? 200 : 2000}
        step={params.trayU === 'cm' ? 0.5 : 5}
        unit={params.trayU}
        onChange={handleTrayDiameter}
      />
      <span className="text-[11px] text-[#64748b] block mt-1 font-mono">
        {lang === 'ar' ? `قطر الصينية الكلي = ${params.trayD} مم` : `Diamètre total = ${params.trayD} mm`}
      </span>
    </div>

    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
        <label htmlFor="toolD">{t.toolDiameter}</label>
        <span className="text-[11px] text-[#2563eb] font-bold font-mono">
          Ø {params.tool} {lang === 'ar' ? 'مم' : 'mm'}
        </span>
      </div>
      <NumberStepper
        id="toolD"
        value={params.tool}
        min={0.5}
        max={30}
        step={0.5}
        unit={lang === 'ar' ? 'مم' : 'mm'}
        onChange={(val) => onChange({ tool: Math.max(0.5, val) })}
      />
    </div>

    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1.5">
        <label htmlFor="margin">{t.margin}</label>
        <div className="flex bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]">
          <button type="button" onClick={() => setMarginUnit('cm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.marginU === 'cm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
            {lang === 'ar' ? 'سم' : 'cm'}
          </button>
          <button type="button" onClick={() => setMarginUnit('mm')} className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${params.marginU === 'mm' ? 'bg-white text-[#2563eb] shadow-xs' : 'text-[#64748b]'}`}>
            {lang === 'ar' ? 'مم' : 'mm'}
          </button>
        </div>
      </div>
      <NumberStepper
        id="margin"
        value={params.marginDisplay}
        min={0}
        max={params.marginU === 'cm' ? 20 : 200}
        step={params.marginU === 'cm' ? 0.2 : 2}
        unit={params.marginU}
        onChange={handleMargin}
      />
      <p className="text-[11px] text-[#64748b] mt-1 font-mono">
        {lang === 'ar'
          ? `قطر الطبقة الأولى D₁ = ${d1.toFixed(1)} مم (نصف القطر R₁ = ${(d1 / 2).toFixed(1)} مم)`
          : `Diamètre 1ère couche D₁ = ${d1.toFixed(1)} mm (Rayon R₁ = ${(d1 / 2).toFixed(1)} mm)`}
      </p>
    </div>
  </div>
);
