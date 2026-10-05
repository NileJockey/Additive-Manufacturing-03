import nozzleHeroImg from '../assets/images/dmd_coaxial_nozzle_hero_1791187952102.jpg';
import turbineRepairImg from '../assets/images/dmd_turbine_repair_1791187963664.jpg';
import fgmBimetallicImg from '../assets/images/dmd_fgm_bimetallic_1791187973654.jpg';
import hybridCncImg from '../assets/images/dmd_hybrid_cnc_cell_1791187982991.jpg';

export const DMD_IMAGES = {
  nozzleHero: nozzleHeroImg,
  turbineRepair: turbineRepairImg,
  fgmBimetallic: fgmBimetallicImg,
  hybridCnc: hybridCncImg,
};

export interface SubsystemSpec {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  operatingRange: string;
  unit: string;
  summary: string;
  technicalDetails: string[];
  keyParameters: { label: string; value: string; unit: string }[];
}

export const PROCESS_SUBSYSTEMS: SubsystemSpec[] = [
  {
    id: 'energy-source',
    index: '01',
    title: 'High-Energy Laser & Beam Delivery Optics',
    subtitle: 'Photonic Energy Coupling & Intensity Distribution',
    operatingRange: '0.5 – 10.0',
    unit: 'kW',
    summary:
      'Direct Metal Deposition utilizes a focused high-power continuous-wave (CW) or pulsed laser beam—predominantly Yb-doped fiber (1070 nm), disk (1030 nm), direct diode (915–980 nm), or green/blue (450–515 nm) sources—to generate a localized melt pool on a metallic substrate.',
    technicalDetails: [
      'Near-infrared Yb-fiber and disk lasers (1030–1070 nm) provide high beam quality (BPP 2–8 mm·mrad) for structural alloys including steels, nickel superalloys, and titanium.',
      'Visible-spectrum green (515 nm) and blue (445–450 nm) high-power diode/disk lasers increase absorptivity in highly reflective non-ferrous metals (pure Cu, Au, Al) from <5% (at 1070 nm) to 40–65%, preventing keyhole instabilities and spatter.',
      'Beam-shaping optics convert Gaussian profiles into top-hat or ring-mode intensity distributions, flattening thermal gradients across the melt track width (0.6–5.0 mm) and minimizing centerline dilution.',
    ],
    keyParameters: [
      { label: 'Spot Diameter', value: '0.50 – 5.00', unit: 'mm' },
      { label: 'Power Density', value: '10² – 10⁴', unit: 'W/mm²' },
      { label: 'Wavelengths', value: '450 / 515 / 1070', unit: 'nm' },
    ],
  },
  {
    id: 'feedstock-nozzle',
    index: '02',
    title: 'Coaxial & Multi-Jet Powder Delivery Architecture',
    subtitle: 'Gas-Solid Two-Phase Flow & Focal Convergence',
    operatingRange: '45 – 150',
    unit: 'μm PSD',
    summary:
      'Gas-atomized or PREP spherical metallic powders are metered from pressurized gravimetric or volumetric hoppers and pneumatically conveyed by an inert carrier gas (Argon or Helium) through either a continuous coaxial cone nozzle or discrete 3-to-6-jet nozzles converging at the laser focal plane.',
    technicalDetails: [
      'Continuous coaxial annular nozzles deliver omnidirectional deposition independence, ideal for fine track widths (0.6–2.0 mm) and intricate 3D paths, achieving 70–85% powder catchment efficiency.',
      'Discrete multi-jet (3-jet, 4-jet, or 6-jet) nozzles enable full 5-axis tilting up to 90° from vertical without gravity-induced powder flow asymmetry, mandatory for overhang deposition and turbine blisk repair.',
      'Coaxial inert shielding gas (typically Ar at 10–25 L/min, or Ar-He blends) shrouds the molten pool to suppress oxide film formation, keeping oxygen levels below 50–200 ppm in localized chambers.',
    ],
    keyParameters: [
      { label: 'Mass Feed Rate', value: '2.0 – 85.0', unit: 'g/min' },
      { label: 'Carrier Gas Flow', value: '3.0 – 8.0', unit: 'L/min Ar' },
      { label: 'Powder Stand-Off', value: '8.0 – 15.0', unit: 'mm' },
    ],
  },
  {
    id: 'closed-loop-control',
    index: '03',
    title: 'Closed-Loop Optical Pyrometry & Height Sensing',
    subtitle: 'Real-Time Melt Pool Regulation (The Core DMD Distinction)',
    operatingRange: '1.0 – 10.0',
    unit: 'kHz loop',
    summary:
      'Originally pioneered as the defining feature of DMD (Direct Metal Deposition) over open-loop laser cladding, coaxial optical sensors continuously monitor melt pool thermal emission and bead geometry, dynamically modulating laser power and Z-axis standoff within milliseconds.',
    technicalDetails: [
      'Dual-wavelength (bichromatic) pyrometers integrated coaxially into the laser optical train measure absolute melt pool surface temperature (1200–2800 °C) independent of emissivity fluctuations.',
      'High-speed CMOS/CCD vision cameras coupled with structured laser triangulation or Optical Coherence Tomography (OCT) track real-time layer height, preventing cumulative over-building or under-building at corners and toolpath reversals.',
      'Proportional-Integral-Derivative (PID) controllers throttle laser output in <1 ms when passing over thin walls, pre-drilled cooling channels, or heat-accumulated upper layers.',
    ],
    keyParameters: [
      { label: 'Pyrometer Range', value: '1100 – 2800', unit: '°C' },
      { label: 'Height Accuracy', value: '±25.0', unit: 'μm' },
      { label: 'Response Latency', value: '0.2 – 1.0', unit: 'ms' },
    ],
  },
  {
    id: 'solidification-metallurgy',
    index: '04',
    title: 'Melt Pool Fluid Dynamics & Epitaxial Solidification',
    subtitle: 'Marangoni Convection, Thermal Gradients & Grain Morphology',
    operatingRange: '10³ – 10⁵',
    unit: 'K/s cooling',
    summary:
      'As the laser traverses the substrate, a shallow dilution zone (typically 5–15% of bead height) melts the underlying base metal. Strong surface-tension gradients drive Marangoni thermocapillary flow, homogenizing alloying elements before rapid directional solidification occurs.',
    technicalDetails: [
      'The ratio of thermal gradient (G ≈ 10⁵–10⁶ K/m) to solidification growth rate (R ≈ 1–50 mm/s) governs microstructure morphology: high G/R at the melt pool floor drives epitaxial columnar dendritic growth aligned with the maximum heat flow vector.',
      'Near the top of the melt pool where G decreases and R increases, a Columnar-to-Equiaxed Transition (CET) can be engineered—critical for repairing single-crystal superalloy turbine blades without stray grain nucleation.',
      'Subsequent laser passes subject previously deposited layers to intrinsic cyclic heat treatment (intrinsic tempering/aging), which can precipitate strengthening phases or relax brittle martensite in tool steels.',
    ],
    keyParameters: [
      { label: 'Thermal Gradient G', value: '10⁵ – 10⁶', unit: 'K/m' },
      { label: 'Dilution Ratio', value: '2.0 – 10.0', unit: '%' },
      { label: 'Dendrite Spacing', value: '2.5 – 12.0', unit: 'μm' },
    ],
  },
];

export type AlloyFamily =
  | 'Nickel Superalloys'
  | 'Titanium Alloys'
  | 'Tool & High-Strength Steels'
  | 'Stainless & Duplex Steels'
  | 'Cobalt-Chrome & Wear Alloys'
  | 'Copper & Thermal Alloys'
  | 'MMCs & Refractory Metals';

