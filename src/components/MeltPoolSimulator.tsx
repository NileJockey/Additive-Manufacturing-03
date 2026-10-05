import React, { useState } from 'react';
import { RotateCcw, Sliders } from 'lucide-react';

interface PresetConfig {
  id: string;
  label: string;
  alloy: string;
  laserPowerW: number;
  scanSpeedMms: number;
  powderFeedGmin: number;
  spotDiameterMm: number;
  wavelengthLabel: string;
}

const SIMULATOR_PRESETS: PresetConfig[] = [
  {
    id: 'in718-standard',
    label: 'Inconel 718 Standard Build',
    alloy: 'Inconel 718 (1070 nm Fiber)',
    laserPowerW: 1200,
    scanSpeedMms: 15,
    powderFeedGmin: 14,
    spotDiameterMm: 1.6,
    wavelengthLabel: '1070 nm Yb-Fiber',
  },
  {
    id: 'cmsx4-repair',
    label: 'CMSX-4 Blade Tip Repair',
    alloy: 'CMSX-4 SX (900 °C Preheat)',
    laserPowerW: 550,
    scanSpeedMms: 12,
    powderFeedGmin: 6,
    spotDiameterMm: 0.8,
    wavelengthLabel: '1070 nm Top-Hat',
  },
  {
    id: 'ti64-structural',
    label: 'Ti-6Al-4V High-Rate Rib',
    alloy: 'Ti-6Al-4V ELI (Ar Chamber)',
    laserPowerW: 2800,
    scanSpeedMms: 22,
    powderFeedGmin: 32,
    spotDiameterMm: 2.8,
    wavelengthLabel: '1070 nm Yb-Fiber',
  },
  {
    id: 'grcop-green',
    label: 'GRCop-84 Rocket Liner',
    alloy: 'GRCop-84 (515 nm Green Laser)',
    laserPowerW: 1800,
    scanSpeedMms: 18,
    powderFeedGmin: 18,
    spotDiameterMm: 1.5,
    wavelengthLabel: '515 nm Freq-Doubled Disk',
  },
  {
    id: 'ehla-cladding',
    label: 'EHLA High-Speed Cladding',
    alloy: 'Inconel 625 Barrier Overlay',
    laserPowerW: 4200,
    scanSpeedMms: 95,
    powderFeedGmin: 38,
    spotDiameterMm: 1.8,
    wavelengthLabel: '1030 nm Disk (In-Flight Melt)',
  },
];

