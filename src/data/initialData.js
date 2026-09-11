// Clinically Realistic Sample Dataset for Dual PCOS & Adenomyosis Co-occurrence
// Allows immediate demonstration of PBAC calculations, heatmaps, biphasic BBT curves, and doctor dossiers.

export const createSampleCycleData = () => {
  const today = new Date();
  const entries = [];

  // Generate 28 consecutive cycle days
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const cycleDay = 28 - i; // Day 1 to Day 28

    let bleeding = {
      padsLight: 0,
      padsModerate: 0,
      padsSaturated: 0,
      tamponsLight: 0,
      tamponsModerate: 0,
      tamponsSaturated: 0,
      clotsSmall: 0,
      clotsLarge: 0,
      floodingEpisodes: 0
    };

    let pain = {
      nrsScore: 0,
      quality: [],
      radiation: [],
      dyspareunia: false,
      dyschezia: false,
      triggers: []
    };

    let bbt = 36.35; // Default follicular baseline
    let cervicalMucus = 'dry';
    let energyLevel = 7; // 1-10
    let sugarCrash = false;
    let stressLevel = 4; // 1-10
    let notes = '';

    // Day 1 to 5: Acute Heavy Menstrual Bleeding & Severe Adenomyosis Cramping
    if (cycleDay === 1) {
      bleeding = { padsLight: 1, padsModerate: 2, padsSaturated: 2, tamponsLight: 0, tamponsModerate: 0, tamponsSaturated: 0, clotsSmall: 2, clotsLarge: 1, floodingEpisodes: 1 };
      pain = { nrsScore: 8, quality: ['Severe Cramping', 'Dragging Heaviness', 'Throbbing'], radiation: ['lowerBack', 'innerThighs'], dyspareunia: false, dyschezia: true, triggers: ['Menstrual Onset'] };
      bbt = 36.32;
      cervicalMucus = 'bleeding';
      energyLevel = 3;
      notes = 'Intense uterine contractions. Passed golf-ball sized clot in the afternoon. Needed heating pad and hot chamomile.';
    } else if (cycleDay === 2) {
      // Peak Menorrhagia day
      bleeding = { padsLight: 0, padsModerate: 1, padsSaturated: 4, tamponsLight: 0, tamponsModerate: 0, tamponsSaturated: 0, clotsSmall: 3, clotsLarge: 2, floodingEpisodes: 2 };
      pain = { nrsScore: 9, quality: ['Severe Cramping', 'Stabbing', 'Dragging Heaviness'], radiation: ['lowerBack', 'innerThighs', 'rectum'], dyspareunia: false, dyschezia: true, triggers: ['Uterine Hypercontractility'] };
      bbt = 36.28;
      cervicalMucus = 'bleeding';
      energyLevel = 2;
      notes = 'Flooding through overnight pad. Extreme dizziness and pallor upon standing. Took Tranexamic acid as prescribed.';
    } else if (cycleDay === 3) {
      bleeding = { padsLight: 1, padsModerate: 3, padsSaturated: 1, tamponsLight: 0, tamponsModerate: 0, tamponsSaturated: 0, clotsSmall: 2, clotsLarge: 0, floodingEpisodes: 0 };
      pain = { nrsScore: 7, quality: ['Dull Aching', 'Dragging Heaviness'], radiation: ['lowerBack'], dyspareunia: false, dyschezia: false, triggers: [] };
      bbt = 36.30;
      cervicalMucus = 'bleeding';
      energyLevel = 4;
      notes = 'Bleeding slowing slightly with TXA. Feeling drained, heavy iron fatigue.';
    } else if (cycleDay === 4) {
      bleeding = { padsLight: 2, padsModerate: 1, padsSaturated: 0, tamponsLight: 0, tamponsModerate: 0, tamponsSaturated: 0, clotsSmall: 1, clotsLarge: 0, floodingEpisodes: 0 };
      pain = { nrsScore: 4, quality: ['Dull Aching'], radiation: ['lowerBack'], dyspareunia: false, dyschezia: false, triggers: [] };
      bbt = 36.34;
      cervicalMucus = 'bleeding';
      energyLevel = 5;
    } else if (cycleDay === 5) {
      bleeding = { padsLight: 2, padsModerate: 0, padsSaturated: 0, tamponsLight: 0, tamponsModerate: 0, tamponsSaturated: 0, clotsSmall: 0, clotsLarge: 0, floodingEpisodes: 0 };
      pain = { nrsScore: 2, quality: ['Mild Discomfort'], radiation: [], dyspareunia: false, dyschezia: false, triggers: [] };
      bbt = 36.38;
      cervicalMucus = 'spotting';
      energyLevel = 6;
    } else if (cycleDay >= 6 && cycleDay <= 12) {
      // Follicular Phase: Quiet uterus, PCOS insulin resistance tracking
      bbt = Number((36.30 + (Math.sin(cycleDay) * 0.08)).toFixed(2));
      cervicalMucus = cycleDay > 10 ? 'creamy' : 'sticky';
      pain = { nrsScore: cycleDay === 10 ? 3 : 1, quality: [], radiation: [], dyspareunia: false, dyschezia: false, triggers: [] };
      energyLevel = 7;
      if (cycleDay === 8) {
        sugarCrash = true;
        pain.triggers.push('High-Carb Pastry (Sugar Crash)');
        notes = 'Had bakery muffin at work; 90 minutes later experienced acute brain fog and shaking hunger.';
      }
    } else if (cycleDay >= 13 && cycleDay <= 16) {
      // Fertile Window / Ovulatory surge
      cervicalMucus = cycleDay === 15 ? 'egg-white' : 'watery';
      bbt = cycleDay === 15 ? 36.22 : 36.35; // Pre-ovulatory dip on day 15
      pain = {
        nrsScore: 4,
        quality: ['Mittelschmerz (Right Ovary Ache)'],
        radiation: ['hips'],
        dyspareunia: false,
        dyschezia: false,
        triggers: ['Ovulation Follicular Expansion']
      };
      energyLevel = 8;
      notes = 'Fertile egg-white mucus present. Right lower quadrant twinge (ovulation pain).';
    } else if (cycleDay >= 17 && cycleDay <= 28) {
      // Luteal Phase: Biphasic BBT shift (Progesterone rise)
      bbt = Number((36.72 + (Math.cos(cycleDay) * 0.06)).toFixed(2));
      cervicalMucus = 'creamy';

      // Pre-menstrual inflammatory flare around Day 23-25
      if (cycleDay === 23 || cycleDay === 24) {
        pain = {
          nrsScore: 6,
          quality: ['Pelvic Fullness', 'Deep Uterine Ache', 'Throbbing'],
          radiation: ['lowerBack', 'innerThighs'],
          dyspareunia: true,
          dyschezia: false,
          triggers: ['High Stress Deadline', 'Late Night Dairy Ice Cream']
        };
        stressLevel = 8;
        energyLevel = 4;
        notes = 'Pre-menstrual flare-up. Uterus feels swollen and heavy like a bowling ball.';
      } else {
        pain = { nrsScore: 2, quality: ['Mild Heaviness'], radiation: [], dyspareunia: false, dyschezia: false, triggers: [] };
        energyLevel = 6;
      }
    }

    entries.push({
      date: dateStr,
      cycleDay,
      bleeding,
      pain,
      bbt,
      cervicalMucus,
      energyLevel,
      sugarCrash,
      stressLevel,
      acneRating: cycleDay > 20 ? 3 : 1, // Acne worsens in luteal phase
      hirsutismShave: cycleDay % 4 === 0,
      supplementsTaken: true,
      notes
    });
  }

  return entries;
};

