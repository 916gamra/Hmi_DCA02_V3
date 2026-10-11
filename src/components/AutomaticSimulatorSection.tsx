import React from 'react';
import { CanvasStage } from './CanvasStage';
import { SimulationControls } from './SimulationControls';
import { ValidationCard } from './ValidationCard';
import { TrayModel, SimulationState, ViewOptions, TrayParams } from '../types';
import { Translations, Language } from '../core/i18n';

interface AutomaticSimulatorSectionProps {
  model: TrayModel;
  state: SimulationState | null;
  options: ViewOptions;
  onChangeOptions: (opts: ViewOptions) => void;
  currentTimeMs: number;
  totalTimeMs: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onScrubTime: (ms: number) => void;
  onChangeSpeed: (spd: number) => void;
  onOpenSaveModal: () => void;
  onOpenQr: () => void;
  params: TrayParams;
  totalCycleTimeMs: number;
  t: Translations;
  lang: Language;
}

export const AutomaticSimulatorSection: React.FC<AutomaticSimulatorSectionProps> = ({
  model,
  state,
  options,
  onChangeOptions,
  currentTimeMs,
  totalTimeMs,
  isPlaying,
  speed,
  onTogglePlay,
  onReset,
  onStepNext,
  onStepPrev,
  onScrubTime,
  onChangeSpeed,
  onOpenSaveModal,
  onOpenQr,
  params,
  totalCycleTimeMs,
  t,
  lang,
}) => {
  return (
    <section className="flex flex-col gap-4 md:gap-5 w-full min-w-0 select-none">
      {/* 1. Interactive Canvas Stage */}
      <CanvasStage
        model={model}
        state={state}
        options={options}
        onChangeOptions={onChangeOptions}
        t={t}
        lang={lang}
      />

      {/* 2. Simulation Controls & Scrubber */}
      <SimulationControls
        model={model}
        state={state}
        currentTimeMs={currentTimeMs}
        totalTimeMs={totalTimeMs}
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={onTogglePlay}
        onReset={onReset}
        onStepNext={onStepNext}
        onStepPrev={onStepPrev}
        onScrubTime={onScrubTime}
        onChangeSpeed={onChangeSpeed}
        onOpenSaveModal={onOpenSaveModal}
        onOpenQr={onOpenQr}
        t={t}
        lang={lang}
      />

      {/* 3. Verification, KPIs & Details Table */}
      <ValidationCard
        model={model}
        params={params}
        totalCycleTimeMs={totalCycleTimeMs}
        t={t}
        lang={lang}
      />
    </section>
  );
};