export const MeltPoolSimulator: React.FC = () => {
  const [activePresetId, setActivePresetId] = useState<string>('in718-standard');
  const [laserPowerW, setLaserPowerW] = useState<number>(1200);
  const [scanSpeedMms, setScanSpeedMms] = useState<number>(15);
  const [powderFeedGmin, setPowderFeedGmin] = useState<number>(14);
  const [spotDiameterMm, setSpotDiameterMm] = useState<number>(1.6);
  const [closedLoopActive, setClosedLoopActive] = useState<boolean>(true);
  const [activeLayerView, setActiveLayerView] = useState<'cross-section' | 'thermal-field'>('cross-section');

  const applyPreset = (preset: PresetConfig) => {
    setActivePresetId(preset.id);
    setLaserPowerW(preset.laserPowerW);
    setScanSpeedMms(preset.scanSpeedMms);
    setPowderFeedGmin(preset.powderFeedGmin);
    setSpotDiameterMm(preset.spotDiameterMm);
  };

  // Empirical DMD physics & scaling equations
  const effectivePowerW = closedLoopActive
    ? Math.min(laserPowerW, Math.max(350, scanSpeedMms * spotDiameterMm * 48))
    : laserPowerW;

  const linearHeatInputJmm = effectivePowerW / scanSpeedMms;
  const specificEnergyJmm2 = effectivePowerW / (scanSpeedMms * spotDiameterMm);
  const powerDensityWmm2 = effectivePowerW / (Math.PI * Math.pow(spotDiameterMm / 2, 2));

  // Powder catchment efficiency (depends on spot size & specific energy)
  const rawCatchment = 62 + Math.min(26, spotDiameterMm * 6.5) + Math.min(6, specificEnergyJmm2 * 0.08);
  const catchmentEfficiencyPct = Math.min(92.5, Math.max(52.0, rawCatchment));

  // Mass deposition rate in kg/h
  const depositionRateKgh = (powderFeedGmin * (catchmentEfficiencyPct / 100) * 60) / 1000;

  // Clad geometry estimates
  const powderPerMm = powderFeedGmin / 60 / scanSpeedMms; // g/mm
  const cladHeightMm = Math.min(
    2.6,
    Math.max(0.08, (powderPerMm * (catchmentEfficiencyPct / 100) * 180) / spotDiameterMm)
  );
  const meltDepthMm = Math.min(1.5, Math.max(0.02, (specificEnergyJmm2 - 14) * 0.0045));
  const dilutionPct = Math.min(
    45.0,
    Math.max(1.2, (meltDepthMm / (cladHeightMm + meltDepthMm)) * 100)
  );
  const hazDepthUm = Math.round(Math.max(35, linearHeatInputJmm * 3.4));
  const coolingRateKs = Math.round(Math.min(95000, Math.max(1200, (scanSpeedMms * 180000) / Math.max(20, effectivePowerW * 0.12))));
  const peakMeltTempC = Math.round(Math.min(2650, Math.max(1280, 1340 + specificEnergyJmm2 * 9.2)));

  // Process Regime Diagnostic
  let regimeStatus: {
    code: 'NOMINAL' | 'WARNING' | 'CRITICAL';
    symbol: string;
    label: string;
    diagnosis: string;
    badgeClass: string;
    dotClass: string;
  };

  if (specificEnergyJmm2 < 20) {
    regimeStatus = {
      code: 'WARNING',
      symbol: '▲',
      label: 'LACK OF FUSION RISK',
      diagnosis:
        'Specific energy is below 20 J/mm². Insufficient substrate wetting may produce inter-track lack-of-fusion pores and weak interfacial bonding (<1.5% dilution). Increase laser power or reduce scan speed.',
      badgeClass: 'text-amber-800 bg-amber-50 border-amber-300',
      dotClass: 'bg-amber-500 ring-4 ring-amber-500/20',
    };
  } else if (dilutionPct > 18 || specificEnergyJmm2 > 95) {
    regimeStatus = {
      code: 'CRITICAL',
      symbol: '✖',
      label: 'EXCESS DILUTION / KEYHOLE',
      diagnosis:
        'Excessive specific energy (>95 J/mm²) or high dilution (>18%) drives deep substrate melting, vapor recoil keyhole porosity, and carbide/Laves segregation. Enable closed-loop pyrometry or raise powder feed.',
      badgeClass: 'text-rose-800 bg-rose-50 border-rose-300',
      dotClass: 'bg-rose-500 ring-4 ring-rose-500/20',
    };
  } else {
    regimeStatus = {
      code: 'NOMINAL',
      symbol: '●',
      label: 'NOMINAL METALLURGICAL WINDOW',
      diagnosis:
        'Balanced energy density and mass flux yield a stable conduction-mode melt pool with 2–12% substrate dilution, narrow HAZ, and >99.8% relative track density.',
      badgeClass: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      dotClass: 'bg-emerald-500 ring-4 ring-emerald-500/20',
    };
  }

  // Visual scaling for SVG diagram
  const svgBeamHalfWidth = Math.min(54, Math.max(14, spotDiameterMm * 14));
  const svgCladHeight = Math.min(46, Math.max(8, cladHeightMm * 28));
  const svgDilutionDepth = Math.min(36, Math.max(4, (dilutionPct / 100) * 90));
  const svgHazDepth = Math.min(52, svgDilutionDepth + Math.max(8, hazDepthUm / 18));

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Top Telemetry Ribbon */}
      <div className="bg-slate-900 text-slate-100 px-5 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${regimeStatus.dotClass}`} />
          <span className="font-mono text-xs tracking-wider uppercase text-slate-300">
            PROCESS REGIME: {regimeStatus.symbol} {regimeStatus.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={closedLoopActive}
              onChange={(e) => setClosedLoopActive(e.target.checked)}
              className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
            />
            <span>CLOSED-LOOP PYROMETER PID (10 kHz)</span>
          </label>
          <button
            type="button"
            onClick={() => applyPreset(SIMULATOR_PRESETS[0])}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Calibration
          </button>
        </div>
      </div>

      {/* Preset Selector Strip */}
      <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-medium text-slate-500 whitespace-nowrap mr-1">
          Industrial Calibration Presets:
        </span>
        {SIMULATOR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
              activePresetId === preset.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Split Console: Left Parameters + Right Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Parameter Column (5 cols on lg) */}
        <div className="lg:col-span-5 p-6 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  DMD Nozzle & Energy Parameters
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scrub input variables to inspect melt pool thermodynamics
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">ISO 52900 DED-LB</span>
            </div>

            {/* Slider 1: Laser Power */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label htmlFor="slider-power" className="text-xs font-medium text-slate-700">
                  Commanded Laser Power (P)
                </label>
                <div className="font-mono tabular-nums">
                  <span className="text-sm font-semibold text-slate-900">{laserPowerW}</span>
                  <span className="text-xs text-slate-500 ml-1">W</span>
                  {closedLoopActive && effectivePowerW !== laserPowerW && (
                    <span className="text-xs text-blue-600 ml-1.5">
                      (PID → {Math.round(effectivePowerW)} W)
                    </span>
                  )}
                </div>
              </div>
              <input
                id="slider-power"
                type="range"
                min={300}
                max={5000}
                step={50}
                value={laserPowerW}
                onChange={(e) => {
                  setLaserPowerW(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>300 W (Micro-Clad)</span>
                <span>2500 W</span>
                <span>5000 W (Heavy Rate)</span>
              </div>
            </div>

            {/* Slider 2: Traverse Scanning Velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label htmlFor="slider-speed" className="text-xs font-medium text-slate-700">
                  Nozzle Traverse Speed (v)
                </label>
                <div className="font-mono tabular-nums">
                  <span className="text-sm font-semibold text-slate-900">{scanSpeedMms}</span>
                  <span className="text-xs text-slate-500 ml-1">mm/s</span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    ({((scanSpeedMms * 60) / 1000).toFixed(2)} m/min)
                  </span>
                </div>
              </div>
              <input
                id="slider-speed"
                type="range"
                min={5}
                max={120}
                step={1}
                value={scanSpeedMms}
                onChange={(e) => {
                  setScanSpeedMms(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>5 mm/s (Standard)</span>
                <span>40 mm/s</span>
                <span>120 mm/s (EHLA Regime)</span>
              </div>
            </div>

            {/* Slider 3: Powder Mass Feed Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label htmlFor="slider-powder" className="text-xs font-medium text-slate-700">
                  Powder Mass Flow Rate (ṁ)
                </label>
                <div className="font-mono tabular-nums">
                  <span className="text-sm font-semibold text-slate-900">{powderFeedGmin}</span>
                  <span className="text-xs text-slate-500 ml-1">g/min</span>
                </div>
              </div>
              <input
                id="slider-powder"
                type="range"
                min={3}
                max={60}
                step={1}
                value={powderFeedGmin}
                onChange={(e) => {
                  setPowderFeedGmin(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>3 g/min (Blade Tip)</span>
                <span>30 g/min</span>
                <span>60 g/min (Bulk Build)</span>
              </div>
            </div>

            {/* Slider 4: Laser Spot Diameter */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label htmlFor="slider-spot" className="text-xs font-medium text-slate-700">
                  Focal Beam Diameter (D_b)
                </label>
                <div className="font-mono tabular-nums">
                  <span className="text-sm font-semibold text-slate-900">
                    {spotDiameterMm.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">mm</span>
                </div>
              </div>
              <input
                id="slider-spot"
                type="range"
                min={0.6}
                max={4.0}
                step={0.1}
                value={spotDiameterMm}
                onChange={(e) => {
                  setSpotDiameterMm(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0.6 mm (High Res)</span>
                <span>2.0 mm</span>
                <span>4.0 mm (Wide Clad)</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Box */}
          <div className={`p-3.5 rounded border text-xs leading-relaxed ${regimeStatus.badgeClass}`}>
            <div className="font-mono font-semibold uppercase tracking-wide mb-1">
              {regimeStatus.symbol} Metallurgical Diagnostic
            </div>
            <p>{regimeStatus.diagnosis}</p>
          </div>
        </div>

        {/* Right Visualization & Telemetry Stage (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-white space-y-6">
          {/* Interactive Cross-Section SVG Canvas */}
          <div className="relative bg-[#0B0E17] rounded-lg border border-slate-800 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono text-slate-400">
                COAXIAL NOZZLE & MELT POOL CROSS-SECTION · SCALE 10:1
              </div>
              <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded">
                <button
                  type="button"
                  onClick={() => setActiveLayerView('cross-section')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap ${
                    activeLayerView === 'cross-section'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Kinematic Zones
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayerView('thermal-field')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap ${
                    activeLayerView === 'thermal-field'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Thermal Gradient G/R
                </button>
              </div>
            </div>

            <svg
              viewBox="0 0 600 290"
              className="w-full h-64 select-none"
              role="img"
              aria-label="Interactive cross-section diagram of Direct Metal Deposition coaxial nozzle, powder convergence, laser beam, melt pool, dilution zone, and heat-affected zone."
            >
              <defs>
                <linearGradient id="laserBeamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
                  <stop offset="65%" stopColor="#06B6D4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.85" />
                </linearGradient>
                <radialGradient id="meltPoolGrad" cx="50%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="45%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#7C2D12" />
                </radialGradient>
                <linearGradient id="cladTrackGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="65%" stopColor="#64748B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>

              {/* Coordinate Grid Background */}
              <g stroke="#1E293B" strokeWidth="1">
                <line x1="0" y1="60" x2="600" y2="60" />
                <line x1="0" y1="120" x2="600" y2="120" />
                <line x1="0" y1="190" x2="600" y2="190" strokeDasharray="3 3" />
                <line x1="150" y1="0" x2="150" y2="290" />
                <line x1="340" y1="0" x2="340" y2="290" strokeDasharray="3 3" />
                <line x1="480" y1="0" x2="480" y2="290" />
              </g>

              {/* Metallic Substrate Block */}
              <rect
                x="30"
                y="190"
                width="540"
                height="85"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="45" y="262" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                METALLIC SUBSTRATE (BASE FORGING / WORN COMPONENT)
              </text>

              {/* Heat-Affected Zone (HAZ) */}
              <path
                d={`M 80 190 L 340 190 C ${340 + svgBeamHalfWidth * 1.2} 190, ${
                  340 + svgBeamHalfWidth * 0.9
                } ${190 + svgHazDepth}, 340 ${190 + svgHazDepth} L 80 ${190 + svgHazDepth} Z`}
                fill={activeLayerView === 'thermal-field' ? '#7C2D12' : '#334155'}
                opacity="0.75"
              />

              {/* Solidified Clad Bead Behind Melt Pool */}
              <path
                d={`M 80 190 L 80 ${190 - svgCladHeight} L 340 ${
                  190 - svgCladHeight
                } L 340 190 Z`}
                fill="url(#cladTrackGrad)"
                stroke="#94A3B8"
                strokeWidth="1"
              />

              {/* Epitaxial Dendrite Grain Lines inside Solidified Bead */}
              <g stroke="#CBD5E1" strokeWidth="0.75" opacity="0.45">
                {[110, 145, 180, 215, 250, 285, 315].map((xPos) => (
                  <path
                    key={xPos}
                    d={`M ${xPos} ${190 + svgDilutionDepth * 0.6} Q ${xPos + 6} ${
                      190 - svgCladHeight * 0.4
                    } ${xPos + 14} ${190 - svgCladHeight + 2}`}
                    fill="none"
                  />
                ))}
              </g>

              {/* Dilution Zone + Active Molten Pool */}
              <path
                d={`M ${340 - svgBeamHalfWidth * 1.15} 190 Q 340 ${
                  190 - svgCladHeight * 2.1
                } ${340 + svgBeamHalfWidth * 1.05} 190 Q 340 ${
                  190 + svgDilutionDepth * 1.85
                } ${340 - svgBeamHalfWidth * 1.15} 190 Z`}
                fill="url(#meltPoolGrad)"
                stroke="#FDE047"
                strokeWidth="1.2"
              />

              {/* Coaxial Laser Beam Cone */}
              <polygon
                points={`318,15 362,15 ${340 + svgBeamHalfWidth},190 ${
                  340 - svgBeamHalfWidth
                },190`}
                fill="url(#laserBeamGrad)"
              />

              {/* Coaxial Optical Pyrometer Sightline (Center Dashed Axis) */}
              {closedLoopActive && (
                <line
                  x1="340"
                  y1="10"
                  x2="340"
                  y2="185"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}

              {/* Coaxial Nozzle Hardware Assembly (Left & Right Cones) */}
              <polygon
                points="255,15 305,15 285,105 268,105"
                fill="#475569"
                stroke="#94A3B8"
                strokeWidth="1"
              />
              <polygon
                points="375,15 425,15 412,105 395,105"
                fill="#475569"
                stroke="#94A3B8"
                strokeWidth="1"
              />
              {/* Outer Powder Nozzle Walls */}
              <polygon
                points="225,15 245,15 260,105 246,105"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />
              <polygon
                points="435,15 455,15 434,105 420,105"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />

              {/* Converging Powder Stream Vectors (Left & Right Annular Cones) */}
              <g stroke="#FBBF24" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.85">
                <line x1="255" y1="105" x2={340 - svgBeamHalfWidth * 0.4} y2="182" />
                <line x1="264" y1="105" x2={340 + svgBeamHalfWidth * 0.2} y2="186" />
                <line x1="425" y1="105" x2={340 + svgBeamHalfWidth * 0.4} y2="182" />
                <line x1="416" y1="105" x2={340 - svgBeamHalfWidth * 0.2} y2="186" />
              </g>

              {/* Annotations & Dimension Callouts */}
              <g fontFamily="monospace" fontSize="10" fill="#E2E8F0">
                <text x="45" y="155" fill="#38BDF8">
                  NOZZLE TRAVERSE v = {scanSpeedMms} mm/s →
                </text>
                <text x="435" y="52" fill="#FBBF24">
                  POWDER STREAM ({powderFeedGmin} g/min)
                </text>
                <text x="435" y="68" fill="#94A3B8">
                  Ar CARRIER + SHIELDING GAS
                </text>
                <text x="415" y="168" fill="#FDE047">
                  PEAK T ≈ {peakMeltTempC} °C
                </text>
                <text x="415" y="182" fill="#38BDF8">
                  COOLING ≈ {(coolingRateKs / 1000).toFixed(1)}×10³ K/s
                </text>
                <text x="90" y={185 - svgCladHeight} fill="#E2E8F0">
                  CLAD HEIGHT Hc = {cladHeightMm.toFixed(2)} mm
                </text>
                <text x="90" y={205 + svgHazDepth} fill="#FB923C">
                  HAZ DEPTH = {hazDepthUm} μm · DILUTION = {dilutionPct.toFixed(1)}%
                </text>
              </g>
            </svg>
          </div>

          {/* 6 Quantitative Telemetry Readout Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Specific Energy (E_s)
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                  {specificEnergyJmm2.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">J/mm²</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Linear Input: {linearHeatInputJmm.toFixed(1)} J/mm
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Mass Deposition Rate
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                  {depositionRateKgh.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">kg/h</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 mt-1">
                Catchment η_c: {catchmentEfficiencyPct.toFixed(1)}%
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Dilution Ratio (D)
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                  {dilutionPct.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">%</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                HAZ Depth: {hazDepthUm} μm
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Single-Track Geometry
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                  {cladHeightMm.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">mm H_c</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Width W_c: {(spotDiameterMm * 1.08).toFixed(2)} mm
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Power Density (I_0)
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                  {Math.round(powerDensityWmm2)}
                </span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">W/mm²</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Peak T: ~{peakMeltTempC} °C
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Quench Cooling Rate
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                  {(coolingRateKs / 1000).toFixed(1)}k
                </span>
                <span className="text-xs font-mono text-slate-500 ml-1.5">K/s</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                SDAS: ~{Math.max(1.8, (12 - coolingRateKs / 10000)).toFixed(1)} μm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