export interface AllowedMaterial {
  id: string;
  designation: string;
  unsOrStandard: string;
  family: AlloyFamily;
  nominalComposition: string;
  powderPsdUm: string;
  preferredLaserNm: string;
  specificEnergyJmm2: string;
  preheatTempC: string;
  relativeDensityPct: string;
  yieldStrengthMpa: string;
  utsMpa: string;
  elongationPct: string;
  processabilityStatus: 'NOMINAL' | 'MODERATE PREHEAT' | 'HIGH CRACK SENSITIVITY';
  metallurgicalNotes: string;
  keyApplications: string[];
}

export const ALLOWED_MATERIALS: AllowedMaterial[] = [
  {
    id: 'in718',
    designation: 'Inconel 718 (Alloy 718)',
    unsOrStandard: 'UNS N07718 · AMS 5662',
    family: 'Nickel Superalloys',
    nominalComposition: 'Ni-19Cr-18Fe-5.1(Nb+Ta)-3Mo-0.9Ti-0.5Al',
    powderPsdUm: '45 – 106',
    preferredLaserNm: '1070 (Yb-Fiber)',
    specificEnergyJmm2: '35 – 65',
    preheatTempC: '25 (Ambient)',
    relativeDensityPct: '99.85',
    yieldStrengthMpa: '1040 (Aged)',
    utsMpa: '1280 (Aged)',
    elongationPct: '16.5',
    processabilityStatus: 'NOMINAL',
    metallurgicalNotes:
      'Sluggish γ″ (Ni3Nb) precipitation kinetics make Inconel 718 highly resistant to strain-age cracking during DMD. Low heat input prevents interdendritic Laves phase segregation; standard AMS 5662 solution + double aging restores full wrought-equivalent creep and tensile strength.',
    keyApplications: [
      'Jet engine turbine cases, blisks, and seal runner refurbishment',
      'Cryogenic liquid rocket engine manifolds and turbopump housings',
      'Downhole oil & gas high-pressure / high-temperature (HPHT) tools',
    ],
  },
  {
    id: 'in625',
    designation: 'Inconel 625 (Alloy 625)',
    unsOrStandard: 'UNS N06625 · ASTM B443',
    family: 'Nickel Superalloys',
    nominalComposition: 'Ni-21.5Cr-9Mo-3.6(Nb+Ta)-<5Fe',
    powderPsdUm: '45 – 125',
    preferredLaserNm: '1070 (Yb-Fiber / Diode)',
    specificEnergyJmm2: '30 – 55',
    preheatTempC: '25 (Ambient)',
    relativeDensityPct: '99.90',
    yieldStrengthMpa: '540 (As-Built)',
    utsMpa: '890 (As-Built)',
    elongationPct: '32.0',
    processabilityStatus: 'NOMINAL',
    metallurgicalNotes:
      'Solid-solution strengthened Ni-Cr-Mo alloy with exceptional weldability and zero susceptibility to post-weld cracking. Frequently used as a corrosion-resistant cladding overlay and as a compliant ductile intermediate buffer layer in bimetallic DMD transitions.',
    keyApplications: [
      'Subsea riser, valve bore, and mud motor rotor corrosion cladding',
      'Marine exhaust ducts and naval propeller shaft overlays',
      'Structural jacket on regeneratively cooled Cu-alloy rocket nozzles',
    ],
  },
  {
    id: 'cmsx4',
    designation: 'CMSX-4 / René N5 (High-γ′ SX)',
    unsOrStandard: 'Single-Crystal Ni-Superalloy',
    family: 'Nickel Superalloys',
    nominalComposition: 'Ni-9Co-6.5Cr-6W-5.6Al-6.5Ta-3Re-1Ti-0.6Mo',
    powderPsdUm: '45 – 90 (PREP)',
    preferredLaserNm: '1070 (Top-Hat Fiber)',
    specificEnergyJmm2: '45 – 80',
    preheatTempC: '850 – 1000 (Induction)',
    relativeDensityPct: '99.60',
    yieldStrengthMpa: '1120',
    utsMpa: '1240',
    elongationPct: '9.5',
    processabilityStatus: 'HIGH CRACK SENSITIVITY',
    metallurgicalNotes:
      'Contains >65 vol% γ′ (Ni3(Al,Ti)) phase, placing it well inside the conventionally "non-weldable" liquefaction/strain-age cracking zone. DMD achieves crack-free epitaxial single-crystal tip repair by maintaining a strict high G/R thermal gradient ratio and 900 °C localized induction preheating.',
    keyApplications: [
      'High-pressure turbine (HPT) single-crystal blade tip restoration',
      'Aero-engine shroud segment hot-gas-path refurbishment',
    ],
  },
  {
    id: 'ti64',
    designation: 'Ti-6Al-4V ELI (Grade 23 / Grade 5)',
    unsOrStandard: 'UNS R56401 · AMS 4998',
    family: 'Titanium Alloys',
    nominalComposition: 'Ti-6.0Al-4.0V-<0.13O',
    powderPsdUm: '45 – 150 (GA / PREP)',
    preferredLaserNm: '1070 (Yb-Fiber)',
    specificEnergyJmm2: '40 – 75',
    preheatTempC: '25 – 200',
    relativeDensityPct: '99.80',
    yieldStrengthMpa: '985 (Stress-Relieved)',
    utsMpa: '1075 (Stress-Relieved)',
    elongationPct: '12.5',
    processabilityStatus: 'NOMINAL',
    metallurgicalNotes:
      'Dual-phase α+β titanium alloy. Rapid cooling during DMD produces acicular α′ martensite within coarse prior-β columnar grains running across layers. Requires strict inert Argon atmosphere (<50 ppm O2/N2) to prevent interstitial alpha-case embrittlement. Sub-transus annealing (730–850 °C) converts α′ to ductile lamellar α+β.',
    keyApplications: [
      'Large aerospace structural bulkheads, wing ribs, and landing gear brackets',
      'Low-pressure compressor (LPC) titanium blisk leading-edge repair',
      'Load-bearing orthopedic implant stems and cranial plates',
    ],
  },
  {
    id: 'h13',
    designation: 'AISI H13 Hot-Work Tool Steel',
    unsOrStandard: 'UNS T20813 · DIN 1.2344',
    family: 'Tool & High-Strength Steels',
    nominalComposition: 'Fe-5.2Cr-1.4Mo-1.0V-1.0Si-0.40C',
    powderPsdUm: '45 – 106',
    preferredLaserNm: '1070 / 980 (Diode/Fiber)',
    specificEnergyJmm2: '45 – 70',
    preheatTempC: '250 – 400',
    relativeDensityPct: '99.75',
    yieldStrengthMpa: '1380',
    utsMpa: '1690 (52–55 HRC)',
    elongationPct: '8.0',
    processabilityStatus: 'MODERATE PREHEAT',
    metallurgicalNotes:
      'High hardenability air-hardening martensitic tool steel. During multi-layer DMD, consecutive laser passes cause intrinsic cyclic tempering of underlying tracks, producing a tough mixture of tempered martensite and fine vanadium/molybdenum carbides. Substrate preheating above Ms (≈300 °C) eliminates cold cracking.',
    keyApplications: [
      'Die-casting dies and plastic injection molds with conformal cooling channels',
      'Hot extrusion and forging die wear restoration',
      'Bimetallic H13-on-CuCrZr high-conductivity mold core inserts',
    ],
  },
  {
    id: 'm2-hss',
    designation: 'AISI M2 / M4 High-Speed Steel',
    unsOrStandard: 'UNS T11302 · DIN 1.3343',
    family: 'Tool & High-Strength Steels',
    nominalComposition: 'Fe-6.2W-5.0Mo-4.1Cr-1.9V-0.85C',
    powderPsdUm: '45 – 90',
    preferredLaserNm: '1070 (Fiber)',
    specificEnergyJmm2: '40 – 65',
    preheatTempC: '350 – 500',
    relativeDensityPct: '99.65',
    yieldStrengthMpa: '1850',
    utsMpa: '2150 (62–65 HRC)',
    elongationPct: '3.5',
    processabilityStatus: 'MODERATE PREHEAT',
    metallurgicalNotes:
      'Rapid DMD solidification refines primary MC (V4C3) and M6C (Fe3W3C) eutectic carbides to <2 μm—significantly finer than conventional cast/wrought M2—yielding superior abrasive wear resistance and red hardness up to 600 °C.',
    keyApplications: [
      'Cutting tool edges, gear hobs, and broaches',
      'Automotive stamping die trim edges and shear blades',
    ],
  },
  {
    id: 'ss316l',
    designation: 'AISI 316L Austenitic Stainless Steel',
    unsOrStandard: 'UNS S31603 · DIN 1.4404',
    family: 'Stainless & Duplex Steels',
    nominalComposition: 'Fe-17Cr-12Ni-2.5Mo-<0.03C',
    powderPsdUm: '45 – 125',
    preferredLaserNm: '1070 (Fiber / Diode)',
    specificEnergyJmm2: '25 – 50',
    preheatTempC: '25 (Ambient)',
    relativeDensityPct: '99.92',
    yieldStrengthMpa: '470 (As-Built)',
    utsMpa: '650 (As-Built)',
    elongationPct: '42.0',
    processabilityStatus: 'NOMINAL',
    metallurgicalNotes:
      'Solidifies in a primary austenitic or ferrite-austenite (FA) mode with 3–8% intercellular δ-ferrite along sub-grain cell walls, suppressing hot cracking and delivering yield strength ~60% higher than annealed wrought plate without sacrificing ductility.',
    keyApplications: [
      'Chemical processing pressure vessels, nuclear piping nozzles, and cryogenic valves',
      'Food-grade and pharmaceutical sanitary pump impellers',
      'Structural base for functionally graded transitions',
    ],
  },
  {
    id: 'stellite6',
    designation: 'Stellite 6 (Co-Cr-W-C Hardfacing)',
    unsOrStandard: 'UNS R30006 · AWS ECoCr-A',
    family: 'Cobalt-Chrome & Wear Alloys',
    nominalComposition: 'Co-28Cr-4.5W-1.2C-1.1Si-<3Ni-<3Fe',
    powderPsdUm: '45 – 125',
    preferredLaserNm: '980 / 1070 (Diode / Fiber)',
    specificEnergyJmm2: '30 – 55',
    preheatTempC: '200 – 350',
    relativeDensityPct: '99.80',
    yieldStrengthMpa: '780',
    utsMpa: '1150 (42–46 HRC)',
    elongationPct: '4.5',
    processabilityStatus: 'MODERATE PREHEAT',
    metallurgicalNotes:
      'Hypoeutectic cobalt matrix reinforced with chromium-rich M7C3 and M23C6 carbides. Low dilution (<4%) in DMD preserves surface hardness in a single pass compared to 2–3 passes required by TIG/PTA welding where iron dilution degrades wear resistance.',
    keyApplications: [
      'Steam turbine control valve seats and nuclear gate valve sealing faces',
      'Internal combustion exhaust valve seats and hydro-turbine cavitation shields',
    ],
  },
  {
    id: 'grcop84',
    designation: 'GRCop-84 / CuCr1Zr Copper Alloys',
    unsOrStandard: 'NASA GRCop-84 / CW106C',
    family: 'Copper & Thermal Alloys',
    nominalComposition: 'Cu-6.5Cr-5.8Nb (or Cu-1.0Cr-0.15Zr)',
    powderPsdUm: '45 – 106',
    preferredLaserNm: '515 (Green) / 450 (Blue) / High-Intensity 1070',
    specificEnergyJmm2: '60 – 110',
    preheatTempC: '25 – 250',
    relativeDensityPct: '99.50',
    yieldStrengthMpa: '310 – 420',
    utsMpa: '510 – 620',
    elongationPct: '18.0',
    processabilityStatus: 'NOMINAL',
    metallurgicalNotes:
      'Dispersion-strengthened (Cr2Nb precipitates in GRCop) or precipitation-hardened copper alloys combining high thermal conductivity (260–320 W/m·K, ~75% of pure Cu) with creep resistance up to 700 °C. Blue/green lasers dramatically improve energy coupling.',
    keyApplications: [
      'Regeneratively cooled liquid rocket engine combustion chambers and expansion nozzles',
      'Conformal thermal management cores inside H13 injection molds',
      'Plasma-facing fusion reactor divertor heat sinks',
    ],
  },
  {
    id: 'wcco-mmc',
    designation: 'WC-12Co / NiCrBSi Metal Matrix Composite',
    unsOrStandard: 'Cermet / Hardfacing MMC',
    family: 'MMCs & Refractory Metals',
    nominalComposition: '40–60 wt% WC particles in NiCrBSi or Co matrix',
    powderPsdUm: '53 – 150 (Blended / Agglomerated)',
    preferredLaserNm: '980 (Diode) / EHLA 1070',
    specificEnergyJmm2: '20 – 45',
    preheatTempC: '300 – 450',
    relativeDensityPct: '99.40',
    yieldStrengthMpa: '1650 (Compressive)',
    utsMpa: '2400 (Compressive, 65–72 HRC)',
    elongationPct: '1.2',
    processabilityStatus: 'MODERATE PREHEAT',
    metallurgicalNotes:
      'Dual-hopper DMD injects spherical or cast Tungsten Carbide (WC, 2200–2800 HV) into a ductile NiCrBSi or Co melt pool. Closed-loop pyrometry keeps melt pool temperature just above matrix liquidus (~1050–1250 °C) to prevent WC thermal dissolution into brittle W2C/η-phases.',
    keyApplications: [
      'Oil & gas PDC drill bit stabilizers and directional drilling wear pads',
      'Mining excavator teeth, slurry pump casings, and agricultural tillage blades',
    ],
  },
];

