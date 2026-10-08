# HCC Internal Linking Plan

**Snapshot:** production-mode build of `6ba66f8`, 8 Oct 2026.
- The Hyderabad hub has about 27 inbound internal links.
- 0 broken links (`npm run check:links`).
- The footer and navigation link to some hidden or noindex category pages (thin-page audit, owner decision pending).

## 1. Principles

1. **Direction of authority:**
   - Home → hubs → destination guides → trip pages.
   - Guides and articles → trip pages.
   - Trip pages link sideways to related trips and up to their destination guide.
2. **Every indexable page has at least 2 contextual inbound links** from relevant indexable pages (not just the nav or footer).
3. **Anchor text is descriptive and varied.** Use the destination plus the format, e.g. "Ooty & Coonoor group trip from Hyderabad", "Gokarna & Dandeli weekend". Avoid repeating the exact same money keyword everywhere. Never use "click here".
4. **Don't link from indexable pages to noindex drafts** as a primary path, except where the draft is already published and useful to the user. Indexing is a separate decision.
5. **When a guide becomes indexable,** add links to it from the relevant hub and trip pages in the same change.
6. **Use `TripTable` and `TripCallout` components** for trip links inside guides, so prices and URLs stay correct.

## 2. Required links (current pages)

| From | To | Anchor idea | Why | Status |
|---|---|---|---|---|
| `/weekend-trips-from-hyderabad/` | each Tier 1 trip page | "{Destination} trip from Hyderabad" | Pillar → commercial owners | ✅ present: Ooty, Isha, Coorg, Gokarna, Araku, Wayanad, Gandikota |
| `/weekend-trips-from-hyderabad/` | `/camping-near-hyderabad/` | "camping near Hyderabad" | Short-trip alternative | ✅ present |
| `/camping-near-hyderabad/` | Narsapur, Ananthagiri, Gandikota trips | "{Camp} camping trip" | Pillar → commercial | ✅ present (all 3) |
| `/destinations/ooty/` | `/trips/ooty-coonoor-from-hyderabad/`, `/trips/isha-ooty-coonoor-from-hyderabad/` | "Ooty & Coonoor trip from Hyderabad" | Guide → commercial | ✅ present |
| `/destinations/coorg/` + `/destinations/chikmagalur/` | `/trips/coorg-chikmagalur-from-hyderabad/` | "Coorg & Chikmagalur trip" | Guide → commercial | ✅ present |
| `/destinations/gokarna/` + `/destinations/dandeli/` | `/trips/gokarna-dandeli-from-hyderabad/` | "Gokarna & Dandeli trip from Hyderabad" | Guide → commercial | ✅ present |
| `/destinations/araku/` | `/trips/araku-vanajangi-vizag-from-hyderabad/` | "Araku & Vanajangi trip" | Guide → commercial | ✅ present |
| Each trip page | its destination guide(s) | destination name | Sideways and up | automatic (trip template) |
| Each trip page | 2–3 related trips | trip names | Sideways | automatic (related trips) |
| `/destinations/ananthagiri/` | `/camping-near-hyderabad/` | "other camps near Hyderabad" | Guide → pillar | ✅ present |
| `/weekend-trips-from-hyderabad/` | `/trips/narsapur-camping-from-hyderabad/`, `/trips/ananthagiri-camping-from-hyderabad/` | "Narsapur forest camping", "Ananthagiri Hills camping" | Hub reaches these only via the camping pillar | ❌ missing (low priority; proposal) |

Checked against the `6ba66f8` build on 8 Oct 2026 by grepping the built HTML. **Don't edit pages without approval.**

## 3. Links to add WHEN a guide is made indexable (owner approval)

| Guide | Add inbound links from |
|---|---|
| Winter weekend trips | the Hyderabad hub (a winter section), the Araku guide, the Ooty trip page FAQ "When is the best time?" |
| Long weekend trips 2027 | the Hyderabad hub ("Planning around a long weekend?"), `/upcoming-trips/` intro |
| Ooty vs Coorg vs Wayanad | the Ooty, Coorg and Wayanad destination guides (a "comparing?" line) |
| Under ₹8,000 | the Hyderabad hub (a budget section), the Gokarna trip page |
| Solo trips | the Hyderabad hub, the `/faq/` solo question, trip pages that mention solo travellers |

## 4. Orphan and weak-link checks (monthly)

1. Indexable pages with fewer than 2 contextual inbound links. Fix by adding links from the relevant hub or guide.
2. Indexable pages that link to noindex pages as their main CTA.
3. Nav and footer links to noindex thin pages (Backpacking, Corporate, Family, etc.). Owner decision pending: either improve those pages or remove them from the nav and footer.
4. Redirect chains: internal links pointing at a URL that 301s. Update them to the final URL.
