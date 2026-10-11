export type Language = 'ar' | 'fr';

export interface Translations {
  // App & Header
  appTitle: string;
  appSubtitle: string;
  badgeOneUi: string;
  statusSafe: string;
  statusWarn: string;
  statusErr: string;
  langAr: string;
  langFr: string;
  btnQr: string;
  btnExportJson: string;
  btnExportCsv: string;
  btnReset: string;

  // Bottom Navigation
  navAuto: string;
  navManual: string;
  navArticle: string;

  // Parameters
  cardGeoTitle: string;
  trayDiameter: string;
  toolDiameter: string;
  margin: string;
  firstLayerD: string;
  cardRingsTitle: string;
  layersCount: string;
  spacing: string;
  lastLayerD: string;
  btnAutoSpacing: string;
  servoMovement: string;
  warningCollision: string;
  spacingLaw: string;
  servoRadialCourse: string;
  mathDocTitle: string;
  mathDocMarginTitle: string;
  mathDocMarginDesc: string;
  mathDocMarginNote: string;
  mathDocUniformSpacing: string;
  mathDocServoMove: string;
  mathDocServoMoveDesc: string;
  layerDistributionTitle: string;
  customModeHeader: string;
  customModeStepAngle: string;
  customModePoints: string;
  customModeOffset: string;
  timingNote: string;
  cardPointsTitle: string;
  modeAll: string;
  modeCustom: string;
  basePoints: string;
  pointsPerHead: string;
  offsetAngle: string;
  angularStep: string;
  cardTimingTitle: string;
  deflowerTime: string;
  rotSpeed: string;
  expSpeed: string;
  layerTransferTime: string;

  // Simulation & View
  simStatusReady: string;
  simStatusRunning: string;
  simStatusDone: string;
  btnPlay: string;
  btnPause: string;
  btnResetSim: string;
  btnPrevStep: string;
  btnNextStep: string;
  speed: string;
  viewAll: string;
  viewStage: string;
  viewMachine: string;
  viewSectors: string;
  viewHeads: string;
  viewRings: string;
  viewLabels: string;

  // Validation
  kpisTitle: string;
  totalHoles: string;
  d1Label: string;
  dLastLabel: string;
  totalSteps: string;
  cycleTime: string;
  minClearance: string;
  tableLayer: string;
  tableDiam: string;
  tableRadius: string;
  tablePoints: string;
  tableStep: string;
  tablePerHead: string;
  tableOffset: string;
  tableMinDist: string;
  tableStatus: string;
  statusOk: string;
  statusOverlap: string;

  // Manual Mode Page
  manualTitle: string;
  manualSubtitle: string;
  manualAngle: string;
  manualExpLength: string;
  manualDeflowerTime: string;
  manualRotSpeed: string;
  manualExpSpeed: string;
  manualPlungeTest: string;
  manualHead1: string;
  manualHead2: string;
  manualHead3: string;
  manualJogFwd: string;
  manualJogRev: string;
  manualStatusReady: string;
  manualSimulating: string;
  manualScreen3: string;
  manualScreen4: string;
  manualParameters: string;
  manualEditSection: string;
  testButton: string;
  drillingButton: string;

  // Article Page
  articleTitle: string;
  articleSubtitle: string;
  presetsTitle: string;
  btnCopyRecipe: string;
  recipeCopied: string;
  btnPrintRecipe: string;

  // Auto Page
  autoTitle: string;
  autoSubtitle: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appTitle: 'HMI Tray Designer',
    appSubtitle: 'مصمم صواني الشاي الصناعي — 3 رؤوس متزامنة @ 0° / 120° / 240°',
    badgeOneUi: 'One UI 8 Light',
    statusSafe: 'تصميم سليم ومتزامن 100%',
    statusWarn: 'تنبيه هندسي — راجع المسافات',
    statusErr: 'خطأ تداخل — التصدير معطل',
    langAr: 'عربي',
    langFr: 'FR',
    btnQr: 'رمز QR',
    btnExportJson: 'تصدير PLC',
    btnExportCsv: 'CSV',
    btnReset: 'إعادة ضبط',

    navAuto: 'المحاكي الآلي',
    navManual: 'الوضع اليدوي',
    navArticle: 'الوصفات والـ Article',

    autoTitle: 'المحاكي الآلي وتصميم الصينية الموزعة',
    autoSubtitle: 'تصميم هندسة الحفر التلقائية، حساب الزوايا، وتوليد إحداثيات ومحاكاة دورات الآلة الحقيقية',

