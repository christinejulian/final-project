// Mini-Documentary Interactive Controller (5-Minute Runtime = 300 Seconds)

const TOTAL_DURATION = 300; // 300 seconds (5 minutes)

// Documentary Chapter Script & Media Data
const documentaryData = [
    {
        title: "The Raw Material: Extraction Without Consent",
        chapterTag: "CHAPTER 1 • 0:00 - 1:00",
        body: "Generative AI systems (ChatGPT, Gemini, Sora) rely on massive scraped datasets of human art, writing, and video. Artists' creative outputs are transformed into raw training material without explicit consent, financial compensation, or transparency, fundamentally altering creative ownership.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        startTime: 0
    },
    {
        title: "Automating Human Skill & Devaluation",
        chapterTag: "CHAPTER 2 • 1:00 - 2:00",
        body: "As AI tools automate tasks across design, illustration, music production, and video editing, traditional creative skills face devaluation. Economic value is shifted away from independent human creators and concentrated into platform monopolies.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        startTime: 60
    },
    {
        title: "The Hidden Ghost Work of the Global South",
        chapterTag: "CHAPTER 3 • 2:00 - 3:00",
        body: "Behind seamless AI lies invisible human labor: data labelers, annotators, and content moderators. Often outsourced to low-wage workers in the Global South under precarious conditions, this hidden labor exposes deep global inequalities in AI development.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        startTime: 120
    },
    {
        title: "Redistributing Digital Value",
        chapterTag: "CHAPTER 4 • 3:00 - 4:00",
        body: "Digital media consumption is being restructured. While users consume AI-generated media rapidly, cultural and financial value is extracted from human labor and funneled upward to technology platforms that control the infrastructure.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        startTime: 180
    },
    {
        title: "Democratization or Reinforced Hierarchy?",
        chapterTag: "CHAPTER 5 • 4:00 - 5:00",
        body: "Generative AI offers new tools for expression, but it threatens to entrench digital media hierarchies. The future of creative labor depends on establishing ethical boundaries, fair compensation, and creator sovereignty.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        startTime: 240
    }
];

// DOM Elements
let currentTimeSec = 0;
let isPlaying = false;
let timerInterval = null;

const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const chapterTagEl = document.getElementById('chapter-tag');
const captionTitleEl = document.getElementById('caption-title');
const captionBodyEl = document.getElementById('caption-body');
const docImageEl = document.getElementById('doc-image');
const chapterBtns = document.querySelectorAll('.chapter-btn');
const timelineContainer = document.querySelector('.timeline-container');

// Initialize
function init() {
    updateView(0);
    setupEventListeners();
}

// Play/Pause Controller
function togglePlay() {
    if (isPlaying) {
        pauseDoc();
    } else {
        playDoc();
    }
}

function playDoc() {
    isPlaying = true;
    playPauseBtn.textContent = '⏸ Pause';
    timerInterval = setInterval(() => {
        if (currentTimeSec < TOTAL_DURATION) {
            currentTimeSec++;
            updateProgress();
            checkChapterUpdate();
        } else {
            pauseDoc();
        }
    }, 1000);
}

function pauseDoc() {
    isPlaying = false;
    playPauseBtn.textContent = '▶ Play';
    clearInterval(timerInterval);
}

// Format seconds into MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update Timeline Progress
function updateProgress() {
    const percentage = (currentTimeSec / TOTAL_DURATION) * 100;
    progressBar.style.width = `${percentage}%`;
    currentTimeEl.textContent = formatTime(currentTimeSec);
}

// Check which chapter corresponds to current time
function checkChapterUpdate() {
    const currentChapterIndex = documentaryData.findIndex((ch, i) => {
        const nextTime = documentaryData[i + 1] ? documentaryData[i + 1].startTime : TOTAL_DURATION;
        return currentTimeSec >= ch.startTime && currentTimeSec < nextTime;
    });

    if (currentChapterIndex !== -1) {
        updateChapterUI(currentChapterIndex);
    }
}

// Update Slide/Chapter Content UI
function updateView(chapterIndex) {
    const data = documentaryData[chapterIndex];
    chapterTagEl.textContent = data.chapterTag;
    captionTitleEl.textContent = data.title;
    captionBodyEl.textContent = data.body;

    // Crossfade Image Animation
    docImageEl.classList.remove('active');
    setTimeout(() => {
        docImageEl.src = data.image;
        docImageEl.classList.add('active');
    }, 200);

    // Update active state in sidebar
    chapterBtns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === chapterIndex);
    });
}

function updateChapterUI(index) {
    const currentActive = document.querySelector('.chapter-btn.active');
    if (!currentActive || parseInt(currentActive.dataset.index) !== index) {
        updateView(index);
    }
}

// Jump to specific time
function jumpToTime(seconds) {
    currentTimeSec = seconds;
    updateProgress();
    checkChapterUpdate();
}

// Event Listeners
function setupEventListeners() {
    playPauseBtn.addEventListener('click', togglePlay);

    // Sidebar chapter button clicks
    chapterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            jumpToTime(documentaryData[index].startTime);
        });
    });

    // Scrubbing on progress bar
    timelineContainer.addEventListener('click', (e) => {
        const rect = timelineContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickRatio = clickX / width;
        jumpToTime(Math.floor(clickRatio * TOTAL_DURATION));
    });

    // Keyboard Shortcuts (Space = Play/Pause)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
    });
}

// Start
init();
