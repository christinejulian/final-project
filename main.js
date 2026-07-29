/**
 * Mini-Documentary Interactive Engine
 * Topic: Generative AI, Creative Labor, & Digital Value Redistribution
 */

const documentaryData = [
    {
        actTitle: "ACT I: DATA EXTRACTION & VALUE CAPTURE",
        badge: "CHAPTER 01 // CAPITAL ACCUMULATION",
        headline: "Extracting the Creative Commons",
        subtext: "Generative AI models rely on vast repositories of human artistry, converting decades of creative output into raw computational training data.",
        dataTitle: "UNCOMPENSATED EXTRACTION",
        dataValue: "5.85 Billion Datapoints",
        dataDesc: "Datasets like LAION-5B scrape art platforms without explicit artist consent, attribution, or financial royalties.",
        narration: "How does your digital life produce, consume, and redistribute value, and for whom? Today, every brushstroke uploaded online becomes raw material for capital accumulation. AI conglomerates like OpenAI, Google, and Midjourney absorb human culture, transforming public artistic output into proprietary algorithms.",
        duration: 75,
        visualType: "flow-extraction"
    },
    {
        actTitle: "ACT II: DE-SKILLING & TASK AUTOMATION",
        badge: "CHAPTER 02 // LABOR DISPLACEMENT",
        headline: "De-Skilling & Algorithmic Substitution",
        subtext: "Automating core creative tasks across visual arts, copy writing, musical composition, and video synthesis alters professional creative authority.",
        dataTitle: "CREATIVE INDUSTRY IMPACT",
        dataValue: "-34% Contract Work",
        dataDesc: "Freelance visual artists and entry-level copywriters face declining rates as corporations substitute human skill with automated prompts.",
        narration: "As generative AI automates text, illustration, audio engineering, and motion graphics, traditional artisanal skills face systemic devaluation. Creative labor is increasingly reduced to prompt engineering and post-generation curation, transferring agency from skilled human artisans to centralized tech platforms.",
        duration: 75,
        visualType: "chart-automation"
    },
    {
        actTitle: "ACT III: GHOST WORK & GLOBAL INEQUALITIES",
        badge: "CHAPTER 03 // EXPLOITATION AT THE MARGINS",
        headline: "The Hidden Labor of the Global South",
        subtext: "Behind clean AI interfaces lies a global army of underpaid data labelers, annotators, and content moderators performing precarious ghost work.",
        dataTitle: "WAGE INEQUALITY",
        dataValue: "< $2.00 / Hour",
        dataDesc: "Data workers in Kenya, the Philippines, and India filter violent content and annotate training sets under severe psychological stress.",
        narration: "While tech companies project an image of effortless automation, AI models depend on outsourced labor in the Global South. Thousands of workers are paid sub-minimum wages to label images, moderate toxic outputs, and fine-tune reinforcement learning systems—reifying neo-colonial economic hierarchies.",
        duration: 75,
        visualType: "map-global-labor"
    },
    {
        actTitle: "ACT IV: STRUCTURAL RESTRUCTURING & FUTURES",
        badge: "CHAPTER 04 // THE NEW MEDIA ECONOMY",
        headline: "Restructuring Creative Power & Democratic Control",
        subtext: "Evaluating whether AI democratizes artistic tools or permanently consolidates economic dominance within digital media cartels.",
        dataTitle: "MARKET CONCENTRATION",
        dataValue: "85% Infrastructure Control",
        dataDesc: "Hyperscale cloud providers control the massive compute resources necessary to train state-of-the-art foundation models.",
        narration: "Generative AI is not merely a technological iteration; it is a fundamental restructuring of cultural production. Without collective bargaining, algorithmic transparency, and fair compensation models, AI risks entrenching platform monopolies over human culture. The future of creative labor remains an active political battleground.",
        duration: 75,
        visualType: "diagram-future"
    }
];

class DocumentaryEngine {
    constructor() {
        this.currentActIndex = 0;
        this.currentTime = 0;
        this.totalDuration = 300; // 5 Minutes total (300 seconds)
        this.isPlaying = false;
        this.musicEnabled = true;
        this.voiceEnabled = true;
        this.timerInterval = null;
        this.synth = window.speechSynthesis;
        this.audioCtx = null;
        this.musicGain = null;

        this.initDOM();
        this.initAudioSynth();
        this.bindEvents();
        this.loadAct(0);
    }

