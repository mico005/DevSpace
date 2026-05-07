// scripts/utils/helpers.js — Shared Utilities (DevSpace)
// Single Responsibility: Pure helper functions with no side effects

const GENRE_COLORS = {
  Platformer:  "#e8ff47",
  Exploration: "#47ffe8",
  RPG:         "#ff47e8",
  Puzzle:      "#47a8ff",
  Strategy:    "#ff8c47",
  Survival:    "#ff4747",
  Rhythm:      "#c847ff",
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
  const empty  = 5 - filled;
  return "★".repeat(filled) + "☆".repeat(empty);
}

export { getGenreColor, getCardInitials, buildRatingStars };
