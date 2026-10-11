import React from 'react';
import { TrayParams } from '../../types';
import { NumberStepper } from '../NumberStepper';
import { Translations, Language } from '../../core/i18n';

interface TimingSectionProps {
  params: TrayParams;
  t: Translations;
  lang: Language;
  onChange: (updated: Partial<TrayParams>) => void;
}

export const TimingSection: React.FC<TimingSectionProps> = ({
  params, t, lang, onChange
}) => (
  <div className="px-5 pb-5 pt-1 flex flex-col gap-3.5 border-t border-[#f1f5f9]">
    <div>
      <div className="flex justify-between items-center text-xs font-semibold text-[#475569] mb-1">
        <label>{t.deflowerTime}</label>
        <span className="font-mono text-[#2563eb] text-[11px] font-bold">
          {(params.timing.dwell / 1000).toFixed(2)} S ({params.timing.dwell} ms)
        </span>
      </div>
      <NumberStepper
        value={params.timing.dwell}
        min={10}
        max={5000}
        step={10}
        unit="ms"
        size="small"
        onChange={(val) => onChange({ timing: { ...params.timing, dwell: Math.max(10, val) } })}
      />
    </div>

    <div className="grid grid-cols-2 gap-2.5">
      <div>
        <label className="block text-[11px] font-semibold text-[#475569] mb-1">{t.rotSpeed}</label>
        <NumberStepper
          value={params.rotationSpeedHz || 800}
          min={100}
          max={5000}
          step={50}
          unit="Hz"
          size="small"
          onChange={(val) => onChange({ rotationSpeedHz: Math.max(100, val) })}
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[#475569] mb-1">{t.expSpeed}</label>
        <NumberStepper
          value={params.expansionSpeedHz || 800}
          min={100}
          max={5000}
          step={50}
          unit="Hz"
          size="small"
          onChange={(val) => onChange({ expansionSpeedHz: Math.max(100, val) })}
        />
      </div>
    </div>

    <div>
      <label className="block text-[11px] font-semibold text-[#475569] mb-1">{t.layerTransferTime}</label>
      <NumberStepper
        value={params.timing.layer}
        min={50}
        max={15000}
        step={50}
        unit="ms"
        size="small"
        onChange={(val) => onChange({ timing: { ...params.timing, layer: Math.max(50, val) } })}
      />
    </div>

    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#f1f5f9]">
      <div>
        <label className="block text-[11px] font-semibold text-[#475569] mb-1">
          {lang === 'ar' ? 'استقرار التمدد الشعاعي' : 'Ramp expansion (settling)'}
        </label>
        <NumberStepper
          value={Math.round((params.timing.rampExpansionSec ?? 0.08) * 1000)}
          min={0}
          max={500}
          step={5}
          unit="ms"
          size="small"
          onChange={(val) => onChange({ timing: { ...params.timing, rampExpansionSec: Number((val / 1000).toFixed(3)) } })}
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-[#475569] mb-1">
          {lang === 'ar' ? 'استقرار تدوير الرأس' : 'Ramp rotation (settling)'}
        </label>
        <NumberStepper
          value={Math.round((params.timing.rampRotationSec ?? 0.035) * 1000)}
          min={0}
          max={300}
          step={5}
          unit="ms"
          size="small"
          onChange={(val) => onChange({ timing: { ...params.timing, rampRotationSec: Number((val / 1000).toFixed(3)) } })}
        />
      </div>
    </div>
    <p className="text-[11px] text-[#64748b]">{t.timingNote}</p>
  </div>
);
