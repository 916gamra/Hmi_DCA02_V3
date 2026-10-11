import { TrayParams, TrayModel } from '../types';
import { HEADS } from './constants';
import { parseRecipeV1 } from './recipeFormat';

export function generatePlcJson(p: TrayParams, model: TrayModel, totalCycleMs: number): string {
  const data = {
    protocol: 'TouchWin-PLC/HMI-v3',
    device: '3-HEAD-ROTARY-TRAY-DRILLER',
    generated_at: new Date().toISOString(),
    geometry: {
      tray_diameter_mm: Number(p.trayD.toFixed(3)),
      tray_radius_mm: Number(model.R.toFixed(3)),
      tool_diameter_mm: p.tool,
      outer_margin_mm: Number(p.margin.toFixed(3)),
      concentric_layers_count: model.layers.length,
      radial_spacing_mm: Number(p.spacing.toFixed(3)),
      min_clearance_mm: Number(model.minD.toFixed(3)),
    },
    heads: HEADS.map((h) => ({
      id: h.id,
      angle_deg: h.angle,
    })),
    timings_ms: {
      dwell_plunge: p.timing.dwell,
      index_rotate: p.timing.index,
      layer_reposition: p.timing.layer,
      total_cycle_estimated: Math.round(totalCycleMs),
    },
    totals: {
      total_holes: model.totalPts,
      steps_per_head: model.totalSteps,
      safe_validated: !model.hasErr,
    },
    layers: model.layers.map((L) => ({
      layer_number: L.i + 1,
      radius_mm: Number(L.r.toFixed(3)),
      holes_total: L.n,
      holes_per_head: L.per,
      step_angle_deg: Number(L.step.toFixed(4)),
      offset_deg: Number(L.off.toFixed(4)),
      points: L.pts.map((q) => ({
        index: q.k + 1,
        head_id: HEADS[q.head].id,
        head_step: q.j + 1,
        angle_deg: Number(q.a.toFixed(4)),
        x_mm: Number(q.x.toFixed(3)),
        y_mm: Number(q.y.toFixed(3)),
      })),
    })),
  };

  return JSON.stringify(data, null, 2);
}

export function generateCsvPoints(model: TrayModel): string {
  const headers = [
    'Layer',
    'Point_Index',
    'Head_ID',
    'Head_Step',
    'Angle_Deg',
    'X_mm',
    'Y_mm',
    'Radius_mm',
  ];

  const rows: string[] = [headers.join(',')];

  model.layers.forEach((L) => {
    L.pts.forEach((q) => {
      rows.push(
        [
          L.i + 1,
          q.k + 1,
          HEADS[q.head].id,
          q.j + 1,
          q.a.toFixed(4),
          q.x.toFixed(3),
          q.y.toFixed(3),
          L.r.toFixed(3),
        ].join(',')
      );
    });
  });

  return '\ufeff' + rows.join('\r\n');
}

export function generateCompactQrPayload(p: TrayParams, model: TrayModel, totalCycleMs: number): string {
  // A compact human & machine-readable payload suitable for QR codes (<500 chars)
  const layerSummary = model.layers
    .map((l) => `L${l.i + 1}:${l.r.toFixed(1)}mmx${l.n}pts@${l.off.toFixed(1)}°`)
    .join('|');

  const compact = {
    M: 'TRAY3H',
    D: p.trayD,
    T: p.tool,
    Mgn: p.margin,
    L: model.layers.length,
    Holes: model.totalPts,
    CycSec: Math.round(totalCycleMs / 1000),
    Safe: !model.hasErr ? 1 : 0,
    Lays: layerSummary,
  };

  return JSON.stringify(compact);
}

