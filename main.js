document.addEventListener('DOMContentLoaded', () => {
  const totalScenes = 5;
  const targetTotalSeconds = 300; // 5 minute overall timeline budget
  const sceneDuration = targetTotalSeconds / totalScenes; // 60s per scene budget

  let currentScene = 1;
  let isPlaying = false;
  let timerInterval = null;
  let elapsedSeconds = 0;

  // DOM Elements
  const btnPlay = document.getElementById('btn-play');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnMute = document.getElementById('btn-mute');
  const progressBar = document.getElementById('progress-bar');
  const timeDisplay = document.getElementById('time-display');
  const bgMusic = document.getElementById('bg-music');

  // Web Speech API Narrator Setup
  const synth = window.speechSynthesis;

  // Initialize Scene Display
  function updateScene(sceneIndex) {
    currentScene = sceneIndex;

    // Update Media Elements
    document.querySelectorAll('.scene-media').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.scene) === currentScene);
    });

    // Update Text Elements
    document.querySelectorAll('.scene-text').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.scene) === currentScene);
    });

    // Trigger Narration if Playing
    if (isPlaying) {
      speakCurrentScene();
    }
  }

  // Voice Narration Synthesis
  function speakCurrentScene() {
    synth.cancel(); // Stop current speech

    const activeText = document.querySelector(`.scene-text[data-scene="${currentScene}"] .narration`);
    if (!activeText) return;

    const utterance = new SpeechSynthesisUtterance(activeText.innerText);
    utterance.rate = 0.95; // Steady, calm narrative cadence
    utterance.pitch = 1.0;

    // Optional: pick an English voice if available
    const voices = synth.getVoices();
    const selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (selectedVoice) utterance.voice = selectedVoice;

    synth.speak(utterance);
  }

  // Timer & Progress Management
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (elapsedSeconds < targetTotalSeconds) {
        elapsedSeconds++;
        updateTimelineDisplay();
      } else {
        pauseDocumentary();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function updateTimelineDisplay() {
    const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    timeDisplay.innerText = `${mins}:${secs} / 05:00`;

    const progressPercent = (elapsedSeconds / targetTotalSeconds) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  // Controls Event Listeners
  function playDocumentary() {
    isPlaying = true;
    btnPlay.innerText = '⏸ Pause';
    bgMusic.volume = 0.3; // Low ambient background sound
    bgMusic.play().catch(() => console.log('Audio autoplay prevented'));
    speakCurrentScene();
    startTimer();
  }

  function pauseDocumentary() {
    isPlaying = false;
    btnPlay.innerText = '▶ Play Documentary';
    synth.cancel();
    bgMusic.pause();
    pauseTimer();
  }

  btnPlay.addEventListener('click', () => {
    if (isPlaying) {
      pauseDocumentary();
    } else {
      playDocumentary();
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentScene < totalScenes) {
      updateScene(currentScene + 1);
      elapsedSeconds = (currentScene - 1) * sceneDuration;
      updateTimelineDisplay();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentScene > 1) {
      updateScene(currentScene - 1);
      elapsedSeconds = (currentScene - 1) * sceneDuration;
      updateTimelineDisplay();
    }
  });

  btnMute.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    btnMute.innerText = bgMusic.muted ? '🔇 Muted' : '🔊 Music';
  });
});
