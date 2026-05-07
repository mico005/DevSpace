// scripts/pages/gameTemplates.js — Game Detail HTML Templates (DevSpace)
// Single Responsibility: Pure HTML string generation for the game detail page

import { getGenreColor, buildRatingStars } from "../utils/helpers.js";

function buildHeroBackdropHtml(game) {
  const color = getGenreColor(game.genre);
  return `
    <div style="
      position: absolute; inset: 0;
      background: linear-gradient(135deg,
        ${color}18 0%, #0a0a0f 50%, #16161f 100%
      );
    "></div>
    <div style="
      position: absolute; inset: 0;
      background-image:
        linear-gradient(${color}08 1px, transparent 1px),
        linear-gradient(90deg, ${color}08 1px, transparent 1px);
      background-size: 44px 44px;
    "></div>
  `;
}

function buildGalleryThumbHtml(game, index) {
  const color = getGenreColor(game.genre);
  return `
    <div class="gallery-thumb">
      <div class="gallery-thumb-inner" style="
        background: linear-gradient(135deg,
          ${color}22 0%, #16161f 60%, ${color}11 100%
        );
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem; color: ${color}44;
          letter-spacing: 0.06em;
        ">SCREENSHOT ${index + 1}</span>
      </div>
      <div class="gallery-thumb-overlay">⊕</div>
    </div>
  `;
}

function buildGalleryHtml(game) {
  const count     = Math.min(game.screenshots.length, 3);
  const thumbsHtml = Array.from({ length: count }, (_, i) =>
    buildGalleryThumbHtml(game, i)
  ).join("");

  return `
    <section class="gallery-section">
      <div class="section-label">Gameplay Gallery</div>
      <div class="trailer-placeholder"
           role="button" tabindex="0"
           aria-label="Watch gameplay trailer">
        <div class="play-icon">▶</div>
        <div class="trailer-label">Watch Gameplay Trailer</div>
      </div>
      <div class="gallery-grid">${thumbsHtml}</div>
    </section>
  `;
}

function buildTagsHtml(tags) {
  return tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function buildDescriptionHtml(game) {
  return `
    <section class="description-section">
      <div class="section-label">About This Game</div>
      <p class="description-text">${game.description}</p>
      <div class="tags-row">${buildTagsHtml(game.tags)}</div>
    </section>
  `;
}

function buildSpecsHtml(specs) {
  return `
    <section class="specs-section">
      <div class="section-label">System Requirements</div>
      <div class="specs-grid">
        <div class="spec-cell">
          <div class="spec-label">Minimum</div>
          <div class="spec-value">${specs.min}</div>
        </div>
        <div class="spec-cell">
          <div class="spec-label">Recommended</div>
          <div class="spec-value">${specs.rec}</div>
        </div>
      </div>
    </section>
  `;
}

function buildPurchasePanelHtml(game) {
  return `
    <aside class="game-panel">
      <div class="panel-game-title">${game.title}</div>
      <div class="panel-developer">${game.developer}</div>
      <div class="panel-price">${game.price}</div>
      <div class="panel-rating">
        <span class="panel-rating-stars">${buildRatingStars(game.rating)}</span>
        <span>${game.rating} / 5.0</span>
      </div>
      <button class="buy-btn" id="buy-button"
              aria-label="Buy ${game.title} for ${game.price}">
        BUY NOW
      </button>
      <button class="wishlist-btn" id="add-cart-button">+ Add to Cart</button>
      <hr class="panel-divider" />
      <div class="panel-meta-row">
        <span class="panel-meta-key">Genre</span>
        <span class="panel-meta-val">${game.genre}</span>
      </div>
      <div class="panel-meta-row">
        <span class="panel-meta-key">Developer</span>
        <span class="panel-meta-val">${game.developer}</span>
      </div>
      <div class="panel-meta-row">
        <span class="panel-meta-key">Platform</span>
        <span class="panel-meta-val">Windows / Mac</span>
      </div>
      <div class="panel-secure-note">🔒 Secure checkout · Instant download</div>
    </aside>
  `;
}

function buildDetailPageHtml(game) {
  return `
    <section class="game-hero">
      <div class="game-hero-backdrop">${buildHeroBackdropHtml(game)}</div>
      <div class="game-hero-fade"></div>
      <div class="game-hero-content">
        <span class="game-genre-tag">${game.genre}</span>
        <h1 class="game-title-hero">${game.title}</h1>
        <p class="game-developer-hero">by <strong>${game.developer}</strong></p>
      </div>
    </section>
    <div class="game-layout">
      <div class="game-main">
        ${buildGalleryHtml(game)}
        ${buildDescriptionHtml(game)}
        ${buildSpecsHtml(game.specs)}
      </div>
      ${buildPurchasePanelHtml(game)}
    </div>
  `;
}

export { buildDetailPageHtml };
