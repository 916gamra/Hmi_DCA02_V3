import { HeadConfig, TrayParams, RecipePreset } from '../types';

export const DEG = Math.PI / 180;

export const HEADS: HeadConfig[] = [
  { id: 'T1', angle: 0, color: '#0284c7', nameAr: 'الرأس 1' },
  { id: 'T2', angle: 120, color: '#d97706', nameAr: 'الرأس 2' },
  { id: 'T3', angle: 240, color: '#e11d48', nameAr: 'الرأس 3' },
];

export const LAYER_COLORS = [
  '#2563eb', // L1 - Blue
  '#059669', // L2 - Emerald
  '#d97706', // L3 - Amber
  '#dc2626', // L4 - Red
  '#7c3aed', // L5 - Violet
  '#ea580c', // L6 - Orange
  '#0891b2', // L7 - Cyan
];

export const DEFAULT_PARAMS: TrayParams = {
  trayD: 350, // 35 cm = 350 mm
  trayDDisplay: 35,
  trayU: 'cm',
  tool: 3.5, // mm
  margin: 25, // 25 mm
  marginDisplay: 2.5,
  marginU: 'cm',
  layers: 4, // TouchWin active layers (max 7)
  spacing: 39, // TouchWin expansion length 39MM
  spacingDisplay: 39,
  spacingU: 'mm',
  rLast: 183, // Last layer diameter in mm (300 - 3*39 = 183mm)
  rLastDisplay: 183,
  rLastU: 'mm',
  mode: 'custom',
  rawBase: 12,
  addAngle: 0,
  custom: [
    { n: 30, off: 0, stepAngle: 12.0 }, // 1 rotation angle 12.0 -> 30 holes
    { n: 24, off: 0, stepAngle: 15.0 }, // 2 rotation angle 15.0 -> 24 holes
    { n: 18, off: 0, stepAngle: 20.0 }, // 3 rotation angle 20.0 -> 18 holes
    { n: 30, off: 0, stepAngle: 12.0 }, // 4 rotation angle 12.0 -> 30 holes
    { n: 24, off: 0, stepAngle: 15.0 }, // 5 (disabled if layers < 5)
    { n: 18, off: 0, stepAngle: 20.0 }, // 6 (disabled if layers < 6)
    { n: 0, off: 0, stepAngle: 0.0 },   // 7 rotation angle 0.0
  ],
  timing: {
    dwell: 100, // TouchWin deflower time 0.10 S = 100 ms
    index: 120, // ms
    layer: 400, // ms
    rampExpansionSec: 0.08, // mechanical servo settling ramp overhead in s
    rampRotationSec: 0.035,  // rotational acceleration/settling overhead in s
  },
  rotationSpeedHz: 800,
  expansionSpeedHz: 800,
  pulsesPerRev: 10000,
  pulsesPerMm: 100,
  timingMode: 'hz',
  speed: 1,
};