    cardGeoTitle: 'هندسة الصينية والأداة',
    trayDiameter: 'قطر الصينية الإجمالي',
    toolDiameter: 'قطر سن الحفر / الأداة',
    margin: 'هامش الطبقة الأولى عن الحافة',
    firstLayerD: 'قطر أول حلقة D₁ = قطر الصينية − الهامش',
    cardRingsTitle: 'الدوائر متحدة المركز والتباعد',
    layersCount: 'عدد الطبقات الحلقية (الحد الأقصى بالآلة: 7)',
    spacing: 'تباعد القطر بين كل طبقتين (ΔD)',
    lastLayerD: 'قطر آخر طبقة في المركز (D_آخر)',
    btnAutoSpacing: 'احسب التباعد تلقائياً',
    servoMovement: 'حركة رأس الحفر على السيرفو الشعاعي',
    warningCollision: 'خطر: المسافة أقل من قطر الأداة — يحدث تداخل!',
    spacingLaw: 'قانون التباعد بين الطبقتين:',
    servoRadialCourse: 'حركة رأس الحفر على السيرفو الشعاعي:',
    mathDocTitle: 'توثيق المنطق الرياضي للتباعد التلقائي:',
    mathDocMarginTitle: '1. الهامش (Margin):',
    mathDocMarginDesc: 'هو أول تباعد يدوي يقيسه العامل بين محيط الصينية وأول طبقة:',
    mathDocMarginNote: '(هذه القيمة في تطبيقنا لضمان دقة العامل وتفادي الحافة، وليست مبرمجة في الآلة).',
    mathDocUniformSpacing: '2. التباعد المتساوي (ΔD):',
    mathDocServoMove: '3. حركة السيرفو بالآلة (Expansion Length):',
    mathDocServoMoveDesc: 'تتحرك ذراع الرأس شعاعياً بمقدار نصف تباعد القطر:',
    layerDistributionTitle: 'توزيع أقطار الطبقات الحالي (متساوٍ بانتظام):',
    customModeHeader: 'تخصيص كل طبقة (النقاط وإزاحة الزاوية بدون كيبورد):',
    customModeStepAngle: 'زاوية الخطوة:',
    customModePoints: 'النقاط',
    customModeOffset: 'إزاحة زاوية (°)',
    timingNote: 'مطابقة تامة لشاشات الآلة TouchWin: التردد 800 Hz وزمن الحفر 0.10 S لحساب زمن المعالجة (processing time).',
    cardPointsTitle: 'توزيع النقاط والزوايا',
    modeAll: 'نمط موحد (لكل الطبقات)',
    modeCustom: 'مخصص لكل طبقة',
    basePoints: 'نقاط الطبقة (مضاعف لـ 3)',
    pointsPerHead: 'نقاط لكل رأس',
    offsetAngle: 'إزاحة زاوية تدريجية بين الطبقات',
    angularStep: 'خطوة دوران السيرفو للرأس الواحد',
    cardTimingTitle: 'توقيت وسرعات الآلة (TouchWin PLC)',
    deflowerTime: 'deflower time (زمن الحفر والتفريغ)',
    rotSpeed: 'rotation speed (Hz)',
    expSpeed: 'expansion speed (Hz)',
    layerTransferTime: 'انتقال المحور الشعاعي لتغيير الطبقة (ms)',

    simStatusReady: 'جاهز للبدء',
    simStatusRunning: 'المحاكاة قيد التشغيل...',
    simStatusDone: 'اكتملت الدورة بنجاح',
    btnPlay: 'تشغيل',
    btnPause: 'إيقاف مؤقت',
    btnResetSim: 'إعادة',
    btnPrevStep: 'خطوة سابقة',
    btnNextStep: 'خطوة تالية',
    speed: 'السرعة',
    viewAll: 'عرض شامل (المحاكاة + شاشة الآلة)',
    viewStage: 'المحاكاة والكروكي البصري',
    viewMachine: 'شاشة الآلة TouchWin OP320',
    viewSectors: 'قطاعات الرؤوس',
    viewHeads: 'رؤوس T1/T2/T3',
    viewRings: 'الدوائر',
    viewLabels: 'ترقيم الثقوب',

    kpisTitle: 'نتائج الفحص الهندسي ومؤشرات الأداء (KPIs)',
    totalHoles: 'إجمالي الثقوب',
    d1Label: 'قطر أول حلقة (D₁)',
    dLastLabel: 'قطر آخر حلقة (D_آخر)',
    totalSteps: 'خطوات التدوير (لكل رأس)',
    cycleTime: 'زمن الدورة المتوقع',
    minClearance: 'أدنى مسافة خلوص',
    tableLayer: 'الطبقة',
    tableDiam: 'القطر D (مم)',
    tableRadius: 'نصف القطر R (مم)',
    tablePoints: 'النقاط',
    tableStep: 'الخطوة (°)',
    tablePerHead: 'نقاط / رأس',
    tableOffset: 'الإزاحة (°)',
    tableMinDist: 'أدنى مسافة (مم)',
    tableStatus: 'الحالة',
    statusOk: 'سليم',
    statusOverlap: 'تداخل',

