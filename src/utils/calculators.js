// Clinical Calculators for PCOS and Adenomyosis

/**
 * PBAC (Pictorial Blood Loss Assessment Chart) Scoring
 * Standard validated clinical scoring for Menorrhagia (Highfield et al.)
 */
export const calculatePBAC = (entry) => {
  if (!entry || !entry.bleeding) return { totalScore: 0, status: 'none', severity: 'None' };

  const {
    padsLight = 0,
    padsModerate = 0,
    padsSaturated = 0,
    tamponsLight = 0,
    tamponsModerate = 0,
    tamponsSaturated = 0,
    clotsSmall = 0,
    clotsLarge = 0,
    floodingEpisodes = 0
  } = entry.bleeding;

  // PBAC Standard Point System:
  // Light = 1, Moderate = 5, Saturated = 20
  // Small clot (<1 inch) = 1, Large clot (>=1 inch) = 5
  // Flooding incident = 5
  const score =
    padsLight * 1 +
    padsModerate * 5 +
    padsSaturated * 20 +
    tamponsLight * 1 +
    tamponsModerate * 5 +
    tamponsSaturated * 20 +
    clotsSmall * 1 +
    clotsLarge * 5 +
    floodingEpisodes * 5;

  let severity = 'None';
  let status = 'normal';

  if (score === 0) {
    severity = 'No Bleeding / Spotting';
    status = 'spotting';
  } else if (score <= 15) {
    severity = 'Normal / Light Flow';
    status = 'normal';
  } else if (score <= 35) {
    severity = 'Moderate Flow';
    status = 'moderate';
  } else if (score <= 60) {
    severity = 'Heavy Menstrual Flow';
    status = 'heavy';
  } else {
    severity = 'Severe Flooding (Adenomyosis Pattern)';
    status = 'severe';
  }

  return { totalScore: score, severity, status };
};

/**
 * Anemia Risk Evaluation
 * Evaluates risk based on cumulative PBAC score, reported symptoms, and ferritin/hemoglobin levels.
 */
export const calculateAnemiaRisk = (cycleEntries = [], latestLabs = {}) => {
  let cyclePBAC = 0;
  let heavyDaysCount = 0;
  let largeClotsTotal = 0;

  cycleEntries.forEach(entry => {
    const pbac = calculatePBAC(entry);
    cyclePBAC += pbac.totalScore;
    if (pbac.totalScore >= 25) heavyDaysCount++;
    if (entry.bleeding?.clotsLarge) largeClotsTotal += entry.bleeding.clotsLarge;
  });

  let riskScore = 0;
  let flags = [];

  // PBAC Cycle Risk: >100 is Menorrhagia (High risk), >150 is Severe
  if (cyclePBAC >= 150) {
    riskScore += 40;
    flags.push('High blood volume loss (PBAC > 150)');
  } else if (cyclePBAC >= 100) {
    riskScore += 25;
    flags.push('Clinical menorrhagia (PBAC > 100)');
  }

  if (largeClotsTotal >= 3) {
    riskScore += 15;
    flags.push('Multiple large uterine clots (>1 inch)');
  }

  // Check recent lab biomarkers if provided
  if (latestLabs?.ferritin && latestLabs.ferritin < 30) {
    riskScore += 30;
    flags.push(`Depleted Ferritin reserves (${latestLabs.ferritin} ng/mL; optimal > 50)`);
  }
  if (latestLabs?.hemoglobin && latestLabs.hemoglobin < 12.0) {
    riskScore += 35;
    flags.push(`Clinical anemia (Hb ${latestLabs.hemoglobin} g/dL; normal >= 12.0)`);
  }

  let level = 'Low';
  let color = 'var(--accent-teal)';
  if (riskScore >= 50) {
    level = 'High Risk (Medical Review Recommended)';
    color = 'var(--accent-crimson)';
  } else if (riskScore >= 25) {
    level = 'Moderate Risk (Monitor Closely)';
    color = 'var(--accent-amber)';
  }

  return { riskScore, level, color, flags, cyclePBAC, heavyDaysCount, largeClotsTotal };
};

/**
 * Ferriman-Gallwey Hirsutism Score Calculator
 * Standard scoring for 9 androgen-sensitive areas (0 to 4 each)
 */
