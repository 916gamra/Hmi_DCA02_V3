import React from 'react';
import { QrCode, FileCode, FileText, X, Download, Upload } from 'lucide-react';
import { Translations, Language, translations } from '../core/i18n';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'qr' | 'json' | 'csv') => void;
  mode: 'export' | 'import';
  t?: Translations;
  lang?: Language;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  mode,
  t: propT,
  lang = 'ar',
}) => {
  const t = propT || translations[lang];

  if (!isOpen) return null;

  const options = [
    { id: 'qr', label: lang === 'ar' ? 'رمز QR' : 'Code QR', icon: QrCode, color: 'text-blue-600' },
    { id: 'json', label: 'JSON', icon: FileCode, color: 'text-indigo-600' },
    { id: 'csv', label: 'CSV', icon: FileText, color: 'text-emerald-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 select-none" dir="ltr">
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-2xl max-w-sm w-full overflow-hidden p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
          <h3 className="text-sm font-bold text-[#0f172a]">
            {mode === 'export' 
              ? (lang === 'ar' ? 'اختر نوع التصدير' : 'Choisir le format d\'export')
              : (lang === 'ar' ? 'اختر نوع الاستيراد' : 'Choisir le format d\'import')}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl hover:bg-[#f1f5f9] text-[#94a3b8] transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onSelect(opt.id as 'qr' | 'json' | 'csv');
                onClose();
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] transition-all"
            >
              <opt.icon className={`w-6 h-6 ${opt.color}`} />
              <span className="text-sm font-bold text-[#0f172a]">{opt.label}</span>
              {mode === 'export' ? <Download className="w-4 h-4 ml-auto text-gray-400" /> : <Upload className="w-4 h-4 ml-auto text-gray-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
