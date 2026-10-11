import React from 'react';

interface TrayIndustrialIconProps {
  className?: string;
  size?: number;
}

export const TrayIndustrialIcon: React.FC<TrayIndustrialIconProps> = ({
  className = 'w-9 h-9',
  size = 200,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="HMI Tray 4-layer industrial icon with 3 synchronized heads"
      className={className}
    >
      <defs>
        <linearGradient id="trayOuterRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        <filter id="iconSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0f172a" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* 1. Three Dashed Radial 120° Alignment Axes */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="24"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeDasharray="3.5 3"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="100"
        x2="34"
        y2="138"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeDasharray="3.5 3"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="100"
        x2="166"
        y2="138"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeDasharray="3.5 3"
        strokeLinecap="round"
      />

      {/* 2. Outer Solid Tray Rim (محيط الصينية الصناعية الدائري) */}
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="url(#trayOuterRimGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* 3. The 4 Concentric Drilling Layers (الطبقات الأربع متحدة المركز) */}
      {/* Layer 1 (Outer Amber Layer - L1) */}
      <circle
        cx="100"
        cy="100"
        r="61"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />

      {/* Layer 2 (Emerald Green Layer - L2) */}
      <circle
        cx="100"
        cy="100"
        r="47"
        fill="none"
        stroke="#10b981"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />

      {/* Layer 3 (Cyan Layer - L3) */}
      <circle
        cx="100"
        cy="100"
        r="34"
        fill="none"
        stroke="#06b6d4"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="7 5"
      />

      {/* Layer 4 (4th Inner Layer - L4 - الطبقة الرابعة) */}
      <circle
        cx="100"
        cy="100"
        r="21"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="6 4.5"
      />

      {/* 4. Center Machine Safe / Danger Core Hub */}
      <circle
        cx="100"
        cy="100"
        r="11"
        fill="#f43f5e"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle cx="100" cy="100" r="3.5" fill="#ffffff" opacity="0.95" />

      {/* 5. The 3 Triangle Machine Drill Heads (رؤوس المثلث الثلاثية التي تمثل رؤوس الآلة المتزامنة) */}
      {/* Head 1 (Top Head - Cyan T1) */}
      <polygon
        points="100,2 86,24 114,24"
        fill="#06b6d4"
        stroke="#0284c7"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#iconSoftGlow)"
      />

      {/* Head 2 (Bottom-Left Head - Orange T2) */}
      <polygon
        points="15,149 27,126 41,150"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#iconSoftGlow)"
      />

      {/* Head 3 (Bottom-Right Head - Emerald T3) */}
      <polygon
        points="185,149 159,150 173,126"
        fill="#10b981"
        stroke="#059669"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#iconSoftGlow)"
      />
    </svg>
  );
};
