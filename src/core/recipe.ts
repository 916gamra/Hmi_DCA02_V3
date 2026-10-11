import { TrayParams, TrayModel } from '../types';
import { HEADS } from './constants';

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
