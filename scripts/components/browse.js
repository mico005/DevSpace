// scripts/components/browse.js — Catalog Browse Controller (DevSpace)
// Single Responsibility: Manages filter UI state and triggers grid re-renders

import { applyCatalogFilters } from "../utils/helpers.js";
import { buildGameGrid } from "./grid.js";

const state = {
  search: "",
  priceMin: 0,
  priceMax: Infinity,
  rating: "all",
  tags: [],
};

function getElement(id) {
  return document.getElementById(id);
}

function updateGameCount(count) {
  const countEl = getElement("game-count");
  if (countEl) countEl.textContent = `${count} games`;
}

function renderFilteredGrid(allGames) {
  const container = getElement("game-catalog");
  const filteredGames = applyCatalogFilters(allGames, state);

  container.innerHTML = "";
  if (filteredGames.length === 0) {
    container.innerHTML = `<div class="empty-state">No games match your criteria.</div>`;
  } else {
    buildGameGrid(container, filteredGames);
  }

  updateGameCount(filteredGames.length);
}

function handleSearchInput(event, allGames) {
  state.search = event.target.value.trim();
  renderFilteredGrid(allGames);
}

function updateSliderFill() {
  const minSlider = getElement("price-min-slider");
  const maxSlider = getElement("price-max-slider");
  const fill = getElement("price-slider-fill");

  if (!minSlider || !maxSlider || !fill) return;

  const maxLimit = parseFloat(minSlider.max);
  const minVal = parseFloat(minSlider.value);
  const maxVal = parseFloat(maxSlider.value);

  const leftPercent = (minVal / maxLimit) * 100;
  const rightPercent = 100 - (maxVal / maxLimit) * 100;

  fill.style.left = `${leftPercent}%`;
  fill.style.right = `${rightPercent}%`;
}

function handlePriceSync(event, allGames) {
  const minBox = getElement("price-min");
  const maxBox = getElement("price-max");
  const minSlider = getElement("price-min-slider");
  const maxSlider = getElement("price-max-slider");

  const targetId = event.target.id;

  let boxMin = parseFloat(minBox.value) || 0;
  let boxMax = parseFloat(maxBox.value);
  if (isNaN(boxMax)) boxMax = Infinity;

  let slideMin = parseFloat(minSlider.value);
  let slideMax = parseFloat(maxSlider.value);
  const absoluteMax = parseFloat(minSlider.max);

  if (targetId === "price-min-slider" || targetId === "price-max-slider") {
    if (slideMin > slideMax) {
      if (targetId === "price-min-slider") {
        minSlider.value = slideMax;
        slideMin = slideMax;
      } else {
        maxSlider.value = slideMin;
        slideMax = slideMin;
      }
    }

    minBox.value = slideMin;
    if (slideMax === absoluteMax) {
      maxBox.value = "";
      boxMax = Infinity;
    } else {
      maxBox.value = slideMax;
      boxMax = slideMax;
    }
    boxMin = slideMin;
  } else if (targetId === "price-min" || targetId === "price-max") {
    if (boxMin > boxMax && boxMax !== Infinity) {
      if (targetId === "price-min") boxMin = boxMax;
      else boxMax = boxMin;
    }

    minSlider.value = Math.min(boxMin, absoluteMax);
    maxSlider.value =
      boxMax === Infinity ? absoluteMax : Math.min(boxMax, absoluteMax);
  }

  updateSliderFill();

  state.priceMin = boxMin;
  state.priceMax = boxMax;
  renderFilteredGrid(allGames);
}

function handleFilterChange(event, allGames) {
  const target = event.target;

  if (target.name === "rating") {
    state.rating = target.value;
  }

  if (target.name === "tag") {
    if (target.checked) {
      state.tags.push(target.value);
    } else {
      state.tags = state.tags.filter((t) => t !== target.value);
    }
  }

  renderFilteredGrid(allGames);
}

function buildTagCheckboxHtml(tag) {
  return `
    <label class="filter-label">
      <input type="checkbox" name="tag" value="${tag}"> ${tag}
    </label>
  `;
}

// 4. Replace populateGenreSidebar
function populateTagSidebar(tags) {
  const container = getElement("genre-filter-group");
  if (!container) return;

  const tagsHtml = tags.map(buildTagCheckboxHtml).join("");

  // Keep the title fixed, wrap the tags in a scroll container
  container.innerHTML = `
    <div class="filter-title">Tags</div>
    <div class="filter-scroll-area">
      ${tagsHtml}
    </div>
  `;
}

function setupMobileToggle() {
  const toggleBtn = getElement("mobile-filter-btn");
  const content = getElement("sidebar-content");

  if (!toggleBtn || !content) return;

  toggleBtn.addEventListener("click", () => {
    const isActive = content.classList.toggle("active");
    toggleBtn.setAttribute("aria-expanded", isActive);

    const icon = toggleBtn.querySelector(".toggle-icon");
    if (icon) icon.textContent = isActive ? "▲" : "▼";
  });
}

function initBrowseController(allGames, tags) {
  populateTagSidebar(tags);
  setupMobileToggle();

  const searchInput = getElement("catalog-search-input");
  const catalogLayout = document.querySelector(".catalog-layout");

  const minBox = getElement("price-min");
  const maxBox = getElement("price-max");
  const minSlider = getElement("price-min-slider");
  const maxSlider = getElement("price-max-slider");

  searchInput?.addEventListener("input", (e) => handleSearchInput(e, allGames));

  [minBox, maxBox, minSlider, maxSlider].forEach((el) => {
    el?.addEventListener("input", (e) => handlePriceSync(e, allGames));
  });

  // Listen for both radios and checkboxes
  catalogLayout?.addEventListener("change", (e) => {
    if (e.target.type === "radio" || e.target.type === "checkbox") {
      handleFilterChange(e, allGames);
    }
  });

  updateSliderFill();
  renderFilteredGrid(allGames);
}

export { initBrowseController };
