// scripts/components/grid.js — Game Grid Builder (DevSpace)
// Single Responsibility: Builds game card elements and mounts the catalog grid

import { getGenreColor, getCardInitials } from "../utils/helpers.js";

const CARD_ANIMATION_STEP_MS = 40;

function buildThumbnailHtml(game) {
  if (game.thumbnail) {
    return `<img src="${game.thumbnail}" alt="${game.title} cover" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`;
  }

  // Fallback if no thumbnail is provided in JSON
  const color = getGenreColor(game.genre);
  const letters = getCardInitials(game.title);

  return `
    <div style="
      width: 100%; height: 100%;
      background: linear-gradient(135deg, ${color}22 0%, #16161f 60%, ${color}11 100%);
      display: flex; align-items: center; justify-content: center;
    ">
      <span style="
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3.5rem;
        color: ${color}55;
        letter-spacing: 0.05em;
      ">${letters}</span>
    </div>
  `;
}

function buildGameCard(game, delay) {
  const card = document.createElement("a");
  card.className = "game-card";
  card.href      = `game.html?id=${game.id}`;
  card.style.animationDelay = `${delay}ms`;
  card.setAttribute("aria-label", `${game.title} by ${game.developer} — ${game.price}`);

  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-thumb-bg">${buildThumbnailHtml(game)}</div>
      <div class="card-thumb-overlay"><span>View Game</span></div>
      <div class="card-genre-badge">${game.genre}</div>
    </div>
    <div class="card-body">
      <div class="card-title">${game.title}</div>
      <div class="card-developer">${game.developer}</div>
      <div class="card-footer">
        <span class="card-price">${game.price}</span>
        <span class="card-rating">${game.rating}</span>
        <span class="card-arrow">↗</span>
      </div>
    </div>
  `;

  return card;
}

function buildGameGrid(container, games) {
  const gridEl  = document.createElement("div");
  gridEl.className = "game-grid";
  gridEl.id     = "main-game-grid";

  const fragment = document.createDocumentFragment();
  games.forEach((game, index) => {
    fragment.appendChild(buildGameCard(game, index * CARD_ANIMATION_STEP_MS));
  });

  gridEl.appendChild(fragment);
  container.appendChild(gridEl);
}

export { buildGameGrid };