export function generateRecipeGCode(p: TrayParams, model?: TrayModel): string {
  const lines = [
    '; TRIVIUM-GCODE-v1',
    '; name: Exported Recipe',
    'FORMAT=TRIVIUM-GCODE-v1',
    `TRAY_D=${p.trayD.toFixed(3)}`,
    `TOOL=${p.tool.toFixed(3)}`,
    `MARGIN=${p.margin.toFixed(3)}`,
    `LAYERS=${p.layers}`,
    `SPACING=${p.spacing.toFixed(3)}`,
    `MODE=${p.mode}`,
    `ROT_HZ=${(p.rotationSpeedHz ?? 800).toFixed(3)}`,
    `EXP_HZ=${(p.expansionSpeedHz ?? 800).toFixed(3)}`,
    `DWELL_MS=${p.timing.dwell}`,
    `INDEX_MS=${p.timing.index}`,
    `LAYER_MS=${p.timing.layer}`,
  ];

  if (p.custom) {
    p.custom.forEach((c, i) => {
      lines.push(`L${i + 1}_N=${c.n} L${i + 1}_STEP=${(c.stepAngle ?? 360/c.n).toFixed(4)} L${i + 1}_OFF=${c.off.toFixed(4)}`);
    });
  }

  return lines.join('\n');
}

export function parseRecipeGCode(text: string): { params: Partial<TrayParams> | null; error?: string } {
  const params: Partial<TrayParams> = { timing: { dwell: 100, index: 120, layer: 400 } };
  const custom: Array<{ n: number; off: number; stepAngle?: number }> = [];

  const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith(';'));
  
  try {
    lines.forEach(line => {
      if (line.startsWith('TRAY_D=')) params.trayD = params.trayDDisplay = parseFloat(line.split('=')[1]);
      else if (line.startsWith('TOOL=')) params.tool = parseFloat(line.split('=')[1]);
      else if (line.startsWith('MARGIN=')) params.margin = params.marginDisplay = parseFloat(line.split('=')[1]);
      else if (line.startsWith('LAYERS=')) params.layers = parseInt(line.split('=')[1], 10);
      else if (line.startsWith('SPACING=')) params.spacing = params.spacingDisplay = parseFloat(line.split('=')[1]);
      else if (line.startsWith('MODE=')) params.mode = line.split('=')[1] as any;
      else if (line.startsWith('ROT_HZ=')) params.rotationSpeedHz = parseFloat(line.split('=')[1]);
      else if (line.startsWith('EXP_HZ=')) params.expansionSpeedHz = parseFloat(line.split('=')[1]);
      else if (line.startsWith('DWELL_MS=')) params.timing!.dwell = parseInt(line.split('=')[1], 10);
      else if (line.startsWith('INDEX_MS=')) params.timing!.index = parseInt(line.split('=')[1], 10);
      else if (line.startsWith('LAYER_MS=')) params.timing!.layer = parseInt(line.split('=')[1], 10);
      else if (line.includes('_N=')) {
        const parts = line.split(' ');
        const c: any = {};
        parts.forEach(p => {
          const [key, val] = p.split('=');
          if (key.endsWith('_N')) c.n = parseInt(val, 10);
          else if (key.endsWith('_STEP')) c.stepAngle = parseFloat(val);
          else if (key.endsWith('_OFF')) c.off = parseFloat(val);
        });
        custom.push(c);
      }
    });

    // Validation
    if (params.trayD !== undefined && (params.trayD < 50 || params.trayD > 2000)) {
        return { params: null, error: 'Tray diameter out of range (50-2000mm)' };
    }
    if (params.layers !== undefined && (params.layers < 1 || params.layers > 7)) {
        return { params: null, error: 'Layers must be between 1 and 7' };
    }

    if (custom.length > 0) params.custom = custom;
    return { params };
  } catch (e) {
    return { params: null, error: 'Failed to parse G-code' };
  }
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function parseJsonRecipeToParams(jsonStr: string): Partial<TrayParams> | null {
  // 0. Try new V1 format first
  const v1 = parseRecipeV1(jsonStr);
  if (v1.ok && v1.params) return v1.params;

  try {
    const raw = JSON.parse(jsonStr);
    if (!raw || typeof raw !== 'object') return null;

    // 1. If it's a RecipePreset object: { params: { ... } }
    if (raw.params && typeof raw.params.trayD === 'number') {
      return raw.params as Partial<TrayParams>;
    }

    // 2. If it's an exported PLC JSON object: { geometry: { tray_diameter_mm: ... } }
    if (raw.geometry && typeof raw.geometry.tray_diameter_mm === 'number') {
      const g = raw.geometry;
      const res: Partial<TrayParams> = {
        trayD: g.tray_diameter_mm,
        trayDDisplay: g.tray_diameter_mm,
        tool: g.tool_diameter_mm || 3.5,
        margin: g.outer_margin_mm ?? 25,
        marginDisplay: g.outer_margin_mm ?? 25,
        layers: g.concentric_layers_count || 4,
        spacing: g.radial_spacing_mm || 19.5,
        spacingDisplay: g.radial_spacing_mm || 19.5,
      };
      if (Array.isArray(raw.layers) && raw.layers.length > 0) {
        res.custom = raw.layers.map((l: any) => ({
          n: l.holes_total || 12,
          off: l.offset_deg || 0,
          stepAngle: l.step_angle_deg,
        }));
        res.mode = 'custom';
      }
      return res;
    }

    // 3. Compact QR format { M: 'TRAY3H', D: 350, ... }
    if (raw.M === 'TRAY3H' || raw.D !== undefined) {
      const res: Partial<TrayParams> = {};
      if (typeof raw.D === 'number') {
        res.trayD = raw.D;
        res.trayDDisplay = raw.D;
      }
      if (typeof raw.T === 'number') res.tool = raw.T;
      if (typeof raw.Mgn === 'number') {
        res.margin = raw.Mgn;
        res.marginDisplay = raw.Mgn;
      }
      if (typeof raw.L === 'number') res.layers = raw.L;
      return res;
    }

    // 4. Raw TrayParams
    if (typeof raw.trayD === 'number') {
      return raw as Partial<TrayParams>;
    }
  } catch (e) {
    console.warn('Failed to parse JSON recipe:', e);
  }
  return null;
}

