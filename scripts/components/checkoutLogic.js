// scripts/components/checkoutLogic.js — Checkout Modal Logic (DevSpace)
// Single Responsibility: Modal lifecycle, payment selection state, confirm flow

import { buildModalHtml, buildSuccessHtml } from "./checkoutTemplates.js";
import { removeGamesFromCart } from "../utils/cartState.js";
import { addGamesToLibrary } from "../utils/libraryState.js"; // <-- NEW IMPORT

const OVERLAY_ID = "checkout-overlay";
const MODAL_ID = "checkout-modal";

const PAYMENT_METHODS = [
  { id: "card", icon: "💳", label: "Credit Card" },
  { id: "paypal", icon: "🅿", label: "PayPal" },
  { id: "crypto", icon: "₿", label: "Crypto" },
];

const AUTO_CLOSE_DELAY_MS = 2800;
const PROCESSING_DELAY_MS = 1400;

function getElementById(id) {
  return document.getElementById(id);
}

function closeCheckoutModal() {
  const overlay = getElementById(OVERLAY_ID);
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function deselectAllPaymentOptions() {
  document.querySelectorAll(".payment-option").forEach((opt) => {
    opt.classList.remove("selected");
    opt.setAttribute("aria-pressed", "false");
  });
}

function selectPaymentOption(option) {
  deselectAllPaymentOptions();
  option.classList.add("selected");
  option.setAttribute("aria-pressed", "true");
}

function handlePaymentSelection(event) {
  const clickedOption = event.target.closest(".payment-option");
  if (!clickedOption) return;
  selectPaymentOption(clickedOption);

  const confirmBtn = getElementById("confirm-purchase-btn");
  if (confirmBtn) confirmBtn.disabled = false;
}

function showProcessingState(confirmBtn) {
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Processing...";
}

function showSuccessAndAutoClose(games) {
  getElementById(MODAL_ID).innerHTML = buildSuccessHtml(games);

  // Extract IDs of purchased games and remove ONLY those from the cart
  const purchasedIds = games.map((g) => g.id);
  removeGamesFromCart(purchasedIds);

  // <-- NEW: Add to session storage library
  addGamesToLibrary(games);

  setTimeout(closeCheckoutModal, AUTO_CLOSE_DELAY_MS);
}

function handleConfirmPurchase(games) {
  const confirmBtn = getElementById("confirm-purchase-btn");
  if (!confirmBtn || confirmBtn.disabled) return;
  showProcessingState(confirmBtn);
  setTimeout(() => showSuccessAndAutoClose(games), PROCESSING_DELAY_MS);
}

function attachModalEventListeners(games) {
  const overlay = getElementById(OVERLAY_ID);
  const closeBtn = getElementById("modal-close-btn");
  const confirmBtn = getElementById("confirm-purchase-btn");
  const paymentOptions = document.querySelector(".payment-options");
  const modal = getElementById(MODAL_ID);

  closeBtn?.addEventListener("click", closeCheckoutModal);
  confirmBtn?.addEventListener("click", () => handleConfirmPurchase(games));
  paymentOptions?.addEventListener("click", handlePaymentSelection);

  overlay?.addEventListener("click", (e) => {
    if (!modal.contains(e.target)) closeCheckoutModal();
  });
}

function openCheckoutModal(games) {
  const overlay = getElementById(OVERLAY_ID);
  getElementById(MODAL_ID).innerHTML = buildModalHtml(games, PAYMENT_METHODS);
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  attachModalEventListeners(games);
}

export { openCheckoutModal };
