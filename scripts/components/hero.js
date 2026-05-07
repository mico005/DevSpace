// scripts/components/hero.js — Hero Section Builder (DevSpace)
// Single Responsibility: Renders the featured games hero banner

const HERO_BG_CLASSES = ["hero-bg-1", "hero-bg-2", "hero-bg-3"];

function buildDiscoverButton(game) {
  return `<a href="game.html?id=${game.id}" class="hero-discover-btn">Discover →</a>`;
}

function buildHeroSlotInnerHtml(game, index) {
  const bgClass  = HERO_BG_CLASSES[index] ?? "hero-bg-1";
  const isFirst  = index === 0;

  return `
    <div class="hero-bg ${bgClass}">
      <div class="hero-grid-lines"></div>
    </div>
    <div class="hero-content">
      <span class="hero-tag">${game.genre}</span>
      <div class="hero-title">${game.title}</div>
      <div class="hero-meta">
        <span>${game.developer}</span>
        <span class="hero-price">${game.price}</span>
      </div>
      ${isFirst ? buildDiscoverButton(game) : ""}
    </div>
  `;
}

function buildHeroSlot(game, index) {
  const slot = document.createElement("a");
  slot.className = "hero-slot";
  slot.href      = `game.html?id=${game.id}`;
  slot.setAttribute("aria-label", `Featured: ${game.title}`);
  slot.innerHTML = buildHeroSlotInnerHtml(game, index);
  return slot;
}

function buildHeroSection(container, featuredGames) {
  const fragment = document.createDocumentFragment();
  featuredGames.forEach((game, index) => {
    fragment.appendChild(buildHeroSlot(game, index));
  });
  container.appendChild(fragment);
}

export { buildHeroSection };
