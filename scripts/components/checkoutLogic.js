// scripts/components/checkoutLogic.js — Checkout Modal Logic (DevSpace)
// Single Responsibility: Modal lifecycle, payment selection state, confirm flow

import { buildModalHtml, buildSuccessHtml } from "./checkoutTemplates.js";

const OVERLAY_ID  = "checkout-overlay";
const MODAL_ID    = "checkout-modal";

const PAYMENT_METHODS = [
  { id: "card",    icon: "💳", label: "Credit Card" },
  { id: "paypal",  icon: "🅿", label: "PayPal"      },
  { id: "crypto",  icon: "₿",  label: "Crypto"      },
  { id: "gift",    icon: "🎁", label: "Gift Card"   },
];

const AUTO_CLOSE_DELAY_MS   = 2800;
const PROCESSING_DELAY_MS   = 1400;

function getElementById(id) {
  return document.getElementById(id);
}

function closeCheckoutModal() {
  const overlay = getElementById(OVERLAY_ID);
  overlay.classList.remove("active");
  overlay.removeAttribute("aria-hidden");
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

function enableConfirmButton() {
  const confirmBtn = getElementById("confirm-purchase-btn");
  if (confirmBtn) confirmBtn.disabled = false;
}

function handlePaymentSelection(event) {
  const clickedOption = event.target.closest(".payment-option");
  if (!clickedOption) return;
  selectPaymentOption(clickedOption);
  enableConfirmButton();
}

function showProcessingState(confirmBtn) {
  confirmBtn.disabled    = true;
  confirmBtn.textContent = "Processing...";
}

function showSuccessAndAutoClose(game) {
  getElementById(MODAL_ID).innerHTML = buildSuccessHtml(game);
  setTimeout(closeCheckoutModal, AUTO_CLOSE_DELAY_MS);
}

function handleConfirmPurchase(game) {
  const confirmBtn = getElementById("confirm-purchase-btn");
  if (!confirmBtn || confirmBtn.disabled) return;
  showProcessingState(confirmBtn);
  setTimeout(() => showSuccessAndAutoClose(game), PROCESSING_DELAY_MS);
}

function closeOnOverlayBackdropClick(event) {
  const modal = getElementById(MODAL_ID);
  if (!modal.contains(event.target)) closeCheckoutModal();
}

function attachModalEventListeners(game) {
  const overlay        = getElementById(OVERLAY_ID);
  const closeBtn       = getElementById("modal-close-btn");
  const confirmBtn     = getElementById("confirm-purchase-btn");
  const paymentOptions = document.querySelector(".payment-options");

  closeBtn?.addEventListener("click", closeCheckoutModal);
  confirmBtn?.addEventListener("click", () => handleConfirmPurchase(game));
  paymentOptions?.addEventListener("click", handlePaymentSelection);
  overlay.addEventListener("click", closeOnOverlayBackdropClick);
  document.addEventListener("keydown",
    (e) => { if (e.key === "Escape") closeCheckoutModal(); },
    { once: true }
  );
}

function openCheckoutModal(game) {
  const overlay = getElementById(OVERLAY_ID);
  getElementById(MODAL_ID).innerHTML = buildModalHtml(game, PAYMENT_METHODS);
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  attachModalEventListeners(game);
}

export { openCheckoutModal };
