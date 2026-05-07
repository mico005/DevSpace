// scripts/components/libraryGrid.js — Library Grid Builder (DevSpace)
// Single Responsibility: Builds library card elements with download and remove integration

import { getGenreColor, getCardInitials } from "../utils/helpers.js";

const CARD_ANIMATION_STEP_MS = 40;

// ... existing imports ...

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

// ... rest of the file ...

function triggerDownloadSim(btn, event) {
  event.stopPropagation();
  const originalText = btn.innerHTML;

  btn.innerHTML = `<i class="bi bi-check2"></i> Downloading...`;
  btn.disabled = true;
  btn.classList.add("active-download");

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.classList.remove("active-download");
  }, 2000);
}

function triggerRemove(event, game, onRemoveCallback) {
  event.stopPropagation();
  const confirmed = window.confirm(
    `Are you sure you want to remove ${game.title} from your library?`,
  );
  if (confirmed) onRemoveCallback(game.id);
}

function handleCardInteraction(event, game, onRemoveCallback) {
  const downloadBtn = event.target.closest(".download-btn");
  const removeBtn = event.target.closest(".remove-btn");

  if (downloadBtn) return triggerDownloadSim(downloadBtn, event);
  if (removeBtn) return triggerRemove(event, game, onRemoveCallback);

  window.location.href = `game.html?id=${game.id}`;
}

function buildLibraryCard(game, delay, onRemoveCallback) {
  const card = document.createElement("div");
  card.className = "game-card library-card";
  card.style.animationDelay = `${delay}ms`;

  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-thumb-bg">${buildThumbnailHtml(game)}</div>
      <div class="card-thumb-overlay"><span>View Game</span></div>
      <div class="card-genre-badge">${game.genre}</div>
    </div>
    <div class="card-body">
      <div class="card-title">${game.title}</div>
      <div class="card-developer">${game.developer}</div>
      <div class="library-card-actions">
        <button class="download-btn" aria-label="Download ${game.title}">
          <i class="bi bi-download"></i> Download
        </button>
        <button class="remove-btn" aria-label="Remove ${game.title}">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    </div>
  `;

  card.addEventListener("click", (e) =>
    handleCardInteraction(e, game, onRemoveCallback),
  );

  return card;
}

function buildLibraryGrid(container, games, onRemoveCallback) {
  const gridEl = document.createElement("div");
  gridEl.className = "game-grid";

  const fragment = document.createDocumentFragment();
  games.forEach((game, index) => {
    fragment.appendChild(
      buildLibraryCard(game, index * CARD_ANIMATION_STEP_MS, onRemoveCallback),
    );
  });

  gridEl.appendChild(fragment);
  container.appendChild(gridEl);
}

export { buildLibraryGrid };
