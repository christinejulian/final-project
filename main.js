document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const currentSlideEl = document.getElementById("current-slide");
  const totalSlidesEl = document.getElementById("total-slides");
  const dotsContainer = document.getElementById("dots-container");

  let currentIndex = 0;
  const totalSlides = slides.length;

  totalSlidesEl.textContent = totalSlides;

  // Render navigation dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function updateSlideState() {
    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });

    currentSlideEl.textContent = currentIndex + 1;
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentIndex = index;
      updateSlideState();
    }
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlideState();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlideState();
    }
  }

  // Event Listeners for buttons
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Keyboard Navigation (Arrow Keys and Space)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Space") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    }
  });
});
