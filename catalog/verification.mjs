// Trip-page indexing rule, shared by the site build (src/lib/catalog.ts) and the checks
// (tools/check-integrity.mjs, tools/catalog-audit.mjs) so they can never disagree.
// Rule (catalog/verification.json → approvalProcess, owner correction of 9 Oct 2026):
//   - a page is indexable when the owner approved it (publishApproved) and none of its essential
//     facts is in CONFLICT;
//   - a missing fact is flagged (NEEDS CONFIRMATION) but does NOT block the page;
//   - usable data = OWNER CONFIRMED, VERIFIED (catalog) or WORKING REFERENCE.

/** @param {string | undefined} value */
export const isUsable = (value) => /^(VERIFIED|OWNER CONFIRMED|WORKING REFERENCE)/.test(value ?? '');
/** @param {string | undefined} value */
export const isConflict = (value) => /^CONFLICT/.test(value ?? '');
/** @param {string | undefined} value */
export const isFlagged = (value) => /^(NEEDS CONFIRMATION|UNVERIFIED)/.test(value ?? '');

/**
 * @param {{ approvalProcess: { essentialFacts: string[] }, trips: Record<string, { publishApproved?: string[], cities?: Record<string, { fields?: Record<string, string> }> }> }} ledger
 * @param {string} tripId
 * @param {string} city
 * @returns {{ approved: boolean, conflicts: string[], flagged: string[], indexable: boolean }}
 */
export function pageStatus(ledger, tripId, city) {
  const trip = ledger.trips[tripId];
  const fields = trip?.cities?.[city]?.fields ?? {};
  const essential = ledger.approvalProcess.essentialFacts;
  const conflicts = essential.filter((f) => isConflict(fields[f]));
  const flagged = Object.keys(fields).filter((f) => isFlagged(fields[f]));
  const approved = (trip?.publishApproved ?? []).includes(city);
  return { approved, conflicts, flagged, indexable: approved && conflicts.length === 0 };
}
