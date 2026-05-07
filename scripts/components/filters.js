// scripts/components/filters.js — Filter Bar Builder (DevSpace)
// Single Responsibility: Renders genre filter pills and manages active filter state

import { buildGameGrid } from "./grid.js";

function filterGamesByGenre(games, genre) {
  if (genre === "All") return games;
  return games.filter((game) => game.genre === genre);
}

function deactivateAllPills(pills) {
  pills.forEach((pill) => {
    pill.classList.remove("active");
    pill.setAttribute("aria-pressed", "false");
  });
}

function activatePill(pill) {
  pill.classList.add("active");
  pill.setAttribute("aria-pressed", "true");
}

function replaceGameGrid(container, games, genre) {
  const existingGrid = container.querySelector(".game-grid");
  if (existingGrid) existingGrid.remove();
  buildGameGrid(container, filterGamesByGenre(games, genre));
}

function buildFilterPill(label, games, gridContainer, allPills) {
  const pill = document.createElement("button");
  pill.className = "filter-pill";
  pill.textContent = label;
  pill.setAttribute("aria-pressed", "false");

  pill.addEventListener("click", () => {
    deactivateAllPills(allPills);
    activatePill(pill);
    replaceGameGrid(gridContainer, games, label);
  });

  return pill;
}

function buildFilterBar(container, games, gridContainer, genres) {
  const labels = ["All", ...genres];
  const pills  = [];

  labels.forEach((label) => {
    const pill = buildFilterPill(label, games, gridContainer, pills);
    pills.push(pill);
    container.appendChild(pill);
  });

  if (pills.length > 0) activatePill(pills[0]);
}

export { buildFilterBar };
