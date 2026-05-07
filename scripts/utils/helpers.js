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

function matchesSearch(game, query) {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();
  return (
    game.title.toLowerCase().includes(lowerQuery) ||
    game.developer.toLowerCase().includes(lowerQuery) ||
    game.genre.toLowerCase().includes(lowerQuery)
  );
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

function matchesGenre(game, activeGenre) {
  if (activeGenre === "all") return true;
  return game.genre === activeGenre;
}

function applyCatalogFilters(games, state) {
  return games.filter((game) => {
    if (!matchesSearch(game, state.search)) return false;
    if (!matchesPrice(game, state.priceMin, state.priceMax)) return false;
    if (!matchesRating(game, state.rating)) return false;
    if (!matchesGenre(game, state.genre)) return false;
    return true;
  });
}

export {
  getGenreColor,
  getCardInitials,
  buildRatingStars,
  applyCatalogFilters,
};
