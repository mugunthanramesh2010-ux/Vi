// src/services/topicMasteryEngine.js
// VIVA ANALYSER — MASTER ADAPTIVE INTELLIGENCE AND TOPIC MASTERY ENGINE
// Fine-Grained Knowledge Maps, Prerequisite DAGs, Calibrated Bayesian Knowledge Tracing (BKT),
// 7-Tier Answer Classification, Adaptive Next-Question Selection, and Topic Coverage Ledgers.
// 100% OFFLINE, ZERO EXTERNAL APIS REQUIRED.

import {
  ValidateQuestion,
  resolveAcademicContext,
  GenerateAcademicQuestionPackage,
  ACADEMIC_REGISTRY,
  normalizeString
} from './academicAssessmentEngine.js';

// ============================================================================
// 1. FINE-GRAINED TOPIC KNOWLEDGE MAPS & PREREQUISITE DAGs (PHASES 1 & 2)
// ============================================================================

export const TOPIC_KNOWLEDGE_MAPS = {
  // --------------------------------------------------------------------------
  // COMMUNICATION ENGINEERING
  // --------------------------------------------------------------------------
  'communication_engineering': {
    subjectId: 'comm_eng',
    subjectName: 'Communication Engineering',
    topics: {
      'gmsk': {
        topicId: 'gmsk',
        topicName: 'GMSK / MSK Modulation & Demodulation',
        description: 'Gaussian Minimum Shift Keying, continuous phase frequency modulation, constant envelope dynamics, and bandwidth containment.',
        concepts: [
          {
            id: 'comm_mod_basics',
            name: 'Modulation Fundamentals & Carrier Translation',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Understand necessity of carrier modulation, spectral translation, and lambda/4 antenna sizing.',
            governingPrinciples: 'Radiation efficiency requires antenna length proportional to lambda/4 (lambda = c / f). Baseband radiation requires impractically large structures.',
            equations: [
              { name: 'Wavelength', formula: 'lambda = c / f', variables: { c: 'Speed of light (3x10^8 m/s)', f: 'Carrier frequency (Hz)' }, units: 'meters' }
            ],
            commonMisconceptions: [
              {
                id: 'baseband_radiation_myth',
                description: 'Belief that baseband audio signals (20Hz-20kHz) can radiate directly through the atmosphere efficiently without carrier modulation.',
                remediation: 'Reinforce that antenna dimensions must be comparable to wavelength lambda/4. For 3 kHz audio, lambda is 100 km, requiring a 25 km antenna.'
              }
            ],
            provenance: 'Proakis, Digital Communications, 5th Ed.'
          },
          {
            id: 'comm_msk_fundamentals',
            name: 'MSK Fundamentals & Continuous Phase Transitions',
            prerequisites: ['comm_mod_basics'],
            stage: 'Stage B (Understanding)',
            learningObjective: 'Analyze Continuous Phase Frequency Shift Keying (CPFSK), minimum frequency separation, and modulation index h = 0.5.',
            governingPrinciples: 'MSK uses continuous phase transitions with modulation index h = 0.5 to maintain spectral continuity and avoid high-frequency phase discontinuities.',
            equations: [
              { name: 'Modulation Index', formula: 'h = 2 * Delta_f * T = 0.5', variables: { Delta_f: 'Frequency deviation (Hz)', T: 'Bit duration (s)' }, units: 'dimensionless' }
            ],
            commonMisconceptions: [
              {
                id: 'phase_discontinuity_myth',
                description: 'Assuming MSK exhibits abrupt phase jumps at symbol boundaries like standard binary FSK or QPSK.',
                remediation: 'Emphasize that MSK is continuous-phase frequency shift keying (CPFSK) where phase changes linearly and smoothly across symbol transitions.'
              }
            ],
            provenance: 'Haykin, Communication Systems, 4th Ed.'
          },
          {
            id: 'comm_gmsk_pulse_shaping',
            name: 'Gaussian Pulse Shaping & Bandwidth Containment',
            prerequisites: ['comm_msk_fundamentals'],
            stage: 'Stage C (Application)',
            learningObjective: 'Evaluate pre-modulation Gaussian filtering, BbT parameter, and spectral sidelobe suppression in GMSK.',
            governingPrinciples: 'Filtering baseband pulses with a Gaussian impulse response smoothes phase transitions, suppressing high-frequency spectral sidelobes and strictly limiting occupied RF bandwidth.',
            equations: [
              { name: 'Gaussian Filter Impulse Response', formula: 'h(t) = (sqrt(2*pi)/sigma) * exp(-t^2 / (2*sigma^2))', variables: { sigma: 'Pulse standard deviation parameter' }, units: '1/s' }
            ],
            commonMisconceptions: [
              {
                id: 'carrier_elimination_myth',
                description: 'Belief that Gaussian pulse shaping eliminates the need for an RF carrier signal.',
                remediation: 'Clarify that pulse shaping filters baseband data prior to RF carrier frequency modulation.'
              },
              {
                id: 'zero_noise_myth',
                description: 'Belief that pulse shaping guarantees zero bit errors regardless of channel noise.',
                remediation: 'Note that channel thermal noise (AWGN) still introduces bit errors bounded by Q-function curves.'
              }
            ],
            provenance: 'Rappaport, Wireless Communications: Principles and Practice.'
          },
          {
            id: 'comm_constant_envelope',
            name: 'Constant Envelope Dynamics & Non-Linear Amplification',
            prerequisites: ['comm_gmsk_pulse_shaping'],
            stage: 'Stage D (Analysis)',
            learningObjective: 'Analyze constant magnitude envelope properties enabling high-efficiency non-linear Class C power amplification without spectral regrowth.',
            governingPrinciples: 'Constant envelope (|s(t)| = A) eliminates amplitude variations, allowing saturated non-linear power amplifiers (Class C) to operate at peak electrical efficiency without AM-to-AM or AM-to-PM distortion.',
            equations: [
              { name: 'Signal Envelope', formula: '|s(t)| = sqrt(I(t)^2 + Q(t)^2) = A = const', variables: { A: 'Carrier peak amplitude' }, units: 'Volts' }
            ],
            commonMisconceptions: [
              {
                id: 'linear_amplifier_necessity_myth',
                description: 'Assuming GMSK transmitters require linear Class A/AB amplifiers like 16-QAM or OFDM.',
                remediation: 'Highlight that constant envelope modulations can safely utilize saturated non-linear Class C amplifiers without spectral splatter.'
              }
            ],
            provenance: 'Goldsmith, Wireless Communications.'
          },
          {
            id: 'comm_gmsk_demodulation',
            name: 'GMSK Demodulation & Viterbi Sequence Detection',
            prerequisites: ['comm_constant_envelope'],
            stage: 'Stage E (Advanced)',
            learningObjective: 'Compare coherent I/Q demodulation with non-coherent limiter-discriminator detection and Viterbi sequence equalization.',
            governingPrinciples: 'Pre-modulation filtering induces controlled Inter-Symbol Interference (ISI), which is optimally resolved using maximum-likelihood sequence estimation (Viterbi algorithm) at the receiver.',
            equations: [
              { name: 'Viterbi Metric', formula: 'Lambda = sum |r_k - s_k|^2', variables: { r_k: 'Received sample', s_k: 'Candidate state' }, units: 'energy units' }
            ],
            commonMisconceptions: [
              {
                id: 'instantaneous_symbol_conversion_myth',
                description: 'Assuming received GMSK symbols can be converted directly into analog audio without baseband sequence decoding.',
                remediation: 'Explain that digital demodulation extracts bits, which must subsequently pass through source decoding and DAC stages.'
              }
            ],
            provenance: 'Proakis & Salehi, Digital Communications.'
          }
        ]
      },
      'sampling and pcm': {
        topicId: 'sampling_pcm',
        topicName: 'Sampling & Pulse Code Modulation (PCM)',
        description: 'Nyquist sampling criterion, uniform quantization, SQNR bounds, and bit rate calculations.',
        concepts: [
          {
            id: 'comm_nyquist_sampling',
            name: 'Nyquist Sampling Criterion & Aliasing',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Calculate Nyquist sampling rates and guard bands to prevent spectral aliasing.',
            governingPrinciples: 'To recover a continuous signal, the sampling frequency must strictly satisfy fs >= 2 * fmax.',
            equations: [
              { name: 'Nyquist Rate', formula: 'fs >= 2 * fmax', variables: { fs: 'Sampling frequency (Hz)', fmax: 'Maximum signal frequency (Hz)' }, units: 'Hz' }
            ],
            commonMisconceptions: [
              {
                id: 'half_rate_sampling_myth',
                description: 'Assuming sampling at fs = fmax is sufficient for perfect reconstruction.',
                remediation: 'Emphasize that fs = fmax produces complete spectral overlap (aliasing); at least 2*fmax is mathematically required.'
              }
            ],
            provenance: 'Oppenheim & Schafer, Discrete-Time Signal Processing.'
          },
          {
            id: 'comm_quantization_sqnr',
            name: 'Uniform Quantization & Quantization Noise (SQNR)',
            prerequisites: ['comm_nyquist_sampling'],
            stage: 'Stage C (Application)',
            learningObjective: 'Compute quantization step size, noise power Delta^2/12, and the 6 dB per bit rule of thumb.',
            governingPrinciples: 'Every additional quantization bit halves the step size Delta, providing an approximately 6.02 dB improvement in Signal-to-Quantization-Noise Ratio.',
            equations: [
              { name: 'Quantization Step Size', formula: 'Delta = (Vmax - Vmin) / 2^n', variables: { n: 'Bits per sample' }, units: 'Volts' },
              { name: 'Rule of Thumb SQNR', formula: 'SQNR(dB) = 6.02 * n + 1.76', variables: { n: 'Bit depth' }, units: 'dB' }
            ],
            commonMisconceptions: [
              {
                id: 'linear_noise_scaling_myth',
                description: 'Believing quantization noise power decreases linearly with bit count rather than exponentially.',
                remediation: 'Note that noise power scales with Delta^2 = ((Vmax-Vmin)/2^n)^2, decreasing as 2^(-2n) (exponential drop).'
              }
            ],
            provenance: 'Taub & Schilling, Principles of Communication Systems.'
          },
          {
            id: 'comm_pcm_bitrate',
            name: 'PCM Transmission Bit Rate & Bandwidth',
            prerequisites: ['comm_quantization_sqnr'],
            stage: 'Stage C (Application)',
            learningObjective: 'Calculate digital transmission bit rate Rb = n * fs and transmission bandwidth requirements.',
            governingPrinciples: 'For voice signals with fmax = 4 kHz sampled at Nyquist rate fs = 8 kHz with 8 bits/sample, Rb = 8 * 8000 = 64 kbps.',
            equations: [
              { name: 'Transmission Bit Rate', formula: 'Rb = n * fs', variables: { n: 'Bits per sample', fs: 'Sampling frequency (samples/s)' }, units: 'bps or kbps' }
            ],
            commonMisconceptions: [
              {
                id: 'bitrate_equals_sampling_freq_myth',
                description: 'Confusing sampling rate (samples/second) with bit rate (bits/second).',
                remediation: 'Clarify that bit rate multiplies sampling frequency by the number of bits encoded per sample.'
              }
            ],
            provenance: 'Forouzan, Data Communications and Networking.'
          }
        ]
      },
      'transmission lines': {
        topicId: 'transmission_lines',
        topicName: 'Transmission Lines & Microwave Engineering',
        description: 'Characteristic impedance, reflection coefficient, VSWR, and quarter-wavelength matching.',
        concepts: [
          {
            id: 'comm_char_impedance',
            name: 'Characteristic Impedance & Wave Propagation',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Define Z0 = sqrt(L/C) and phase velocity for lossless transmission lines.',
            governingPrinciples: 'Characteristic impedance is the ratio of traveling voltage to current waves on an infinite or matched transmission line.',
            equations: [
              { name: 'Lossless Impedance', formula: 'Z0 = sqrt(L / C)', variables: { L: 'Inductance per unit length (H/m)', C: 'Capacitance per unit length (F/m)' }, units: 'ohms' }
            ],
            commonMisconceptions: [
              {
                id: 'dc_resistance_confusion',
                description: 'Confusing high-frequency wave impedance Z0 with ordinary DC ohmic wire resistance.',
                remediation: 'Explain that Z0 represents the ratio of traveling electromagnetic E and H fields, not dissipated wire resistance.'
              }
            ],
            provenance: 'Pozar, Microwave Engineering, 4th Ed.'
          },
          {
            id: 'comm_reflection_vswr',
            name: 'Reflection Coefficient & Voltage Standing Wave Ratio (VSWR)',
            prerequisites: ['comm_char_impedance'],
            stage: 'Stage C (Application)',
            learningObjective: 'Calculate reflection coefficient Gamma and standing wave ratio VSWR from load impedance ZL.',
            governingPrinciples: 'Impedance mismatch creates a reflected wave with Gamma = (ZL - Z0)/(ZL + Z0), setting up standing waves with VSWR = (1 + |Gamma|)/(1 - |Gamma|).',
            equations: [
              { name: 'Reflection Coefficient', formula: 'Gamma = (ZL - Z0) / (ZL + Z0)', variables: { ZL: 'Load impedance', Z0: 'Characteristic impedance' }, units: 'ratio' },
              { name: 'VSWR', formula: 'VSWR = (1 + |Gamma|) / (1 - |Gamma|)', variables: { Gamma: 'Reflection coefficient' }, units: 'ratio (>= 1.0)' }
            ],
            commonMisconceptions: [
              {
                id: 'vswr_below_one_myth',
                description: 'Belief that VSWR can be less than 1.0.',
                remediation: 'Emphasize that VSWR is strictly bounded by 1.0 <= VSWR <= infinity. A perfect match yields VSWR = 1.0.'
              }
            ],
            provenance: 'Pozar, Microwave Engineering.'
          }
        ]
      },
      'information theory': {
        topicId: 'information_theory',
        topicName: 'Information Theory & Channel Capacity',
        description: 'Shannon entropy, Shannon-Hartley channel capacity theorem, and AWGN bounds.',
        concepts: [
          {
            id: 'comm_shannon_capacity',
            name: 'Shannon-Hartley Channel Capacity Theorem',
            prerequisites: [],
            stage: 'Stage C (Application)',
            learningObjective: 'Compute theoretical channel capacity C = B * log2(1 + SNR) under AWGN conditions.',
            governingPrinciples: 'Establishes the upper bound on error-free information transmission rate across a channel with bandwidth B and signal-to-noise ratio SNR.',
            equations: [
              { name: 'Channel Capacity', formula: 'C = B * log2(1 + SNR)', variables: { B: 'Bandwidth (Hz)', SNR: 'Signal-to-noise power ratio' }, units: 'bits/second (bps)' }
            ],
            commonMisconceptions: [
              {
                id: 'infinite_rate_myth',
                description: 'Assuming data rate can be increased without bound in a bandlimited channel without increasing SNR.',
                remediation: 'Explain that channel capacity asymptotically approaches C = 1.44 * (S / N0) as bandwidth approaches infinity.'
              }
            ],
            provenance: 'Cover & Thomas, Elements of Information Theory.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // CONTROL SYSTEMS
  // --------------------------------------------------------------------------
  'control_systems': {
    subjectId: 'control_sys',
    subjectName: 'Control Systems',
    topics: {
      'pid_control': {
        topicId: 'pid_control',
        topicName: 'PID Controller Design & Tuning',
        description: 'Proportional, Integral, and Derivative control action, system type number, and steady-state error elimination.',
        concepts: [
          {
            id: 'cs_pid_proportional',
            name: 'Proportional Action & Steady-State Error',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Analyze Proportional control effort and steady-state offset in Type 0 systems.',
            governingPrinciples: 'Proportional action u(t) = Kp * e(t) produces control effort proportional to current error, requiring a continuous non-zero error to hold a plant at a non-zero state in Type 0 systems.',
            equations: [
              { name: 'Proportional Control', formula: 'u(t) = Kp * e(t)', variables: { Kp: 'Proportional gain', e: 'Tracking error' }, units: 'control units' }
            ],
            commonMisconceptions: [
              {
                id: 'p_eliminates_offset_myth',
                description: 'Belief that increasing Kp to very high values completely eliminates steady-state error without side effects.',
                remediation: 'Explain that finite Kp always leaves a steady-state offset in Type 0 systems, while excessive Kp reduces phase margin and induces oscillatory instability.'
              }
            ],
            provenance: 'Ogata, Modern Control Engineering, 5th Ed.'
          },
          {
            id: 'cs_pid_integral',
            name: 'Integral Action & Steady-State Error Elimination',
            prerequisites: ['cs_pid_proportional'],
            stage: 'Stage B (Understanding)',
            learningObjective: 'Evaluate how Integral action introduces a pole at s=0, increases system type number, and eliminates steady-state error.',
            governingPrinciples: 'The integral term Ki * integral(e(t) dt) accumulates persistent error over time, continuously increasing control action until steady-state tracking error is driven precisely to zero.',
            equations: [
              { name: 'Integral Action', formula: 'u_i(t) = Ki * integral(0 to t, e(tau) dtau)', variables: { Ki: 'Integral gain' }, units: 'control units' }
            ],
            commonMisconceptions: [
              {
                id: 'derivative_eliminates_error_myth',
                description: 'Assuming Derivative action eliminates steady-state error.',
                remediation: 'Clarify that Derivative action depends on de/dt, which is zero at steady state; only the Integral term eliminates steady-state error.'
              }
            ],
            provenance: 'Kuo, Automatic Control Systems.'
          },
          {
            id: 'cs_pid_derivative',
            name: 'Derivative Action & Transient Damping',
            prerequisites: ['cs_pid_integral'],
            stage: 'Stage D (Analysis)',
            learningObjective: 'Evaluate Derivative action Kd * de/dt for phase lead, transient damping, and noise amplification.',
            governingPrinciples: 'Derivative action anticipates future error based on rate of change, adding phase lead to dampen overshoot, but amplifies high-frequency sensor noise.',
            equations: [
              { name: 'Derivative Action', formula: 'u_d(t) = Kd * (de / dt)', variables: { Kd: 'Derivative gain' }, units: 'control units' }
            ],
            commonMisconceptions: [
              {
                id: 'unfiltered_derivative_myth',
                description: 'Assuming derivative action can be applied directly to noisy sensor measurements without low-pass filtering.',
                remediation: 'Explain that derivative terms require a low-pass filter pole Kd*s/(1 + s*Tf) to prevent sensor noise from saturating physical actuators.'
              }
            ],
            provenance: 'Franklin, Powell, Emami-Naeini, Feedback Control of Dynamic Systems.'
          }
        ]
      },
      'bode plot stability analysis': {
        topicId: 'bode_plot',
        topicName: 'Bode Plot Stability Analysis',
        description: 'Open-loop frequency response, gain crossover frequency, phase crossover frequency, and gain/phase margins.',
        concepts: [
          {
            id: 'cs_crossover_frequencies',
            name: 'Gain and Phase Crossover Frequencies',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Identify omega_gc (where |G|=0 dB) and omega_pc (where phase = -180 degrees).',
            governingPrinciples: 'Gain crossover frequency is where open-loop magnitude equals unity (0 dB). Phase crossover frequency is where open-loop phase lag reaches -180 degrees.',
            equations: [
              { name: 'Gain Crossover', formula: '|G(j*omega_gc)| = 1 (or 0 dB)', variables: { omega_gc: 'Gain crossover frequency' }, units: 'rad/s' },
              { name: 'Phase Crossover', formula: 'arg(G(j*omega_pc)) = -180 deg', variables: { omega_pc: 'Phase crossover frequency' }, units: 'rad/s' }
            ],
            commonMisconceptions: [
              {
                id: 'transposed_crossover_myth',
                description: 'Confusing gain crossover with phase crossover frequency.',
                remediation: 'Emphasize: Gain crossover evaluates magnitude = 0 dB; Phase crossover evaluates phase = -180 degrees.'
              }
            ],
            provenance: 'Nise, Control Systems Engineering.'
          },
          {
            id: 'cs_gain_phase_margins',
            name: 'Gain Margin & Phase Margin Stability Criteria',
            prerequisites: ['cs_crossover_frequencies'],
            stage: 'Stage D (Analysis)',
            learningObjective: 'Determine GM(dB) = -|G(j*omega_pc)|_dB and PM = 180 + arg(G(j*omega_gc)) for closed-loop stability.',
            governingPrinciples: 'For stable minimum-phase systems, both Gain Margin and Phase Margin must be strictly positive (GM > 0 dB, PM > 0 deg).',
            equations: [
              { name: 'Gain Margin', formula: 'GM(dB) = -20 * log10(|G(j*omega_pc)|)', variables: { omega_pc: 'Phase crossover' }, units: 'dB' },
              { name: 'Phase Margin', formula: 'PM = 180 deg + arg(G(j*omega_gc))', variables: { omega_gc: 'Gain crossover' }, units: 'degrees' }
            ],
            commonMisconceptions: [
              {
                id: 'phase_margin_at_phase_crossover_myth',
                description: 'Measuring Phase Margin at phase crossover frequency rather than gain crossover frequency.',
                remediation: 'Reiterate that GM is measured at phase crossover (-180°), while PM is measured at gain crossover (0 dB).'
              }
            ],
            provenance: 'Ogata, Modern Control Engineering.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // DATA STRUCTURES & ALGORITHMS (DSA)
  // --------------------------------------------------------------------------
  'dsa': {
    subjectId: 'dsa',
    subjectName: 'Data Structures & Algorithms',
    topics: {
      'kruskal': {
        topicId: 'kruskal',
        topicName: "Kruskal's Minimum Spanning Tree Algorithm",
        description: 'Greedy edge selection, cycle detection, Disjoint Set Union (DSU) data structures, and algorithmic complexity.',
        concepts: [
          {
            id: 'dsa_kruskal_greedy',
            name: 'Kruskal Greedy Strategy & Edge Sorting',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Understand edge sorting in ascending order O(E log E) and greedy candidate selection.',
            governingPrinciples: "Kruskal's algorithm greedily considers edges in non-decreasing order of weight, adding an edge to the MST if and only if it does not form a cycle.",
            equations: [
              { name: 'Sorting Complexity', formula: 'T(E) = O(E * log E) = O(E * log V)', variables: { E: 'Edge count', V: 'Vertex count' }, units: 'operations' }
            ],
            commonMisconceptions: [
              {
                id: 'kruskal_vertex_growth_myth',
                description: "Assuming Kruskal's algorithm grows a single connected tree from a start vertex like Prim's algorithm.",
                remediation: "Clarify that Kruskal maintains a forest of disconnected trees that gradually merge as edges are added, unlike Prim's single expanding tree."
              }
            ],
            provenance: 'Cormen, Leiserson, Rivest, Stein (CLRS), Introduction to Algorithms, 3rd Ed.'
          },
          {
            id: 'dsa_dsu_cycle_detection',
            name: 'Disjoint Set Union (DSU) Cycle Detection',
            prerequisites: ['dsa_kruskal_greedy'],
            stage: 'Stage B (Understanding)',
            learningObjective: 'Analyze near-constant amortized time cycle checks using path compression and union by rank.',
            governingPrinciples: 'If find(u) == find(v), edge (u, v) joins vertices already in the same component, forming a cycle. Path compression flattens tree depth to inverse Ackermann alpha(V) time.',
            equations: [
              { name: 'Amortized Query Time', formula: 'T_query = O(alpha(V)) ≈ O(1)', variables: { alpha: 'Inverse Ackermann function' }, units: 'time complexity' }
            ],
            commonMisconceptions: [
              {
                id: 'full_bfs_cycle_check_myth',
                description: 'Believing that running a full BFS or DFS per candidate edge is efficient for cycle detection.',
                remediation: 'Explain that running BFS per candidate edge degrades total time to O(E * V), whereas DSU achieves near O(E log E) overall time.'
              }
            ],
            provenance: 'CLRS, Chapter 21: Data Structures for Disjoint Sets.'
          }
        ]
      },
      'hashing': {
        topicId: 'hashing',
        topicName: 'Hash Tables & Collision Resolution',
        description: 'Load factor alpha = n/m, open addressing, separate chaining, and search complexity.',
        concepts: [
          {
            id: 'dsa_load_factor',
            name: 'Load Factor & Table Occupancy Dynamics',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Evaluate load factor alpha = n / m and its threshold limits in open addressing vs separate chaining.',
            governingPrinciples: 'In open addressing, each bucket holds at most one item, requiring alpha < 1.0 (typically rehashing at alpha ≈ 0.7). In separate chaining, alpha can exceed 1.0 with average search cost O(1 + alpha).',
            equations: [
              { name: 'Load Factor', formula: 'alpha = n / m', variables: { n: 'Number of elements', m: 'Number of buckets' }, units: 'occupancy ratio' }
            ],
            commonMisconceptions: [
              {
                id: 'open_addressing_alpha_gt_one_myth',
                description: 'Belief that open addressing can store more elements than available bucket slots (alpha >= 1).',
                remediation: 'Clarify that open addressing stores elements directly in the array; if n >= m, all slots are full and subsequent insertions enter an infinite probe loop.'
              }
            ],
            provenance: 'CLRS, Chapter 11: Hash Tables.'
          },
          {
            id: 'dsa_collision_resolution',
            name: 'Linear Probing vs Quadratic Probing & Primary Clustering',
            prerequisites: ['dsa_load_factor'],
            stage: 'Stage B (Understanding)',
            learningObjective: 'Compare linear probing, quadratic probing, and double hashing in collision resolution and cluster avoidance.',
            governingPrinciples: 'Linear probing suffers from primary clustering where contiguous occupied slots expand, increasing search length. Quadratic probing and double hashing mitigate primary clusters.',
            equations: [
              { name: 'Linear Probe Sequence', formula: 'h(k, i) = (h\'(k) + i) mod m', variables: { 'h\'(k)': 'Auxiliary hash function', i: 'Probe attempt index', m: 'Table capacity' }, units: 'bucket index' }
            ],
            commonMisconceptions: [
              {
                id: 'linear_probing_uniform_spread_myth',
                description: 'Assuming linear probing distributes collisions uniformly across all remaining empty buckets.',
                remediation: 'Explain that the probability of a key hashing into or immediately after an existing cluster of length L is (L + 1) / m, causing large clusters to grow faster.'
              }
            ],
            provenance: 'CLRS, Chapter 11: Hash Tables.'
          }
        ]
      }
    }
  },

  // --------------------------------------------------------------------------
  // BIOTECHNOLOGY
  // --------------------------------------------------------------------------
  'biotechnology': {
    subjectId: 'biotech',
    subjectName: 'Biotechnology',
    topics: {
      'bioreactor design': {
        topicId: 'bioreactor_design',
        topicName: 'Bioreactor Design & Mass Transfer',
        description: 'Gas-liquid oxygen mass transfer, volumetric mass transfer coefficient kLa, dissolved oxygen driving force, and thermal sterilization.',
        concepts: [
          {
            id: 'bt_gas_liquid_mass_transfer',
            name: 'Gas-Liquid Oxygen Mass Transfer & Two-Film Theory',
            prerequisites: [],
            stage: 'Stage A (Foundation)',
            learningObjective: 'Understand interfacial mass transfer, dissolved oxygen driving force (C* - CL), and oxygen limitation.',
            governingPrinciples: 'Gas-liquid mass transfer is governed by the two-film model: oxygen diffuses across gas and liquid boundary films with liquid film resistance dominating.',
            equations: [
              { name: 'Oxygen Transfer Rate (OTR)', formula: 'OTR = kLa * (C* - CL)', variables: { kLa: 'Volumetric mass transfer coefficient (1/s)', 'C*': 'Saturation DO (mg/L)', CL: 'Bulk liquid DO (mg/L)' }, units: 'mg/(L*s)' }
            ],
            commonMisconceptions: [
              {
                id: 'sparged_flow_equals_kla_myth',
                description: 'Confusing air sparging flow rate with volumetric mass transfer coefficient kLa.',
                remediation: 'Clarify that sparged air flow rate is superficial gas velocity, while kLa combines liquid-film transfer coefficient kL and interfacial area a.'
              }
            ],
            provenance: 'Doran, Bioprocess Engineering Principles, 2nd Ed.'
          },
          {
            id: 'bt_volumetric_kla_determination',
            name: 'Dynamic Gassing-Out & Volumetric Mass Transfer Coefficient (kLa)',
            prerequisites: ['bt_gas_liquid_mass_transfer'],
            stage: 'Stage B (Understanding)',
            learningObjective: 'Calculate volumetric mass transfer coefficient kLa from dynamic DO deoxygenation and re-aeration response curves.',
            governingPrinciples: 'Under dynamic gassing-out, DO is purged with nitrogen and re-aerated. The slope of ln(C* - CL) versus time yields kLa.',
            equations: [
              { name: 'Dynamic kLa Equation', formula: 'dCL/dt = kLa * (C* - CL)', variables: { kLa: 'Volumetric mass transfer coefficient (1/s)', 'C*': 'Saturation DO (mg/L)', CL: 'Bulk liquid DO (mg/L)' }, units: '1/s' }
            ],
            commonMisconceptions: [
              {
                id: 'sensor_response_lag_ignored',
                description: 'Assuming oxygen probe response lag exerts negligible effect on dynamic kLa measurement.',
                remediation: 'Explain that probe response time constant tau_p must be significantly less than 1/kLa, otherwise deconvoluted first-order probe dynamics must be solved.'
              }
            ],
            provenance: 'Doran, Bioprocess Engineering Principles, Chapter 9.'
          },
          {
            id: 'bt_thermal_sterilization',
            name: 'Del Factor (nabla) & Thermal Batch Sterilization Kinetics',
            prerequisites: ['bt_gas_liquid_mass_transfer'],
            stage: 'Stage C (Application)',
            learningObjective: 'Determine the Del factor nabla = ln(N0 / Nt) and holding time at 121 C for batch fermenter sterilization.',
            governingPrinciples: 'Thermal destruction of microbial endospores follows first-order death kinetics: dN/dt = -kd * N where kd obeys Arrhenius kinetics.',
            equations: [
              { name: 'Del Factor', formula: 'nabla = ln(N0 / Nt) = integral(kd * dt)', variables: { N0: 'Initial bioburden count', Nt: 'Target sterile bioburden count (e.g. 10^-3)', kd: 'Specific death rate constant (1/min)' }, units: 'dimensionless' }
            ],
            commonMisconceptions: [
              {
                id: 'absolute_zero_survivors_myth',
                description: 'Assuming thermal sterilization can mathematically guarantee 100% zero probability of contamination with finite holding time.',
                remediation: 'Clarify that first-order destruction is asymptotic; target bioburden is specified as an acceptable contamination probability such as 10^-3.'
              }
            ],
            provenance: 'Bailey & Ollis, Biochemical Engineering Fundamentals, Chapter 8.'
          }
        ]
      }
    }
  }
};

/**
 * Retrieve the fine-grained knowledge map for any subject and topic
 */
export function getTopicKnowledgeMap(subjectName, topicName) {
  const normSubj = normalizeString(subjectName);
  const normTopic = normalizeString(topicName);

  for (const [sKey, sMap] of Object.entries(TOPIC_KNOWLEDGE_MAPS)) {
    if (normSubj.includes(sKey) || sKey.includes(normSubj) || normalizeString(sMap.subjectName).includes(normSubj)) {
      for (const [tKey, tMap] of Object.entries(sMap.topics)) {
        if (normTopic.includes(tKey) || tKey.includes(normTopic) || normalizeString(tMap.topicName).includes(normTopic)) {
          return tMap;
        }
      }
    }
  }

  // Construct dynamic knowledge map for unregistered topic from ACADEMIC_REGISTRY
  const resolved = resolveAcademicContext({ subjectName, topic: topicName });
  const finalSubj = resolved.valid ? resolved.subjectName : (subjectName || 'Engineering');
  const finalTop = resolved.valid ? resolved.topic : (topicName || 'System Analysis');

  return {
    topicId: normalizeString(finalTop).replace(/\s+/g, '_'),
    topicName: finalTop,
    description: `Curriculum knowledge map for ${finalTop} in ${finalSubj}`,
    concepts: [
      {
        id: `${normalizeString(finalTop).slice(0, 8)}_foundations`,
        name: `Foundational Principles of ${finalTop}`,
        prerequisites: [],
        stage: 'Stage A (Foundation)',
        learningObjective: `Define core terminology, governing principles, and boundary definitions of ${finalTop}`,
        governingPrinciples: `Establishes fundamental operational transfer functions and invariant relations governing ${finalTop}`,
        equations: [],
        commonMisconceptions: [],
        provenance: 'Approved Syllabus Section'
      },
      {
        id: `${normalizeString(finalTop).slice(0, 8)}_modeling`,
        name: `Analytical Modeling of ${finalTop}`,
        prerequisites: [`${normalizeString(finalTop).slice(0, 8)}_foundations`],
        stage: 'Stage C (Application)',
        learningObjective: `Calculate parameter responses and evaluate mathematical formulations in ${finalTop}`,
        governingPrinciples: `Quantitative transfer scaling under nominal operating conditions`,
        equations: [],
        commonMisconceptions: [],
        provenance: 'Approved Syllabus Section'
      },
      {
        id: `${normalizeString(finalTop).slice(0, 8)}_edge_analysis`,
        name: `Boundary Analysis & Failure Modes in ${finalTop}`,
        prerequisites: [`${normalizeString(finalTop).slice(0, 8)}_modeling`],
        stage: 'Stage D (Analysis)',
        learningObjective: `Diagnose stability limits, failure modes, and boundary constraints in ${finalTop}`,
        governingPrinciples: `Non-linear saturation limits and dynamic margin stability`,
        equations: [],
        commonMisconceptions: [],
        provenance: 'Approved Syllabus Section'
      }
    ]
  };
}

/**
 * Build a structured dependency graph (DAG) for a topic
 */
export function getConceptDependencyGraph(subjectName, topicName) {
  const kMap = getTopicKnowledgeMap(subjectName, topicName);
  const nodes = {};
  const edges = [];

  kMap.concepts.forEach(c => {
    nodes[c.id] = {
      id: c.id,
      name: c.name,
      stage: c.stage,
      learningObjective: c.learningObjective,
      prerequisites: c.prerequisites || []
    };

    (c.prerequisites || []).forEach(pId => {
      edges.push({ from: pId, to: c.id });
    });
  });

  return {
    topicId: kMap.topicId,
    topicName: kMap.topicName,
    nodes,
    edges,
    conceptList: kMap.concepts
  };
}

/**
 * Check whether all prerequisites for a target concept have been demonstrated
 */
export function checkPrerequisitesMet(conceptId, demonstratedConcepts = new Set(), dependencyGraph = null) {
  if (!dependencyGraph || !dependencyGraph.nodes[conceptId]) return true;
  const prereqs = dependencyGraph.nodes[conceptId].prerequisites || [];
  return prereqs.every(p => demonstratedConcepts.has(p));
}

// ============================================================================
// 2. CALIBRATED BAYESIAN STUDENT MASTERY MODEL (PHASE 3)
// ============================================================================

export class StudentMasteryModel {
  constructor(initialData = {}) {
    this.studentId = initialData.studentId || 'STUDENT_DEFAULT';
    this.subjectName = initialData.subjectName || '';
    this.topicName = initialData.topicName || '';

    // Per-concept mastery profile: conceptId -> ConceptMasteryRecord
    this.concepts = initialData.concepts || {};

    // 8-State Topic Coverage Ledger: conceptId -> Status
    this.coverageLedger = initialData.coverageLedger || {};

    // Observed Misconceptions: array of { conceptId, misconceptionId, description, timestamp }
    this.diagnosedMisconceptions = initialData.diagnosedMisconceptions || [];

    // Attempt history
    this.questionHistory = initialData.questionHistory || [];

    // BKT Calibration Parameters (Calibrated values)
    this.bktParams = {
      pL0: 0.25, // Prior probability of knowing concept
      pT: 0.18,  // Transition / learning probability per opportunity
      pG: 0.20,  // Guess probability for 4-option MCQ (0.05 for numeric/text)
      pS: 0.10   // Slip probability (careless mistake despite knowing)
    };
  }

  /**
   * Initialize all concepts in the topic knowledge map into the coverage ledger
   */
  initializeTopicLedger(knowledgeMap) {
    if (!knowledgeMap || !Array.isArray(knowledgeMap.concepts)) return;

    knowledgeMap.concepts.forEach(c => {
      if (!this.coverageLedger[c.id]) {
        const hasPrereqs = (c.prerequisites || []).length > 0;
        this.coverageLedger[c.id] = hasPrereqs ? 'BLOCKED_BY_PREREQUISITE' : 'NOT_YET_ASSESSED';
      }

      if (!this.concepts[c.id]) {
        this.concepts[c.id] = {
          conceptId: c.id,
          conceptName: c.name,
          pKnown: this.bktParams.pL0,
          uncertainty: 1.0,
          confidence: 0.0,
          independentAttempts: 0,
          assistedAttempts: 0,
          consecutiveUnassistedCorrect: 0,
          demonstratedFormats: [],
          observedMisconceptions: [],
          lastAssessmentTime: null,
          status: this.coverageLedger[c.id]
        };
      }
    });

    this.refreshPrerequisiteBlocks(knowledgeMap);
  }

  /**
   * Update blocked states based on mastered prerequisites
   */
  refreshPrerequisiteBlocks(knowledgeMap) {
    const masteredSet = new Set(
      Object.entries(this.concepts)
        .filter(([_, data]) => data.status === 'INDEPENDENTLY_DEMONSTRATED' || data.status === 'VERIFIED_THROUGH_TRANSFER')
        .map(([id]) => id)
    );

    knowledgeMap.concepts.forEach(c => {
      const currentStatus = this.coverageLedger[c.id];
      if (currentStatus === 'BLOCKED_BY_PREREQUISITE') {
        const allMet = (c.prerequisites || []).every(p => masteredSet.has(p));
        if (allMet) {
          this.coverageLedger[c.id] = 'NOT_YET_ASSESSED';
          if (this.concepts[c.id]) this.concepts[c.id].status = 'NOT_YET_ASSESSED';
        }
      }
    });
  }

  /**
   * Update mastery estimate using Calibrated Bayesian Knowledge Tracing
   */
  updateMasteryEvidence({
    conceptId,
    conceptName,
    isCorrect,
    reasoningTier = 'CORRECT_SOUND_REASONING',
    score = 75,
    hintsUsed = 0,
    timeSpentSeconds = 25,
    format = 'Theory',
    diagnosedMisconception = null,
    knowledgeMap = null
  }) {
    if (!this.concepts[conceptId]) {
      this.concepts[conceptId] = {
        conceptId,
        conceptName: conceptName || conceptId,
        pKnown: this.bktParams.pL0,
        uncertainty: 1.0,
        confidence: 0.0,
        independentAttempts: 0,
        assistedAttempts: 0,
        consecutiveUnassistedCorrect: 0,
        demonstratedFormats: [],
        observedMisconceptions: [],
        lastAssessmentTime: null,
        status: 'INTRODUCED'
      };
    }

    const rec = this.concepts[conceptId];
    rec.lastAssessmentTime = new Date().toISOString();

    const isAssisted = hintsUsed > 0;
    if (isAssisted) {
      rec.assistedAttempts++;
      rec.consecutiveUnassistedCorrect = 0;
    } else {
      rec.independentAttempts++;
    }

    // Adjust guess parameter for text/numerical calculations
    const effectivePg = format === 'Numerical' || format === 'Derivation' ? 0.05 : this.bktParams.pG;
    const effectivePs = this.bktParams.pS;

    // Calibrated Bayesian Update
    let pObsGivenKnown = 0;
    let pObsGivenUnknown = 0;

    if (reasoningTier === 'CORRECT_SOUND_REASONING' && !isAssisted) {
      pObsGivenKnown = 1 - effectivePs;
      pObsGivenUnknown = effectivePg;
      rec.consecutiveUnassistedCorrect++;
      if (!rec.demonstratedFormats.includes(format)) rec.demonstratedFormats.push(format);
    } else if (reasoningTier === 'CORRECT_WEAK_REASONING' || isAssisted) {
      pObsGivenKnown = (1 - effectivePs) * 0.6;
      pObsGivenUnknown = effectivePg * 1.5;
    } else if (reasoningTier === 'PARTIALLY_CORRECT') {
      pObsGivenKnown = 0.40;
      pObsGivenUnknown = 0.25;
      rec.consecutiveUnassistedCorrect = 0;
    } else {
      // Incorrect
      pObsGivenKnown = effectivePs;
      pObsGivenUnknown = 1 - effectivePg;
      rec.consecutiveUnassistedCorrect = 0;
    }

    // Bayesian Posterior calculation
    const pNumerator = rec.pKnown * pObsGivenKnown;
    const pDenominator = pNumerator + ((1 - rec.pKnown) * pObsGivenUnknown);
    const posterior = pDenominator > 0 ? (pNumerator / pDenominator) : rec.pKnown;

    // BKT Transition update (learning from the attempt)
    rec.pKnown = Number((posterior + (1 - posterior) * this.bktParams.pT).toFixed(3));

    // Uncertainty decreases with independent evidence
    rec.uncertainty = Math.max(0.05, Number((1 / (1 + 0.6 * rec.independentAttempts)).toFixed(3)));
    rec.confidence = Number((1 - rec.uncertainty).toFixed(3));

    // Misconception tracking
    if (diagnosedMisconception) {
      rec.observedMisconceptions.push(diagnosedMisconception);
      this.diagnosedMisconceptions.push({
        conceptId,
        misconception: diagnosedMisconception,
        timestamp: new Date().toISOString()
      });
    }

    // Determine 8-State Coverage Ledger status
    if (rec.pKnown >= 0.80 && rec.uncertainty <= 0.48 && rec.consecutiveUnassistedCorrect >= 2) {
      // Check for multi-representation transfer (e.g. Theory + Numerical or Theory + Graph)
      const hasDiverseFormats = rec.demonstratedFormats.length >= 2;
      rec.status = hasDiverseFormats ? 'VERIFIED_THROUGH_TRANSFER' : 'INDEPENDENTLY_DEMONSTRATED';
    } else if (isAssisted && isCorrect) {
      rec.status = 'ASSISTED';
    } else if (rec.independentAttempts > 0 || rec.assistedAttempts > 0) {
      rec.status = 'DEVELOPING';
    } else {
      rec.status = 'INTRODUCED';
    }

    this.coverageLedger[conceptId] = rec.status;

    if (knowledgeMap) {
      this.refreshPrerequisiteBlocks(knowledgeMap);
    }

    this.questionHistory.push({
      conceptId,
      conceptName: rec.conceptName,
      format,
      score,
      isCorrect,
      reasoningTier,
      hintsUsed,
      timeSpentSeconds,
      pKnownAfter: rec.pKnown,
      uncertaintyAfter: rec.uncertainty,
      statusAfter: rec.status,
      timestamp: new Date().toISOString()
    });

    return rec;
  }

  /**
   * Generate an authoritative, evidence-based Topic Mastery Report
   */
  generateTopicMasteryReport() {
    const conceptEntries = Object.entries(this.concepts);
    const totalConcepts = conceptEntries.length;

    const masteredConcepts = conceptEntries.filter(([_, d]) => d.status === 'INDEPENDENTLY_DEMONSTRATED' || d.status === 'VERIFIED_THROUGH_TRANSFER');
    const developingConcepts = conceptEntries.filter(([_, d]) => d.status === 'DEVELOPING' || d.status === 'ASSISTED' || d.status === 'INTRODUCED');
    const unassessedConcepts = conceptEntries.filter(([_, d]) => d.status === 'NOT_YET_ASSESSED' || d.status === 'BLOCKED_BY_PREREQUISITE');

    const avgConfidence = totalConcepts > 0
      ? Math.round(conceptEntries.reduce((acc, [_, d]) => acc + d.confidence, 0) / totalConcepts * 100)
      : 0;

    const overallMasteryPercent = totalConcepts > 0
      ? Math.round((masteredConcepts.length / totalConcepts) * 100)
      : 0;

    return {
      studentId: this.studentId,
      subjectName: this.subjectName,
      topicName: this.topicName,
      totalConceptsCount: totalConcepts,
      masteredCount: masteredConcepts.length,
      developingCount: developingConcepts.length,
      unassessedCount: unassessedConcepts.length,
      overallMasteryPercent,
      confidenceScore: avgConfidence,
      conceptLedger: this.coverageLedger,
      masteredList: masteredConcepts.map(([id, d]) => ({ id, name: d.conceptName, pKnown: d.pKnown, formats: d.demonstratedFormats })),
      developingList: developingConcepts.map(([id, d]) => ({ id, name: d.conceptName, pKnown: d.pKnown, uncertainty: d.uncertainty, status: d.status })),
      misconceptionsDetected: this.diagnosedMisconceptions,
      actionableRecommendations: developingConcepts.map(([_, d]) => `Practice unassisted numerical and transfer problems for ${d.conceptName}.`)
    };
  }
}

// ============================================================================
// 3. SEVEN-TIER ANSWER EVALUATOR (PHASE 3)
// ============================================================================

export function classifyAnswerEvaluation(answer, question, hintsUsed = 0, timeSpentSec = 25) {
  const isMcq = typeof answer === 'number' || (typeof answer === 'string' && /^[0-3]$/.test(answer.trim()));
  const cleanAns = typeof answer === 'string' ? answer.trim().toLowerCase() : String(answer ?? '');

  if (isMcq) {
    const selectedIdx = typeof answer === 'number' ? answer : parseInt(answer, 10);
    const correctIdx = typeof question.correctIndex === 'number' ? question.correctIndex : 0;
    const isCorrect = selectedIdx === correctIdx;

    if (isCorrect) {
      if (hintsUsed > 0) {
        return {
          tier: 'CORRECT_WITH_HINT',
          score: Math.max(50, 100 - (hintsUsed * 10)),
          isCorrect: true,
          status: 'Correct',
          feedback: `Correct option selected following Tier ${hintsUsed} hint scaffolding. Concept scheduled for unassisted re-assessment.`,
          diagnosedMisconception: null
        };
      }
      return {
        tier: 'CORRECT_SOUND_REASONING',
        score: 100,
        isCorrect: true,
        status: 'Correct',
        feedback: 'Precise technical option selected with zero hint assistance.',
        diagnosedMisconception: null
      };
    } else {
      // Check if selected option corresponds to an identified misconception
      const selectedOptionText = (question.options && question.options[selectedIdx]) ? question.options[selectedIdx] : '';
      let diagnosedMisconception = null;

      if (question.commonMisconceptions && Array.isArray(question.commonMisconceptions)) {
        diagnosedMisconception = question.commonMisconceptions.find(m =>
          selectedOptionText.toLowerCase().includes(m.id?.toLowerCase() || '') ||
          selectedOptionText.toLowerCase().includes(m.description?.toLowerCase().slice(0, 20) || '')
        );
      }

      return {
        tier: diagnosedMisconception ? 'INCORRECT_KNOWN_MISCONCEPTION' : 'INCORRECT_UNIDENTIFIED',
        score: 20,
        isCorrect: false,
        status: 'Needs Improvement',
        feedback: diagnosedMisconception
          ? `Conceptual gap identified: ${diagnosedMisconception.remediation || 'Review governing principles.'}`
          : 'Incorrect option chosen. Reviewing prerequisite governing principles.',
        diagnosedMisconception: diagnosedMisconception?.description || 'Selected distractor indicates ungrounded assumption'
      };
    }
  }

  // Text Conceptual Answer Evaluation
  const expected = question.expectedKeywords || ['principle', 'concept', 'system'];
  const matched = expected.filter(kw => cleanAns.includes(kw.toLowerCase()));
  const matchRatio = matched.length / Math.max(1, expected.length);

  const causalTerms = ['because', 'therefore', 'implies', 'yields', 'proportional', 'inversely', 'governed by', 'ratio', 'boundary', 'differential'];
  const hasCausalLogic = causalTerms.some(c => cleanAns.includes(c));

  if (matchRatio >= 0.70 && hasCausalLogic && hintsUsed === 0) {
    return {
      tier: 'CORRECT_SOUND_REASONING',
      score: 95,
      isCorrect: true,
      status: 'Correct',
      feedback: 'Outstanding technical reasoning with robust causal articulation of core equations.',
      diagnosedMisconception: null
    };
  }

  if (matchRatio >= 0.60 && hintsUsed === 0) {
    return {
      tier: 'CORRECT_WEAK_REASONING',
      score: 75,
      isCorrect: true,
      status: 'Partially Correct',
      feedback: 'Correct fundamental assertions, but causal derivation and boundary relationships require verification.',
      diagnosedMisconception: null
    };
  }

  if (matchRatio >= 0.50 && hintsUsed > 0) {
    return {
      tier: 'CORRECT_WITH_HINT',
      score: Math.max(50, 75 - (hintsUsed * 8)),
      isCorrect: true,
      status: 'Partially Correct',
      feedback: 'Conceptual response guided by hint assistance. Scheduled for independent verification.',
      diagnosedMisconception: null
    };
  }

  if (matchRatio >= 0.35) {
    return {
      tier: 'PARTIALLY_CORRECT',
      score: 55,
      isCorrect: false,
      status: 'Partially Correct',
      feedback: `Partially valid reasoning. Captured: ${matched.join(', ')}. Missing critical depth on governing relationships.`,
      diagnosedMisconception: null
    };
  }

  return {
    tier: 'INCORRECT_UNIDENTIFIED',
    score: 15,
    isCorrect: false,
    status: 'Needs Improvement',
    feedback: 'Critical foundational elements missing. Activating prerequisite scaffolding.',
    diagnosedMisconception: 'Omission of primary physical and mathematical formulations'
  };
}

// ============================================================================
// 4. DEDICATED ADAPTIVE NEXT-QUESTION SELECTION SERVICE (PHASE 4 & PHASE 5)
// ============================================================================

export function selectAdaptiveNextQuestion({
  subjectName,
  topicName,
  masteryModel,
  lastEvaluation = null,
  previousQuestions = [],
  currentIndex = 0,
  requestedCount = 10,
  sessionMode = 'fixed_count' // 'fixed_count' | 'mastery_pursuit'
}) {
  const kMap = getTopicKnowledgeMap(subjectName, topicName);
  const depGraph = getConceptDependencyGraph(subjectName, topicName);

  if (masteryModel && (!masteryModel.concepts || Object.keys(masteryModel.concepts).length === 0)) {
    masteryModel.initializeTopicLedger(kMap);
  }

  const seenIds = new Set(previousQuestions.map(q => q.id).filter(Boolean));
  const seenFingerprints = new Set(previousQuestions.map(q => q.semanticFingerprint).filter(Boolean));
  const previousConcepts = previousQuestions.map(q => q.conceptId || q.concept);

  let targetConcept = null;
  let targetStage = 'Stage A (Foundation)';
  let targetFormat = 'Theory';
  let adaptiveReason = '';

  // 1. Analyze previous evaluation evidence
  if (lastEvaluation) {
    const lastTier = lastEvaluation.tier || (lastEvaluation.status === 'Correct' ? 'CORRECT_SOUND_REASONING' : 'INCORRECT_UNIDENTIFIED');

    if (lastTier === 'INCORRECT_KNOWN_MISCONCEPTION' || lastTier === 'INCORRECT_UNIDENTIFIED') {
      // Diagnostic check: is the student missing a prerequisite concept?
      const lastQ = previousQuestions[previousQuestions.length - 1];
      const lastConceptId = lastQ?.conceptId;
      const lastNode = lastConceptId ? depGraph.nodes[lastConceptId] : null;

      const unmetPrereq = lastNode?.prerequisites?.find(pId => {
        const m = masteryModel?.concepts[pId];
        return !m || (m.status !== 'INDEPENDENTLY_DEMONSTRATED' && m.status !== 'VERIFIED_THROUGH_TRANSFER');
      });

      if (unmetPrereq && depGraph.nodes[unmetPrereq]) {
        targetConcept = kMap.concepts.find(c => c.id === unmetPrereq);
        targetStage = 'Stage A (Foundation)';
        targetFormat = 'Theory';
        adaptiveReason = `Remediating missing prerequisite "${targetConcept.name}" following incorrect response in parent concept`;
      } else {
        // Misconception is specific to this concept: ask focused remedial problem using alternative representation
        targetConcept = kMap.concepts.find(c => c.id === lastConceptId) || kMap.concepts[0];
        targetStage = 'Stage B (Understanding)';
        targetFormat = 'Comparison';
        adaptiveReason = `Targeted remediation on "${targetConcept.name}" addressing diagnosed misconception via comparative reasoning`;
      }
    } else if (lastTier === 'CORRECT_WEAK_REASONING') {
      // Ask focused follow-up verifying the underlying principle or boundary condition
      const lastQ = previousQuestions[previousQuestions.length - 1];
      targetConcept = kMap.concepts.find(c => c.id === lastQ?.conceptId) || kMap.concepts[0];
      targetStage = 'Stage D (Analysis)';
      targetFormat = 'Graph';
      adaptiveReason = `Probing underlying governing relationships and boundary limits on "${targetConcept.name}" following weak reasoning`;
    } else if (lastTier === 'CORRECT_WITH_HINT') {
      // Demonstrated with assistance: move forward to next concept, scheduling unassisted review later
      adaptiveReason = 'Scaffolded success recorded. Progressing to adjacent objective while flagging concept for unassisted verification';
    } else if (lastTier === 'CORRECT_SOUND_REASONING') {
      const lastQ = previousQuestions[previousQuestions.length - 1];
      const lastConceptData = lastQ?.conceptId ? masteryModel?.concepts[lastQ.conceptId] : null;

      // If concept was answered independently but not yet verified across multiple representations, test transfer
      if (lastConceptData && lastConceptData.demonstratedFormats.length < 2) {
        targetConcept = kMap.concepts.find(c => c.id === lastQ.conceptId);
        targetStage = 'Stage C (Application)';
        targetFormat = lastQ.format === 'Theory' ? 'Numerical' : 'Scenario';
        adaptiveReason = `Verifying transfer and calculation proficiency for "${targetConcept.name}" via ${targetFormat} representation`;
      }
    }
  }

  // 2. If targetConcept not set by remediation/follow-up, pick highest-priority unmastered concept whose prerequisites are met
  if (!targetConcept) {
    const unmasteredCandidates = kMap.concepts.filter(c => {
      const cData = masteryModel?.concepts[c.id];
      const isMastered = cData && (cData.status === 'INDEPENDENTLY_DEMONSTRATED' || cData.status === 'VERIFIED_THROUGH_TRANSFER');
      const prereqsMet = (c.prerequisites || []).every(pId => {
        const pData = masteryModel?.concepts[pId];
        return pData && (pData.status === 'INDEPENDENTLY_DEMONSTRATED' || pData.status === 'VERIFIED_THROUGH_TRANSFER');
      });
      return !isMastered && prereqsMet;
    });

    if (unmasteredCandidates.length > 0) {
      const lastAskedConcept = previousQuestions[previousQuestions.length - 1]?.conceptId;
      const nextCandidate = unmasteredCandidates.find(c => c.id !== lastAskedConcept) || unmasteredCandidates[currentIndex % unmasteredCandidates.length];
      targetConcept = nextCandidate;
      targetStage = targetConcept.stage || 'Stage B (Understanding)';
      const formatCycle = ['Theory', 'Numerical', 'Diagram', 'Scenario', 'Comparison'];
      targetFormat = formatCycle[currentIndex % formatCycle.length];
      adaptiveReason = `Assessing next highest-priority curriculum objective "${targetConcept.name}" with confirmed prerequisites`;
    } else {
      // Pick concept with highest uncertainty (least assessment evidence)
      const sortedByUncertainty = [...kMap.concepts].sort((a, b) => {
        const uncA = masteryModel?.concepts[a.id]?.uncertainty ?? 1.0;
        const uncB = masteryModel?.concepts[b.id]?.uncertainty ?? 1.0;
        return uncB - uncA;
      });

      targetConcept = sortedByUncertainty[0] || kMap.concepts[0];
      targetStage = 'Stage E (Advanced)';
      targetFormat = 'Scenario';
      adaptiveReason = `Reducing assessment uncertainty on "${targetConcept.name}" via advanced synthesis`;
    }
  }

  // 3. Generate candidate question grounded in target concept and representation
  const generatedPackage = GenerateAcademicQuestionPackage({
    subjectName: kMap.subjectName || subjectName,
    topic: kMap.topicName || topicName,
    concept: targetConcept.name,
    questionType: 'mixed',
    difficulty: targetStage.includes('Advanced') ? 'Advanced' : (targetStage.includes('Application') || targetStage.includes('Analysis') ? 'Intermediate' : 'Foundation'),
    format: targetFormat,
    index: currentIndex + 1,
    seenQuestionIds: seenIds,
    seenFingerprints: seenFingerprints
  });

  // Attach adaptive selection metadata
  generatedPackage.conceptId = targetConcept.id;
  generatedPackage.adaptiveReason = adaptiveReason;
  generatedPackage.targetStage = targetStage;
  generatedPackage.prerequisites = targetConcept.prerequisites || [];

  return generatedPackage;
}

// ============================================================================
// 5. ADAPTIVE HINT GENERATOR TARGETING SPECIFIC MISCONCEPTIONS (PHASE 9)
// ============================================================================

export function generateAdaptiveHint(questionPackage, hintLevel = 1, diagnosedMisconceptions = []) {
  const hints = questionPackage.hints || [];
  const baseHint = hints[hintLevel - 1] || 'Review the core operational equations and boundary definitions.';

  // If student has an active diagnosed misconception, customize Hint 1 & 2 to specifically correct it
  if (diagnosedMisconceptions.length > 0 && hintLevel <= 2) {
    const activeM = diagnosedMisconceptions[diagnosedMisconceptions.length - 1];
    return `[Targeted Guidance]: Be cautious not to assume that ${activeM.description || 'parameters vary without boundary'}. ${baseHint}`;
  }

  return baseHint;
}
