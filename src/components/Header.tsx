import React from 'react';
import {
  Download,
  QrCode,
  Camera,
  RotateCcw,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Languages,
} from 'lucide-react';
import { TrayModel } from '../types';
import { Language, Translations } from '../core/i18n';
import { TrayIndustrialIcon } from './TrayIndustrialIcon';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  model: TrayModel;
  lang: Language;
  t: Translations;
  onToggleLang: () => void;
  onOpenQr: () => void;
  onOpenQrScanner?: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onResetDefault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  model,
  lang,
  t,
  onToggleLang,
  onOpenQr,
  onOpenQrScanner,
  onExportJson,
  onExportCsv,
  onResetDefault,
}) => {
  return (
    <header
      dir="ltr"
      className="flex-none sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0]/90 px-3 sm:px-4 md:px-6 pt-[max(8px,env(safe-area-inset-top))] pb-2.5 sm:pb-3 transition-all shadow-xs select-none"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Zone 1: Brand & Identity (Always Left in French/LTR layout) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white flex items-center justify-center p-1 shadow-sm shadow-[#2563eb]/10 shrink-0 border border-[#e2e8f0]">
            <TrayIndustrialIcon className="w-full h-full" size={40} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-[#0f172a] truncate">
                {t.appTitle}
              </h1>
              <span className="hidden xs:inline-block text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] shrink-0">
                {t.badgeOneUi}
              </span>
            </div>
            <p className="text-[11px] text-[#64748b] hidden md:block truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Zone 2: Status Indicator (Center) */}
        <div className="hidden lg:flex items-center">
          {model.hasErr ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.statusErr}</span>
            </div>
          ) : model.hasWarn ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.statusWarn}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t.statusSafe}</span>
            </div>
          )}
        </div>

        {/* Zone 3: Actions & Language Selector (Always Right in French/LTR layout) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PWA Install Button (automatically shows when installable or on iOS) */}
          <PWAInstallButton lang={lang} />

          {/* Language Switcher Button (AR <-> FR) */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-[#1e293b] bg-[#eef2f8] hover:bg-[#dbeafe] border border-[#cbd5e1] rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
            title={lang === 'ar' ? 'Passer en Français' : 'التحويل إلى العربية'}
          >
            <Languages className="w-3.5 h-3.5 text-[#2563eb]" />
            <span className="font-mono">{lang === 'ar' ? 'FR' : 'عربي'}</span>
          </button>

          {/* Quick QR Generator Button */}
          <button
            type="button"
            onClick={onOpenQr}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#334155] bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#cbd5e1]/70 rounded-xl transition-all cursor-pointer select-none active:scale-95"
            title={t.btnQr}
          >
            <QrCode className="w-3.5 h-3.5 text-[#2563eb]" />
            <span className="hidden sm:inline">{t.btnQr}</span>
          </button>

          {/* Quick QR Scanner Button */}
          {onOpenQrScanner && (
            <button
              type="button"
              onClick={onOpenQrScanner}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#0f766e] bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-[#99f6e4] rounded-xl transition-all cursor-pointer select-none active:scale-95"
              title={lang === 'ar' ? 'مسح واستقبال كود QR' : 'Scanner QR'}
            >
              <Camera className="w-3.5 h-3.5 text-[#0d9488]" />
              <span className="hidden md:inline">{lang === 'ar' ? 'مسح QR' : 'Scanner'}</span>
            </button>
          )}

          {/* CSV Export */}
          <button
            type="button"
            onClick={onExportCsv}
            disabled={model.hasErr}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 sm:py-2 text-xs font-semibold text-[#334155] bg-[#f1f5f9] hover:bg-[#e2e8f0] disabled:opacity-40 disabled:pointer-events-none border border-[#cbd5e1]/70 rounded-xl transition-all cursor-pointer select-none active:scale-95"
            title={t.btnExportCsv}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" />
            <span>{t.btnExportCsv}</span>
          </button>

          {/* Export PLC Button */}
          <button
            type="button"
            onClick={onExportJson}
            disabled={model.hasErr}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-[#2563eb]/20 rounded-xl transition-all cursor-pointer select-none active:scale-95"
            title={t.btnExportJson}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">{t.btnExportJson}</span>
          </button>

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={onResetDefault}
            className="p-1.5 sm:p-2 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-xl transition-all cursor-pointer"
            title={t.btnReset}
            aria-label={t.btnReset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