    initDOM() {
        this.timerDisplay = document.getElementById('timer-display');
        this.chapterIndicator = document.getElementById('chapter-indicator');
        this.slideHeadline = document.getElementById('slide-headline');
        this.slideSubtext = document.getElementById('slide-subtext');
        this.actBadge = document.getElementById('act-badge');
        this.dataTitle = document.getElementById('data-title');
        this.dataValue = document.getElementById('data-value');
        this.dataDesc = document.getElementById('data-desc');
        this.subtitleText = document.getElementById('subtitle-text');
        this.progressBar = document.getElementById('progress-bar');
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.audioToggle = document.getElementById('audio-toggle');
        this.voiceToggle = document.getElementById('voice-toggle');
        this.visualStage = document.getElementById('visual-stage');
        this.actButtons = document.querySelectorAll('.act-btn');
    }

    initAudioSynth() {
        // Web Audio API Ambient Sound Generator
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.musicGain = this.audioCtx.createGain();
        this.musicGain.gain.value = 0.08;
        this.musicGain.connect(this.audioCtx.destination);
    }

    playAmbientDrone() {
        if (!this.musicEnabled || !this.isPlaying) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        // Low synth drone for cinematic mood
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(55, this.audioCtx.currentTime); // A1 note
        osc2.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2 note

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.audioCtx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(this.musicGain);

        osc1.start();
        osc2.start();

        osc1.stop(this.audioCtx.currentTime + 15);
        osc2.stop(this.audioCtx.currentTime + 15);
    }

    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.navigateAct(-1));
        this.nextBtn.addEventListener('click', () => this.navigateAct(1));
        
        this.actButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actIdx = parseInt(e.target.dataset.act);
                this.jumpToAct(actIdx);
            });
        });

        this.audioToggle.addEventListener('click', () => {
            this.musicEnabled = !this.musicEnabled;
            this.audioToggle.innerText = `🎵 Music: ${this.musicEnabled ? 'ON' : 'OFF'}`;
            if (!this.musicEnabled && this.musicGain) {
                this.musicGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
            } else if (this.musicGain) {
                this.musicGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
            }
        });

        this.voiceToggle.addEventListener('click', () => {
            this.voiceEnabled = !this.voiceEnabled;
            this.voiceToggle.innerText = `🎙️ Narration: ${this.voiceEnabled ? 'ON' : 'OFF'}`;
            if (!this.voiceEnabled) {
                this.synth.cancel();
            } else if (this.isPlaying) {
                this.speakNarration(documentaryData[this.currentActIndex].narration);
            }
        });
    }

    loadAct(actIndex) {
        this.currentActIndex = actIndex;
        const data = documentaryData[actIndex];

        this.chapterIndicator.innerText = data.actTitle;
        this.actBadge.innerText = data.badge;
        this.slideHeadline.innerText = data.headline;
        this.slideSubtext.innerText = data.subtext;
        this.dataTitle.innerText = data.dataTitle;
        this.dataValue.innerText = data.dataValue;
        this.dataDesc.innerText = data.dataDesc;
        this.subtitleText.innerText = data.narration;

        this.actButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === actIndex);
        });

        this.renderVisual(data.visualType);

        if (this.isPlaying && this.voiceEnabled) {
            this.speakNarration(data.narration);
        }
    }

    renderVisual(visualType) {
        this.visualStage.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'visual-card';

        if (visualType === 'flow-extraction') {
            card.innerHTML = `
                <svg class="diagram-svg" viewBox="0 0 800 300">
                    <line x1="150" y1="150" x2="400" y2="150" class="flow-line" />
                    <line x1="400" y1="150" x2="650" y2="150" class="flow-line" />
                    
                    <circle cx="150" cy="150" r="50" class="node" />
                    <text x="150" y="145" class="node-text">HUMAN ARTISTS</text>
                    <text x="150" y="165" class="node-text" fill="#8a92b2" font-size="10">(Uncompensated)</text>

                    <rect x="330" y="110" width="140" height="80" rx="10" class="node" style="stroke: var(--accent-red);" />
                    <text x="400" y="145" class="node-text">AI MODEL</text>
                    <text x="400" y="165" class="node-text">TRAINING</text>

                    <circle cx="650" cy="150" r="50" class="node" style="stroke: var(--accent-gold);" />
                    <text x="650" y="145" class="node-text">TECH MONOPOLIES</text>
                    <text x="650" y="165" class="node-text" fill="#ffd700" font-size="10">(Value Captured)</text>
                </svg>
            `;
        } else if (visualType === 'chart-automation') {
            card.innerHTML = `
                <div style="width: 100%; text-align: left; font-family: var(--font-mono);">
                    <h4 style="color: var(--accent-cyan); margin-bottom: 1rem;">Task Automation Impact Matrix</h4>
                    <div style="margin-bottom: 12px;">
                        <span>Illustration & Concept Art</span>
                        <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 6px; overflow: hidden; margin-top: 4px;">
                            <div style="width: 82%; height: 100%; background: var(--accent-red);"></div>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span>Copywriting & Digital Marketing</span>
                        <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 6px; overflow: hidden; margin-top: 4px;">
                            <div style="width: 74%; height: 100%; background: var(--accent-red);"></div>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span>Music Production & Audio Engineering</span>
                        <div style="background: rgba(255,255,255,0.1); height: 12px; border-radius: 6px; overflow: hidden; margin-top: 4px;">
                            <div style="width: 58%; height: 100%; background: var(--accent-gold);"></div>
                        </div>
                    </div>
                </div>
            `;
        } else if (visualType === 'map-global-labor') {
            card.innerHTML = `
                <div style="text-align: center; font-family: var(--font-mono);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🌍 ➔ 💻</div>
                    <h3 style="color: var(--accent-gold); margin-bottom: 0.5rem;">The Hidden Data Pipeline</h3>
                    <p style="color: var(--text-muted); max-width: 500px; font-size: 0.9rem;">
                        Global South workers (Kenya, Philippines, Venezuela) perform vital RLHF (Reinforcement Learning from Human Feedback), data filtering, and annotation under extreme precarity.
                    </p>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div style="text-align: center; font-family: var(--font-mono);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚖️</div>
                    <h3 style="color: var(--accent-cyan); margin-bottom: 0.5rem;">Restructuring Creative Labor</h3>
                    <p style="color: var(--text-muted); max-width: 500px; font-size: 0.9rem;">
                        Collective bargaining, copyright reform, open-source model governance, and ethical data attribution models as democratic interventions.
                    </p>
                </div>
            `;
        }

        this.visualStage.appendChild(card);
    }

    speakNarration(text) {
        this.synth.cancel(); // Stop ongoing speech
        if (!this.voiceEnabled) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        this.synth.speak(utterance);
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.playBtn.innerText = this.isPlaying ? '⏸' : '▶';

        if (this.isPlaying) {
            this.startTimer();
            this.speakNarration(documentaryData[this.currentActIndex].narration);
            this.playAmbientDrone();
        } else {
            this.stopTimer();
            this.synth.cancel();
        }
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.currentTime++;
            this.updateDisplay();

            // Auto progress acts every 75 seconds
            const calculatedAct = Math.floor(this.currentTime / 75);
            if (calculatedAct !== this.currentActIndex && calculatedAct < 4) {
                this.loadAct(calculatedAct);
            }

            if (this.currentTime % 15 === 0) {
                this.playAmbientDrone();
            }

            if (this.currentTime >= this.totalDuration) {
                this.currentTime = this.totalDuration;
                this.togglePlay();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    updateDisplay() {
        const mins = Math.floor(this.currentTime / 60).toString().padStart(2, '0');
        const secs = (this.currentTime % 60).toString().padStart(2, '0');
        this.timerDisplay.innerText = `${mins}:${secs} / 05:00`;

        const pct = (this.currentTime / this.totalDuration) * 100;
        this.progressBar.style.width = `${pct}%`;
    }

    navigateAct(direction) {
        let newIndex = this.currentActIndex + direction;
        if (newIndex >= 0 && newIndex < documentaryData.length) {
            this.jumpToAct(newIndex);
        }
    }

    jumpToAct(actIdx) {
        this.currentActIndex = actIdx;
        this.currentTime = actIdx * 75;
        this.updateDisplay();
        this.loadAct(actIdx);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.docApp = new DocumentaryEngine();
});
