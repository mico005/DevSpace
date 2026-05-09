// scripts/utils/helpers.js — Shared Utilities (DevSpace)
// Single Responsibility: Pure helper functions with no side effects

const GENRE_COLORS = {
  Platformer: "#e8ff47",
  Exploration: "#47ffe8",
  RPG: "#ff47e8",
  Puzzle: "#47a8ff",
  Strategy: "#ff8c47",
  Survival: "#ff4747",
  Rhythm: "#c847ff",
};

const FALLBACK_COLOR = "#e8ff47";

function getGenreColor(genre) {
  return GENRE_COLORS[genre] ?? FALLBACK_COLOR;
}

function getCardInitials(title) {
  if (!title) return "??";
  return title.slice(0, 2).toUpperCase();
}

function buildRatingStars(rating) {
  const filled = Math.round(parseFloat(rating));
  const empty = 5 - filled;
  return "★".repeat(filled) + "☆".repeat(empty);
}

function parsePrice(priceString) {
  if (!priceString || priceString.toLowerCase() === "free") return 0;
  return parseFloat(priceString.replace(/[^0-9.-]+/g, "")) || 0;
}

function isSequentialFuzzyMatch(targetString, searchQuery) {
  const normalizedTarget = targetString.toLowerCase();
  const normalizedQuery = searchQuery.toLowerCase();

  let queryIndex = 0;
  let targetIndex = 0;

  while (
    queryIndex < normalizedQuery.length &&
    targetIndex < normalizedTarget.length
  ) {
    if (normalizedQuery[queryIndex] === normalizedTarget[targetIndex]) {
      queryIndex += 1;
    }
    targetIndex += 1;
  }

  return queryIndex === normalizedQuery.length;
}

function doesFieldMatchSearch(fieldValue, searchQuery) {
  if (!fieldValue) return false;

  const exactSubstringMatch = fieldValue
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
  if (exactSubstringMatch) return true;

  return isSequentialFuzzyMatch(fieldValue, searchQuery);
}

function doTagsMatchSearch(tagsArray, searchQuery) {
  if (!tagsArray || tagsArray.length === 0) return false;

  let tagIndex = 0;
  while (tagIndex < tagsArray.length) {
    if (doesFieldMatchSearch(tagsArray[tagIndex], searchQuery)) {
      return true;
    }
    tagIndex += 1;
  }

  return false;
}

function matchesSearch(game, searchQuery) {
  if (!searchQuery) return true;

  if (doesFieldMatchSearch(game.title, searchQuery)) return true;
  if (doesFieldMatchSearch(game.developer, searchQuery)) return true;
  if (doesFieldMatchSearch(game.genre, searchQuery)) return true;
  if (doTagsMatchSearch(game.tags, searchQuery)) return true;

  return false;
}

function matchesPrice(game, min, max) {
  const price = parsePrice(game.price);
  return price >= min && price <= max;
}

function matchesRating(game, ratingFilter) {
  if (ratingFilter === "all") return true;
  const minRating = parseFloat(ratingFilter);
  const gameRating = parseFloat(game.rating);
  return gameRating >= minRating;
}

function matchesTags(game, activeTags) {
  // If no tags are selected, show all games
  if (!activeTags || activeTags.length === 0) return true;

  // If the game has no tags but tags are selected, it fails
  if (!game.tags) return false;

  // AND logic: the game must contain ALL selected tags
  return activeTags.every((tag) => game.tags.includes(tag));
}

function applyCatalogFilters(games, state) {
  return games.filter((game) => {
    if (!matchesSearch(game, state.search)) return false;
    if (!matchesPrice(game, state.priceMin, state.priceMax)) return false;
    if (!matchesRating(game, state.rating)) return false;
    if (!matchesTags(game, state.tags)) return false;
    return true;
  });
}

export {
  getGenreColor,
  getCardInitials,
  buildRatingStars,
  applyCatalogFilters,
};