export interface BimetallicTransition {
  id: string;
  baseAlloy: string;
  targetAlloy: string;
  directCompatibility: 'DIRECT GRADIENT' | 'BUFFER LAYER REQUIRED' | 'INTERMETALLIC RISK';
  deleteriousPhasesAvoided: string;
  recommendedPathway: string;
  gradientSteps: { step: string; composition: string; role: string }[];
  industrialUseCase: string;
  interfaceBondStrengthMpa: string;
}

export const BIMETALLIC_TRANSITIONS: BimetallicTransition[] = [
  {
    id: 'grcop-in625',
    baseAlloy: 'GRCop-84 / CuCrZr',
    targetAlloy: 'Inconel 625 / Inconel 718',
    directCompatibility: 'DIRECT GRADIENT',
    deleteriousPhasesAvoided: 'None (Cu-Ni forms complete solid solution; Cr-Nb Laves minimized via Inconel 625)',
    recommendedPathway: 'Direct compositional grading or 2-layer Inconel 625 tie-coat before Inconel 718 structural jacket',
    gradientSteps: [
      { step: 'Substrate', composition: '100% GRCop-84 / CuCrZr', role: 'High-heat-flux inner combustion liner (300 W/m·K)' },
      { step: 'Zone 1 (0.5 mm)', composition: '70% Cu-Alloy + 30% Inconel 625', role: 'Thermal expansion (CTE) accommodation layer' },
      { step: 'Zone 2 (0.5 mm)', composition: '30% Cu-Alloy + 70% Inconel 625', role: 'Cu-Ni ductile solid-solution transition' },
      { step: 'Structural Shell', composition: '100% Inconel 625 / 718', role: 'High-pressure structural containment jacket' },
    ],
    industrialUseCase: 'NASA / Commercial Space bimetallic liquid rocket engine thrust chambers & expansion nozzles',
    interfaceBondStrengthMpa: '485 (Fractures in ductile Cu base, never at interface)',
  },
  {
    id: 'h13-cu',
    baseAlloy: 'CuCr1Zr Thermal Core',
    targetAlloy: 'AISI H13 Tool Steel Shell',
    directCompatibility: 'BUFFER LAYER REQUIRED',
    deleteriousPhasesAvoided: 'Liquid metal embrittlement (Cu penetration into Fe grain boundaries) & CTE mismatch cracking',
    recommendedPathway: 'Nickel-base (Inconel 625 or Deloro 22) intermediate buffer layer between Cu core and H13 outer shell',
    gradientSteps: [
      { step: 'Core', composition: '100% CuCr1Zr', role: 'Rapid heat extraction core for injection mold boss' },
      { step: 'Buffer 1 (0.8 mm)', composition: '100% Inconel 625 / Ni-Cu', role: 'Diffusion barrier preventing Cu grain-boundary wetting in Fe' },
      { step: 'Buffer 2 (0.8 mm)', composition: '50% Inconel 625 + 50% H13', role: 'Gradual hardness and modulus transition' },
      { step: 'Working Surface', composition: '100% AISI H13 (54 HRC)', role: 'High-wear, polishable mold cavity surface' },
    ],
    industrialUseCase: 'High-pressure aluminum die-casting & plastic injection molding inserts (35–50% cycle time reduction)',
    interfaceBondStrengthMpa: '540',
  },
  {
    id: 'ti64-ss316l',
    baseAlloy: 'Ti-6Al-4V',
    targetAlloy: 'AISI 316L Stainless Steel',
    directCompatibility: 'INTERMETALLIC RISK',
    deleteriousPhasesAvoided: 'Brittle FeTi and Fe2Ti intermetallic compounds (>900 HV hardness, spontaneous delamination)',
    recommendedPathway: 'Multi-metallic V → Cr → Fe or Nb → Cu → Ni compositional pathway completely bypassing the Ti-Fe binary line',
    gradientSteps: [
      { step: 'Base', composition: '100% Ti-6Al-4V', role: 'Lightweight aerospace/cryogenic titanium structure' },
      { step: 'Interlayer A', composition: '100% Vanadium (V) or Niobium (Nb)', role: 'Forms continuous BCC solid solution with Beta-Ti' },
      { step: 'Interlayer B', composition: '50% V + 50% Cr (or Cu-Ni)', role: 'Suppresses σ-phase and FeTi formation' },
      { step: 'Target', composition: '100% AISI 316L Stainless', role: 'Corrosion-resistant steel piping flange' },
    ],
    industrialUseCase: 'Aerospace cryogenic propellant feedline transitions and nuclear reprocessing joints',
    interfaceBondStrengthMpa: '410',
  },
  {
    id: 'ss316l-in718',
    baseAlloy: 'AISI 316L Stainless Steel',
    targetAlloy: 'Inconel 718',
    directCompatibility: 'DIRECT GRADIENT',
    deleteriousPhasesAvoided: 'Secondary NbC / Laves eutectic at 20–40 wt% Inconel 718 dilution',
    recommendedPathway: 'Continuous 10%–25% step grading via dual-hopper DMD or direct low-dilution (<3%) transition',
    gradientSteps: [
      { step: 'Base', composition: '100% AISI 316L', role: 'Cost-effective ductile structural manifold' },
      { step: 'Gradient (2.0 mm)', composition: '25% → 50% → 75% Inconel 718', role: 'Smooth thermal expansion transition (16.5 to 13.0 μm/m·K)' },
      { step: 'Hot Section', composition: '100% Inconel 718', role: '650 °C creep and oxidation-resistant turbine interface' },
    ],
    industrialUseCase: 'Gas turbine exhaust casings, supercritical CO2 heat exchangers, and nuclear reactor internals',
    interfaceBondStrengthMpa: '620',
  },
];