    manualTitle: 'الوضع اليدوي للمشغل (TouchWin Manual Control)',
    manualSubtitle: 'محاكاة الشاشات 3 و 4 للمعاملات والتحكم اليدوي المباشر بالمحاور',
    manualAngle: 'rotation angle (زاوية الدوران اليدوية)',
    manualExpLength: 'expansion length (طول التمدد اليدوي)',
    manualDeflowerTime: 'deflower time (زمن الحفر اليدوي)',
    manualRotSpeed: 'rotation speed (تردد سرعة الدوران)',
    manualExpSpeed: 'expansion speed (تردد سرعة التمدد)',
    manualPlungeTest: 'اختبار تشغيل رأس الحفر اليدوي',
    manualHead1: 'الرأس 1 (0°)',
    manualHead2: 'الرأس 2 (120°)',
    manualHead3: 'الرأس 3 (240°)',
    manualJogFwd: 'تمدد ذراع السيرفو (+)',
    manualJogRev: 'سحب ذراع السيرفو (-)',
    manualStatusReady: 'الوضع اليدوي جاهز للاختبار',
    manualSimulating: 'جاري تنفيذ حركة يدوية...',
    manualScreen3: 'Screen 3 — المعاملات اليدوية',
    manualScreen4: 'Screen 4 — سرعات التشغيل اليدوي',
    manualParameters: 'manual parameters',
    manualEditSection: 'تعديل المعاملات اليدوية (Screen 3 & 4)',
    testButton: 'اختبار',
    drillingButton: 'حفر...',

