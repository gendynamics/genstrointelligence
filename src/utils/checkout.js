/*
 * checkout.js — payment entry point for Pricing tiers.
 *
 * Behavior:
 *   - If REACT_APP_STRIPE_<TIER>_LINK is set, open that Stripe Payment Link.
 *   - Else if REACT_APP_PAYPAL_<TIER>_LINK is set, open that PayPal checkout link.
 *   - Else fall back to the Contact page with the tier preselected via ?plan=.
 *
 * No SDK is loaded client-side until keys exist — this keeps the build clean
 * and avoids shipping secrets. Add hosted payment links (Stripe Dashboard →
 * Payment Links, or PayPal buttons) as env vars when accounts are ready.
 */

const STRIPE_PREFIX = 'REACT_APP_STRIPE_';
const PAYPAL_PREFIX = 'REACT_APP_PAYPAL_';

/**
 * Resolve the checkout target for a pricing tier.
 * @param {string} tierName  e.g. 'Scout'
 * @returns {{ type: 'stripe'|'paypal'|'contact', url: string }}
 */
export function resolveCheckout(tierName) {
  const key = tierName.toUpperCase();
  const stripeUrl = process.env[`${STRIPE_PREFIX}${key}_LINK`];
  const paypalUrl = process.env[`${PAYPAL_PREFIX}${key}_LINK`];

  if (stripeUrl) return { type: 'stripe', url: stripeUrl };
  if (paypalUrl) return { type: 'paypal', url: paypalUrl };
  return { type: 'contact', url: `/contact?plan=${encodeURIComponent(tierName)}` };
}

/**
 * Start checkout for a tier. Opens hosted payment pages in a new tab,
 * or navigates to Contact when no payment link is configured.
 * @param {string} tierName
 * @param {(path: string) => void} navigate  react-router navigate fn
 */
export function startCheckout(tierName, navigate) {
  const target = resolveCheckout(tierName);

  if (target.type === 'contact') {
    navigate(target.url);
    return;
  }

  // Hosted Stripe Payment Link / PayPal checkout — safe to open directly
  window.open(target.url, '_blank', 'noopener,noreferrer');
}
