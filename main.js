/* ==========================================================================
   MINI-DOCUMENTARY SCRIPT & CONTROLLER ENGINE (main.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // Documentary Script Data Matrix (Exact 5-minute sync broken into timed frames)
    const scriptMatrix = [
        {
            timeStart: 0,
            duration: 18,
            chapter: "PROLOGUE: THE DIGITAL VALUE ENGINE",
            title: "How Digital Life Produces Value",
            body: "Every click, keystroke, and uploaded creation feeds an invisible economic engine. In modern media economies, <span class='highlight-cyan'>your digital life is constant productive labor</span>—producing raw data, consuming algorithmic feeds, and generating market value.",
            mediaId: "scene-1"
        },
        {
            timeStart: 18,
            duration: 22,
            chapter: "PROLOGUE: RE-DISTRIBUTION OF CAPITAL",
            title: "Value Dislocation in Networked Capitalism",
            body: "While creative human output powers digital media networks, the value generated is systematically extracted. Capital flows away from frontline creators and consolidates directly within <span class='highlight-gold'>centralized platform monopolies</span>.",
            mediaId: "scene-1"
        },
        {
            timeStart: 40,
            duration: 25,
            chapter: "ACT I: RAW MATERIAL EXTRACTION",
            title: "Artists Output as Uncompensated Training Data",
            body: "Generative AI systems (ChatGPT, Gemini, Sora) rely on vast repositories of human art, text, music, and video scraped from the open web—turning decades of professional human artistic output into <span class='highlight-red'>free raw material</span> without explicit consent, transparency, or compensation.",
            mediaId: "scene-2"
        },
        {
            timeStart: 65,
            duration: 25,
            chapter: "ACT I: CORPORATE ENCLOSURE",
            title: "Shifting Value to Platform Owners",
            body: "This extraction dynamic represents a historic enclosure of the creative commons. Tech conglomerates monetize trained foundation models, transforming human creative heritage into proprietary SaaS subscription products.",
            mediaId: "scene-3"
        },
        {
            timeStart: 90,
            duration: 25,
            chapter: "ACT II: DISRUPTION OF CREATIVE LABOR",
            title: "Automating Artisanal Skills",
            body: "AI models now automate complex tasks across writing, graphic design, illustration, music production, and video editing. Traditional skills honed over lifetimes are suddenly re-framed as redundant bottlenecks in automated media assembly lines.",
            mediaId: "scene-5"
        },
        {
            timeStart: 115,
            duration: 25,
            chapter: "ACT II: DEVALUATION & PRECARITY",
            title: "Devaluing Human Professional Power",
            body: "As client budgets shift toward instantaneous AI visual and acoustic generation, creative freelancers face severe downward price pressures, eroding professional autonomy and destabilizing middle-class creative careers.",
            mediaId: "scene-6"
        },
        {
            timeStart: 140,
            duration: 30,
            chapter: "ACT III: THE GLOBAL SOUTH GHOST WORK",
            title: "Hidden Labor Practices in AI Infrastructure",
            body: "Behind the illusion of automated intelligence lies an army of invisible human workers. AI development requires massive human data annotation, image bounding, text RLHF (Reinforcement Learning from Human Feedback), and violent content filtering.",
            mediaId: "scene-7"
        },
        {
            timeStart: 170,
            duration: 30,
            chapter: "ACT III: GEOPOLITICAL INEQUALITIES",
            title: "Subcontracted Micro-Labor",
            body: "These arduous data tasks are routinely outsourced to low-wage workers across Kenya, the Philippines, India, and Venezuela. Operating for pennies per task under intense psychological stress, this <span class='highlight-red'>ghost work</span> underscores deep global inequalities embedded in AI supply chains.",
            mediaId: "scene-8"
        },
        {
            timeStart: 200,
            duration: 35,
            chapter: "ACT IV: CRITICAL RE-EVALUATION",
            title: "Democratization or Monopoly Expansion?",
            body: "Proponents claim AI 'democratizes' art creation by granting non-specialists expressive visual tools. However, critical political economy demonstrates that it simultaneously <span class='highlight-gold'>reinforces structural power hierarchies</span>, shifting control over cultural production to cloud infrastructure oligopolies.",
            mediaId: "scene-4"
        },
        {
            timeStart: 235,
            duration: 35,
            chapter: "ACT V: CONCLUSION & FUTURE OUTLOOK",
            title: "Restructuring Cultural Production",
            body: "Generative AI is not merely a neutral technological iteration; it is a fundamental restructuring of cultural production, intellectual property, and labor valuation. Reclaiming agency requires transparent dataset auditing, collective bargaining, and equitable revenue distribution.",
            mediaId: "scene-9"
        },
        {
            timeStart: 270,
            duration: 30,
            chapter: "EPILOGUE: CULTURAL FUTURE",
            title: "Who Controls the Creative Future?",
            body: "As media industries synthesize human expression into mathematical parameters, the crucial question remains: Will AI empower human artistic flourishment, or will creative human labor be permanently subsumed into corporate algorithmic value extraction?",
            mediaId: "scene-9"
        }
    ];

    const TOTAL_DURATION = 300; // 5 Minutes in seconds

    // DOM Elements
    const narrativeTextEl = document.getElementById("narrative-text");
    const chapterTitleEl = document.getElementById("chapter-title");
    const timeCodeEl = document.getElementById("time-code");
    const progressBarEl = document.getElementById("progress-bar");
    const playBtn = document.getElementById("play-btn");
    const restartBtn = document.getElementById("restart-btn");
    const mediaFrames = document.querySelectorAll(".media-frame");

    // Playback State
    let currentTime = 0;
    let isPlaying = false;
    let timerInterval = null;
    let currentFrameIndex = -1;

    // Web Audio API Soundtrack Synthesizer (Generates Ambient Cyber Soundtrack)
    let audioCtx = null;
    let isAudioInitialized = false;
    let synthOsc1 = null;
    let synthOsc2 = null;

    function initAudioEngine() {
        if (isAudioInitialized) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Drone Synthesizer Oscillator
        synthOsc1 = audioCtx.createOscillator();
        synthOsc2 = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const masterGain = audioCtx.createGain();

        synthOsc1.type = "sawtooth";
        synthOsc2.type = "sine";

        synthOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note
        synthOsc2.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 note

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, audioCtx.currentTime);

        masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

        synthOsc1.connect(filter);
        synthOsc2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(audioCtx.destination);

        synthOsc1.start();
        synthOsc2.start();

        // Subtle LFO modulation for cinematic texture
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(150, audioCtx.currentTime);
        lfo.connect(filter.frequency);
        lfo.start();

        isAudioInitialized = true;
    }

    // Format Seconds to MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Main Update Loop
    function updateTimeline() {
        if (!isPlaying) return;

        currentTime += 0.2;
        if (currentTime >= TOTAL_DURATION) {
            currentTime = TOTAL_DURATION;
            pauseDocumentary();
        }

        // Update HUD
        timeCodeEl.textContent = `${formatTime(currentTime)} / 05:00`;
        const progressPercent = (currentTime / TOTAL_DURATION) * 100;
        progressBarEl.style.width = `${progressPercent}%`;

        // Check Script State
        renderScriptState(currentTime);
    }

    // Render Corresponding Script & Media Visual
    function renderScriptState(time) {
        const matchingIndex = scriptMatrix.findIndex(item => 
            time >= item.timeStart && time < (item.timeStart + item.duration)
        );

        if (matchingIndex !== -1 && matchingIndex !== currentFrameIndex) {
            currentFrameIndex = matchingIndex;
            const state = scriptMatrix[matchingIndex];

            // Update Text Content with Fade Effect
            narrativeTextEl.classList.remove("text-fade-in");
            void narrativeTextEl.offsetWidth; // Trigger reflow
            
            chapterTitleEl.textContent = state.chapter;
            narrativeTextEl.innerHTML = `
                <div class="narrative-title">${state.title}</div>
                <div class="narrative-body">${state.body}</div>
            `;
            narrativeTextEl.classList.add("text-fade-in");

            // Update Visual Media Frame Switcher
            mediaFrames.forEach(frame => frame.classList.remove("active"));
            const targetMedia = document.getElementById(state.mediaId);
            if (targetMedia) {
                targetMedia.classList.add("active");
            }
        }
    }

    // Playback Controls
    function playDocumentary() {
        if (!isAudioInitialized) {
            initAudioEngine();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        isPlaying = true;
        playBtn.textContent = "PAUSE";
        timerInterval = setInterval(updateTimeline, 200);
    }

    function pauseDocumentary() {
        isPlaying = false;
        playBtn.textContent = "PLAY";
        clearInterval(timerInterval);
    }

    function restartDocumentary() {
        pauseDocumentary();
        currentTime = 0;
        currentFrameIndex = -1;
        timeCodeEl.textContent = "00:00 / 05:00";
        progressBarEl.style.width = "0%";
        renderScriptState(0);
    }

    // Event Listeners
    playBtn.addEventListener("click", () => {
        if (isPlaying) {
            pauseDocumentary();
        } else {
            playDocumentary();
        }
    });

    restartBtn.addEventListener("click", restartDocumentary);

    // Initial Load Setup
    renderScriptState(0);
});
