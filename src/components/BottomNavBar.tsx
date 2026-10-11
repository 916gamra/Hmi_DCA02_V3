import React from 'react';
import { LayoutGrid, Sliders, BookOpen } from 'lucide-react';
import { Translations } from '../core/i18n';

export type MainTab = 'auto' | 'manual' | 'article';

interface BottomNavBarProps {
  currentTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  t: Translations;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onChangeTab,
  t,
}) => {
  const tabs = [
    {
      id: 'auto' as MainTab,
      label: t.navAuto,
      icon: LayoutGrid,
    },
    {
      id: 'manual' as MainTab,
      label: t.navManual,
      icon: Sliders,
    },
    {
      id: 'article' as MainTab,
      label: t.navArticle,
      icon: BookOpen,
    },
  ];

  return (
    <nav
      dir="ltr"
      className="flex-none w-full z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0]/90 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] transition-all no-print select-none"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around gap-1.5 sm:gap-3" dir="ltr">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'bg-[#2563eb]/10 text-[#2563eb]'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
              }`}
            >
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#2563eb] text-white shadow-xs' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-bold tracking-tight mt-1 transition-all ${
                  isActive ? 'text-[#2563eb] font-extrabold' : 'text-[#64748b]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
