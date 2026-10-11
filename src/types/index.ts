export interface HeadConfig {
  id: 'T1' | 'T2' | 'T3';
  angle: number;
  color: string;
  nameAr: string;
}

export interface Point {
  layer: number;
  k: number;
  head: number;
  j: number;
  a: number;
  x: number;
  y: number;
  bad: boolean;
}

export interface Layer {
  i: number;
  r: number;
  n: number;
  per: number;
  step: number;
  off: number;
  pts: Point[];
  minD: number;
  bad: number;
}

export interface Warn {
  lv: 'err' | 'warn';
  tx: string;
}

export interface CustomLayerConfig {
  n: number;
  off: number;
  stepAngle?: number;
}

export interface TrayTiming {
  dwell: number; // in ms
  index: number; // in ms
  layer: number; // in ms
  rampExpansionSec?: number; // Servo expansion settling/ramp overhead in sec (default 0.08)
  rampRotationSec?: number;  // Rotational indexing servo ramp overhead in sec (default 0.035)
}

export interface MachineAngleRow {
  layer: number;
  rotationAngle: number; // in degrees, e.g. 12.0, 15.0, 20.0, or 0.0
  add: number;           // add0 offset in degrees
  active: boolean;
  holesCount: number;
  holesPerHead: number;
}

export interface MachineAutoParams {
  rotationSpeedHz: number;   // e.g. 800 Hz
  expansionSpeedHz: number;  // e.g. 800 Hz
  deflowerLayer: number;     // e.g. 4 L
  deflowerTimeSec: number;   // e.g. 0.10 S
  expansionLengthMm: number; // e.g. 39 MM
  processingTimeSec: number; // e.g. 7.58 S
  pulsesPerRev: number;      // e.g. 10000
  pulsesPerMm: number;       // e.g. 100
}

export interface TrayParams {
  trayD: number; // in mm
  trayDDisplay: number;
  trayU: 'cm' | 'mm';
  tool: number; // in mm
  margin: number; // in mm
  marginDisplay: number;
  marginU: 'cm' | 'mm';
  layers: number; // max 7
  spacing: number;
  spacingDisplay: number;
  spacingU: 'cm' | 'mm';
  rLast: number;
  rLastDisplay: number;
  rLastU: 'cm' | 'mm';
  mode: 'all' | 'custom' | 'machine';
  rawBase: number;
  addAngle: number;
  custom: CustomLayerConfig[];
  timing: TrayTiming;
  rotationSpeedHz: number;
  expansionSpeedHz: number;
  pulsesPerRev: number;
  pulsesPerMm: number;
  timingMode: 'hz' | 'ms';
  speed: number;
}

export interface TrayModel {
  R: number;
  toolR: number;
  r1: number;
  rLast: number;
  d1: number;     // Diameter of Layer 1 = 2 * r1
  dLast: number;  // Diameter of Last Layer = 2 * rLast
  radialStepMm: number; // Radial movement per layer = spacing / 2
  layers: Layer[];
  all: Point[];
  minD: number;
  badCount: number;
  warns: Warn[];
  totalPts: number;
  totalSteps: number;
  hasErr: boolean;
  hasWarn: boolean;
}

export interface TimelineAction {
  type: 'repos' | 'index' | 'fire';
  t0: number;
  d: number;
  layer: number;
  j?: number;
  r0: number;
  r1: number;
  th0: number;
  th1: number;
}

export interface Timeline {
  acts: TimelineAction[];
  total: number;
}

export interface SimulationState {
  theta: number;
  headR: number;
  counts: number[];
  cur: TimelineAction | null;
  u: number;
  done: boolean;
}

export interface ViewOptions {
  sectors: boolean;
  heads: boolean;
  rings: boolean;
  labels: boolean;
}

export interface RecipePreset {
  id: string;
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  tag: string;
  tagFr?: string;
  params: Partial<TrayParams>;
}
