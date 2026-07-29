/**
 * Mini-Documentary Interactive Script Engine
 * Topic: Generative AI, Digital Life, and the Restructuring of Creative Labor
 */

const documentaryData = [
  {
    id: 1,
    timeSec: 0,
    durationSec: 45,
    chapter: "Chapter 1: The Extractive Engine",
    title: "How Digital Life Produces & Redistributes Value",
    narration: "Every click, upload, artwork, and sentence posted online contributes to a massive digital reservoir. Our daily digital life produces immense creative and informational value. However, Generative AI models transform this collective human output into raw material for proprietary training datasets—without explicit consent, compensation, or transparency.",
    bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    summary: "Explores how creative works are scraped without consent or compensation."
  },
  {
    id: 2,
    timeSec: 45,
    durationSec: 60,
    chapter: "Chapter 2: Capital & Concentration",
    title: "Shift from Human Creators to Tech Giants",
    narration: "This economic dynamic shifts value away from independent writers, artists, and media workers, transferring financial and cultural capital directly to platform monopolies—corporations owning models like ChatGPT, Gemini, and Sora AI. Human artistic labor is commodified into algorithmic inputs, privatizing profits while socializing creative risk.",
    bgImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    summary: "Analyzes profit concentration among major AI developers like OpenAI, Google, and Meta."
  },
  {
    id: 3,
    timeSec: 105,
    durationSec: 60,
    chapter: "Chapter 3: Disruption of Creative Skills",
    title: "Automation Across Writing, Design, and Video",
    narration: "Generative tools now automate key tasks across graphic design, illustration, copy editing, music composition, and post-production. By replicating styles and synthesis patterns, these systems devalue traditional apprenticeship, craft, and expertise, pressuring media professionals to accept lower wages or faster production turnarounds.",
    bgImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    summary: "Examines task automation in creative disciplines and wage devaluation."
  },
  {
    id: 4,
    timeSec: 165,
    durationSec: 75,
    chapter: "Chapter 4: The Hidden Supply Chain",
    title: "Data Annotation & Global South Exploitation",
    narration: "Behind seamless AI generation lies an invisible hierarchy of labor. Machine learning relies heavily on data annotators, RLHF reviewers, and content moderators. Often outsourced to low-wage labor markets in the Global South under grueling conditions, these hidden workers perform crucial labor while remaining excluded from the immense wealth AI creates.",
    bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    summary: "Uncovers data labeling and content moderation outsourced to the Global South."
  },
  {
    id: 5,
    timeSec: 240,
    durationSec: 60,
    chapter: "Chapter 5: Conclusion & Future Outlook",
    title: "Democratization or Cultural Enclosure?",
    narration: "Does Generative AI democratize artistic expression, or does it reinforce existing digital media monopolies? Evaluating AI requires looking beyond technological novelty. It demands addressing the structural restructuring of creative labor, establishing ethical ownership, and demanding fair compensation for human cultural production.",
    bgImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    summary: "Summarizes the ethical trade-offs between democratization and labor exploitation."
  }
];

const TOTAL_DURATION_SEC = 300; // 5 minutes total runtime

// State Variables
let currentSlideIndex = 0;
let isPlaying = false;
let currentTimeSec = 0;
let playbackTimer = null;
let speechEnabled = true;

// DOM Elements
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById("progressBar");
const progressBarContainer = document.getElementById("progressBarContainer");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const chapterTag = document.getElementById("chapterTag");
const slideTitle = document.getElementById("slideTitle");
const narrationText = document.getElementById("narrationText");
const mediaBg = document.getElementById("mediaBg");
const chapterGrid = document.getElementById("chapterGrid");
const narrationToggle = document.getElementById("narrationToggle");
const voiceStatus = document.getElementById("voiceStatus");

// Web Speech API Synthesis
const synth = window.speechSynthesis;

// Initialize Player
function init() {
  renderChapters();
  loadSlide(0);
  
  playPauseBtn.addEventListener("click", togglePlay);
  progressBarContainer.addEventListener("click", seekTimeline);
  narrationToggle.addEventListener("click", toggleVoice);
  
  totalTimeEl.textContent = formatTime(TOTAL_DURATION_SEC);
}

