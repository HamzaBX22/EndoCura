// Bangla & English Voice Recognition and Natural Language Symptom Parser for EndoCura

export class VoiceLogger {
  constructor(onResultCallback, onErrorCallback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.supported = !!SpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;
    this.onResult = onResultCallback;
    this.onError = onErrorCallback;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        const parsed = this.parseSymptoms(transcript);
        if (this.onResult) this.onResult(transcript, parsed);
      };

      this.recognition.onerror = (err) => {
        this.isListening = false;
        if (this.onError) this.onError(err);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  startListening(lang = 'bn-BD') {
    if (!this.supported) {
      alert('আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই। দয়া করে Google Chrome বা Edge ব্যবহার করুন।');
      return;
    }
    this.recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.warn('Recognition already started', e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Intelligent Keyword Parser mapping Bengali & English speech to tracker states
  parseSymptoms(text = '') {
    const lower = text.toLowerCase();
    const result = {
      flowLevel: null,
      painRating: null,
      coldHands: false,
      morningFatigue: false,
      sugarCraving: false,
      tookMeds: false
    };

    // 1. Pain Detection
    if (
      lower.includes('তীব্র') ||
      lower.includes('খুব ব্যথা') ||
      lower.includes('অসহ্য') ||
      lower.includes('যন্ত্রণা') ||
      lower.includes('severe') ||
      lower.includes('terrible') ||
      lower.includes('bad pain')
    ) {
      result.painRating = 9;
    } else if (
      lower.includes('মাঝারি ব্যথা') ||
      lower.includes('পেটে ব্যথা') ||
      lower.includes('ব্যথা করছে') ||
      lower.includes('ব্যথা হচ্ছে') ||
      lower.includes('moderate') ||
      lower.includes('hurts')
    ) {
      result.painRating = 6;
    } else if (
      lower.includes('হালকা ব্যথা') ||
      lower.includes('টানটান') ||
      lower.includes('অস্বস্তি') ||
      lower.includes('mild')
    ) {
      result.painRating = 3;
    } else if (
      lower.includes('ব্যথা নেই') ||
      lower.includes('ভালো আছি') ||
      lower.includes('no pain') ||
      lower.includes('fine')
    ) {
      result.painRating = 0;
    }

    // 2. Bleeding Flow Detection
    if (
      lower.includes('চাকা') ||
      lower.includes('রক্তের চাকা') ||
      lower.includes('গল্ফ বল') ||
      lower.includes('উপচে') ||
      lower.includes('clot') ||
      lower.includes('flooding')
    ) {
      result.flowLevel = 'clots';
    } else if (
      lower.includes('ভারী রক্ত') ||
      lower.includes('বেশি রক্তপাত') ||
      lower.includes('অনেক রক্ত') ||
      lower.includes('heavy')
    ) {
      result.flowLevel = 'heavy';
    } else if (
      lower.includes('মাঝারি রক্ত') ||
      lower.includes('স্বাভাবিক') ||
      lower.includes('medium')
    ) {
      result.flowLevel = 'medium';
    } else if (
      lower.includes('হালকা রক্ত') ||
      lower.includes('সামান্য দাগ') ||
      lower.includes('স্পটিং') ||
      lower.includes('light') ||
      lower.includes('spotting')
    ) {
      result.flowLevel = 'light';
    }

    // 3. Other Symptoms Check
    if (lower.includes('ঠান্ডা') || lower.includes('বরফ') || lower.includes('cold')) {
      result.coldHands = true;
    }
    if (lower.includes('ক্লান্ত') || lower.includes('মাথা ঘোরা') || lower.includes('দুর্বল') || lower.includes('tired') || lower.includes('fatigue')) {
      result.morningFatigue = true;
    }
    if (lower.includes('মিষ্টি') || lower.includes('খাবার ইচ্ছা') || lower.includes('sugar') || lower.includes('sweet')) {
      result.sugarCraving = true;
    }
    if (lower.includes('ওষুধ') || lower.includes('ঔষধ') || lower.includes('খেয়েছি') || lower.includes('meds') || lower.includes('pill')) {
      result.tookMeds = true;
    }

    return result;
  }
}
