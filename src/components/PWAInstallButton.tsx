import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../core/i18n';

interface PWAInstallButtonProps {
  lang?: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang = 'ar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (isInstalled || installSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs shrink-0 select-none">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>{lang === 'ar' ? 'التطبيق مثبت' : 'Installé'}</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        title={lang === 'ar' ? 'تثبيت تطبيق TRIVIUM120° على الهاتف (PWA)' : 'Installer l\'application TRIVIUM120° (PWA)'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{lang === 'ar' ? 'تثبيت التطبيق' : 'Installer'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-2xl max-w-sm w-full overflow-hidden p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-200 max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">
                    {lang === 'ar' ? 'تثبيت TRIVIUM120° كنسخة PWA' : 'Installer TRIVIUM120° PWA'}
                  </h3>
                  <p className="text-[10px] text-[#64748b]">
                    {lang === 'ar' ? 'تشغيل التطبيق كبرنامج مستقل على هاتفك' : 'Mode application autonome'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-xl hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto space-y-3 text-xs text-slate-700 leading-relaxed">
              {isIOS ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 space-y-0.5">
                    <p className="font-semibold">
                      {lang === 'ar' ? '1. اضغط زر المشاركة (Share ⎋)' : '1. Bouton Partager (⎋)'}
                    </p>
                    <p className="text-[11px] text-blue-700">
                      {lang === 'ar' ? 'في شريط متصفح Safari أسفل الشاشة.' : 'Dans la barre du navigateur Safari.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-0.5">
                    <p className="font-semibold">
                      {lang === 'ar' ? '2. اختر "إضافة إلى الشاشة الرئيسية"' : '2. "Sur l\'écran d\'accueil" (⊞)'}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {lang === 'ar' ? 'مرر للأسفل في القائمة وحدد الخيار.' : 'Faites défiler vers le bas et sélectionnez.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 space-y-0.5">
                    <p className="font-semibold">
                      {lang === 'ar' ? '1. اضغط على قائمة المتصفح (النقاط الثلاث ⁝)' : '1. Menu du navigateur (3 points ⁝)'}
                    </p>
                    <p className="text-[11px] text-blue-700">
                      {lang === 'ar' ? 'الموجودة في أعلى متصفح هاتفك.' : 'Situé en haut à droite du navigateur.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-0.5">
                    <p className="font-semibold">
                      {lang === 'ar' ? '2. اختر "تثبيت التطبيق" (Install App)' : '2. "Installer l\'application"'}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {lang === 'ar' ? 'أو "إضافة إلى الشاشة الرئيسية".' : 'Ou "Ajouter à l\'écran d\'accueil".'}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold block mb-0.5">
                    {lang === 'ar' ? 'تجربة أداء كاملة (100% Offline)' : 'Mode Hors-Ligne (100% Offline)'}
                  </span>
                  {lang === 'ar'
                    ? 'سيعمل التطبيق كبرنامج CNC مستقل على هاتفك بكامل الميزات دون الحاجة لإنترنت.'
                    : 'L\'application fonctionnera en mode autonome complet sans connexion Internet.'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="w-full py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-sm transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'حسناً، فهمت' : 'D\'accord'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