// Render Chapter Cards in Directory
function renderChapters() {
  chapterGrid.innerHTML = "";
  documentaryData.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = `chapter-card ${index === 0 ? "active" : ""}`;
    card.id = `chapter-card-${index}`;
    card.onclick = () => jumpToChapter(index);
    
    card.innerHTML = `
      <span class="time-stamp">${formatTime(item.timeSec)}</span>
      <h4>${item.chapter}</h4>
      <p>${item.summary}</p>
    `;
    chapterGrid.appendChild(card);
  });
}

// Load Slide Visuals & Text
function loadSlide(index) {
  currentSlideIndex = index;
  const slide = documentaryData[index];

  chapterTag.textContent = slide.chapter;
  slideTitle.textContent = slide.title;
  narrationText.textContent = slide.narration;

  // Background Media Transition
  mediaBg.style.backgroundImage = `url('${slide.bgImage}')`;
  mediaBg.classList.remove("kenburns");
  void mediaBg.offsetWidth; // Force reflow
  mediaBg.classList.add("kenburns");

  // Highlight Active Chapter in Grid
  document.querySelectorAll(".chapter-card").forEach((card, idx) => {
    if (idx === index) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  if (isPlaying && speechEnabled) {
    speakNarration(slide.narration);
  }
}

// Playback Logic
function togglePlay() {
  if (isPlaying) {
    pauseDocumentary();
  } else {
    playDocumentary();
  }
}

function playDocumentary() {
  isPlaying = true;
  playIcon.textContent = "⏸ Pause Documentary";

  playbackTimer = setInterval(() => {
    currentTimeSec++;
    updateProgress();

    // Check if time crosses into next slide
    const nextSlideIndex = documentaryData.findIndex((item, idx) => {
      const nextItem = documentaryData[idx + 1];
      if (nextItem) {
        return currentTimeSec >= item.timeSec && currentTimeSec < nextItem.timeSec;
      }
      return currentTimeSec >= item.timeSec;
    });

    if (nextSlideIndex !== -1 && nextSlideIndex !== currentSlideIndex) {
      loadSlide(nextSlideIndex);
    }

    if (currentTimeSec >= TOTAL_DURATION_SEC) {
      pauseDocumentary();
      currentTimeSec = 0;
      loadSlide(0);
    }
  }, 1000);

  if (speechEnabled) {
    speakNarration(documentaryData[currentSlideIndex].narration);
  }
}

function pauseDocumentary() {
  isPlaying = false;
  playIcon.textContent = "▶ Play Documentary";
  clearInterval(playbackTimer);
  if (synth) synth.cancel();
}

function updateProgress() {
  const percentage = (currentTimeSec / TOTAL_DURATION_SEC) * 100;
  progressBar.style.width = `${percentage}%`;
  currentTimeEl.textContent = formatTime(currentTimeSec);
}

function seekTimeline(e) {
  const rect = progressBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percentage = clickX / width;

  currentTimeSec = Math.floor(percentage * TOTAL_DURATION_SEC);
  updateProgress();

  // Find corresponding slide
  for (let i = documentaryData.length - 1; i >= 0; i--) {
    if (currentTimeSec >= documentaryData[i].timeSec) {
      loadSlide(i);
      break;
    }
  }
}

function jumpToChapter(index) {
  currentTimeSec = documentaryData[index].timeSec;
  updateProgress();
  loadSlide(index);
  if (!isPlaying) {
    playDocumentary();
  }
}

// Voiceover Narration (Browser Speech Synthesis)
function speakNarration(text) {
  if (!('speechSynthesis' in window)) return;
  synth.cancel(); // Stop ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Steady documentary pacing
  utterance.pitch = 1.0;

  // Select smooth voice if available
  const voices = synth.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google"))) || voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;

  synth.speak(utterance);
}

function toggleVoice() {
  speechEnabled = !speechEnabled;
  voiceStatus.textContent = speechEnabled ? "ON" : "OFF";
  if (!speechEnabled && synth) {
    synth.cancel();
  } else if (isPlaying) {
    speakNarration(documentaryData[currentSlideIndex].narration);
  }
}

// Utility: Format seconds into MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", init);
