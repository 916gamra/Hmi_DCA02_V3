import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TrayModel, TrayParams } from '../types';
import { fmtTime } from '../core/timeline';
import { fmt } from '../core/model';
import { LAYER_COLORS } from '../core/constants';
import { Translations, Language, translations } from '../core/i18n';

interface ValidationCardProps {
  model: TrayModel;
  params: TrayParams;
  totalCycleTimeMs: number;
  t?: Translations;
  lang?: Language;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  model,
  params,
  totalCycleTimeMs,
  t: propT,
  lang = 'ar',
}) => {
  const t = propT || translations[lang];
  const isClearanceSafe = model.minD >= params.tool - 1e-6;

  return (
    <div className="oneui-card p-5 flex flex-col gap-5 select-none" dir="ltr">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <h2 className="text-base font-bold text-[#0f172a]">
            {t.kpisTitle}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-[#64748b]">
          {model.totalPts} {lang === 'ar' ? 'ثقب حفر' : 'trous'}
        </span>
      </div>

      {/* 1. KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* KPI 1: D1 & R1 */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 flex flex-col gap-0.5 text-left">
          <span className="text-[11px] font-semibold text-[#64748b]">{t.d1Label}</span>
          <strong className="text-sm md:text-base font-mono font-bold text-[#0f172a]">
            {fmt(model.d1)} mm
          </strong>
          <span className="text-[10px] text-[#64748b] font-mono">R₁ = {fmt(model.r1)} mm</span>
        </div>

        {/* KPI 2: Last Layer Diameter & Radius */}
        <div
          className={`border rounded-2xl p-3 flex flex-col gap-0.5 text-left ${
            model.rLast < model.toolR
              ? 'bg-red-50 border-red-200'
              : 'bg-[#f8fafc] border-[#e2e8f0]'
          }`}
        >
          <span className="text-[11px] font-semibold text-[#64748b]">{t.dLastLabel}</span>
          <strong
            className={`text-sm md:text-base font-mono font-bold ${
              model.rLast < model.toolR ? 'text-red-600' : 'text-[#0f172a]'
            }`}
          >
            {fmt(model.dLast)} mm
          </strong>
          <span className="text-[10px] text-[#64748b] font-mono">R_fin = {fmt(model.rLast)} mm</span>
        </div>

        {/* KPI 3: Total Points */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 flex flex-col gap-0.5 text-left">
          <span className="text-[11px] font-semibold text-[#64748b]">{t.totalHoles}</span>
          <strong className="text-sm md:text-base font-mono font-bold text-[#2563eb]">
            {model.totalPts}
          </strong>
        </div>

        {/* KPI 4: Steps per Head */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 flex flex-col gap-0.5 text-left">
          <span className="text-[11px] font-semibold text-[#64748b]">{t.totalSteps}</span>
          <strong className="text-sm md:text-base font-mono font-bold text-[#0f172a]">
            {model.totalSteps} {lang === 'ar' ? 'خطوة' : 'pas'}
          </strong>
        </div>

        {/* KPI 5: Cycle Time */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 flex flex-col gap-0.5 text-left">
          <span className="text-[11px] font-semibold text-[#64748b]">{t.cycleTime}</span>
          <strong className="text-sm md:text-base font-mono font-bold text-[#059669]">
            {fmtTime(totalCycleTimeMs)}
          </strong>
        </div>

        {/* KPI 6: Minimum Clearance Distance */}
        <div
          className={`border rounded-2xl p-3 flex flex-col gap-0.5 text-left ${
            isClearanceSafe
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <span className="text-[11px] font-semibold text-[#64748b]">{t.minClearance}</span>
          <strong
            className={`text-sm md:text-base font-mono font-bold ${
              isClearanceSafe ? 'text-[#059669]' : 'text-red-600'
            }`}
          >
            {fmt(model.minD, 2)} mm
          </strong>
        </div>
      </div>

      {/* 2. Mathematical Verification & Spacing Logic Document */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 text-left">
        <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
          <span>
            {lang === 'ar'
              ? '📐 توثيق المنطق الرياضي للتباعد المتساوي:'
              : '📐 Documentation mathématique de l\'espacement régulier :'}
          </span>
          <span className="text-[11px] text-[#2563eb] font-mono">
            {params.layers} {lang === 'ar' ? 'حلقات متحدة المركز' : 'anneaux concentriques'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[#64748b] block text-[11px] font-semibold">
                {lang === 'ar' ? '1. محيط أول طبقة (D₁):' : '1. Périmètre 1ère couche (D₁) :'}
              </span>
              <strong className="text-[#0f172a] font-mono block mt-1 text-sm">
                D₁ = {params.trayD} − {params.margin} = {fmt(model.d1)} mm
              </strong>
            </div>
            <span className="text-[10px] text-[#64748b] mt-1.5 block">
              {lang === 'ar'
                ? `قطر الصينية (${params.trayD} مم) − الهامش (${params.margin} مم) المقاس يدوياً`
                : `Diamètre plateau (${params.trayD} mm) − Marge (${params.margin} mm) mesurée`}
            </span>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[#64748b] block text-[11px] font-semibold">
                {lang === 'ar' ? '2. التباعد المتساوي (ΔD):' : '2. Espacement régulier (ΔD) :'}
              </span>
              <strong className="text-[#2563eb] font-mono block mt-1 text-sm">
                ΔD = ({fmt(model.d1)} − {fmt(model.dLast)}) ÷ ({params.layers} − 1) = {params.spacing} mm
              </strong>
            </div>
            <span className="text-[10px] text-[#64748b] mt-1.5 block">
              {lang === 'ar'
                ? 'توزيع متساوٍ بين محيط أول طبقة وآخر طبقة'
                : 'Distribution uniforme entre 1ère couche et dernière couche'}
            </span>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[#64748b] block text-[11px] font-semibold">
                {lang === 'ar' ? '3. حركة السيرفو بالآلة:' : '3. Course servomoteur machine :'}
              </span>
              <strong className="text-[#059669] font-mono block mt-1 text-sm">
                {fmt(model.radialStepMm)} mm ({params.spacing} ÷ 2)
              </strong>
            </div>
            <span className="text-[10px] text-[#64748b] mt-1.5 block">
              {lang === 'ar'
                ? 'طول التمدد (expansion length) في شاشة الآلة'
                : 'expansion length sur l\'écran TouchWin'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Warnings & Errors Section */}
      <div className="flex flex-col gap-2 text-left">
        {model.warns.length > 0 ? (
          model.warns.map((w, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-3 rounded-2xl text-xs font-semibold leading-relaxed border ${
                w.lv === 'err'
                  ? 'bg-red-50/80 border-red-200 text-red-700'
                  : 'bg-amber-50/80 border-amber-200 text-amber-800'
              }`}
            >
              {w.lv === 'err' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>{w.tx}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>
              {lang === 'ar'
                ? 'جميع الحسابات الهندسية ممتازة: أبعاد الصينية ضمن الحدود الآمنة، لا يوجد تداخل بين الثقوب، وكل الحلقات متوافقة مع الرؤوس الثلاثة.'
                : 'Tous les calculs géométriques sont conformes : aucune collision, entraxes respectés et compatibilité 3 têtes validée.'}
            </span>
          </div>
        )}
      </div>

      {/* 4. Layers Breakdown Table (Always LTR French Layout) */}
      <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0]">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] text-[#64748b] border-b border-[#e2e8f0]">
              <th className="py-2.5 px-3 font-bold text-left">{t.tableLayer}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tableDiam}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tableRadius}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tablePoints}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tableStep}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tablePerHead}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tableOffset}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tableMinDist}</th>
              <th className="py-2.5 px-3 font-bold text-center">{t.tableStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {model.layers.map((l) => {
              const color = LAYER_COLORS[l.i % LAYER_COLORS.length];
              const isLayerSafe = l.bad === 0 && l.r > 0;
              const diameter = l.r * 2;

              return (
                <tr key={l.i} className="hover:bg-[#f8fafc]/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold flex items-center gap-2 text-left">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span>L{l.i + 1}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#0f172a]">
                    {fmt(diameter, 1)} mm
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#64748b]">
                    {fmt(l.r, 1)} mm
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#2563eb]">
                    {l.n}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#64748b]">
                    {fmt(l.step, 2)}°
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#0f172a]">
                    {l.per}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#64748b]">
                    {fmt(l.off, 1)}°
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#0f172a]">
                    {isFinite(l.minD) ? fmt(l.minD, 2) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {isLayerSafe ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                        {t.statusOk}
                      </span>
                    ) : (
                      <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-200 text-[11px]">
                        {t.statusOverlap}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