export interface ApplicationCaseStudy {
  id: string;
  sector: 'Aerospace & Propulsion' | 'Die, Mold & Tooling' | 'Energy, Oil & Gas' | 'Marine & Heavy Defense';
  title: string;
  componentName: string;
  alloysUsed: string;
  imageKey: keyof typeof DMD_IMAGES;
  figureCaption: string;
  problemStatement: string;
  dmdSolutionArchitecture: string;
  quantitativeOutcomes: { metric: string; value: string; context: string }[];
  processParameters: { param: string; spec: string }[];
}

export const INDUSTRIAL_APPLICATIONS: ApplicationCaseStudy[] = [
  {
    id: 'aerospace-blisk-repair',
    sector: 'Aerospace & Propulsion',
    title: 'Single-Crystal & Polycrystalline Turbine Blade / Blisk Restoration',
    componentName: 'High-Pressure Turbine (HPT) Blades & Compressor Blisks',
    alloysUsed: 'Inconel 718 · CMSX-4 · Ti-6Al-4V',
    imageKey: 'turbineRepair',
    figureCaption:
      'Fig. 2 — Precision 5-axis DMD leading-edge and tip restoration on an aero-engine turbine blade, maintaining epitaxial grain continuity and <300 μm heat-affected zone.',
    problemStatement:
      'Aero-engine compressor blisks (integrally bladed disks) and high-pressure turbine blades suffer tip rubbing, foreign object damage (FOD), and thermal-fatigue cracking. Conventional TIG/plasma welding induces excessive heat input, warps thin airfoils (<1.2 mm), and nucleates stray equiaxed grains in single-crystal castings—forcing complete part scrapping at $45,000–$180,000 per rotor.',
    dmdSolutionArchitecture:
      'Automated 3D blue-light structured scanning captures the exact worn airfoil geometry and generates an adaptive 5-axis toolpath. Closed-loop pyrometry regulates a 400–800 W fiber laser with a 0.8 mm spot diameter, depositing 45–90 μm superalloy powder layer-by-layer while preserving epitaxial grain alignment with the underlying blade substrate.',
    quantitativeOutcomes: [
      { metric: '78 %', value: 'Unit Cost Reduction', context: 'Compared to new blisk forging & 5-axis CNC milling' },
      { metric: '1.4 : 1', value: 'Effective Buy-to-Fly Ratio', context: 'Reduced from 18:1 conventional billet machining' },
      { metric: '< 250 μm', value: 'Heat-Affected Zone (HAZ)', context: '85% narrower than micro-TIG welding' },
    ],
    processParameters: [
      { param: 'Laser Power', spec: '350 – 750 W (Closed-Loop)' },
      { param: 'Track Width', spec: '0.75 – 1.20 mm' },
      { param: 'Layer Thickness', spec: '150 – 250 μm' },
      { param: 'Qualification', spec: 'Fluorescent Penetrant + X-Ray CT' },
    ],
  },
  {
    id: 'bimetallic-rocket-nozzle',
    sector: 'Aerospace & Propulsion',
    title: 'Monolithic Bimetallic Liquid Rocket Thrust Chambers & Nozzles',
    componentName: 'Regeneratively Cooled Combustion Chamber & Expansion Bell',
    alloysUsed: 'GRCop-84 / CuCrZr + Inconel 625 / 718',
    imageKey: 'fgmBimetallic',
    figureCaption:
      'Fig. 3 — Functionally graded bimetallic cross-section transitioning from copper-alloy inner cooling channels to a high-strength nickel superalloy structural outer jacket.',
    problemStatement:
      'Liquid rocket engines require a copper-alloy inner liner (GRCop-84) to conduct extreme combustion heat fluxes (>80 MW/m²) into cryogenic fuel channels, paired with a high-strength superalloy outer structural jacket (Inconel 625/718) to withstand 150+ bar chamber pressure. Traditional electroforming or vacuum brazing requires 6–9 months and risks catastrophic bond-line delamination.',
    dmdSolutionArchitecture:
      'Large-envelope robotic/5-axis DMD systems first build or clad the copper liner, close out the integral cooling channels, and continuously grade into an Inconel 625/718 structural manifold and thrust mount within a single continuous metallurgical build sequence.',
    quantitativeOutcomes: [
      { metric: '68 %', value: 'Lead Time Compression', context: 'From 32 weeks (braze/electroform) down to 10 weeks' },
      { metric: '2.4 m', value: 'Max Monolithic Diameter', context: 'Exceeds L-PBF powder bed size limits by 4×' },
      { metric: '485 MPa', value: 'Bimetallic Bond UTS', context: 'Exceeds parent copper alloy tensile strength' },
    ],
    processParameters: [
      { param: 'Laser Source', spec: '2.0 – 6.0 kW Fiber / Green Dual-Source' },
      { param: 'Deposition Rate', spec: '1.8 – 4.2 kg/h' },
      { param: 'Nozzle Type', spec: 'Discrete 4-Jet Tiltable Coaxial' },
      { param: 'Wall Thickness', spec: '2.0 – 18.0 mm' },
    ],
  },
  {
    id: 'tooling-conformal-cooling',
    sector: 'Die, Mold & Tooling',
    title: 'Hybrid Conformal-Cooled Die Casting & Injection Molding Inserts',
    componentName: 'High-Pressure Aluminum Die-Casting Core & Automotive Stamping Dies',
    alloysUsed: 'AISI H13 · Maraging 300 · CuCr1Zr · M2 HSS',
    imageKey: 'hybridCnc',
    figureCaption:
      'Fig. 4 — 5-axis hybrid additive-subtractive CNC machining center executing alternating DMD tool-steel deposition and precision high-speed finish milling.',
    problemStatement:
      'Conventional gun-drilled straight cooling channels cannot follow complex 3D mold contours, causing localized thermal hotspots, solder sticking in aluminum die-casting, part warpage, and prolonged cooling cycle times (which account for 65% of total injection molding cycle duration).',
    dmdSolutionArchitecture:
      'Using a 5-axis hybrid DMD + CNC milling center, pre-machined H13 tool steel preforms have complex helical cooling grooves milled into their core, optionally backfilled with high-conductivity CuCrZr in hotspot regions, and encapsulated with dense H13 or M2 tool steel via DMD—cutting cost by 60% compared to printing the entire block from scratch in L-PBF.',
    quantitativeOutcomes: [
      { metric: '-38 %', value: 'Injection Cycle Time', context: 'Reduced from 42 s to 26 s via uniform thermal extraction' },
      { metric: '+240 %', value: 'Die Service Life', context: 'Thermal fatigue craze-cracking delayed from 40k to 135k shots' },
      { metric: '0.8 μm Ra', value: 'Final Machined Finish', context: 'Achieved in-situ via hybrid 5-axis finish milling' },
    ],
    processParameters: [
      { param: 'Substrate Preheat', spec: '300 – 380 °C (Integrated Table)' },
      { param: 'Hardness As-Built', spec: '52 – 55 HRC (H13) / 63 HRC (M2)' },
      { param: 'Hybrid Cycle', spec: 'Deposit 3 mm → Mill Internal Groove → Cap' },
      { param: 'Dilution', spec: '< 3.5 %' },
    ],
  },
  {
    id: 'energy-ehla-cladding',
    sector: 'Energy, Oil & Gas',
    title: 'High-Speed Corrosion & Wear Cladding of Subsea & Downhole Rotors',
    componentName: 'Mud Motor Drilling Rotors, Subsea Gate Valves & Hydraulic Cylinders',
    alloysUsed: 'Inconel 625 · Stellite 6 · WC-12Co MMC',
    imageKey: 'nozzleHero',
    figureCaption:
      'Fig. 5 — Coaxial powder-stream convergence in High-Speed DMD (EHLA), melting particles in-flight above a 50 μm substrate diffusion zone.',
    problemStatement:
      'Offshore hydraulic piston rods, mud motor rotors, and subsea valves experience severe sour-gas (H2S) corrosion and abrasive silica erosion. Hard-chrome electroplating suffers from micro-cracking and faces strict EU REACH / OSHA hexavalent chromium (Cr6+) environmental bans, while PTA welding causes excessive distortion and iron dilution.',
    dmdSolutionArchitecture:
      'High-Speed DMD (EHLA — Extreme High-Speed Laser Material Deposition) focuses the powder stream and laser slightly above the rotating shaft surface so particles melt in-flight before touching a microscopic (<50 μm) molten film. Traverse speeds reach 50–150 m/min, applying a dense, crack-free 100–350 μm Inconel 625 or WC-MMC barrier in a single pass.',
    quantitativeOutcomes: [
      { metric: '< 2.0 %', value: 'Substrate Fe Dilution', context: 'Preserves full corrosion resistance in a single 150 μm layer' },
      { metric: '120 m/min', value: 'Surface Speed (EHLA)', context: '40× faster area coverage than conventional laser cladding' },
      { metric: '100 %', value: 'Cr(VI)-Free Compliance', context: 'Direct metallurgical replacement for hard-chrome plating' },
    ],
    processParameters: [
      { param: 'Laser Power', spec: '4.0 – 8.0 kW Diode/Disk' },
      { param: 'Layer Thickness', spec: '50 – 250 μm per pass' },
      { param: 'Surface Roughness', spec: 'Ra 6 – 12 μm (As-Clad)' },
      { param: 'Area Rate', spec: '1.5 – 3.5 m²/h' },
    ],
  },
];

