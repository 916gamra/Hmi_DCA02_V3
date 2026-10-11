import { TrayParams, TrayModel, Layer, Point, Warn } from '../types';
import { DEG } from './constants';

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

export const clampInt = (v: number, min: number, max: number): number =>
  clamp(Math.round(v), min, max);

export const norm360 = (a: number): number => {
  a %= 360;
  return a < 0 ? a + 360 : a;
};

/**
 * Sanitize point count for a 3-synchronized-head machine.
 * Because 3 drill heads are spaced at 120° apart (0°, 120°, 240°),
 * each head covers an arc of 120°. A complete symmetric pattern
 * requires that the total hole count N is a multiple of 3,
 * where each head drills exactly N/3 holes spaced by 360°/N = 120°/(N/3).
 */
export const sanitizeN = (n: number, enforceMultipleOf3 = true): number => {
  if (!enforceMultipleOf3) {
    return clamp(Math.round(Number.isFinite(n) ? n : 12), 3, 120);
  }
  return clamp(Math.round((Number.isFinite(n) ? n : 12) / 3) * 3, 3, 120);
};

export const fmt = (v: number, d = 1): string =>
  (Math.abs(v) < 1e-9 ? 0 : v).toFixed(d);

export function buildModel(p: TrayParams): TrayModel {
  const R = p.trayD / 2;
  const toolR = p.tool / 2;
  // D1 (قطر أول حلقة) = قطر الصينية ناقص الهامش (حيث الهامش هو أول تباعد بين محيط الصينية وأول طبقة)
  const d1 = Math.max(0, p.trayD - p.margin);
  const r1 = d1 / 2; // نصف قطر الطبقة الأولى
  const activeLayersCount = clampInt(p.layers, 1, 7);
  const radialStepMm = p.spacing / 2; // Radial head displacement per layer (حركة الرأس على السيرفو)
  const layers: Layer[] = [];
  const all: Point[] = [];
  const warns: Warn[] = [];

  for (let i = 0; i < activeLayersCount; i++) {
    // Each layer diameter decreases by p.spacing (e.g. 120mm - 10mm = 110mm)
    const d = d1 - p.spacing * i;
    const r = d / 2;
    let rawN: number;
    let off: number;
    let step: number;
    let n: number;

    // لأن الآلة تحتوي على 3 رؤوس متزامنة بزاوية 120°، يجب أن يكون عدد النقاط مضاعفاً لـ 3.
    // لذلك نُعيد دائماً حساب step = 360 / n بعد sanitizeN لضمان إغلاق الدائرة بدقة.
    if (p.mode === 'all') {
      rawN = p.rawBase;
      off = i * p.addAngle;
      const nClean = sanitizeN(rawN);
      n = nClean;
      step = 360 / nClean;
    } else if (p.mode === 'machine') {
      // TouchWin machine recipe mode
      const cfg = p.custom[i] || { n: p.rawBase, off: i * p.addAngle };
      off = cfg.off || 0;
      if (cfg.stepAngle && cfg.stepAngle > 0) {
        rawN = Math.round(360 / cfg.stepAngle);
        n = sanitizeN(rawN);
        step = 360 / n;
      } else {
        rawN = cfg.n || p.rawBase;
        n = sanitizeN(rawN);
        step = 360 / n;
      }
    } else {
      // custom mode
      const cfg = p.custom[i] || { n: p.rawBase, off: i * p.addAngle };
      off = cfg.off || 0;
      if (cfg.stepAngle && cfg.stepAngle > 0) {
        rawN = Math.round(360 / cfg.stepAngle);
        n = sanitizeN(rawN);
        step = 360 / n;
      } else {
        rawN = cfg.n || p.rawBase;
        n = sanitizeN(rawN);
        step = 360 / n;
      }
    }

    const per = n / 3;

    if (Math.round(rawN) !== n) {
      warns.push({
        lv: 'warn',
        tx: `الطبقة L${i + 1}: عدد النقاط ${rawN} ليس مضاعفاً لـ 3 — تم تعديله تلقائياً إلى ${n}.`,
      });
    }

    const pts: Point[] = [];
    for (let k = 0; k < n; k++) {
      const a = norm360(k * step + off);
      const rad = a * DEG;
      pts.push({
        layer: i,
        k,
        head: Math.floor(k / per),
        j: k % per,
        a,
        x: r * Math.cos(rad),
        y: r * Math.sin(rad),
        bad: false,
      });
    }

    layers.push({
      i,
      r,
      n,
      per,
      step,
      off,
      pts,
      minD: Infinity,
      bad: 0,
    });

    for (const q of pts) {
      all.push(q);
    }
  }

  // Exact pairwise clearance calculation (Euclidean distance between all hole centers)
  let minD = Infinity;
  let badCount = 0;
  const thr = p.tool - 1e-6; // clearance threshold equal to tool diameter

  for (let a = 0; a < all.length; a++) {
    const A = all[a];
    for (let b = a + 1; b < all.length; b++) {
      const B = all[b];
      const dx = A.x - B.x;
      const dy = A.y - B.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < minD) minD = d;

      const LA = layers[A.layer];
      const LB = layers[B.layer];
      if (d < LA.minD) LA.minD = d;
      if (d < LB.minD) LB.minD = d;

      if (d < thr) {
        A.bad = true;
        B.bad = true;
      }
    }
  }

  for (const q of all) {
    if (q.bad) {
      badCount++;
      layers[q.layer].bad++;
    }
  }

  // Geometry and physical limit validations based on diameter and margin
  const dLast = d1 - p.spacing * (activeLayersCount - 1);
  const rLast = dLast / 2;

  if (d1 <= 0) {
    warns.push({
      lv: 'err',
      tx: `الهامش (${fmt(p.margin)} مم) أكبر من أو يساوي قطر الصينية (${fmt(p.trayD)} مم) — لا توجد مساحة للطبقة الأولى.`,
    });
  } else if (r1 + toolR > R + 1e-9) {
    warns.push({
      lv: 'err',
      tx: `الهامش (${fmt(p.margin)} مم بالقطر = ${fmt(p.margin / 2)} مم شعاعياً) أصغر من نصف قطر الأداة (${fmt(toolR)} مم): سن الحفر يتجاوز محيط الصينية الخارجي.`,
    });
  }

  if (p.layers > 1 && radialStepMm < p.tool - 1e-9) {
    warns.push({
      lv: 'err',
      tx: `التباعد الشعاعي بين الحلقات (${fmt(radialStepMm)} مم = نصف تباعد القطر ${fmt(p.spacing)} مم) أقل من قطر الأداة (${fmt(p.tool)} مم): يحدث تداخل وتصادم بين الدوائر متحدة المركز.`,
    });
  }

  if (dLast < 0) {
    warns.push({
      lv: 'err',
      tx: `قطر الطبقة الأخيرة سالب (${fmt(dLast)} مم) — تتجاوز المركز! قلل التباعد أو عدد الطبقات.`,
    });
  } else if (dLast < p.tool && d1 > 0) {
    warns.push({
      lv: 'warn',
      tx: `قطر الطبقة الأخيرة (${fmt(dLast)} مم) أصغر من قطر الأداة (${fmt(p.tool)} مم) — قريبة جداً من نقطة المركز.`,
    });
  }

  if (badCount > 0) {
    const affected = layers
      .filter((l) => l.bad > 0)
      .map((l) => 'L' + (l.i + 1))
      .join('، ');
    warns.push({
      lv: 'err',
      tx: `يوجد تداخل بين ${badCount} نقطة (أدنى مسافة ${fmt(minD, 2)} مم < قطر الأداة ${fmt(p.tool)} مم) في الطبقات: ${affected}.`,
    });
  }

  // Sort errors first, then warnings
  warns.sort((a, b) => {
    const weight = { err: 0, warn: 1 };
    return weight[a.lv] - weight[b.lv];
  });

  const totalPts = all.length;
  const totalSteps = layers.reduce((s, l) => s + l.per, 0);

  return {
    R,
    toolR,
    r1,
    rLast,
    d1,
    dLast,
    radialStepMm,
    layers,
    all,
    minD: isFinite(minD) ? minD : 0,
    badCount,
    warns,
    totalPts,
    totalSteps,
    hasErr: warns.some((w) => w.lv === 'err'),
    hasWarn: warns.some((w) => w.lv === 'warn'),
  };
}