export function parseCsvPointsToParams(csvContent: string): Partial<TrayParams> | null {
  try {
    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) return null;

    // Filter out header line
    const dataLines = lines.filter((l) => !l.startsWith('Layer') && !l.startsWith('#'));
    if (dataLines.length === 0) return null;

    // Map rows: Layer, Point_Index, Head_ID, Head_Step, Angle_Deg, X_mm, Y_mm, Radius_mm
    const layerRadiiMap = new Map<number, number>();
    const layerHolesMap = new Map<number, number>();

    dataLines.forEach((line) => {
      const parts = line.split(',');
      if (parts.length >= 8) {
        const layerNum = parseInt(parts[0], 10);
        const radius = parseFloat(parts[7]);
        if (!isNaN(layerNum) && !isNaN(radius)) {
          if (!layerRadiiMap.has(layerNum)) {
            layerRadiiMap.set(layerNum, radius);
            layerHolesMap.set(layerNum, 0);
          }
          layerHolesMap.set(layerNum, (layerHolesMap.get(layerNum) || 0) + 1);
        }
      }
    });

    const layerNums = Array.from(layerRadiiMap.keys()).sort((a, b) => a - b);
    if (layerNums.length === 0) return null;

    const r1 = layerRadiiMap.get(layerNums[0]) || 162.5;
    const r2 = layerNums.length > 1 ? (layerRadiiMap.get(layerNums[1]) || r1 - 9.75) : r1 - 10;
    const spacing = Number((Math.abs(r1 - r2) * 2).toFixed(1));
    const margin = 25;
    const trayD = Number((r1 * 2 + margin).toFixed(1));

    const custom = layerNums.map((num) => ({
      n: layerHolesMap.get(num) || 12,
      off: 0,
    }));

    return {
      trayD,
      trayDDisplay: trayD,
      margin,
      marginDisplay: margin,
      layers: Math.min(7, Math.max(1, layerNums.length)),
      spacing: Math.max(1, spacing),
      spacingDisplay: Math.max(1, spacing),
      custom,
      mode: 'custom',
    };
  } catch (e) {
    console.warn('Failed to parse CSV points:', e);
  }
  return null;
}