export interface StrengthOrLimitation {
  id: string;
  index: string;
  title: string;
  category: string;
  metricHighlight: string;
  unit: string;
  mechanism: string;
  engineeringImpact: string;
  mitigationOrLeverage: string;
}

export const POINTS_OF_STRENGTH: StrengthOrLimitation[] = [
  {
    id: 'str-fgm',
    index: '01',
    title: 'In-Situ Multi-Material & Functionally Graded Deposition (FGM)',
    category: 'Metallurgical Versatility',
    metricHighlight: '2 – 6',
    unit: 'Independent Hoppers',
    mechanism:
      'Multiple gravimetric powder feeders independently meter distinct alloys or ceramic reinforcements into a single mixing chamber or coaxial nozzle during active laser scanning.',
    engineeringImpact:
      'Enables continuous compositional gradients across X, Y, and Z coordinates within a single monolithic component—combining incompatible properties such as high thermal conductivity (CuCrZr), structural creep strength (Inconel 718), and extreme surface hardness (WC-Co).',
    mitigationOrLeverage:
      'Unattainable in standard powder-bed fusion (L-PBF), where the entire build chamber is flooded with a single alloy powder.',
  },
  {
    id: 'str-repair',
    index: '02',
    title: '3D Freeform Repair, Remanufacturing & Feature Addition',
    category: 'Lifecycle Economics',
    metricHighlight: '70 – 85',
    unit: '% Cost Savings',
    mechanism:
      'Coaxial multi-jet nozzles mounted on 5-axis CNC gantries or 6-axis industrial robots deposit metal normal to curved, contoured, or worn 3D substrates without requiring a flat horizontal build plate.',
    engineeringImpact:
      'Restores high-value worn aerospace turbine blades, blisks, forging dies, and marine propulsion shafts to original OEM geometry, or adds bosses/flanges onto inexpensive wrought forgings.',
    mitigationOrLeverage:
      'Reduces component replacement lead times from months to days and cuts embodied lifecycle carbon emissions by up to 80%.',
  },
  {
    id: 'str-scale-rate',
    index: '03',
    title: 'High Mass Deposition Rate & Unconstrained Build Volume',
    category: 'Throughput & Scale',
    metricHighlight: '0.5 – 5.0',
    unit: 'kg/h Rate',
    mechanism:
      'Local inert gas shielding at the nozzle tip (or large flexible argon enclosures) eliminates the restricted powder-bed box volume (typically ≤400×400 mm in L-PBF).',
    engineeringImpact:
      'Supports monolithic structural aerospace and energy components up to 3–5 meters in diameter with mass deposition rates 10× to 25× faster than single-laser L-PBF.',
    mitigationOrLeverage:
      'High-power (6–10 kW) DMD heads scale up to 8–12 kg/h for thick structural walls while fine nozzles (0.5 mm spot) handle precision detail.',
  },
  {
    id: 'str-low-dilution',
    index: '04',
    title: 'True Metallurgical Bond with Minimal Dilution & Narrow HAZ',
    category: 'Interfacial Integrity',
    metricHighlight: '< 3.5',
    unit: '% Dilution',
    mechanism:
      'Concentrated photonic energy density (10³–10⁴ W/mm²) and rapid traverse speeds melt only a microscopic surface skin (50–250 μm) of the underlying substrate.',
    engineeringImpact:
      'Produces a 100% fusion bond (>450–1000 MPa shear strength) vs. mechanical interlocking in thermal spray (HVOF/plasma), while avoiding the 15–35% base-metal dilution and wide Heat-Affected Zone (HAZ) typical of TIG, MIG, or PTA arc welding.',
    mitigationOrLeverage:
      'Preserves the delicate heat treatment and fatigue resistance of underlying thin-walled aerospace substrates.',
  },
  {
    id: 'str-closed-loop',
    index: '05',
    title: 'Real-Time Closed-Loop Thermal & Dimensional Regulation',
    category: 'Process Stability',
    metricHighlight: '0.2 – 1.0',
    unit: 'ms Feedback',
    mechanism:
      'Coaxial bichromatic pyrometers and optical height sensors continuously sample melt pool luminance and bead height at up to 10 kHz, throttling laser power on the fly.',
    engineeringImpact:
      'Maintains uniform cooling rates and clad thickness when traversing sharp corners, thin-to-thick cross-section transitions, or heat-saturated upper layers.',
    mitigationOrLeverage:
      'Prevents localized overheating, keyhole porosity, and dimensional over-building without manual operator intervention.',
  },
  {
    id: 'str-hybrid-cnc',
    index: '06',
    title: 'Seamless Hybrid Additive-Subtractive 5-Axis Integration',
    category: 'Manufacturing Workflow',
    metricHighlight: '0.8',
    unit: 'μm Ra Machined',
    mechanism:
      'Because DMD uses no loose powder bed, the laser deposition head swaps directly into a standard HSK tool spindle alongside high-speed milling cutters in a single 5-axis CNC enclosure.',
    engineeringImpact:
      'Allows alternating additive build cycles and precision finish milling of internal cavities, conformal cooling channels, and sealing bores that would become inaccessible once the part is fully enclosed.',
    mitigationOrLeverage:
      'Delivers finished, tolerance-verified components (±10 μm) in a single clamping setup ("Done-in-One").',
  },
];

