import { useState, useEffect, useCallback } from 'react';
import { RecipePreset, TrayParams } from '../types';
import { downloadFile } from '../core/recipe';

const CUSTOM_PRESETS_STORAGE_KEY = 'hmi-tray-custom-presets';

export function usePresets(currentParams: TrayParams) {
  const [customPresets, setCustomPresets] = useState<RecipePreset[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load custom presets from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(customPresets));
    } catch (e) {
      console.warn('Failed to save custom presets:', e);
    }
  }, [customPresets]);

  const saveCustomPreset = useCallback(
    (
      title: string,
      description: string,
      lang: 'ar' | 'fr' = 'ar',
      overrideParams?: TrayParams
    ) => {
      const newPreset: RecipePreset = {
        id: `custom-recipe-${Date.now()}`,
        name: title,
        nameFr: title,
        description: description,
        descriptionFr: description,
        tag: lang === 'ar' ? 'مخصصة 🌟' : 'Personnalisée 🌟',
        tagFr: 'Personnalisée 🌟',
        params: overrideParams ? { ...overrideParams } : { ...currentParams },
      };
      setCustomPresets((prev) => [newPreset, ...prev]);
      return newPreset;
    },
    [currentParams]
  );

  const deleteCustomPreset = useCallback((presetId: string) => {
    setCustomPresets((prev) => prev.filter((p) => p.id !== presetId));
  }, []);

  const exportPresets = useCallback(() => {
    const dataStr = JSON.stringify(customPresets, null, 2);
    downloadFile(`tray_custom_presets_${Date.now()}.json`, dataStr, 'application/json');
  }, [customPresets]);

  const importPresets = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onSuccess?: (count: number) => void,
      onError?: (err: string) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            const valid = imported.filter(
              (p) => p && typeof p === 'object' && p.params && typeof p.params.trayD === 'number'
            );
            if (valid.length > 0) {
              setCustomPresets((prev) => [...valid, ...prev]);
              if (onSuccess) onSuccess(valid.length);
            } else if (onError) {
              onError('الملف لا يحتوي على وصفات صالحة.');
            }
          } else if (
            imported &&
            typeof imported === 'object' &&
            imported.params &&
            typeof imported.params.trayD === 'number'
          ) {
            const single = {
              ...imported,
              id:
                typeof imported.id === 'string' && imported.id.startsWith('custom-')
                  ? imported.id
                  : `custom-imported-${Date.now()}`,
            };
            setCustomPresets((prev) => [single, ...prev]);
            if (onSuccess) onSuccess(1);
          } else if (onError) {
            onError('الملف لا يحتوي على وصفة صالحة.');
          }
        } catch {
          if (onError) onError('فشل قراءة ملف الوصفات.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    []
  );

  return {
    customPresets,
    setCustomPresets,
    saveCustomPreset,
    deleteCustomPreset,
    exportPresets,
    importPresets,
  };
}
