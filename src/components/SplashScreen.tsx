import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
import { Language } from '../core/i18n';

interface SplashScreenProps {
  onEnter: () => void;
  lang: Language;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, lang }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onEnter();
      }, 350);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onEnter]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-[#0f172a] select-none transition-opacity duration-350 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col items-center space-y-4 animate-scale-up">
        {/* Clean minimalist app icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#2563eb] text-white flex items-center justify-center shadow-xl shadow-blue-500/20 border border-blue-400/30">
          <Cpu className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* App Name */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            TRIVIUM120°
          </h1>
          <p className="text-xs text-[#64748b] font-medium">
            HMI Tray Designer
          </p>
        </div>
      </div>
    </div>
  );
};
