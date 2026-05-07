// scripts/components/checkoutTemplates.js — Checkout HTML Templates (DevSpace)
// Single Responsibility: Pure HTML string generation for checkout modal states

function buildOrderSummaryHtml(game) {
  return `
    <div class="order-summary">
      <div class="order-summary-label">Order Summary</div>
      <div class="order-row">
        <span class="order-title-text">${game.title}</span>
        <span class="order-meta">${game.genre}</span>
      </div>
      <div class="order-row">
        <span class="order-meta">Developer</span>
        <span class="order-meta">${game.developer}</span>
      </div>
      <div class="order-row">
        <span class="order-meta">Platform License</span>
        <span class="order-total">${game.price}</span>
      </div>
    </div>
  `;
}

function buildPaymentOptionHtml(method) {
  return `
    <button class="payment-option" data-method="${method.id}" aria-pressed="false">
      <span class="payment-option-icon">${method.icon}</span>
      ${method.label}
    </button>
  `;
}

function buildPaymentOptionsHtml(methods) {
  return `
    <span class="payment-label">Payment Method</span>
    <div class="payment-options">
      ${methods.map(buildPaymentOptionHtml).join("")}
    </div>
  `;
}

function buildModalHtml(game, methods) {
  return `
    <div class="modal-header">
      <div class="modal-title">Checkout</div>
      <button class="modal-close" id="modal-close-btn" aria-label="Close checkout">✕</button>
    </div>
    <div class="modal-body">
      ${buildOrderSummaryHtml(game)}
      ${buildPaymentOptionsHtml(methods)}
      <button class="confirm-btn" id="confirm-purchase-btn" disabled>
        CONFIRM PURCHASE
      </button>
      <div class="secure-badge">🔒 256-bit SSL · Secure Transaction</div>
    </div>
  `;
}

function buildSuccessHtml(game) {
  return `
    <div class="success-state">
      <div class="success-icon">✓</div>
      <div class="success-title">Purchase Complete!</div>
      <p class="success-msg">
        <strong>${game.title}</strong> has been added to your library.<br />
        Check your email for your download key.
      </p>
    </div>
  `;
}

export { buildModalHtml, buildSuccessHtml };
