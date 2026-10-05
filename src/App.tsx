import React, { useState, useMemo } from 'react';
import {
  Download,
  Printer,
  Search,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import {
  DMD_IMAGES,
  PROCESS_SUBSYSTEMS,
  ALLOWED_MATERIALS,
  BIMETALLIC_TRANSITIONS,
  INDUSTRIAL_APPLICATIONS,
  POINTS_OF_STRENGTH,
  DRAWBACKS_AND_LIMITATIONS,
  FUTURE_OUTLOOK_VECTORS,
  AlloyFamily,
} from './data/dmdData';
import { MeltPoolSimulator } from './components/MeltPoolSimulator';
import { ProcessRadarBenchmark } from './components/ProcessRadarBenchmark';
import { ResilientImage } from './components/ResilientImage';

const ALLOY_FAMILIES: ('All Families' | AlloyFamily)[] = [
  'All Families',
  'Nickel Superalloys',
  'Titanium Alloys',
  'Tool & High-Strength Steels',
  'Stainless & Duplex Steels',
  'Cobalt-Chrome & Wear Alloys',
  'Copper & Thermal Alloys',
  'MMCs & Refractory Metals',
];

const APPLICATION_SECTORS = [
  'All Sectors',
  'Aerospace & Propulsion',
  'Die, Mold & Tooling',
  'Energy, Oil & Gas',
] as const;

export default function App() {
  // Interactive Filter States
  const [selectedFamily, setSelectedFamily] = useState<'All Families' | AlloyFamily>('All Families');
  const [materialSearch, setMaterialSearch] = useState<string>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(ALLOWED_MATERIALS[0].id);
  const [selectedBimetallicId, setSelectedBimetallicId] = useState<string>(
    BIMETALLIC_TRANSITIONS[0].id
  );
  const [selectedSector, setSelectedSector] =
    useState<(typeof APPLICATION_SECTORS)[number]>('All Sectors');
  const [strengthLimitFilter, setStrengthLimitFilter] = useState<'both' | 'strengths' | 'limits'>(
    'both'
  );

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return ALLOWED_MATERIALS.filter((mat) => {
      const matchesFamily = selectedFamily === 'All Families' || mat.family === selectedFamily;
      const q = materialSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        mat.designation.toLowerCase().includes(q) ||
        mat.nominalComposition.toLowerCase().includes(q) ||
        mat.unsOrStandard.toLowerCase().includes(q) ||
        mat.keyApplications.some((app) => app.toLowerCase().includes(q));
      return matchesFamily && matchesQuery;
    });
  }, [selectedFamily, materialSearch]);

  const activeMaterial = useMemo(() => {
    return (
      ALLOWED_MATERIALS.find((m) => m.id === selectedMaterialId) ||
      filteredMaterials[0] ||
      ALLOWED_MATERIALS[0]
    );
  }, [selectedMaterialId, filteredMaterials]);

  const activeBimetallic = useMemo(() => {
    return (
      BIMETALLIC_TRANSITIONS.find((b) => b.id === selectedBimetallicId) ||
      BIMETALLIC_TRANSITIONS[0]
    );
  }, [selectedBimetallicId]);

  const filteredApplications = useMemo(() => {
    if (selectedSector === 'All Sectors') return INDUSTRIAL_APPLICATIONS;
    return INDUSTRIAL_APPLICATIONS.filter((app) => app.sector === selectedSector);
  }, [selectedSector]);

  // Export complete Markdown Technical Monograph
  const handleDownloadMarkdownReport = () => {
    const lines: string[] = [
      '# Technical Monograph: Direct Metal Deposition (DMD / L-DED)',
      'Standard Classification: ISO/ASTM 52900 — Directed Energy Deposition (DED-LB/M)',
      '',
      '## 1. Executive Definition & Process Physics',
      'Direct Metal Deposition (DMD)—also designated in international standards as Laser-based Directed Energy Deposition (L-DED or Laser Metal Deposition, LMD)—is an additive manufacturing and precision cladding process in which focused thermal energy from a high-power laser beam melts metallic feedstock (spherical powder or wire) as it is coaxially injected into a molten pool on a substrate.',
      'Unlike open-loop laser cladding or Laser Powder Bed Fusion (L-PBF), DMD integrates real-time closed-loop optical feedback (dual-color pyrometry and coaxial vision height sensing at 1–10 kHz) to regulate melt pool temperature, dilution (<3.5%), and layer geometry across 5-axis freeform toolpaths.',
      '',
      '### Core Subsystems',
      ...PROCESS_SUBSYSTEMS.map(
        (s) =>
          `- **${s.index}. ${s.title} (${s.operatingRange} ${s.unit})**: ${s.summary}\n  - ${s.technicalDetails.join('\n  - ')}`
      ),
      '',
      '## 2. Allowed Materials & Metallurgical Compatibility',
      ...ALLOWED_MATERIALS.map(
        (m) =>
          `### ${m.designation} (${m.unsOrStandard})\n- **Family**: ${m.family}\n- **Nominal Composition**: ${m.nominalComposition}\n- **Powder PSD**: ${m.powderPsdUm} μm | **Laser**: ${m.preferredLaserNm} nm | **Preheat**: ${m.preheatTempC} °C\n- **Mechanical Properties**: YS ${m.yieldStrengthMpa} MPa, UTS ${m.utsMpa} MPa, Elongation ${m.elongationPct}%, Relative Density ${m.relativeDensityPct}%\n- **Metallurgical Behavior**: ${m.metallurgicalNotes}\n- **Applications**: ${m.keyApplications.join('; ')}`
      ),
      '',
      '## 3. Industrial Applications',
      ...INDUSTRIAL_APPLICATIONS.map(
        (a) =>
          `### [${a.sector}] ${a.title}\n- **Component**: ${a.componentName} (${a.alloysUsed})\n- **Engineering Challenge**: ${a.problemStatement}\n- **DMD Solution**: ${a.dmdSolutionArchitecture}\n- **Outcomes**: ${a.quantitativeOutcomes.map((o) => `${o.metric} ${o.value} (${o.context})`).join(' | ')}`
      ),
      '',
      '## 4. Points of Strength',
      ...POINTS_OF_STRENGTH.map(
        (st) =>
          `- **${st.index}. ${st.title} (${st.metricHighlight} ${st.unit})**: ${st.mechanism} ${st.engineeringImpact}`
      ),
      '',
      '## 5. Drawbacks & Limitations',
      ...DRAWBACKS_AND_LIMITATIONS.map(
        (lim) =>
          `- **${lim.index}. ${lim.title} (${lim.metricHighlight} ${lim.unit})**: ${lim.mechanism} ${lim.engineeringImpact} *${lim.mitigationOrLeverage}*`
      ),
      '',
      '## 6. Future Outlook for Industrial Manufacturing Integration (2026–2035)',
      ...FUTURE_OUTLOOK_VECTORS.map(
        (f) =>
          `### ${f.title} (${f.horizon} · ${f.trlLevel})\n- **Impact**: ${f.adoptionImpactMetric} ${f.unit}\n- **Breakthrough**: ${f.technicalBreakthrough}\n- **Integration Path**: ${f.industrialIntegrationPath}`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DMD_Technical_Review_Monograph.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: Strictly 1 row, 3 zones (Brand Wordmark — 5 Nav Links — 2 Actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5 no-print">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-semibold tracking-tight text-slate-900 font-editorial whitespace-nowrap shrink-0"
          >
            DMD Technical Monograph
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a
              href="#process-physics"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              01. Process Physics
            </a>
            <a
              href="#allowed-materials"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              02. Allowed Materials
            </a>
            <a
              href="#applications"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              03. Applications
            </a>
            <a
              href="#strengths-limitations"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              04. Strengths & Limits
            </a>
            <a
              href="#future-outlook"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              05. Industrial Outlook
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('interactive-simulator')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Melt Pool Simulator
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdownReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Export Dossier (.MD)
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* HERO & EXECUTIVE TECHNICAL SYNOPSIS */}
        <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
          <div className="max-w-[1360px] mx-auto px-6">
            {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mb-4">
              <span>ISO/ASTM 52900 CLASSIFICATION: DED-LB/M</span>
              <span aria-hidden="true">·</span>
              <span>DIRECT METAL DEPOSITION (DMD / L-DED / LMD)</span>
              <span aria-hidden="true">·</span>
              <span>COMPREHENSIVE ENGINEERING REVIEW</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Editorial Lead & Monograph Abstract */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-editorial font-medium tracking-tight text-slate-950 leading-[1.12]">
                  Direct Metal Deposition: Process Physics, Metallurgical Envelope & Industrial
                  Integration
                </h1>

                <p className="text-base text-slate-700 leading-relaxed max-w-[70ch] first-letter:text-5xl first-letter:font-editorial first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-slate-950">
                  Direct Metal Deposition (DMD) is a closed-loop, laser-based Directed Energy
                  Deposition (DED-LB) additive manufacturing technique in which a high-power laser
                  beam generates a localized melt pool on a metallic substrate while coaxial nozzles
                  simultaneously inject gas-atomized metallic powder or wire directly into the
                  molten zone. Originally developed through joint research at the University of
                  Michigan (POM), Sandia National Laboratories (LENS), and Fraunhofer ILT, DMD
                  distinguishes itself from open-loop laser cladding through real-time optical
                  pyrometry and coaxial height-sensing feedback loops operating at kilohertz
                  frequencies.
                </p>

                <p className="text-sm text-slate-600 leading-relaxed max-w-[70ch]">
                  Unlike Laser Powder Bed Fusion (L-PBF), which is confined to static planar powder
                  beds and single-alloy builds, DMD operates on 5-axis CNC gantries or 6-axis
                  robotic manipulators. This kinematic freedom unlocks three capabilities
                  unattainable in powder-bed systems: <strong>in-situ multi-material compositional
                  grading (FGM)</strong>, <strong>structural repair and cladding on curved 3D
                  existing components</strong>, and <strong>multi-meter monolithic builds</strong>{' '}
                  integrated directly with subtractive high-speed finish milling.
                </p>

                {/* Key Quantitative Benchmarks Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Deposition Rate
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                        0.5 – 5.0
                      </span>
                      <span className="text-xs font-mono text-slate-500 ml-1.5">kg/h</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Up to 10+ kg/h high-power
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Metallurgical Bond
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                        99.9
                      </span>
                      <span className="text-xs font-mono text-slate-500 ml-1.5">% density</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Dilution &lt; 3.5% · HAZ &lt; 300 μm
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Cooling Quench Rate
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                        10³ – 10⁵
                      </span>
                      <span className="text-xs font-mono text-slate-500 ml-1.5">K/s</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Refined 2–10 μm dendrites
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Buy-to-Fly Ratio
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                        1.5 : 1
                      </span>
                      <span className="text-xs font-mono text-slate-500 ml-1.5">net ratio</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Down from 18:1 billet CNC
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Specimen Figure + Nomenclature Table */}
              <div className="lg:col-span-5 space-y-4">
                <figure className="bg-slate-900 border border-slate-200 rounded-lg overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <ResilientImage
                      src={DMD_IMAGES.nozzleHero}
                      alt="Isometric scientific rendering of a coaxial Direct Metal Deposition laser nozzle depositing molten metal onto a turbine substrate"
                      fallbackTitle="Coaxial DMD Laser Nozzle & Melt Pool Convergence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="p-3.5 bg-slate-900 text-xs font-editorial italic text-slate-300 border-t border-slate-800">
                    Fig. 1 — Coaxial Direct Metal Deposition (DMD) nozzle architecture: central
                    high-energy laser beam (1070 nm or 515 nm), inner Argon optical shield, and
                    annular metallic powder cone converging inside the localized substrate melt
                    pool.
                  </figcaption>
                </figure>

                {/* Standardized Taxonomy Clarification Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                  <div className="font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Nomenclature & Standards Equivalency
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    In industrial literature, <strong>DMD (Direct Metal Deposition)</strong> is a
                    premier implementation of <strong>DED-LB/M</strong> (ISO/ASTM 52900). Related
                    regional and institutional designations include <strong>LMD</strong> (Laser
                    Metal Deposition, Fraunhofer), <strong>LENS</strong> (Laser Engineered Net
                    Shaping, Sandia), and <strong>CLAD</strong> (Direct Laser Deposition). Strictly
                    speaking, DMD denotes systems equipped with{' '}
                    <strong>closed-loop optical melt-pool feedback</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 01: PROCESS ARCHITECTURE & INTERACTIVE MELT POOL SIMULATOR */}
        <section id="process-physics" className="py-14 border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6 space-y-10">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-blue-700">
                01 / PROCESS ARCHITECTURE & THERMOMECHANICAL PHYSICS
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-medium text-slate-950">
                Four Interlocking Subsystems Governing DMD Deposition Quality
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Achieving defect-free, full-density (&gt;99.8%) metallurgical layers requires exact
                synchronization between photonic energy delivery, multi-phase powder-gas fluid
                dynamics, closed-loop optical pyrometry, and directional solidification kinetics.
              </p>
            </div>

            {/* 4 Subsystem Specification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROCESS_SUBSYSTEMS.map((sub) => (
                <article
                  key={sub.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
                      <span className="text-xs font-mono text-slate-500">
                        SUBSYSTEM {sub.index} · {sub.subtitle.toUpperCase()}
                      </span>
                      <div className="font-mono tabular-nums shrink-0">
                        <span className="text-lg font-semibold text-slate-900">
                          {sub.operatingRange}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">{sub.unit}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900">{sub.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{sub.summary}</p>

                    <ul className="space-y-2 pt-1">
                      {sub.technicalDetails.map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-700 leading-relaxed flex items-start gap-2"
                        >
                          <span className="font-mono text-blue-600 font-semibold mt-0.5">·</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 bg-slate-50/60 -mx-6 -mb-6 p-4 rounded-b-lg">
                    {sub.keyParameters.map((param) => (
                      <div key={param.label}>
                        <div className="text-[10px] font-mono uppercase text-slate-500">
                          {param.label}
                        </div>
                        <div className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-slate-900">
                          {param.value}{' '}
                          <span className="font-normal text-slate-500">{param.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* Interactive Melt Pool & Coaxial Nozzle Simulator */}
            <div id="interactive-simulator" className="pt-4 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  Interactive Coaxial Nozzle & Melt Pool Thermodynamics Simulator
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  REAL-TIME EMPIRICAL MODEL · ADJUST LASER POWER, SCAN SPEED & POWDER FEED
                </span>
              </div>
              <MeltPoolSimulator />
            </div>
          </div>
        </section>

        {/* CHAPTER 02: ALLOWED MATERIALS & BIMETALLIC FGM COMPATIBILITY */}
        <section id="allowed-materials" className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6 space-y-12">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-blue-700">
                02 / ALLOWED MATERIALS & FEEDSTOCK SPECIFICATIONS
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-medium text-slate-950">
                Metallurgical Envelope: From Single-Crystal Superalloys to Ceramic MMCs
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Any metallic alloy that is stable in a molten pool without sublimating can be
                processed via DMD, provided spherical gas-atomized (GA) or Plasma Rotating Electrode
                Process (PREP) powder is available in the <strong>45–150 μm</strong> particle size
                distribution (Hall flow rate &lt; 25 s/50 g) or drawn wire (0.8–1.2 mm). Unlike
                powder-bed fusion, DMD also supports continuous ceramic particle injection (WC, TiC)
                and real-time compositional grading.
              </p>
            </div>

            {/* Interactive Material Filter Bar */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Segmented Family Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg">
                  {ALLOY_FAMILIES.map((family) => (
                    <button
                      key={family}
                      type="button"
                      onClick={() => setSelectedFamily(family)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        selectedFamily === family
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {family}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="Filter alloy, UNS, element (e.g. Nb, Cu)..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Master-Detail Allowed Materials Table + Selected Alloy Metallurgical Dossier */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Table (7 cols) */}
                <div className="lg:col-span-7 border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                          <th className="py-3 px-4">Alloy Designation</th>
                          <th className="py-3 px-3">Powder PSD</th>
                          <th className="py-3 px-3">Preheat</th>
                          <th className="py-3 px-3">UTS (MPa)</th>
                          <th className="py-3 px-3">Processability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {filteredMaterials.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-500">
                              No alloys match "{materialSearch}". Try clearing the search filter.
                            </td>
                          </tr>
                        ) : (
                          filteredMaterials.map((mat) => {
                            const isSelected = activeMaterial.id === mat.id;
                            return (
                              <tr
                                key={mat.id}
                                onClick={() => setSelectedMaterialId(mat.id)}
                                className={`cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-blue-50/70 font-medium'
                                    : 'hover:bg-slate-50'
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-slate-900">
                                    {mat.designation}
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-500">
                                    {mat.family} · {mat.unsOrStandard}
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                                  {mat.powderPsdUm} μm
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                                  {mat.preheatTempC} °C
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                                  {mat.utsMpa}
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                                  {mat.processabilityStatus === 'NOMINAL' && (
                                    <span className="text-emerald-700 font-medium">
                                      ● NOMINAL
                                    </span>
                                  )}
                                  {mat.processabilityStatus === 'MODERATE PREHEAT' && (
                                    <span className="text-amber-700 font-medium">
                                      ▲ PREHEAT REQ.
                                    </span>
                                  )}
                                  {mat.processabilityStatus === 'HIGH CRACK SENSITIVITY' && (
                                    <span className="text-rose-700 font-medium">
                                      ✖ HIGH G/R CONTROL
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Selected Alloy Metallurgical Inspector (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-5">
                  <div className="border-b border-slate-200 pb-3">
                    <div className="text-xs font-mono text-blue-700 uppercase tracking-wider">
                      SELECTED ALLOY METALLURGICAL DOSSIER
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1">
                      {activeMaterial.designation}
                    </h3>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">
                      {activeMaterial.unsOrStandard} · {activeMaterial.nominalComposition}
                    </div>
                  </div>

                  {/* Quantitative Specs Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Yield / Ultimate Strength
                      </div>
                      <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
                        {activeMaterial.yieldStrengthMpa} / {activeMaterial.utsMpa}{' '}
                        <span className="text-xs font-normal text-slate-500">MPa</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Density & Elongation
                      </div>
                      <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
                        {activeMaterial.relativeDensityPct}%{' '}
                        <span className="text-xs font-normal text-slate-500">
                          · A5: {activeMaterial.elongationPct}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Recommended Laser & Es
                      </div>
                      <div className="mt-1 font-mono text-xs font-semibold tabular-nums text-slate-900">
                        {activeMaterial.preferredLaserNm} · {activeMaterial.specificEnergyJmm2} J/mm²
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        Substrate Preheat Window
                      </div>
                      <div className="mt-1 font-mono text-xs font-semibold tabular-nums text-slate-900">
                        {activeMaterial.preheatTempC} °C
                      </div>
                    </div>
                  </div>

                  {/* Solidification & Phase Behavior */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-900">
                      Solidification Metallurgy & Phase Kinetics
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeMaterial.metallurgicalNotes}
                    </p>
                  </div>

                  {/* Qualified Industrial Applications */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-900">
                      Primary Qualified Applications
                    </div>
                    <ul className="space-y-1.5">
                      {activeMaterial.keyApplications.map((app, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Functionally Graded Material (FGM) & Bimetallic Transition Analyzer */}
            <div className="pt-6 border-t border-slate-200 space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Bimetallic & Functionally Graded Material (FGM) Transition Pathways
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    How multi-hopper DMD prevents brittle intermetallic phases (FeTi, σ, Laves) when
                    joining dissimilar alloys
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  MULTI-HOPPER COMPOSITIONAL GRADING
                </span>
              </div>

              {/* Pathway Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {BIMETALLIC_TRANSITIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedBimetallicId(item.id)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                      selectedBimetallicId === item.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.baseAlloy} → {item.targetAlloy}
                  </button>
                ))}
              </div>

              {/* Active FGM Pathway Detail */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-mono text-slate-500">
                    COMPATIBILITY STATUS:{' '}
                    <strong className="text-slate-900">{activeBimetallic.directCompatibility}</strong>
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {activeBimetallic.baseAlloy} to {activeBimetallic.targetAlloy}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Deleterious Phases Avoided:</strong>{' '}
                    {activeBimetallic.deleteriousPhasesAvoided}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Metallurgical Pathway:</strong> {activeBimetallic.recommendedPathway}
                  </p>
                  <div className="pt-2 border-t border-slate-200 text-xs font-mono text-slate-700">
                    QUALIFIED BOND UTS: <strong>{activeBimetallic.interfaceBondStrengthMpa}</strong>
                  </div>
                </div>

                {/* Step-by-Step Gradient Sequence */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {activeBimetallic.gradientSteps.map((stepObj, index) => (
                    <div
                      key={stepObj.step}
                      className="bg-white border border-slate-200 rounded p-3.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-mono uppercase text-blue-700">
                          LAYER ZONE 0{index + 1} · {stepObj.step}
                        </div>
                        <div className="text-xs font-semibold text-slate-900 mt-1">
                          {stepObj.composition}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-3 leading-snug">{stepObj.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: INDUSTRIAL APPLICATIONS ACROSS SECTORS */}
        <section id="applications" className="py-14 border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6 space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-3xl space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-blue-700">
                  03 / INDUSTRIAL APPLICATIONS & PRODUCTION CASE STUDIES
                </div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-medium text-slate-950">
                  High-Value Remanufacturing, Bimetallic Propulsion & Conformal Tooling
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  In industrial production, DMD is deployed wherever component replacement costs are
                  prohibitive, multi-alloy thermal/wear properties are required in a single part, or
                  component geometry exceeds powder-bed build chambers.
                </p>
              </div>

              {/* Sector Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
                {APPLICATION_SECTORS.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSector(sec)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      selectedSector === sec
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Case Studies Grid */}
            <div className="space-y-8">
              {filteredApplications.map((app) => (
                <article
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12"
                >
                  {/* Visual Specimen Column (5 cols) */}
                  <figure className="lg:col-span-5 bg-slate-900 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
                    <div className="aspect-4/3 w-full overflow-hidden">
                      <ResilientImage
                        src={DMD_IMAGES[app.imageKey]}
                        alt={app.title}
                        fallbackTitle={app.componentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="p-4 bg-slate-900 text-xs font-editorial italic text-slate-300 border-t border-slate-800">
                      {app.figureCaption}
                    </figcaption>
                  </figure>

                  {/* Engineering Case Details (7 cols) */}
                  <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Clean unboxed metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                        <span className="text-blue-700 font-semibold">{app.sector}</span>
                        <span aria-hidden="true">·</span>
                        <span>{app.componentName}</span>
                        <span aria-hidden="true">·</span>
                        <span>Alloys: {app.alloysUsed}</span>
                      </div>

                      <h3 className="text-xl font-editorial font-medium text-slate-950">
                        {app.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-slate-900">
                            Baseline Failure & Manufacturing Bottleneck
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {app.problemStatement}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-slate-900">
                            DMD Process Architecture
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {app.dmdSolutionArchitecture}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quantitative Proof Adjacency + Process Window */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {app.quantitativeOutcomes.map((outcome) => (
                          <div
                            key={outcome.value}
                            className="bg-slate-50 border border-slate-200 rounded p-3"
                          >
                            <div className="text-xl font-mono font-semibold tabular-nums text-slate-900">
                              {outcome.metric}
                            </div>
                            <div className="text-xs font-semibold text-slate-800 mt-0.5">
                              {outcome.value}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {outcome.context}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-600 pt-1">
                        {app.processParameters.map((p) => (
                          <div key={p.param}>
                            <span className="text-slate-400">{p.param}:</span>{' '}
                            <span className="text-slate-900 font-medium">{p.spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER 04: POINTS OF STRENGTH vs. DRAWBACKS & LIMITATIONS */}
        <section id="strengths-limitations" className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6 space-y-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-3xl space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-blue-700">
                  04 / CRITICAL ENGINEERING EVALUATION: STRENGTHS VS. LIMITATIONS
                </div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-medium text-slate-950">
                  Points of Strength, Physical Drawbacks & Process Trade-Offs
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Selecting DMD for industrial production requires balancing its unmatched freeform
                  repair, multi-material, and high-throughput capabilities against its near-net-shape
                  surface finish, thermal residual stress, and powder catchment constraints.
                </p>
              </div>

              {/* View Filter Segmented Control */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setStrengthLimitFilter('both')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    strengthLimitFilter === 'both'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Side-by-Side Comparison
                </button>
                <button
                  type="button"
                  onClick={() => setStrengthLimitFilter('strengths')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    strengthLimitFilter === 'strengths'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Points of Strength (6)
                </button>
                <button
                  type="button"
                  onClick={() => setStrengthLimitFilter('limits')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    strengthLimitFilter === 'limits'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Drawbacks & Limits (6)
                </button>
              </div>
            </div>

            {/* Strengths & Limitations Columns */}
            <div
              className={`grid grid-cols-1 ${
                strengthLimitFilter === 'both' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
              } gap-8`}
            >
              {/* Points of Strength Column */}
              {(strengthLimitFilter === 'both' || strengthLimitFilter === 'strengths') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-3">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Points of Strength (Core Engineering Advantages)
                    </h3>
                    <span className="text-xs font-mono text-emerald-700 font-medium">
                      6 ADVANTAGES
                    </span>
                  </div>

                  <div className="space-y-4">
                    {POINTS_OF_STRENGTH.map((str) => (
                      <div
                        key={str.id}
                        className="p-5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2.5"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-xs font-mono text-slate-500">
                            STRENGTH {str.index} · {str.category.toUpperCase()}
                          </span>
                          <div className="font-mono tabular-nums shrink-0">
                            <span className="text-base font-semibold text-emerald-800">
                              {str.metricHighlight}
                            </span>
                            <span className="text-xs text-slate-500 ml-1">{str.unit}</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-900">{str.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong>Physical Mechanism:</strong> {str.mechanism}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <strong>Production Value:</strong> {str.engineeringImpact}
                        </p>
                        <p className="text-[11px] font-mono text-emerald-800 pt-1 border-t border-slate-200/80">
                          Competitive Edge: {str.mitigationOrLeverage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drawbacks & Limitations Column */}
              {(strengthLimitFilter === 'both' || strengthLimitFilter === 'limits') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-amber-600 pb-3">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Drawbacks, Limitations & Engineering Mitigations
                    </h3>
                    <span className="text-xs font-mono text-amber-700 font-medium">
                      6 CONSTRAINTS
                    </span>
                  </div>

                  <div className="space-y-4">
                    {DRAWBACKS_AND_LIMITATIONS.map((lim) => (
                      <div
                        key={lim.id}
                        className="p-5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2.5"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-xs font-mono text-slate-500">
                            LIMITATION {lim.index} · {lim.category.toUpperCase()}
                          </span>
                          <div className="font-mono tabular-nums shrink-0">
                            <span className="text-base font-semibold text-amber-800">
                              {lim.metricHighlight}
                            </span>
                            <span className="text-xs text-slate-500 ml-1">{lim.unit}</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-900">{lim.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong>Root Physical Cause:</strong> {lim.mechanism}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <strong>Operational Constraint:</strong> {lim.engineeringImpact}
                        </p>
                        <p className="text-[11px] font-mono text-slate-700 pt-1 border-t border-slate-200/80">
                          {lim.mitigationOrLeverage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Radar Chart & Quantitative Benchmarking Table */}
            <div className="pt-6 border-t border-slate-200">
              <ProcessRadarBenchmark />
            </div>
          </div>
        </section>

        {/* CHAPTER 05: FUTURE OUTLOOK FOR INDUSTRIAL MANUFACTURING INTEGRATION (2026–2035) */}
        <section id="future-outlook" className="py-14 border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6 space-y-10">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-blue-700">
                05 / FUTURE OUTLOOK & INDUSTRIAL INTEGRATION ROADMAP (2026 – 2035)
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-medium text-slate-950">
                Transitioning DMD from Specialized Repair Cells to Lights-Out Factory Production
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Over the next decade, Direct Metal Deposition is evolving from a standalone
                maintenance and cladding tool into a core pillar of automated, closed-loop digital
                factories. Five technological convergences define its industrial integration
                trajectory.
              </p>
            </div>

            {/* Editorial Pull Quote */}
            <blockquote className="border-l-2 border-blue-600 pl-6 py-2 my-6 max-w-4xl">
              <p className="text-xl sm:text-2xl font-editorial italic text-slate-800 leading-relaxed">
                "The industrial convergence of Extreme High-Speed Laser Material Deposition (EHLA),
                coaxial Optical Coherence Tomography (OCT), and 5-axis hybrid CNC milling transforms
                DMD from a near-net-shape welding process into a single-clamping, born-qualified
                manufacturing platform."
              </p>
              <footer className="mt-2 text-xs font-mono text-slate-500">
                — INDUSTRIAL ADDITIVE MANUFACTURING ROADMAP · ISO/ASTM JG 75 & FRAUNHOFER ILT
                BENCHMARKS
              </footer>
            </blockquote>

            {/* 5 Future Integration Vectors */}
            <div className="space-y-6">
              {FUTURE_OUTLOOK_VECTORS.map((vec, index) => (
                <article
                  key={vec.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  {/* Left Horizon & Metric Column (4 cols) */}
                  <div className="lg:col-span-4 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0 lg:pr-6">
                    <div className="text-xs font-mono text-slate-500">
                      VECTOR 0{index + 1} · {vec.trlLevel}
                    </div>
                    <div className="text-xs font-mono font-semibold text-blue-700">
                      {vec.horizon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                      {vec.title}
                    </h3>
                    <p className="text-xs text-slate-500">{vec.subtitle}</p>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        Projected Production Benchmark
                      </div>
                      <div className="mt-0.5 flex items-baseline">
                        <span className="text-2xl font-mono font-semibold tabular-nums text-slate-900">
                          {vec.adoptionImpactMetric}
                        </span>
                        <span className="text-xs font-mono text-slate-500 ml-1.5">{vec.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Technical Details & Milestones (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-900">
                          Core Physics & Hardware Breakthrough
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {vec.technicalBreakthrough}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-900">
                          Factory Floor Integration Pathway
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {vec.industrialIntegrationPath}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                        Key Industrial Qualification Milestones
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {vec.keyMilestones.map((ms, i) => (
                          <div key={i} className="text-xs text-slate-700 leading-snug flex gap-2">
                            <span className="font-mono text-blue-600 font-semibold">
                              0{i + 1}.
                            </span>
                            <span>{ms}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer (No Ornamental Telemetry Tickers) */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-slate-900 font-editorial">
              Direct Metal Deposition (DMD) Technical Review & Engineering Monograph
            </div>
            <div>
              Compiled in accordance with ISO/ASTM 52900 (DED-LB/M), AMS 7004, and NADCAP Laser
              Deposition Guidelines.
            </div>
          </div>

          <div className="flex items-center gap-4 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleDownloadMarkdownReport}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Full Markdown Review
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
