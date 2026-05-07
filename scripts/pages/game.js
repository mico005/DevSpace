// scripts/pages/game.js — Game Detail Page Orchestrator (DevSpace)
// Single Responsibility: Fetches game by ID and coordinates detail page rendering

import { fetchGameById } from "../api/data.js";
import { buildDetailPageHtml, buildMainMediaHtml } from "./gameTemplates.js"; // <-- Import the new helper
import { openCheckoutModal } from "../components/checkoutLogic.js";
import { initCartUI } from "../components/cartModal.js";
import { addGameToCart } from "../utils/cartState.js";

function getGameIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function showNotFound(container) {
  container.innerHTML = `
    <div class="page-loading">
      <div style="font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: var(--muted);">GAME NOT FOUND</div>
      <a href="index.html" style="color: var(--accent); font-size: 0.85rem;">← Back to Games</a>
    </div>
  `;
}

function attachPurchaseEvents(game) {
  const buyBtn = document.getElementById("buy-button");
  const cartBtn = document.getElementById("add-cart-button");

  buyBtn?.addEventListener("click", () => openCheckoutModal([game]));

  cartBtn?.addEventListener("click", () => {
    addGameToCart(game);

    const originalText = cartBtn.textContent;
    cartBtn.textContent = "ADDED ✓";
    cartBtn.style.borderColor = "var(--accent)";
    cartBtn.style.color = "var(--accent)";

    setTimeout(() => {
      cartBtn.textContent = originalText;
      cartBtn.style.borderColor = "";
      cartBtn.style.color = "";
    }, 1500);
  });
}

function attachGalleryCarouselEvents() {
  const track = document.getElementById("gallery-thumb-track");
  const mediaContainer = document.getElementById("gallery-media-container");
  const prevBtn = document.getElementById("gallery-prev-btn");
  const nextBtn = document.getElementById("gallery-next-btn");

  if (!track || !mediaContainer) return;

  const thumbs = Array.from(track.querySelectorAll(".gallery-track-thumb"));

  // Centralized function to handle state changes
  function updateMainView(thumbBtn) {
    // Update active state
    thumbs.forEach((btn) => btn.classList.remove("active"));
    thumbBtn.classList.add("active");

    // Swap media
    const type = thumbBtn.dataset.type;
    const src = thumbBtn.dataset.src;
    mediaContainer.innerHTML = buildMainMediaHtml(type, src);

    // Ensure the active thumbnail stays visible in the scrollable track
    thumbBtn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  // Handle direct thumbnail clicks
  track.addEventListener("click", (e) => {
    const thumbBtn = e.target.closest(".gallery-track-thumb");
    if (thumbBtn) updateMainView(thumbBtn);
  });

  // Handle Arrow Controls
  function navigateGallery(direction) {
    const activeIndex = thumbs.findIndex((btn) =>
      btn.classList.contains("active"),
    );
    if (activeIndex === -1) return;

    let newIndex = activeIndex + direction;
    // Loop around if out of bounds
    if (newIndex < 0) newIndex = thumbs.length - 1;
    if (newIndex >= thumbs.length) newIndex = 0;

    updateMainView(thumbs[newIndex]);
  }

  prevBtn?.addEventListener("click", () => navigateGallery(-1));
  nextBtn?.addEventListener("click", () => navigateGallery(1));
}
async function initGameDetailPage() {
  const container = document.getElementById("game-page");
  const gameId = getGameIdFromUrl();

  if (!gameId) return showNotFound(container);

  const game = await fetchGameById(gameId);

  if (!game) return showNotFound(container);

  document.title = `DevSpace — ${game.title}`;
  container.innerHTML = buildDetailPageHtml(game);

  attachPurchaseEvents(game);
  attachGalleryCarouselEvents(); // <-- Boot the carousel logic
  initCartUI();
}

initGameDetailPage();