export const calculateHirsutismScore = (scores = {}) => {
  const areas = ['lip', 'chin', 'chest', 'upperBack', 'lowerBack', 'upperAbdomen', 'lowerAbdomen', 'arms', 'thighs'];
  let total = 0;
  areas.forEach(area => {
    total += Number(scores[area] || 0);
  });

  let grade = 'Normal (Low Androgen Manifestation)';
  if (total >= 15) {
    grade = 'Severe Hirsutism (Significant Hyperandrogenemia)';
  } else if (total >= 8) {
    grade = 'Clinical Hirsutism (Consistent with PCOS)';
  } else if (total >= 5) {
    grade = 'Borderline / Mild Excess';
  }

  return { totalScore: total, grade, isClinical: total >= 8 };
};

/**
 * Biphasic BBT Ovulation Detection Algorithm
 * Detects whether a temperature jump of >= 0.2°C (0.4°F) is maintained for 3 days over the previous 6 days.
 */
export const detectOvulationFromBBT = (entries = []) => {
  const sorted = [...entries]
    .filter(e => e.bbt && !isNaN(e.bbt))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (sorted.length < 9) {
    return {
      detected: false,
      message: 'Need at least 9 consecutive days of BBT readings for clinical ovulation verification.',
      dayOfShift: null
    };
  }

  for (let i = 6; i < sorted.length - 2; i++) {
    const priorSix = sorted.slice(i - 6, i).map(e => Number(e.bbt));
    const highestPrior = Math.max(...priorSix);
    const postThree = sorted.slice(i, i + 3).map(e => Number(e.bbt));

    // Check if all 3 consecutive post temperatures are higher by >= 0.2°C (approx 0.36°F)
    const isShift = postThree.every(t => t >= highestPrior + 0.18);

    if (isShift) {
      return {
        detected: true,
        message: `Biphasic thermal shift detected around ${sorted[i].date} (Progesterone rise confirmed).`,
        dayOfShift: sorted[i].date,
        ovulationDay: sorted[i - 1]?.date || sorted[i].date
      };
    }
  }

  return {
    detected: false,
    message: 'Monophasic curve detected (typical of anovulatory PCOS cycles). No clear progesterone spike observed yet.',
    dayOfShift: null
  };
};

/**
 * PCOS Phenotype Classifier
 */
export const classifyPCOSPhenotype = (answers) => {
  const {
    highAndrogens = false,     // acne, hirsutism, high testosterone
    irregularCycles = false,   // oligomenorrhea / anovulation
    polycysticOvaries = false, // TVS ultrasound appearance
    insulinResistance = false, // high fasting insulin, acanthosis nigricans, sugar crashes
    highInflammation = false,  // elevated hs-CRP, severe fatigue, joint pain
    adrenalStress = false,     // elevated DHEA-S, high anxiety, insomnia
    postPillOnset = false      // symptoms started right after stopping oral contraceptives
  } = answers;

  let phenotypes = [];
  let primaryType = 'Undetermined';
  let description = '';

  // Rotterdam 2003 Criteria Phenotypes
  if (highAndrogens && irregularCycles && polycysticOvaries) {
    primaryType = 'Phenotype A (Full / Classic PCOS)';
    description = 'Manifests all three Rotterdam diagnostic criteria: hyperandrogenism, chronic ovulatory dysfunction, and polycystic morphology on ultrasound.';
  } else if (highAndrogens && irregularCycles && !polycysticOvaries) {
    primaryType = 'Phenotype B (Non-PCO PCOS)';
    description = 'Hyperandrogenism and irregular ovulation with normal ovarian morphology on ultrasound.';
  } else if (highAndrogens && !irregularCycles && polycysticOvaries) {
    primaryType = 'Phenotype C (Ovulatory PCOS)';
    description = 'Elevated androgens and polycystic ovaries but retains cyclic regular bleeding.';
  } else if (!highAndrogens && irregularCycles && polycysticOvaries) {
    primaryType = 'Phenotype D (Normoandrogenic PCOS)';
    description = 'Irregular cycles and polycystic ovaries without clinical hyperandrogenism.';
  } else {
    primaryType = 'Metabolic / Ovulatory Dysregulation';
    description = 'Borderline or subclinical presentation. Continued biomarker monitoring advised.';
  }

  // Root Cause Drivers
  let drivers = [];
  if (insulinResistance) drivers.push('Insulin Resistance Driver (Key target: Inositol, Glycemic control)');
  if (highInflammation) drivers.push('Systemic Inflammation Driver (Key target: Curcumin, Omega-3, Gut integrity)');
  if (adrenalStress) drivers.push('Adrenal / HPA-Axis Driver (Key target: Cortisol regulation, Ashwagandha/Holy Basil)');
  if (postPillOnset) drivers.push('Post-Pill Rebound Driver (Temporary LH surge after oral contraceptive cessation)');

  return { primaryType, description, drivers };
};
