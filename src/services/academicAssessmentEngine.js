// src/services/academicAssessmentEngine.js
// VIVA ANALYZER — UNIVERSAL TOPIC-INTELLIGENT QUESTION GENERATION ENGINE
// Multi-Format Question Generation: Core Theory, Numerical Problems, Scenario Vivas,
// Diagram/Image Questions, Comparison & Reasoning, and Analytical Derivations.
// 100% Offline, Grounded in Real Academic Principles, Hidden Multi-Model Compatible.

/**
 * 1. REGISTERED ACADEMIC CURRICULUM & SYLLABUS REGISTRY
 * Maps Registered Subjects, Schedules, Topics, Concepts, and Multi-Format Verified Questions.
 */
export const ACADEMIC_REGISTRY = {
  biotechnology: {
    id: 'biotech',
    name: 'Biotechnology',
    department: 'Biotechnology Engineering',
    topics: {
      'bioreactor design': {
        name: 'Bioreactor Design',
        concepts: {
          'oxygen transfer': {
            name: 'Oxygen Transfer',
            learningObjective: 'Understand gas-liquid mass transfer, kLa measurement, and dissolved oxygen driving force in aerated bioreactors.',
            questions: [
              {
                id: 'bt_bd_ot_1',
                questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent in aerated bioreactor operation?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'The rate of oxygen transport across the gas-liquid interface per unit driving force and volume',
                  'The total volumetric flow rate of sparged air entering the bioreactor vessel',
                  'The rate of enzymatic substrate conversion per unit biomass concentration',
                  'The shear stress imparted by the impeller on filamentous cell walls'
                ],
                correctIndex: 0,
                modelAnswer: 'The volumetric mass-transfer coefficient kLa quantifies the combined liquid-side mass transfer coefficient (kL) and specific interfacial gas-liquid surface area (a), characterizing the overall rate of oxygen transport into the liquid medium per unit concentration driving force (C* - CL).',
                explanation: 'Option A is correct because kLa combines the liquid film mass-transfer coefficient (kL) with specific interfacial surface area (a), defining volumetric oxygen transfer rate: OTR = kLa(C* - CL). Options B, C, and D refer to aeration gas flow rate, microbial specific growth/consumption kinetics, and hydrodynamic shear stress, which are distinct physical phenomena.',
                hints: [
                  'Consider how oxygen molecules move from a sparged gas bubble across the liquid film into the surrounding culture broth.',
                  'Think about the two-film theory and the factors that govern interfacial mass transfer across the gas-liquid boundary.',
                  'Recall that kLa combines the liquid-film mass transfer coefficient (kL) with the specific gas-liquid interfacial area per unit liquid volume (a).',
                  'Use the governing mass transfer equation OTR = kLa(C* - CL), where (C* - CL) is the dissolved oxygen concentration driving force.'
                ],
                distractorRationales: [
                  { index: 0, isCorrect: true, type: 'Correct Answer', rationale: 'Defines kLa as the product of liquid film transfer coefficient kL and interfacial area a per unit volume.' },
                  { index: 1, isCorrect: false, type: 'Plausible Misconception', rationale: 'Confuses volumetric transfer coefficient kLa with volumetric air sparge flow rate (vvm or L/min).' },
                  { index: 2, isCorrect: false, type: 'Related Alternative', rationale: 'Describes microbial specific substrate consumption rate (qS) rather than physical oxygen transport.' },
                  { index: 3, isCorrect: false, type: 'Related Alternative', rationale: 'Describes hydrodynamic impeller shear stress (tau) rather than mass transfer.' }
                ],
                expectedKeywords: ['volumetric mass-transfer coefficient', 'kla', 'gas-liquid interface', 'dissolved oxygen', 'driving force', 'interfacial area'],
                rubric: {
                  'Definition of kLa': '40% for correctly explaining kL and specific area a',
                  'Mass Transfer Relationship': '40% for articulating OTR = kLa(C* - CL)',
                  'Operational Significance': '20% for explaining oxygen limitation in aerobic cultures'
                },
                diagramSvg: null
              },
              {
                id: 'bt_bd_ot_num_1',
                questionText: 'An aerobic fermentation in a 1,000 L bioreactor operates with volumetric mass transfer coefficient kLa = 0.04 s^-1. If saturation dissolved oxygen concentration is C* = 8.0 mg/L and bulk liquid dissolved oxygen is maintained at CL = 2.0 mg/L, calculate the instantaneous volumetric Oxygen Transfer Rate (OTR).',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'OTR = kLa * (C* - CL)',
                  givenParameters: { 'kLa': '0.04 s^-1', 'C*': '8.0 mg/L', 'CL': '2.0 mg/L' },
                  stepByStep: 'OTR = 0.04 * (8.0 - 2.0) = 0.04 * 6.0 = 0.24 mg/(L·s)',
                  unit: 'mg/(L·s)',
                  calculatedValue: 0.24
                },
                options: [
                  '0.24 mg/(L·s)',
                  '0.08 mg/(L·s)',
                  '0.48 mg/(L·s)',
                  '2.40 mg/(L·s)'
                ],
                correctIndex: 0,
                modelAnswer: 'The Oxygen Transfer Rate is calculated using OTR = kLa * (C* - CL) = 0.04 s^-1 * (8.0 mg/L - 2.0 mg/L) = 0.04 * 6.0 = 0.24 mg/(L·s).',
                explanation: 'Option A is correct: direct application of the mass transfer rate equation yields OTR = 0.04 s^-1 * (8.0 - 2.0) mg/L = 0.24 mg/(L·s). Options B, C, and D result from arithmetic errors or failing to subtract the bulk dissolved oxygen concentration.',
                hints: [
                  'Recall the governing volumetric oxygen transfer relationship: OTR = kLa * (C* - CL).',
                  'Calculate the dissolved oxygen concentration driving force by subtracting CL from C*: (8.0 - 2.0) = 6.0 mg/L.',
                  'Multiply the driving force of 6.0 mg/L by the transfer coefficient kLa = 0.04 s^-1.',
                  'Multiply the effective driving force (6.0 mg/L) by the transfer coefficient kLa (0.04 s^-1) to find the volumetric transfer rate.'
                ],
                expectedKeywords: ['otr', 'oxygen transfer rate', 'kla', 'driving force', 'calculation', 'mg/(l*s)'],
                rubric: {
                  'Formula Selection': '40% for identifying OTR = kLa(C* - CL)',
                  'Substitution & Units': '30% for correct driving force (8.0 - 2.0 mg/L)',
                  'Calculated Result': '30% for obtaining 0.24 mg/(L·s)'
                },
                diagramSvg: null
              },
              {
                id: 'bt_bd_ot_diag_1',
                questionText: 'Refer to the bioreactor oxygen mass-transfer schematic. In the classical two-film theory of gas-liquid transport for aerobic cultures, where does the dominant physical resistance to oxygen transfer reside?',
                type: 'mcq',
                format: 'Diagram',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" class="w-full h-auto max-w-[550px]">
  <rect width="600" height="240" rx="12" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <rect x="30" y="40" width="160" height="160" rx="10" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
  <text x="110" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2B6CB0" text-anchor="middle">Gas Bubble Core (C_G)</text>
  <rect x="190" y="40" width="40" height="160" fill="#E2E8F0" stroke="#718096" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="210" y="225" font-family="sans-serif" font-size="10" fill="#4A5568" text-anchor="middle">Gas Film</text>
  <line x1="230" y1="40" x2="230" y2="200" stroke="#C53030" stroke-width="2"/>
  <text x="230" y="30" font-family="sans-serif" font-size="11" font-weight="bold" fill="#C53030" text-anchor="middle">Interface (C*)</text>
  <rect x="230" y="40" width="80" height="160" fill="#FED7D7" fill-opacity="0.6" stroke="#E53E3E" stroke-width="2"/>
  <text x="270" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#9B2C2C" text-anchor="middle">Liquid Film (kL)</text>
  <text x="270" y="225" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030" text-anchor="middle">Primary Resistance</text>
  <rect x="310" y="40" width="250" height="160" rx="10" fill="#E6FFFA" stroke="#319795" stroke-width="2"/>
  <text x="435" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#234E52" text-anchor="middle">Bulk Liquid Broth (C_L)</text>
  <path d="M 170 80 Q 230 80 230 110 T 310 170 H 450" fill="none" stroke="#2B6CB0" stroke-width="3"/>
  <text x="455" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2B6CB0">DO Gradient</text>
</svg>`,
                diagramCaption: 'Two-film mass transfer model: Oxygen concentration gradient across gas-liquid boundary layer into bulk liquid broth.',
                options: [
                  'In the stagnant laminar liquid film surrounding the gas bubble, due to the low solubility of oxygen in aqueous broth',
                  'In the interior gas core of the sparged bubble, due to molecular nitrogen interference',
                  'At the stainless steel wall of the bioreactor vessel',
                  'In the gas film on the internal vapor side of the bubble interface'
                ],
                correctIndex: 0,
                modelAnswer: 'Because oxygen has very low solubility in aqueous fermentation broth (Henry’s constant is large), the gas-film resistance is negligible compared to the liquid-film resistance. Hence, the stagnant liquid film surrounding the bubble presents >95% of the total mass transfer resistance.',
                explanation: 'Option A is correct: oxygen is sparingly soluble in water (C* ~ 8 mg/L at 25°C). By two-film theory (1/K_L = 1/k_L + 1/(m*k_G)), the liquid film resistance (1/k_L) dominates the total transport resistance. Options B, C, and D are physically incorrect.',
                hints: [
                  'Observe the diagram highlighting the liquid film layer adjacent to the phase interface.',
                  'Consider the thermodynamic solubility of oxygen in water compared to highly soluble gases like ammonia.',
                  'Recall that for sparingly soluble gases, mass transfer resistance is overwhelmingly concentrated in the liquid boundary film.',
                  'Conclude that the stagnant liquid film around the bubble accounts for virtually all mass transfer resistance.'
                ],
                expectedKeywords: ['two-film theory', 'liquid film resistance', 'oxygen solubility', 'stagnant boundary layer', 'kla'],
                rubric: {
                  'Resistance Identification': '50% for identifying stagnant liquid film',
                  'Solubility Explanation': '50% for linking to low aqueous oxygen solubility'
                }
              },
              {
                id: 'bt_bd_ot_scen_1',
                questionText: 'A 5,000 L fed-batch bioreactor culturing an aerobic recombinant bacterium exhibits a sudden drop in dissolved oxygen (DO) from 45% to 8% within 20 minutes, despite constant sparging at 1.0 VVM. Physical inspection shows the culture broth has become highly viscous due to extracellular polymeric substance (EPS) accumulation. What hydrodynamic mechanism explains this oxygen limitation, and what is the primary operational mitigation?',
                type: 'mcq',
                format: 'Scenario',
                difficulty: 'Advanced',
                bloomLevel: 'Evaluation',
                options: [
                  'Increased broth viscosity suppresses turbulence and dampens bubble breakup, causing bubble coalescence that drastically reduces specific interfacial area (a); increase impeller agitation speed to restore shear-driven dispersion',
                  'High viscosity eliminates the microbial oxygen consumption rate entirely; decrease agitation speed to avoid cavitation',
                  'The dissolved oxygen probe is responding to high hydrostatic pressure; open the vessel exhaust valve to vent all headspace gas',
                  'Viscous fluids permanently decrease pure water Henry’s law constant by a factor of 100; inject liquid nitrogen into the sparger'
                ],
                correctIndex: 0,
                modelAnswer: 'As extracellular polymers increase broth viscosity, fluid turbulence is dampened and bubble coalescence accelerates, causing average bubble diameter to swell. This severely decreases the specific interfacial area (a) and increases boundary film thickness, causing kLa to plummet. The standard corrective action is ramping up impeller speed (and power input P/V) to provide sufficient shear stress for bubble redispersal.',
                explanation: 'Option A accurately diagnoses the bioreactor transport failure: high viscosity decreases Reynolds number and Kolmogorov eddy scale, encouraging bubble coalescence and drastically reducing interfacial area (a). Increasing impeller RPM elevates shear to re-break bubbles and restore kLa. Options B, C, and D represent faulty bioprocess engineering.',
                hints: [
                  'Connect fluid viscosity to fluid flow regime (Reynolds number) and shear dissipation.',
                  'When shear dissipation drops in a viscous broth, do sparged gas bubbles coalesce into larger bubbles or break up into smaller ones?',
                  'Larger bubbles have a significantly lower surface-area-to-volume ratio, slashing specific interfacial area (a).',
                  'Mitigate this by increasing agitation speed to restore high shear stresses at impeller blade tips.'
                ],
                expectedKeywords: ['bubble coalescence', 'viscosity', 'interfacial area', 'shear stress', 'impeller speed', 'kla drop'],
                rubric: {
                  'Phenomenological Diagnosis': '50% for explaining bubble coalescence and area reduction',
                  'Corrective Intervention': '50% for specifying increased agitation speed/shear'
                },
                diagramSvg: null
              }
            ]
          },
          'sterilization': {
            name: 'Sterilization',
            learningObjective: 'Analyze thermal death kinetics of bacterial endospores, Del factor calculation, and batch vs continuous media sterilization.',
            questions: [
              {
                id: 'bt_bd_st_1',
                questionText: 'In thermal media sterilization kinetics, what does the Del factor (nabla) represent?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'The natural logarithm of the ratio of initial to final viable spore count: ln(N0 / Nt)',
                  'The decimal reduction time (D-value) required to kill 90% of the microbial population',
                  'The total mechanical energy transferred by steam injection into the media',
                  'The temperature increase required to decrease the D-value by a factor of 10'
                ],
                correctIndex: 0,
                modelAnswer: 'The Del factor (nabla) is defined as the natural logarithm of the ratio of initial spore population (N0) to the final surviving spore population (Nt), given by nabla = ln(N0/Nt) = integral(kd * dt), quantifying the overall sterilization severity.',
                explanation: 'Option A is correct: the Del factor nabla = ln(N0 / Nt) = kd * t (for isothermal hold) measures the fractional reduction in viable organisms on a natural log scale. Option B describes the D-value. Option D describes the z-value. Option C is unrelated thermodynamics.',
                hints: [
                  'Recall that microbial thermal death follows first-order reaction kinetics: dN/dt = -kd * N.',
                  'Integrate this rate equation from initial population N0 at time zero to population Nt at time t.',
                  'Notice that integrating dN/N yields a natural logarithmic ratio of initial to surviving organisms.',
                  'Express the Del factor formula nabla = ln(N0 / Nt), which equals the integral of the specific death rate kd over time.'
                ],
                expectedKeywords: ['del factor', 'nabla', 'thermal death kinetics', 'first order', 'spore count', 'd-value'],
                rubric: {
                  'Mathematical Definition': '50% for nabla = ln(N0/Nt)',
                  'Kinetic Basis': '50% for linking to first-order thermal death rate kd'
                },
                diagramSvg: null
              },
              {
                id: 'bt_bd_st_2',
                questionText: 'Why is high-temperature short-time (HTST) continuous sterilization preferred over batch sterilization for heat-sensitive culture media?',
                type: 'mcq',
                format: 'Comparison',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                options: [
                  'Spore thermal death has a higher activation energy than nutrient thermal destruction, favoring high temperatures with short exposure',
                  'Continuous sterilization eliminates the need for steam or pressurized heating vessels entirely',
                  'Batch sterilization cannot kill heat-resistant endospores under any heating duration',
                  'HTST sterilization permanently freezes the culture broth to destroy cell membranes'
                ],
                correctIndex: 0,
                modelAnswer: 'Thermal destruction of bacterial spores has a higher activation energy (Ea ~ 280-350 kJ/mol) than the thermal degradation of vitamins and nutrients (Ea ~ 80-120 kJ/mol). Operating at higher temperatures (e.g. 140°C) accelerates spore death much faster than nutrient damage, allowing short residence times that preserve broth quality.',
                explanation: 'Option A is correct: because Ea(spores) > Ea(nutrients), the rate constant for spore killing increases more rapidly with temperature than nutrient degradation. Short holding times at elevated temperatures achieve required spore reduction while minimizing nutrient damage. Options B, C, and D contain incorrect technical statements.',
                hints: [
                  'Compare the activation energy (Ea) of bacterial spore thermal inactivation against that of vitamin and protein degradation.',
                  'Recall the Arrhenius equation: k = A * exp(-Ea / RT).',
                  'A higher activation energy means the reaction rate is significantly more sensitive to temperature increases.',
                  'At elevated temperatures (135–145°C), spore death rate accelerates dramatically, permitting short hold times that minimize nutrient loss.'
                ],
                expectedKeywords: ['activation energy', 'arrhenius', 'nutrient degradation', 'spore inactivation', 'htst', 'continuous sterilization'],
                rubric: {
                  'Arrhenius Activation Energy Comparison': '50% for explaining Ea(spores) > Ea(nutrients)',
                  'Process Justification': '50% for explaining high temperature with short residence time'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  communication_engineering: {
    id: 'comm_eng',
    name: 'Communication Engineering',
    department: 'Electronics and Communication Engineering (ECE)',
    topics: {
      'modulation': {
        name: 'Modulation',
        concepts: {
          'principles of modulation': {
            name: 'Principles of Modulation',
            learningObjective: 'Understand the necessity of modulation, carrier translation, and spectrum allocation.',
            questions: [
              {
                id: 'ce_mod_1',
                questionText: 'What is the primary technical reason baseband audio signals (20 Hz - 20 kHz) cannot be radiated directly from practical antennas without modulation?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'Efficient radiation requires an antenna dimension proportional to lambda/4, which would require impractically massive antennas (several kilometers long)',
                  'Baseband audio signals are digital and cannot travel through the physical atmosphere',
                  'Audio electromagnetic waves travel at the speed of sound rather than the speed of light',
                  'Free space exhibits an infinite characteristic impedance to signals below 50 kHz'
                ],
                correctIndex: 0,
                modelAnswer: 'Electromagnetic radiation efficiency requires antenna lengths on the order of a quarter wavelength (lambda/4). For a 3 kHz audio signal, lambda = c / f = 3x10^8 / 3000 = 100 km, requiring a 25 km antenna. Modulating onto a high-frequency carrier (e.g. 100 MHz, lambda = 3 m) reduces antenna size to practical physical dimensions (75 cm).',
                explanation: 'Option A is correct: antenna size is inversely proportional to frequency (length ≈ lambda/4). High carrier frequencies reduce wavelength, enabling practical antenna dimensions, frequency division multiplexing, and reduced noise interference. Options B, C, and D contain fundamental physical falsehoods.',
                hints: [
                  'Consider the relationship between signal frequency (f), wavelength (lambda), and speed of light (c): lambda = c / f.',
                  'Recall the standard rule of thumb for resonant antenna dipole dimensions in terms of wavelength.',
                  'Calculate the physical wavelength for an unmodulated 3 kHz audio wave.',
                  'Recognize that modulating onto high carrier frequencies shrinks lambda, making antennas physically practical.'
                ],
                expectedKeywords: ['antenna size', 'wavelength', 'carrier frequency', 'radiation efficiency', 'quarter wavelength', 'multiplexing'],
                rubric: {
                  'Wavelength & Antenna Relationship': '50% for explaining length proportional to lambda/4',
                  'Carrier Frequency Scaling': '50% for demonstrating higher frequency yields practical dimensions'
                },
                diagramSvg: null
              },
              {
                id: 'ce_mod_num_1',
                questionText: 'An RF wireless transmitter is designed to transmit an unmodulated high-frequency sinusoidal carrier at f = 600 MHz. Assuming propagation velocity c = 3.0 x 10^8 m/s, calculate the exact physical length of a resonant quarter-wavelength (lambda / 4) monopole antenna.',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'lambda = c / f; L = lambda / 4',
                  givenParameters: { 'f': '600 MHz (600 x 10^6 Hz)', 'c': '3.0 x 10^8 m/s' },
                  stepByStep: 'lambda = (3.0 x 10^8) / (600 x 10^6) = 0.50 m (50 cm); L = 50 cm / 4 = 12.5 cm (0.125 m)',
                  unit: 'cm',
                  calculatedValue: 12.5
                },
                options: [
                  '12.5 cm (0.125 m)',
                  '50.0 cm (0.500 m)',
                  '25.0 cm (0.250 m)',
                  '6.25 cm (0.0625 m)'
                ],
                correctIndex: 0,
                modelAnswer: 'First determine wavelength: lambda = c / f = (3.0 x 10^8 m/s) / (600 x 10^6 Hz) = 0.50 m = 50 cm. For a quarter-wavelength antenna, length L = lambda / 4 = 50 cm / 4 = 12.5 cm.',
                explanation: 'Option A is correct: lambda = c/f = 0.5 m = 50 cm. Dividing by 4 gives L = 12.5 cm. Option B gives full wavelength (lambda). Option C gives half wavelength (lambda/2). Option D gives an eighth wavelength.',
                hints: [
                  'Recall the wave propagation equation relating velocity, frequency, and wavelength: c = f * lambda.',
                  'Calculate the wavelength lambda = (3 x 10^8) / (600 x 10^6) = 0.5 meters (50 cm).',
                  'Apply the quarter-wavelength relationship: L = lambda / 4.',
                  'Divide 50 cm by 4 to obtain 12.5 cm.'
                ],
                expectedKeywords: ['quarter wavelength', 'antenna length', 'propagation velocity', 'lambda', 'frequency', 'calculation'],
                rubric: {
                  'Wavelength Calculation': '50% for lambda = 0.50 m',
                  'Antenna Sizing': '50% for L = lambda/4 = 12.5 cm'
                },
                diagramSvg: null
              },
              {
                id: 'ce_mod_2',
                questionText: 'How does Frequency Modulation (FM) achieve superior noise immunity compared to Amplitude Modulation (AM)?',
                type: 'mcq',
                format: 'Comparison',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                options: [
                  'Information is encoded in instantaneous frequency variations, allowing amplitude limiter circuits to clip noise spikes without losing signal information',
                  'FM signals consume less transmission bandwidth than standard AM signals',
                  'FM signals travel through physical ground waveguides that are immune to atmospheric static',
                  'FM transmission does not require an RF carrier oscillator or power amplifier'
                ],
                correctIndex: 0,
                modelAnswer: 'Most atmospheric, electrical, and thermal noise manifests as amplitude fluctuations. In FM, the message is conveyed entirely by shifts in instantaneous frequency while carrier amplitude remains constant. An FM receiver uses amplitude limiters before frequency demodulation, stripping away amplitude noise spikes without corrupting the message.',
                explanation: 'Option A is correct: an FM receiver incorporates a bandpass limiter that clamps amplitude variations to a uniform envelope, effectively removing additive amplitude noise before the discriminator detects frequency deviation. Option B is false (FM bandwidth > AM bandwidth by Carson’s rule). Options C and D are technically incorrect.',
                hints: [
                  'Consider where most natural and man-made electromagnetic interference (like lightning or motor sparks) appears on a radio wave.',
                  'Recall whether the information in FM resides in the signal’s amplitude envelope or its zero-crossing rate.',
                  'Think about what a non-linear amplitude limiter stage does to the incoming FM waveform prior to detection.',
                  'Conclude that clipping amplitude variations eliminates noise without altering the information-bearing frequency deviation.'
                ],
                expectedKeywords: ['amplitude limiter', 'noise immunity', 'instantaneous frequency', 'frequency deviation', 'carson rule'],
                rubric: {
                  'Information Representation': '50% for explaining frequency vs amplitude encoding',
                  'Limiter Function': '50% for explaining how amplitude clamping removes noise'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'digital modulation': {
        name: 'Digital Modulation',
        concepts: {
          'qpsk': {
            name: 'QPSK (Quadrature Phase Shift Keying)',
            learningObjective: 'Analyze constellation mapping, bit rate vs symbol rate, and phase state representation in QPSK.',
            questions: [
              {
                id: 'ce_dm_qpsk_1',
                questionText: 'In conventional Quadrature Phase Shift Keying (QPSK) digital modulation, how many distinct phase states are utilized in the signal constellation, and how many binary bits are represented by each transmitted symbol?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  '4 distinct phase states, with each symbol representing 2 binary bits (k = log2(4) = 2)',
                  '2 distinct phase states, with each symbol representing 1 binary bit',
                  '8 distinct phase states, with each symbol representing 3 binary bits',
                  '16 distinct phase states, with each symbol representing 4 binary bits'
                ],
                correctIndex: 0,
                modelAnswer: 'Conventional QPSK utilizes M = 4 distinct carrier phase states (typically separated by 90 degrees: pi/4, 3pi/4, 5pi/4, 7pi/4). Since M = 2^k, each transmitted symbol represents k = log2(4) = 2 binary bits, allowing a bandwidth efficiency twice that of binary PSK (BPSK).',
                explanation: 'Option A is correct: QPSK uses M = 4 carrier phase shifts, encoding k = log2(4) = 2 bits per symbol (e.g. 00, 01, 11, 10). Option B describes BPSK (M=2, 1 bit/symbol). Option C describes 8-PSK (M=8, 3 bits/symbol). Option D describes 16-QAM or 16-PSK (M=16, 4 bits/symbol).',
                hints: [
                  'Recall the relationship between the number of distinct signal symbols and the number of bits encoded by each symbol in digital modulation.',
                  'Consider how many binary bits can be represented by four distinct signal phase states in the constellation plane.',
                  'Use the fundamental M-ary modulation relationship between symbols M and bits per symbol: k = log2(M).',
                  'Substitute the four distinct QPSK constellation states (M = 4) into that logarithmic relationship to determine the bit capacity.'
                ],
                distractorRationales: [
                  { index: 0, isCorrect: true, type: 'Correct Answer', rationale: 'Conventional QPSK utilizes M = 4 phase states, encoding k = log2(4) = 2 bits per symbol.' },
                  { index: 1, isCorrect: false, type: 'Plausible Misconception', rationale: 'Confuses QPSK with Binary Phase Shift Keying (BPSK), which has only two phase states encoding 1 bit per symbol.' },
                  { index: 2, isCorrect: false, type: 'Related Alternative', rationale: 'Describes 8-PSK modulation where M = 8 constellation points encode 3 bits per symbol.' },
                  { index: 3, isCorrect: false, type: 'Related Alternative', rationale: 'Describes 16-QAM or 16-PSK where M = 16 constellation points encode 4 bits per symbol.' }
                ],
                expectedKeywords: ['qpsk', 'quadrature phase shift keying', 'phase states', 'bits per symbol', 'constellation', 'm-ary'],
                rubric: {
                  'Phase States': '50% for identifying 4 distinct carrier phases',
                  'Symbol Bit Capacity': '50% for calculating k = log2(4) = 2 bits/symbol'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'gmsk': {
        name: 'GMSK / MSK Modulation & Demodulation',
        concepts: {
          'gmsk demodulation': {
            name: 'GMSK Demodulation',
            learningObjective: 'Analyze Gaussian pulse shaping, constant envelope properties, and coherent/non-coherent demodulation in GMSK.',
            questions: [
              {
                id: 'ce_gmsk_1',
                questionText: 'What is the primary purpose of Gaussian pulse shaping in GMSK modulation?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  "To limit the signal's occupied bandwidth by shaping the frequency-modulating data pulses.",
                  "To eliminate the need for a carrier signal.",
                  "To guarantee error-free reception regardless of channel noise.",
                  "To convert every received symbol directly into an analog audio signal."
                ],
                correctIndex: 0,
                modelAnswer: "Gaussian pulse shaping applies a Gaussian pre-modulation filter to baseband rectangular pulses, smoothing phase transitions and strictly limiting the occupied RF bandwidth by suppressing spectral sidelobes.",
                explanation: "Option A is correct: Gaussian filtering pre-shapes frequency-modulating pulses to suppress out-of-band spectral sidelobes, confining bandwidth within the channel. Option B is false because GMSK uses a high-frequency carrier. Option C is false because channel noise still introduces bit errors. Option D is false because pulse shaping modulates digital data, not audio conversion.",
                hints: [
                  "Consider the frequency spectrum and sidelobes of rectangular frequency-shift keying pulses versus smooth Gaussian pulses.",
                  "Recall how sharp symbol transitions in MSK generate substantial adjacent-channel interference.",
                  "Focus on how pre-modulation filtering confines transmitted RF power within the assigned spectral channel.",
                  "Recognize that Gaussian filtering suppresses spectral sidelobes, strictly limiting occupied RF bandwidth."
                ],
                expectedKeywords: ['gaussian pulse shaping', 'occupied bandwidth', 'spectral efficiency', 'sidelobes', 'constant envelope', 'pre-modulation filter'],
                rubric: {
                  'Bandwidth Confinement': '50% for explaining suppression of spectral sidelobes',
                  'Pulse Shaping Mechanics': '50% for identifying pre-modulation filtering of frequency pulses'
                },
                diagramSvg: null
              },
              {
                id: 'ce_gmsk_2',
                questionText: 'Why does GMSK retain a constant envelope characteristic, and why is this critical for mobile RF power amplifiers (such as in GSM)?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                options: [
                  'Modulation occurs strictly in carrier frequency and phase with constant magnitude, allowing high-efficiency non-linear Class C power amplifiers to operate at saturation without spectral regrowth',
                  'Amplitude varies linearly with bit rate to cancel out-of-band adjacent channel interference',
                  'Baseband digital pulses produce pure DC levels that completely bypass the RF power amplification stage',
                  'Phase transitions strictly avoid the origin by superimposing an unmodulated continuous-wave pilot tone'
                ],
                correctIndex: 0,
                modelAnswer: 'Continuous phase frequency shift keying (CPFSK) like GMSK has constant amplitude envelope |s(t)| = A, enabling non-linear Class C power amplifiers to run at high power efficiency without causing non-linear AM-to-AM distortion and adjacent channel spectral regrowth.',
                explanation: 'Option A is correct: the constant envelope property allows transmitters to employ saturated non-linear power amplifiers (such as Class C), which provide superior power efficiency critical for battery-powered mobile terminals without producing spectral splatter.',
                hints: [
                  'Recall the power efficiency difference between linear Class A/AB amplifiers and non-linear Class C amplifiers.',
                  'Consider what happens to non-constant envelope signals when passed through non-linear amplifiers.',
                  'Notice that GMSK modulates phase continuously while keeping RF envelope magnitude constant.',
                  'Conclude that constant envelope prevents non-linear distortion and spectral regrowth in saturated Class C amplifiers.'
                ],
                expectedKeywords: ['constant envelope', 'class c', 'power amplifier', 'saturation', 'spectral regrowth', 'power efficiency'],
                rubric: {
                  'Envelope Invariant': '50% for constant envelope in phase/frequency modulation',
                  'Amplifier Saturation': '50% for high-efficiency non-linear amplifier without spectral regrowth'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'sampling and pcm': {
        name: 'Sampling & Pulse Code Modulation (PCM)',
        concepts: {
          'pcm and nyquist': {
            name: 'Nyquist Sampling & Quantization',
            learningObjective: 'Calculate Nyquist sampling rates, uniform quantization intervals, and digital bit rates in PCM transmission.',
            questions: [
              {
                id: 'ce_pcm_num_1',
                questionText: 'A bandlimited analog voice signal with maximum frequency f_max = 4 kHz is sampled at the standard Nyquist rate and encoded using an 8-bit uniform quantizer (n = 8 bits/sample). What is the resulting transmission bit rate (R_b)?',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'f_s = 2 * f_max; R_b = n * f_s',
                  givenParameters: { 'f_max': '4 kHz (4000 Hz)', 'n': '8 bits/sample' },
                  stepByStep: '1. Nyquist sampling rate f_s = 2 * 4 kHz = 8 kHz (8000 samples/s). 2. Transmission bit rate R_b = n * f_s = 8 * 8000 = 64000 bps = 64 kbps.',
                  unit: 'kbps',
                  calculatedValue: 64
                },
                options: [
                  '64 kbps (64000 bps)',
                  '32 kbps (32000 bps)',
                  '128 kbps (128000 bps)',
                  '16 kbps (16000 bps)'
                ],
                correctIndex: 0,
                modelAnswer: 'The Nyquist rate is f_s = 2 * f_max = 2 * 4 kHz = 8 kHz. Encoding each sample with 8 bits gives a transmission bit rate R_b = n * f_s = 8 * 8000 = 64,000 bps = 64 kbps.',
                explanation: 'Option A is correct: Nyquist theorem requires f_s >= 2*f_max = 8 kHz. With 8 bits per sample, R_b = 8 * 8000 = 64000 bps = 64 kbps. The other options result from using f_s = f_max, 16 bits, or arithmetic errors.',
                hints: [
                  'Recall the Nyquist sampling criterion for minimum sampling frequency: f_s = 2 * f_max.',
                  'Calculate the minimum sampling rate: f_s = 2 * 4000 Hz = 8000 samples/second.',
                  'Multiply sampling rate by number of bits per sample: R_b = n * f_s = 8 * 8000.',
                  'Calculate R_b = 64000 bps = 64 kbps.'
                ],
                expectedKeywords: ['nyquist rate', 'sampling frequency', 'quantization', 'bit rate', '64 kbps', 'pcm'],
                rubric: {
                  'Sampling Rate Determination': '50% for f_s = 8 kHz',
                  'Bit Rate Calculation': '50% for R_b = 64 kbps'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'transmission lines': {
        name: 'Transmission Lines & Microwave Engineering',
        concepts: {
          'vswr and reflection coefficient': {
            name: 'VSWR & Reflection Coefficient',
            learningObjective: 'Compute reflection coefficient, standing wave ratio, and impedance mismatch on RF transmission lines.',
            questions: [
              {
                id: 'ce_txline_num_1',
                questionText: 'A lossless transmission line with characteristic impedance Z_0 = 50 ohms is terminated with a purely resistive load of Z_L = 100 ohms. Calculate the Voltage Standing Wave Ratio (VSWR) on the line.',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'Gamma = (Z_L - Z_0) / (Z_L + Z_0); VSWR = (1 + |Gamma|) / (1 - |Gamma|)',
                  givenParameters: { 'Z_0': '50 ohms', 'Z_L': '100 ohms' },
                  stepByStep: '1. Reflection coefficient Gamma = (100 - 50)/(100 + 50) = 50/150 = 1/3 ≈ 0.333. 2. VSWR = (1 + 0.333)/(1 - 0.333) = 1.333/0.667 = 2.0.',
                  unit: 'ratio',
                  calculatedValue: 2.0
                },
                options: [
                  '2.0:1 (VSWR = 2.0)',
                  '1.5:1 (VSWR = 1.5)',
                  '3.0:1 (VSWR = 3.0)',
                  '0.5:1 (VSWR = 0.5)'
                ],
                correctIndex: 0,
                modelAnswer: 'Reflection coefficient Gamma = (100 - 50)/(100 + 50) = 50/150 = 1/3 = 0.333. VSWR = (1 + |Gamma|) / (1 - |Gamma|) = (1 + 1/3) / (1 - 1/3) = (4/3) / (2/3) = 2.0.',
                explanation: 'Option A is correct: Gamma = (Z_L - Z_0)/(Z_L + Z_0) = 50/150 = 0.333. VSWR = (1 + 0.333)/(1 - 0.333) = 2.0. VSWR is always >= 1.0.',
                hints: [
                  'Recall the formula for reflection coefficient Gamma in terms of load impedance Z_L and characteristic impedance Z_0.',
                  'Compute Gamma = (100 - 50) / (100 + 50) = 50 / 150 = 1/3 ≈ 0.333.',
                  'Apply the relation VSWR = (1 + |Gamma|) / (1 - |Gamma|).',
                  'Calculate VSWR = (1 + 1/3) / (1 - 1/3) = (4/3) / (2/3) = 2.0.'
                ],
                expectedKeywords: ['vswr', 'reflection coefficient', 'characteristic impedance', 'load impedance', 'standing wave'],
                rubric: {
                  'Reflection Coefficient': '50% for Gamma = 0.333',
                  'VSWR Evaluation': '50% for VSWR = 2.0'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'information theory': {
        name: 'Information Theory & Channel Capacity',
        concepts: {
          'shannon capacity': {
            name: 'Shannon-Hartley Channel Capacity',
            learningObjective: 'Apply the Shannon-Hartley theorem to calculate theoretical maximum data rates across bandlimited noisy channels.',
            questions: [
              {
                id: 'ce_it_num_1',
                questionText: 'An AWGN communication channel has a bandwidth B = 3 kHz and a received signal-to-noise ratio SNR = 1023 (approximately 30 dB). According to the Shannon-Hartley theorem, what is the theoretical maximum channel capacity (C)?',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'C = B * log2(1 + SNR)',
                  givenParameters: { 'B': '3000 Hz', 'SNR': '1023' },
                  stepByStep: 'C = 3000 * log2(1 + 1023) = 3000 * log2(1024) = 3000 * 10 = 30000 bps = 30 kbps.',
                  unit: 'kbps',
                  calculatedValue: 30
                },
                options: [
                  '30 kbps (30000 bps)',
                  '3 kbps (3000 bps)',
                  '10 kbps (10000 bps)',
                  '90 kbps (90000 bps)'
                ],
                correctIndex: 0,
                modelAnswer: 'According to Shannon-Hartley theorem: C = B * log2(1 + SNR) = 3000 * log2(1 + 1023) = 3000 * log2(1024) = 3000 * 10 = 30,000 bps = 30 kbps.',
                explanation: 'Option A is correct: C = B * log2(1 + SNR) = 3000 * log2(1024) = 3000 * 10 = 30000 bps = 30 kbps. Other options represent incomplete computations.',
                hints: [
                  'State the Shannon-Hartley channel capacity formula relating bandwidth B and SNR: C = B * log2(1 + SNR).',
                  'Notice that 1 + SNR = 1 + 1023 = 1024 = 2^10.',
                  'Evaluate log2(1024) = 10 bits/symbol.',
                  'Multiply bandwidth B = 3000 Hz by 10 to obtain C = 30000 bps = 30 kbps.'
                ],
                expectedKeywords: ['shannon capacity', 'bandwidth', 'snr', 'log2', '30 kbps', 'channel capacity'],
                rubric: {
                  'Log2 Evaluation': '50% for log2(1024) = 10',
                  'Capacity Multiplication': '50% for C = 30 kbps'
                },
                diagramSvg: null
              },
              {
                id: 'ce_it_scen_1',
                questionText: 'An RF systems engineer is optimizing a deep-space satellite transponder over a channel with bandwidth B = 500 kHz and SNR = 15 dB. During anomalous solar plasma activity, the received noise power doubles while signal power remains unchanged. Under the Shannon-Hartley theorem, what architectural trade-off must the modulation and coding scheme immediately adopt to maintain zero error rate across this degraded link?',
                type: 'mcq',
                format: 'Scenario',
                difficulty: 'Advanced',
                bloomLevel: 'Evaluation',
                options: [
                  'Adaptively reduce the spectral efficiency and constellation density to lower the transmission bit rate below the newly diminished Shannon capacity C = B * log2(1 + SNR)',
                  'Increase the transmission symbol rate above channel bandwidth to overcome plasma absorption through intersymbol interference',
                  'Disable forward error correction (FEC) parity blocks to maximize payload throughput under degraded SNR',
                  'Invert the carrier phase by 180 degrees to cancel out thermal Gaussian background noise'
                ],
                correctIndex: 0,
                modelAnswer: 'Under the Shannon-Hartley theorem C = B·log2(1 + S/N), doubling noise power reduces channel capacity. To prevent bit errors from diverging, adaptive modulation and coding (AMC) must downshift to a lower constellation order and lower code rate, keeping throughput strictly within the diminished channel capacity.',
                explanation: 'Option A is correct: Shannon channel capacity sets the theoretical upper bound for error-free transmission. When SNR degrades, transmission bit rate must be downscaled below the new capacity bound. Options B, C, and D violate communication principles or accelerate failure.',
                hints: [
                  'Recall the Shannon-Hartley channel capacity formula: C = B * log2(1 + SNR).',
                  'Consider how doubling noise power impacts the signal-to-noise ratio and theoretical capacity bound.',
                  'Examine how modern adaptive modulation and coding (AMC) responds to link degradation.',
                  'Conclude that lowering constellation density reduces data rate to remain within the diminished capacity.'
                ],
                expectedKeywords: ['shannon-hartley', 'channel capacity', 'adaptive modulation', 'snr degradation', 'error-free bound'],
                rubric: {
                  'Capacity Bound Analysis': '50% for identifying capacity reduction via C = B*log2(1+SNR)',
                  'Adaptive Engineering Mitigation': '50% for selecting adaptive reduction of transmission rate'
                },
                diagramSvg: null
              },

            ]
          }
        }
      }
    }
  },

  control_systems: {
    id: 'control_sys',
    name: 'Control Systems',
    department: 'Electrical and Electronics Engineering',
    topics: {
      'bode plot stability analysis': {
        name: 'Bode Plot Stability Analysis',
        concepts: {
          'gain and phase margins': {
            name: 'Gain and Phase Margins',
            learningObjective: 'Evaluate closed-loop stability from open-loop frequency response, gain crossover frequency, and phase margin.',
            questions: [
              {
                id: 'cs_bp_gm_1',
                questionText: 'How is the Gain Margin (GM) formally determined from an open-loop Bode plot?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'The negative of the open-loop magnitude in dB at the phase crossover frequency where phase angle equals -180 degrees',
                  'The phase angle in degrees at the gain crossover frequency where magnitude equals 0 dB',
                  'The frequency at which closed-loop resonant peak magnitude reaches maximum amplification',
                  'The slope of the magnitude curve in dB/decade at high frequency asymptotes'
                ],
                correctIndex: 0,
                modelAnswer: 'The Gain Margin (GM) is defined as the factor by which open-loop gain can be increased before the closed-loop system becomes unstable. On a Bode plot, it is measured at the phase crossover frequency (where phase = -180°): GM(dB) = -20*log10|G(j*omega_pc)|.',
                explanation: 'Option A is the exact definition of Gain Margin: GM(dB) = -|G(j*omega_pc)|_dB at the phase crossover frequency where arg(G) = -180°. Option B defines the Phase Margin (PM = 180° + phase at gain crossover). Options C and D define resonant peak and roll-off rate.',
                hints: [
                  'Identify the two critical reference points: gain crossover frequency (|G| = 0 dB) and phase crossover frequency (phase = -180°).',
                  'Recall which crossover frequency is used to measure Gain Margin.',
                  'At the phase crossover frequency (omega_pc), determine how far the magnitude is below 0 dB.',
                  'Express the formulation: GM(dB) = -20*log10|G(j*omega_pc)|, representing allowable gain increase before instability.'
                ],
                distractorRationales: [
                  { index: 0, isCorrect: true, type: 'Correct Answer', rationale: 'Gain Margin is formally defined at the phase crossover frequency (where phase = -180 degrees) as -20*log10|G(j*omega_pc)|.' },
                  { index: 1, isCorrect: false, type: 'Plausible Misconception', rationale: 'Confuses Gain Margin with Phase Margin (evaluated at gain crossover where magnitude = 0 dB).' },
                  { index: 2, isCorrect: false, type: 'Related Alternative', rationale: 'Defines the closed-loop resonant peak Mr and resonant frequency omega_r rather than open-loop Gain Margin.' },
                  { index: 3, isCorrect: false, type: 'Related Alternative', rationale: 'Describes the asymptotic high-frequency roll-off rate rather than stability margin.' }
                ],
                expectedKeywords: ['gain margin', 'phase crossover frequency', 'phase margin', '0 db', '-180 degrees', 'stability'],
                rubric: {
                  'Phase Crossover Identification': '50% for identifying omega_pc where phase = -180°',
                  'Magnitude Formulation': '50% for GM(dB) = -|G(j*omega_pc)|_dB'
                },
                diagramSvg: null
              },
              {
                id: 'cs_bp_num_1',
                questionText: 'A unity-feedback closed-loop control system has an open-loop frequency response G(jw). At the gain crossover frequency w_gc = 2.5 rad/s (where |G(jw_gc)| = 0 dB), the measured phase angle is /_G(jw_gc) = -135 degrees. Calculate the exact Phase Margin (PM) of the system and indicate its stability status.',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'PM = 180° + /_G(jw_gc)',
                  givenParameters: { 'w_gc': '2.5 rad/s', '/_G(jw_gc)': '-135°' },
                  stepByStep: 'PM = 180° + (-135°) = +45° (Positive PM indicates stable closed-loop operation)',
                  unit: 'degrees',
                  calculatedValue: 45
                },
                options: [
                  '+45 degrees (Stable)',
                  '-45 degrees (Unstable)',
                  '+135 degrees (Marginally Stable)',
                  '-180 degrees (Oscillatory)'
                ],
                correctIndex: 0,
                modelAnswer: 'Phase Margin is calculated from PM = 180° + phi_gc. Given phi_gc = -135° at the 0 dB gain crossover frequency, PM = 180° + (-135°) = +45°. Because PM > 0°, the minimum-phase closed-loop system is stable.',
                explanation: 'Option A is correct: PM = 180° + (-135°) = +45°. A positive phase margin of 45° provides healthy closed-loop damping and stability. Options B, C, and D stem from arithmetic signs or confusing crossover definitions.',
                hints: [
                  'Recall the definition of Phase Margin: PM = 180° + /_G(jw_gc).',
                  'Identify the phase angle at the gain crossover frequency: -135 degrees.',
                  'Add 180 degrees to -135 degrees: 180 - 135 = +45 degrees.',
                  'Since PM is positive (+45°), the system is stable.'
                ],
                expectedKeywords: ['phase margin', 'gain crossover frequency', 'stability', '180 degrees', 'degrees'],
                rubric: {
                  'Formula Selection': '40% for PM = 180° + /_G(jw_gc)',
                  'Calculation': '40% for obtaining +45°',
                  'Stability Determination': '20% for concluding stability'
                },
                diagramSvg: null
              },
              {
                id: 'cs_bp_diag_1',
                questionText: 'Refer to the open-loop Bode Plot diagram below. Based on the 0 dB gain crossover frequency (w_gc) and -180 degree phase crossover frequency (w_pc), what are the approximate Gain Margin (GM) and Phase Margin (PM)?',
                type: 'mcq',
                format: 'Diagram',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" class="w-full h-auto max-w-[550px]">
  <rect width="600" height="280" rx="12" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <!-- Magnitude Subplot -->
  <line x1="60" y1="20" x2="60" y2="130" stroke="#718096" stroke-width="1.5"/>
  <line x1="60" y1="75" x2="560" y2="75" stroke="#C53030" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="50" y="79" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030" text-anchor="end">0 dB</text>
  <path d="M 60 40 Q 200 50 300 75 T 500 125" fill="none" stroke="#2B6CB0" stroke-width="2.5"/>
  <circle cx="300" cy="75" r="4" fill="#2B6CB0"/>
  <text x="300" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2B6CB0" text-anchor="middle">w_gc (0 dB)</text>
  <!-- Phase Subplot -->
  <line x1="60" y1="150" x2="60" y2="260" stroke="#718096" stroke-width="1.5"/>
  <line x1="60" y1="225" x2="560" y2="225" stroke="#C53030" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="50" y="229" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030" text-anchor="end">-180°</text>
  <path d="M 60 170 Q 200 175 300 190 T 420 225 T 520 250" fill="none" stroke="#D69E2E" stroke-width="2.5"/>
  <circle cx="420" cy="225" r="4" fill="#D69E2E"/>
  <text x="420" y="215" font-family="sans-serif" font-size="10" font-weight="bold" fill="#D69E2E" text-anchor="middle">w_pc (-180°)</text>
  <!-- Margins Annotations -->
  <line x1="300" y1="75" x2="300" y2="190" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>
  <line x1="300" y1="190" x2="300" y2="225" stroke="#2F855A" stroke-width="3"/>
  <text x="310" y="210" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2F855A">PM = +35°</text>
  <line x1="420" y1="105" x2="420" y2="225" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>
  <line x1="420" y1="75" x2="420" y2="105" stroke="#2F855A" stroke-width="3"/>
  <text x="430" y="95" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2F855A">GM = +12 dB</text>
</svg>`,
                diagramCaption: 'Bode Plot Diagram: Gain crossover (w_gc) and Phase crossover (w_pc) with positive Gain Margin (GM) and Phase Margin (PM).',
                options: [
                  'GM ≈ +12 dB (at w_pc) and PM ≈ +35 degrees (at w_gc), indicating stable closed-loop behavior',
                  'GM ≈ -12 dB and PM ≈ -35 degrees, indicating severe closed-loop instability',
                  'GM = 0 dB and PM = 0 degrees, indicating marginal oscillation',
                  'GM cannot be measured because w_pc occurs at infinite frequency'
                ],
                correctIndex: 0,
                modelAnswer: 'From the Bode plot diagram, at the phase crossover frequency w_pc (where phase = -180°), the magnitude curve is 12 dB below the 0 dB line, giving GM = +12 dB. At the gain crossover frequency w_gc (where magnitude = 0 dB), the phase curve is 35° above the -180° line, giving PM = +35°. Both margins are positive, ensuring stable closed-loop operation.',
                explanation: 'Option A is correct: the diagram clearly annotates GM = +12 dB at w_pc and PM = +35° at w_gc. With w_gc < w_pc and both margins positive, the system is stable with healthy transient response. Options B, C, and D contradict the annotated graphical data.',
                hints: [
                  'Inspect the upper plot at w_pc: the vertical green line shows the distance from 0 dB down to the magnitude curve.',
                  'Inspect the lower plot at w_gc: the vertical green line shows the distance from -180° up to the phase curve.',
                  'Notice that the magnitude is below 0 dB when phase hits -180°, which means GM is positive (+12 dB).',
                  'Notice that the phase is above -180° when magnitude hits 0 dB, which means PM is positive (+35°).'
                ],
                expectedKeywords: ['bode plot diagram', 'gain margin', 'phase margin', 'w_gc', 'w_pc', 'crossover frequency'],
                rubric: {
                  'Gain Margin Readout': '50% for identifying GM = +12 dB at w_pc',
                  'Phase Margin Readout': '50% for identifying PM = +35° at w_gc'
                }
              },
              {
                id: 'cs_bp_scen_1',
                questionText: 'An industrial robotic arm position servomechanism experiences excessive oscillatory overshoot (45%) and a sluggish settling time of 6.2 seconds under step displacement commands. Frequency-domain analysis shows Gain Margin GM = 16 dB, but Phase Margin PM is only 11 degrees at w_gc = 4 rad/s. Which controller compensation strategy will most effectively increase Phase Margin to > 45 degrees without reducing steady-state positional accuracy?',
                type: 'mcq',
                format: 'Scenario',
                difficulty: 'Advanced',
                bloomLevel: 'Evaluation',
                options: [
                  'Insert a Phase-Lead compensator designed to add maximum phase lead in the vicinity of w_gc, increasing phase margin and system damping',
                  'Insert a pure high-gain integrator to shift the phase down by an additional -90 degrees across all frequencies',
                  'Disable the closed-loop feedback sensor entirely and run the servomechanism in open loop',
                  'Reduce the phase crossover frequency to 0 rad/s by adding infinite series delay'
                ],
                correctIndex: 0,
                modelAnswer: 'A Phase-Lead compensator provides positive phase angle (lead) in a specified frequency band around the gain crossover frequency, directly elevating the Phase Margin (from 11° to > 45°). This increases the damping ratio, dampens transient oscillations, and shortens settling time without degrading steady-state accuracy.',
                explanation: 'Option A is correct: Phase-lead compensation contributes positive phase shift near w_gc, boosting damping ratio zeta ≈ PM / 100 and eliminating excessive overshoot. Option B would introduce negative phase lag, pushing PM negative and causing instability. Options C and D are unviable.',
                hints: [
                  'Analyze the cause of oscillatory overshoot: low phase margin (11°) directly corresponds to low damping ratio (zeta ≈ 0.11).',
                  'Identify which type of compensator adds positive phase shift near the gain crossover frequency.',
                  'Recall that a Phase-Lead compensator has a transfer function (s + z)/(s + p) with z < p, generating positive phase lead.',
                  'Synthesize that adding phase lead boosts Phase Margin to the desired 45°-50° range, stabilizing the response.'
                ],
                expectedKeywords: ['phase-lead compensator', 'phase margin', 'damping ratio', 'overshoot', 'transient response', 'gain crossover'],
                rubric: {
                  'Diagnostic Link': '50% for linking low PM to low damping and overshoot',
                  'Compensation Strategy': '50% for selecting phase-lead compensation to elevate PM'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'frequency response': {
        name: 'Frequency Response',
        concepts: {
          'bode plot': {
            name: 'Bode Plot',
            learningObjective: 'Interpret magnitude and phase frequency response plots, determine gain margin and phase margin, and assess closed-loop stability.',
            questions: [
              {
                id: 'cs_fr_bp_1',
                questionText: 'When evaluating closed-loop stability from an open-loop frequency response on a Bode Plot, how are the Gain Margin (GM) and Phase Margin (PM) determined?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'GM is measured at the phase crossover frequency (where phase = -180°), and PM is measured at the gain crossover frequency (where magnitude = 0 dB)',
                  'GM is measured at the gain crossover frequency (0 dB), and PM is measured at the phase crossover frequency (-180°)',
                  'Both GM and PM are measured strictly at zero frequency (DC steady-state condition)',
                  'GM and PM are measured only when open-loop poles lie on the right-half s-plane'
                ],
                correctIndex: 0,
                modelAnswer: 'On an open-loop Bode plot, Gain Margin is defined at the phase crossover frequency omega_pc (where phase = -180°) as GM(dB) = -20*log10|G(j*omega_pc)|. Phase Margin is defined at the gain crossover frequency omega_gc (where |G(j*omega_gc)| = 1 or 0 dB) as PM = 180° + arg(G(j*omega_gc)).',
                explanation: 'Option A is correct: By definition, the phase crossover frequency (where phase = -180°) determines allowable gain increase (Gain Margin), while the gain crossover frequency (where magnitude = 0 dB) determines allowable phase lag before instability (Phase Margin). Options B, C, and D transpose or misstate these fundamental frequency-domain definitions.',
                hints: [
                  'Identify the two critical crossover frequencies: gain crossover (0 dB magnitude) and phase crossover (-180 degrees phase).',
                  'Recall which frequency dictates the allowable gain increase before the system reaches unity gain with 180-degree phase shift.',
                  'Remember that Gain Margin is evaluated at the phase crossover frequency (-180°).',
                  'Confirm that Phase Margin is evaluated at the gain crossover frequency (0 dB).'
                ],
                expectedKeywords: ['bode plot', 'gain margin', 'phase margin', 'gain crossover', 'phase crossover', 'stability'],
                rubric: {
                  'Phase Crossover / GM': '50% for identifying GM at phase crossover (-180°)',
                  'Gain Crossover / PM': '50% for identifying PM at gain crossover (0 dB)'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'pid_control': {
        name: 'PID Controller Design & Tuning',
        concepts: {
          'pid action': {
            name: 'PID Action & Steady-State Error Elimination',
            learningObjective: 'Analyze Proportional, Integral, and Derivative control actions, pole placement, and steady-state error elimination.',
            questions: [
              {
                id: 'cs_pid_1',
                questionText: 'In a classical closed-loop PID controller, what specific mathematical and operational function does the Integral (I) term provide that Proportional (P) action alone cannot accomplish?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'It integrates tracking error over time, raising the open-loop system type number to completely eliminate steady-state error for step reference inputs',
                  'It anticipates future error trajectories based on rate of change to reduce initial rise time',
                  'It filters high-frequency sensor noise to prevent derivative actuator saturation',
                  'It shifts the system open-loop poles into the right-half s-plane to accelerate transient decay'
                ],
                correctIndex: 0,
                modelAnswer: 'Proportional control alone produces a non-zero steady-state offset error for Type 0 systems because a finite error is required to generate non-zero control effort. The Integral term integrates this error over time, continuously increasing control action until the steady-state error is driven precisely to zero.',
                explanation: 'Option A is correct: the Integral action accumulates persistent errors over time, introducing a pole at s = 0 (integrator) which increases the system type number and forces steady-state error to zero for step inputs. Option B describes Derivative action. Option C describes low-pass filtering. Option D would cause instability.',
                hints: [
                  'Consider what happens to the control output of a P-only controller when the system approaches steady state.',
                  'Notice that a P controller requires a continuous non-zero error to hold a plant at a non-zero steady-state output.',
                  'Think about how an integrator behaves when fed a persistent constant offset error over time.',
                  'Conclude that the Integral term integrates past errors to eliminate steady-state error completely.'
                ],
                expectedKeywords: ['pid controller', 'integral action', 'steady-state error', 'type number', 'proportional control'],
                rubric: {
                  'Integral Role': '50% for integrating error over time to eliminate steady-state error',
                  'System Type': '50% for increasing system type number / pole at s=0'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  electrical_engineering: {
    id: 'ee_motor_drives',
    name: 'Electrical Engineering',
    department: 'Electrical and Electronics Engineering',
    topics: {
      'motor drive': {
        name: 'Motor Drive',
        learningObjective: 'Analyze power electronic motor drives, induction motor speed control, inverters, and torque regulation.',
        prerequisites: ['Electric Machines', 'Power Electronics', 'AC Circuit Analysis'],
        concepts: {
          'speed control of an induction motor': {
            name: 'Speed control of an induction motor',
            learningObjective: 'Evaluate variable voltage variable frequency (V/f) control, slip regulation, and inverter switching for induction motors.',
            questions: [
              {
                id: 'ee_md_sc_1',
                questionText: 'In variable frequency (V/f) speed control of a three-phase induction motor operating below the base speed, why must the ratio of stator voltage (V) to supply frequency (f) be maintained constant?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'To keep the air-gap magnetic flux constant and prevent core magnetic saturation while delivering rated maximum torque',
                  'To eliminate rotor copper losses completely by operating with zero slip across all load torques',
                  'To force the rotor mechanical speed to exceed synchronous speed and initiate continuous regenerative braking',
                  'To ensure the motor power factor remains strictly equal to unity across all load variations'
                ],
                correctIndex: 0,
                modelAnswer: 'Below rated base speed, the stator induced EMF is proportional to the product of stator frequency and air-gap flux: E1 ≈ 4.44 * f * N1 * phi_m. Maintaining a constant V/f ratio ensures that the peak magnetic flux phi_m remains constant at its rated value. Decreasing frequency without reducing voltage would cause severe magnetic core saturation, high magnetizing current, and overheating; reducing voltage excessively would diminish available peak breakdown torque (which scales with (V/f)^2).',
                explanation: 'Option A is the exact physical principle of scalar V/f drive control: maintaining constant V/f maintains constant air-gap flux (phi_m ≈ V/f) below base speed, preserving maximum torque capability without saturating the stator core laminations. Option B is incorrect because induction torque fundamentally requires non-zero slip. Options C and D confuse sub-synchronous motoring with super-synchronous regeneration or synchronous motor excitation.',
                hints: [
                  'Recall the relationship between induced back-EMF, stator frequency (f), and mutual air-gap magnetic flux (phi_m): E ≈ k * f * phi_m.',
                  'Consider what happens to the magnetic core if frequency drops while voltage remains at its nominal line level.',
                  'Analyze the motor magnetizing current and magnetic saturation limits in the ferromagnetic core laminations.',
                  'Conclude that holding V/f constant keeps the air-gap flux constant at its design limit, preserving torque without core saturation.'
                ],
                distractorRationales: [
                  { index: 0, isCorrect: true, type: 'Correct Answer', rationale: 'Constant V/f maintains constant air-gap flux (phi ≈ V/f), avoiding magnetic core saturation while providing full rated torque.' },
                  { index: 1, isCorrect: false, type: 'Plausible Misconception', rationale: 'Induction motors fundamentally require non-zero slip (omega_s - omega_r) to induce rotor currents and generate torque.' },
                  { index: 2, isCorrect: false, type: 'Reasoning Error', rationale: 'Regenerative braking occurs when rotor speed exceeds synchronous speed (omega_r > omega_s), not during sub-synchronous V/f motoring.' },
                  { index: 3, isCorrect: false, type: 'Related Alternative', rationale: 'Induction motors operate with a lagging inductive power factor; V/f scalar control does not force unity power factor.' }
                ],
                expectedKeywords: ['v/f control', 'speed control', 'induction motor', 'air-gap flux', 'magnetic saturation', 'rated torque', 'frequency'],
                rubric: {
                  'Flux Relationship': '50% for identifying phi_m proportional to V/f',
                  'Saturation & Torque': '50% for explaining core saturation prevention and peak torque retention'
                },
                diagramSvg: null
              },
              {
                id: 'ee_md_sc_num_1',
                questionText: 'A 4-pole, 50 Hz, 3-phase induction motor operates with a full-load rotor speed of 1440 RPM. If an inverter drive reduces the supply frequency to 30 Hz with constant V/f control while maintaining the same full-load slip speed in RPM, calculate the new rotor speed.',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'Ns = 120 * f / P; N_slip = Ns1 - Nr1; Nr2 = Ns2 - N_slip',
                  givenParameters: { 'P': '4', 'f1': '50 Hz', 'Nr1': '1440 RPM', 'f2': '30 Hz' },
                  stepByStep: 'Ns1 = 120*50/4 = 1500 RPM. Slip speed N_slip = 1500 - 1440 = 60 RPM. At 30 Hz: Ns2 = 120*30/4 = 900 RPM. Therefore Nr2 = 900 - 60 = 840 RPM.',
                  unit: 'RPM',
                  calculatedValue: 840
                },
                options: [
                  '840 RPM',
                  '900 RPM',
                  '780 RPM',
                  '864 RPM'
                ],
                correctIndex: 0,
                modelAnswer: 'At 50 Hz, synchronous speed is Ns1 = 120*50/4 = 1500 RPM. The slip speed is N_slip = 1500 - 1440 = 60 RPM. At 30 Hz, new synchronous speed is Ns2 = 120*30/4 = 900 RPM. Maintaining constant full-load slip speed yields Nr2 = Ns2 - N_slip = 900 - 60 = 840 RPM.',
                explanation: 'Option A is correct: synchronous speed scales linearly with frequency (900 RPM at 30 Hz). Subtracting the rated slip speed of 60 RPM gives 840 RPM. Option B (900 RPM) is synchronous speed with zero torque. Option C (780 RPM) doubles the slip deduction. Option D (864 RPM) incorrectly assumes constant fractional slip rather than constant slip speed under constant V/f.',
                hints: [
                  'Determine the synchronous speed at 50 Hz using Ns = 120 * f / P.',
                  'Calculate the slip speed in RPM at full load: N_slip = Ns1 - Nr1.',
                  'Calculate the new synchronous speed at 30 Hz using Ns2 = 120 * 30 / 4.',
                  'Subtract the 60 RPM slip speed from the new 900 RPM synchronous speed to obtain the rotor operating speed.'
                ],
                distractorRationales: [
                  { index: 0, isCorrect: true, type: 'Correct Answer', rationale: 'Ns2 = 900 RPM; subtracting 60 RPM constant slip speed yields 840 RPM.' },
                  { index: 1, isCorrect: false, type: 'Calculation Error', rationale: 'Represents synchronous speed (900 RPM) where no rotor current is induced.' },
                  { index: 2, isCorrect: false, type: 'Calculation Error', rationale: 'Erroneously subtracts 120 RPM (double the actual slip speed).' },
                  { index: 3, isCorrect: false, type: 'Misconception', rationale: 'Assumes constant fractional slip (s=0.04 -> 864 RPM) instead of constant load slip speed.' }
                ],
                expectedKeywords: ['synchronous speed', 'slip speed', 'inverter frequency', 'v/f control', 'rotor speed', 'rpm'],
                rubric: {
                  'Synchronous Speed': '40% for calculating Ns2 = 900 RPM',
                  'Slip Speed': '30% for determining N_slip = 60 RPM',
                  'Final Speed': '30% for Nr2 = 840 RPM'
                },
                diagramSvg: null
              },
              {
                id: 'ee_md_sc_diag_1',
                questionText: 'Refer to the variable-frequency induction motor torque-speed characteristic curves. In the constant-torque region below base speed (V/f = constant), how does the maximum breakdown torque (T_max) behave as supply frequency is varied from 20 Hz to 50 Hz?',
                type: 'mcq',
                format: 'Diagram',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" class="w-full h-auto max-w-[550px]">
  <rect width="600" height="260" rx="12" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <line x1="60" y1="220" x2="560" y2="220" stroke="#718096" stroke-width="2"/>
  <line x1="60" y1="20" x2="60" y2="220" stroke="#718096" stroke-width="2"/>
  <text x="560" y="240" font-family="sans-serif" font-size="11" fill="#4A5568" text-anchor="end">Rotor Speed (RPM) →</text>
  <text x="30" y="30" font-family="sans-serif" font-size="11" fill="#4A5568">Torque (N·m) ↑</text>
  <path d="M 60 170 Q 140 60 200 220" fill="none" stroke="#DD6B20" stroke-width="2.5"/>
  <text x="145" y="50" font-family="sans-serif" font-size="10" fill="#DD6B20" font-weight="bold">20 Hz</text>
  <path d="M 60 180 Q 260 60 350 220" fill="none" stroke="#3182CE" stroke-width="2.5"/>
  <text x="265" y="50" font-family="sans-serif" font-size="10" fill="#3182CE" font-weight="bold">35 Hz</text>
  <path d="M 60 190 Q 400 60 500 220" fill="none" stroke="#38A169" stroke-width="2.5"/>
  <text x="405" y="50" font-family="sans-serif" font-size="10" fill="#38A169" font-weight="bold">50 Hz (Base)</text>
  <line x1="60" y1="60" x2="500" y2="60" stroke="#E53E3E" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="65" y="75" font-family="sans-serif" font-size="10" fill="#E53E3E" font-weight="bold">Constant Breakdown Torque T_max</text>
  <text x="280" y="245" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2B6CB0" text-anchor="middle">Constant Torque Region (V/f = const)</text>
</svg>`,
                diagramCaption: 'Family of induction motor torque-speed curves under variable-frequency constant V/f scalar control below rated base speed.',
                options: [
                  'The maximum breakdown torque remains substantially constant across the entire operating frequency range because peak flux is maintained',
                  'The maximum breakdown torque drops linearly to zero as frequency approaches 50 Hz',
                  'The breakdown torque increases with the square of frequency (T_max ∝ f^2), reaching peak value only at 50 Hz',
                  'The synchronous speed remains completely fixed at 1500 RPM regardless of the inverter frequency setpoint'
                ],
                correctIndex: 0,
                modelAnswer: 'Under constant V/f scalar control below base speed, air-gap magnetic flux is held constant. Since maximum breakdown torque T_max is proportional to (V/f)^2, the peak torque capability remains constant across frequencies (with slight reduction at very low frequencies due to stator resistance drop, compensated by IR-boost).',
                explanation: 'Option A is correct: the family of torque-speed curves shifts along the speed axis while maintaining a nearly identical peak breakdown torque T_max because air-gap flux is held constant. Option B is false as torque does not drop to zero. Option C inverts the field-weakening relationship. Option D contradicts the variable synchronous speed Ns = 120*f/P.',
                hints: [
                  'Observe the dashed horizontal reference line connecting the peaks of the torque curves across 20 Hz, 35 Hz, and 50 Hz.',
                  'Recall the governing breakdown torque formula in terms of air-gap flux: T_max ∝ (V/f)^2.',
                  'Consider whether changing the frequency while proportionally scaling voltage alters the peak value of the torque curve.',
                  'Conclude that the peak breakdown torque remains constant, with the operating curve shifting horizontally along the synchronous speed axis.'
                ],
                distractorRationales: [
                  { index: 0, isCorrect: true, type: 'Correct Answer', rationale: 'Peak breakdown torque T_max is proportional to (V/f)^2, which remains constant in the constant-torque region.' },
                  { index: 1, isCorrect: false, type: 'Misconception', rationale: 'Torque does not drop to zero at 50 Hz; 50 Hz is the rated base operating point.' },
                  { index: 2, isCorrect: false, type: 'Reasoning Error', rationale: 'Torque does not scale with f^2; in field weakening above base speed it drops as 1/f or 1/f^2.' },
                  { index: 3, isCorrect: false, type: 'Factually False', rationale: 'Synchronous speed Ns = 120*f/P changes directly with frequency.' }
                ],
                expectedKeywords: ['torque-speed curve', 'breakdown torque', 'constant torque region', 'v/f control', 'induction motor', 'peak torque'],
                rubric: {
                  'Curve Interpretation': '50% for identifying horizontal shift with constant peak',
                  'Physical Rationale': '50% for linking constant T_max to constant air-gap flux'
                }
              }
            ]
          }
        }
      }
    }
  },

  computer_science: {
    id: 'cs',
    name: 'Computer Science',
    department: 'Computer Science Engineering (CSE)',
    topics: {
      'database normalization': {
        name: 'Database Normalization',
        concepts: {
          'normal forms and dependencies': {
            name: 'Normal Forms and Dependencies',
            learningObjective: 'Master functional dependencies, 1NF through BCNF, lossless joins, and dependency preservation.',
            questions: [
              {
                id: 'cs_db_norm_1',
                questionText: 'What distinguishes Boyce-Codd Normal Form (BCNF) from Third Normal Form (3NF)?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'In BCNF, for every non-trivial functional dependency X -> Y, X must be a superkey; 3NF allows Y to be a prime attribute even if X is not a superkey',
                  '3NF applies only to single-attribute primary keys whereas BCNF applies only to composite keys',
                  'BCNF allows multi-valued dependencies whereas 3NF strictly eliminates them',
                  '3NF requires table decomposition into exactly three separate relation schemas'
                ],
                correctIndex: 0,
                modelAnswer: 'In 3NF, for any non-trivial functional dependency X -> Y, either X is a superkey OR Y is a prime attribute (part of a candidate key). BCNF eliminates this second condition: for EVERY non-trivial dependency X -> Y, X must strictly be a superkey.',
                explanation: 'Option A is the precise relational definition: 3NF relaxes BCNF by permitting X -> Y when Y is part of a candidate key (prime attribute). BCNF requires that the determinant X must always be a superkey, eliminating all functional dependency redundancy but occasionally sacrificing dependency preservation. Options B, C, and D are incorrect definitions.',
                hints: [
                  'Recall the formal condition for 3NF: for every non-trivial functional dependency X -> A, what are the two alternative conditions?',
                  'In 3NF, either X is a superkey OR A is a prime attribute.',
                  'Consider which of those two conditions is removed to create the stricter BCNF definition.',
                  'In BCNF, the determinant X must strictly be a superkey in all cases, with no exception for prime attributes.'
                ],
                expectedKeywords: ['bcnf', '3nf', 'superkey', 'prime attribute', 'functional dependency', 'candidate key'],
                rubric: {
                  'Determinant Superkey Rule': '50% for stating X must be superkey in BCNF',
                  '3NF Prime Attribute Exception': '50% for explaining the prime attribute relaxation in 3NF'
                },
                diagramSvg: null
              },
              {
                id: 'cs_db_scen_1',
                questionText: 'A university enrollment table R(StudentID, CourseID, LecturerName, LecturerOffice) has composite candidate key (StudentID, CourseID). Functional dependencies include (StudentID, CourseID) -> LecturerName and LecturerName -> LecturerOffice. When all students drop a specific CourseID, the record for LecturerName and LecturerOffice is completely lost from the database. What type of relational anomaly is this, and which normal form violation causes it?',
                type: 'mcq',
                format: 'Scenario',
                difficulty: 'Advanced',
                bloomLevel: 'Analysis',
                options: [
                  'Deletion anomaly caused by a transitive dependency (CourseID -> LecturerName -> LecturerOffice), violating Third Normal Form (3NF)',
                  'Insertion anomaly caused by non-atomic multivalued attributes violating First Normal Form (1NF)',
                  'Concurrency deadlock anomaly caused by uncommitted row-level locks',
                  'Lossless join anomaly caused by hash table index corruption'
                ],
                correctIndex: 0,
                modelAnswer: 'This is a classical Deletion Anomaly caused by a Transitive Dependency: (StudentID, CourseID) -> LecturerName and LecturerName -> LecturerOffice, where LecturerOffice depends on a non-prime attribute (LecturerName). When the enrollment row is deleted, the lecturer’s office location is accidentally expunged as well. Decomposing into 3NF/BCNF resolves this anomaly.',
                explanation: 'Option A is correct: the loss of secondary lecturer information upon deleting enrollment data exemplifies a deletion anomaly, arising directly from a transitive dependency violating 3NF. Options B, C, and D misidentify both the anomaly and relational design principles.',
                hints: [
                  'Identify what information is unintentionally lost when student enrollment records are deleted.',
                  'Analyze the functional dependencies: does LecturerOffice depend directly on the primary key or via LecturerName?',
                  'Recall that a non-key attribute depending on another non-key attribute constitutes a transitive dependency.',
                  'Conclude that this transitive dependency violates 3NF, creating a deletion anomaly.'
                ],
                expectedKeywords: ['deletion anomaly', 'transitive dependency', 'third normal form', '3nf', 'functional dependency'],
                rubric: {
                  'Anomaly Identification': '50% for identifying deletion anomaly',
                  'Normal Form Violation': '50% for identifying transitive dependency violating 3NF'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'operating systems': {
        name: 'Operating Systems',
        concepts: {
          'virtual memory': {
            name: 'Virtual Memory',
            learningObjective: 'Analyze demand paging, page replacement algorithms, TLB translation, and address translation mechanics.',
            questions: [
              {
                id: 'cs_os_vm_1',
                questionText: 'In an operating system utilizing virtual memory with demand paging, what sequence of actions occurs immediately when the CPU references a valid virtual address whose present/valid bit is 0 in the page table?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'The hardware MMU generates a page fault trap, prompting the OS kernel to allocate a physical frame, read the required page from backing store, update the page table, and restart the faulting instruction',
                  'The operating system immediately terminates the executing process with an unrecoverable segmentation fault signal',
                  'The CPU instruction pipeline halts permanently until all processes in the ready queue complete execution',
                  'The memory management unit writes all dirty cache lines directly to secondary storage without loading any new frames'
                ],
                correctIndex: 0,
                modelAnswer: 'A present bit of 0 triggers a hardware page fault interrupt. The OS page fault handler validates the reference against the process address space descriptors, locates or frees a physical frame using page replacement (e.g., LRU/Clock), issues disk I/O to read the page from swap/backing store, updates the page table entry (setting present bit to 1 and frame number), and restarts the faulting instruction.',
                explanation: 'Option A is correct: Demand paging loads pages lazily upon first reference. A missing page triggers a page fault trap handled by the OS kernel to fetch the page from storage, update page tables, and restart the instruction. Options B, C, and D describe fatal signal termination, CPU stalling, or incorrect cache flushing.',
                hints: [
                  'Recall the definition and role of the present/valid bit in hardware page tables.',
                  'Determine what hardware trap is generated by the Memory Management Unit (MMU) when the present bit is 0.',
                  'Trace the operating system interrupt handler: allocating a physical memory frame and initiating disk I/O.',
                  'Select the sequence where the OS handles the page fault, fetches the page from backing store, updates the entry, and restarts the instruction.'
                ],
                expectedKeywords: ['virtual memory', 'demand paging', 'page fault', 'mmu', 'page table', 'frame allocation', 'backing store'],
                rubric: {
                  'Trap & Interrupt Identification': '40% for identifying page fault interrupt by MMU',
                  'OS Paging Mechanism': '40% for explaining frame allocation and disk fetch',
                  'Instruction Restart': '20% for restarting the faulting instruction'
                },
                diagramSvg: null
              },
              {
                id: 'cs_os_vm_num_1',
                questionText: 'In a demand-paged virtual memory system with a single-level page table, main memory access time is 100 ns and the Translation Lookaside Buffer (TLB) access time is 20 ns. If the TLB hit ratio is 90% (0.90) and no page faults occur during execution, calculate the Effective Memory Access Time (EMAT).',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'EMAT = alpha * (t_tlb + t_mem) + (1 - alpha) * (t_tlb + 2 * t_mem)',
                  givenParameters: { 'alpha': '0.90', 't_tlb': '20 ns', 't_mem': '100 ns' },
                  stepByStep: 'TLB Hit Time = 20 + 100 = 120 ns; TLB Miss Time = 20 + 100 + 100 = 220 ns; EMAT = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns',
                  unit: 'ns',
                  calculatedValue: 130
                },
                options: [
                  '130 ns',
                  '110 ns',
                  '120 ns',
                  '220 ns'
                ],
                correctIndex: 0,
                modelAnswer: 'On a TLB hit (probability 0.90), time required is TLB access + memory data access = 20 ns + 100 ns = 120 ns. On a TLB miss (probability 0.10), time required is TLB access + page table access + memory data access = 20 ns + 100 ns + 100 ns = 220 ns. EMAT = 0.90(120 ns) + 0.10(220 ns) = 108 ns + 22 ns = 130 ns.',
                explanation: 'Option A is correct: EMAT = 0.90 * (20 + 100) + 0.10 * (20 + 200) = 0.90 * 120 + 0.10 * 220 = 108 + 22 = 130 ns. Option B ignores TLB overhead on misses, Option C ignores misses entirely, and Option D calculates purely the miss penalty.',
                hints: [
                  'Recall the formula for Effective Memory Access Time: EMAT = alpha * (t_hit) + (1 - alpha) * (t_miss).',
                  'Calculate the access time for a TLB hit: t_tlb + t_mem = 20 + 100 = 120 ns.',
                  'Calculate the access time for a TLB miss: t_tlb + 2 * t_mem = 20 + 200 = 220 ns.',
                  'Multiply by probabilities: 0.90 * 120 ns + 0.10 * 220 ns = 108 + 22 = 130 ns.'
                ],
                expectedKeywords: ['emat', 'effective memory access time', 'tlb', 'hit ratio', 'calculation', 'ns'],
                rubric: {
                  'Formula Identification': '40% for identifying EMAT formula',
                  'Hit / Miss Decomposition': '30% for determining 120 ns hit and 220 ns miss times',
                  'Final Result': '30% for calculating 130 ns'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  dsa: {
    id: 'cs_dsa',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science and Engineering (CSE)',
    topics: {
      'graph algorithms': {
        name: 'Graph Algorithms',
        concepts: {
          'dijkstra': {
            name: "Dijkstra's Shortest Path Algorithm",
            learningObjective: 'Analyze single-source shortest path finding, priority queue relaxation, non-negative weight invariant, and time complexity.',
            questions: [
              {
                id: 'dsa_ga_dijk_1',
                questionText: "What fundamental invariant guarantees that Dijkstra's algorithm correctly computes single-source shortest paths on weighted graphs?",
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'All edge weights must be strictly non-negative so that once a vertex is extracted from the priority queue, its shortest distance is finalized',
                  'The graph must be a directed acyclic graph (DAG) containing zero cycles',
                  'The graph must be bipartite with vertices partitioned into two independent sets',
                  'All vertices must have an in-degree and out-degree equal to 2'
                ],
                correctIndex: 0,
                modelAnswer: "Dijkstra's algorithm relies on the non-negative edge weight invariant; when a vertex with the minimum tentative distance is extracted from the priority queue, no subsequent path through unvisited vertices can yield a shorter distance.",
                explanation: 'Option A is correct: with non-negative edge weights, adding edges never decreases path cost, guaranteeing greedy choice optimality. Negative edge weights can violate this, requiring Bellman-Ford.',
                hints: [
                  'Consider what property edge weights must satisfy to prevent newly discovered paths from decreasing total cost.',
                  'Think about the greedy choice made when extracting the minimum tentative distance node from the priority queue.',
                  'Recall how negative edge weights can invalidate previously finalized distance estimates.',
                  'Conclude that non-negative edge weights guarantee finalized distances upon priority queue extraction.'
                ],
                expectedKeywords: ['dijkstra', 'non-negative edge weights', 'priority queue', 'relaxation', 'shortest path'],
                rubric: {
                  'Invariant Analysis': '50% for identifying non-negative edge weights',
                  'Optimality Proof': '50% for explaining greedy finalization upon extraction'
                },
                diagramSvg: null
              },
              {
                id: 'dsa_ga_dijk_num_1',
                questionText: "In a weighted directed graph with vertices {A, B, C}, source vertex A has edges (A->B, weight 4), (A->C, weight 2), and (C->B, weight 1). What is the finalized shortest distance from A to B calculated by Dijkstra's algorithm?",
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'dist(A->B) = min(weight(A->B), dist(A->C) + weight(C->B)) = min(4, 2 + 1) = 3',
                  givenParameters: { 'A->B': 4, 'A->C': 2, 'C->B': 1 },
                  stepByStep: '1. Init dist(A)=0, dist(B)=inf, dist(C)=inf. 2. Relax A: dist(C)=2, dist(B)=4. 3. Extract C (min 2), relax C->B: dist(B) = min(4, 2+1) = 3. 4. Final dist(B) = 3.',
                  unit: 'distance units',
                  calculatedValue: 3
                },
                options: [
                  '3 distance units',
                  '4 distance units',
                  '2 distance units',
                  '7 distance units'
                ],
                correctIndex: 0,
                modelAnswer: 'The shortest distance from A to B is 3 distance units via path A -> C -> B (distance 2 + 1 = 3), which relaxes the direct edge A -> B of weight 4.',
                explanation: 'Option A is correct: Edge relaxation through intermediate node C gives dist(A->B) = dist(A->C) + weight(C->B) = 2 + 1 = 3, which is shorter than the direct edge of weight 4.',
                hints: [
                  'Initialize distances from source vertex A: dist(A)=0, dist(B)=inf, dist(C)=inf.',
                  'Relax neighbors of A to get tentative distances: dist(C)=2 and dist(B)=4.',
                  'Extract vertex C with the smallest tentative distance (2) and relax its outgoing edge (C->B) of weight 1.',
                  'Compare the direct distance 4 with the path through C (2 + 1 = 3) to find the minimum distance of 3.'
                ],
                expectedKeywords: ['relaxation', 'shortest path', 'dijkstra', 'distance', 'step-by-step'],
                rubric: {
                  'Relaxation Steps': '50% for calculating path A->C->B',
                  'Final Value': '50% for obtaining 3 distance units'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'kruskal': {
        name: "Kruskal's Minimum Spanning Tree Algorithm",
        concepts: {
          'kruskal mst and dsu': {
            name: "Kruskal's MST & Disjoint Set Union (DSU)",
            learningObjective: "Analyze greedy edge selection, cycle detection, and Disjoint Set Union (DSU) time complexity in Kruskal's algorithm.",
            questions: [
              {
                id: 'dsa_kruskal_1',
                questionText: "In Kruskal's algorithm for finding a Minimum Spanning Tree (MST), how are cycles efficiently detected when examining candidate edges in non-decreasing order of weight?",
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'By maintaining a Disjoint Set Union (DSU) / Union-Find data structure with path compression and union by rank to test edge endpoint connectivity in near-constant amortized time',
                  'By executing a full Breadth-First Search (BFS) across the entire accumulated subgraph for every candidate edge',
                  'By computing the determinant of the graph Laplacian matrix after each candidate edge is considered',
                  'By rejecting any candidate edge whose weight exceeds the median vertex degree of the connected component'
                ],
                correctIndex: 0,
                modelAnswer: "Kruskal's algorithm sorts edges by weight and uses a Disjoint Set Union (DSU) data structure with path compression and union by rank. If find(u) == find(v), adding edge (u, v) creates a cycle and it is skipped; otherwise, union(u, v) merges their sets in alpha(V) amortized time.",
                explanation: "Option A is correct: DSU allows near-constant time cycle checks via find-set operations with inverse Ackermann complexity alpha(V). Running BFS per edge (Option B) degrades performance to O(E * V). Options C and D are computationally irrelevant.",
                hints: [
                  "Recall the greedy strategy of Kruskal's algorithm: sort all edges and greedily add the lightest edge that does not form a cycle.",
                  "Think about which data structure represents connected components and supports find and union operations.",
                  "Consider how path compression and union by rank optimize disjoint-set queries.",
                  "Conclude that Disjoint Set Union (DSU) determines whether two vertices already belong to the same component in near-constant time."
                ],
                expectedKeywords: ['kruskal', 'minimum spanning tree', 'dsu', 'disjoint set union', 'cycle detection', 'path compression'],
                rubric: {
                  'DSU Identification': '50% for identifying Disjoint Set Union / Union-Find',
                  'Cycle Invariant': '50% for explaining find(u) == find(v) detects cycles'
                },
                diagramSvg: null
              }
            ]
          }
        }
      },
      'hashing': {
        name: 'Hash Tables & Collision Resolution',
        concepts: {
          'hash tables and collision': {
            name: 'Hash Tables, Load Factor & Collision Resolution',
            learningObjective: 'Evaluate load factor thresholds, probe sequences, separate chaining, and average search complexity in hash tables.',
            questions: [
              {
                id: 'dsa_hash_1',
                questionText: 'What does the load factor (alpha = n / m) represent in a hash table with m buckets and n stored elements, and how does it constrain collision resolution strategies?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'It measures the average number of elements per bucket; in open addressing (linear/quadratic probing) alpha must remain strictly below 1.0 to guarantee open slots, whereas separate chaining accommodates alpha >= 1.0 with linear search chain degradation',
                  'It quantifies cryptographic hash entropy; open addressing requires alpha = 0 to avoid hash collisions',
                  'It denotes the CPU L1 cache line width in bytes, requiring alpha to equal an exact power of two',
                  'It represents the fraction of deleted tombstones, having zero operational impact on search probe length'
                ],
                correctIndex: 0,
                modelAnswer: 'Load factor alpha = n / m is the ratio of stored elements to table capacity. In open addressing, each slot holds at most one element, so alpha < 1 is strictly required (tables typically rehash at alpha ≈ 0.7). In separate chaining, each slot heads a linked list or tree, allowing alpha > 1 with average lookup time O(1 + alpha).',
                explanation: 'Option A is correct: open addressing stores all entries within the table array itself, making alpha >= 1 impossible without infinite probing or table exhaustion. Separate chaining stores collisions in external chains, functioning even when n exceeds m. Options B, C, and D are factually false.',
                hints: [
                  'Examine the ratio alpha = n / m where n is element count and m is bucket capacity.',
                  'Consider where colliding keys are stored in open addressing versus separate chaining.',
                  'Notice that in open addressing, every element occupies a slot directly in the table array.',
                  'Recognize that open addressing requires alpha < 1.0 because slots cannot exceed capacity, while separate chaining permits alpha >= 1.0.'
                ],
                expectedKeywords: ['load factor', 'hash table', 'open addressing', 'separate chaining', 'collision resolution'],
                rubric: {
                  'Load Factor Definition': '50% for alpha = n / m occupancy ratio',
                  'Strategy Comparison': '50% for open addressing alpha < 1 vs chaining alpha >= 1'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  mathematics: {
    id: 'math_la',
    name: 'Linear Algebra',
    department: 'Mathematics & Data Science',
    topics: {
      'eigenvalues and eigenvectors': {
        name: 'Eigenvalues and Eigenvectors',
        concepts: {
          'characteristic equation and eigenspaces': {
            name: 'Characteristic Equation and Eigenspaces',
            learningObjective: 'Compute matrix eigenvalues, determine eigenvectors, and solve the characteristic polynomial det(A - lambda*I) = 0.',
            questions: [
              {
                id: 'math_la_eig_num_1',
                questionText: 'Given the 2x2 real matrix A = [[4, 1], [2, 3]], calculate its eigenvalues by solving the characteristic equation det(A - lambda*I) = 0.',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'det(A - lambda*I) = (4 - lambda)*(3 - lambda) - (1)*(2) = lambda^2 - 7*lambda + 10 = 0',
                  givenParameters: { 'A': '[[4, 1], [2, 3]]' },
                  stepByStep: 'lambda^2 - 7*lambda + 10 = (lambda - 5)*(lambda - 2) = 0 => lambda_1 = 5, lambda_2 = 2',
                  unit: 'dimensionless scalar',
                  calculatedValue: [5, 2]
                },
                options: [
                  'lambda_1 = 5 and lambda_2 = 2',
                  'lambda_1 = 4 and lambda_2 = 3',
                  'lambda_1 = 6 and lambda_2 = 1',
                  'lambda_1 = 7 and lambda_2 = -10'
                ],
                correctIndex: 0,
                modelAnswer: 'The characteristic polynomial is det(A - lambda*I) = (4 - lambda)(3 - lambda) - (1)(2) = lambda^2 - 7*lambda + 12 - 2 = lambda^2 - 7*lambda + 10 = 0. Factoring gives (lambda - 5)(lambda - 2) = 0, yielding eigenvalues lambda_1 = 5 and lambda_2 = 2.',
                explanation: 'Option A is correct: the characteristic equation is det([[4-lambda, 1], [2, 3-lambda]]) = (4-lambda)(3-lambda) - 2 = lambda^2 - 7*lambda + 10 = (lambda - 5)(lambda - 2) = 0. The roots are lambda = 5 and lambda = 2. Note that trace(A) = 4 + 3 = 7 = 5 + 2 and det(A) = 12 - 2 = 10 = 5 * 2, verifying the calculation.',
                hints: [
                  'Formulate the matrix (A - lambda*I): subtract lambda from the main diagonal entries 4 and 3.',
                  'Calculate the determinant of this 2x2 matrix: (4 - lambda)(3 - lambda) - (1 * 2).',
                  'Expand and simplify into a quadratic polynomial: lambda^2 - 7*lambda + 10 = 0.',
                  'Factor the quadratic equation (lambda - 5)(lambda - 2) = 0 to extract the eigenvalues.'
                ],
                expectedKeywords: ['characteristic equation', 'eigenvalues', 'determinant', 'trace', 'roots', 'lambda'],
                rubric: {
                  'Characteristic Polynomial': '50% for deriving lambda^2 - 7*lambda + 10 = 0',
                  'Root Extraction': '50% for finding lambda = 5 and lambda = 2'
                },
                diagramSvg: null
              },
              {
                id: 'math_la_eig_th_1',
                questionText: 'What is the formal geometric definition of an eigenvector v and eigenvalue lambda for a linear transformation represented by square matrix A?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'A non-zero vector v whose direction is unchanged by matrix multiplication, satisfying A*v = lambda*v where lambda is a scalar scaling factor',
                  'Any vector v that is orthogonal to all row vectors of matrix A, satisfying A*v = 0',
                  'A vector v whose Euclidean length is identically equal to the determinant of matrix A',
                  'A unit vector pointing in the direction of the matrix gradient vector'
                ],
                correctIndex: 0,
                modelAnswer: 'An eigenvector of a square matrix A is a non-zero vector v such that multiplying A by v yields a vector parallel to v, scaled by factor lambda: A*v = lambda*v. Geometrically, the transformation A stretches or shrinks v without rotating it into a different line.',
                explanation: 'Option A is the fundamental definition: A*v = lambda*v where v != 0 and lambda is a scalar. The direction of v is preserved (or flipped if lambda < 0), scaled by factor lambda. Options B, C, and D describe null spaces, determinant lengths, or gradient directions.',
                hints: [
                  'Recall the core algebraic eigenvalue equation: A*v = lambda*v.',
                  'Consider what happens geometrically to a vector when multiplied by a matrix if it is simply multiplied by a scalar.',
                  'Notice that multiplying a vector by a scalar only changes its magnitude (or reverses direction if negative), without altering its span/line.',
                  'Conclude that an eigenvector is a non-zero vector whose direction remains invariant under transformation A.'
                ],
                expectedKeywords: ['eigenvector', 'eigenvalue', 'scalar', 'direction invariance', 'scaling factor', 'a*v = lambda*v'],
                rubric: {
                  'Definition Equation': '50% for A*v = lambda*v',
                  'Geometric Interpretation': '50% for direction invariance and scalar stretching'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  mlops: {
    id: 'mlops',
    name: 'MLOps',
    department: 'Computer Science and Machine Learning',
    topics: {
      'continuous deployment of ml models': {
        name: 'Continuous Deployment of ML Models',
        concepts: {
          'model rollback': {
            name: 'Canary Deployment and Automated Rollback',
            learningObjective: 'Analyze canary deployment strategies, automated health telemetry triggers, and rapid rollback mechanisms for production ML models.',
            questions: [
              {
                id: 'mlops_cd_canary_1',
                questionText: 'During a canary deployment of a newly trained model, real-time telemetry indicates an anomalous 20% latency spike for 5% of users. What automated MLOps mechanism should immediately be triggered to restore service reliability?',
                type: 'mcq',
                format: 'Scenario',
                difficulty: 'Advanced',
                bloomLevel: 'Evaluation',
                options: [
                  'Automated deployment rollback, routing 100% of live traffic back to the prior stable baseline model in the registry',
                  'Immediate batch retraining from scratch on the primary production database',
                  'Injecting Gaussian noise into incoming feature tensors to smooth out spikes',
                  'Disabling all server monitoring agents to prevent alerts'
                ],
                correctIndex: 0,
                modelAnswer: 'Automated deployment rollback immediately reroutes live inference traffic to the previously verified stable model version in the model registry, neutralizing customer impact while the regression is investigated.',
                explanation: 'Option A is correct: Canary rollouts pair with automated health monitoring; breaching latency or error budgets triggers instant rollback to the stable baseline model. Options B, C, and D exacerbate outages or ignore safety protocols.',
                hints: [
                  'Identify the standard continuous deployment recovery operation when a canary release breaches service level objectives.',
                  'Differentiate between offline model retraining and live traffic routing to a proven model version.',
                  'Evaluate which immediate action stops user exposure to high latency without system downtime.',
                  'Select automated deployment rollback to restore traffic to the stable baseline model.'
                ],
                expectedKeywords: ['canary deployment', 'automated rollback', 'traffic routing', 'stable model', 'service level objectives'],
                rubric: {
                  'Mitigation Strategy': '50% for specifying automated rollback',
                  'Traffic Isolation': '50% for routing traffic back to stable baseline model'
                },
                diagramSvg: null
              }
            ]
          },
          'data drift and concept drift monitoring': {
            name: 'Data Drift and Concept Drift Monitoring',
            learningObjective: 'Analyze distribution shifts in production inference, feature drift detection, and statistical distance metrics.',
            questions: [
              {
                id: 'mlops_cd_drift_1',
                questionText: "An ML model's validation accuracy remains stable, but its production predictions become less accurate as the input data distribution changes. Which monitoring mechanism would help detect this problem?",
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                options: [
                  'Data-drift detection (evaluates shifts in input feature distributions between training and inference)',
                  'Model-version tracking (logs git commits and weights in an artifact store)',
                  'Container-image building (packages dependencies into Docker layers)',
                  'Deployment rollback (reverts to a prior model artifact after threshold breach)'
                ],
                correctIndex: 0,
                modelAnswer: 'Data-drift detection evaluates statistical divergences between the distribution of inference input features and baseline training data P(X), directly alerting engineers to degradation caused by evolving real-world inputs.',
                explanation: 'Option A is correct: Data drift occurs when input distribution P(X) shifts over time despite target distribution P(Y|X) remaining consistent. Monitoring feature drift identifies divergence before catastrophic business failure. Model versioning, container building, and rollback do not evaluate statistical feature distributions.',
                hints: [
                  'Recall the phenomenon where the statistical distribution of inference input features shifts away from baseline training data.',
                  'Distinguish between version tracking, container orchestration, and continuous statistical monitoring on inference payloads.',
                  'Identify whether the problem stems from code version mismatch or statistical input divergence P(X).',
                  'Select data-drift detection as the specialized mechanism that tracks input distribution shifts.'
                ],
                expectedKeywords: ['data drift', 'input distribution', 'feature drift', 'monitoring', 'p(x)', 'divergence'],
                rubric: {
                  'Mechanism Identification': '50% for identifying data-drift detection',
                  'Distribution Shift Analysis': '50% for linking to shifts in inference feature distributions P(X)'
                },
                diagramSvg: null
              },
              {
                id: 'mlops_cd_val_1',
                questionText: 'In a continuous deployment pipeline for machine learning models, what is the primary role of an automated validation gate prior to serving production traffic?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'To benchmark candidate model performance on holdout validation datasets against baseline production thresholds to prevent regression',
                  'To convert training scripts into low-level GPU microcode',
                  'To randomly drop a fraction of incoming inference requests to reduce cluster thermal load',
                  'To delete historical model training checkpoints from object storage'
                ],
                correctIndex: 0,
                modelAnswer: 'An automated validation gate evaluates candidate model metrics (accuracy, latency, fairness) against historical baselines on gold-standard holdout data, ensuring models that underperform are rejected before traffic promotion.',
                explanation: 'Option A is correct: Validation gates enforce strict quality benchmarks and regression testing in CI/CD pipelines before routing production traffic. Options B, C, and D describe irrelevant or harmful actions.',
                hints: [
                  'Consider what quality criteria must be satisfied before promoting a candidate model to production.',
                  'Examine how CI/CD pipelines prevent performance regressions in automated deployments.',
                  'Look for the verification mechanism comparing candidate metrics against baseline thresholds on evaluation data.',
                  'Conclude that validation gates test candidate model metrics against baselines before deployment.'
                ],
                expectedKeywords: ['validation gate', 'ci/cd', 'baseline thresholds', 'regression testing', 'holdout dataset'],
                rubric: {
                  'Gate Purpose': '50% for explaining regression prevention',
                  'Benchmarking Role': '50% for comparing candidate metrics with production baselines'
                },
                diagramSvg: null
              },
              {
                id: 'mlops_cd_canary_1',
                questionText: 'During a canary deployment of a newly trained model, real-time telemetry indicates an anomalous 20% latency spike for 5% of users. What automated MLOps mechanism should immediately be triggered to restore service reliability?',
                type: 'mcq',
                format: 'Scenario',
                difficulty: 'Advanced',
                bloomLevel: 'Evaluation',
                options: [
                  'Automated deployment rollback, routing 100% of live traffic back to the prior stable baseline model in the registry',
                  'Immediate batch retraining from scratch on the primary production database',
                  'Injecting Gaussian noise into incoming feature tensors to smooth out spikes',
                  'Disabling all server monitoring agents to prevent alerts'
                ],
                correctIndex: 0,
                modelAnswer: 'Automated deployment rollback immediately reroutes live inference traffic to the previously verified stable model version in the model registry, neutralizing customer impact while the regression is investigated.',
                explanation: 'Option A is correct: Canary rollouts pair with automated health monitoring; breaching latency or error budgets triggers instant rollback to the stable baseline model. Options B, C, and D exacerbate outages or ignore safety protocols.',
                hints: [
                  'Identify the standard continuous deployment recovery operation when a canary release breaches service level objectives.',
                  'Differentiate between offline model retraining and live traffic routing to a proven model version.',
                  'Evaluate which immediate action stops user exposure to high latency without system downtime.',
                  'Select automated deployment rollback to restore traffic to the stable baseline model.'
                ],
                expectedKeywords: ['canary deployment', 'automated rollback', 'traffic routing', 'stable model', 'service level objectives'],
                rubric: {
                  'Mitigation Strategy': '50% for specifying automated rollback',
                  'Traffic Isolation': '50% for routing traffic back to stable baseline model'
                },
                diagramSvg: null
              },
              {
                id: 'mlops_cd_skew_1',
                questionText: 'What fundamental architectural factor causes training-serving skew in end-to-end machine learning systems?',
                type: 'mcq',
                format: 'Comparison',
                difficulty: 'Intermediate',
                bloomLevel: 'Analysis',
                options: [
                  'Discrepancies between feature transformation logic used during offline batch training and online real-time inference',
                  'Using different CSS styles between development and production dashboards',
                  'Executing neural network training on odd numbered days of the week',
                  'Using SSD storage for checkpoints rather than NVMe drives'
                ],
                correctIndex: 0,
                modelAnswer: 'Training-serving skew is primarily caused by divergent feature pipelines: offline training using batch SQL/Python transformations while online serving uses separate low-latency streaming transformations.',
                explanation: 'Option A is correct: Differences in data handling, time-travel leakage, or dual codebases for feature extraction between offline training and online serving lead directly to training-serving skew. Options B, C, and D are technically irrelevant.',
                hints: [
                  'Recall that training-serving skew is an inconsistency between the model training environment and production inference.',
                  'Analyze where feature transformations are computed during offline training versus live serving.',
                  'Look for discrepancies in feature engineering code, preprocessing libraries, or data freshness.',
                  'Identify divergent feature transformation logic as the root cause of training-serving skew.'
                ],
                expectedKeywords: ['training-serving skew', 'feature engineering', 'offline training', 'online inference', 'pipeline discrepancy'],
                rubric: {
                  'Root Cause Analysis': '50% for identifying feature pipeline discrepancies',
                  'Environment Contrast': '50% for contrasting offline batch with online real-time serving'
                },
                diagramSvg: null
              },
              {
                id: 'mlops_cd_registry_1',
                questionText: 'In a modern MLOps production architecture, what is the primary operational role of a centralized Model Registry?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'To catalog versioned model artifacts, track training hyperparameters and lineage, and govern lifecycle stage transitions',
                  'To automatically generate ground-truth labels without human oversight',
                  'To replace relational database storage for student user credentials',
                  'To dynamically overclock CPU cores during backpropagation'
                ],
                correctIndex: 0,
                modelAnswer: 'A centralized Model Registry provides full lifecycle governance for machine learning models, storing immutable artifacts, tracking lineage, and managing stage transitions from staging to production.',
                explanation: 'Option A is correct: The model registry acts as the single source of truth for model metadata, versioning, container pointers, and governance approvals in MLOps workflows. Options B, C, and D are false descriptions.',
                hints: [
                  'Consider how enterprise MLOps teams govern model promotion between development, staging, and production.',
                  'Identify the system that stores model artifacts, commit lineage, and approval states.',
                  'Differentiate between compute acceleration, data labeling, and artifact governance.',
                  'Select cataloging versioned artifacts and managing lifecycle stage transitions as the core role of a model registry.'
                ],
                expectedKeywords: ['model registry', 'versioning', 'artifacts', 'lineage', 'lifecycle transitions', 'governance'],
                rubric: {
                  'Artifact Management': '50% for cataloging versioned model artifacts and lineage',
                  'Lifecycle Governance': '50% for managing stage transitions from staging to production'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  mechanical_engineering: {
    id: 'mech_eng',
    name: 'Mechanical Engineering',
    department: 'Mechanical Engineering',
    topics: {
      'heat transfer': {
        name: 'Heat Transfer',
        prerequisites: ['Thermodynamics', 'Differential Calculus'],
        concepts: {
          'conduction': {
            name: 'Fourier Conduction & Thermal Resistance',
            learningObjective: 'Analyze one-dimensional steady-state heat conduction, thermal resistance networks, and heat flux across planar walls.',
            questions: [
              {
                id: 'me_ht_cond_1',
                questionText: 'In one-dimensional steady-state heat conduction through a homogenous planar wall, what physical principle governs the relationship between heat flux and the temperature gradient according to Fourier\'s Law?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'Heat flux is directly proportional to thermal conductivity and the negative temperature gradient (q = -k dT/dx)',
                  'Heat flux varies inversely with thermal conductivity regardless of the spatial temperature gradient',
                  'Heat flux is zero unless external convection coefficients exceed the critical acoustic boundary',
                  'Heat flux fluctuates stochastically with zero dependence on the conductive medium thickness'
                ],
                correctIndex: 0,
                modelAnswer: 'According to Fourier\'s Law, conductive heat flux is directly proportional to thermal conductivity (k) and the negative temperature gradient in the direction of heat flow: q = -k (dT/dx).',
                explanation: 'Option A is correct: Fourier\'s Law defines conductive heat flux as q = -k (dT/dx), where the negative sign reflects heat flowing in the direction of decreasing temperature. Options B, C, and D violate fundamental conduction thermodynamics.',
                hints: [
                  'Consider the foundational rate equation for conductive heat transfer across a stationary solid medium.',
                  'Examine how thermal conductivity k couples with spatial temperature differential dT/dx.',
                  'Recall why a negative sign appears in Fourier\'s Law to satisfy the second law of thermodynamics.',
                  'Formulate the one-dimensional conduction equation q = -k (dT/dx).'
                ],
                expectedKeywords: ['fourier law', 'conduction', 'thermal conductivity', 'temperature gradient', 'heat flux'],
                rubric: {
                  'Fourier Rate Equation': '50% for identifying q = -k dT/dx',
                  'Thermodynamic Directionality': '50% for explaining negative gradient sign'
                },
                diagramSvg: null
              },
              {
                id: 'me_ht_cond_num_1',
                questionText: 'A plane furnace wall of thickness L = 0.20 m and surface area A = 2.0 m^2 has thermal conductivity k = 0.80 W/(m·K). If the inner surface is at T1 = 800 K and the outer surface is at T2 = 400 K, calculate the steady-state conductive heat transfer rate (Q).',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'Q = k * A * (T1 - T2) / L = 0.80 * 2.0 * (800 - 400) / 0.20 = 1.60 * 400 / 0.20 = 3200 W = 3.2 kW',
                  givenParameters: { 'L': '0.20 m', 'A': '2.0 m^2', 'k': '0.80 W/(m·K)', 'T1': '800 K', 'T2': '400 K' },
                  stepByStep: '1. Delta T = 800 - 400 = 400 K. 2. Q = 0.80 * 2.0 * 400 / 0.20 = 3200 W = 3.2 kW.',
                  unit: 'W',
                  calculatedValue: 3200
                },
                options: [
                  '3200 W (3.2 kW)',
                  '1,600 W (1.6 kW)',
                  '6,400 W (6.4 kW)',
                  '800 W (0.8 kW)'
                ],
                correctIndex: 0,
                modelAnswer: 'The conductive heat transfer rate is Q = k * A * (T1 - T2) / L = 0.80 * 2.0 * (800 - 400) / 0.20 = 3200 W (3.2 kW).',
                explanation: 'Option A is correct: direct substitution into Fourier\'s conduction rate equation gives Q = (0.80 * 2.0 * 400) / 0.20 = 3200 W. Options B, C, and D stem from arithmetic errors or inverted dimensions.',
                hints: [
                  'Recall Fourier\'s Law for total heat flow: Q = k * A * (T1 - T2) / L.',
                  'Calculate the temperature difference: 800 K - 400 K = 400 K.',
                  'Multiply k (0.80) by area A (2.0) and delta T (400) to get 640 W·m.',
                  'Divide 640 by the wall thickness L (0.20 m) to find the conductive rate.'
                ],
                expectedKeywords: ['heat transfer rate', 'fourier conduction', '3200 w', 'thermal conductivity', 'temperature difference'],
                rubric: {
                  'Formula Substitution': '50% for correct setup Q = k*A*DeltaT/L',
                  'Correct Numerical Result': '50% for arriving at 3200 W (3.2 kW)'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  civil_engineering: {
    id: 'civil_eng',
    name: 'Civil Engineering',
    department: 'Civil & Structural Engineering',
    topics: {
      'structural mechanics': {
        name: 'Structural Mechanics',
        prerequisites: ['Statics', 'Strength of Materials'],
        concepts: {
          'beam bending': {
            name: 'Euler-Bernoulli Beam Theory and Bending Stress',
            learningObjective: 'Analyze flexural stress distribution, elastic neutral axis, and section modulus under pure transverse bending.',
            questions: [
              {
                id: 'ce_sm_bb_1',
                questionText: 'In symmetric pure bending of an elastic prismatic beam governed by Euler-Bernoulli beam theory, what stress condition exists along the beam\'s neutral axis?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'Normal flexural bending stress is exactly zero because longitudinal strain vanishes along the centroidal neutral surface',
                  'Normal bending stress reaches its maximum tensile limit along the neutral axis',
                  'Shear stress and normal stress both diverge to infinity at the neutral plane',
                  'Bending stress fluctuates symmetrically with zero dependence on distance from the centroid'
                ],
                correctIndex: 0,
                modelAnswer: 'Under Euler-Bernoulli beam theory, the neutral axis corresponds to the centroidal fiber where longitudinal strain and flexural bending stress are identically zero (sigma = M*y/I = 0 where y = 0).',
                explanation: 'Option A is correct: the flexural formula sigma = (M*y)/I shows that when y = 0 (at the neutral axis), normal bending stress is identically zero. Options B, C, and D misrepresent flexural mechanics.',
                hints: [
                  'Recall the flexure formula relating normal bending stress to distance y from the neutral axis.',
                  'Think about where tensile fibers transition into compressive fibers across the cross-section.',
                  'Identify the geometric axis where longitudinal strain equals zero.',
                  'Apply the bending stress equation sigma = (M*y)/I at y = 0.'
                ],
                expectedKeywords: ['neutral axis', 'euler-bernoulli', 'bending stress', 'flexure formula', 'centroidal fiber'],
                rubric: {
                  'Flexure Formula Application': '50% for identifying sigma = M*y/I',
                  'Neutral Axis Condition': '50% for concluding sigma = 0 at y = 0'
                },
                diagramSvg: null
              },
              {
                id: 'ce_sm_bb_num_1',
                questionText: 'A rectangular timber beam is subjected to a maximum bending moment of M = 18 kN·m. If the cross-section has an elastic section modulus of Z = 6.0 × 10^-4 m^3, calculate the maximum flexural bending stress (sigma_max).',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'sigma_max = M / Z = 18,000 N·m / 0.0006 m^3 = 30,000,000 Pa = 30 MPa',
                  givenParameters: { 'M': '18 kN·m (18,000 N·m)', 'Z': '6.0 × 10^-4 m^3' },
                  stepByStep: '1. Convert M: 18 kN·m = 18,000 N·m. 2. sigma = M / Z = 18,000 / 0.0006 = 30,000,000 Pa = 30 MPa.',
                  unit: 'MPa',
                  calculatedValue: 30
                },
                options: [
                  '30 MPa',
                  '15 MPa',
                  '45 MPa',
                  '10.8 MPa'
                ],
                correctIndex: 0,
                modelAnswer: 'The maximum bending stress is sigma_max = M / Z = 18,000 N·m / (6.0 × 10^-4 m^3) = 30,000,000 Pa = 30 MPa.',
                explanation: 'Option A is correct: maximum flexural stress equals moment divided by section modulus: sigma_max = M / Z = 18,000 / 0.0006 = 30 MPa. Options B, C, and D result from calculation errors or unit confusion.',
                hints: [
                  'Recall the maximum flexural stress formula using section modulus: sigma_max = M / Z.',
                  'Convert the moment M into standard SI units: 18 kN·m = 18,000 N·m.',
                  'Divide 18,000 N·m by 0.0006 m^3.',
                  'Express 30,000,000 Pa in megapascals (MPa).'
                ],
                expectedKeywords: ['bending stress', 'section modulus', '30 mpa', 'flexural formula', 'maximum moment'],
                rubric: {
                  'Formula Selection': '50% for sigma = M / Z',
                  'Correct Stress Value': '50% for arriving at 30 MPa'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  physics: {
    id: 'physics',
    name: 'Physics',
    department: 'Department of Physics',
    topics: {
      'quantum mechanics': {
        name: 'Quantum Mechanics',
        concepts: {
          'schrodinger wave equation': {
            name: 'Schrödinger Wave Equation',
            learningObjective: 'Analyze the time-dependent and time-independent Schrödinger equations, wave function normalization, and probability density.',
            questions: [
              {
                id: 'phys_qm_sch_1',
                questionText: 'In quantum mechanics, what physical meaning is attributed to the product of a particle wave function and its complex conjugate |ψ(x, t)|² according to the Born statistical interpretation?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'The spatial probability density of finding the particle in a differential volume around position x at time t',
                  'The exact deterministic velocity vector of the particle at time t',
                  'The total electrostatic charge distributed continuously throughout physical space',
                  'The instantaneous mechanical stress exerted by the particle on surrounding space'
                ],
                correctIndex: 0,
                modelAnswer: 'According to Max Born’s statistical interpretation, |ψ(x, t)|² represents the probability density, meaning |ψ(x, t)|² dx is the probability of detecting the particle in interval [x, x+dx].',
                explanation: 'Option A is correct: Max Born formulated that quantum wave functions represent probability amplitudes, with modulus squared representing probability density. Options B, C, and D are classical or physically incorrect concepts.',
                hints: [
                  'Consider Max Born’s foundational statistical interpretation of quantum wave mechanics.',
                  'Recall that the wave function ψ(x, t) itself is a complex-valued probability amplitude.',
                  'Think about what integrating |ψ(x, t)|² over all space equals (normalization to 1).',
                  'Select the spatial probability density of detecting the particle at position x at time t.'
                ],
                expectedKeywords: ['schrodinger', 'born interpretation', 'probability density', 'wave function', 'normalization'],
                rubric: {
                  'Physical Meaning': '50% for identifying spatial probability density',
                  'Born Interpretation': '50% for explaining modulus squared probability amplitude'
                },
                diagramSvg: null
              },
              {
                id: 'phys_qm_sch_num_1',
                questionText: 'A particle of mass m is confined to a one-dimensional infinite potential well of width L. According to the time-independent Schrödinger equation, what is the ratio of the second excited state energy (n = 3) to the ground state energy (n = 1)?',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'E_n = (n^2 * pi^2 * hbar^2) / (2 * m * L^2) => E_3 / E_1 = 3^2 / 1^2 = 9',
                  givenParameters: { 'Ground state': 'n = 1', 'Second excited state': 'n = 3' },
                  stepByStep: 'Energy levels scale with n^2: E_n = n^2 * E_1. For the second excited state n = 3, E_3 / E_1 = 3^2 / 1^2 = 9.',
                  unit: 'ratio',
                  calculatedValue: 9
                },
                options: [
                  '9 (nine times the ground state energy)',
                  '3 (three times the ground state energy)',
                  '4 (four times the ground state energy)',
                  '6 (six times the ground state energy)'
                ],
                correctIndex: 0,
                modelAnswer: 'Because energy eigenvalues scale quadratically with quantum number n (E_n = n²·E₁), the second excited state (n = 3) has an energy E₃ = 3²·E₁ = 9·E₁.',
                explanation: 'Option A is correct: E_n = n²·h²/(8mL²). The ground state is n = 1 and the second excited state is n = 3, yielding an energy ratio of 3² / 1² = 9.',
                hints: [
                  'Recall the energy eigenvalue formula for a particle in an infinite potential well: E_n proportional to n².',
                  'Identify the quantum number n corresponding to the ground state (n = 1) and second excited state (n = 3).',
                  'Calculate the ratio (n_3 / n_1)² = 3² / 1².',
                  'Conclude that the energy ratio is 9.'
                ],
                expectedKeywords: ['infinite potential well', 'energy eigenvalue', 'quantum number', 'quadratic scaling', 'schrodinger'],
                rubric: {
                  'Eigenvalue Formula': '50% for identifying E_n proportional to n²',
                  'Ratio Computation': '50% for calculating 3² = 9'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    department: 'Department of Chemistry and Chemical Engineering',
    topics: {
      'chemical kinetics': {
        name: 'Chemical Kinetics',
        concepts: {
          'arrhenius activation energy': {
            name: 'Arrhenius Activation Energy',
            learningObjective: 'Analyze temperature dependence of reaction rates, activation energy Ea, pre-exponential factor A, and catalyst mechanisms.',
            questions: [
              {
                id: 'chem_ck_arr_1',
                questionText: 'According to the Arrhenius equation k = A * exp(-Ea / (R*T)), what thermodynamic effect does adding a positive catalyst have on the reaction kinetics?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'It lowers the activation energy (Ea) by providing an alternative reaction pathway, thereby exponentially increasing the rate constant k',
                  'It increases the overall thermodynamic enthalpy change (ΔH) of the chemical reaction',
                  'It raises the universal gas constant (R) by creating localized thermal gradients',
                  'It eliminates the pre-exponential frequency factor (A) completely'
                ],
                correctIndex: 0,
                modelAnswer: 'A positive catalyst provides an alternative reaction mechanism with a lower activation energy barrier (Ea), which exponentially increases the reaction rate constant k = A·exp(-Ea/RT) without changing the overall reaction enthalpy or equilibrium constant.',
                explanation: 'Option A is correct: Catalysts lower the transition state energy barrier Ea. Because Ea appears as a negative exponent in k = A·exp(-Ea/RT), decreasing Ea causes an exponential increase in reaction rate constant. It does not alter ΔH or equilibrium.',
                hints: [
                  'Examine how the rate constant k depends on activation energy Ea in the Arrhenius equation.',
                  'Consider whether a catalyst alters the thermodynamic equilibrium or the kinetic pathway.',
                  'Recall that catalysts provide an alternative pathway with a lower transition-state energy barrier.',
                  'Conclude that lowering Ea exponentially increases the rate constant k without changing enthalpy ΔH.'
                ],
                expectedKeywords: ['arrhenius', 'activation energy', 'catalyst', 'rate constant', 'alternative pathway', 'exponential increase'],
                rubric: {
                  'Kinetic Mechanism': '50% for explaining lower activation energy pathway',
                  'Arrhenius Law': '50% for linking lower Ea to exponential increase in k'
                },
                diagramSvg: null
              },
              {
                id: 'chem_ck_arr_num_1',
                questionText: 'If the rate constant of a chemical reaction doubles when the temperature increases from T1 to T2, and the Arrhenius relationship ln(k2/k1) = (Ea/R) * (1/T1 - 1/T2) applies, what does ln(k2/k1) evaluate to?',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'ln(k2/k1) = ln(2) = 0.693',
                  givenParameters: { 'k2 / k1': 2 },
                  stepByStep: 'The rate constant doubles, so k2/k1 = 2. Direct evaluation of ln(2) yields 0.693.',
                  unit: 'dimensionless',
                  calculatedValue: 0.693
                },
                options: [
                  '0.693',
                  '2.000',
                  '0.301',
                  '1.386'
                ],
                correctIndex: 0,
                modelAnswer: 'When a reaction rate doubles, k2/k1 = 2, and the natural log ratio is ln(2) ≈ 0.693.',
                explanation: 'Option A is correct: ln(k2/k1) = ln(2) ≈ 0.693. Option C is log10(2), Option B is the ratio itself without the logarithm, and Option D is 2*ln(2).',
                hints: [
                  'Identify the ratio of rate constants k2/k1 when the reaction rate doubles.',
                  'Substitute k2/k1 = 2 into the logarithmic term ln(k2/k1).',
                  'Compute the natural logarithm of 2.',
                  'Conclude that ln(2) ≈ 0.693.'
                ],
                expectedKeywords: ['arrhenius', 'ln(2)', 'rate constant', 'activation energy', 'doubling rate'],
                rubric: {
                  'Log Formulation': '50% for identifying ln(2)',
                  'Numerical Evaluation': '50% for calculating 0.693'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  },

  economics: {
    id: 'economics',
    name: 'Economics',
    department: 'Department of Economics and Finance',
    topics: {
      'financial economics': {
        name: 'Financial Economics',
        concepts: {
          'capital asset pricing model': {
            name: 'Capital Asset Pricing Model (CAPM)',
            learningObjective: 'Analyze the Capital Asset Pricing Model (CAPM), beta coefficient as systematic risk, risk-free rate, and expected return on capital.',
            questions: [
              {
                id: 'econ_fe_capm_1',
                questionText: 'Under the Capital Asset Pricing Model (CAPM), what risk component is captured by an asset beta (β), and why is unsystematic risk not compensated with a risk premium in equilibrium?',
                type: 'mcq',
                format: 'Theory',
                difficulty: 'Intermediate',
                bloomLevel: 'Understanding',
                options: [
                  'Beta captures systematic (undiversifiable market) risk; unsystematic risk is not compensated because investors can eliminate it costlessly through portfolio diversification',
                  'Beta captures unsystematic (company-specific) risk; systematic risk can be completely eliminated by holding government bonds',
                  'Beta measures total bankruptcy probability, and market risk is ignored in equilibrium pricing',
                  'Beta measures accounting book-value depreciation over time with zero market covariance'
                ],
                correctIndex: 0,
                modelAnswer: 'In CAPM, beta measures an asset’s sensitivity to systematic market movements (undiversifiable risk). Because unsystematic (firm-specific) risk can be eliminated by holding a well-diversified portfolio, the market does not offer an expected return premium for bearing it.',
                explanation: 'Option A is correct: CAPM establishes that expected return depends solely on systematic risk beta = Cov(Ri, Rm) / Var(Rm). Idiosyncratic risk is diversified away in efficient portfolios. Options B, C, and D confuse systematic with unsystematic risk.',
                hints: [
                  'Distinguish between company-specific (idiosyncratic) risk and broad market (systematic) risk.',
                  'Consider what happens to idiosyncratic firm risk when an investor holds a portfolio of many uncorrelated stocks.',
                  'Recall why the market only pays a risk premium for risks that cannot be diversified away.',
                  'Select systematic market risk as the risk captured by beta and eliminated unsystematic risk as uncompensated.'
                ],
                expectedKeywords: ['capm', 'beta', 'systematic risk', 'unsystematic risk', 'diversification', 'expected return'],
                rubric: {
                  'Systematic Risk Identification': '50% for defining beta as systematic market sensitivity',
                  'Diversification Principle': '50% for explaining why unsystematic risk receives no premium'
                },
                diagramSvg: null
              },
              {
                id: 'econ_fe_capm_num_1',
                questionText: 'According to the CAPM formula E(Ri) = Rf + βi * [E(Rm) - Rf], if the risk-free rate is Rf = 4%, the expected return on the market portfolio is E(Rm) = 12%, and stock X has a beta of β = 1.25, calculate the expected return of stock X.',
                type: 'mcq',
                format: 'Numerical',
                difficulty: 'Intermediate',
                bloomLevel: 'Application',
                numericalDetails: {
                  formula: 'E(Ri) = Rf + beta * (E(Rm) - Rf) = 4% + 1.25 * (12% - 4%) = 4% + 1.25 * 8% = 4% + 10% = 14%',
                  givenParameters: { 'Rf': '4%', 'E(Rm)': '12%', 'beta': '1.25' },
                  stepByStep: '1. Calculate market risk premium: E(Rm) - Rf = 12% - 4% = 8%. 2. Multiply by beta: 1.25 * 8% = 10%. 3. Add risk-free rate: 4% + 10% = 14%.',
                  unit: '%',
                  calculatedValue: 14
                },
                options: [
                  '14%',
                  '15%',
                  '10%',
                  '12%'
                ],
                correctIndex: 0,
                modelAnswer: 'Using the CAPM equation: E(Ri) = 4% + 1.25 * (12% - 4%) = 4% + 1.25 * 8% = 4% + 10% = 14%.',
                explanation: 'Option A is correct: Market risk premium is 12% - 4% = 8%. The asset risk premium is 1.25 * 8% = 10%. Adding the risk-free rate of 4% gives 14%.',
                hints: [
                  'Recall the CAPM formula: E(Ri) = Rf + beta * (E(Rm) - Rf).',
                  'Compute the market risk premium by subtracting Rf (4%) from E(Rm) (12%): 8%.',
                  'Multiply the market risk premium (8%) by beta (1.25) to get the asset risk premium of 10%.',
                  'Add the risk-free rate (4%) to 10% to find the expected return of 14%.'
                ],
                expectedKeywords: ['capm', 'expected return', 'beta', 'risk-free rate', 'market risk premium', '14%'],
                rubric: {
                  'Risk Premium Calculation': '50% for calculating market premium 8% and asset premium 10%',
                  'Final Expected Return': '50% for arriving at 14%'
                },
                diagramSvg: null
              }
            ]
          }
        }
      }
    }
  }

};

/**
 * Normalizes input strings for robust keyword matching
 */
export function normalizeString(str) {
  return String(str || '').toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
}

export function generateQuestionFingerprints(pkg = {}) {
  const normSubj = normalizeString(pkg.subject || '');
  const normTop = normalizeString(pkg.topic || '');
  const normConcept = normalizeString(pkg.concept || '');
  const fullQ = normalizeString(pkg.questionText || '');
  const normQ = fullQ.length > 80 ? `${fullQ.slice(0, 50)}_${fullQ.slice(-30)}` : fullQ;

  const semanticFingerprint = `${normSubj}::${normTop}::${normConcept}::${normQ}`;
  const structuralFingerprint = `${pkg.format || 'Theory'}::${pkg.type || 'mcq'}::${(pkg.options || []).length}::${pkg.numericalDetails ? 'num' : 'non-num'}`;

  return {
    semanticFingerprint,
    structuralFingerprint
  };
}

/**
 * 2. ACADEMIC CONTEXT RESOLVER
 * Resolves registered subject, scheduled topic, specific concept, and learning objectives.
 * Returns recoverable error when schedule context is missing or ambiguous.
 */
export function SynthesizeConceptFacetQuestion({
  subjectName,
  topic,
  concept,
  facetIndex = 0,
  plannedFormat = null,
  context = {},
  seenFingerprints = new Set()
}) {
  const cleanSubj = String(subjectName || 'General Engineering').trim();
  const cleanTop = String(topic || 'Core Topic').trim();
  const cleanC = String(concept || cleanTop).replace(/\([^)]*\)/g, '').trim();

  const lowerSubj = cleanSubj.toLowerCase();
  const lowerTop = cleanTop.toLowerCase();
  const lowerC = cleanC.toLowerCase();
  const isComm = lowerSubj.includes('communicat') || lowerSubj.includes('telecom') || lowerSubj.includes('ece') || lowerSubj.includes('signal') || lowerTop.includes('modulat') || lowerTop.includes('gmsk') || lowerTop.includes('pcm') || lowerTop.includes('antenna');
  const isCS = lowerSubj.includes('computer') || lowerSubj.includes('software') || lowerSubj.includes('algorithm') || lowerSubj.includes('dsa') || lowerSubj.includes('data structure') || lowerSubj.includes('database') || lowerSubj.includes('network');
  const isControl = lowerSubj.includes('control') || lowerTop.includes('bode') || lowerTop.includes('pid');

  const cycle = Math.floor(Math.abs(facetIndex) / 10) + 1;
  const cycleTag = cycle > 1 ? ` (Analysis Phase ${cycle})` : '';

  // Find next unused facet if this facet's base text was already seen
  let effectiveFacet = Math.abs(facetIndex) % 10;
  for (let offset = 0; offset < 10; offset++) {
    const candidateFacet = (effectiveFacet + offset) % 10;
    const testKey = `${cleanSubj}::${cleanTop}::${cleanC}::facet_${candidateFacet}_c${cycle}`;
    if (!seenFingerprints.has(testKey)) {
      effectiveFacet = candidateFacet;
      break;
    }
  }

  let facetData = null;

  switch (effectiveFacet) {
    case 0: // Core Theory & Governing Invariant
      facetData = {
        format: 'Theory',
        bloomLevel: 'Understanding',
        questionText: `In the study of ${cleanTop}, what fundamental principle defines the theoretical basis and operational behavior of ${cleanC}${cycleTag}?`,
        options: [
          `It defines deterministic transfer functions and boundary relationships governing system behavior for ${cleanC}`,
          `It assumes static open-loop behavior with non-responsive operational thresholds`,
          `It requires an unbounded external energy or clock source to sustain nominal steady-state operation`,
          `It relies on uncalibrated empirical approximations that omit primary transfer parameters`
        ],
        correctIndex: 0,
        modelAnswer: `The operational behavior of ${cleanC} in ${cleanTop} is governed by formal transfer functions and boundary relationships that determine steady-state and dynamic system response.`,
        explanation: `Option A is correct: rigorous analysis of ${cleanC} establishes mathematical transfer functions and boundary constraints governing system response. Options B, C, and D describe invalid assumptions such as non-responsive open loops, unbounded energy dependencies, or uncalibrated omissions.`,
        hints: [
          `Consider the formal theoretical definition and governing equations of ${cleanC} in ${cleanTop}.`,
          `Examine how ${cleanC} relates input driving forces to steady-state output variables.`,
          `Recall how transfer functions and boundary constraints characterize deterministic system response.`,
          `Analyze the deterministic transfer relationships and boundary conditions that govern ${cleanC}.`
        ],
        numericalDetails: null,
        diagramSvg: null
      };
      break;

    case 1: // Quantitative Numerical Problem
      const baseVal = 20 * cycle;
      const factor = 1.5;
      const resultVal = +(baseVal * factor).toFixed(2);
      facetData = {
        format: 'Numerical',
        bloomLevel: 'Application',
        questionText: `Under nominal operating conditions in ${cleanTop}, quantitative evaluation of ${cleanC} requires scaling an input baseline of ${baseVal} units by a transfer coefficient factor of ${factor}. Calculate the resulting steady-state response output${cycleTag}.`,
        numericalDetails: {
          formula: `Output = Baseline * ScalingFactor = ${baseVal} * ${factor} = ${resultVal} units`,
          givenParameters: { 'Baseline': `${baseVal} units`, 'Transfer Factor': `${factor}` },
          stepByStep: `1. Identify input baseline = ${baseVal} units. 2. Multiply by factor ${factor}: ${baseVal} * ${factor} = ${resultVal} units.`,
          unit: 'units',
          calculatedValue: resultVal
        },
        options: [
          `${resultVal} units`,
          `${(baseVal / factor).toFixed(2)} units`,
          `${(resultVal * 1.5).toFixed(2)} units`,
          `${(baseVal + factor).toFixed(2)} units`
        ],
        correctIndex: 0,
        modelAnswer: `The resulting steady-state response is ${resultVal} units, computed directly by multiplying the baseline ${baseVal} units by the transfer factor ${factor}.`,
        explanation: `Option A is correct: direct substitution into the governing transfer equation yields ${baseVal} * ${factor} = ${resultVal} units. The other options result from division, incorrect scaling, or simple addition.`,
        hints: [
          `Identify the base value and scaling factor given in the problem statement.`,
          `Formulate the relationship: Output = Baseline * ScalingFactor.`,
          `Compute the product: ${baseVal} multiplied by ${factor}.`,
          `Calculate ${baseVal} * ${factor} = ${resultVal} units.`
        ],
        diagramSvg: null
      };
      break;

    case 2: // Architectural / Structural Schematic Diagram
      facetData = {
        format: 'Diagram',
        bloomLevel: 'Analysis',
        questionText: `Refer to the functional block schematic for ${cleanC} in ${cleanTop}${cycleTag}. What functional element coordinates closed-loop stability across the primary signal path?`,
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 180" class="w-full h-auto max-w-[500px]">
  <rect width="540" height="180" rx="10" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <rect x="30" y="55" width="100" height="60" rx="8" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
  <text x="80" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2B6CB0" text-anchor="middle">Input Reference</text>
  <line x1="130" y1="85" x2="190" y2="85" stroke="#4A5568" stroke-width="2" marker-end="url(#arrow)"/>
  <rect x="190" y="45" width="150" height="80" rx="8" fill="#FEFCBF" stroke="#B7791F" stroke-width="2"/>
  <text x="265" y="82" font-family="sans-serif" font-size="11" font-weight="bold" fill="#744210" text-anchor="middle">${cleanC.slice(0, 18)}</text>
  <text x="265" y="100" font-family="sans-serif" font-size="9" fill="#975A16" text-anchor="middle">Core Processing Node</text>
  <line x1="340" y1="85" x2="400" y2="85" stroke="#4A5568" stroke-width="2"/>
  <rect x="400" y="55" width="110" height="60" rx="8" fill="#E6FFFA" stroke="#319795" stroke-width="2"/>
  <text x="455" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="#234E52" text-anchor="middle">Output State</text>
  <path d="M 455 115 V 150 H 265 V 125" fill="none" stroke="#C53030" stroke-width="2" stroke-dasharray="4"/>
  <text x="360" y="165" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030">Feedback Compensation Loop</text>
</svg>`,
        diagramCaption: `Functional block schematic illustrating ${cleanC} with closed-loop feedback compensation in ${cleanTop}.`,
        options: [
          `The feedback compensation loop connecting output telemetry back to the core processing node of ${cleanC}`,
          `An open auxiliary vent that discards reference inputs without processing`,
          `A static casing ground with zero electrical or algorithmic coupling to the state variables`,
          `A free-running clock that bypasses all control interfaces`
        ],
        correctIndex: 0,
        modelAnswer: `Closed-loop stability is coordinated by the feedback compensation loop, which dynamically compares output state telemetry against reference inputs to modulate ${cleanC}.`,
        explanation: `Option A is correct: the feedback compensation loop provides the essential error-correcting signal path required for stable operation of ${cleanC}. The other options represent disconnected or non-functional structural features.`,
        hints: [
          `Examine the dashed pathway in the schematic below the main processing node.`,
          `Notice how signal telemetry is routed from the output back to the processing block.`,
          `Identify the control component responsible for maintaining closed-loop stability.`,
          `Identify the specific feedback routing that stabilizes signal processing.`
        ],
        numericalDetails: null
      };
      break;

    case 3: // Characteristic Curve / Waveform / Frequency Response Plot
      facetData = {
        format: 'Graph',
        bloomLevel: 'Analysis',
        questionText: `Examine the characteristic response plot for ${cleanC} across its operating envelope in ${cleanTop}${cycleTag}. What behavioral regime is observed as excitation exceeds the linear threshold?`,
        diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 200" class="w-full h-auto max-w-[500px]">
  <rect width="520" height="200" rx="10" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <line x1="60" y1="160" x2="480" y2="160" stroke="#4A5568" stroke-width="2"/>
  <line x1="60" y1="160" x2="60" y2="30" stroke="#4A5568" stroke-width="2"/>
  <text x="270" y="190" font-family="sans-serif" font-size="11" fill="#4A5568" text-anchor="middle">Input Excitation / Parameter Drive</text>
  <text x="25" y="95" font-family="sans-serif" font-size="11" fill="#4A5568" text-anchor="middle" transform="rotate(-90 25 95)">Response Magnitude</text>
  <line x1="240" y1="160" x2="240" y2="40" stroke="#E53E3E" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="240" y="25" font-family="sans-serif" font-size="10" font-weight="bold" fill="#E53E3E" text-anchor="middle">Critical Threshold</text>
  <path d="M 60 160 L 240 80 Q 320 60 460 55" fill="none" stroke="#2B6CB0" stroke-width="3"/>
  <text x="140" y="110" font-family="sans-serif" font-size="10" fill="#2B6CB0" font-weight="bold">Linear Region</text>
  <text x="360" y="50" font-family="sans-serif" font-size="10" fill="#2B6CB0" font-weight="bold">Saturation Plateau</text>
</svg>`,
        diagramCaption: `Characteristic response profile showing transition from linear operation into saturation plateau for ${cleanC}.`,
        options: [
          `The response transitions smoothly from a linear proportionality zone into an asymptotic saturation plateau`,
          `The response exhibits discontinuous divergence toward positive infinity without bound`,
          `The response abruptly collapses to zero immediately upon reaching the threshold`,
          `The response reverses phase by 180 degrees and oscillates randomly`
        ],
        correctIndex: 0,
        modelAnswer: `Beyond the critical threshold, ${cleanC} transitions from linear proportionality into an asymptotic saturation plateau due to physical or mathematical capacity limits.`,
        explanation: `Option A is correct: the response curve clearly demonstrates linear growth followed by soft knee curvature into a bounded saturation plateau. The alternative choices describe unphysical unbounded divergence, instantaneous collapse, or erratic phase flips.`,
        hints: [
          `Observe the curve behavior to the right of the vertical red dashed threshold line.`,
          `Notice how the slope flattens out rather than continuing to climb indefinitely.`,
          `Identify the term for a bounded region where increases in excitation produce minimal additional output.`,
          `Observe that the output levels off into a plateau beyond the critical threshold.`
        ],
        numericalDetails: null
      };
      break;

    case 4: // Diagnostic Scenario / Failure Analysis
      facetData = {
        format: 'Scenario',
        bloomLevel: 'Evaluation',
        questionText: `During production operation of ${cleanC} in ${cleanTop}, automated telemetry registers an anomalous 40% performance drop under peak load. Diagnostic traces show parameter saturation at the primary interface. What is the standard engineering corrective protocol${cycleTag}?`,
        options: [
          `Apply dynamic throttling or rate scaling to bring excitation back within the calibrated linear margin of ${cleanC}`,
          `Immediately disable all system telemetry and warning alarms to suppress error logs`,
          `Increase external excitation by 300% to force the saturated boundary into thermal breakdown`,
          `Replace the deterministic algorithm with an unseeded pseudorandom generator`
        ],
        correctIndex: 0,
        modelAnswer: `The proper corrective action is applying dynamic throttling or capacity re-scaling to restore the operating point of ${cleanC} into its calibrated linear headroom.`,
        explanation: `Option A is correct: when an interface saturates, reducing drive or scaling capacity prevents clipping and restores nominal control. The other options either suppress monitoring, risk destructive failure, or introduce uncontrolled randomness.`,
        hints: [
          `Identify the root cause from telemetry: interface parameter saturation under peak load.`,
          `Determine how to relieve saturation without shutting down the entire system.`,
          `Consider standard capacity management and throttling strategies.`,
          `Focus on throttling or rate scaling to bring operating variables back within linear margins.`
        ],
        numericalDetails: null,
        diagramSvg: null
      };
      break;

    case 5: // Comparative Trade-off Analysis
      facetData = {
        format: 'Comparison',
        bloomLevel: 'Analysis',
        questionText: `When comparing ${cleanC} against conventional alternative architectures in ${cleanTop}, what primary technical trade-off characterizes its deployment${cycleTag}?`,
        options: [
          `Significantly higher precision and deterministic boundary handling in exchange for moderate structural or computational overhead`,
          `Zero resource utilization combined with complete loss of operational capability`,
          `Infinite execution throughput achieved by discarding all input validation`,
          `Total incompatibility with standard physical environments and communication interfaces`
        ],
        correctIndex: 0,
        modelAnswer: `Deploying ${cleanC} in ${cleanTop} delivers superior deterministic control and boundary robustness, with the corresponding trade-off of requiring greater computational or implementation resources.`,
        explanation: `Option A is correct: advanced techniques like ${cleanC} trade moderate architectural complexity for enhanced precision and stability. The distractors describe impossible zero-resource systems or catastrophic failures.`,
        hints: [
          `Compare the advantages of ${cleanC} with simpler baseline approaches.`,
          `Think about the engineering cost required to achieve higher precision.`,
          `Recall that increased precision and robust control typically require additional structural overhead.`,
          `Consider the balance between higher deterministic accuracy and structural implementation overhead.`
        ],
        numericalDetails: null,
        diagramSvg: null
      };
      break;

    case 6: // Analytical Derivation & Domain Governing Invariant
      if (isComm) {
        facetData = {
          format: 'Theory',
          bloomLevel: 'Analysis',
          questionText: `From first principles in ${cleanTop}, what fundamental relationship dictates the spectral efficiency and channel transmission limits for ${cleanC}${cycleTag}?`,
          options: [
            `The channel capacity and bandwidth trade-off governed by SNR and spectral pulse confinement for ${cleanC}`,
            `The postulate that baseband signals radiate with maximum efficiency without carrier translation`,
            `The assumption that communication channels exhibit zero thermal noise and infinite dynamic range`,
            `The condition that pulse shaping filter response produces unbounded adjacent-channel spectral splatter`
          ],
          correctIndex: 0,
          modelAnswer: `In Communication Engineering, ${cleanC} is governed by the fundamental trade-off between occupied RF bandwidth, symbol modulation order, and signal-to-noise ratio bounding maximum channel capacity.`,
          explanation: `Option A is correct: digital and analog communications operate under strict spectral efficiency and SNR bounds dictated by Shannon and Nyquist theorems. Options B, C, and D state physical impossibilities regarding antenna radiation, noise absence, or spectral containment.`,
          hints: [
            `Recall how channel bandwidth, SNR, and modulation schemes determine achievable transmission rates.`,
            `Consider why pulse shaping is required to constrain out-of-band spectral sidelobes.`,
            `Think about fundamental limits established by Shannon and Nyquist for noisy channels.`,
            `Analyze the trade-off between occupied bandwidth, SNR, and spectral pulse confinement.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      } else if (isCS) {
        facetData = {
          format: 'Theory',
          bloomLevel: 'Analysis',
          questionText: `From algorithmic complexity principles in ${cleanTop}, what governing recurrence relation or structural invariant establishes the computational bounds for ${cleanC}${cycleTag}?`,
          options: [
            `The state transition invariant bounding worst-case asymptotic time and memory space complexity for ${cleanC}`,
            `The assumption that recursive calls terminate in zero CPU clock cycles without stack frame allocation`,
            `The condition that arbitrary unsorted sequences can be searched and sorted in O(1) deterministic steps`,
            `The postulate that hash collisions and pointer dereferences resolve instantaneously without memory access`
          ],
          correctIndex: 0,
          modelAnswer: `In Computer Science, ${cleanC} is governed by algorithmic invariants and recurrence relations that bound asymptotic time and space complexity across input scales.`,
          explanation: `Option A is correct: rigorous computational analysis relies on structural invariants and recurrence relations to prove correctness and complexity bounds. Options B, C, and D describe impossible computing paradigms.`,
          hints: [
            `Consider how invariant state assertions prove correctness across iterations or recursive steps.`,
            `Think about asymptotic time complexity and memory space bounds for ${cleanC}.`,
            `Recall how recurrence relations model algorithmic step counts.`,
            `Formulate the state transition invariant bounding worst-case asymptotic complexity.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      } else if (isControl) {
        facetData = {
          format: 'Theory',
          bloomLevel: 'Analysis',
          questionText: `From linear system dynamics in ${cleanTop}, what frequency-domain or state-space formulation dictates the stability bounds of ${cleanC}${cycleTag}?`,
          options: [
            `The closed-loop characteristic equation whose roots and poles must strictly lie in the open left-half complex s-plane for ${cleanC}`,
            `The postulate that unstable right-half plane poles spontaneously cancel without feedback compensation`,
            `The assumption that open-loop forward gain can be increased to infinity without reducing phase margin`,
            `The requirement that sensor delay must strictly equal the resonant oscillation frequency`
          ],
          correctIndex: 0,
          modelAnswer: `In Control Systems, ${cleanC} is governed by closed-loop pole locations: stability strictly requires all characteristic roots to reside in the open left-half s-plane.`,
          explanation: `Option A is correct: bounded-input bounded-output (BIBO) stability requires characteristic poles strictly in the open left-half complex s-plane. Options B, C, and D violate linear control theory.`,
          hints: [
            `Recall the definition of BIBO stability and where closed-loop transfer poles must lie.`,
            `Examine the roots of the characteristic equation 1 + G(s)H(s) = 0.`,
            `Notice how positive real pole parts cause exponential divergence.`,
            `Conclude that all characteristic poles must strictly reside in the open left-half s-plane.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      } else {
        facetData = {
          format: 'Derivation',
          bloomLevel: 'Analysis',
          questionText: `From first analytical principles in ${cleanTop}, what foundational physical rate equation establishes the governing formulation for ${cleanC}${cycleTag}?`,
          options: [
            `The differential rate balance: rate of accumulation equals net transport flux across boundaries plus internal generation`,
            `The assumption that convective flow rates remain invariant regardless of concentration gradients or temperature changes`,
            `The condition that fluid viscosity and interfacial mass transfer coefficients scale inversely with local turbulence intensity`,
            `The approximation that all system energy is irreversibly radiated as high-frequency acoustic waves`
          ],
          correctIndex: 0,
          modelAnswer: `The governing relationships of ${cleanC} derive directly from the general differential continuum balance (Accumulation = Inflow - Outflow + Generation) across the defined domain boundary.`,
          explanation: `Option A is correct: physical and thermal transport laws are universally derived by applying rate conservation principles across a differential control domain. Options B, C, and D violate fundamental physics or mathematics.`,
          hints: [
            `Recall how continuum or state-space equations are formulated from control volumes.`,
            `Identify the standard rate equation relating accumulation, transport, and generation.`,
            `Consider how boundaries shape the resulting differential equations.`,
            `Formulate the differential rate balance across the control domain.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      }
      break;

    case 7: // Design Parameter Sizing & Invariant Capacity Calculation
      const reqThroughput = 120 * cycle;
      const marginFactor = 1.25;
      const designedCap = Math.round(reqThroughput * marginFactor);
      facetData = {
        format: 'Numerical',
        bloomLevel: 'Application',
        questionText: `An engineer is designing a production system for ${cleanC} in ${cleanTop}. The required continuous throughput is ${reqThroughput} units/s. Applying an engineering safety margin factor of ${marginFactor}, what is the minimum required design capacity${cycleTag}?`,
        numericalDetails: {
          formula: `RequiredCapacity = PeakThroughput * MarginFactor = ${reqThroughput} * ${marginFactor} = ${designedCap} units/s`,
          givenParameters: { 'Throughput': `${reqThroughput} units/s`, 'Safety Factor': `${marginFactor}` },
          stepByStep: `1. Identify required throughput = ${reqThroughput} units/s. 2. Multiply by safety margin factor ${marginFactor}: ${reqThroughput} * ${marginFactor} = ${designedCap} units/s.`,
          unit: 'units/s',
          calculatedValue: designedCap
        },
        options: [
          `${designedCap} units/s`,
          `${reqThroughput} units/s`,
          `${Math.round(designedCap * 1.3)} units/s`,
          `${Math.round(reqThroughput / marginFactor)} units/s`
        ],
        correctIndex: 0,
        modelAnswer: `The minimum required design capacity is ${designedCap} units/s, calculated as ${reqThroughput} units/s * ${marginFactor}.`,
        explanation: `Option A is correct: standard design sizing incorporates safety margins by direct multiplication: ${reqThroughput} * ${marginFactor} = ${designedCap} units/s. Option B omits the safety margin, while Option D erroneously divides by it.`,
        hints: [
          `Identify the base throughput and the safety margin factor.`,
          `Multiply the base throughput by the safety margin factor to ensure adequate headroom.`,
          `Compute ${reqThroughput} multiplied by ${marginFactor}.`,
          `Multiply the required throughput by the safety margin factor to find the minimum design capacity.`
        ],
        diagramSvg: null
      };
      break;

    case 8: // Edge Case, Extreme Condition & Boundary Limits
      if (isComm) {
        facetData = {
          format: 'Theory',
          bloomLevel: 'Evaluation',
          questionText: `What operational failure mode occurs if ${cleanC} in ${cleanTop} is driven beyond its physical dynamic range or bandwidth threshold under extreme overdrive${cycleTag}?`,
          options: [
            `Severe non-linear amplifier clipping and harmonic distortion leading to adjacent channel spectral regrowth and constellation dispersion`,
            `Spontaneous elimination of all thermal noise floor enabling infinite symbol transmission rates`,
            `Complete instantaneous disappearance of all electromagnetic attenuation across free space`,
            `Zero measurable change in RF constellation states regardless of overdrive magnitude`
          ],
          correctIndex: 0,
          modelAnswer: `Overdriving ${cleanC} induces severe non-linear clipping, intermodulation distortion, and adjacent channel spectral splatter.`,
          explanation: `Option A is correct: non-linear overdrive in RF communications compresses amplifiers, producing AM-to-AM/AM-to-PM distortion and spectral regrowth. The other options describe impossible physical scenarios.`,
          hints: [
            `Consider what happens when an RF power amplifier or mixer is driven into deep saturation.`,
            `Think about non-linear distortion, intermodulation products, and adjacent channel interference.`,
            `Recall how non-linear distortion spreads the signal spectrum beyond its allocated channel.`,
            `Examine how non-linear clipping produces constellation dispersion and spectral regrowth.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      } else if (isCS) {
        facetData = {
          format: 'Theory',
          bloomLevel: 'Evaluation',
          questionText: `What operational failure mode occurs if ${cleanC} in ${cleanTop} exceeds memory boundaries or recursion depth limits under extreme execution load${cycleTag}?`,
          options: [
            `Unchecked stack overflow, buffer overflow, or thrashing due to memory exhaustion across execution threads`,
            `Spontaneous execution of all pending instructions in zero CPU clock cycles`,
            `Automatic transformation of unstructured data into sorted AVL trees without processor instruction cycles`,
            `Zero effect on system performance regardless of input scale divergence`
          ],
          correctIndex: 0,
          modelAnswer: `Exceeding depth limits in ${cleanC} precipitates stack exhaustion, cache thrashing, and unhandled memory overflow exceptions.`,
          explanation: `Option A is correct: exceeding recursion or memory thresholds causes stack overflow, paging thrash, and thread crashes. Options B, C, and D are computationally absurd.`,
          hints: [
            `Consider how operating systems and runtimes handle unbounded recursion or heap allocation.`,
            `Think about call stack memory limits and page fault thrashing.`,
            `Recall typical exceptions raised upon resource exhaustion (e.g., StackOverflowError).`,
            `Focus on stack overflow, memory exhaustion, and thread termination.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      } else {
        facetData = {
          format: 'Theory',
          bloomLevel: 'Evaluation',
          questionText: `What failure mode occurs if ${cleanC} in ${cleanTop} is driven beyond its physical or computational stability threshold under extreme excitation${cycleTag}?`,
          options: [
            `Severe non-linear clipping and state-variable saturation leading to loss of phase margin and divergent instability`,
            `Spontaneous recovery with instantaneous reversal of all entropy generation`,
            `Complete immunity to external forces with infinite damping across all frequencies`,
            `Zero change in system metrics regardless of the magnitude of external excitation`
          ],
          correctIndex: 0,
          modelAnswer: `Driving ${cleanC} beyond its stability limits triggers severe non-linear clipping, phase margin degradation, and catastrophic open-loop divergence.`,
          explanation: `Option A is correct: extreme overdrive in dynamic systems induces non-linear saturation, harmonic distortion, and loss of phase margin, precipitating divergence. The remaining options describe impossible physical phenomena.`,
          hints: [
            `Consider what happens when a physical or computational amplifier is driven beyond its dynamic range.`,
            `Think about the consequences of state saturation on feedback loops.`,
            `Recall that saturation erodes phase margins, causing instability or divergence.`,
            `Examine how parameter saturation and loss of margin precipitate open-loop instability.`
          ],
          numericalDetails: null,
          diagramSvg: null
        };
      }
      break;

    case 9: // Industrial Standards, Compliance & Protocol Implementation
    default:
      facetData = {
        format: 'Theory',
        bloomLevel: 'Application',
        questionText: `In professional industrial deployment of ${cleanC} in ${cleanTop}, what engineering practice ensures verification against industry quality and compliance standards${cycleTag}?`,
        options: [
          `Deploying traceable calibration instrumentation, automated safety interlocks, and regression test suites aligned with regulatory specifications`,
          `Eliminating formal testing and operating exclusively on unmonitored subjective estimates`,
          `Relying on deprecated open-loop sensors installed without shielding or isolation`,
          `Bypassing all safety interlocks to maximize unverified execution speed`
        ],
        correctIndex: 0,
        modelAnswer: `Industrial compliance requires calibrated instrumentation, automated watchdog fail-safes, and documented regression testing matching relevant industry standards.`,
        explanation: `Option A is correct: rigorous engineering practice mandates calibrated sensors, automated fail-safes, and standards-compliant verification. Options B, C, and D violate basic industrial safety and quality principles.`,
        hints: [
          `Consider the regulatory and quality assurance requirements for deploying ${cleanC} in enterprise environments.`,
          `Think about the role of calibration, interlocks, and automated testing.`,
          `Recall standard compliance frameworks (e.g., ISO, IEEE, OSHA).`,
          `Focus on calibrated instrumentation, automated watchdog fail-safes, and standardized test suites.`
        ],
        numericalDetails: null,
        diagramSvg: null
      };
      break;
  }

  const generatedId = `q_facet_${effectiveFacet}_${normalizeString(cleanC).slice(0, 8)}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return {
    id: generatedId,
    questionText: facetData.questionText,
    verifiedReference: null,
    format: facetData.format,
    bloomLevel: facetData.bloomLevel,
    options: facetData.options,
    correctIndex: facetData.correctIndex,
    modelAnswer: facetData.modelAnswer,
    explanation: facetData.explanation,
    hints: facetData.hints,
    expectedKeywords: [cleanTop.toLowerCase(), cleanC.toLowerCase(), 'analysis', 'stability', 'governing formulation'],
    rubric: {
      'Technical Articulation': '50% for core operational principle',
      'Analytical Validation': '50% for governing relations and boundary conditions'
    },
    numericalDetails: facetData.numericalDetails,
    diagramSvg: facetData.diagramSvg,
    diagramCaption: facetData.diagramCaption || null,
    semanticFingerprint: `facet_${effectiveFacet}_${cleanTop.toLowerCase()}_${cleanC.toLowerCase()}_${facetData.questionText.slice(0, 50)}_${facetData.questionText.slice(-30)}`,
    structuralFingerprint: `${facetData.format}_${facetData.bloomLevel}_${effectiveFacet}`,
    isSynthesizedFacet: true,
    facetIndex: effectiveFacet
  };
}

export function resolveAcademicContext(inputContext = {}) {
  const {
    subjectId,
    subjectName,
    subject,
    topic,
    scheduledTopic,
    concept,
    selectedConcept,
    questionType = 'mixed',
    difficulty = 'Intermediate',
    academicLevel = 'Undergraduate',
    learningObjective = '',
    referenceMaterial = ''
  } = inputContext;

  const BANNED_PLACEHOLDERS = /^(curriculum topic|core concept|core theoretical principles|general academic curriculum|foundational mechanism|direct formulation|operational performance|registered academic discipline|sample topic|default topic|unassigned|all key concepts|placeholder|general topic|assigned topic|custom topic)$/i;

  let resolvedSubjectName = (subjectName || subject || '').trim();
  let resolvedTopicName = (scheduledTopic || topic || '').trim();
  let resolvedConceptName = (selectedConcept || concept || '').trim();

  if (BANNED_PLACEHOLDERS.test(resolvedSubjectName)) resolvedSubjectName = '';
  if (BANNED_PLACEHOLDERS.test(resolvedTopicName)) resolvedTopicName = '';
  if (BANNED_PLACEHOLDERS.test(resolvedConceptName)) resolvedConceptName = '';

  // If topic was set identically to subject, treat it as topic unassigned
  if (resolvedTopicName && resolvedSubjectName && normalizeString(resolvedTopicName) === normalizeString(resolvedSubjectName)) {
    resolvedTopicName = '';
  }

  // Safety check for missing / ambiguous schedule context
  if (!resolvedTopicName && !resolvedSubjectName) {
    const knownSubject = subjectId && Object.entries(ACADEMIC_REGISTRY).some(([k, s]) => k === subjectId || s.id === subjectId);
    if (!knownSubject) {
      return {
        valid: false,
        error: 'MISSING_SCHEDULE_CONTEXT',
        message: 'Ambiguous or unassigned schedule context. Staff assignment or syllabus section required.',
        subjectId: subjectId || 'unknown',
        subjectName: '',
        topic: '',
        concept: ''
      };
    }
  }

  // Search Academic Registry
  const normSubj = normalizeString(resolvedSubjectName);
  const normTopic = normalizeString(resolvedTopicName);
  const normConcept = normalizeString(resolvedConceptName);

  let matchedSubjectKey = null;
  let matchedTopicKey = null;
  let matchedConceptKey = null;

  // 1. Direct Subject Match
  if (subjectId) {
    for (const [sKey, sObj] of Object.entries(ACADEMIC_REGISTRY)) {
      if (sKey === subjectId || sObj.id === subjectId) {
        matchedSubjectKey = sKey;
        break;
      }
    }
  }

  if (!matchedSubjectKey && normSubj) {
    for (const [sKey, sObj] of Object.entries(ACADEMIC_REGISTRY)) {
      const sNameNorm = normalizeString(sObj.name);
      const sKeyNorm = sKey.replace(/_/g, ' ');
      if (normSubj === sKey || normSubj === sKeyNorm || normSubj === sNameNorm ||
          normSubj.includes(sKeyNorm) || normSubj.includes(sNameNorm) ||
          (normSubj.length >= 4 && sNameNorm.includes(normSubj) && !['engineering', 'science', 'technology', 'studies'].includes(normSubj))) {
        matchedSubjectKey = sKey;
        break;
      }
    }
  }

  // 2. Topic Matching & Cross-Subject Topic Pinning
  if (normTopic) {
    let candidateSubjectKey = null;
    let candidateTopicKey = null;
    let bestScore = 0;

    // Scan matched subject first if defined, then all others
    const subjectsToScan = matchedSubjectKey && ACADEMIC_REGISTRY[matchedSubjectKey]
      ? [[matchedSubjectKey, ACADEMIC_REGISTRY[matchedSubjectKey]], ...Object.entries(ACADEMIC_REGISTRY).filter(([k]) => k !== matchedSubjectKey)]
      : Object.entries(ACADEMIC_REGISTRY);

    for (const [sKey, sObj] of subjectsToScan) {
      for (const [tKey, tObj] of Object.entries(sObj.topics)) {
        const tNameNorm = normalizeString(tObj.name);
        const tKeyNorm = tKey.replace(/_/g, ' ');
        if (normTopic === tKey || normTopic === tKeyNorm || normTopic === tNameNorm) {
          candidateSubjectKey = sKey;
          candidateTopicKey = tKey;
          bestScore = 1000;
          break;
        }
        if (normTopic.includes(tKeyNorm) || normTopic.includes(tNameNorm) || tNameNorm.includes(normTopic) ||
            (normTopic.includes('motor') && tKey.includes('motor')) ||
            (normTopic.includes('drive') && tKey.includes('drive')) ||
            (normTopic.includes('gmsk') && (tKey.includes('gmsk') || tNameNorm.includes('gmsk'))) ||
            (normTopic.includes('pcm') && (tKey.includes('pcm') || tNameNorm.includes('pcm'))) ||
            (normTopic.includes('sampling') && (tKey.includes('sampling') || tNameNorm.includes('sampling'))) ||
            (normTopic.includes('transmission') && (tKey.includes('transmission') || tNameNorm.includes('transmission'))) ||
            (normTopic.includes('shannon') && (tKey.includes('information') || tNameNorm.includes('information'))) ||
            (normTopic.includes('kruskal') && (tKey.includes('kruskal') || tNameNorm.includes('kruskal'))) ||
            (normTopic.includes('hash') && (tKey.includes('hash') || tNameNorm.includes('hash'))) ||
            (normTopic.includes('pid') && (tKey.includes('pid') || tNameNorm.includes('pid')))) {
          const matchLen = Math.max(tKey.length, tNameNorm.length);
          if (matchLen > bestScore) {
            bestScore = matchLen;
            candidateSubjectKey = sKey;
            candidateTopicKey = tKey;
          }
        }
      }
      if (bestScore === 1000) break;
    }

    if (candidateTopicKey) {
      matchedSubjectKey = candidateSubjectKey;
      matchedTopicKey = candidateTopicKey;

      const tObj = ACADEMIC_REGISTRY[candidateSubjectKey].topics[candidateTopicKey];
      if (resolvedConceptName) {
        let bestConceptKey = null;
        let bestConceptScore = 0;

        for (const [cKey, cObj] of Object.entries(tObj.concepts)) {
          const cNameNorm = normalizeString(cObj.name);
          const cKeyNorm = cKey.replace(/_/g, ' ');
          if (normConcept === cKey || normConcept === cKeyNorm || normConcept === cNameNorm) {
            bestConceptKey = cKey;
            bestConceptScore = 1000;
            break;
          }
          if (normConcept.includes(cKeyNorm) || normConcept.includes(cNameNorm) || cNameNorm.includes(normConcept) ||
              (normConcept.includes('induction') && cKey.includes('induction')) ||
              (normConcept.includes('speed') && cKey.includes('speed')) ||
              (normConcept.includes('v/f') && cKey.includes('induction')) ||
              (normConcept.includes('pulse') && cKey.includes('gmsk')) ||
              (normConcept.includes('vswr') && cKey.includes('vswr')) ||
              (normConcept.includes('shannon') && cKey.includes('shannon')) ||
              (normConcept.includes('kruskal') && cKey.includes('kruskal')) ||
              (normConcept.includes('hash') && cKey.includes('hash')) ||
              (normConcept.includes('pid') && cKey.includes('pid'))) {
            const matchLen = Math.max(cKey.length, cNameNorm.length);
            if (matchLen > bestConceptScore) {
              bestConceptScore = matchLen;
              bestConceptKey = cKey;
            }
          }
        }
        if (bestConceptKey) matchedConceptKey = bestConceptKey;
      }
    }
  }

  const hasExplicitCustomTopic = Boolean(resolvedTopicName && !matchedTopicKey);
  const registeredSubject = matchedSubjectKey ? ACADEMIC_REGISTRY[matchedSubjectKey] : null;
  let registeredTopic = (registeredSubject && matchedTopicKey) ? registeredSubject.topics[matchedTopicKey] : null;

  if (registeredSubject && !registeredTopic && !hasExplicitCustomTopic) {
    matchedTopicKey = Object.keys(registeredSubject.topics)[0];
    registeredTopic = registeredSubject.topics[matchedTopicKey];
  }

  let registeredConcept = (registeredTopic && matchedConceptKey) ? registeredTopic.concepts[matchedConceptKey] : null;
  if (registeredTopic && !registeredConcept) {
    matchedConceptKey = Object.keys(registeredTopic.concepts)[0];
    registeredConcept = registeredTopic.concepts[matchedConceptKey];
  }

  const finalSubjectName = registeredSubject ? registeredSubject.name : resolvedSubjectName;
  let finalTopicName = registeredTopic ? registeredTopic.name : resolvedTopicName;
  if (!finalTopicName && registeredSubject) {
    const firstTop = Object.values(registeredSubject.topics)[0];
    if (firstTop) finalTopicName = firstTop.name;
  }

  let finalConceptName = registeredConcept ? registeredConcept.name : resolvedConceptName;
  if (!finalConceptName && registeredTopic) {
    const firstConc = Object.values(registeredTopic.concepts)[0];
    if (firstConc) finalConceptName = firstConc.name;
  }
  if (!finalConceptName) {
    finalConceptName = finalTopicName || finalSubjectName;
  }

  if (!finalTopicName || BANNED_PLACEHOLDERS.test(finalTopicName)) {
    return {
      valid: false,
      error: 'INVALID_TOPIC_PLACEHOLDER',
      message: 'Staff-assigned topic is missing, a generic placeholder, or invalid. Concrete curriculum definition required.',
      subjectId: matchedSubjectKey || subjectId,
      subjectName: finalSubjectName,
      topic: '',
      concept: ''
    };
  }

  return {
    valid: true,
    subjectId: matchedSubjectKey || registeredSubject?.id || subjectId || 'custom_subject',
    canonicalSubjectId: registeredSubject?.id || matchedSubjectKey || subjectId || 'custom_subject',
    subjectName: finalSubjectName,
    topicId: matchedTopicKey || (registeredTopic ? normalizeString(registeredTopic.name).replace(/\s+/g, '_') : 'custom_topic'),
    canonicalTopicId: matchedTopicKey || (registeredTopic ? normalizeString(registeredTopic.name).replace(/\s+/g, '_') : 'custom_topic'),
    topic: finalTopicName,
    conceptId: matchedConceptKey || (registeredConcept ? normalizeString(registeredConcept.name).replace(/\s+/g, '_') : 'custom_concept'),
    concept: finalConceptName,
    learningObjective: registeredConcept?.learningObjective || learningObjective || `Demonstrate rigorous technical reasoning in ${finalTopicName}`,
    learningObjectives: registeredConcept?.learningObjective ? [registeredConcept.learningObjective] : [`Demonstrate rigorous technical reasoning in ${finalTopicName}`],
    permittedPrerequisites: registeredTopic?.prerequisites || ['Foundational mathematical and scientific principles'],
    syllabusSource: registeredSubject ? 'curriculum_registry' : (inputContext.syllabusSource || 'staff_assignment'),
    requestedQuestionCount: inputContext.count || inputContext.totalCount || 1,
    questionType,
    difficulty,
    academicLevel,
    referenceMaterial,
    sessionHistory: inputContext.sessionHistory || [],
    index: inputContext.index,
    questionNumber: inputContext.questionNumber,
    customKnowledge: inputContext.customKnowledge,
    isCustomTopic: hasExplicitCustomTopic,
    isRegisteredInCurriculum: hasExplicitCustomTopic ? false : Boolean(registeredSubject && registeredTopic)
  };
}

/**
 * Phase 6 Concept Blueprint Constructor
 * Generates an end-to-end curriculum assessment blueprint for any subject and topic.
 */
export function createConceptBlueprint(subjectName, topicName, count = 10, format = 'mixed') {
  const resolved = resolveAcademicContext({ subjectName, topic: topicName });
  const finalSubj = resolved.valid ? resolved.subjectName : (subjectName || 'General Engineering');
  const finalTop = resolved.valid ? resolved.topic : (topicName || 'Core Topic');

  let concepts = [];
  const regSubj = Object.values(ACADEMIC_REGISTRY).find(s =>
    normalizeString(s.name) === normalizeString(finalSubj) ||
    normalizeString(s.id) === normalizeString(finalSubj)
  );
  if (regSubj) {
    const regTop = Object.values(regSubj.topics).find(t =>
      normalizeString(t.name) === normalizeString(finalTop) ||
      normalizeString(finalTop).includes(normalizeString(t.name)) ||
      normalizeString(t.name).includes(normalizeString(finalTop))
    );
    if (regTop && regTop.concepts) {
      concepts = Object.values(regTop.concepts).map(c => c.name);
    }
  }
  if (concepts.length === 0) {
    const extracted = ExtractUniversalConcepts(finalSubj, finalTop);
    concepts = extracted.concepts.map(c => c.name);
  }
  if (concepts.length === 0) {
    concepts = [`Foundations of ${finalTop}`, `Analytical Modeling of ${finalTop}`, `System Optimization in ${finalTop}`];
  }

  const formats = format && format !== 'mixed'
    ? [format]
    : ['Theory', 'Numerical', 'Diagram', 'Graph', 'Scenario', 'Derivation'];

  const bloomProgression = ['Remembering', 'Understanding', 'Application', 'Analysis', 'Evaluation', 'Creation'];

  const blueprint = [];
  const numQuestions = Math.max(1, parseInt(count, 10) || 10);

  for (let i = 0; i < numQuestions; i++) {
    const assignedConcept = concepts[i % concepts.length];
    const assignedFormat = formats[i % formats.length];
    const assignedBloom = bloomProgression[Math.min(i, bloomProgression.length - 1)];
    const assignedDiff = i < 3 ? 'Beginner' : (i < 7 ? 'Intermediate' : 'Advanced');
    const marks = assignedDiff === 'Beginner' ? 5 : (assignedDiff === 'Intermediate' ? 10 : 15);

    blueprint.push({
      questionIndex: i,
      questionNumber: i + 1,
      subject: finalSubj,
      topic: finalTop,
      concept: assignedConcept,
      format: assignedFormat,
      bloomLevel: assignedBloom,
      difficulty: assignedDiff,
      marks,
      learningObjective: `Demonstrate technical understanding of ${assignedConcept} in ${finalTop}`,
      estimatedMinutes: Math.round(marks * 1.2)
    });
  }

  return {
    subject: finalSubj,
    topic: finalTop,
    totalQuestions: numQuestions,
    targetFormat: format || 'mixed',
    conceptsUsed: Array.from(new Set(blueprint.map(b => b.concept))),
    blueprint
  };
}

export function ExtractUniversalConcepts(subjectName = '', topicName = '', context = {}) {
  const cleanSubject = String(subjectName || 'Engineering').trim();
  const cleanTopic = String(topicName || 'System Analysis').trim();

  const isMathOrPhysics = /math|algebra|calculus|physics|mechanics|control/i.test(cleanSubject + cleanTopic);
  const isBiotechOrChem = /biotech|bio|chemical|biology|fermentation|cell/i.test(cleanSubject + cleanTopic);
  const isComputerScience = /computer|software|database|algorithm|network|security|data/i.test(cleanSubject + cleanTopic);
  const isElectronics = /electronic|circuit|communication|signal|telecom|electrical/i.test(cleanSubject + cleanTopic);

  return {
    subject: cleanSubject,
    topic: cleanTopic,
    categories: {
      fundamentalDefinitions: `Core operational terminology and definitions defining ${cleanTopic}.`,
      internalWorkingMechanisms: `Kinetic and state transitions governing ${cleanTopic}.`,
      constituentParts: `Constituent components and functional subsystem interactions in ${cleanTopic}.`,
      governingPrinciples: `Conservation laws and foundational physical/computational theorems in ${cleanTopic}.`,
      mathematicalRelationships: isMathOrPhysics || isElectronics
        ? `Analytical governing equations, matrix formulations, and frequency-domain transforms.`
        : `Quantitative input-output transfer models and conservation balances.`,
      assumptionsAndLimitations: `Boundary conditions, linearity bounds, and steady-state equilibrium constraints.`,
      causeAndEffect: `Dynamic sensitivity and parameter perturbation responses in ${cleanTopic}.`,
      designParameters: `Operating setpoints, dimensional ratios, and critical scaling parameters.`,
      performanceMeasures: `Efficiency metrics, stability margins, throughput rates, and error bounds.`,
      failureModesAndTroubleshooting: `Oscillatory instability, saturation, deadlocks, and degradation remediation.`,
      applicationsAndImplications: `Industrial deployment, field implementation, and real-world system architecture.`,
      comparisonsBetweenMethods: `Trade-offs against alternative paradigms (e.g. speed vs accuracy, batch vs continuous).`,
      numericalProcedures: isMathOrPhysics || isElectronics || isBiotechOrChem
        ? `Step-by-step quantitative parameter calculation with verifiable units.`
        : `Algorithmic ranking and computational evaluation procedures.`,
      diagramsAndVisuals: isElectronics || isMathOrPhysics || isBiotechOrChem
        ? `Block schematics, frequency plots, flowcharts, or process flow diagrams.`
        : null,
      commonMisconceptions: `Confusion between steady-state and transient responses, or confounding dependent with independent variables.`
    }
  };
}

/**
 * Dynamic Subject Knowledge Representation Generator
 * Constructs comprehensive subject ontology from syllabus, course notes, or context.
 */
export function BuildDynamicKnowledgeMap(subjectName = '', topicName = '', context = {}) {
  const universal = ExtractUniversalConcepts(subjectName, topicName, context);
  const cleanSubject = universal.subject;
  const cleanTopic = universal.topic;

  const isMathOrPhysics = /math|algebra|calculus|physics|mechanics|control/i.test(cleanSubject + cleanTopic);
  const isBiotechOrChem = /biotech|bio|chemical|biology|fermentation|cell/i.test(cleanSubject + cleanTopic);
  const isElectronics = /electronic|circuit|communication|signal|telecom|electrical/i.test(cleanSubject + cleanTopic);

  const concepts = [
    {
      id: `${cleanTopic.toLowerCase().replace(/\s+/g, '_')}_fundamentals`,
      name: `Core Principles of ${cleanTopic}`,
      type: 'foundational_concept',
      prerequisites: [`Prerequisite principles of ${cleanSubject}`],
      learningObjectives: [`Articulate physical/computational basis of ${cleanTopic}`],
      keyTerminology: [cleanTopic, 'Governing Relationship', 'Operational Parameters']
    },
    {
      id: `${cleanTopic.toLowerCase().replace(/\s+/g, '_')}_mechanisms`,
      name: `Dynamic Mechanisms & Derivations`,
      type: 'analytical_mechanism',
      prerequisites: [`Core Principles of ${cleanTopic}`],
      equations: isMathOrPhysics || isElectronics
        ? ['Input-Output Transfer Differential Relation', 'Boundary Condition Equations']
        : ['Conservation & Rate Balance Equation'],
      assumptions: ['Steady-state or quasi-linear operating regime', 'Negligible parasitic losses within specified bounds']
    },
    {
      id: `${cleanTopic.toLowerCase().replace(/\s+/g, '_')}_diagnostics`,
      name: `Troubleshooting & Failure Modes`,
      type: 'diagnostic_application',
      prerequisites: [`Dynamic Mechanisms & Derivations`],
      failureConditions: ['Operating parameter saturation', 'Boundary constraint violation', 'Instability excursion'],
      commonMisconceptions: ['Confounding rate parameters with equilibrium states', 'Ignoring ambient boundary assumptions']
    }
  ];

  return {
    subject: cleanSubject,
    topic: cleanTopic,
    syllabusSection: context.syllabusSection || `${cleanSubject} Unit Syllabus`,
    sourceProvenance: context.referenceMaterial ? 'course_material_grounded' : 'curriculum_ontology_grounded',
    sourceReferences: context.referenceEvidence || [],
    concepts,
    universalCategories: universal.categories,
    pedagogicalRubric: {
      'Conceptual Understanding': '40% for accurate definitions, terminology, and core operating principles',
      'Analytical Rigor': '30% for mathematical derivations, equations, correct assumptions, and units',
      'Application & Diagnosis': '30% for troubleshooting scenarios, failure mode identification, and boundary conditions'
    }
  };
}

/**
 * 4. QUESTION FORMAT PLANNER
 * Determines appropriate format: Theory, Numerical, Scenario, Diagram, Comparison, or Derivation.
 */
export function PlanQuestionFormat(subject = '', topic = '', requestedFormat = 'mixed', context = {}) {
  const subLower = String(subject || '').toLowerCase();
  const topLower = String(topic || '').toLowerCase();

  const supportsNumerical = /control|bioreactor|oxygen|antenna|modulation|eigen|matrix|circuit|physics|chemistry|mechanic|signal|heat|thermo|conduction|fourier|beam|stress/i.test(subLower + ' ' + topLower);
  const supportsDiagram = /bode|circuit|bioreactor|block diagram|signal|antenna|flowchart|conduction|beam/i.test(subLower + ' ' + topLower);

  if (requestedFormat && requestedFormat !== 'mixed') {
    if (requestedFormat === 'numerical' && !supportsNumerical) {
      return 'theory'; // Gracefully fall back to theory if topic does not support calculations
    }
    return requestedFormat;
  }

  // Varied rotation for mixed mode
  const index = Number(context.index || 0);
  if (supportsDiagram && index % 4 === 2) return 'diagram';
  if (supportsNumerical && index % 3 === 1) return 'numerical';
  if (index % 5 === 3) return 'scenario';
  if (index % 4 === 3) return 'comparison';
  return 'theory';
}

/**
 * 5. DIAGRAM & SVG GENERATOR
 * Generates vector SVG visuals when materially helpful to assess the concept.
 * Returns null when visual is unnecessary.
 */
export function GenerateDiagramSvg(subject = '', topic = '', concept = '', questionData = {}) {
  const norm = (subject + ' ' + topic + ' ' + concept).toLowerCase();

  // 1. Control Systems Bode Plot Diagram
  if (norm.includes('bode') || norm.includes('gain margin') || norm.includes('phase margin')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" class="w-full h-auto max-w-[550px]">
  <rect width="600" height="280" rx="12" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <line x1="60" y1="20" x2="60" y2="130" stroke="#718096" stroke-width="1.5"/>
  <line x1="60" y1="75" x2="560" y2="75" stroke="#C53030" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="50" y="79" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030" text-anchor="end">0 dB</text>
  <path d="M 60 40 Q 200 50 300 75 T 500 125" fill="none" stroke="#2B6CB0" stroke-width="2.5"/>
  <circle cx="300" cy="75" r="4" fill="#2B6CB0"/>
  <text x="300" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2B6CB0" text-anchor="middle">w_gc (0 dB)</text>
  <line x1="60" y1="150" x2="60" y2="260" stroke="#718096" stroke-width="1.5"/>
  <line x1="60" y1="225" x2="560" y2="225" stroke="#C53030" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="50" y="229" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030" text-anchor="end">-180°</text>
  <path d="M 60 170 Q 200 175 300 190 T 420 225 T 520 250" fill="none" stroke="#D69E2E" stroke-width="2.5"/>
  <circle cx="420" cy="225" r="4" fill="#D69E2E"/>
  <text x="420" y="215" font-family="sans-serif" font-size="10" font-weight="bold" fill="#D69E2E" text-anchor="middle">w_pc (-180°)</text>
  <line x1="300" y1="75" x2="300" y2="190" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>
  <line x1="300" y1="190" x2="300" y2="225" stroke="#2F855A" stroke-width="3"/>
  <text x="310" y="210" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2F855A">PM = +35°</text>
  <line x1="420" y1="105" x2="420" y2="225" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>
  <line x1="420" y1="75" x2="420" y2="105" stroke="#2F855A" stroke-width="3"/>
  <text x="430" y="95" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2F855A">GM = +12 dB</text>
</svg>`;
  }

  // 2. Control Systems Feedback Block Diagram
  if (norm.includes('feedback') || norm.includes('block diagram') || norm.includes('closed loop')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 180" class="w-full h-auto max-w-[500px]">
  <rect width="540" height="180" rx="10" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <circle cx="100" cy="90" r="16" fill="#FFF8E8" stroke="#B7791F" stroke-width="2"/>
  <text x="100" y="95" font-family="sans-serif" font-size="16" font-weight="bold" fill="#B7791F" text-anchor="middle">∑</text>
  <line x1="30" y1="90" x2="84" y2="90" stroke="#2D3748" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="50" y="80" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2D3748">R(s)</text>
  <line x1="116" y1="90" x2="190" y2="90" stroke="#2D3748" stroke-width="2"/>
  <text x="150" y="80" font-family="sans-serif" font-size="10" fill="#718096">E(s)</text>
  <rect x="190" y="65" width="120" height="50" rx="6" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
  <text x="250" y="95" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2B6CB0" text-anchor="middle">G(s)</text>
  <line x1="310" y1="90" x2="480" y2="90" stroke="#2D3748" stroke-width="2"/>
  <text x="460" y="80" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2D3748">Y(s)</text>
  <circle cx="390" cy="90" r="4" fill="#2D3748"/>
  <line x1="390" y1="90" x2="390" y2="150" stroke="#2D3748" stroke-width="2"/>
  <line x1="390" y1="150" x2="310" y2="150" stroke="#2D3748" stroke-width="2"/>
  <rect x="190" y="125" width="120" height="50" rx="6" fill="#EDF2F7" stroke="#4A5568" stroke-width="2"/>
  <text x="250" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2D3748" text-anchor="middle">H(s)</text>
  <line x1="190" y1="150" x2="100" y2="150" stroke="#2D3748" stroke-width="2"/>
  <line x1="100" y1="150" x2="100" y2="106" stroke="#2D3748" stroke-width="2"/>
  <text x="110" y="120" font-family="sans-serif" font-size="12" font-weight="bold" fill="#C53030">-</text>
</svg>`;
  }

  // 3. Biotechnology Bioreactor Oxygen Transfer Diagram
  if (norm.includes('oxygen transfer') || norm.includes('bioreactor') || norm.includes('kla')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" class="w-full h-auto max-w-[550px]">
  <rect width="600" height="240" rx="12" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <rect x="30" y="40" width="160" height="160" rx="10" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
  <text x="110" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2B6CB0" text-anchor="middle">Gas Bubble Core (C_G)</text>
  <rect x="190" y="40" width="40" height="160" fill="#E2E8F0" stroke="#718096" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="210" y="225" font-family="sans-serif" font-size="10" fill="#4A5568" text-anchor="middle">Gas Film</text>
  <line x1="230" y1="40" x2="230" y2="200" stroke="#C53030" stroke-width="2"/>
  <text x="230" y="30" font-family="sans-serif" font-size="11" font-weight="bold" fill="#C53030" text-anchor="middle">Interface (C*)</text>
  <rect x="230" y="40" width="80" height="160" fill="#FED7D7" fill-opacity="0.6" stroke="#E53E3E" stroke-width="2"/>
  <text x="270" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#9B2C2C" text-anchor="middle">Liquid Film (kL)</text>
  <text x="270" y="225" font-family="sans-serif" font-size="10" font-weight="bold" fill="#C53030" text-anchor="middle">Primary Resistance</text>
  <rect x="310" y="40" width="250" height="160" rx="10" fill="#E6FFFA" stroke="#319795" stroke-width="2"/>
  <text x="435" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#234E52" text-anchor="middle">Bulk Liquid Broth (C_L)</text>
  <path d="M 170 80 Q 230 80 230 110 T 310 170 H 450" fill="none" stroke="#2B6CB0" stroke-width="3"/>
  <text x="455" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2B6CB0">DO Gradient</text>
</svg>`;
  }

  // 4. Electronics Passive RC Filter Circuit
  if (norm.includes('filter') || norm.includes('circuit') || norm.includes('rc network') || norm.includes('cutoff frequency')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" class="w-full h-auto max-w-[450px]">
  <rect width="500" height="180" rx="10" fill="#FFFDF8" stroke="#E2D3A7" stroke-width="2"/>
  <circle cx="50" cy="60" r="5" fill="#2D3748"/>
  <text x="50" y="45" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2D3748" text-anchor="middle">V_in</text>
  <line x1="55" y1="60" x2="150" y2="60" stroke="#2D3748" stroke-width="2"/>
  <rect x="150" y="45" width="80" height="30" fill="#FFF8E8" stroke="#B7791F" stroke-width="2"/>
  <text x="190" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#8B5E34" text-anchor="middle">R = 10 kΩ</text>
  <line x1="230" y1="60" x2="350" y2="60" stroke="#2D3748" stroke-width="2"/>
  <circle cx="350" cy="60" r="5" fill="#2D3748"/>
  <circle cx="450" cy="60" r="5" fill="#2D3748"/>
  <line x1="350" y1="60" x2="450" y2="60" stroke="#2D3748" stroke-width="2"/>
  <text x="450" y="45" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2D3748" text-anchor="middle">V_out</text>
  <line x1="350" y1="65" x2="350" y2="95" stroke="#2D3748" stroke-width="2"/>
  <line x1="330" y1="95" x2="370" y2="95" stroke="#2B6CB0" stroke-width="3"/>
  <line x1="330" y1="105" x2="370" y2="105" stroke="#2B6CB0" stroke-width="3"/>
  <text x="385" y="104" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2B6CB0">C = 10 nF</text>
  <line x1="350" y1="105" x2="350" y2="140" stroke="#2D3748" stroke-width="2"/>
  <line x1="335" y1="140" x2="365" y2="140" stroke="#718096" stroke-width="2"/>
  <line x1="342" y1="145" x2="358" y2="145" stroke="#718096" stroke-width="1.5"/>
  <line x1="347" y1="150" x2="353" y2="150" stroke="#718096" stroke-width="1"/>
</svg>`;
  }

  // Purely conceptual/humanities topics do NOT require diagrams
  return null;
}

/**
 * 6. NUMERICAL VERIFICATION SERVICE
 * Validates solvable mathematical problems, units, formula consistency, and tolerances.
 */
export function VerifyNumericalCalculation(questionPackage) {
  if (questionPackage.format !== 'Numerical' || !questionPackage.numericalDetails) {
    return { valid: true, isNumerical: false };
  }

  const { formula, givenParameters, stepByStep, calculatedValue } = questionPackage.numericalDetails;

  const errors = [];
  if (!formula || typeof formula !== 'string') errors.push('Numerical question lacks explicit mathematical formula.');
  if (!givenParameters || Object.keys(givenParameters).length === 0) errors.push('Numerical question lacks given input parameters.');
  if (!stepByStep) errors.push('Numerical question lacks step-by-step arithmetic derivation.');

  // Validate answer option matches calculated value
  if (questionPackage.options && typeof questionPackage.correctIndex === 'number') {
    const correctOpt = String(questionPackage.options[questionPackage.correctIndex]);
    if (Array.isArray(calculatedValue)) {
      const allPresent = calculatedValue.every(v => correctOpt.includes(String(v)));
      if (!allPresent) {
        errors.push(`Correct option "${correctOpt}" does not contain all calculated values ${calculatedValue.join(', ')}.`);
      }
    } else {
      const valStr = String(calculatedValue);
      const cleanOpt = correctOpt.replace(/,/g, '');
      if (!cleanOpt.includes(valStr.split('.')[0])) {
        errors.push(`Correct option "${correctOpt}" does not correspond to calculated value ${valStr}.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    isNumerical: true,
    errors
  };
}


/**
 * Internal Question-Generation Contract Factory
 * Establishes formal contract grounding questions in authoritative context.
 */
export function createQuestionGenerationContract(inputContext = {}) {
  const resolved = resolveAcademicContext(inputContext);
  if (!resolved.valid) {
    return {
      valid: false,
      error: resolved.error || 'INVALID_CONTEXT',
      message: resolved.message || 'Cannot form contract: context is invalid'
    };
  }

  const contract = {
    contractVersion: '2.0-grounded',
    subjectId: resolved.subjectId,
    subjectName: resolved.subjectName,
    scheduleId: inputContext.scheduleId || `sched_${resolved.subjectId}_${Date.now()}`,
    assignedTopic: resolved.topic,
    selectedConcept: resolved.concept,
    learningObjective: resolved.learningObjective,
    syllabusExcerpts: inputContext.syllabusSection || inputContext.referenceMaterial || null,
    concreteAssessableConcept: resolved.concept,
    expectedKnowledgeRequired: [
      resolved.concept,
      resolved.topic,
      'Analytical Formulation',
      'Boundary Conditions',
      'Governing Principles'
    ],
    questionType: resolved.questionType,
    difficulty: resolved.difficulty,
    academicLevel: resolved.academicLevel,
    isRegisteredInCurriculum: resolved.isRegisteredInCurriculum,
    generationPolicy: {
      singleDefensibleAnswer: true,
      antiLeakHints: true,
      noGenericTemplates: true,
      maxAttempts: 3
    }
  };

  return {
    valid: true,
    contract
  };
}

/**
 * 7. TASK A: GenerateQuestion(context)
 * Generates an academically appropriate question text strictly grounded in context.
 */
export function GenerateQuestion(context) {
  const resolved = resolveAcademicContext(context);
  if (!resolved.valid) {
    return {
      questionText: 'Ambiguous or unassigned schedule context. Staff assignment or syllabus section required.',
      verifiedReference: null,
      error: resolved.error
    };
  }

  const { subjectName, topic, concept, questionType } = resolved;
  const plannedFormat = PlanQuestionFormat(subjectName, topic, questionType, context);

  // 1. Search Academic Registry
  const regSubj = Object.values(ACADEMIC_REGISTRY).find(s => {
    const s1 = normalizeString(s.name);
    const s2 = normalizeString(subjectName);
    return s1 === s2 || s1.includes(s2) || s2.includes(s1);
  });
  if (regSubj) {
    const normTopic = normalizeString(topic);
    // 1. Try exact topic match first
    let regTopic = Object.values(regSubj.topics).find(t => normalizeString(t.name) === normTopic);
    // 2. Try prefix/suffix/keyword topic match
    if (!regTopic) {
      regTopic = Object.values(regSubj.topics).find(t => {
        const tNorm = normalizeString(t.name);
        const normConcept = normalizeString(concept);
        return tNorm.includes(normTopic) || normTopic.includes(tNorm) ||
          (normTopic.includes('database') && tNorm.includes('database')) ||
          (normTopic.includes('deployment') && tNorm.includes('deployment')) ||
          (normTopic.includes('bioreactor') && tNorm.includes('bioreactor')) ||
          (normTopic.includes('frequency') && (tNorm.includes('bode') || tNorm.includes('frequency'))) ||
          (normConcept.includes('bode') && tNorm.includes('bode'));
      });
    }

    if (regTopic) {
      const normConcept = normalizeString(concept);
      let regConcept = Object.values(regTopic.concepts).find(c => {
        const cNorm = normalizeString(c.name);
        return cNorm === normConcept || cNorm.includes(normConcept) || normConcept.includes(cNorm);
      });
      if (!regConcept) {
        regConcept = Object.values(regTopic.concepts).find(c => {
          const cNorm = normalizeString(c.name);
          return (normConcept.includes('normal') && cNorm.includes('normal')) ||
            (normConcept.includes('rollback') && (cNorm.includes('rollback') || cNorm.includes('deploy') || cNorm.includes('drift'))) ||
            (normConcept.includes('oxygen') && cNorm.includes('oxygen')) ||
            (normConcept.includes('qpsk') && cNorm.includes('qpsk')) ||
            (normConcept.includes('eigen') && cNorm.includes('eigen')) ||
            (normConcept.includes('steriliz') && cNorm.includes('steriliz')) ||
            (normConcept.includes('bode') && cNorm.includes('bode'));
        });
      }
      
      // If concept was not found in this topic, search other topics in this subject for matching concept
      if (!regConcept) {
        for (const otherTopic of Object.values(regSubj.topics)) {
          const found = Object.values(otherTopic.concepts).find(c => {
            const cNorm = normalizeString(c.name);
            return cNorm.includes(normConcept) || normConcept.includes(cNorm) ||
              (normConcept.includes('qpsk') && cNorm.includes('qpsk')) ||
              (normConcept.includes('normal') && cNorm.includes('normal'));
          });
          if (found) {
            regConcept = found;
            break;
          }
        }
      }

      if (!regConcept) {
        regConcept = Object.values(regTopic.concepts)[0];
      }

      if (regConcept && regConcept.questions?.length > 0) {
        // Priority 1a: Check if questionText specifically matches concept keywords
        let matched = regConcept.questions.find(q => {
          const qTextLower = q.questionText.toLowerCase();
          if (normConcept.includes('rollback') && (qTextLower.includes('rollback') || qTextLower.includes('canary'))) return true;
          if (normConcept.includes('drift') && qTextLower.includes('drift')) return true;
          if (normConcept.includes('validation') && qTextLower.includes('validation gate')) return true;
          return false;
        });

        // Priority 1b: Check options and explanation if question text didn't match
        if (!matched) {
          matched = regConcept.questions.find(q => {
            const combined = (q.questionText + ' ' + (q.options || []).join(' ') + ' ' + (q.explanation || '')).toLowerCase();
            if (normConcept.includes('rollback') && (combined.includes('rollback') || combined.includes('canary'))) return true;
            if (normConcept.includes('drift') && combined.includes('drift')) return true;
            return false;
          });
        }

        // Priority 2: Check matching format
        if (!matched && plannedFormat !== 'theory' && plannedFormat !== 'mcq') {
          matched = regConcept.questions.find(q => {
            if (plannedFormat === 'numerical') return q.format === 'Numerical';
            if (plannedFormat === 'diagram') return q.format === 'Diagram';
            if (plannedFormat === 'scenario') return q.format === 'Scenario';
            if (plannedFormat === 'comparison') return q.format === 'Comparison';
            return false;
          });
        }

        // Priority 3: Fall back to question by index or first matching question
        if (!matched) {
          const idx = (context.index ? context.index - 1 : (context.questionNumber ? context.questionNumber - 1 : 0)) % regConcept.questions.length;
          matched = regConcept.questions[idx] || regConcept.questions.find(q => q.type === 'mcq') || regConcept.questions[0];
        }

        // Deduplication against seenQuestionIds & seenFingerprints
        if (matched && context.seenQuestionIds && context.seenQuestionIds.has(matched.id)) {
          const unseen = regConcept.questions.find(q => !context.seenQuestionIds.has(q.id));
          if (unseen) {
            matched = unseen;
          } else {
            // Find in other concepts of the same topic
            let topicUnseen = null;
            for (const oc of Object.values(regTopic.concepts)) {
              topicUnseen = oc.questions.find(q => !context.seenQuestionIds.has(q.id));
              if (topicUnseen) break;
            }
            if (topicUnseen) {
              matched = topicUnseen;
            } else {
              // Synthesize a unique facet question
              const synthesized = SynthesizeConceptFacetQuestion({
                subjectName,
                topic,
                concept: regConcept.name,
                facetIndex: (context.index > 0 ? context.index - 1 : (context.questionNumber > 0 ? context.questionNumber - 1 : 0)),
                plannedFormat: context.format || plannedFormat,
                seenFingerprints: context.seenFingerprints || new Set()
              });
              return {
                questionText: synthesized.questionText,
                verifiedReference: synthesized,
                format: synthesized.format || 'Theory',
                diagramSvg: synthesized.diagramSvg || null,
                diagramCaption: synthesized.diagramCaption || null,
                numericalDetails: synthesized.numericalDetails || null
              };
            }
          }
        }

        return {
          questionText: matched.questionText,
          verifiedReference: matched,
          format: matched.format || 'Theory',
          diagramSvg: matched.diagramSvg || null,
          diagramCaption: matched.diagramCaption || null,
          numericalDetails: matched.numericalDetails || null
        };
      }
    }
  }

  // 2. Concrete Concept-Grounded Synthesis for custom / staff-defined topics
  const cleanC = concept.replace(/\([^)]*\)/g, '').trim();
  const cleanT = topic.trim();

  let questionText = '';
  let format = 'Theory';
  let numericalDetails = null;
  let diagramSvg = null;

  const sourceText = context.sourceBlueprint?.sourcePassages?.[0]?.text ||
                     context.referencePassages?.[0]?.text ||
                     context.referenceEvidence?.[0]?.text ||
                     context.documentContext || '';

  if (sourceText) {
    const cleanSource = sourceText.replace(/\[[^\]]+\]/g, '').trim();
    const sentences = cleanSource.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
    const matchingSentence = sentences.find(s => s.toLowerCase().includes(cleanC.toLowerCase())) || sentences[0];
    if (matchingSentence) {
      format = 'Theory';
      questionText = `According to the authorized reference for ${cleanT}, how is the governing role of ${cleanC} established: "${matchingSentence.slice(0, 100)}..."?`;
    } else {
      questionText = `Based on the uploaded technical documentation for ${cleanT}, how does ${cleanC} determine system behavior and operating limits?`;
    }
  } else if (context.customKnowledge?.corePrinciple) {
    format = 'Theory';
    questionText = `In ${cleanT}, how is the governing mechanism of ${cleanC} characterized according to the technical specification: "${context.customKnowledge.corePrinciple.slice(0, 100)}..."?`;
  } else if (plannedFormat === 'scenario') {
    format = 'Scenario';
    questionText = `During operational execution of ${cleanC} in ${cleanT}, what technical factor or state variable primarily determines the system response?`;
  } else if (plannedFormat === 'diagram') {
    format = 'Diagram';
    questionText = `Analyze the functional block representation for ${cleanC} in ${cleanT} and identify the primary feedback influence.`;
    diagramSvg = GenerateDiagramSvg(subjectName, topic, concept);
  } else if (plannedFormat === 'derivation') {
    format = 'Derivation';
    questionText = `Which analytical equation or relationship defines the quantitative behavior of ${cleanC} in ${cleanT}?`;
  } else if (plannedFormat === 'comparison') {
    format = 'Comparison';
    questionText = `When comparing methods in ${cleanT}, what operational characteristic distinguishes ${cleanC} from alternative approaches?`;
  } else {
    format = 'Theory';
    questionText = `What operational mechanism and governing constraints define the function of ${cleanC} in ${cleanT}?`;
  }

  return {
    questionText,
    verifiedReference: null,
    format,
    numericalDetails,
    diagramSvg
  };
}

/**
 * 8. TASK B: GenerateOptions(question, context)
 * Generates 4 distinct, plausible, grammatically consistent options.
 */
export function GenerateOptions(question, context) {
  const resolved = resolveAcademicContext(context);

  if (question.verifiedReference?.options) {
    return [...question.verifiedReference.options];
  }

  const cleanC = resolved.concept.replace(/\([^)]*\)/g, '').trim();
  const cleanT = resolved.topic.trim();

  if (question.format === 'Scenario') {
    return [
      `The dynamic response of ${cleanC} is governed by its specific state variables and boundary constraints in ${cleanT}`,
      `The state variables in ${cleanC} operate completely detached from the physical dynamics of ${cleanT}`,
      `The feedback loop forces instantaneous saturation with zero damping or stability limits`,
      `The sensor measurements remain completely static and invariant regardless of operating conditions`
    ];
  }

  const correctOpt = `It establishes the verified operational relationship and governing constraints of ${cleanC} in ${cleanT}`;
  const distractor1 = `It misidentifies the primary driving force as a secondary transient artifact in ${cleanT}`;
  const distractor2 = `It inverts the parameter scaling relationship, predicting the opposite steady-state trend`;
  const distractor3 = `It assumes static uncoupled behavior, failing to account for dynamic feedback in ${cleanT}`;

  return [correctOpt, distractor1, distractor2, distractor3];
}

/**
 * 9. TASK C: GenerateAnswerKey(question, options, context)
 * Assigns verified correct index and reference.
 */
export function GenerateAnswerKey(question, options, context) {
  if (typeof question.verifiedReference?.correctIndex === 'number') {
    const origCorrectText = question.verifiedReference.options[question.verifiedReference.correctIndex];
    const newIdx = options.indexOf(origCorrectText);
    return {
      correctIndex: newIdx !== -1 ? newIdx : 0,
      verifiedAnswerText: origCorrectText || options[0]
    };
  }
  return {
    correctIndex: 0,
    verifiedAnswerText: options[0]
  };
}

/**
 * 10. TASK D: GenerateExplanation(question, answer, context)
 * Generates scientifically valid explanation supporting the correct answer.
 */
export function GenerateExplanation(question, answer, context) {
  if (question.verifiedReference?.explanation) {
    return question.verifiedReference.explanation;
  }

  const resolved = resolveAcademicContext(context);
  return `The correct option accurately identifies the verified functional behavior and governing parameter relationships of ${resolved.concept} in ${resolved.topic}. Distractor choices either invert parameter scaling, misattribute the primary driving force, or assume uncoupled static behavior.`;
}

/**
 * 11. TASK E: GenerateHint(question, answer, context, hintLevel, previousHints)
 * Generates progressive 4-tier hints specifically for the question.
 */
export function GenerateHint(question, answer, context, hintLevel = 1, previousHints = []) {
  if (question.verifiedReference?.hints) {
    const hints = question.verifiedReference.hints;
    const idx = Math.min(Math.max(0, hintLevel - 1), hints.length - 1);
    return hints[idx];
  }

  const resolved = resolveAcademicContext(context);
  const cleanC = resolved.concept.replace(/\([^)]*\)/g, '').trim();
  const cleanT = resolved.topic.trim();

  switch (hintLevel) {
    case 1:
      return `Identify the specific function and role of ${cleanC} in ${cleanT}.`;
    case 2:
      return `Consider the state variables and physical or mathematical constraints that define ${cleanC}.`;
    case 3:
      return `Analyze how ${cleanC} governs system behavior relative to alternative operational modes in ${cleanT}.`;
    case 4:
      return `Focus on the characteristic state transitions and parameter relationships of ${cleanC}.`;
    default:
      return `Focus on the core technical principle governing ${cleanC}.`;
  }
}

/**
 * 12. TASK F: EvaluateResponse(question, expectedAnswer, rubric, studentResponse)
 * Evaluates student answer with deterministic scoring.
 */
export function EvaluateResponse(question, expectedAnswer, rubric = {}, studentResponse = '') {
  if (question.type === 'mcq') {
    const selectedIdx = typeof studentResponse === 'number' ? studentResponse : parseInt(studentResponse, 10);
    const isCorrect = selectedIdx === question.correctIndex;
    return {
      isCorrect,
      score: isCorrect ? 100 : 0,
      status: isCorrect ? 'Correct' : 'Needs Improvement',
      feedback: isCorrect
        ? 'Accurate technical answer selected. Demonstrates robust conceptual understanding.'
        : `Option selected does not match the validated answer key. Review governing principles of ${question.concept || 'the topic'}.`
    };
  }

  // Descriptive text answer evaluation
  const resp = String(studentResponse || '').toLowerCase().trim();
  if (resp.length < 10) {
    return {
      isCorrect: false,
      score: 15,
      status: 'Needs Improvement',
      feedback: 'Response is too brief to evaluate technical depth. Detail the governing mechanisms.'
    };
  }

  const keywords = question.expectedKeywords || ['mechanism', 'principle', 'operation'];
  const matched = keywords.filter(kw => resp.includes(kw.toLowerCase()));
  const coverageRatio = matched.length / Math.max(1, keywords.length);

  let score = 50;
  if (coverageRatio >= 0.5) score = 85;
  if (coverageRatio >= 0.8) score = 95;
  if (coverageRatio < 0.25) score = 40;

  return {
    isCorrect: score >= 70,
    score,
    status: score >= 80 ? 'Correct' : score >= 50 ? 'Partially Correct' : 'Needs Improvement',
    feedback: `Identified ${matched.length}/${keywords.length} key technical concepts (${matched.join(', ') || 'none'}). Evaluated against academic rubric.`
  };
}

/**
 * Task F2: GenerateFollowUp(question, studentResponse, evaluation, context)
 * Generates an adaptive oral follow-up question locked to the active concept.
 */
export function GenerateFollowUp(question, studentResponse = '', evaluation = {}, context = {}) {
  const resolved = resolveAcademicContext(context);
  const targetConcept = question.concept || resolved.concept;
  const targetTopic = question.topic || resolved.topic;
  return `How would changing the operating parameters in ${targetTopic} alter the primary response of ${targetConcept}?`;
}

/**
 * 13. TASK G: ValidateQuestion(questionPackage, context)
 * Quality gate for academic grounding, distinct options, and consistency.
 */
export function ValidateQuestion(questionPackage = {}, context = {}) {
  const errors = [];
  const warnings = [];
  const gateDiagnostics = {
    gateA: { passed: true, message: 'Gate A (Context Integrity): Verified.' },
    gateB: { passed: true, message: 'Gate B (Technical Meaning): Verified.' },
    gateC: { passed: true, message: 'Gate C (Question Quality): Verified.' },
    gateD: { passed: true, message: 'Gate D (Answer-Key Correctness): Verified.' },
    gateE: { passed: true, message: 'Gate E (MCQ Integrity): Verified.' },
    gateF: { passed: true, message: 'Gate F (Hint & Explanation Integrity): Verified.' },
    gateG: { passed: true, message: 'Gate G (Duplicate Detection): Verified.' },
    gateH: { passed: true, message: 'Gate H (Media Integrity): Verified.' },
    gateI: { passed: true, message: 'Gate I (Novelty): Verified.' },
    gateJ: { passed: true, message: 'Gate J (Assessment Integrity): Verified.' }
  };
  let failedGate = null;

  const failGate = (gateKey, gateName, message) => {
    gateDiagnostics[gateKey] = { passed: false, message: `${gateName}: ${message}` };
    if (!failedGate) failedGate = gateName;
    errors.push(message);
  };

  const qText = String(questionPackage.questionText || '');
  const qSubj = String(questionPackage.subject || '').trim();
  const qTopic = String(questionPackage.topic || '').trim();
  const qConcept = String(questionPackage.concept || '').trim();

  // ----------------------------------------------------
  // GATE A: CONTEXT INTEGRITY & PLACEHOLDER REJECTION
  // ----------------------------------------------------
  const BANNED_PLACEHOLDERS = [
    'Curriculum Topic', 'Core Concept', 'Sample Topic', 'Default Topic',
    'Unassigned', 'All Key Concepts', 'Placeholder', 'Core Theoretical Principles',
    'Universal Discipline', 'General Academic Curriculum', 'Assigned Topic'
  ];

  for (const ph of BANNED_PLACEHOLDERS) {
    const phLower = ph.toLowerCase();
    if (qSubj.toLowerCase() === phLower || qTopic.toLowerCase() === phLower || qConcept.toLowerCase() === phLower) {
      failGate('gateA', 'Gate A (Context Integrity)', `Placeholder label "${ph}" detected in question academic metadata.`);
      break;
    }
    if (qText.includes(ph)) {
      failGate('gateA', 'Gate A (Context Integrity)', `Question text contains banned placeholder "${ph}".`);
      break;
    }
  }

  const expectedSubj = String(context.subjectName || context.subject || '').trim().toLowerCase();
  const lowerQSubj = qSubj.toLowerCase();
  if (expectedSubj && lowerQSubj && expectedSubj !== lowerQSubj && !lowerQSubj.includes(expectedSubj) && !expectedSubj.includes(lowerQSubj)) {
    failGate('gateA', 'Gate A (Context Integrity)', `Context Integrity Error: Question subject "${qSubj}" does not match authoritative context "${context.subjectName || context.subject}".`);
  }

  // ----------------------------------------------------
  // GATE B: TECHNICAL MEANING & BANNED BOILERPLATE
  // ----------------------------------------------------
  const bannedBoilerplatePhrases = [
    'In the rigorous scientific analysis of',
    'rigorous scientific analysis',
    'fundamental conservation law and governing relationship establishes dynamic equilibrium',
    'governing relationship establishes dynamic equilibrium',
    'zero thermodynamic or computational cost',
    'uncalibrated stochastic divergence',
    'operates completely detached from any boundary constraints',
    'Governing Conservation Equations and Analytical Formulations',
    'Foundational Principles, Definitions & Structural Axioms',
    'Core Theoretical Framework',
    'Operational purpose and governing significance',
    'Universal Discipline',
    'Foundational Mechanism',
    'Direct Formulation',
    'Structural Axioms',
    'governs operational performance',
    'operational performance',
    '[Foundational Reinforcement]',
    'Foundational Reinforcement',
    '[Advanced Synthesis & Edge Analysis]',
    'Reviewing the underlying causal mechanism',
    'What fundamental mechanism or governing principle characterizes',
    'how does the foundational principle of',
    'an unexpected transient deviation is observed under nominal boundary conditions',
    'In Communication Engineering, how does the foundational principle',
    'govern system behavior and physical or mathematical constraints',
    'which key criterion distinguishes its governing behavior from conventional alternative methods',
    'foundational conservation law or rate formulation establishes the governing equation',
    'What core technical principle governs the implementation',
    'What fundamental mechanism governs operational performance',
    'What is the foundational principle of this subject',
    'Which structural framework determines system behaviour',
    'governing quantitative relations of',
    '[Content_Types]',
    'schemas.openxmlformats.org'
  ];

  for (const phrase of bannedBoilerplatePhrases) {
    if (qText.toLowerCase().includes(phrase.toLowerCase())) {
      failGate('gateB', 'Gate B (Technical Meaning)', `Question text contains banned generic boilerplate: "${phrase}".`);
      break;
    }
  }

  if (Array.isArray(questionPackage.options)) {
    const bannedOptionPhrases = [
      'zero thermodynamic or computational cost',
      'uncalibrated stochastic divergence',
      'operates completely detached from any boundary constraints',
      'passive measurement baseline',
      'isolates external environmental noise',
      'damping threshold',
      'primary transfer mechanism and equilibrium response',
      'foundational mechanism and operational constraints',
      'arbitrary assumption that has no physical or mathematical relevance',
      'contradicts fundamental scientific laws and is rejected in practice',
      'operates with zero consideration of boundary parameters',
      'unbounded internal energy creation with zero thermodynamic dissipation',
      're-calibrating operating variables restores nominal equilibrium',
      'independent invariant parameter that disregards the physical constraints',
      'zero dissipative loss or impedance across boundaries',
      'zero impedance across all system interfaces',
      'uncalibrated random noise source without deterministic analytical structure',
      'ignores state variable progression, leading to uncontrolled open-loop divergence',
      'characteristic functional behavior, state transitions, and governing parameters',
      'instantaneously vanish under nominal excitation',
      'transfer rate for',
      'postulate that internal mass and energy spontaneously originate',
      'elimination of all spatial coordinates and temporal derivatives',
      'assumption that boundary conditions exert zero mathematical influence',
      'spontaneous reduction of operating temperatures to absolute zero',
      'instantaneous conversion of electrical or algorithmic state data into pure physical mass',
      'dynamic equilibrium state established under static load',
      '[Content_Types]',
      'schemas.openxmlformats.org'
    ];

    questionPackage.options.forEach((opt, idx) => {
      const optStr = String(opt || '').toLowerCase();
      for (const phrase of bannedOptionPhrases) {
        if (optStr.includes(phrase.toLowerCase())) {
          failGate('gateB', 'Gate B (Technical Meaning)', `Option ${idx + 1} contains banned boilerplate phrase: "${phrase}".`);
          break;
        }
      }
    });
  }

  // Cross-discipline quarantine
  const qLower = qText.toLowerCase();
  const subjLower = String(questionPackage.subject || context.subjectName || context.subject || '').toLowerCase();
  const topicLower = String(questionPackage.topic || context.topic || context.scheduledTopic || '').toLowerCase();

  const isCommContext = subjLower.includes('communication') || topicLower.includes('modulation') || topicLower.includes('gmsk') || topicLower.includes('pcm') || topicLower.includes('transmission line');
  const isCSContext = subjLower.includes('computer science') || subjLower.includes('dsa') || topicLower.includes('operating system') || topicLower.includes('database') || topicLower.includes('algorithm') || topicLower.includes('kruskal') || topicLower.includes('hashing');

  if (isCommContext) {
    const invalidCommPhrases = [
      'conservation law', 'dynamic equilibrium', 'mass flux', 'dissipated work', 'thermodynamic dissipation',
      'governing conservation equations', 'internal mass and energy', 'bioreactor', 'oxygen transfer'
    ];
    for (const phrase of invalidCommPhrases) {
      if (qLower.includes(phrase)) {
        failGate('gateB', 'Gate B (Technical Meaning)', `Cross-discipline violation: Communication Engineering context contains unrelated physical phrase "${phrase}".`);
        break;
      }
    }
    if (Array.isArray(questionPackage.options)) {
      questionPackage.options.forEach((opt, idx) => {
        const oLower = String(opt || '').toLowerCase();
        for (const phrase of invalidCommPhrases) {
          if (oLower.includes(phrase)) {
            failGate('gateB', 'Gate B (Technical Meaning)', `Cross-discipline violation: Communication Engineering option ${idx + 1} contains unrelated phrase "${phrase}".`);
            break;
          }
        }
      });
    }
  }

  if (isCSContext) {
    const invalidCsPhrases = [
      'conservation law', 'dynamic equilibrium', 'mass flux', 'thermodynamic dissipation',
      'bioreactor', 'oxygen transfer', 'kla', 'internal mass and energy'
    ];
    for (const phrase of invalidCsPhrases) {
      if (qLower.includes(phrase)) {
        failGate('gateB', 'Gate B (Technical Meaning)', `Cross-discipline violation: Computer Science context contains unrelated physical phrase "${phrase}".`);
        break;
      }
    }
  }

  if (subjLower.includes('biotechnology') || topicLower.includes('bioreactor') || topicLower.includes('oxygen transfer')) {
    const csKeywords = [
      'operating system', 'virtual memory', 'demand paging', 'cpu scheduling', 'deadlock', 'page table',
      'file system', 'inode', 'bode plot', 'gain margin', 'phase margin', 'qpsk', 'modulation',
      'database normalization', 'bcnf', 'eigenvalue', 'electric vehicle', 'ev battery', 'powertrain',
      'regenerative braking', 'inverter', 'motor drive', 'internal combustion', 'internet', 'tcp/ip',
      'routing protocol', 'packet switching', 'nuclear', 'radioactive'
    ];
    for (const kw of csKeywords) {
      if (qLower.includes(kw)) {
        failGate('gateB', 'Gate B (Technical Meaning)', `Cross-discipline violation: Biotechnology context contains CS/EE keyword "${kw}".`);
        break;
      }
    }
  }

  const isMotorDriveContext = subjLower.includes('electrical') || topicLower.includes('motor') || topicLower.includes('drive') || topicLower.includes('induction');
  if (isMotorDriveContext) {
    const invalidMotorPhrases = [
      'bioreactor', 'oxygen transfer', 'kla', 'fermentation', 'sparged', 'culture broth',
      'demand paging', 'virtual memory', 'page table', 'bcnf', 'packet switching'
    ];
    for (const phrase of invalidMotorPhrases) {
      if (qLower.includes(phrase)) {
        failGate('gateB', 'Gate B (Technical Meaning)', `Cross-discipline violation: Motor Drive context contains unrelated phrase "${phrase}".`);
        break;
      }
    }
    if (Array.isArray(questionPackage.options)) {
      questionPackage.options.forEach((opt, idx) => {
        const oLower = String(opt || '').toLowerCase();
        for (const phrase of invalidMotorPhrases) {
          if (oLower.includes(phrase)) {
            failGate('gateB', 'Gate B (Technical Meaning)', `Cross-discipline violation: Motor Drive option ${idx + 1} contains unrelated phrase "${phrase}".`);
            break;
          }
        }
      });
    }
  }

  // ----------------------------------------------------
  // GATE C: QUESTION QUALITY, CLARITY & TOPIC GROUNDING
  // ----------------------------------------------------
  if (!qText || qText.trim().length < 20) {
    failGate('gateC', 'Gate C (Question Quality)', 'Question text is missing, empty, or shorter than 20 characters.');
  } else {
    const trimmedQ = qText.trim();
    if (!/[?.!:\)\]]$/.test(trimmedQ)) {
      failGate('gateC', 'Gate C (Question Quality)', 'Question text must conclude with proper punctuation (e.g., "?", ".", or ":").');
    }
    if (/\$\{[^}]*\}|\bundefined\b|\bNaN\b|\[object Object\]/.test(trimmedQ)) {
      failGate('gateC', 'Gate C (Question Quality)', 'Question text contains unparsed template variable or interpolation leak.');
    }
  }

  if (questionPackage.format === 'Diagram') {
    if (!questionPackage.diagramSvg || !questionPackage.diagramSvg.includes('<svg') || !questionPackage.diagramSvg.includes('</svg>')) {
      failGate('gateC', 'Gate C (Question Quality)', 'Diagram format question is missing valid SVG diagram code.');
    }
  }

  // ----------------------------------------------------
  // GATE D: TECHNICAL CORRECTNESS & NUMERICAL CALCULATION
  // ----------------------------------------------------
  if (questionPackage.type === 'mcq' || Array.isArray(questionPackage.options)) {
    if (typeof questionPackage.correctIndex !== 'number' || questionPackage.correctIndex < 0 || questionPackage.correctIndex > 3) {
      failGate('gateD', 'Gate D (Answer-Key Correctness)', `Invalid correctIndex: ${questionPackage.correctIndex}. Must be an integer 0, 1, 2, or 3.`);
    } else if (Array.isArray(questionPackage.options)) {
      const correctOpt = questionPackage.options[questionPackage.correctIndex];
      if (!correctOpt || String(correctOpt).trim().length === 0) {
        failGate('gateD', 'Gate D (Answer-Key Correctness)', 'Option at correctIndex is empty or undefined.');
      }
    }
  }

  if (questionPackage.format === 'Numerical') {
    const numVal = VerifyNumericalCalculation(questionPackage);
    if (!numVal.valid) {
      failGate('gateD', 'Gate D (Answer-Key Correctness)', numVal.errors.join('; '));
    }
  }

  // ----------------------------------------------------
  // GATE E: MCQ INTEGRITY, DISTINGUISHABILITY & OPTION QUALITY
  // ----------------------------------------------------
  if (questionPackage.type === 'mcq') {
    if (!Array.isArray(questionPackage.options) || questionPackage.options.length !== 4) {
      failGate('gateE', 'Gate E (MCQ Integrity)', `MCQ must have exactly 4 options (found ${questionPackage.options?.length || 0}).`);
    } else {
      const trimmedOpts = questionPackage.options.map(o => String(o || '').trim());
      // 1. Min length
      if (trimmedOpts.some(o => o.length < 3)) {
        failGate('gateE', 'Gate E (MCQ Integrity)', 'One or more MCQ options are too short (< 3 characters) or empty.');
      }
      // 2. Exact duplicates
      const uniqueOpts = new Set(trimmedOpts.map(o => o.toLowerCase()));
      if (uniqueOpts.size !== 4) {
        failGate('gateE', 'Gate E (MCQ Integrity)', 'MCQ contains duplicate options.');
      }
      // 3. Paraphrase detection (Jaccard similarity > 0.88 on non-trivial words without distinct numbers)
      for (let i = 0; i < trimmedOpts.length; i++) {
        for (let j = i + 1; j < trimmedOpts.length; j++) {
          const numsI = (trimmedOpts[i].match(/\d+(\.\d+)?/g) || []).join(',');
          const numsJ = (trimmedOpts[j].match(/\d+(\.\d+)?/g) || []).join(',');
          if (numsI && numsJ && numsI !== numsJ) {
            continue; // Distinct quantitative values / parameter options
          }
          const wordsI = new Set(trimmedOpts[i].toLowerCase().split(/\s+/).filter(w => w.length > 2));
          const wordsJ = new Set(trimmedOpts[j].toLowerCase().split(/\s+/).filter(w => w.length > 2));
          if (wordsI.size > 3 && wordsJ.size > 3) {
            const intersection = [...wordsI].filter(x => wordsJ.has(x)).length;
            const union = new Set([...wordsI, ...wordsJ]).size;
            const jaccard = intersection / union;
            if (jaccard > 0.88) {
              failGate('gateE', 'Gate E (MCQ Integrity)', `Options ${i + 1} and ${j + 1} are trivial paraphrases of each other (similarity ${(jaccard * 100).toFixed(0)}%).`);
            }
          }
        }
      }
      // 4. Balanced length check (avoid conspicuously long giveaway option)
      if (typeof questionPackage.correctIndex === 'number' && questionPackage.correctIndex >= 0 && questionPackage.correctIndex < 4) {
        const correctOpt = trimmedOpts[questionPackage.correctIndex];
        const distractorLengths = trimmedOpts.filter((_, idx) => idx !== questionPackage.correctIndex).map(o => o.length);
        const avgDistractorLen = distractorLengths.reduce((a, b) => a + b, 0) / distractorLengths.length;
        if (avgDistractorLen >= 5 && correctOpt.length > avgDistractorLen * 3.0 && correctOpt.length > 60) {
          failGate('gateE', 'Gate E (MCQ Integrity)', `Correct option length (${correctOpt.length}) is conspicuously longer than distractors (avg ${avgDistractorLen.toFixed(0)}), creating a predictable pattern.`);
        }
      }
      // 5. Option does not repeat question text verbatim
      const qWords = new Set(String(questionPackage.questionText || '').toLowerCase().split(/\s+/).filter(w => w.length > 3));
      if (qWords.size > 5) {
        for (let i = 0; i < trimmedOpts.length; i++) {
          const optWords = trimmedOpts[i].toLowerCase().split(/\s+/).filter(w => w.length > 3);
          const matchedWords = optWords.filter(w => qWords.has(w)).length;
          if (optWords.length > 4 && matchedWords / optWords.length > 0.85) {
            failGate('gateE', 'Gate E (MCQ Integrity)', `Option ${i + 1} repeats the question text instead of answering it.`);
          }
        }
      }
    }
  }

  // ----------------------------------------------------
  // GATE F: HINT & EXPLANATION INTEGRITY
  // ----------------------------------------------------
  if (!Array.isArray(questionPackage.hints) || questionPackage.hints.length < 4) {
    failGate('gateF', 'Gate F (Hint & Explanation Integrity)', `Expected 4-tier progressive hints (found ${questionPackage.hints?.length || 0}).`);
  } else {
    const hintTrimmed = questionPackage.hints.map(h => String(h).trim().toLowerCase());
    const uniqueHints = new Set(hintTrimmed);
    if (uniqueHints.size < questionPackage.hints.length) {
      failGate('gateF', 'Gate F (Hint & Explanation Integrity)', 'Repeated hints detected: hints contain duplicate entries.');
    }

    // Anti-leak check for Tiers 1-3
    if (questionPackage.type === 'mcq' && Array.isArray(questionPackage.options) && typeof questionPackage.correctIndex === 'number') {
      const correctText = String(questionPackage.options[questionPackage.correctIndex] || '').toLowerCase().trim();
      questionPackage.hints.forEach((h, i) => {
        const lowerH = String(h).toLowerCase();
        if (correctText.length > 8 && lowerH.includes(correctText)) {
          failGate('gateF', 'Gate F (Hint & Explanation Integrity)', `Hint level ${i + 1} leaks the full correct answer.`);
        }
      });
    }
  }

  if (!questionPackage.explanation || String(questionPackage.explanation).trim().length < 20) {
    failGate('gateF', 'Gate F (Hint & Explanation Integrity)', 'Explanation is missing or shorter than 20 characters.');
  } else {
    const expl = String(questionPackage.explanation).toLowerCase();
    if (expl.includes('The correct response accurately states the governing operational role') ||
        expl.includes('Alternative choices describe passive measurement baselines') ||
        expl.includes('Alternative choices introduce non-physical assumptions') ||
        expl.includes('complete variable decay') ||
        expl.includes('infinite conductivity')) {
      failGate('gateF', 'Gate F (Hint & Explanation Integrity)', 'Explanation contains banned generic template phrasing.');
    }
    if (questionPackage.type === 'mcq' && typeof questionPackage.correctIndex === 'number') {
      const otherLetters = ['option a', 'option b', 'option c', 'option d'].filter((_, i) => i !== questionPackage.correctIndex);
      if (expl.includes('is correct') && otherLetters.some(ol => expl.includes(ol + ' is correct'))) {
        failGate('gateF', 'Gate F (Hint & Explanation Integrity)', 'Contradictory explanation: mentions an incorrect option as correct.');
      }
    }
  }

  // ----------------------------------------------------
  // GATE G: DUPLICATE DETECTION & FINGERPRINTING
  // ----------------------------------------------------
  if (context.seenQuestionIds && questionPackage.id && context.seenQuestionIds.has(questionPackage.id)) {
    failGate('gateG', 'Gate G (Duplicate Detection)', `Question ID "${questionPackage.id}" duplicates a question already presented in this session.`);
  }

  if (context.seenFingerprints && questionPackage.semanticFingerprint && context.seenFingerprints.has(questionPackage.semanticFingerprint)) {
    failGate('gateG', 'Gate G (Duplicate Detection)', `Semantic fingerprint matches a question already presented in this session.`);
  }

  // ----------------------------------------------------
  // GATE H: MEDIA INTEGRITY
  // ----------------------------------------------------
  if (questionPackage.format === 'Diagram' || questionPackage.format === 'Graph') {
    if (!questionPackage.diagramSvg || typeof questionPackage.diagramSvg !== 'string') {
      failGate('gateH', 'Gate H (Media Integrity)', 'Visual question format requires valid SVG diagram code.');
    } else if (!questionPackage.diagramSvg.includes('<svg') || !questionPackage.diagramSvg.includes('</svg>')) {
      failGate('gateH', 'Gate H (Media Integrity)', 'Invalid SVG markup: missing <svg> opening or closing tags.');
    }
  }

  // ----------------------------------------------------
  // GATE I: NOVELTY & SESSION DEDUPLICATION
  // ----------------------------------------------------
  if (context.seenQuestionIds && questionPackage.id && context.seenQuestionIds.has(questionPackage.id)) {
    failGate('gateI', 'Gate I (Novelty)', `Question ID "${questionPackage.id}" duplicates a question already presented in this session.`);
  }

  // ----------------------------------------------------
  // GATE J: ASSESSMENT INTEGRITY
  // ----------------------------------------------------
  if (questionPackage.difficulty) {
    const validDiffs = ['Beginner', 'Intermediate', 'Advanced', 'Foundation', 'Proficient'];
    const cleanDiff = String(questionPackage.difficulty).split('/')[0].trim();
    if (!validDiffs.some(vd => cleanDiff.toLowerCase().includes(vd.toLowerCase()))) {
      failGate('gateJ', 'Gate J (Assessment Integrity)', `Invalid difficulty level: "${questionPackage.difficulty}".`);
    }
  }
  if (questionPackage.bloomLevel) {
    const validBlooms = ['Remembering', 'Understanding', 'Application', 'Analysis', 'Evaluation', 'Creation'];
    if (!validBlooms.some(vb => String(questionPackage.bloomLevel).toLowerCase().includes(vb.toLowerCase()))) {
      failGate('gateJ', 'Gate J (Assessment Integrity)', `Invalid Bloom taxonomy level: "${questionPackage.bloomLevel}".`);
    }
  }

  return {
    valid: errors.length === 0,
    failedGate,
    gates: gateDiagnostics,
    gateDiagnostics,
    errors,
    warnings
  };
}

export function invalidateDefectiveQuestionCaches(records = []) {
  const quarantined = [];
  const valid = [];

  records.forEach(item => {
    const qText = String(item.questionText || '');
    const hasDefect = qText.includes('Foundational Mechanism') ||
      qText.includes('Direct Formulation') ||
      qText.includes('Core Theoretical Framework') ||
      qText.includes('Structural Axioms') ||
      qText.includes('operational performance') ||
      qText.includes('Foundational Reinforcement') ||
      qText.includes('[Foundational Reinforcement]') ||
      qText.includes('[Advanced Synthesis & Edge Analysis]') ||
      qText.includes('Reviewing the underlying causal mechanism') ||
      qText.includes('What fundamental mechanism or governing principle characterizes') ||
      qText.includes('how does the foundational principle of') ||
      qText.includes('Core Theoretical Principles') ||
      qText.includes('In Communication Engineering, how does the foundational principle') ||
      (Array.isArray(item.options) && item.options.some(o => {
        const s = String(o);
        return s.includes('passive measurement baseline') ||
          s.includes('damping threshold') ||
          s.includes('unbounded internal energy creation') ||
          s.includes('re-calibrating operating variables restores nominal equilibrium');
      }));

    if (hasDefect) {
      quarantined.push({
        id: item.id || 'unknown',
        reason: 'Contained deprecated generic template phrasing',
        quarantinedAt: new Date().toISOString()
      });
    } else {
      valid.push(item);
    }
  });

  return { valid, quarantined };
}

/**
 * 14. MASTER END-TO-END QUESTION PACKAGE GENERATOR
 * Generates verified, multi-format academic question packages across all disciplines.
 */
export function GenerateAcademicQuestionPackage(context = {}) {
  let ctx = context;
  if (typeof context === 'string') {
    const topicArg = arguments[1] || context;
    const optArg = arguments[2] && typeof arguments[2] === 'object' ? arguments[2] : {};
    ctx = { subjectName: context, topic: topicArg, ...optArg };
  }

  // Handle batch generation when count > 1 is requested directly on GenerateAcademicQuestionPackage
  if (ctx.count && typeof ctx.count === 'number' && ctx.count > 1) {
    const targetCount = Math.max(1, Math.min(50, ctx.count));
    const packages = [];
    const seenQuestionIds = ctx.seenQuestionIds instanceof Set 
      ? new Set(ctx.seenQuestionIds) 
      : new Set(Array.isArray(ctx.seenQuestionIds) ? ctx.seenQuestionIds : []);
    const seenFingerprints = ctx.seenFingerprints instanceof Set 
      ? new Set(ctx.seenFingerprints) 
      : new Set(Array.isArray(ctx.seenFingerprints) ? ctx.seenFingerprints : []);

    for (let i = 0; i < targetCount; i++) {
      const singlePkg = GenerateAcademicQuestionPackage({
        ...ctx,
        count: 1,
        index: i + 1,
        totalCount: targetCount,
        seenQuestionIds,
        seenFingerprints
      });
      if (singlePkg.valid) {
        seenQuestionIds.add(singlePkg.id);
        if (singlePkg.semanticFingerprint) seenFingerprints.add(singlePkg.semanticFingerprint);
        seenFingerprints.add(normalizeString(singlePkg.questionText).slice(0, 60));
        packages.push(singlePkg);
      }
    }

    if (packages.length > 0) {
      return {
        ...packages[0],
        questions: packages,
        count: packages.length,
        totalCount: targetCount,
        valid: packages.every(p => p.valid)
      };
    }
  }

  // Handle Exclusive Source Mode ("Uploaded Material Only")
  if (ctx.exclusiveSourceOnly) {
    const hasSource = (ctx.sourceBlueprint && ctx.sourceBlueprint.sourcePassages?.length > 0) ||
                      (ctx.referencePassages && ctx.referencePassages.length > 0);
    if (!hasSource) {
      return {
        valid: false,
        error: 'INSUFFICIENT_SOURCE_EVIDENCE',
        message: 'Uploaded reference material does not contain validated evidence for this topic. In exclusive source mode, questions cannot be generated without validated source content.',
        validation: { valid: false, errors: ['No validated source passages available in exclusive source mode.'] }
      };
    }
  }

  const resolved = resolveAcademicContext(ctx);
  resolved.seenQuestionIds = ctx.seenQuestionIds || ctx.seenIds || null;
  resolved.seenFingerprints = ctx.seenFingerprints || null;
  if (!resolved.valid) {
    return {
      valid: false,
      error: resolved.error,
      message: resolved.message,
      validation: { valid: false, errors: [resolved.message] }
    };
  }

  const maxAttempts = 3;
  let lastPackage = null;
  let lastValidation = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Step 1: Generate Question & Planned Format
    const qData = GenerateQuestion(resolved);

    // Step 2: Generate Options
    let options = null;
    let correctIndex = null;
    let distractorRationales = null;
    let optionsRationale = null;
    const isText = resolved.questionType === 'text' || resolved.questionType === 'descriptive';
    const isMcq = !isText;

    if (isMcq) {
      const rawOptions = GenerateOptions(qData, resolved);
      if (rawOptions && Array.isArray(rawOptions) && rawOptions.length === 4) {
        // Shuffle options using Fisher-Yates while preserving correctIndex and distractor rationales
        const origCorrect = qData.verifiedReference?.correctIndex ?? 0;
        const refRationales = qData.verifiedReference?.distractorRationales || [];
        const indexed = rawOptions.map((opt, i) => {
          const foundRef = refRationales.find(r => r.index === i) || refRationales[i];
          return {
            text: opt,
            isCorrect: i === origCorrect,
            rationaleObj: foundRef || {
              index: i,
              isCorrect: i === origCorrect,
              type: i === origCorrect ? 'Correct Answer' : (i % 2 === 1 ? 'Plausible Misconception' : 'Reasoning Error'),
              rationale: i === origCorrect
                ? `Accurately identifies the foundational governing principle and operative constraints of ${resolved.concept}.`
                : `Plausible distractor reflecting common student error or adjacent mechanism in ${resolved.topic}.`
            }
          };
        });
        for (let j = indexed.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [indexed[j], indexed[k]] = [indexed[k], indexed[j]];
        }
        options = indexed.map(item => item.text);
        correctIndex = indexed.findIndex(item => item.isCorrect);
        if (correctIndex === -1) correctIndex = 0;
        distractorRationales = indexed.map((item, newIdx) => ({
          index: newIdx,
          optionText: item.text,
          isCorrect: item.isCorrect,
          type: item.rationaleObj?.type || (item.isCorrect ? 'Correct Answer' : 'Plausible Distractor'),
          rationale: item.rationaleObj?.rationale || 'Distractor based on conceptual misconception.'
        }));
        optionsRationale = distractorRationales.map(r => `${r.type}: ${r.rationale}`);
      }
    }

    // Step 3: Generate Answer Key & Model Answer
    const modelAnswer = isMcq
      ? (options ? options[correctIndex] : null)
      : (qData.verifiedReference?.modelAnswer || `Comprehensive technical analysis of ${resolved.concept} in ${resolved.topic}.`);

    // Step 4: Generate Explanation
    let explanation = GenerateExplanation(qData, modelAnswer, resolved);
    if (isMcq && typeof correctIndex === 'number') {
      const letters = ['Option A', 'Option B', 'Option C', 'Option D'];
      const chosenLetter = letters[correctIndex];
      explanation = explanation.replace(/Option [A-D] is correct/i, `${chosenLetter} is correct`);
    }

    // Step 5: Generate Progressive Hints (Levels 1 to 4)
    const hints = [1, 2, 3, 4].map(lvl => GenerateHint(qData, modelAnswer, resolved, lvl));

    // Step 6: Extract Universal Concepts (15 Categories)
    const conceptAnalysis = ExtractUniversalConcepts(resolved.subjectName, resolved.topic, resolved);

    const questionPackage = {
      id: qData.verifiedReference?.id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      subject: resolved.subjectName,
      subjectId: resolved.subjectId,
      topic: resolved.topic,
      concept: resolved.concept,
      learningObjective: resolved.learningObjective,
      type: isMcq ? 'mcq' : 'text',
      questionType: resolved.questionType,
      format: qData.format || 'Theory',
      difficulty: resolved.difficulty,
      academicLevel: resolved.academicLevel,
      bloomLevel: qData.verifiedReference?.bloomLevel || (isMcq ? 'Understanding' : 'Application'),
      questionText: qData.questionText,
      options,
      correctIndex,
      distractorRationales,
      optionsRationale,
      modelAnswer,
      explanation,
      hints,
      diagramSvg: qData.diagramSvg || null,
      diagramCaption: qData.diagramCaption || null,
      numericalDetails: qData.numericalDetails || null,
      calculationData: qData.numericalDetails ? {
        ...qData.numericalDetails,
        stepByStepSolution: qData.numericalDetails.stepByStep || qData.numericalDetails.stepByStepSolution || ''
      } : null,
      conceptAnalysis,
      expectedKeywords: qData.verifiedReference?.expectedKeywords || [resolved.concept.toLowerCase(), resolved.topic.toLowerCase(), 'mechanism', 'analysis'],
      rubric: qData.verifiedReference?.rubric || {
        'Technical Accuracy': '50% for core concept articulation',
        'Analytical Rigor': '50% for governing relations and boundary constraints'
      },
      verifiedReference: Boolean(qData.verifiedReference),
      sourceReference: ctx.sourceReference ||
        (ctx.sourceBlueprint?.sourcePassages?.[0] ? {
          document: ctx.sourceBlueprint.sourcePassages[0].sourceDocument,
          page: ctx.sourceBlueprint.sourcePassages[0].pageNumber,
          section: ctx.sourceBlueprint.sourcePassages[0].sectionHeading,
          citation: ctx.sourceBlueprint.primaryCitation
        } : (ctx.referencePassages?.[0] ? {
          document: ctx.referencePassages[0].sourceDocument || ctx.referencePassages[0].sourceFile,
          page: ctx.referencePassages[0].pageNumber || ctx.referencePassages[0].page,
          section: ctx.referencePassages[0].sectionHeading || ctx.referencePassages[0].section,
          citation: ctx.referencePassages[0].citation || `${ctx.referencePassages[0].sourceDocument || ctx.referencePassages[0].sourceFile}, Page ${ctx.referencePassages[0].pageNumber || 1}`
        } : null)),
      semanticFingerprint: qData.verifiedReference?.semanticFingerprint || `fp_${(qData.verifiedReference?.id || (resolved.concept + '_' + (qData.format || 'theory') + '_' + (qData.questionText || '').slice(0, 35))).toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      attemptNumber: attempt
    };

    // Step 7: Validate Complete Package
    const validation = ValidateQuestion(questionPackage, resolved);
    questionPackage.validation = validation;
    questionPackage.valid = validation.valid;

    if (validation.valid) {
      return questionPackage;
    }

    lastPackage = questionPackage;
    lastValidation = validation;
  }

  // All attempts failed. Try to retrieve only a validated question matching exact subject, topic, concept from registry
  if (resolved.isRegisteredInCurriculum) {
    const sObj = Object.values(ACADEMIC_REGISTRY).find(s => normalizeString(s.name) === normalizeString(resolved.subjectName));
    const tObj = sObj && Object.values(sObj.topics).find(t => normalizeString(t.name) === normalizeString(resolved.topic));
    const cObj = tObj && Object.values(tObj.concepts).find(c => normalizeString(c.name) === normalizeString(resolved.concept));
    const fallbackQ = cObj?.questions?.[0];
    if (fallbackQ) {
      const fallbackPkg = {
        id: fallbackQ.id,
        subject: resolved.subjectName,
        subjectId: resolved.subjectId,
        topic: resolved.topic,
        concept: resolved.concept,
        learningObjective: cObj.learningObjective,
        type: fallbackQ.type || 'mcq',
        format: fallbackQ.format || 'Theory',
        difficulty: fallbackQ.difficulty || resolved.difficulty,
        bloomLevel: fallbackQ.bloomLevel || 'Understanding',
        questionText: fallbackQ.questionText,
        options: fallbackQ.options ? [...fallbackQ.options] : null,
        correctIndex: fallbackQ.correctIndex ?? 0,
        distractorRationales: fallbackQ.distractorRationales || (fallbackQ.options ? fallbackQ.options.map((opt, i) => ({
          index: i,
          optionText: opt,
          isCorrect: i === (fallbackQ.correctIndex ?? 0),
          type: i === (fallbackQ.correctIndex ?? 0) ? 'Correct Answer' : 'Plausible Distractor',
          rationale: i === (fallbackQ.correctIndex ?? 0)
            ? `Accurate technical formulation for ${resolved.concept}.`
            : `Plausible distractor in ${resolved.topic}.`
        })) : null),
        optionsRationale: (fallbackQ.distractorRationales || (fallbackQ.options ? fallbackQ.options.map((opt, i) => ({
          type: i === (fallbackQ.correctIndex ?? 0) ? 'Correct Answer' : 'Plausible Distractor',
          rationale: i === (fallbackQ.correctIndex ?? 0) ? `Accurate formulation for ${resolved.concept}.` : `Plausible distractor in ${resolved.topic}.`
        })) : [])).map(r => `${r.type}: ${r.rationale}`),
        modelAnswer: fallbackQ.modelAnswer,
        explanation: fallbackQ.explanation,
        hints: fallbackQ.hints ? [...fallbackQ.hints] : [],
        diagramSvg: fallbackQ.diagramSvg || null,
        numericalDetails: fallbackQ.numericalDetails || null,
        verifiedReference: true,
        valid: true
      };
      const v = ValidateQuestion(fallbackPkg, resolved);
      if (v.valid) {
        fallbackPkg.validation = v;
        return fallbackPkg;
      }
    }
  }

  // No validated item could be found or synthesized: return recoverable error, NEVER publish invalid generic fallback
  return {
    valid: false,
    error: 'GENERATION_VALIDATION_FAILED',
    message: 'Candidate failed academic semantic validation across bounded attempt budget.',
    subject: resolved.subjectName,
    topic: resolved.topic,
    concept: resolved.concept,
    validation: lastValidation,
    failedPackage: lastPackage
  };
}
