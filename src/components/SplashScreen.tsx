import React, { useEffect, useState, useRef } from 'react';
import { TrayModel } from '../types';
import { buildModel } from '../core/model';
import { renderCanvas } from '../core/render';
import { Language } from '../core/i18n';

interface SplashScreenProps {
  onEnter: () => void;
  lang: Language;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, lang }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    // Default minimalist preview tray params
    const model = buildModel({
      trayD: 120,
      tool: 3,
      margin: 15,
      layers: 3,
      spacing: 15,
      mode: 'all',
      rawBase: 12,
      addAngle: 5,
      custom: [],
      timing: { dwell: 100, index: 50, layer: 200 }
    } as any); // Casting to any to bypass complex type requirements for this minimal preview

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderCanvas(ctx, 160, 160, 2, model, null, { sectors: true, heads: true, rings: true, labels: false }, 1, 0, 0, null);
      }
    }
  }, []);

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
        {/* Simulator Preview Canvas */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/20 border border-blue-400/20 bg-white">
          <canvas ref={canvasRef} width={320} height={320} className="w-full h-full" />
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
