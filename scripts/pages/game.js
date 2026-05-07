// scripts/pages/game.js — Game Detail Page Orchestrator (DevSpace)
// Single Responsibility: Fetches game by ID and coordinates detail page rendering

import { fetchGameById }      from "../api/data.js";
import { buildDetailPageHtml } from "./gameTemplates.js";
import { openCheckoutModal }  from "../components/checkoutLogic.js";

function getGameIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function showNotFound(container) {
  container.innerHTML = `
    <div class="page-loading">
      <div style="
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3rem;
        color: var(--muted);
      ">GAME NOT FOUND</div>
      <a href="index.html" style="color: var(--accent); font-size: 0.85rem;">
        ← Back to Games
      </a>
    </div>
  `;
}

function attachBuyButton(game) {
  const buyBtn = document.getElementById("buy-button");
  if (!buyBtn) return;
  buyBtn.addEventListener("click", () => openCheckoutModal(game));
}

async function initGameDetailPage() {
  const container = document.getElementById("game-page");
  const gameId    = getGameIdFromUrl();

  if (!gameId) {
    showNotFound(container);
    return;
  }

  const game = await fetchGameById(gameId);

  if (!game) {
    showNotFound(container);
    return;
  }

  document.title      = `DevSpace — ${game.title}`;
  container.innerHTML = buildDetailPageHtml(game);
  attachBuyButton(game);
}

initGameDetailPage();
