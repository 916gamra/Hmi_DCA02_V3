import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../core/i18n';

interface PWAInstallButtonProps {
  lang?: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang = 'ar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or running standalone, do not show button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        title={lang === 'ar' ? 'تثبيت التطبيق على الجهاز (PWA)' : 'Installer l\'application (PWA)'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{lang === 'ar' ? 'تثبيت التطبيق' : 'Installer'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#1e293b] bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#cbd5e1] rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>{lang === 'ar' ? 'تثبيت iOS' : 'Installer iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === 'ar' ? 'التثبيت على iPhone / iPad' : 'Installer sur iPhone / iPad'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  {lang === 'ar'
                    ? '1. اضغط على زر المشاركة (Share ⎋) في شريط Safari أسفل الشاشة.'
                    : '1. Appuyez sur le bouton Partager (⎋) dans la barre Safari.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? '2. مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen ⊞).'
                    : '2. Faites défiler et choisissez "Sur l\'écran d\'accueil" (⊞).'}
                </p>
                <p>
                  {lang === 'ar'
                    ? '3. سيعمل التطبيق بكامل الميزات حتى دون اتصال بالإنترنت (Offline).'
                    : '3. L\'application fonctionnera hors-ligne (100% Offline).'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#2563eb] py-2 text-xs font-bold text-white hover:bg-[#1d4ed8]"
              >
                {lang === 'ar' ? 'حسناً، فهمت' : 'D\'accord'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
