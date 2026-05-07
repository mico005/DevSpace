// scripts/pages/library.js — Library Page Orchestrator (DevSpace)
// Single Responsibility: Fetches session data, mounts grid, and orchestrates UI updates

import { getLibrary, removeGameFromLibrary } from "../utils/libraryState.js";
import { buildLibraryGrid } from "../components/libraryGrid.js";
import { initCartUI } from "../components/cartModal.js";

function showEmptyState(container) {
  container.innerHTML = `
    <div class="empty-state-large">
      <i class="bi bi-controller"></i>
      <div class="empty-state-title">Your Library is Empty</div>
      <p class="empty-state-desc">Games you purchase will appear here for download.</p>
      <a href="index.html" class="empty-state-btn">BROWSE STORE</a>
    </div>
  `;
}

function handleRemoveAction(gameId) {
  removeGameFromLibrary(gameId);
  renderLibraryView();
}

function renderLibraryView() {
  const container = document.getElementById("library-container");
  if (!container) return;

  container.innerHTML = "";
  const libraryGames = getLibrary();

  if (libraryGames.length === 0) {
    showEmptyState(container);
  } else {
    buildLibraryGrid(container, libraryGames, handleRemoveAction);
  }
}

function initLibraryPage() {
  renderLibraryView();
  initCartUI();
}

initLibraryPage();
