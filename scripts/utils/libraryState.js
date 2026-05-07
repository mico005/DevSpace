// scripts/utils/libraryState.js — Library State Manager (DevSpace)
// Single Responsibility: Manages owned games persistence via sessionStorage

const LIBRARY_KEY = "devspace_library";

function getLibrary() {
  return JSON.parse(sessionStorage.getItem(LIBRARY_KEY) || "[]");
}

function addGamesToLibrary(games) {
  const library = getLibrary();
  const existingIds = new Set(library.map((g) => g.id));

  const newGames = games.filter((g) => !existingIds.has(g.id));

  if (newGames.length > 0) {
    sessionStorage.setItem(
      LIBRARY_KEY,
      JSON.stringify([...library, ...newGames]),
    );
  }
}

function removeGameFromLibrary(id) {
  const library = getLibrary().filter((g) => g.id !== id);
  sessionStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

export { getLibrary, addGamesToLibrary, removeGameFromLibrary };