export const DRAWBACKS_AND_LIMITATIONS: StrengthOrLimitation[] = [
  {
    id: 'lim-roughness',
    index: '01',
    title: 'Near-Net-Shape Surface Roughness & Feature Resolution',
    category: 'Geometric Fidelity',
    metricHighlight: '15 – 45',
    unit: 'μm Ra As-Built',
    mechanism:
      'Large melt pool dimensions (0.6–4.0 mm width), layer step-over stair-stepping, and partially sintered satellite powder particles adhering to the molten track edges degrade surface finish.',
    engineeringImpact:
      'Minimum wall thickness is restricted to ~0.6–1.0 mm (vs. 0.15 mm in L-PBF), and as-built surfaces cannot serve as hydraulic seals, bearing journals, or aerodynamic flow paths without post-machining.',
    mitigationOrLeverage:
      'Mitigation: Plan a 0.5–1.5 mm machining allowance on all functional surfaces and integrate into a hybrid CNC milling cycle or use fine-powder EHLA (Ra < 8 μm).',
  },
  {
    id: 'lim-residual-stress',
    index: '02',
    title: 'Steep Thermal Gradients, Residual Stress & Hot Cracking',
    category: 'Thermomechanical Stress',
    metricHighlight: '10⁵ – 10⁶',
    unit: 'K/m Gradient',
    mechanism:
      'Localized melting followed by rapid conductive cooling into the cold substrate generates severe thermal expansion/contraction mismatch and tensile residual stresses approaching alloy yield strength.',
    engineeringImpact:
      'Can induce part distortion, substrate warping, interfacial delamination, or solidification/liquation cracking in high-γ′ superalloys (e.g., IN738, Mar-M247) and high-carbon tool steels.',
    mitigationOrLeverage:
      'Mitigation: Inductive/resistive substrate preheating (300–950 °C), fractal/bidirectional chessboard scan strategies, top-hat beam shaping, and immediate post-build stress-relief annealing.',
  },
  {
    id: 'lim-powder-catchment',
    index: '03',
    title: 'Incomplete Powder Catchment Efficiency & Ricochet Loss',
    category: 'Material Utilization',
    metricHighlight: '65 – 88',
    unit: '% Catchment',
    mechanism:
      'Because powder is pneumatically blown through an open nozzle cone, 12–35% of injected particles miss the liquid melt pool or ricochet off the solid substrate margin.',
    engineeringImpact:
      'Uncaptured powder experiences thermal radiation and partial oxidation in the plume, often precluding direct 100% recycling for flight-critical aerospace parts and increasing effective material cost.',
    mitigationOrLeverage:
      'Mitigation: High-precision annular coaxial nozzles with tight powder focus-to-beam ratio (<0.85), automated inert-chamber powder sieving, or coaxial Wire-Laser DED (100% feedstock capture).',
  },
  {
    id: 'lim-overhangs',
    index: '04',
    title: 'Overhang Angle Constraints & Absence of Powder-Bed Support',
    category: 'Topological Freedom',
    metricHighlight: '30 – 45',
    unit: '° Max Overhang',
    mechanism:
      'With no surrounding powder bed to support molten metal against gravity, overhanging tracks sag or drip if the inclination angle exceeds ~35–45° from vertical in 3-axis mode.',
    engineeringImpact:
      'Precludes fine internal stochastic lattice structures, complex unsupported bridges, and sub-millimeter internalgyroid heat exchangers that are routine in L-PBF.',
    mitigationOrLeverage:
      'Mitigation: Utilize synchronized 5-axis trunnion tables or 6-axis robotic manipulators with discrete multi-jet nozzles to continuously reorient the substrate so gravity remains normal to the melt pool.',
  },
  {
    id: 'lim-porosity-anisotropy',
    index: '05',
    title: 'Gas Entrapment Porosity, Lack-of-Fusion & Z-Axis Anisotropy',
    category: 'Metallurgical Defects',
    metricHighlight: '0.1 – 0.8',
    unit: '% Void Risk',
    mechanism:
      'Spherical gas-atomized powders can contain internal Argon gas pores (10–40 μm) that become trapped during rapid solidification; improper hatch overlap (typically 35–50%) causes inter-track lack-of-fusion voids.',
    engineeringImpact:
      'Combined with epitaxial columnar grains growing parallel to the build direction (Z-axis), pores act as fatigue crack initiation sites and create 10–20% directional anisotropy in elongation and high-cycle fatigue.',
    mitigationOrLeverage:
      'Mitigation: Use low-porosity PREP powders for rotating engine parts, optimize Specific Energy (Es), and apply post-build Hot Isostatic Pressing (HIP) + solution/aging heat treatment.',
  },
  {
    id: 'lim-cam-qualification',
    index: '06',
    title: 'Multi-Axis CAM Path Complexity & Certification Bottlenecks',
    category: 'Industrial Deployment',
    metricHighlight: '$0.6M – $2.5M',
    unit: 'System CapEx',
    mechanism:
      'Unlike planar 2.5D slicing used in powder-bed printers, 5-axis DMD requires collision-free non-planar toolpath generation where robot kinematic accelerations alter effective laser travel speed and bead height.',
    engineeringImpact:
      'High capital investment for hybrid CNC cells, combined with stringent aerospace NADCAP/FAA part-by-part non-destructive testing (X-ray CT, phased-array ultrasonic), slows rapid factory-floor scaling.',
    mitigationOrLeverage:
      'Mitigation: Physics-coupled CAM suites (Siemens NX, HyperMill, AdaOne) with kinematic feed-rate synchronization and in-situ coaxial OCT qualification logs.',
  },
];

