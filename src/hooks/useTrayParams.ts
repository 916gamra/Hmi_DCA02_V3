import { useState, useEffect, useCallback } from 'react';
import { TrayParams } from '../types';
import { DEFAULT_PARAMS } from '../core/constants';

export const STORAGE_KEY = 'hmi-tray-designer-oneui8-v3';
export const STORAGE_SCHEMA_VERSION = 3;

interface StoredParametersPayload {
  version: number;
  params: Partial<TrayParams>;
}

export function loadInitialParams(): TrayParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const payload = parsed as StoredParametersPayload;
        const candidate =
          payload.version === STORAGE_SCHEMA_VERSION
            ? payload.params
            : (parsed as Partial<TrayParams>);
        if (
          typeof candidate.trayD === 'number' &&
          candidate.trayD > 0 &&
          typeof candidate.layers === 'number' &&
          candidate.layers > 0 &&
          typeof candidate.spacing === 'number' &&
          Array.isArray(candidate.custom)
        ) {
          return { ...DEFAULT_PARAMS, ...candidate };
        }
      }
    }

    // Attempt migration from v2 or legacy keys if available
    const oldV2 = localStorage.getItem('hmi-tray-designer-oneui8-v2');
    if (oldV2) {
      try {
        const candidateOld = JSON.parse(oldV2);
        if (
          typeof candidateOld.trayD === 'number' &&
          candidateOld.trayD > 0 &&
          typeof candidateOld.layers === 'number'
        ) {
          localStorage.removeItem('hmi-tray-designer-oneui8-v2');
          return { ...DEFAULT_PARAMS, ...candidateOld };
        }
      } catch {
        localStorage.removeItem('hmi-tray-designer-oneui8-v2');
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved parameters, resetting to default:', e);
  }
  return DEFAULT_PARAMS;
}

export function useTrayParams(onParamsChange?: () => void) {
  const [params, setParams] = useState<TrayParams>(loadInitialParams);

  // Synchronize params to localStorage with schema version
  useEffect(() => {
    try {
      const payload: StoredParametersPayload = {
        version: STORAGE_SCHEMA_VERSION,
        params,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save parameters to localStorage:', e);
    }
  }, [params]);

  const updateParams = useCallback(
    (updated: Partial<TrayParams>) => {
      setParams((prev) => ({ ...prev, ...updated }));
      if (onParamsChange) {
        onParamsChange();
      }
    },
    [onParamsChange]
  );

  const resetDefaultParams = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    if (onParamsChange) {
      onParamsChange();
    }
  }, [onParamsChange]);

  const autoCalculateSpacing = useCallback(
    (
      onSuccess?: (msg: string) => void,
      onError?: (msg: string) => void,
      lang: 'ar' | 'fr' = 'ar'
    ) => {
      if (params.layers <= 1) {
        if (onError) {
          onError(
            lang === 'ar'
              ? 'طبقة واحدة فقط — لا حاجة لحساب التباعد.'
              : "Une seule couche — pas d'espacement nécessaire."
          );
        }
        return false;
      }

      const d1 = params.trayD - params.margin;
      const targetDLast = params.rLast;
      const calculatedSpacing = (d1 - targetDLast) / (params.layers - 1);

      if (calculatedSpacing <= 0) {
        if (onError) {
          onError(
            lang === 'ar'
              ? 'قطر آخر حلقة المستهدف أكبر من أو يساوي قطر الطبقة الأولى D₁.'
              : 'Le diamètre de fin est supérieur ou égal au diamètre D₁.'
          );
        }
        return false;
      }

      const radialDelta = calculatedSpacing / 2;
      if (radialDelta < params.tool && onError) {
        onError(
          lang === 'ar'
            ? `تنبيه: تباعد القطر (${calculatedSpacing.toFixed(1)} مم) يعطي مسافة شعاعية (${radialDelta.toFixed(1)} مم) أقل من قطر الأداة (${params.tool} مم)، قد يحدث تداخل!`
            : `Avertissement: course radiale (${radialDelta.toFixed(1)} mm) < diamètre outil (${params.tool} mm) !`
        );
      }

      const rounded = Math.round(calculatedSpacing * 10) / 10;
      updateParams({
        spacing: rounded,
        spacingDisplay:
          params.spacingU === 'cm' ? Number((rounded / 10).toFixed(1)) : rounded,
      });

      if (onSuccess) {
        onSuccess(
          lang === 'ar'
            ? `تم حساب التباعد تلقائياً: ${rounded} مم (حركة شعاعية ${(rounded / 2).toFixed(1)} مم)`
            : `Espacement calculé : ${rounded} mm`
        );
      }
      return true;
    },
    [params, updateParams]
  );

  return {
    params,
    setParams,
    updateParams,
    resetDefaultParams,
    autoCalculateSpacing,
  };
}