    articleTitle: 'إدارة الوصفات والـ Articles',
    articleSubtitle: 'نماذج المصنع الجاهزة وشاشات الكريستال السائل TouchWin OP320',
    presetsTitle: 'قائمة الوصفات والقوالب المصنعية',
    btnCopyRecipe: 'نسخ الوصفة للعامل',
    recipeCopied: 'تم نسخ الوصفة!',
    btnPrintRecipe: 'طباعة ورقة الوصفة',
  },
  fr: {
    appTitle: 'HMI Tray Designer',
    appSubtitle: 'Conception industrielle de plateaux à thé — 3 têtes synchronisées @ 0° / 120° / 240°',
    badgeOneUi: 'One UI 8 Light',
    statusSafe: 'Conception 100% conforme',
    statusWarn: 'Avertissement — Vérifier entraxes',
    statusErr: 'Erreur collision — Export bloqué',
    langAr: 'AR',
    langFr: 'Français',
    btnQr: 'Code QR',
    btnExportJson: 'Export PLC',
    btnExportCsv: 'CSV',
    btnReset: 'Réinit.',

    navAuto: 'Guide Automatique',
    navManual: 'Manuel',
    navArticle: 'Articles & Recettes',

    autoTitle: 'Simulateur Automatique & Design de Plateau',
    autoSubtitle: 'Conception géométrique automatique, calcul des angles et simulation des cycles machine',

    cardGeoTitle: 'Géométrie du plateau et outil',
    trayDiameter: 'Diamètre total du plateau',
    toolDiameter: 'Diamètre du forêt / outil',
    margin: 'Marge extérieure (bord du plateau)',
    firstLayerD: 'Diamètre 1ère couche D₁ = Plateau − Marge',
    cardRingsTitle: 'Cercles concentriques & Espacement',
    layersCount: 'Nombre de couches (Max machine : 7)',
    spacing: 'Espacement diamètre entre 2 couches (ΔD)',
    lastLayerD: 'Diamètre dernière couche au centre (D_fin)',
    btnAutoSpacing: 'Calculer espacement auto',
    servoMovement: 'Course radiale du servomoteur',
    warningCollision: 'Danger: course < diamètre outil — collision!',
    spacingLaw: "Règle d'espacement des couches :",
    servoRadialCourse: 'Course radiale du servo :',
    mathDocTitle: "Documentation mathématique de l'espacement automatique :",
    mathDocMarginTitle: '1. Marge extérieure (Bord) :',
    mathDocMarginDesc: 'Premier espacement mesuré manuellement entre le bord du plateau et la 1ère couche :',
    mathDocMarginNote: '(Valeur intégrée dans notre app pour la précision de l’opérateur, non programmée dans la machine).',
    mathDocUniformSpacing: '2. Espacement uniforme (ΔD) :',
    mathDocServoMove: '3. Course du servomoteur machine (Expansion Length) :',
    mathDocServoMoveDesc: 'Le bras se déplace radialement de la moitié du pas de diamètre :',
    layerDistributionTitle: 'Répartition actuelle des diamètres (uniforme) :',
    customModeHeader: 'Personnalisation de chaque couche (points & décalages) :',
    customModeStepAngle: 'Angle de pas :',
    customModePoints: 'Points',
    customModeOffset: 'Décalage angulaire (°)',
    timingNote: 'Conformité exacte aux écrans TouchWin : 800 Hz et 0.10 S pour le calcul du temps de traitement.',
    cardPointsTitle: 'Répartition des points & angles',
    modeAll: 'Mode uniforme (toutes couches)',
    modeCustom: 'Personnalisé par couche',
    basePoints: 'Points par couche (multiple de 3)',
    pointsPerHead: 'Points par tête',
    offsetAngle: 'Décalage angulaire progressif',
    angularStep: 'Pas de rotation par tête',
    cardTimingTitle: 'Temporisation & Vitesses (TouchWin PLC)',
    deflowerTime: 'deflower time (temps perçage / dégagement)',
    rotSpeed: 'rotation speed (Hz)',
    expSpeed: 'expansion speed (Hz)',
    layerTransferTime: 'Transfert radial inter-couches (ms)',

    simStatusReady: 'Prêt à démarrer',
    simStatusRunning: 'Simulation en cours...',
    simStatusDone: 'Cycle terminé avec succès',
    btnPlay: 'Démarrer',
    btnPause: 'Pause',
    btnResetSim: 'Réinitialiser',
    btnPrevStep: 'Pas précédent',
    btnNextStep: 'Pas suivant',
    speed: 'Vitesse',
    viewAll: 'Vue complète (Simulation + Écran machine)',
    viewStage: 'Simulation visuelle',
    viewMachine: 'Écran TouchWin OP320',
    viewSectors: 'Secteurs têtes',
    viewHeads: 'Têtes T1/T2/T3',
    viewRings: 'Cercles',
    viewLabels: 'Numéros des trous',

    kpisTitle: 'Résultats géométriques & Indicateurs clés (KPIs)',
    totalHoles: 'Total trous',
    d1Label: 'Diamètre 1ère couche (D₁)',
    dLastLabel: 'Diamètre fin (D_fin)',
    totalSteps: 'Pas de rotation / tête',
    cycleTime: 'Temps cycle estimé',
    minClearance: 'Distance mini entre trous',
    tableLayer: 'Couche',
    tableDiam: 'Diamètre D (mm)',
    tableRadius: 'Rayon R (mm)',
    tablePoints: 'Points',
    tableStep: 'Pas (°)',
    tablePerHead: 'Pts / Tête',
    tableOffset: 'Décalage (°)',
    tableMinDist: 'Dist. min (mm)',
    tableStatus: 'État',
    statusOk: 'Conforme',
    statusOverlap: 'Collision',

    manualTitle: 'Contrôle Manuel Opérateur (TouchWin OP320)',
    manualSubtitle: 'Simulation des écrans 3 et 4 pour tests manuels des axes et perçage',
    manualAngle: 'rotation angle (angle manuel)',
    manualExpLength: 'expansion length (course manuelle)',
    manualDeflowerTime: 'deflower time (temps perçage manuel)',
    manualRotSpeed: 'rotation speed (vitesse rotation)',
    manualExpSpeed: 'expansion speed (vitesse expansion)',
    manualPlungeTest: 'Test de plongée manuelle par tête',
    manualHead1: 'Tête 1 (0°)',
    manualHead2: 'Tête 2 (120°)',
    manualHead3: 'Tête 3 (240°)',
    manualJogFwd: 'Avance radiale servomoteur (+)',
    manualJogRev: 'Recul radial servomoteur (-)',
    manualStatusReady: 'Mode manuel prêt pour les tests',
    manualSimulating: 'Mouvement manuel en cours...',
    manualScreen3: 'Screen 3 — Paramètres Manuels',
    manualScreen4: 'Screen 4 — Vitesses Manuelles',
    manualParameters: 'manual parameters',
    manualEditSection: 'Modification des paramètres (Écrans 3 & 4)',
    testButton: 'Test',
    drillingButton: 'Perçage...',

    articleTitle: 'Gestion des Recettes & Articles',
    articleSubtitle: 'Modèles d\'usine prédéfinis et écrans LCD TouchWin OP320',
    presetsTitle: 'Catalogue des articles et recettes usine',
    btnCopyRecipe: 'Copier la recette pour l\'opérateur',
    recipeCopied: 'Recette copiée !',
    btnPrintRecipe: 'Imprimer la fiche recette',
  },
};
