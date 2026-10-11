import React, { useState } from 'react';
import { BookOpen, Layers, Check, CheckCircle2, Bookmark, Trash2, Download, Upload } from 'lucide-react';
import { PRESETS } from '../core/constants';
import { TrayParams, TrayModel, RecipePreset } from '../types';
import { TouchWinScreenMirror } from './TouchWinScreenMirror';
import { ConfirmModal } from './ConfirmModal';
import { ExportFormatModal } from './ExportFormatModal';
import { Translations, Language } from '../core/i18n';
import { downloadFile } from '../core/recipe';

interface ArticleRecipesPageProps {
  params: TrayParams;
  model: TrayModel;
  t: Translations;
  lang?: Language;
  onApplyPreset: (preset: RecipePreset) => void;
  onDeletePreset: (presetId: string) => void;
  onExportPresets?: () => void;
  onImportPresets?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenImportModal: () => void;
  onOpenQr: () => void;
  customPresets?: RecipePreset[];
}

export const ArticleRecipesPage: React.FC<ArticleRecipesPageProps> = ({
  params,
  model,
  t,
  lang = 'ar',
  onApplyPreset,
  onDeletePreset,
  onExportPresets,
  onImportPresets,
  onOpenImportModal,
  onOpenQr,
  customPresets = [],
}) => {
  const allPresets = [...customPresets, ...PRESETS];

  // Find which preset matches current machine params (if any)
  const initialMatchingPreset = allPresets.find(
    (p) =>
      p.params.trayD === params.trayD &&
      p.params.layers === params.layers &&
      p.params.spacing === params.spacing
  );

  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    initialMatchingPreset ? initialMatchingPreset.id : 'touchwin-actual-machine'
  );

  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
  const [presetToExport, setPresetToExport] = useState<RecipePreset | null>(null);

  const handleSelectAndApply = (preset: RecipePreset) => {
    setSelectedPresetId(preset.id);
    onApplyPreset(preset);
  };

  const handleExportSinglePreset = (preset: RecipePreset, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresetToExport(preset);
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-5xl mx-auto w-full select-none" dir="ltr">
      <ConfirmModal
        isOpen={!!presetToDelete}
        onClose={() => setPresetToDelete(null)}
        onConfirm={() => {
          if (presetToDelete) onDeletePreset(presetToDelete);
          setPresetToDelete(null);
        }}
        title={lang === 'ar' ? 'تأكيد الحذف' : 'Confirmer la suppression'}
        message={lang === 'ar' ? 'هل أنت متأكد من حذف هذا القالب؟ لا يمكن التراجع عن هذا الإجراء.' : 'Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.'}
        t={t}
        lang={lang}
      />
      <ExportFormatModal
        isOpen={!!presetToExport}
        onClose={() => setPresetToExport(null)}
        preset={presetToExport}
        t={t}
        lang={lang}
      />
      {/* 1. Executive Title Header Card */}
      <div className="oneui-card p-4 sm:p-6 bg-gradient-to-r from-white to-[#f8fafc] border border-[#e2e8f0]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#0f172a] truncate">
                {t.articleTitle}
              </h2>
              <p className="text-xs text-[#64748b] truncate">
                {t.articleSubtitle}
              </p>
            </div>
          </div>
          
          {/* Header Action: Open Import Choice Modal */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'استيراد قالب من ذاكرة الهاتف' : 'Importer depuis le téléphone'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Preset Catalogue Selector with High-Visibility Active Selection */}
      <div className="oneui-card p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2563eb]" />
            <h3 className="text-sm font-bold text-[#0f172a]">{t.presetsTitle}</h3>
          </div>
          <span className="text-xs font-mono text-[#64748b] bg-[#f1f5f9] px-2.5 py-1 rounded-full border border-[#e2e8f0]">
            {allPresets.length} {lang === 'ar' ? 'وصفات ومقالات متاحة' : 'articles disponibles'}
          </span>
        </div>

        {/* Responsive Grid with selectable cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {allPresets.map((preset) => {
            const isMatch =
              preset.params.trayD === params.trayD &&
              preset.params.layers === params.layers &&
              preset.params.spacing === params.spacing;
            const isSelected = selectedPresetId === preset.id || isMatch;

            const name = lang === 'ar' ? preset.name : preset.nameFr || preset.name;
            const description =
              lang === 'ar' ? preset.description : preset.descriptionFr || preset.description;
            const tag = lang === 'ar' ? preset.tag : preset.tagFr || preset.tag;

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectAndApply(preset)}
                className={`p-4 rounded-2xl transition-all flex flex-col justify-between gap-3 cursor-pointer relative ${
                  isSelected
                    ? 'border-2 border-[#2563eb] bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 shadow-md ring-2 ring-[#2563eb]/20'
                    : 'border border-[#e2e8f0] bg-white hover:border-[#2563eb]/60 hover:bg-[#f8fafc] hover:shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Bar inside card: Tag & Active Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        isSelected
                          ? 'bg-[#2563eb] text-white border-[#2563eb]'
                          : 'bg-blue-50 text-[#2563eb] border-blue-200'
                      }`}
                    >
                      {tag}
                    </span>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{lang === 'ar' ? 'النشطة حالياً' : 'Active'}</span>
                      </span>
                    )}
                  </div>

                  {/* Card Title */}
                  <h4
                    className={`text-xs sm:text-sm font-bold mb-1 transition-colors ${
                      isSelected ? 'text-[#1d4ed8]' : 'text-[#0f172a]'
                    }`}
                  >
                    {name}
                  </h4>

                  {/* Card Description */}
                  <p className="text-[11px] text-[#64748b] leading-relaxed line-clamp-3">
                    {description}
                  </p>
                </div>

                {/* Card Footer: Parameters Overview & Action Button */}
                <div className="pt-2.5 border-t border-[#f1f5f9] flex flex-col gap-2">
                  <div className="text-[10px] font-mono font-semibold text-[#475569] flex flex-wrap items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
                    <span>Ø {preset.params.trayD}mm</span>
                    <span className="text-[#94a3b8]">•</span>
                    <span>
                      {preset.params.layers} {lang === 'ar' ? 'طبقات' : 'couches'}
                    </span>
                    <span className="text-[#94a3b8]">•</span>
                    <span>ΔD {preset.params.spacing}mm</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Export Single Preset Button */}
                    <button
                      type="button"
                      onClick={(e) => handleExportSinglePreset(preset, e)}
                      className="py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-[#2563eb] border border-blue-200 active:scale-95 shadow-2xs"
                      title={lang === 'ar' ? 'تصدير هذا القالب فقط كملف JSON' : 'Exporter ce modèle (JSON)'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Custom Preset Button */}
                    {preset.id.startsWith('custom-') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPresetToDelete(preset.id);
                        }}
                        className="py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 active:scale-95 shadow-2xs"
                        title={lang === 'ar' ? 'حذف القالب' : 'Supprimer'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Select and Apply Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndApply(preset);
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 active:scale-98 ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-[#f1f5f9] hover:bg-[#2563eb] hover:text-white text-[#1e293b] border border-[#cbd5e1]/70'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{lang === 'ar' ? 'مطبقة حالياً' : 'Appliquée'}</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'اختيار وتطبيق' : 'Sélectionner'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Complete TouchWin Machine Screen Mirror & Article Sheet */}
      <TouchWinScreenMirror
        model={model}
        params={params}
        lang={lang}
        t={t}
        onChangeParams={() => {}}
        onOpenQr={onOpenQr}
        onApplyPreset={() => {
          const actualPreset = PRESETS.find((p) => p.id === 'touchwin-actual-machine');
          if (actualPreset) handleSelectAndApply(actualPreset);
        }}
      />
    </div>
  );
};
