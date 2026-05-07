// scripts/pages/home.js — Homepage Orchestrator (DevSpace)
// Single Responsibility: Fetches data and coordinates homepage component rendering

import { fetchAllGames } from "../api/data.js";
import { initHeroCarousel } from "../components/hero.js";
import { initBrowseController } from "../components/browse.js";
import { initCartUI } from "../components/cartModal.js"; // <-- CART IMPORTED HERE

const SKELETON_COUNT = 8;

function buildSkeletonCard() {
  const card = document.createElement("div");
  card.className = "skeleton-card";
  card.innerHTML = `
    <div class="skeleton skeleton-thumb"></div>
    <div class="skeleton-body">
      <div class="skeleton skeleton-line wide"></div>
      <div class="skeleton skeleton-line mid"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>
  `;
  return card;
}

function mountSkeletonCards(container) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < SKELETON_COUNT; i++) {
    fragment.appendChild(buildSkeletonCard());
  }
  container.appendChild(fragment);
}

function showErrorState(container) {
  container.innerHTML = `
    <div class="error-state">
      Could not load games — please refresh and try again.
    </div>
  `;
}

function getUniqueGenres(games) {
  return [...new Set(games.map((g) => g.genre))];
}

function getFeaturedGames(games) {
  return games.filter((g) => g.featured === true);
}

async function initHomepage() {
  const skeletonGrid = document.getElementById("skeleton-grid");
  const catalogContainer = document.getElementById("game-catalog");
  const heroSection = document.getElementById("hero-section");

  if (skeletonGrid) mountSkeletonCards(skeletonGrid);

  const games = await fetchAllGames();

  if (!games) {
    showErrorState(catalogContainer);
    return;
  }

  // 1. Initialize Hero Carousel
  initHeroCarousel(heroSection, getFeaturedGames(games));

  // 2. Initialize Sidebar Filters & Search
  initBrowseController(games, getUniqueGenres(games));

  // 3. Initialize Cart Navigation
  initCartUI(); // <-- CART INITIALIZED HERE
}

initHomepage();