export interface ProcessComparisonRow {
  metric: string;
  unit: string;
  dmdPowder: string;
  lpbf: string;
  waamWireArc: string;
  ebDed: string;
  cncSubtractive: string;
  dmdAdvantageNote: string;
}

export const PROCESS_BENCHMARK_TABLE: ProcessComparisonRow[] = [
  {
    metric: 'Deposition / Removal Rate',
    unit: 'kg/h',
    dmdPowder: '0.5 – 5.0 (up to 10)',
    lpbf: '0.05 – 0.25',
    waamWireArc: '3.0 – 10.0',
    ebDed: '3.0 – 12.0',
    cncSubtractive: '5.0 – 45.0 (Removal)',
    dmdAdvantageNote: 'Balances 15× higher build speed than L-PBF with 5× finer resolution than WAAM.',
  },
  {
    metric: 'Surface Roughness (As-Built)',
    unit: 'μm Ra',
    dmdPowder: '15 – 45 (EHLA: 6–12)',
    lpbf: '6 – 15',
    waamWireArc: '120 – 350',
    ebDed: '80 – 250',
    cncSubtractive: '0.4 – 1.6',
    dmdAdvantageNote: 'Requires only 0.5–1.0 mm finish milling allowance; native hybrid CNC integration.',
  },
  {
    metric: 'Minimum Wall / Feature Size',
    unit: 'mm',
    dmdPowder: '0.6 – 1.2',
    lpbf: '0.15 – 0.30',
    waamWireArc: '3.5 – 8.0',
    ebDed: '2.5 – 6.0',
    cncSubtractive: '0.2 – 0.5',
    dmdAdvantageNote: 'Capable of thin turbine blade tips and seal knife-edges where WAAM/EB-DED are too coarse.',
  },
  {
    metric: 'Heat-Affected Zone (HAZ)',
    unit: 'mm',
    dmdPowder: '0.10 – 0.45',
    lpbf: '0.02 – 0.08',
    waamWireArc: '2.50 – 6.00',
    ebDed: '1.20 – 3.50',
    cncSubtractive: '0.00 (Mechanical)',
    dmdAdvantageNote: 'Low thermal distortion enables repair of heat-treated and single-crystal components.',
  },
  {
    metric: 'Substrate Dilution Ratio',
    unit: '%',
    dmdPowder: '2.0 – 8.0 (EHLA < 2%)',
    lpbf: 'N/A (Powder Bed)',
    waamWireArc: '15.0 – 35.0',
    ebDed: '10.0 – 25.0',
    cncSubtractive: 'N/A',
    dmdAdvantageNote: 'Achieves full chemical purity of clad alloys in 1 layer vs. 3 layers in arc welding.',
  },
  {
    metric: 'Max Build Envelope',
    unit: 'm³',
    dmdPowder: '2.0 × 2.0 × 3.0+',
    lpbf: '0.4 × 0.4 × 0.4',
    waamWireArc: '5.0 × 3.0 × 3.0+',
    ebDed: '1.5 × 1.0 × 1.0 (Vacuum)',
    cncSubtractive: '3.0 × 2.0 × 2.0+',
    dmdAdvantageNote: 'Not restricted by a powder bed or high-vacuum electron chamber.',
  },
  {
    metric: 'Multi-Material / FGM Capability',
    unit: 'Rating',
    dmdPowder: 'Continuous 3D Grading',
    lpbf: 'Single Alloy Only',
    waamWireArc: 'Discrete Dual-Wire',
    ebDed: 'Discrete Dual-Wire',
    cncSubtractive: 'Monolithic Billet Only',
    dmdAdvantageNote: 'Only process capable of continuous compositional blending + ceramic MMC injection.',
  },
  {
    metric: '3D Part Repair on Curved Surfaces',
    unit: 'Capability',
    dmdPowder: 'Full 5-Axis Freeform',
    lpbf: 'Flat Planar Only',
    waamWireArc: 'Coarse Heavy Parts',
    ebDed: 'Vacuum-Limited',
    cncSubtractive: 'Removal Only',
    dmdAdvantageNote: 'Industry gold standard for high-precision aerospace & tooling refurbishment.',
  },
];

export interface RadarProcessProfile {
  id: string;
  name: string;
  shortName: string;
  color: string;
  scores: {
    depositionRate: number; // 0-100
    dimensionalPrecision: number; // 0-100
    multiMaterialFgm: number; // 0-100
    repairCapability: number; // 0-100
    buildEnvelopeScale: number; // 0-100
    lowThermalDistortion: number; // 0-100
  };
}

export const RADAR_PROFILES: RadarProcessProfile[] = [
  {
    id: 'dmd',
    name: 'Direct Metal Deposition (DMD / Powder L-DED)',
    shortName: 'DMD (L-DED)',
    color: '#2563EB',
    scores: {
      depositionRate: 76,
      dimensionalPrecision: 74,
      multiMaterialFgm: 98,
      repairCapability: 98,
      buildEnvelopeScale: 88,
      lowThermalDistortion: 86,
    },
  },
  {
    id: 'lpbf',
    name: 'Laser Powder Bed Fusion (L-PBF / SLM)',
    shortName: 'L-PBF (SLM)',
    color: '#0D9488',
    scores: {
      depositionRate: 28,
      dimensionalPrecision: 96,
      multiMaterialFgm: 18,
      repairCapability: 22,
      buildEnvelopeScale: 32,
      lowThermalDistortion: 78,
    },
  },
  {
    id: 'waam',
    name: 'Wire-Arc Directed Energy Deposition (WAAM)',
    shortName: 'WAAM (Arc-DED)',
    color: '#D97706',
    scores: {
      depositionRate: 95,
      dimensionalPrecision: 34,
      multiMaterialFgm: 48,
      repairCapability: 62,
      buildEnvelopeScale: 96,
      lowThermalDistortion: 35,
    },
  },
];

