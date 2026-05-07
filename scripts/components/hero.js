// scripts/components/hero.js — Hero Carousel Builder (DevSpace)
// Single Responsibility: Renders and manages the interactive hero carousel

const HERO_BG_CLASSES = ["hero-bg-1", "hero-bg-2", "hero-bg-3"];
const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

function buildDiscoverButton(game) {
  return `<a href="game.html?id=${game.id}" class="hero-discover-btn">Discover →</a>`;
}

function buildHeroSlideHtml(game, index) {
  const bgClass = HERO_BG_CLASSES[index % HERO_BG_CLASSES.length];

  return `
    <div class="carousel-slide" data-index="${index}">
      <div class="hero-bg ${bgClass}">
        <div class="hero-grid-lines"></div>
      </div>
      <div class="hero-content">
        <span class="hero-tag">${game.genre}</span>
        <div class="hero-title">${game.title}</div>
        <div class="hero-meta">
          <span>${game.developer}</span>
          <span class="hero-price">${game.price}</span>
        </div>
        ${buildDiscoverButton(game)}
      </div>
    </div>
  `;
}

function buildCarouselControlsHtml(count) {
  const dotsHtml = Array.from(
    { length: count },
    (_, i) =>
      `<button class="carousel-dot ${i === 0 ? "active" : ""}" data-target="${i}" aria-label="Go to slide ${i + 1}"></button>`,
  ).join("");

  return `
    <button class="carousel-btn prev-btn" aria-label="Previous featured game">❮</button>
    <button class="carousel-btn next-btn" aria-label="Next featured game">❯</button>
    <div class="carousel-indicators">${dotsHtml}</div>
  `;
}

function initHeroCarousel(container, featuredGames) {
  if (!featuredGames || featuredGames.length === 0) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  let touchStartX = 0;

  const slidesHtml = featuredGames.map(buildHeroSlideHtml).join("");
  container.innerHTML = `
    <div class="carousel-track" id="hero-track">${slidesHtml}</div>
    ${buildCarouselControlsHtml(featuredGames.length)}
  `;

  const track = document.getElementById("hero-track");
  const dots = container.querySelectorAll(".carousel-dot");
  const prevBtn = container.querySelector(".prev-btn");
  const nextBtn = container.querySelector(".next-btn");

  function updateCarouselView() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex),
    );
  }

  function goNextSlide() {
    currentIndex = (currentIndex + 1) % featuredGames.length;
    updateCarouselView();
  }

  function goPrevSlide() {
    currentIndex =
      (currentIndex - 1 + featuredGames.length) % featuredGames.length;
    updateCarouselView();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarouselView();
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(goNextSlide, AUTO_ADVANCE_MS);
  }

  function resetAndGo(action) {
    action();
    startAutoplay();
  }

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
    stopAutoplay();
  }

  function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > SWIPE_THRESHOLD_PX) {
      resetAndGo(goNextSlide);
      return;
    }

    if (swipeDistance < -SWIPE_THRESHOLD_PX) {
      resetAndGo(goPrevSlide);
      return;
    }

    startAutoplay();
  }

  nextBtn?.addEventListener("click", () => resetAndGo(goNextSlide));
  prevBtn?.addEventListener("click", () => resetAndGo(goPrevSlide));

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const targetIndex = parseInt(e.target.dataset.target, 10);
      resetAndGo(() => goToSlide(targetIndex));
    });
  });

  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);

  // Attach touch events for mobile swiping
  track.addEventListener("touchstart", handleTouchStart, { passive: true });
  track.addEventListener("touchend", handleTouchEnd, { passive: true });

  startAutoplay();
}

export { initHeroCarousel };
