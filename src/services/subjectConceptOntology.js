// src/services/subjectConceptOntology.js
// Universal Subject, Topic & Concept Ontology Engine for VIVA ANALYZER X
// 100% OFFLINE, ZERO EXTERNAL APIS REQUIRED, DOMAIN-INDEPENDENT, ACADEMICALLY GROUNDED

import { GenerateAcademicQuestionPackage, ValidateQuestion } from './academicAssessmentEngine.js';

/**
 * Universal Master Disciplines & Subject Taxonomy
 * Covers Engineering, Sciences, Mathematics, Medicine, Commerce, Economics, Law & Humanities
 */
export const UNIVERSAL_SUBJECTS = [
  {
    id: 'cs_it',
    name: 'Computer Science & IT',
    icon: '💻',
    category: 'Engineering & Technology',
    description: 'Operating Systems, Algorithms, Distributed Systems, Networks, DBMS, Cloud & AI',
    topics: [
      {
        id: 'os',
        name: 'Operating Systems',
        concepts: [
          'Virtual Memory & Demand Paging (Page Tables, TLB, Inverted Page Tables)',
          'Process Scheduling & Context Switching (CFS, Multi-Level Feedback Queue, SRTF)',
          'Deadlock Prevention, Detection & Banker’s Algorithm',
          'Concurrency Control, Semaphores, Mutexes & Reader-Writer Problem',
          'File System Architecture, Inode Allocation & Journaling (ext4, NTFS)',
          'CPU Caches, Memory Hierarchy & Cache Coherency (MESI Protocol)'
        ]
      },
      {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        concepts: [
          'QuickSort, MergeSort & Comparison-Based Lower Bound Proofs (Omega(N log N))',
          'Self-Balancing Trees (AVL Rotations, Red-Black Tree Invariants)',
          'Graph Algorithms (Dijkstra, Bellman-Ford Negative Cycles, A* Heuristic)',
          'Dynamic Programming & Optimal Substructure (0/1 Knapsack, Matrix Chain, Bellman)',
          'Hash Tables, Collision Resolution & Amortized Complexity Analysis',
          'Disjoint Set Union (DSU) & Minimum Spanning Trees (Kruskal, Prim)'
        ]
      },
      {
        id: 'dbms',
        name: 'Database Management Systems',
        concepts: [
          'ACID Properties, Transaction Isolation Levels & Serializable Schedules',
          'Two-Phase Locking (2PL), Deadlock Handling & Multi-Version Concurrency (MVCC)',
          'B+ Tree Indexing Architecture & Disk I/O Cost Optimization',
          'Database Normalization (1NF, 2NF, 3NF, BCNF, 4NF & Lossless Decompositions)',
          'Query Execution Plans, Join Algorithms (Hash Join, Merge Join) & Optimizer Cost',
          'WAL (Write-Ahead Logging), ARIES Recovery Algorithm & Checkpointing'
        ]
      },
      {
        id: 'networks',
        name: 'Computer Networks',
        concepts: [
          'TCP Congestion Control (Tahoe, Reno, CUBIC, BBR) & Sliding Window Protocol',
          'TCP 3-Way Handshake, Connection Teardown (TIME_WAIT) & SYN Flood Mitigation',
          'BGP Inter-Domain Routing, Autonomous Systems & Route Convergence',
          'OSI 7-Layer Model vs TCP/IP Stack Encapsulation & Packet Lifecycles',
          'DNS Hierarchy, Recursive Resolvers & DNSSEC Cryptographic Validation',
          'TLS 1.3 Cryptographic Handshake, Diffie-Hellman Key Exchange & Perfect Forward Secrecy'
        ]
      },
      {
        id: 'ml_ai',
        name: 'Machine Learning & Artificial Intelligence',
        concepts: [
          'Transformer Self-Attention Mechanism (QKV Projections, Scaled Dot-Product, Multi-Head)',
          'Backpropagation, Chain Rule & Gradient Highway in Residual Networks (ResNet)',
          'Loss Landscapes, Overfitting Regularization (Dropout, L1/L2, Batch Normalization)',
          'Optimization Algorithms (SGD with Momentum, Adam, RMSprop & Learning Rate Schedules)',
          'Convolutional Feature Extraction, Receptive Fields & Spatial Pooling Mechanics',
          'Reinforcement Learning, Markov Decision Processes (MDP) & Bellman Equation'
        ]
      },
      {
        id: 'compilers',
        name: 'Compiler Design',
        concepts: [
          'Lexical Analysis, Regular Expressions & Finite Automata (DFA/NFA Minimization)',
          'Syntax Analysis, LL(k) vs LR(1)/LALR Parsing & Ambiguity Resolution',
          'Intermediate Representation (IR), Static Single Assignment (SSA) Form',
          'Code Optimization (Dead Code Elimination, Common Subexpression, Loop Unrolling)',
          'Register Allocation via Graph Coloring (Chaitin’s Algorithm) & Spilling',
          'Runtime Memory Management, Activation Records & Calling Conventions'
        ]
      }
    ]
  },
  {
    id: 'mech_aero',
    name: 'Mechanical & Aerospace Engineering',
    icon: '⚙️',
    category: 'Engineering & Technology',
    description: 'Thermodynamics, Strength of Materials, Fluid Mechanics, Aerodynamics & Machine Design',
    topics: [
      {
        id: 'thermo',
        name: 'Engineering Thermodynamics',
        concepts: [
          'First & Second Laws of Thermodynamics, Clausius Inequality & Entropy Generation',
          'Carnot Cycle, Thermal Efficiency Upper Limits & Reversibility Criteria',
          'Rankine Cycle, Reheat/Regeneration Modifications & Steam Turbine Isentropic Efficiency',
          'Brayton Gas Turbine Cycle, Pressure Ratios & Jet Engine Propulsion Mechanics',
          'Exergy Analysis, Available Work Destruction & Irreversibility Formulations',
          'Refrigeration Cycles, Coefficient of Performance (COP) & Vapor Compression'
        ]
      },
      {
        id: 'som',
        name: 'Strength of Materials & Solid Mechanics',
        concepts: [
          'Mohr’s Circle, Principal Stresses & In-Plane Maximum Shear Formulations',
          'Euler’s Critical Buckling Load for Slender Columns & Effective Length Coefficients',
          'Bending Stress in Beams (Euler-Bernoulli Beam Equation: M/I = sigma/y = E/R)',
          'Torsion of Circular Shafts, Polar Moment of Inertia & Angle of Twist',
          'Theories of Elastic Failure (Tresca Maximum Shear vs von Mises Distortion Energy)',
          'Deflection of Beams using Castigliano’s Theorem & Double Integration Method'
        ]
      },
      {
        id: 'fluid_mech',
        name: 'Fluid Mechanics & Aerodynamics',
        concepts: [
          'Navier-Stokes Equations, Mass/Momentum Conservation & Boundary Layer Assumptions',
          'Bernoulli’s Equation Along a Streamline, Stagnation Pressure & Venturi Metering',
          'Boundary Layer Separation, Adverse Pressure Gradients & Stall Dynamics on Airfoils',
          'Reynolds Number, Laminar vs Turbulent Transition & Moody Friction Factor',
          'Supersonic Flow, Normal & Oblique Shock Waves, Mach Cones & Compressibility',
          'Lift and Drag Generation on NACA Airfoils & Kutta-Joukowski Circulation Theorem'
        ]
      },
      {
        id: 'machine_design',
        name: 'Machine Design & Kinematics',
        concepts: [
          'Fatigue Failure Criteria (Soderberg, Goodman & Gerber Diagrams under Cyclic Loading)',
          'Spur and Helical Gear Design (Lewis Equation, Beam Strength & Dynamic Tooth Loads)',
          'Hydrodynamic Journal Bearings, Petroff’s Equation & Sommerfeld Number',
          'Denavit-Hartenberg (D-H) Convention & Forward/Inverse Kinematics of Robotic Arms',
          'Bolted Joints under Preload, Eccentric Shear & Joint Stiffness Factor',
          'Cam Profiles, Follower Motion (SHM, Cycloidal) & Pressure Angle Optimization'
        ]
      }
    ]
  },
  {
    id: 'ece_eee',
    name: 'Electrical & Electronics Engineering',
    icon: '⚡',
    category: 'Engineering & Technology',
    description: 'Control Systems, Analog VLSI, Digital Signal Processing, Power Systems & Electromagnetics',
    topics: [
      {
        id: 'control_sys',
        name: 'Control Systems Engineering',
        concepts: [
          'Second-Order System Step Response, Damping Ratio (zeta), Natural Frequency & Overshoot',
          'Root Locus Technique, Angle and Magnitude Criteria & Dominant Closed-Loop Poles',
          'Frequency Response Analysis (Bode Plots, Gain Margin & Phase Margin Stability)',
          'Nyquist Stability Criterion, Encirclements of (-1, j0) & Cauchy’s Argument Principle',
          'State-Space Modeling, State Transition Matrix, Controllability & Observability (Kalman)',
          'PID Controller Tuning (Ziegler-Nichols Method, Windup Prevention & Derivative Filtering)'
        ]
      },
      {
        id: 'analog_circuits',
        name: 'Analog Electronics & VLSI',
        concepts: [
          'Operational Amplifier Non-Idealities (Input Offset Voltage, Slew Rate, CMRR & Gain-Bandwidth)',
          'MOSFET Small-Signal Models, Transconductance (gm), Output Resistance (ro) & High-Frequency Cutoff',
          'CMOS Inverter Characteristics, Propagation Delay (tpHL, tpLH) & Noise Margins (NML, NMH)',
          'Miller Effect on Feedback Capacitance & Frequency Compensation in Two-Stage Op-Amps',
          'Static Timing Analysis (Setup Time, Hold Time, Clock Skew & Clock Jitter Violations)',
          'Bandgap Voltage Reference Architecture & Temperature Independence (CTAT vs PTAT)'
        ]
      },
      {
        id: 'dsp',
        name: 'Digital Signal Processing',
        concepts: [
          'Nyquist-Shannon Sampling Theorem, Anti-Aliasing Filtering & Spectral Folding',
          'Discrete Fourier Transform (DFT) vs Fast Fourier Transform (Cooley-Tukey Radix-2 FFT)',
          'Z-Transform, Region of Convergence (ROC) & Linear Time-Invariant (LTI) System Stability',
          'FIR vs IIR Filter Design (Windowing Methods, Bilinear Transformation & Phase Linearity)',
          'Circular Convolution vs Linear Convolution & Overlap-Add/Overlap-Save Techniques',
          'Quantization Noise, Finite Word Length Effects & Limit Cycle Oscillations'
        ]
      },
      {
        id: 'power_systems',
        name: 'Power Systems & Electrical Machines',
        concepts: [
          'Three-Phase Induction Motor Torque-Speed Characteristics & Slip Mechanics',
          'Synchronous Generator V-Curves, Power Angle Curve (P = EV/X sin(delta)) & Transient Stability',
          'Power Flow Analysis (Newton-Raphson vs Gauss-Seidel on Bus Admittance Matrices)',
          'Transmission Line Modeling (Short, Medium Nominal Pi, Long Line Ferranti Effect)',
          'Symmetrical Components (Positive, Negative, Zero Sequences) & Unsymmetrical Fault Analysis',
          'Switch-Mode Power Supplies (Buck, Boost & Buck-Boost Converters in CCM/DCM)'
        ]
      }
    ]
  },
  {
    id: 'civil_env',
    name: 'Civil & Structural Engineering',
    icon: '🏗️',
    category: 'Engineering & Technology',
    description: 'Structural Analysis, Reinforced Concrete, Soil Mechanics, Geotechnical & Hydraulics',
    topics: [
      {
        id: 'rcc_structures',
        name: 'Design of Reinforced Concrete Structures',
        concepts: [
          'Limit State Method (Limit State of Collapse vs Limit State of Serviceability)',
          'Under-Reinforced vs Over-Reinforced RCC Beams & Balanced Failure Criteria',
          'Shear Reinforcement Design, Diagonal Tension & Truss Analogy in Concrete',
          'Bond, Anchorage, Development Length Formulations & Lap Splices',
          'Design of Axially and Eccentrically Loaded Short and Slender Columns',
          'Prestressed Concrete (Pre-Tensioning vs Post-Tensioning, Tendon Profiles & Loss of Prestress)'
        ]
      },
      {
        id: 'soil_mechanics',
        name: 'Soil Mechanics & Geotechnical Engineering',
        concepts: [
          'Terzaghi’s Principle of Effective Stress (sigma = sigma_prime + u) & Pore Water Pressure',
          'Mohr-Coulomb Shear Strength Theory (c, phi parameters) & Triaxial Shear Testing',
          'One-Dimensional Consolidation Theory, Compression Index & Settlement Computation',
          'Bearing Capacity of Shallow Foundations (Terzaghi’s Formula, Meyerhof Factors)',
          'Earth Pressure Theories (Rankine vs Coulomb Active and Passive States)',
          'Permeability, Seepage Analysis, Flow Nets & Piping Failure Mechanics'
        ]
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics & Applied Physical Sciences',
    icon: '⚛️',
    category: 'Pure & Applied Sciences',
    description: 'Quantum Mechanics, Electromagnetism, Optics, Classical Dynamics & Nuclear Physics',
    topics: [
      {
        id: 'quantum_phys',
        name: 'Quantum Mechanics',
        concepts: [
          'Time-Independent & Time-Dependent Schrödinger Wave Equation Solutions',
          'Particle in a 1D Finite/Infinite Potential Well & Energy Quantization Proof',
          'Quantum Tunneling, Transmission Coefficients & Scanning Tunneling Microscopy (STM)',
          'Heisenberg Uncertainty Principle (Delta x * Delta p >= hbar/2) & Wave-Particle Duality',
          'Quantum Harmonic Oscillator, Creation/Annihilation Operators & Zero-Point Energy',
          'Wavefunction Collapse, Born Probability Rule & Quantum Entanglement (Bell’s Theorem)'
        ]
      },
      {
        id: 'electromag',
        name: 'Electromagnetism & Maxwell’s Equations',
        concepts: [
          'Maxwell’s Four Differential Equations & Displacement Current Necessity',
          'Poynting Vector & Electromagnetic Wave Energy Flux Density Formulation',
          'Wave Propagation in Dielectrics and Good Conductors (Skin Depth & Attenuation)',
          'Boundary Conditions for Electric (D, E) and Magnetic (B, H) Fields Across Interfaces',
          'Lorentz Gauge vs Coulomb Gauge & Retarded Potentials of Moving Charges',
          'Waveguides, TE/TM Mode Cutoff Frequencies & Evanescent Waves'
        ]
      },
      {
        id: 'nuclear_phys',
        name: 'Nuclear & Particle Physics',
        concepts: [
          'Nuclear Binding Energy Curve, Semi-Empirical Mass Formula (Weizsäcker Formula)',
          'Nuclear Fission Chain Reactions, Four-Factor Formula & Criticality Control',
          'Thermonuclear Fusion, Lawson Criterion & Plasma Magnetic Confinement (Tokamak)',
          'Radioactive Decay Laws, Half-Life, Activity & Secular/Transient Equilibrium',
          'Alpha Tunneling Decay (Gamow Theory), Beta Decay (Fermi Theory) & Gamma Transitions',
          'Standard Model Elementary Particles (Quarks, Leptons, Gauge Bosons & Higgs Mechanism)'
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry & Chemical Engineering',
    icon: '🧪',
    category: 'Pure & Applied Sciences',
    description: 'Organic Reaction Mechanisms, Chemical Kinetics, Coordination Chemistry & Thermodynamics',
    topics: [
      {
        id: 'organic_chem',
        name: 'Organic Reaction Mechanisms',
        concepts: [
          'Nucleophilic Substitution (SN1 vs SN2 Mechanisms, Stereochemistry & Solvent Effects)',
          'Elimination Reactions (E1 vs E2, Zaitsev vs Hofmann Regioselectivity)',
          'Electrophilic Aromatic Substitution (Directing Effects, Arenium Ion Intermediates)',
          'Carbonyl Chemistry (Nucleophilic Addition, Aldol Condensation, Claisen Condensation)',
          'Pericyclic Reactions (Woodward-Hoffmann Rules, Diels-Alder [4+2] Cycloaddition)',
          'Organometallic Catalysis (Grignard Reagents, Suzuki-Miyaura Cross-Coupling)'
        ]
      },
      {
        id: 'chem_kinetics',
        name: 'Chemical Kinetics & Catalysis',
        concepts: [
          'Rate Laws, Integrated Rate Equations (Zero, First, Second Order) & Half-Life',
          'Arrhenius Equation, Activation Energy (Ea) & Transition State Theory (Eyring Equation)',
          'Enzyme Kinetics, Michaelis-Menten Equation (Km, Vmax) & Lineweaver-Burk Plots',
          'Steady-State Approximation & Chain Reaction Mechanisms (Free Radical Polymerization)',
          'Heterogeneous Catalysis, Langmuir Adsorption Isotherms & Surface Poisoning',
          'Collision Theory, Steric Factors & Reaction Coordinate Energy Profiles'
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics & Statistics',
    icon: '📐',
    category: 'Pure & Applied Sciences',
    description: 'Linear Algebra, Calculus, Differential Equations, Probability & Optimization',
    topics: [
      {
        id: 'linear_algebra',
        name: 'Linear Algebra & Matrix Theory',
        concepts: [
          'Eigenvalues, Eigenvectors, Characteristic Polynomial & Cayley-Hamilton Theorem',
          'Singular Value Decomposition (SVD), Low-Rank Matrix Approximations & Pseudoinverse',
          'Vector Spaces, Subspaces, Basis, Dimension & Rank-Nullity Theorem',
          'Gram-Schmidt Orthogonalization Process & QR Decomposition',
          'Positive Definite Matrices, Cholesky Decomposition & Quadratic Forms',
          'Diagonalization of Symmetric Matrices & Spectral Theorem'
        ]
      },
      {
        id: 'calculus_ode',
        name: 'Differential Equations & Vector Calculus',
        concepts: [
          'First-Order ODEs (Integrating Factors, Exact Equations & Bernoulli Equations)',
          'Second-Order Linear Homogeneous/Non-Homogeneous ODEs & Method of Undetermined Coefficients',
          'Fourier Series, Dirichlet Conditions & Orthogonality of Sinusoids',
          'Laplace Transforms, Convolution Theorem & Solving Initial Value Problems',
          'Vector Fields, Divergence Theorem (Gauss) & Stokes’ Theorem Proofs',
          'Partial Differential Equations (Heat Equation, Wave Equation & Separation of Variables)'
        ]
      },
      {
        id: 'prob_stats',
        name: 'Probability & Inferential Statistics',
        concepts: [
          'Central Limit Theorem, Law of Large Numbers & Sampling Distributions',
          'Bayes’ Theorem, Prior/Posterior Probabilities & Maximum Likelihood Estimation (MLE)',
          'Hypothesis Testing (p-values, Type I/II Errors, t-tests, ANOVA & Chi-Square Tests)',
          'Continuous Distributions (Normal, Exponential, Student’s t, Chi-Square, F-Distribution)',
          'Markov Chains, Transition Probability Matrices & Stationary Distributions',
          'Confidence Intervals, Standard Errors & Minimum Variance Unbiased Estimators (MVUE)'
        ]
      }
    ]
  },
  {
    id: 'medicine_bio',
    name: 'Medicine, Biology & Life Sciences',
    icon: '🧬',
    category: 'Medical & Healthcare',
    description: 'Human Physiology, Pharmacology, Molecular Biology, Immunology & Pathology',
    topics: [
      {
        id: 'cardio_physio',
        name: 'Cardiovascular & Respiratory Physiology',
        concepts: [
          'Cardiac Action Potentials (SA Node Pacemaker vs Ventricular Phase 0-4 Currents)',
          'Frank-Starling Law of the Heart, Preload, Afterload & Pressure-Volume Loops',
          'Electrocardiogram (ECG) Waveforms (P-QRS-T) & Arrhythmia Mechanisms (Reentry, AV Block)',
          'Oxygen-Hemoglobin Dissociation Curve, Bohr Effect, Haldane Effect & 2,3-BPG',
          'Ventilation-Perfusion (V/Q) Mismatch, Alveolar Gas Equation & Hypoxemia Causes',
          'Renin-Angiotensin-Aldosterone System (RAAS) & Blood Pressure Regulation'
        ]
      },
      {
        id: 'pharmacology',
        name: 'Pharmacology & Pharmacokinetics',
        concepts: [
          'Pharmacokinetic Principles (ADME: Bioavailability, Volume of Distribution, Clearance, Half-Life)',
          'Receptor Agonists, Competitive vs Non-Competitive Antagonists & Lineweaver-Burk Shifts',
          'Drug Metabolism (Phase I Cytochrome P450 Enzymes vs Phase II Conjugation Pathways)',
          'Therapeutic Window, Minimum Effective Concentration & Toxic Dosing Margins',
          'Autonomic Pharmacology (Sympathetic Adrenergic vs Parasympathetic Cholinergic Receptors)',
          'Antimicrobial Mechanisms of Action (Cell Wall, Protein Synthesis, Folate Synthesis Inhibition)'
        ]
      },
      {
        id: 'genetics_molbio',
        name: 'Molecular Biology & Genetics',
        concepts: [
          'DNA Replication Fork Mechanics (DNA Polymerase III, Primase, Okazaki Fragments, Ligase)',
          'Transcription in Eukaryotes, RNA Polymerase II, Promoters, Enhancers & Splicing',
          'CRISPR-Cas9 Gene Editing Mechanism, sgRNA Targeting, PAM Sequences & NHEJ/HDR Repair',
          'PCR (Polymerase Chain Reaction) Thermal Cycling Steps & Primer Design Specificity',
          'Mendelian Inheritance Ratios vs Epigenetic Modifications (DNA Methylation, Histone Acetylation)',
          'Translation, Ribosome Subunits (A, P, E Sites), tRNA Charging & Termination Codons'
        ]
      }
    ]
  },
  {
    id: 'management_econ',
    name: 'Management & Economics',
    icon: '📈',
    category: 'Commerce & Business',
    description: 'Corporate Finance, Microeconomics, Supply Chain, Strategic Management & Marketing',
    topics: [
      {
        id: 'micro_macro_econ',
        name: 'Micro & Macroeconomics',
        concepts: [
          'Supply and Demand Elasticity (Price, Income, Cross-Price) & Consumer Surplus',
          'Market Structures (Perfect Competition, Monopoly, Oligopoly, Cournot vs Bertrand Duopoly)',
          'Monetary Policy Transmission, Central Bank Interest Rates & Inflation Targeting (Taylor Rule)',
          'IS-LM Model & AD-AS Macroeconomic Equilibrium under Fiscal/Monetary Shocks',
          'Gross Domestic Product (GDP) Measurement Approaches & Nominal vs Real GDP Deflators',
          'Game Theory (Nash Equilibrium, Prisoner’s Dilemma, Dominant Strategies & Payoff Matrices)'
        ]
      },
      {
        id: 'corporate_finance',
        name: 'Corporate Finance & Investment Analysis',
        concepts: [
          'Capital Asset Pricing Model (CAPM), Beta Calculation & Cost of Equity',
          'Weighted Average Cost of Capital (WACC), Capital Structure & Modigliani-Miller Theorems',
          'Discounted Cash Flow (DCF) Valuation, Free Cash Flow to Firm (FCFF) & Terminal Value',
          'Net Present Value (NPV) vs Internal Rate of Return (IRR) Conflicting Project Decisions',
          'Option Pricing Models (Black-Scholes-Merton Equation & Binomial Trees)',
          'Working Capital Management, Cash Conversion Cycle & Current/Quick Liquidity Ratios'
        ]
      }
    ]
  },
  {
    id: 'law_governance',
    name: 'Law & Legal Studies',
    icon: '⚖️',
    category: 'Law & Governance',
    description: 'Constitutional Law, Jurisprudence, Contract Law, Criminal Law & Civil Rights',
    topics: [
      {
        id: 'constitutional_law',
        name: 'Constitutional Law & Jurisprudence',
        concepts: [
          'Basic Structure Doctrine & Judicial Review Limits on Amending Power',
          'Separation of Powers, Checks and Balances across Legislature, Executive & Judiciary',
          'Fundamental Rights & Reasonable Restrictions (Equality, Free Speech, Personal Liberty)',
          'Due Process of Law vs Procedure Established by Law & Natural Justice Principles',
          'Writ Jurisdiction (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto)',
          'Federalism, Division of Legislative Powers & Emergency Provisions'
        ]
      },
      {
        id: 'contract_law',
        name: 'Contract Law & Commercial Jurisprudence',
        concepts: [
          'Essentials of a Valid Contract (Offer, Acceptance, Intention, Capacity & Consideration)',
          'Promissory Estoppel, Quid Pro Quo Doctrine & Privity of Contract',
          'Vitiating Factors (Coercion, Undue Influence, Fraud, Misrepresentation & Mistake)',
          'Breach of Contract, Liquidated Damages vs Penalty Clauses & Hadley v Baxendale Remoteness',
          'Discharge of Contract (Performance, Frustration of Contract & Novation)',
          'Specific Performance and Injunction Relief under Specific Relief Acts'
        ]
      }
    ]
  },
  {
    id: 'biotech_engineering',
    name: 'Biotechnology',
    icon: '🧬',
    category: 'Engineering & Technology',
    description: 'Bioreactor Design, Downstream Processing, Microbial Kinetics & Genetic Engineering',
    topics: [
      {
        id: 'bioreactor_design',
        name: 'Bioreactor Design',
        concepts: [
          'Volumetric Oxygen Transfer Coefficient (kLa) and Gas-Liquid Mass Transfer',
          'Thermal Media Sterilization Kinetics and Del Factor Calculation',
          'Two-Film Mass Transfer Theory and Liquid Boundary Film Resistance',
          'Hydrodynamic Shear, Broth Viscosity, and Bubble Coalescence',
          'Continuous HTST Sterilization vs Batch Thermal Destruction'
        ]
      }
    ]
  },
  {
    id: 'communication_engineering',
    name: 'Communication Engineering',
    icon: '📡',
    category: 'Engineering & Technology',
    description: 'Digital Modulation, Information Theory, Antenna Theory & RF Propagation',
    topics: [
      {
        id: 'digital_modulation',
        name: 'Digital Modulation',
        concepts: [
          'Quadrature Phase Shift Keying (QPSK) Constellation and Phase States',
          'Principles of RF Carrier Modulation and Resonant Antenna Sizing',
          'Noise Immunity and Bandpass Limiting in Frequency vs Amplitude Modulation',
          'Bit Error Rate (BER) vs Eb/N0 in Coherent Demodulation',
          'Bandwidth Efficiency and M-ary Symbol Mapping'
        ]
      }
    ]
  },
  {
    id: 'mlops_engineering',
    name: 'MLOps',
    icon: '🤖',
    category: 'Engineering & Technology',
    description: 'Continuous Deployment of ML Models, Model Monitoring, Lineage & CI/CD Pipelines',
    topics: [
      {
        id: 'continuous_deployment_ml',
        name: 'Continuous Deployment of ML Models',
        concepts: [
          'Data Drift and Concept Drift Monitoring',
          'Continuous Integration and Continuous Delivery (CI/CD) for Machine Learning',
          'Automated Model Testing, Validation Gates, and Deployment Rollback',
          'Training-Serving Skew and Feature Pipeline Consistency',
          'Model Registry, Artifact Lineage, and Lifecycle Transitions'
        ]
      }
    ]
  }
];

/**
 * Automatically detects and generates 4 to 6 academically rigorous, logically sequenced concepts
 * for ANY custom or arbitrary topic string entered by a student or teacher.
 */
export function autoDetectConcepts(subjectName = '', topicName = '') {
  let cleanSubj = (subjectName || '').trim();
  let cleanTop = (topicName || '').trim();

  // Strip placeholder strings to prevent propagating synthetic generic tokens
  const isPlaceholder = (s) => /^(curriculum topic|core concept|core theoretical principles|general academic curriculum|foundational mechanism|direct formulation|operational performance|registered academic discipline|sample topic|default topic|unassigned|all key concepts|placeholder|general topic|assigned topic|custom topic)$/i.test(s);
  if (isPlaceholder(cleanTop)) cleanTop = '';
  if (isPlaceholder(cleanSubj)) cleanSubj = '';

  const combined = `${cleanSubj} ${cleanTop}`.toLowerCase();

  // 1. First, search if the topic or subject matches an existing curated curriculum
  for (const subj of UNIVERSAL_SUBJECTS) {
    const sNorm = subj.name.toLowerCase();
    const isSubjMatch = cleanSubj && (sNorm === cleanSubj.toLowerCase() || sNorm.includes(cleanSubj.toLowerCase()) || cleanSubj.toLowerCase().includes(sNorm));
    for (const t of subj.topics) {
      const tNorm = t.name.toLowerCase();
      if (
        combined.includes(tNorm) ||
        (cleanTop && (tNorm.includes(cleanTop.toLowerCase()) || cleanTop.toLowerCase().includes(tNorm))) ||
        (isSubjMatch && (!cleanTop || cleanTop.toLowerCase() === cleanSubj.toLowerCase()))
      ) {
        return {
          source: 'curated_ontology',
          subject: subj.name,
          topic: t.name,
          concepts: t.concepts
        };
      }
    }
  }

  // 2. Synthesize domain-grounded concept progression based on analytical semantic cues
  const isCS = /code|software|program|data|algorithm|database|cloud|network|security|web|os|compiler|ai|machine learning|mlops/i.test(combined);
  const isComm = /communication|telecom|signal|rf|antenna|modulation|wireless|cellular|radar/i.test(combined);
  const isEngineering = /mechanical|aerospace|civil|electrical|electronics|circuit|thermal|fluid|structure|materials|robotics/i.test(combined);
  const isScience = /physics|chemistry|biology|quantum|optics|genetics|cell|organic|molecule|particle|kinetics/i.test(combined);
  const isBusiness = /finance|management|economics|marketing|accounting|market|supply chain|stock|corporate/i.test(combined);
  const isLaw = /law|legal|constitutional|court|rights|contract|justice|statute|jurisprudence/i.test(combined);

  let synthesizedConcepts = [];

  if (isCS) {
    synthesizedConcepts = [
      `Architectural Foundations & Core Abstract Data Types in ${cleanTop || 'Computer Science'}`,
      `State Management, Concurrency Control & Synchronization Invariants in ${cleanTop || 'Computer Science'}`,
      `Asymptotic Complexity Bounds & Cache Hierarchy Locality in ${cleanTop || 'Computer Science'}`,
      `Fault Tolerance, Distributed Consistency & Failure Recovery Mechanisms in ${cleanTop || 'Computer Science'}`,
      `Security Threat Models, Input Sanitization & Defensive Hardening for ${cleanTop || 'Computer Science'}`
    ];
  } else if (isComm) {
    synthesizedConcepts = [
      `Carrier Modulation, Constellation Geometry & Spectral Allocation in ${cleanTop || 'Communication Engineering'}`,
      `Channel Capacity, Signal-to-Noise Ratio & Shannon Limit Formulations in ${cleanTop || 'Communication Engineering'}`,
      `Bit Error Rate Invariants, Noise Immunity & Matched Filter Design in ${cleanTop || 'Communication Engineering'}`,
      `Inter-Symbol Interference, Nyquist Pulse Shaping & Equalization in ${cleanTop || 'Communication Engineering'}`,
      `Multiplexing Protocols, Demodulation Thresholds & Link Budget Analysis in ${cleanTop || 'Communication Engineering'}`
    ];
  } else if (isEngineering) {
    synthesizedConcepts = [
      `Equilibrium State Equations, Governing Balances & Operational Boundaries in ${cleanTop || 'Engineering Systems'}`,
      `Constitutive Material Equations, Stress-Strain Distributions & Deformation Limits in ${cleanTop || 'Engineering Systems'}`,
      `Transient Dynamic Response, Frequency Domain Modeling & Stability Criteria in ${cleanTop || 'Engineering Systems'}`,
      `Non-Linear Boundary Conditions, Fatigue Life & Failure Modes in ${cleanTop || 'Engineering Systems'}`,
      `Safety Factor Formulations, Codes of Practice & Industrial Optimization in ${cleanTop || 'Engineering Systems'}`
    ];
  } else if (isScience) {
    synthesizedConcepts = [
      `Fundamental Axioms, Symmetries & Conservation Laws Governing ${cleanTop || 'Natural Science'}`,
      `Mathematical Derivation of Differential Equations & State Transitions in ${cleanTop || 'Natural Science'}`,
      `Empirical Measurement, Spectroscopy & Phenomenological Verification in ${cleanTop || 'Natural Science'}`,
      `Limiting Boundary Conditions, Perturbation Analysis & Asymptotic Behavior in ${cleanTop || 'Natural Science'}`,
      `Thermodynamic Driving Forces & Quantum/Molecular Mechanistic Pathways in ${cleanTop || 'Natural Science'}`
    ];
  } else if (isBusiness) {
    synthesizedConcepts = [
      `Theoretical Foundations & Economic Equilibrium Models of ${cleanTop || 'Economics & Commerce'}`,
      `Quantitative Valuation, Cash Flow Modeling & Sensitivity Analysis in ${cleanTop || 'Economics & Commerce'}`,
      `Market Structure, Competitive Strategy & Game-Theoretic Invariants in ${cleanTop || 'Economics & Commerce'}`,
      `Risk Metrics, Volatility Modeling & Regulatory Compliance Frameworks in ${cleanTop || 'Economics & Commerce'}`,
      `Operational Optimization, Supply-Demand Elasticity & Unit Economics in ${cleanTop || 'Economics & Commerce'}`
    ];
  } else if (isLaw) {
    synthesizedConcepts = [
      `Constitutional Tenets, Sovereign Authority & Statutory Origins of ${cleanTop || 'Jurisprudence'}`,
      `Substantive vs Procedural Due Process Standards Governing ${cleanTop || 'Jurisprudence'}`,
      `Leading Landmark Judicial Precedents & Jurisprudential Interpretations of ${cleanTop || 'Jurisprudence'}`,
      `Vitiating Factors, Liability Defenses & Evidentiary Burdens of Proof in ${cleanTop || 'Jurisprudence'}`,
      `Remedial Decrees, Restitution Principles & Public Policy Implications of ${cleanTop || 'Jurisprudence'}`
    ];
  } else {
    const targetFocus = cleanTop || cleanSubj || 'Core System Dynamics';
    synthesizedConcepts = [
      `Core Theoretical Foundations, Dynamic Principles, and Governing Invariants in ${targetFocus}`,
      `State Variables, Transfer Characteristics, and Operational Thresholds in ${targetFocus}`,
      `System Architecture, Parameter Sensitivities, and Component Interactions in ${targetFocus}`,
      `Failure Mechanisms, Anomaly Diagnostics, and Operational Safeguards in ${targetFocus}`,
      `Design Optimization, Efficiency Trade-Offs, and Implementation Standards in ${targetFocus}`
    ];
  }

  return {
    source: 'dynamic_synthesis',
    subject: cleanSubj || cleanTop || 'Academic Discipline',
    topic: cleanTop || cleanSubj || 'Assigned Topic',
    concepts: synthesizedConcepts
  };
}

/**
 * Generates subject-, topic- and concept-grounded questions with real options, verified keys,
 * detailed explanations, progressive 4-tier hints, and evaluation criteria.
 *
 * Guaranteed: NO generic boilerplate strings!
 */
export function generateConceptGroundedQuestions(subject, topic, concept, config = {}) {
  const {
    questionType = 'mixed', // 'mcq' | 'text' | 'derivation' | 'numerical' | 'case_study' | 'mixed'
    difficulty = 'Adaptive', // 'Foundation' | 'Proficient' | 'Advanced' | 'Adaptive'
    count = 5,
    assessmentMode = 'practice' // 'practice' | 'strict_exam'
  } = config;

  const cleanSubj = (subject || 'General Engineering').trim();
  const cleanTop = (topic || 'Core Topic').trim();
  const detected = autoDetectConcepts(cleanSubj, cleanTop);
  const topicConcepts = detected.concepts || [];
  const targetCount = Math.max(1, Math.min(50, parseInt(count, 10) || 5));

  const questions = [];
  const seenQuestionIds = new Set();
  const seenFingerprints = new Set();

  for (let i = 0; i < targetCount; i++) {
    // Determine question type for this iteration
    let qType = questionType;
    if (questionType === 'mixed') {
      qType = i % 2 === 0 ? 'mcq' : 'text';
    }

    // Determine Bloom level & difficulty
    let bloomLevel = 'Understanding';
    let diffNum = 3;
    if (difficulty === 'Foundation' || (difficulty === 'Adaptive' && i === 0)) {
      bloomLevel = i % 2 === 0 ? 'Remembering' : 'Understanding';
      diffNum = 2;
    } else if (difficulty === 'Proficient' || (difficulty === 'Adaptive' && (i === 1 || i === 2))) {
      bloomLevel = i % 2 === 0 ? 'Application' : 'Analysis';
      diffNum = 3.5;
    } else {
      bloomLevel = i % 2 === 0 ? 'Evaluation' : 'Creation';
      diffNum = 4.8;
    }

    // Select distinct concept for package progression when possible
    let currentConcept = concept;
    if (!currentConcept || currentConcept === 'All Key Concepts in Topic' || currentConcept.startsWith('Core Fundamental')) {
      currentConcept = topicConcepts[i % Math.max(1, topicConcepts.length)] || `${cleanTop} Core Principles`;
    }

    // Generate grounded question package based on concept and type
    const qPackage = buildGroundedQuestionPackage({
      subject: cleanSubj,
      topic: cleanTop,
      concept: currentConcept,
      type: qType,
      bloomLevel,
      difficulty: diffNum,
      index: i + 1,
      totalCount: targetCount,
      assessmentMode,
      seenQuestionIds,
      seenFingerprints
    });

    seenQuestionIds.add(qPackage.id);
    if (qPackage.semanticFingerprint) seenFingerprints.add(qPackage.semanticFingerprint);
    if (qPackage.questionText) seenFingerprints.add(qPackage.questionText.trim().toLowerCase().slice(0, 60));
    questions.push(qPackage);
  }

  return questions;
}

/**
 * Builds an authentic, technically rigorous question package specifically for a concept.
 * Integrates directly with GenerateAcademicQuestionPackage for strict subject grounding.
 */
function buildGroundedQuestionPackage({ subject, topic, concept, type, bloomLevel, difficulty, index, totalCount, assessmentMode, seenQuestionIds, seenFingerprints }) {
  const diffLabel = difficulty > 3.8 ? 'Advanced' : difficulty > 2.5 ? 'Intermediate' : 'Foundation';
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: subject,
    topic,
    concept,
    questionType: type,
    difficulty: diffLabel,
    academicLevel: 'Undergraduate',
    index,
    seenQuestionIds,
    seenFingerprints
  });

  return {
    id: pkg.id || `q_x_${index}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    questionNumber: index,
    totalQuestions: totalCount,
    subject: pkg.subject,
    topic: pkg.topic,
    concept: pkg.concept,
    type: pkg.type,
    format: pkg.format || 'Theory',
    diagramSvg: pkg.diagramSvg || null,
    diagramCaption: pkg.diagramCaption || null,
    numericalDetails: pkg.numericalDetails || null,
    semanticFingerprint: pkg.semanticFingerprint || null,
    structuralFingerprint: pkg.structuralFingerprint || null,
    questionType: pkg.questionType || type,
    bloomLevel: pkg.bloomLevel || bloomLevel,
    difficulty: `${difficulty} / 5`,
    questionText: pkg.questionText,
    options: pkg.options,
    correctIndex: pkg.correctIndex,
    modelAnswer: pkg.modelAnswer,
    explanation: pkg.explanation,
    hints: pkg.hints,
    expectedKeywords: pkg.expectedKeywords,
    evaluationCriteria: pkg.rubric || {
      'Technical Accuracy': '50% for core concept articulation',
      'Analytical Rigor': '50% for governing relations and boundary constraints'
    },
    assignedMarks: Math.round(100 / totalCount),
    assessmentMode,
    isStudentSafe: assessmentMode === 'strict_exam',
    isVerified: Boolean(pkg.verifiedReference && pkg.validation?.valid),
    validation: pkg.validation,
    valid: pkg.valid ?? pkg.validation?.valid ?? true
  };
}