export interface FutureOutlookVector {
  id: string;
  horizon: string;
  trlLevel: string;
  title: string;
  subtitle: string;
  adoptionImpactMetric: string;
  unit: string;
  technicalBreakthrough: string;
  industrialIntegrationPath: string;
  keyMilestones: string[];
}

export const FUTURE_OUTLOOK_VECTORS: FutureOutlookVector[] = [
  {
    id: 'ehla-high-speed',
    horizon: '2026 – 2028 (Immediate Industrial Rollout)',
    trlLevel: 'TRL 8 – 9',
    title: 'Extreme High-Speed Laser Material Deposition (EHLA & 3D-EHLA)',
    subtitle: 'In-Flight Particle Melting for Ultra-Thin Coatings & High-Rate Additive Builds',
    adoptionImpactMetric: '50 – 200',
    unit: 'm/min Traverse',
    technicalBreakthrough:
      'Invented at Fraunhofer ILT, EHLA shifts the powder nozzle convergence point slightly above the substrate surface so 80–90% of powder heating and melting occurs in-flight within the laser beam before droplets touch a microscopic (10–50 μm) molten substrate film.',
    industrialIntegrationPath:
      'Directly replaces environmentally hazardous hexavalent hard-chrome plating on offshore hydraulic cylinders, automotive brake discs (Euro 7 emission compliance), and landing gear struts. 3D-EHLA using high-dynamic tripod/parallel kinematics extends this speed to volumetric additive manufacturing of aluminum and titanium alloys.',
    keyMilestones: [
      'As-clad surface roughness reduced to Ra 4–10 μm (3× smoother than conventional DMD)',
      'Heat-affected zone shrunk to <10–30 μm, enabling cladding on heat-sensitive aluminum and cast iron brake rotors',
      'Serial production lines deployed in European automotive OEM brake disc coating plants',
    ],
  },
  {
    id: 'hybrid-turnkey-cells',
    horizon: '2026 – 2030 (Factory Floor Standard)',
    trlLevel: 'TRL 8 – 9',
    title: 'Turnkey 5-Axis Hybrid Additive-Subtractive CNC Machining Centers',
    subtitle: 'Single-Setup "Done-in-One" Manufacturing with Integrated Metrology',
    adoptionImpactMetric: '-45 %',
    unit: 'Floor-to-Floor Time',
    technicalBreakthrough:
      'Industrial machine tool builders (DMG MORI LASERTEC, Mazak INTEGREX AM, Okuma, Mitsui Seiki) now package coaxial DMD heads on standard HSK tool-changer carousels inside hermetically sealed 5-axis milling/turning centers controlled by a unified CNC kernel (Siemens Sinumerik ONE / Fanuc).',
    industrialIntegrationPath:
      'Eliminates part transfer errors between welding booths and machine shops. A single program executes base forging probing, bimetallic DMD buildup, intermediate stress-relief laser scanning, high-speed 5-axis finish milling, and final on-machine touch/laser inspection.',
    keyMilestones: [
      'Automated switching from 3 kW coaxial DMD deposition to 20,000 RPM finish milling in <8 seconds',
      'Unified digital twin collision avoidance and thermal expansion compensation across additive and subtractive cycles',
      'Standardized STEP-NC (ISO 14649) toolpaths unifying laser power, powder mass flow, and spindle feed rates',
    ],
  },
  {
    id: 'multi-sensor-oct',
    horizon: '2027 – 2031 (Certification Paradigm Shift)',
    trlLevel: 'TRL 6 – 8',
    title: 'Coaxial Optical Coherence Tomography (OCT) & "Born-Qualified" Digital Twins',
    subtitle: 'In-Situ Layer-by-Layer Defect Detection Replacing Post-Build X-Ray CT',
    adoptionImpactMetric: '100 %',
    unit: 'In-Line Inspection',
    technicalBreakthrough:
      'Next-generation DMD optics multiplex the high-power processing beam with a low-coherence interferometric OCT measurement beam, dual-color thermal imaging, and acoustic emission / laser-induced breakdown spectroscopy (LIBS) plasma monitors.',
    industrialIntegrationPath:
      'OCT measures melt pool depth, keyhole stability, and solidified track profile with ±5 μm axial resolution in real time. If a lack-of-fusion void or oxide inclusion is detected on Layer N, the CNC controller automatically executes an in-situ laser remelting or local milling-and-recladding repair pass before proceeding to Layer N+1.',
    keyMilestones: [
      'Voxel-by-voxel 3D thermal & compositional pedigree log saved directly to the part serial number',
      '70% reduction in destructive witness-coupon testing and post-build radiographic CT bottlenecks for FAA/EASA parts',
      'Real-time elemental composition verification via coaxial LIBS spectral emission during FGM transitions',
    ],
  },
  {
    id: 'blue-green-beam-shaping',
    horizon: '2027 – 2032 (Photonic Hardware Evolution)',
    trlLevel: 'TRL 7 – 8',
    title: 'Kilowatt Blue/Green Lasers & Programmable Coherent Beam Shaping',
    subtitle: 'Dynamic Spatial Phase Modulation & High-Absorptivity Wavelengths',
    adoptionImpactMetric: '8 – 12 ×',
    unit: 'Cu Absorptivity Gain',
    technicalBreakthrough:
      'High-power blue (450 nm, 1.5–4.0 kW) and green (515 nm, 2.0–3.0 kW) laser sources overcome the infrared reflectivity barrier of copper, silver, gold, and aluminum. Simultaneously, Optical Phased Arrays (OPA) and Liquid-Crystal-on-Silicon (LCoS) Spatial Light Modulators shape the beam profile at >1 kHz.',
    industrialIntegrationPath:
      'Enables spatter-free, 99.9% dense DMD of pure oxygen-free high-conductivity (OFHC) copper for electric vehicle stator windings, fusion reactor divertors, and hypersonic leading edges—while dynamic beam shaping switches from a narrow Gaussian penetrometer to a wide rectangular flat-top cladding profile in microseconds.',
    keyMilestones: [
      'Dynamic ring-plus-core beam profiles eliminating Marangoni centerline humping at high scan speeds',
      'Hybrid dual-wavelength heads combining 450 nm blue and 1070 nm IR beams in a single coaxial nozzle',
      'Tailored cooling rate control to steer grain orientation (columnar vs. equiaxed) on demand',
    ],
  },
  {
    id: 'autonomous-scan-to-clad',
    horizon: '2028 – 2035 (Circular Industrial Ecosystem)',
    trlLevel: 'TRL 7 – 9',
    title: 'Autonomous "Scan-to-Clad" Robotic Remanufacturing Cells',
    subtitle: 'Zero-Programming Defect Recognition & Closed-Loop Circular Supply Chains',
    adoptionImpactMetric: '60 – 80',
    unit: '% Carbon Reduction',
    technicalBreakthrough:
      'Integrates structured-light 3D metrology, automated defect segmentation (comparing worn geometry against nominal CAD or statistical surface reconstructions), and automated non-planar toolpath synthesis inside containerized or factory-integrated robotic cells.',
    industrialIntegrationPath:
      'A worn mining crusher cone, railway frog switch, or aero-engine casing is loaded into the cell; the system scans the wear crater, generates the pre-machining excavation path, deposits a functionally graded wear overlay via DMD, finish-machines the contour, and prints a certification report with zero manual CAM programming.',
    keyMilestones: [
      'Containerized forward-deployed DMD repair units for naval vessels and remote energy/mining sites',
      'Closed-loop powder reconditioning and coaxial Wire-Powder hybrid DED for 98%+ feedstock efficiency',
      'Mandatory circular-economy remanufacturing credits integrated into European and North American heavy industry standards',
    ],
  },
];
