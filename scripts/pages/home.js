// scripts/pages/home.js — Homepage Orchestrator (DevSpace)
// Single Responsibility: Fetches data and coordinates homepage component rendering

import { fetchAllGames }  from "../api/data.js";
import { buildHeroSection } from "../components/hero.js";
import { buildGameGrid }  from "../components/grid.js";
import { buildFilterBar } from "../components/filters.js";

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

function updateGameCount(count) {
  const countEl = document.getElementById("game-count");
  if (countEl) countEl.textContent = `${count} games`;
}

function getUniqueGenres(games) {
  return [...new Set(games.map((g) => g.genre))];
}

function getFeaturedGames(games) {
  return games.filter((g) => g.featured).slice(0, 3);
}

async function initHomepage() {
  const skeletonGrid    = document.getElementById("skeleton-grid");
  const catalogContainer = document.getElementById("game-catalog");
  const heroSection     = document.getElementById("hero-section");
  const filterBar       = document.getElementById("filter-bar");

  mountSkeletonCards(skeletonGrid);

  const games = await fetchAllGames();

  if (!games) {
    showErrorState(catalogContainer);
    return;
  }

  buildHeroSection(heroSection, getFeaturedGames(games));

  catalogContainer.innerHTML = "";
  buildGameGrid(catalogContainer, games);
  buildFilterBar(filterBar, games, catalogContainer, getUniqueGenres(games));
  updateGameCount(games.length);
}

initHomepage();
