// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Media Asset Pipeline (Curated stock visuals representing the political economy of AI)
    const mediaSequence = [
        {
            timeStart: 0,
            timeEnd: 45,
            chapter: "CHAPTER I // THE EXTRACTION ENGINE",
            type: "image",
            url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
            title: "WHO PRODUCES THE VALUE?",
            subtitle: "Generative AI and the Exploitation of Creative Work",
            quote: null,
            subtitles: "In every second of our connected digital lives, we produce vast oceans of images, prose, code, and audio. But under platform capitalism, this human expression is treated as raw, unowned material ripe for corporate enclosure."
        },
        {
            timeStart: 45,
            timeEnd: 90,
            chapter: "CHAPTER II // DATA ENCLOSURE & UNCOMPENSATED CRAFT",
            type: "image",
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
            title: "THE ENCLOSURE OF COMMONS",
            subtitle: "Unpaid Training Material for Multimodal Models",
            quote: {
                text: "LMMs like ChatGPT, Gemini, and Sora require petabytes of human creativity—harvested without explicit consent, compensation, or clear attribution.",
                source: "Digital Media Political Economy"
            },
            subtitles: "Companies like OpenAI, Google, and Midjourney convert the cumulative heritage of human culture into private algorithmic weights. Creators become non-consensual suppliers to systems built to replace them."
        },
        {
            timeStart: 90,
            timeEnd: 150,
            chapter: "CHAPTER III // AUTOMATION & DESKILLING",
            type: "image",
            url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
            title: "DISPARAGING REAL CRAFT",
            subtitle: "Devaluation of Graphic Design, Writing, and Illustration",
            quote: null,
            subtitles: "As AI tools automate tasks in writing, illustration, voice acting, and video editing, traditional artistic skills are disparaged as 'inefficient'. Creative agency shifts from skilled artisans to prompt engineers and platform operators."
        },
        {
            timeStart: 150,
            timeEnd: 225,
            chapter: "CHAPTER IV // SHADOW PROLETARIAT OF THE GLOBAL SOUTH",
            type: "image",
            url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
            title: "GLOBAL INEQUALITIES",
            subtitle: "Outsourced Data Annotation and Content Moderation",
            quote: {
                text: "Sanitizing algorithms requires traumatizing human labor—outsourced to low-wage workers in Kenya, the Philippines, and Venezuela for a fraction of Western wages.",
                source: "Labor Studies in Digital Economy"
            },
            subtitles: "Behind the illusion of 'clean artificial intelligence' lies a vast, exploited workforce in the Global South doing the dirty work: RLHF, data labeling, bounding box annotation, and filtering toxic content."
        },
        {
            timeStart: 225,
            timeEnd: 300,
            chapter: "CHAPTER V // RESTRUCTURING CULTURAL POWER",
            type: "image",
            url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
            title: "RECLAIMING CREATIVE FUTURES",
            subtitle: "Solidarity, Collective Ownership, and Ethical AI",
            quote: null,
            subtitles: "Generative AI is not merely a technological evolution; it is a fundamental restructuring of cultural production. Will AI remain an engine of corporate enclosure, or can artists organize to reclaim ownership over technology?"
        }
    ];

    // State Variables
    let currentTime = 0;
    let duration = 300; // 5 minutes (300 seconds)
    let isPlaying = false;
    let timerInterval = null;
    let currentSegmentIndex = -1;

    // DOM Elements
    const playBtn = document.getElementById('playBtn');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const bgMusic = document.getElementById('bgMusic');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTimeDisplay = document.getElementById('currentTime');
    const activeImage = document.getElementById('activeImage');
    const chapterBadge = document.getElementById('chapterBadge');
    const titleCard = document.getElementById('titleCard');
    const headlineText = document.getElementById('headlineText');
    const subtextText = document.getElementById('subtextText');
    const quoteCard = document.getElementById('quoteCard');
    const quoteText = document.getElementById('quoteText');
    const quoteSource = document.getElementById('quoteSource');
    const subtitleText = document.getElementById('subtitleText');

    // Initialize Video State
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateState() {
        // Update Time Display
        currentTimeDisplay.innerText = formatTime(currentTime);
        progressBar.style.width = `${(currentTime / duration) * 100}%`;

        // Find active sequence
        const index = mediaSequence.findIndex(item => currentTime >= item.timeStart && currentTime < item.timeEnd);

        if (index !== -1 && index !== currentSegmentIndex) {
            currentSegmentIndex = index;
            const segment = mediaSequence[index];

            // Update Chapter Badge
            chapterBadge.innerText = segment.chapter;

            // Transition Image Visual
            activeImage.classList.remove('active');
            setTimeout(() => {
                activeImage.src = segment.url;
                activeImage.classList.add('active');
            }, 300);

            // Update Subtitles
            subtitleText.innerText = segment.subtitles;

            // Handle Title Overlay / Quote Displays
            if (segment.title) {
                headlineText.innerText = segment.title;
                subtextText.innerText = segment.subtitle;
                titleCard.classList.add('visible');
            } else {
                titleCard.classList.remove('visible');
            }

            if (segment.quote) {
                quoteText.innerText = `"${segment.quote.text}"`;
                quoteSource.innerText = `— ${segment.quote.source}`;
                quoteCard.classList.add('visible');
            } else {
                quoteCard.classList.remove('visible');
            }
        }

        // Loop / End Handler
        if (currentTime >= duration) {
            pauseDoc();
            currentTime = 0;
        }
    }

    function playDoc() {
        isPlaying = true;
        playBtn.innerText = "PAUSE";
        bgMusic.play().catch(() => console.log("Audio autoplay restricted. User interaction required."));
        timerInterval = setInterval(() => {
            currentTime++;
            updateState();
        }, 1000);
    }

    function pauseDoc() {
        isPlaying = false;
        playBtn.innerText = "PLAY";
        bgMusic.pause();
        clearInterval(timerInterval);
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseDoc();
        } else {
            playDoc();
        }
    });

    muteBtn.addEventListener('click', () => {
        if (bgMusic.muted) {
            bgMusic.muted = false;
            muteBtn.innerText = "MUSIC ON";
        } else {
            bgMusic.muted = true;
            muteBtn.innerText = "MUTED";
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        currentTime = Math.floor((clickX / width) * duration);
        updateState();
    });

    fullscreenBtn.addEventListener('click', () => {
        const doc = document.getElementById('docContainer');
        if (!document.fullscreenElement) {
            doc.requestFullscreen().catch(err => alert(`Fullscreen error: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    });

    // Initial Trigger
    updateState();
});
