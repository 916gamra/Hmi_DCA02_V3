import React from 'react';
import { X, Layers, Check, ArrowRight } from 'lucide-react';
import { PRESETS } from '../core/constants';
import { TrayParams, RecipePreset } from '../types';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: RecipePreset) => void;
  currentParams: TrayParams;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-2xl max-w-xl w-full overflow-hidden p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">
                قوالب وتصاميم صواني الشاي الجاهزة
              </h3>
              <p className="text-[11px] text-[#64748b]">
                اختر قالباً صناعياً مُعد مسبقاً ومختبر على آلات الحفر
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto py-1">
          {PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group p-4 rounded-2xl bg-[#f8fafc] hover:bg-blue-50/60 border border-[#e2e8f0] hover:border-[#2563eb]/40 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2563eb] border border-[#e2e8f0]">
                    {preset.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#64748b]">
                    Ø {preset.params.trayDDisplay} {preset.params.trayU}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                  {preset.name}
                </h4>
                <p className="text-xs text-[#64748b] leading-relaxed mt-1">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]/60 text-xs font-bold text-[#2563eb]">
                <span>تطبيق القالب</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-[-2px] transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