export function extractMachineRows(model: TrayModel, p: TrayParams) {
  const rows = [];
  const maxMachineLayers = 7;

  for (let i = 0; i < maxMachineLayers; i++) {
    const layer = model.layers[i];
    const isLayerActive = i < model.layers.length && layer && layer.r > 0;

    let rotationAngle = 0;
    let add = 0;

    if (isLayerActive) {
      rotationAngle = Number(layer.step.toFixed(1));
      add = Number(layer.off.toFixed(1));
    }

    rows.push({
      layer: i + 1,
      rotationAngle,
      add,
      active: isLayerActive,
      holesCount: isLayerActive ? layer.n : 0,
      holesPerHead: isLayerActive ? layer.per : 0,
    });
  }

  return rows;
}

export function calculateTouchWinProcessingTime(model: TrayModel, p: TrayParams): number {
  if (model.layers.length === 0) return 0;

  const dwellSec = p.timing.dwell / 1000; // e.g. 0.10s
  const rotHz = p.rotationSpeedHz || 800;
  const expHz = p.expansionSpeedHz || 800;
  const ppr = p.pulsesPerRev || 10000;
  const ppm = p.pulsesPerMm || 100;

  // Machine mechanical settling & ramp overheads (configurable or calibrated defaults)
  const expRamp = p.timing.rampExpansionSec !== undefined ? p.timing.rampExpansionSec : 0.08;
  const rotRamp = p.timing.rampRotationSec !== undefined ? p.timing.rampRotationSec : 0.035;

  let totalSec = 0;

  // 1. Initial positioning
  const firstExpansionSec = (p.spacing * ppm) / expHz + expRamp;
  totalSec += Math.min(firstExpansionSec, 0.4);

  // 2. Each layer execution
  model.layers.forEach((L, idx) => {
    // Inter-layer expansion
    if (idx > 0) {
      const expTimeSec = (p.spacing * ppm) / expHz + expRamp;
      totalSec += Math.min(expTimeSec, 0.35);
    }

    // Step rotations + drill dwells
    const stepPulses = (L.step * (ppr / 360));
    const rotTimePerStepSec = stepPulses / rotHz + rotRamp; // pulses + mechanical ramp

    // Each head does L.per holes:
    // Holes drill time
    totalSec += L.per * dwellSec;
    // Rotation between holes (per - 1 steps)
    if (L.per > 1) {
      totalSec += (L.per - 1) * rotTimePerStepSec;
    }
  });

  return Number(totalSec.toFixed(2));
}
