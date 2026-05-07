// scripts/api/data.js — Data Layer (DevSpace)
// Single Responsibility: Async data fetching and lookup

const GAMES_URL = "./data/games.json";

async function fetchAllGames() {
  try {
    const response = await fetch(GAMES_URL);
    if (!response.ok) return null;
    const json = await response.json();
    return json.games ?? null;
  } catch {
    return null;
  }
}

async function fetchGameById(id) {
  const games = await fetchAllGames();
  if (!games) return null;
  return games.find((game) => game.id === id) ?? null;
}

export { fetchAllGames, fetchGameById };