export const PRESETS: RecipePreset[] = [
  {
    id: 'touchwin-actual-machine',
    name: 'وصفة شاشة الآلة الفعلية (TouchWin 4L - 39mm)',
    nameFr: 'Recette Écran Machine Réelle (TouchWin 4L - 39mm)',
    description: 'الوصفة الحقيقية المأخوذة مباشرة من شاشات TouchWin: 4 طبقات (12° / 15° / 20° / 12°) بتباعد 39 مم وزمن 0.10 ثانية',
    descriptionFr: 'Recette réelle issue des écrans TouchWin : 4 couches (12° / 15° / 20° / 12°), espacement 39 mm, dwell 0.10 S',
    tag: 'شاشة الآلة 🎯',
    tagFr: 'Écran Machine 🎯',
    params: {
      trayD: 350,
      trayDDisplay: 35,
      trayU: 'cm',
      tool: 3.5,
      margin: 25,
      marginDisplay: 2.5,
      marginU: 'cm',
      layers: 4,
      spacing: 39,
      spacingDisplay: 39,
      spacingU: 'mm',
      rLast: 183,
      rLastDisplay: 183,
      rLastU: 'mm',
      mode: 'custom',
      custom: [
        { n: 30, off: 0, stepAngle: 12.0 },
        { n: 24, off: 0, stepAngle: 15.0 },
        { n: 18, off: 0, stepAngle: 20.0 },
        { n: 30, off: 0, stepAngle: 12.0 },
        { n: 0, off: 0, stepAngle: 0.0 },
        { n: 0, off: 0, stepAngle: 0.0 },
        { n: 0, off: 0, stepAngle: 0.0 },
      ],
      timing: {
        dwell: 100,
        index: 120,
        layer: 400,
      },
      rotationSpeedHz: 800,
      expansionSpeedHz: 800,
    },
  },
  {
    id: 'standard-tea-tray',
    name: 'صينية شاي كلاسيكية (30 سم - 4 طبقات)',
    nameFr: 'Plateau Classique (30 cm - 4 Couches)',
    description: '4 طبقات متساوية الأبعاد بـ 12 نقطة لكل طبقة، مثالية للإنتاج القياسي',
    descriptionFr: '4 couches uniformes avec 12 points par couche, idéal pour une production standard rapide.',
    tag: 'الأكثر طلباً',
    tagFr: 'Populaire',
    params: {
      trayD: 300,
      trayDDisplay: 30,
      trayU: 'cm',
      tool: 3.5,
      margin: 25,
      marginDisplay: 2.5,
      marginU: 'cm',
      layers: 4,
      spacing: 20,
      rLast: 20,
      mode: 'all',
      rawBase: 12,
      addAngle: 0,
    },
  },
  {
    id: 'spiral-tea-tray',
    name: 'صينية هندسية حلزونية (Spiral 35 سم)',
    nameFr: 'Plateau Spiralé (35 cm - 5 Couches)',
    description: 'إزاحة زاوية بمقدار 7.5° بين الطبقات لمنع الاصطفاف الشعاعي وإعطاء مظهر دوامي رائع',
    descriptionFr: 'Décalage de 7.5° entre les couches pour casser l’alignement radial et créer un superbe motif tourbillon.',
    tag: 'تصميم حلزوني',
    tagFr: 'Design Spiral',
    params: {
      trayD: 350,
      trayDDisplay: 35,
      trayU: 'cm',
      tool: 3.2,
      margin: 25,
      marginDisplay: 2.5,
      marginU: 'cm',
      layers: 5,
      spacing: 22,
      rLast: 20,
      mode: 'all',
      rawBase: 18,
      addAngle: 7.5,
    },
  },
  {
    id: 'large-luxury-tray',
    name: 'صينية مغربية فاخرة (50 سم - 6 طبقات)',
    nameFr: 'Grand Plateau Prestige (50 cm - 6 Couches)',
    description: 'صينية كبيرة قطر 50 سم بست طبقات متدرجة وكثافة نقطية عالية لتصريف سريع ومتقن',
    descriptionFr: 'Grand diamètre 50 cm à 6 couches progressives, haute densité de trous pour un écoulement parfait.',
    tag: 'قطر كبير',
    tagFr: 'Grand Format',
    params: {
      trayD: 500,
      trayDDisplay: 50,
      trayU: 'cm',
      tool: 4.0,
      margin: 30,
      marginDisplay: 3.0,
      marginU: 'cm',
      layers: 6,
      spacing: 30,
      rLast: 35,
      mode: 'all',
      rawBase: 24,
      addAngle: 5,
    },
  },
  {
    id: 'compact-tray',
    name: 'صينية تقديم فردية مصغرة (20 سم)',
    nameFr: 'Plateau Compact Individuel (20 cm)',
    description: '3 طبقات سريعة الإنجاز بدورة زمنية قصيرة مناسبة لصواني الإفطار والقهوة',
    descriptionFr: '3 couches rapides avec temps de cycle très court, adapté aux petits plateaux à café.',
    tag: 'دورة سريعة',
    tagFr: 'Cycle Rapide',
    params: {
      trayD: 200,
      trayDDisplay: 20,
      trayU: 'cm',
      tool: 3.0,
      margin: 15,
      marginDisplay: 1.5,
      marginU: 'cm',
      layers: 3,
      spacing: 18,
      rLast: 20,
      mode: 'all',
      rawBase: 12,
      addAngle: 10,
    },
  },
];
