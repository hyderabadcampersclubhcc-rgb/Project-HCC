/**
 * HCC Cancellation & Refund Policy helpers. All wording comes from src/data/cancellation-policy.json,
 * so the policy page, trip pages and FAQs can never drift apart.
 */
import policy from '@/data/cancellation-policy.json';

export { policy };

type Exception = { advance: number; label: string; lines: string[] };
const exceptions = policy.advance.exceptions as Record<string, Exception>;

/** The non-refundable advance per person for a trip (₹500 for the five camping trips, else ₹2,000). */
export const policyAdvance = (tripId: string) => exceptions[tripId]?.advance ?? policy.advance.standard;

/** Advance and balance lines for a trip, e.g. ["A ₹2,000 advance payment per person is non-refundable.", "The remaining balance is due 7 days before departure."]. */
export const paymentLines = (tripId: string) => exceptions[tripId]?.lines ?? policy.advance.standardLines;

/** Trips with their own advance (₹500) and balance wording. */
export const policyExceptions = () => Object.entries(exceptions).map(([id, e]) => ({ id, ...e }));

/** The refund bands, the personal-reasons rule and the HCC-cancellation outcome, as short lines for trip pages. */
export function summaryLines() {
  return [
    ...policy.bands.map((b) => `${b.title}: ${b.lines.join(' ')}`),
    policy.personal,
    policy.eligible,
    policy.hcc.outcome,
  ];
}

/** One-paragraph version for FAQ answers (visible text and FAQPage schema use the same string). */
export const summaryText = () => summaryLines().join(' ');

/** Advance answer for general FAQs. */
const list = (items: string[]) => items.join(', ').replace(/, ([^,]*)$/, ' and $1');

export const advanceText = () =>
  `${policy.advance.standardLines.join(' ')} The ${list(policyExceptions().map((e) => e.label.replace(/ camping$/, '')))} camping trips take a ₹500 non-refundable advance per person; each camp's page shows when the rest is paid.`;

/** HCC-cancellation answer for general FAQs: the policy's own reasons list, lower-cased into one sentence. */
export const hccText = () =>
  `${policy.hcc.intro.replace(/:$/, '')} ${list(policy.hcc.reasons.map((r) => r.charAt(0).toLowerCase() + r.slice(1))).replace(/ and ([^,]*)$/, ' or $1')}. ${policy.hcc.outcome}`;

/**
 * FAQ answers in CMS content can say {{cancellation-summary}}, {{advance-summary}} or {{hcc-cancellation}};
 * they are replaced with the shared policy text (the same string is shown and marked up as FAQPage).
 */
export function expandPolicyTokens(text: string) {
  return text
    .replace(/\{\{cancellation-summary\}\}/g, summaryText())
    .replace(/\{\{advance-summary\}\}/g, advanceText())
    .replace(/\{\{hcc-cancellation\}\}/g, hccText());
}
export const expandFaqs = <T extends { q: string; a: string }>(items: T[]) => items.map((f) => ({ ...f, a: expandPolicyTokens(f.a) }));

/**
 * Indicative 50% refund (owner definition, 21 Oct 2026): 50% × (amount paid − non-refundable advance), before
 * applicable deductions, never below ₹0. Rounded to the nearest rupee (Math.round). Deductions (non-refundable
 * expenses, payment gateway charges, IRCTC rules) are case by case, so this is never shown to customers as a promise.
 */
export function halfRefundBeforeDeductions(amountPaid: number, advance: number) {
  return Math.max(0, Math.round(0.5 * (amountPaid - advance)));
}
