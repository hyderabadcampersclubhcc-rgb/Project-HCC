# HCC Authority & Trust Plan

Content alone won't beat established operators and OTAs. Authority comes from **real-world signals**: reviews, a verified business profile, genuine mentions, real photos and consistent identity. Everything here must be **genuine**: no fake reviews, ratings, testimonials, traveller counts or bought links.

## 1. Google Business Profile (highest impact, owner action)

- [ ] Confirm the GBP website field points to `https://hyderabadcampersclubhcc.in/` once production is live (currently `site.json` → googleBusiness `https://maps.app.goo.gl/4vGNiVUasQwJs35A8`).
- [ ] Make sure the name, phone and address match the website exactly. The address on the site is "9-4-30A/1, Hasmathpet, Secunderabad, Hyderabad, Telangana". It has **no postal code**, so the schema has no address yet. Supply the PIN only if the owner wants it shown.
- [ ] Choose the categories and description in GBP (owner). Don't use "Sole Proprietorship" anywhere.
- [ ] After each trip, ask travellers for an honest Google review via WhatsApp. **Never** incentivise reviews or write them on anyone's behalf.
- [ ] Reply to reviews (owner).
- [ ] Post real trip photos to GBP regularly.

## 2. Reviews on the website

- Policy (owner, Phase D): show only genuine reviews; no invented cards. The reviews button links to Google.
- **No AggregateRating schema** unless the reviews are first-party and collected on the site under Google's rules. Today, the answer is no.

## 3. Real photography (high impact)

- Current: several pages use licensed or stock photos, and Ooty uses AI illustrations (labelled).
- Ask: per Tier 1 trip, 6–10 real photos from HCC trips (with traveller consent where people are identifiable). Priority order: camping (Narsapur, Ananthagiri), Gokarna, Coorg, Ooty, Araku.
- Replace AI illustrations with real photos as they arrive. Keep the "AI-generated illustration" credit until then.

## 4. Consistent identity (entity signals)

Already in place:
- Organization schema with name, alternateName, logo and sameAs (Instagram, Facebook, Google Maps).
- The same logo everywhere.

To do:
- [ ] Make sure the Instagram and Facebook bios link to the new domain after launch.
- [ ] If HCC has a YouTube channel, add it to `site.json` social so it joins `sameAs`.
- [ ] Use one business name everywhere: "Hyderabad Campers Club (HCC)".

## 5. Genuine mentions and links (slow, steady)

Ethical options only:
1. **Local listings:** JustDial or Sulekha, but only if the owner already uses them. Keep the details consistent.
2. **Community:** Hyderabad trekking and travel communities and Meetup, where HCC actually participates. No spam.
3. **Local press:** a real story, e.g. a camping event or a responsible-travel initiative. Only if one happens.
4. **Partners:** campsites, homestays and transport partners HCC really works with may link to HCC. Ask politely; no paid links.
5. **Content worth citing:** accurate route and schedule information (e.g. how the Thu/Fri train batches work) that others can reference.

**Never:** buy links, use PBNs, take part in link exchanges at scale, post comment spam or use AI-generated guest posts.

## 6. YouTube / Reels

- Short, real trip videos per Tier 1 destination (a 30–60 s highlight of what a weekend looks like), linking to the trip page.
- Descriptions use the trip name plus "from Hyderabad", the real schedule and the trip URL.
- `/video/` exists on the site; check its indexing status before promoting it.
- **Never** present AI footage as a real trip.

## 7. E-E-A-T on the site

- **About page:** real people and real history only. No founding year beyond what HCC has stated; "EST. 2020" is in the owner-supplied logo.
- **Author on guides:** "HCC team" now. Add named trip leaders only if they agree and the facts are real.
- **Trust pages:** cancellation (live), privacy (noindex, awaiting final details), terms (hidden, awaiting approval).
- **Freshness:** dated departures and the nightly rebuild already show the site is maintained.

## 8. Measurement

After launch, track monthly:
- branded impressions in Search Console
- Google review count, from GBP (record actuals only)
- referring domains, from Search Console's Links report
- direction-request and website-click actions in GBP
