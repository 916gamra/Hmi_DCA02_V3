import { TrayParams } from '../types';
import { sanitizeN } from './model';

export interface TriviumRecipeV1 {
  format: 'TRIVIUM-RECIPE-v1';
  version: 1;
  meta?: { name?: string; description?: string; createdAt?: string };
  params: {
    trayD: number;
    tool: number;
    margin: number;
    layers: number;
    spacing: number;
    mode: 'all' | 'custom' | 'machine';
    rawBase?: number;
    addAngle?: number;
    custom?: Array<{ n: number; off: number; stepAngle?: number }>;
    timing?: { dwell: number; index: number; layer: number };
    rotationSpeedHz?: number;
    expansionSpeedHz?: number;
    pulsesPerRev?: number;
    pulsesPerMm?: number;
  };
}

export function validateRecipeParams(partial: Partial<TrayParams>): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof partial.trayD !== 'number' || partial.trayD < 50 || partial.trayD > 2000) {
    errors.push('trayD must be between 50 and 2000');
  }
  if (typeof partial.tool !== 'number' || partial.tool < 0.5 || partial.tool > 50) {
    errors.push('tool must be between 0.5 and 50');
  }
  if (typeof partial.margin !== 'number' || partial.margin < 0 || (partial.trayD && partial.margin >= partial.trayD)) {
    errors.push('margin must be >= 0 and < trayD');
  }
  if (typeof partial.layers !== 'number' || partial.layers < 1 || partial.layers > 7) {
    errors.push('layers must be between 1 and 7');
  }
  if (typeof partial.spacing !== 'number' || partial.spacing <= 0) {
    errors.push('spacing must be > 0');
  }

  if (partial.custom) {
    partial.custom.forEach((c, i) => {
      if (typeof c.n !== 'number' || typeof c.off !== 'number') {
        errors.push(`custom layer ${i} invalid`);
      }
    });
  }

  return { ok: errors.length === 0, errors };
}

export function serializeRecipeV1(params: TrayParams, meta?: TriviumRecipeV1['meta']): string {
  const recipe: TriviumRecipeV1 = {
    format: 'TRIVIUM-RECIPE-v1',
    version: 1,
    meta,
    params: {
      trayD: params.trayD,
      tool: params.tool,
      margin: params.margin,
      layers: params.layers,
      spacing: params.spacing,
      mode: params.mode,
      rawBase: params.rawBase,
      addAngle: params.addAngle,
      custom: params.custom,
      timing: params.timing,
      rotationSpeedHz: params.rotationSpeedHz,
      expansionSpeedHz: params.expansionSpeedHz,
      pulsesPerRev: params.pulsesPerRev,
      pulsesPerMm: params.pulsesPerMm,
    },
  };
  return JSON.stringify(recipe);
}

export function parseRecipeV1(jsonOrObject: string | any): { ok: boolean; params?: TrayParams; meta?: TriviumRecipeV1['meta']; errors: string[] } {
  try {
    const data = typeof jsonOrObject === 'string' ? JSON.parse(jsonOrObject) : jsonOrObject;

    if (data.format !== 'TRIVIUM-RECIPE-v1' || data.version !== 1) {
      return { ok: false, errors: ['Invalid format or version'] };
    }

    const validation = validateRecipeParams(data.params);
    if (!validation.ok) {
      return { ok: false, errors: validation.errors };
    }

    // Convert V1 params to full TrayParams (filling missing defaults if necessary)
    const params = {
      ...data.params,
      trayDDisplay: data.params.trayD / (data.params.trayU === 'cm' ? 10 : 1), // Need to handle unit properly, V1 only stores mm
      trayU: 'mm', // Normalize to mm
      marginDisplay: data.params.margin / (data.params.marginU === 'cm' ? 10 : 1),
      marginU: 'mm',
      spacingDisplay: data.params.spacing,
      spacingU: 'mm',
      rLast: 100, // Default fallback
      rLastDisplay: 100,
      rLastU: 'mm',
    } as TrayParams;

    return { ok: true, params, meta: data.meta, errors: [] };
  } catch (e) {
    return { ok: false, errors: ['Failed to parse JSON'] };
  }
}
