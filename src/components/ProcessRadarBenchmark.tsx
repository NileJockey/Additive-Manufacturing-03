import React, { useState } from 'react';
import { PROCESS_BENCHMARK_TABLE, RADAR_PROFILES, RadarProcessProfile } from '../data/dmdData';

const AXES: { key: keyof RadarProcessProfile['scores']; label: string; angleDeg: number }[] = [
  { key: 'multiMaterialFgm', label: 'MULTI-MATERIAL / FGM', angleDeg: -90 },
  { key: 'repairCapability', label: '3D CURVED REPAIR', angleDeg: -30 },
  { key: 'buildEnvelopeScale', label: 'BUILD ENVELOPE SCALE', angleDeg: 30 },
  { key: 'depositionRate', label: 'DEPOSITION RATE', angleDeg: 90 },
  { key: 'dimensionalPrecision', label: 'SURFACE & FEATURE RES.', angleDeg: 150 },
  { key: 'lowThermalDistortion', label: 'LOW THERMAL HAZ', angleDeg: 210 },
];

export const ProcessRadarBenchmark: React.FC = () => {
  const [visibleProcessIds, setVisibleProcessIds] = useState<string[]>(['dmd', 'lpbf', 'waam']);

  const toggleProcess = (id: string) => {
    if (visibleProcessIds.includes(id)) {
      if (visibleProcessIds.length > 1) {
        setVisibleProcessIds(visibleProcessIds.filter((item) => item !== id));
      }
    } else {
      setVisibleProcessIds([...visibleProcessIds, id]);
    }
  };

  const centerX = 210;
  const centerY = 165;
  const maxRadius = 110;

  const getCoordinates = (angleDeg: number, valuePct: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const r = (valuePct / 100) * maxRadius;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };

  return (
    <div className="space-y-8">
      {/* Radar + Process Capability Comparison Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Multi-Process Capability Envelope: DMD vs. L-PBF vs. WAAM
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalized engineering index (0–100) across six foundational metal manufacturing axes
            </p>
          </div>

          {/* Interactive Process Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {RADAR_PROFILES.map((profile) => {
              const isVisible = visibleProcessIds.includes(profile.id);
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => toggleProcess(profile.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                    isVisible
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: profile.color }}
                  />
                  <span>{profile.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SVG Radar Plot */}
          <div className="lg:col-span-6 flex justify-center bg-slate-50 border border-slate-200 rounded p-4">
            <svg
              viewBox="0 0 420 330"
              className="w-full max-w-md h-auto select-none"
              role="img"
              aria-label="Radar chart comparing Direct Metal Deposition, Laser Powder Bed Fusion, and Wire-Arc Directed Energy Deposition"
            >
              {/* Concentric Polygonal Rings (25%, 50%, 75%, 100%) */}
              {[25, 50, 75, 100].map((level) => {
                const points = AXES.map((axis) => {
                  const pt = getCoordinates(axis.angleDeg, level);
                  return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                }).join(' ');
                return (
                  <polygon
                    key={level}
                    points={points}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth={level === 100 ? '1.2' : '0.8'}
                    strokeDasharray={level === 100 ? undefined : '2 2'}
                  />
                );
              })}

              {/* Radial Axis Spokes & Labels */}
              {AXES.map((axis) => {
                const outer = getCoordinates(axis.angleDeg, 100);
                const labelPos = getCoordinates(axis.angleDeg, 124);
                return (
                  <g key={axis.key}>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fill="#334155"
                      fontWeight="600"
                    >
                      {axis.label}
                    </text>
                  </g>
                );
              })}

              {/* Process Polygons */}
              {RADAR_PROFILES.filter((p) => visibleProcessIds.includes(p.id)).map((profile) => {
                const polyPoints = AXES.map((axis) => {
                  const pt = getCoordinates(axis.angleDeg, profile.scores[axis.key]);
                  return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                }).join(' ');

                return (
                  <g key={profile.id}>
                    <polygon
                      points={polyPoints}
                      fill={profile.color}
                      fillOpacity={profile.id === 'dmd' ? 0.24 : 0.12}
                      stroke={profile.color}
                      strokeWidth={profile.id === 'dmd' ? '2.5' : '1.75'}
                    />
                    {AXES.map((axis) => {
                      const pt = getCoordinates(axis.angleDeg, profile.scores[axis.key]);
                      return (
                        <circle
                          key={`${profile.id}-${axis.key}`}
                          cx={pt.x}
                          cy={pt.y}
                          r={profile.id === 'dmd' ? 3.5 : 2.5}
                          fill={profile.color}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quantitative Score Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
              INDEXED CAPABILITY SCORES (0 – 100 SCALE)
            </div>
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {AXES.map((axis) => (
                <div key={axis.key} className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-700">{axis.label}</span>
                  <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
                    {RADAR_PROFILES.map((profile) => (
                      <div
                        key={profile.id}
                        className={`flex items-center gap-1.5 ${
                          visibleProcessIds.includes(profile.id) ? 'opacity-100' : 'opacity-30'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: profile.color }}
                        />
                        <span className="text-slate-500">{profile.shortName.split(' ')[0]}:</span>
                        <span className="font-semibold text-slate-900">
                          {profile.scores[axis.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Engineering Interpretation:</strong> While Laser Powder Bed Fusion (L-PBF)
              excels at sub-millimeter internal lattices and Wire-Arc DED (WAAM) dominates multi-ton
              structural preforms, <strong>DMD occupies the critical industrial sweet spot</strong>:
              it is the only technology capable of simultaneous 5-axis freeform repair on existing
              curved components, continuous multi-material compositional grading (FGM), and low-HAZ
              cladding with direct hybrid CNC finish milling.
            </p>
          </div>
        </div>
      </div>

      {/* Full Quantitative Process Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">
            Quantitative Process Benchmarking Matrix (ISO/ASTM 52900 Comparison)
          </h3>
          <span className="text-xs font-mono text-slate-500">
            TABULAR NUMERALS · EMPIRICAL INDUSTRIAL RANGES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Engineering Parameter</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-4 bg-blue-50/60 text-blue-950 font-semibold">
                  DMD (Powder L-DED)
                </th>
                <th className="py-3 px-4">L-PBF (SLM / DMLS)</th>
                <th className="py-3 px-4">WAAM (Wire-Arc DED)</th>
                <th className="py-3 px-4">EB-DED (Electron Beam)</th>
                <th className="py-3 px-4">5-Axis CNC Milling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {PROCESS_BENCHMARK_TABLE.map((row) => (
                <tr key={row.metric} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">
                    <div>{row.metric}</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      {row.dmdAdvantageNote}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {row.unit}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold tabular-nums text-blue-950 bg-blue-50/40 whitespace-nowrap">
                    {row.dmdPowder}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {row.lpbf}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {row.waamWireArc}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {row.ebDed}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {row.cncSubtractive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
