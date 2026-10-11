import { describe, it, expect } from 'vitest';
import { sanitizeN, buildModel } from '../model';
import { buildTimeline } from '../timeline';
import { DEFAULT_PARAMS } from '../constants';
import { TrayParams } from '../../types';

describe('sanitizeN logic', () => {
  it('correctly rounds to nearest multiple of 3 for 3-head synchronization', () => {
    expect(sanitizeN(12)).toBe(12);
    expect(sanitizeN(13)).toBe(12);
    expect(sanitizeN(14)).toBe(15);
    expect(sanitizeN(23)).toBe(24);
    expect(sanitizeN(30)).toBe(30);
  });

  it('clamps minimum to 3 and maximum to 120', () => {
    expect(sanitizeN(0)).toBe(3);
    expect(sanitizeN(-10)).toBe(3);
    expect(sanitizeN(500)).toBe(120);
  });

  it('allows arbitrary integer when enforceMultipleOf3 is false', () => {
    expect(sanitizeN(14, false)).toBe(14);
    expect(sanitizeN(25, false)).toBe(25);
  });
});

describe('buildModel geometry & clearances', () => {
  it('builds a valid geometry model from default parameters', () => {
    const model = buildModel(DEFAULT_PARAMS);

    expect(model.R).toBe(DEFAULT_PARAMS.trayD / 2);
    expect(model.d1).toBe(DEFAULT_PARAMS.trayD - DEFAULT_PARAMS.margin);
    expect(model.r1).toBe(model.d1 / 2);
    expect(model.layers.length).toBe(DEFAULT_PARAMS.layers);
    expect(model.all.length).toBeGreaterThan(0);
    expect(model.totalPts).toBe(model.all.length);
  });

  it('calculates layer diameters correctly based on spacing law', () => {
    const testParams: TrayParams = {
      ...DEFAULT_PARAMS,
      trayD: 300,
      margin: 20,
      layers: 3,
      spacing: 30,
    };
    const model = buildModel(testParams);

    // D1 = 300 - 20 = 280
    expect(model.d1).toBe(280);
    // L1 diameter = 280 (r = 140)
    expect(model.layers[0].r).toBe(140);
    // L2 diameter = 280 - 30 = 250 (r = 125)
    expect(model.layers[1].r).toBe(125);
    // L3 diameter = 250 - 30 = 220 (r = 110)
    expect(model.layers[2].r).toBe(110);
    expect(model.dLast).toBe(220);
    expect(model.rLast).toBe(110);
  });

  it('detects clearance error when holes overlap within tool diameter', () => {
    const collisionParams: TrayParams = {
      ...DEFAULT_PARAMS,
      trayD: 200,
      margin: 10,
      tool: 10, // large tool
      layers: 2,
      spacing: 4, // radial step = 2mm < tool 10mm -> concentric layer collision
    };
    const model = buildModel(collisionParams);

    expect(model.hasErr).toBe(true);
    expect(model.warns.some((w) => w.lv === 'err')).toBe(true);
  });

  it('correctly builds model in machine mode', () => {
    const machineParams: TrayParams = {
      ...DEFAULT_PARAMS,
      mode: 'machine',
    };
    const model = buildModel(machineParams);

    expect(model.layers.length).toBe(machineParams.layers);
    expect(model.all.length).toBeGreaterThan(0);
  });
});

describe('buildTimeline execution timing', () => {
  it('generates chronological actions and positive total duration', () => {
    const model = buildModel(DEFAULT_PARAMS);
    const timeline = buildTimeline(model, DEFAULT_PARAMS.timing);

    expect(timeline.total).toBeGreaterThan(0);
    expect(timeline.acts.length).toBeGreaterThan(0);

    // Check action ordering
    for (let i = 1; i < timeline.acts.length; i++) {
      expect(timeline.acts[i].t0).toBeGreaterThanOrEqual(timeline.acts[i - 1].t0);
    }
  });

  it('includes reposition, indexing, and firing actions for each layer', () => {
    const model = buildModel(DEFAULT_PARAMS);
    const timeline = buildTimeline(model, DEFAULT_PARAMS.timing);

    const reposActions = timeline.acts.filter((a) => a.type === 'repos');
    const fireActions = timeline.acts.filter((a) => a.type === 'fire');

    expect(reposActions.length).toBe(model.layers.length);
    expect(fireActions.length).toBe(model.totalSteps);
  });
});
