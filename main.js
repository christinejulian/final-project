document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');
  const progressBar = document.getElementById('progressBar');

  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateSlide(index) {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Counter & Progress Bar
    slideCounter.textContent = `${index + 1} / ${totalSlides}`;
    const progressPercent = ((index + 1) / totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Button States
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalSlides - 1;
  }

  // Event Listeners
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlide(currentSlide);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlide(currentSlide);
    }
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide(currentSlide);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlide(currentSlide);
      }
    }
  });

  // Initialize
  updateSlide(currentSlide);
});
