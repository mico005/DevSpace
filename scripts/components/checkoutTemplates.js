// scripts/components/checkoutTemplates.js — Checkout HTML Templates (DevSpace)
// Single Responsibility: Pure HTML string generation for checkout modal states

function parsePrice(priceString) {
  if (!priceString || priceString.toLowerCase() === "free") return 0;
  return parseFloat(priceString.replace(/[^0-9.-]+/g, "")) || 0;
}

function buildOrderSummaryHtml(games) {
  const totalNum = games.reduce((sum, g) => sum + parsePrice(g.price), 0);
  const totalStr = totalNum === 0 ? "Free" : `$${totalNum.toFixed(2)}`;

  const itemsHtml = games
    .map(
      (g) => `
    <div class="order-row">
      <span class="order-title-text">${g.title}</span>
      <span class="order-meta">${g.price}</span>
    </div>
  `,
    )
    .join("");

  return `
    <div class="order-summary">
      <div class="order-summary-label">Order Summary (${games.length} Item${games.length !== 1 ? "s" : ""})</div>
      ${itemsHtml}
      <div class="order-row" style="border-top: 1px solid var(--border); margin-top: 0.8rem; padding-top: 0.8rem;">
        <span class="order-meta" style="color: var(--text); font-weight: 600;">Total</span>
        <span class="order-total">${totalStr}</span>
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

function buildModalHtml(games, methods) {
  return `
    <div class="modal-header">
      <div class="modal-title">Checkout</div>
      <button class="modal-close" id="modal-close-btn" aria-label="Close checkout">✕</button>
    </div>
    <div class="modal-body">
      ${buildOrderSummaryHtml(games)}
      ${buildPaymentOptionsHtml(methods)}
      <button class="confirm-btn" id="confirm-purchase-btn" disabled>
        CONFIRM PURCHASE
      </button>
      <div class="secure-badge">🔒 256-bit SSL · Secure Transaction</div>
    </div>
  `;
}

function buildSuccessHtml(games) {
  const titles = games.map((g) => g.title).join(", ");
  return `
    <div class="success-state">
      <div class="success-icon">✓</div>
      <div class="success-title">Purchase Complete!</div>
      <p class="success-msg">
        <strong>${titles}</strong> added to your library.<br />
        Check your email for your download key.
      </p>
    </div>
  `;
}

export { buildModalHtml, buildSuccessHtml };
