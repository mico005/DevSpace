// scripts/pages/gameTemplates.js — Game Detail HTML Templates (DevSpace)
// Single Responsibility: Pure HTML string generation for the game detail page

import { getGenreColor, buildRatingStars } from "../utils/helpers.js";

// Exported so game.js can swap the main viewer content dynamically
function buildMainMediaHtml(type, src) {
  if (type === "video") {
    return `
      <video 
        class="main-media-video" 
        controls 
        autoplay 
        preload="auto" 
        title="Gameplay Trailer"
      >
        <source src="${src}" type="video/mp4" />
        <source src="${src.replace(".mp4", ".webm")}" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `;
  }
  return `<img src="${src}" class="main-media-image" alt="Gameplay Media" />`;
}

function buildHeroBackdropHtml(game) {
  if (game.banner) {
    return `<img src="${game.banner}" alt="${game.title} Banner" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`;
  }

  const color = getGenreColor(game.genre);
  return `
    <div style="position: absolute; inset: 0; background: linear-gradient(135deg, ${color}18 0%, #0a0a0f 50%, #16161f 100%);"></div>
    <div style="position: absolute; inset: 0; background-image: linear-gradient(${color}08 1px, transparent 1px), linear-gradient(90deg, ${color}08 1px, transparent 1px); background-size: 44px 44px;"></div>
  `;
}

function buildGalleryHtml(game) {
  // Combine trailer and screenshots into a unified media array
  const mediaItems = [];
  if (game.trailer) mediaItems.push({ type: "video", src: game.trailer });
  if (game.screenshots) {
    game.screenshots.forEach((url) =>
      mediaItems.push({ type: "image", src: url }),
    );
  }

  if (mediaItems.length === 0) return "";

  // Build the thumbnail track
  const thumbsHtml = mediaItems
    .map((item, index) => {
      const isVideo = item.type === "video";
      const thumbImg = isVideo
        ? game.thumbnail ||
          game.banner ||
          (game.screenshots && game.screenshots[0]) ||
          ""
        : item.src;
      const activeClass = index === 0 ? "active" : "";
      const overlayIcon = isVideo ? `<div class="thumb-play-icon">▶</div>` : "";

      return `
      <button class="gallery-track-thumb ${activeClass}" data-type="${item.type}" data-src="${item.src}" aria-label="View media ${index + 1}">
        ${thumbImg ? `<img src="${thumbImg}" alt="Thumb ${index}" loading="lazy" />` : `<div style="width:100%;height:100%;background:var(--border);"></div>`}
        <div class="thumb-overlay">${overlayIcon}</div>
      </button>
    `;
    })
    .join("");

  return `
    <section class="gallery-section">
      <div class="section-label">Gameplay Gallery</div>
      <div class="gallery-carousel">
        <div class="gallery-main-view">
          <button class="gallery-control-btn prev-btn" id="gallery-prev-btn" aria-label="Previous media">❮</button>
          <button class="gallery-control-btn next-btn" id="gallery-next-btn" aria-label="Next media">❯</button>
          <div id="gallery-media-container" style="width: 100%; height: 100%;">
            ${buildMainMediaHtml(mediaItems[0].type, mediaItems[0].src)}
          </div>
        </div>
        <div class="gallery-thumb-track" id="gallery-thumb-track">
          ${thumbsHtml}
        </div>
      </div>
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
      <button class="buy-btn" id="buy-button" aria-label="Buy ${game.title} for ${game.price}">BUY NOW</button>
      <button class="wishlist-btn" id="add-cart-button">+ Add to Cart</button>
      <hr class="panel-divider" />
      <div class="panel-meta-row"><span class="panel-meta-key">Genre</span><span class="panel-meta-val">${game.genre}</span></div>
      <div class="panel-meta-row"><span class="panel-meta-key">Developer</span><span class="panel-meta-val">${game.developer}</span></div>
      <div class="panel-meta-row"><span class="panel-meta-key">Platform</span><span class="panel-meta-val">Windows / Mac</span></div>
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

// Export the newly separated main media builder
export { buildDetailPageHtml, buildMainMediaHtml };
