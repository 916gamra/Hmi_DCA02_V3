import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewOptions, RecipePreset } from './types';
import { buildModel } from './core/model';
import { buildTimeline } from './core/timeline';
import { generatePlcJson, generateCsvPoints, downloadFile } from './core/recipe';
import { Header } from './components/Header';
import { ParametersPanel } from './components/ParametersPanel';
import { ManualModePage } from './components/ManualModePage';
import { ArticleRecipesPage } from './components/ArticleRecipesPage';
import { BottomNavBar, MainTab } from './components/BottomNavBar';
import { QrCodeModal } from './components/QrCodeModal';
import { QrScannerModal } from './components/QrScannerModal';
import { Toast } from './components/Toast';
import { AutomaticSimulatorSection } from './components/AutomaticSimulatorSection';
import { SaveArticleModal } from './components/SaveArticleModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Language, translations } from './core/i18n';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { useTrayParams, STORAGE_KEY } from './hooks/useTrayParams';
import { useSimulation } from './hooks/useSimulation';
import { usePresets } from './hooks/usePresets';
import { LayoutGrid } from 'lucide-react';

const LANG_STORAGE_KEY = 'hmi-tray-lang';

export default function App() {
  const deviceInfo = useDeviceDetection();

  // 1. Language State (AR & FR)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'fr' || savedLang === 'ar') return savedLang;
    } catch (e) {
      console.warn('Failed to read lang preference:', e);
    }
    return 'ar';
  });

  const t = translations[lang];

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save lang preference:', e);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  // 2. Navigation State (3 bottom tabs: auto | manual | article)
  const [mainTab, setMainTab] = useState<MainTab>(() => {
    try {
      const savedTab = localStorage.getItem('hmi-tray-tab');
      return (savedTab as MainTab) || 'auto';
    } catch (e) {
      return 'auto';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hmi-tray-tab', mainTab);
    } catch (e) {
      console.warn('Failed to save tab preference:', e);
    }
  }, [mainTab]);

  // 3. Toast Notifications State
  const [toast, setToast] = useState<{ message: string | null; type: 'success' | 'error' }>({
    message: null,
    type: 'success',
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null, type: 'success' });
    }, 2800);
  }, []);

  // 4. Custom Hook: Tray Parameters Management (with Versioned Storage)
  const {
    params,
    updateParams,
    resetDefaultParams,
    autoCalculateSpacing,
  } = useTrayParams();

  // 5. Computed Model & Timeline
  const model = useMemo(() => buildModel(params), [params]);
  const timeline = useMemo(
    () => buildTimeline(model, params.timing),
    [model, params.timing]
  );

  // 6. Custom Hook: Simulation Engine
  const {
    simTimeMs,
    setSimTimeMs,
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    simState,
    togglePlay,
    resetSim,
    scrubTime,
    stepNext,
    stepPrev,
  } = useSimulation({
    model,
    timeline,
    initialSpeed: params.speed || 1,
    onComplete: () => showToast(t.simStatusDone),
  });

  // 7. Custom Hook: Article Recipes & Presets Management
  const {
    customPresets,
    saveCustomPreset,
    deleteCustomPreset,
    exportPresets,
    importPresets,
  } = usePresets(params);

  // 8. View Options & Modals State
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    sectors: true,
    heads: false,
    rings: true,
    labels: true,
  });

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Handlers
  const handleUpdateParams = (updated: Partial<typeof params>) => {
    updateParams(updated);
    resetSim();
  };

  const handleAutoCalculateSpacing = () => {
    autoCalculateSpacing(
      (msg) => showToast(msg, 'success'),
      (err) => showToast(err, 'error'),
      lang
    );
  };

  const handleApplyPreset = (preset: RecipePreset) => {
    handleUpdateParams(preset.params);
    showToast(
      lang === 'ar' ? `تم تطبيق الوصفة: ${preset.name}` : `Recette appliquée : ${preset.name}`
    );
  };

  const handleResetDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    resetDefaultParams();
    resetSim();
    showToast(
      lang === 'ar'
        ? 'تمت استعادة الإعدادات المصنعية الافتراضية'
        : "Paramètres d'usine restaurés"
    );
  };

  const handleTogglePlay = () => {
    if (model.hasErr) {
      showToast(
        lang === 'ar'
          ? 'يرجى معالجة الأخطاء الهندسية والتداخل أولاً قبل التشغيل.'
          : 'Veuillez corriger les erreurs de collision avant le démarrage.',
        'error'
      );
      return;
    }
    togglePlay();
  };

  const handleSaveCustomPreset = (title: string, description: string) => {
    saveCustomPreset(title, description, lang);
    showToast(
      lang === 'ar' ? 'تم حفظ الوصفة / المقال بنجاح' : 'Article / Recette enregistré avec succès'
    );
  };

  const handleExportJson = () => {
    if (model.hasErr) {
      showToast(
        lang === 'ar'
          ? 'تعذر التصدير: يحتوي التصميم على أخطاء تداخل هندسية.'
          : 'Export impossible : collisions détectées.',
        'error'
      );
      return;
    }
    const jsonStr = generatePlcJson(params, model, timeline.total);
    downloadFile(
      `tray_recipe_D${params.trayD}mm_${model.totalPts}holes.json`,
      jsonStr,
      'application/json'
    );
    showToast(
      lang === 'ar'
        ? 'تم تصدير ملف TouchWin PLC JSON بنجاح'
        : 'Fichier TouchWin PLC JSON exporté avec succès'
    );
  };

  const handleExportCsv = () => {
    if (model.hasErr) {
      showToast(
        lang === 'ar'
          ? 'تعذر التصدير: يحتوي التصميم على أخطاء تداخل هندسية.'
          : 'Export impossible : collisions détectées.',
        'error'
      );
      return;
    }
    const csvStr = generateCsvPoints(model);
    downloadFile(`tray_points_D${params.trayD}mm.csv`, csvStr, 'text/csv;charset=utf-8');
    showToast(
      lang === 'ar'
        ? 'تم تصدير جدول نقاط الحفر CSV بنجاح'
        : 'Fichier des points CSV exporté avec succès'
    );
  };

  return (
    <div
      dir="ltr"
      className={`app-container bg-[#f1f4f9] text-[#0f172a] relative overflow-hidden select-none ${
        lang === 'ar' ? 'font-[var(--font-cairo)]' : 'font-[var(--font-sans)]'
      }`}
    >
      {/* 1. Header (Always LTR layout as requested, respecting mobile notch safe-area) */}
      <Header
        model={model}
        lang={lang}
        t={t}
        onToggleLang={toggleLanguage}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
        onResetDefault={handleResetDefault}
      />

      {/* 2. Main Executive Content Container (Scrolls independently within 100dvh) */}
      <main className="flex-1 overflow-y-auto overscroll-contain max-w-[1600px] w-full mx-auto p-3 sm:p-4 md:p-6 pb-6 transition-all">
        {/* TAB 1: AUTOMATIC GUIDE (المحاكي الآلي وتصميم الصينية) */}
        {mainTab === 'auto' && (
          <div className="flex flex-col gap-5 max-w-[1600px] w-full mx-auto">
            {/* Title Header Card */}
            <div className="oneui-card p-4 sm:p-6 bg-gradient-to-r from-white to-[#f8fafc] border border-[#e2e8f0]/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-[#2563eb] border border-blue-200 flex items-center justify-center shadow-xs shrink-0">
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#0f172a] truncate">
                    {t.autoTitle}
                  </h2>
                  <p className="text-xs text-[#64748b] truncate">{t.autoSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[410px_1fr] gap-4 md:gap-6 items-start">
              {/* Sidebar Column: Parameters */}
              <aside className="w-full">
                <ParametersPanel
                  params={params}
                  model={model}
                  t={t}
                  lang={lang}
                  onChange={handleUpdateParams}
                  onAutoCalculateSpacing={handleAutoCalculateSpacing}
                />
              </aside>

              {/* Main Stage Column: Canvas Stage + Controls + Validation KPIs */}
              <AutomaticSimulatorSection
                model={model}
                state={simState}
                options={viewOptions}
                onChangeOptions={setViewOptions}
                currentTimeMs={simTimeMs}
                totalTimeMs={timeline.total}
                isPlaying={isPlaying}
                speed={speed}
                onTogglePlay={handleTogglePlay}
                onReset={resetSim}
                onStepNext={stepNext}
                onStepPrev={stepPrev}
                onScrubTime={scrubTime}
                onChangeSpeed={(spd) => {
                  setSpeed(spd);
                  handleUpdateParams({ speed: spd });
                }}
                onOpenSaveModal={() => setIsSaveModalOpen(true)}
                onOpenQr={() => setIsQrOpen(true)}
                params={params}
                totalCycleTimeMs={timeline.total}
                t={t}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL MODE (التحكم اليدوي ومحاكاة محاور الآلة) */}
        {mainTab === 'manual' && (
          <ManualModePage
            params={params}
            model={model}
            t={t}
            lang={lang}
            onChangeParams={handleUpdateParams}
            onShowToast={showToast}
          />
        )}

        {/* TAB 3: ARTICLE & RECIPES (قائمة الوصفات وشاشات الآلة TouchWin) */}
        {mainTab === 'article' && (
          <ArticleRecipesPage
            params={params}
            model={model}
            t={t}
            lang={lang}
            onApplyPreset={handleApplyPreset}
            onDeletePreset={deleteCustomPreset}
            onExportPresets={exportPresets}
            onImportPresets={(e) =>
              importPresets(
                e,
                (count) =>
                  showToast(
                    lang === 'ar'
                      ? `تم استيراد ${count} وصفة بنجاح`
                      : `${count} recettes importées avec succès`
                  ),
                (err) => showToast(err, 'error')
              )
            }
            onOpenQr={() => setIsQrOpen(true)}
            customPresets={customPresets}
          />
        )}
      </main>

      {/* 3. Docked Floating Bottom Navigation Bar (3 Tabs: Automatic Guide, Manual, Article) */}
      <BottomNavBar currentTab={mainTab} onChangeTab={setMainTab} t={t} />

      {/* 4. Modals & Notifications */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        params={params}
        model={model}
        totalCycleTimeMs={timeline.total}
      />

      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onApplyRecipe={(scannedParams) => {
          handleUpdateParams(scannedParams);
          showToast(
            lang === 'ar'
              ? 'تم تطبيق معاملات الوصفة من رمز QR بنجاح'
              : 'Paramètres appliqués depuis le code QR avec succès'
          );
        }}
        t={t}
        lang={lang}
      />

      <SaveArticleModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveCustomPreset}
        t={t}
        lang={lang}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'success' })}
      />

      {/* Offline Connectivity Status Indicator */}
      <OfflineIndicator lang={lang} />
    </div>
  );
}