export const samplePatientProfile = {
  name: 'Anika Rahman',
  age: 29,
  diagnoses: [
    'PCOS (Phenotype A - Classic Rotterdam Criteria)',
    'Adenomyosis (Diffuse Posterior Myometrial Infiltration)',
    'Microcytic Iron Deficiency Anemia secondary to Menorrhagia'
  ],
  physicianName: 'Dr. Nusrat Chowdhury, FCPS (OB/GYN)',
  clinicName: 'Women’s Reproductive & Endocrine Center',
  heightCm: 162,
  weightKg: 68,
  bmi: 25.9,
  phenotypeSurvey: {
    highAndrogens: true,
    irregularCycles: true,
    polycysticOvaries: true,
    insulinResistance: true,
    highInflammation: true,
    adrenalStress: false,
    postPillOnset: false
  },
  ferrimanGallweyScores: {
    lip: 2,
    chin: 2,
    chest: 1,
    upperBack: 1,
    lowerBack: 1,
    upperAbdomen: 2,
    lowerAbdomen: 2,
    arms: 1,
    thighs: 2
  }, // Total: 14 (Clinical Hirsutism)
  latestLabs: {
    recordedDate: '2026-08-15',
    ferritin: 14.2, // ng/mL (Severely low, optimal > 50)
    hemoglobin: 11.2, // g/dL (Mild Anemia, normal 12-15.5)
    fastingInsulin: 18.4, // uIU/mL (Elevated, optimal < 6)
    fastingGlucose: 96, // mg/dL
    lh: 13.8, // mIU/mL
    fsh: 5.2, // mIU/mL (LH:FSH ratio > 2.6:1 - classic PCOS)
    totalTestosterone: 68, // ng/dL (Elevated, normal < 45)
    dheaS: 240, // ug/dL
    tsh: 2.1, // uIU/mL (Normal)
    vitaminD: 21.0 // ng/mL (Sub-optimal / Insufficient)
  },
  ultrasoundReport: {
    scanDate: '2026-06-20',
    modality: 'Transvaginal Sonography (TVS)',
    uterusDimensions: '8.6 cm x 6.1 cm x 5.8 cm (Globular, asymmetric enlargement)',
    myometriumFindings: 'Heterogeneous appearance with diffuse subendometrial microcysts, ill-defined endometrial-myometrial junctional zone thickness measuring 14.5 mm (normal < 12 mm), consistent with Diffuse Posterior Adenomyosis.',
    rightOvary: 'Volume 11.8 cc, 16 subcentimetric peripheral antral follicles ("pearl necklace" sign).',
    leftOvary: 'Volume 10.4 cc, 14 subcentimetric peripheral follicles. No dominant follicle seen.',
    pouchOfDouglas: 'Clear of free fluid.'
  },
  activePrescriptions: [
    { name: 'Myo-Inositol & D-Chiro (40:1)', dose: '2,000 mg twice daily', purpose: 'Insulin Sensitizer & Ovulation induction' },
    { name: 'Tranexamic Acid (TXA)', dose: '1,000 mg TID during heavy flow days', purpose: 'Reduces menorrhagia blood volume' },
    { name: 'Magnesium Bisglycinate', dose: '350 mg at night', purpose: 'Myometrial relaxation & sleep' },
    { name: 'Iron Bisglycinate + Vit C', dose: '45 mg elemental iron alternate days', purpose: 'Ferritin replenishment' },
    { name: 'Omega-3 (High EPA)', dose: '2,400 mg daily', purpose: 'Prostaglandin & systemic inflammation suppression' }
  ]
};
