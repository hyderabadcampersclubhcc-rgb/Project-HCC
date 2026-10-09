# HCC master trip catalog: status

_Generated 2026-10-09 by `npm run catalog:audit` from src/content/trips and src/content/departures. Do not edit by hand._
_Field definitions and the intake workflow: catalog/README.md._

## Data status

Sources: owner confirmation, the HCC WhatsApp Business Catalog, and the weekendyaari.in import, which the owner approved on 9 Oct 2026 as HCC's working reference data. Only a specific missing fact is flagged (NEEDS CONFIRMATION); it does not block the trip. A page is blocked only by a CONFLICT in an essential fact, or if the owner hasn't approved it. Code: catalog/verification.mjs. Destination, hub and other pages keep their own indexing rules.

- Trip/city pages indexable in production: **36 of 39** (approved: 36; blocked by a conflict: 0)
- Usable facts (owner confirmed, catalog-verified or working reference): **440 of 546**. Owner-confirmed: 26
- Rule: A trip page (trip × city) is indexable in production when the owner has approved it (city listed in publishApproved; all previously indexable trip pages are approved) and none of its essential facts is in CONFLICT. Missing facts are flagged NEEDS CONFIRMATION in the ledger and audit but do not block the page. Pending records (status PENDING_APPROVAL, e.g. Travloger-based campsite drafts) are never live.

### Flagged facts per page (missing; not blocking)

| Page | Flagged | Conflicts |
|---|---|---|
| ananthagiri-harivillu-camping (Hyderabad) | departureDates, advance, cancellation | — |
| ananthagiri-sarpanpally-lake-camping (Hyderabad) | departureDates, advance, cancellation | — |
| ananthagiri-trance-veechika-camping (Hyderabad) | departureDates, advance, cancellation | — |
| andharban-devkund-lohagad-trek (Hyderabad) | departureDates, departureTime, accommodation | — |
| araku-vanajangi-vizag (Hyderabad) | accommodation, advance | — |
| arunachalam-pondicherry (Hyderabad) | departureDates, departureTime, accommodation | — |
| coorg-chikmagalur (Hyderabad) | accommodation, advance | — |
| coorg-chikmagalur (Bangalore) | accommodation, advance | — |
| coorg (Mysore) | departureDates, departureTime, accommodation, advance | — |
| dudhsagar-dandeli (Hyderabad) | departureDates, departureTime, accommodation, advance | — |
| gandikota-camping (Hyderabad) | departureDates, departureTime, accommodation, advance | — |
| goa (Hyderabad) | departureDates, departureTime, accommodation, advance | — |
| gokarna-dandeli-couple (Hyderabad) | accommodation, advance | — |
| gokarna-dandeli-couple (Bangalore) | accommodation, advance | — |
| gokarna-dandeli (Vijayawada) | departureTime | — |
| golden-triangle (Hyderabad) | departureTime, accommodation, advance | — |
| hampi-gokarna-murudeshwar (Hyderabad) | departureDates, departureTime, accommodation, advance | — |
| harishchandragad-kalu-trek (Hyderabad) | departureDates, departureTime, accommodation, advance | — |
| isha-ooty-coonoor (Hyderabad) | accommodation | — |
| kashmir (Srinagar) | departureTime, accommodation, advance | — |
| kerala-backwaters-beaches (Hyderabad) | departureTime, accommodation | — |
| kerala-honeymoon (Kochi) | departureTime, accommodation, advance | — |
| kerala-munnar-alleppey (Hyderabad) | departureTime, accommodation, advance | — |
| kerala-munnar-alleppey (Bangalore) | departureTime, returnTime, accommodation, advance | — |
| lonavala-matheran (Hyderabad) | departureTime, accommodation, advance | — |
| manali-kasol (Delhi) | departureTime, accommodation, advance | — |
| munnar (Hyderabad) | departureDates, departureTime, accommodation, advance | — |
| munnar (Bangalore) | departureTime, accommodation, advance | — |
| munnar (Vijayawada) | departureDates, departureTime, returnTime, accommodation, advance | — |
| narsapur-camping (Hyderabad) | returnTime, accommodation, advance | — |
| ooty-coonoor-couple (Hyderabad) | departureTime, accommodation, advance | — |
| pondicherry (Hyderabad) | departureDates, returnTime, accommodation, itinerary, advance | — |
| shimla-manali (Delhi) | departureTime, accommodation, advance | — |
| wayanad-ooty-mysore (Hyderabad) | departureTime, accommodation, advance | — |
| wayanad (Hyderabad) | accommodation, advance | — |

## Live trips × departure cities (39)

| Trip | City | Usable facts | Indexable | Price | Ref. price | Duration | Departure days | Dated departures (future) | Times | Transport (included) | Stay | Itinerary | Incl/Excl | Food | Advance | Cancel | Coordinator | Photos | FAQs | SEO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ananthagiri-camping | Hyderabad | 14/14 | ✅ | ₹1600 |  | 1N/2D | Call to check availability | none | 16:00 / return stated | Reach the campsite yourself | Campsite tents | 2 days | 5/5 | stated | ₹500 | trip | NEEDS CONFIRMATION | 4 stock | 4 | auto |
| ananthagiri-harivillu-camping | Hyderabad | 11/14 | — | ₹2000 |  | 1N/2D | Saturdays (check availability on WhatsApp) | none | 16:00 / return stated | Reach the campsite yourself | Campsite tents | 2 days | 5/4 | stated | NEEDS CONFIRMATION | site | NEEDS CONFIRMATION | 3 stock | 3 | auto |
| ananthagiri-sarpanpally-lake-camping | Hyderabad | 11/14 | — | ₹2000 |  | 1N/2D | Saturdays (check availability on WhatsApp) | none | 15:00 / return stated | Reach the campsite yourself | Campsite tents | 2 days | 5/4 | stated | NEEDS CONFIRMATION | site | NEEDS CONFIRMATION | 3 stock | 3 | auto |
| ananthagiri-trance-veechika-camping | Hyderabad | 11/14 | — | ₹2999 |  | 1N/2D | Saturdays (check availability on WhatsApp) | none | 15:00 / return stated | Reach the campsite yourself | Campsite tents | 2 days | 6/4 | stated | NEEDS CONFIRMATION | site | NEEDS CONFIRMATION | 3 stock | 3 | auto |
| andharban-devkund-lohagad-trek | Hyderabad | 11/14 | ✅ | ₹6999 | ₹8500 | 2N/3D | Weekly in the monsoon | none | return stated | Sleeper train | NEEDS CONFIRMATION | 3 days | 6/4 | stated | ₹1999 | trip | NEEDS CONFIRMATION | 4 stock | 1 | auto |
| araku-vanajangi-vizag | Hyderabad | 12/14 | ✅ | ₹6999 | ₹8500 | 2N/3D | Every Thursday from Hyderabad | 12 (2026-10-15 → 2026-12-31) | 17:30 / return stated | Sleeper train | NEEDS CONFIRMATION | 5 days | 7/4 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 1 | auto |
| arunachalam-pondicherry | Hyderabad | 11/14 | ✅ | ₹7499 | ₹8500 | 2N/3D | Weekly departures | none | return stated | Sleeper train or Semi-sleeper bus | NEEDS CONFIRMATION | 3 days | 6/3 | stated | ₹2000 | trip | yes | 4 stock | 0 | auto |
| coorg-chikmagalur | Hyderabad | 12/14 | ✅ | ₹6999 | ₹8500 | 2N/3D | Every Thursday & Friday | 24 (2026-10-09 → 2026-12-31) | Thu/Fri 7:00 PM → Mon/Tue 6:00 AM | Sleeper train | NEEDS CONFIRMATION | 5 days | 5/4 | stated | NEEDS CONFIRMATION | trip | yes | 5 stock | 1 | auto |
| coorg-chikmagalur | Bangalore | 12/14 | ✅ | ₹6999 | ₹8500 | 2N/3D | Every Friday & Saturday from Bangalore | 22 (2026-10-09 → 2026-12-19) | Fri 6:00 AM → Sun · Sat 6:00 AM → Mon ~6:00 PM | Tempo Traveller | NEEDS CONFIRMATION | 3 days | 5/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 1 | auto |
| coorg | Mysore | 10/14 | ✅ | ₹6499 | ₹9500 | 2N/3D | Weekly departures | none | return stated | Local tempo | NEEDS CONFIRMATION | 3 days | 5/4 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 0 | auto |
| dudhsagar-dandeli | Hyderabad | 10/14 | ✅ | ₹6999 | ₹8999 | 1N/2D | Weekly departures | none | return stated | Sleeper train | NEEDS CONFIRMATION | 2 days | 6/3 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 0 | auto |
| gandikota-camping | Hyderabad | 10/14 | ✅ | ₹1800 | ₹2500 | 1N/2D | Weekly departures | none | return stated | Non-AC vehicle from Hyderabad | NEEDS CONFIRMATION | 2 days | 5/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 3 stock | 0 | auto |
| goa | Hyderabad | 10/14 | ✅ | ₹7999 | ₹12000 | 2N/3D | Weekly departures | none | return stated | Sleeper train | NEEDS CONFIRMATION | 3 days | 4/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| gokarna-dandeli-couple | Hyderabad | 12/14 | ✅ | ₹18500 | ₹20000 | 2N/3D | Every Friday | 12 (2026-10-09 → 2026-12-25) | 15:45 / return stated | Sleeper train | NEEDS CONFIRMATION | 4 days | 5/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| gokarna-dandeli-couple | Bangalore | 12/14 | ✅ | ₹18500 | ₹20000 | 2N/3D | Every Friday from Bangalore | 10 (2026-10-09 → 2026-12-11) | 23:00 / return stated | Sleeper train | NEEDS CONFIRMATION | 4 days | 5/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| gokarna-dandeli | Hyderabad | 14/14 | ✅ | ₹5999 | ₹7500 | 2N/3D | Every Thursday & Friday from Hyderabad | 24 (2026-10-09 → 2026-12-31) | Thu/Fri 3:00 PM → Mon/Tue 10:00 AM | Sleeper train | Beach camp; Riverside camp | 5 days | 7/3 | stated | ₹2000 | trip | NEEDS CONFIRMATION | 5 stock | 2 | auto |
| gokarna-dandeli | Bangalore | 14/14 | ✅ | ₹5999 | ₹7500 | 2N/3D | Every Friday from Bangalore | 10 (2026-10-09 → 2026-12-11) | 23:00 / return stated | Sleeper train | Beach camp; Riverside camp | 4 days | 7/3 | stated | ₹2000 | trip | NEEDS CONFIRMATION | 5 stock | 2 | auto |
| gokarna-dandeli | Vijayawada | 13/14 | ✅ | ₹5999 | ₹7500 | 2N/3D | Every Friday from Vijayawada | 12 (2026-10-09 → 2026-12-25) | return stated | Sleeper train | Beach camp; Riverside camp | 4 days | 7/3 | stated | ₹2000 | trip | NEEDS CONFIRMATION | 5 stock | 2 | auto |
| golden-triangle | Hyderabad | 11/14 | ✅ | ₹9999 | ₹12999 | 3N/4D | Group dates on request | none | return stated | Sleeper train | NEEDS CONFIRMATION | 5 days | 6/2 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 0 | auto |
| hampi-gokarna-murudeshwar | Hyderabad | 10/14 | ✅ | ₹8999 | ₹12500 | 3N/4D | Weekly departures | none | return stated | Sleeper bus | NEEDS CONFIRMATION | 5 days | 4/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 2 | auto |
| harishchandragad-kalu-trek | Hyderabad | 10/14 | ✅ | ₹6999 | ₹8999 | 2N/3D | Weekly in the monsoon | none | return stated | Sleeper train | NEEDS CONFIRMATION | 5 days | 7/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 3 stock | 2 | auto |
| isha-ooty-coonoor | Hyderabad | 13/14 | ✅ | ₹7999 | ₹9500 | 2N/3D | Every Thursday & Friday from Hyderabad | 24 (2026-10-09 → 2026-12-31) | Thu/Fri 7:00 PM → Mon/Tue 6:00 AM | Sleeper train | NEEDS CONFIRMATION | 3 days | 6/4 | stated | ₹2000 | trip | yes | 4 stock | 1 | auto |
| kashmir | Srinagar | 11/14 | ✅ | ₹14999 | ₹22000 | 4N/5D | Group dates on request | none | return stated | Local transport from Srinagar | NEEDS CONFIRMATION | 5 days | 6/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| kerala-backwaters-beaches | Hyderabad | 12/14 | ✅ | ₹13999 | ₹16000 | 5N/6D | Group dates on request | none | return stated | Sleeper train | NEEDS CONFIRMATION | 6 days | 7/3 | stated | ₹2000 | trip | yes | 5 stock | 0 | auto |
| kerala-honeymoon | Kochi | 11/14 | ✅ | ₹22500 | ₹24000 | 3N/4D | Your dates, on request | none | return stated | Private cab | NEEDS CONFIRMATION | 4 days | 3/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| kerala-munnar-alleppey | Hyderabad | 11/14 | ✅ | ₹12999 | ₹16999 | 3N/4D | Group dates on request | none | return stated | Sleeper train | NEEDS CONFIRMATION | 4 days | 6/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 0 | auto |
| kerala-munnar-alleppey | Bangalore | 10/14 | ✅ | ₹12999 | ₹16999 | 3N/4D | Group dates on request | 2 (2026-10-16 → 2026-11-06) | NEEDS CONFIRMATION | Sleeper train | NEEDS CONFIRMATION | 4 days (shared) | 6/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 0 | auto |
| lonavala-matheran | Hyderabad | 11/14 | ✅ | ₹7999 | ₹8500 | 2N/3D | Every Thursday from Hyderabad | 12 (2026-10-15 → 2026-12-31) | return stated | Sleeper train | NEEDS CONFIRMATION | 3 days | 7/6 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 3 | auto |
| manali-kasol | Delhi | 11/14 | ✅ | ₹12000 | ₹16000 | 3N/4D | Group dates on request | none | return stated | Volvo semi-sleeper from Delhi | NEEDS CONFIRMATION | 6 days | 7/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 1 | auto |
| munnar | Hyderabad | 10/14 | ✅ | ₹8999 | ₹12500 | 2N/3D | Weekly departures | none | return stated | Sleeper train | NEEDS CONFIRMATION | 3 days | 6/4 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 0 | auto |
| munnar | Bangalore | 11/14 | ✅ | ₹8999 | ₹12500 | 2N/3D | Weekly departures | 11 (2026-10-09 → 2026-12-18) | return stated | Sleeper train | NEEDS CONFIRMATION | 3 days (shared) | 6/4 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 0 | auto |
| munnar | Vijayawada | 9/14 | ✅ | ₹8999 | ₹12500 | 2N/3D | Weekly departures | none | NEEDS CONFIRMATION | Sleeper train | NEEDS CONFIRMATION | 3 days (shared) | 6/4 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 0 | auto |
| narsapur-camping | Hyderabad | 11/14 | ✅ | ₹1199 | ₹2500 | 1N/2D | Every Saturday | 12 (2026-10-10 → 2026-12-26) | 16:00 | Reach the campsite yourself | NEEDS CONFIRMATION | 2 days | 3/3 | stated | NEEDS CONFIRMATION | site | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| ooty-coonoor-couple | Hyderabad | 11/14 | ✅ | ₹18500 | ₹22500 | 2N/3D | Your dates, on request | none | return stated | Sleeper train | NEEDS CONFIRMATION | 3 days | 4/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| ooty-coonoor | Hyderabad | 14/14 | ✅ | ₹7999 | ₹9500 | 2N/3D | Every Thursday & Friday from Hyderabad | 24 (2026-10-09 → 2026-12-31) | Thu/Fri 7:00 PM → Mon/Tue 6:00 AM | Sleeper train | Hotel / homestay | 4 days | 6/5 | stated | ₹2000 | trip | yes | 3 stock, 3 AI | 2 | auto |
| pondicherry | Hyderabad | 9/14 | ✅ | ₹7199 | ₹9999 | 2N/3D | Weekly departures | none | 17:00 | Sleeper train | NEEDS CONFIRMATION | NEEDS CONFIRMATION | 5/3 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 3 | auto |
| shimla-manali | Delhi | 11/14 | ✅ | ₹11999 | ₹14000 | 4N/5D | Group dates on request | none | return stated | Volvo semi-sleeper from Delhi | NEEDS CONFIRMATION | 6 days | 4/4 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 4 stock | 0 | auto |
| wayanad-ooty-mysore | Hyderabad | 11/14 | ✅ | ₹12999 | ₹18999 | 4N/5D | Group dates on request | none | return stated | Sleeper train | NEEDS CONFIRMATION | 5 days | 7/3 | stated | NEEDS CONFIRMATION | trip | NEEDS CONFIRMATION | 5 stock | 0 | auto |
| wayanad | Hyderabad | 12/14 | ✅ | ₹7999 | ₹11500 | 2N/3D | Every Thursday from Hyderabad | 12 (2026-10-15 → 2026-12-31) | 19:00 / return stated | Sleeper train | NEEDS CONFIRMATION | 3 days | 5/3 | stated | NEEDS CONFIRMATION | trip | yes | 4 stock | 0 | auto |

Photos: "HCC" = HCC's own photos (no third-party credit); "stock" = licensed Wikimedia/stock photos; "AI" = labelled AI illustrations.

## NEEDS CONFIRMATION (331)

### Photos (39)

- **ananthagiri-camping** (hyderabad): no HCC trip photos yet (4 stock)
- **ananthagiri-harivillu-camping** (hyderabad): no HCC trip photos yet (3 stock)
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): no HCC trip photos yet (3 stock)
- **ananthagiri-trance-veechika-camping** (hyderabad): no HCC trip photos yet (3 stock)
- **andharban-devkund-lohagad-trek** (hyderabad): no HCC trip photos yet (4 stock)
- **araku-vanajangi-vizag** (hyderabad): no HCC trip photos yet (4 stock)
- **arunachalam-pondicherry** (hyderabad): no HCC trip photos yet (4 stock)
- **coorg-chikmagalur** (hyderabad): no HCC trip photos yet (5 stock)
- **coorg-chikmagalur** (bangalore): no HCC trip photos yet (5 stock)
- **coorg** (mysore): no HCC trip photos yet (4 stock)
- **dudhsagar-dandeli** (hyderabad): no HCC trip photos yet (4 stock)
- **gandikota-camping** (hyderabad): no HCC trip photos yet (3 stock)
- **goa** (hyderabad): no HCC trip photos yet (4 stock)
- **gokarna-dandeli-couple** (hyderabad): no HCC trip photos yet (4 stock)
- **gokarna-dandeli-couple** (bangalore): no HCC trip photos yet (4 stock)
- **gokarna-dandeli** (hyderabad): no HCC trip photos yet (5 stock)
- **gokarna-dandeli** (bangalore): no HCC trip photos yet (5 stock)
- **gokarna-dandeli** (vijayawada): no HCC trip photos yet (5 stock)
- **golden-triangle** (hyderabad): no HCC trip photos yet (5 stock)
- **hampi-gokarna-murudeshwar** (hyderabad): no HCC trip photos yet (5 stock)
- **harishchandragad-kalu-trek** (hyderabad): no HCC trip photos yet (3 stock)
- **isha-ooty-coonoor** (hyderabad): no HCC trip photos yet (4 stock)
- **kashmir** (srinagar): no HCC trip photos yet (4 stock)
- **kerala-backwaters-beaches** (hyderabad): no HCC trip photos yet (5 stock)
- **kerala-honeymoon** (kochi): no HCC trip photos yet (4 stock)
- **kerala-munnar-alleppey** (hyderabad): no HCC trip photos yet (5 stock)
- **kerala-munnar-alleppey** (bangalore): no HCC trip photos yet (5 stock)
- **lonavala-matheran** (hyderabad): no HCC trip photos yet (4 stock)
- **manali-kasol** (delhi): no HCC trip photos yet (5 stock)
- **munnar** (hyderabad): no HCC trip photos yet (4 stock)
- **munnar** (bangalore): no HCC trip photos yet (4 stock)
- **munnar** (vijayawada): no HCC trip photos yet (4 stock)
- **narsapur-camping** (hyderabad): no HCC trip photos yet (4 stock)
- **ooty-coonoor-couple** (hyderabad): no HCC trip photos yet (4 stock)
- **ooty-coonoor** (hyderabad): no HCC trip photos yet (3 stock, 3 AI)
- **pondicherry** (hyderabad): no HCC trip photos yet (4 stock)
- **shimla-manali** (delhi): no HCC trip photos yet (4 stock)
- **wayanad-ooty-mysore** (hyderabad): no HCC trip photos yet (5 stock)
- **wayanad** (hyderabad): no HCC trip photos yet (4 stock)

### Departure dates (39)

- **ananthagiri-camping** (hyderabad): no dated departures (recurrence text: "Call to check availability")
- **ananthagiri-harivillu-camping** (hyderabad): no dated departures (recurrence text: "Saturdays (check availability on WhatsApp)")
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): no dated departures (recurrence text: "Saturdays (check availability on WhatsApp)")
- **ananthagiri-trance-veechika-camping** (hyderabad): no dated departures (recurrence text: "Saturdays (check availability on WhatsApp)")
- **andharban-devkund-lohagad-trek** (hyderabad): no dated departures (recurrence text: "Weekly in the monsoon")
- **araku-vanajangi-vizag** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed
- **arunachalam-pondicherry** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **coorg-chikmagalur** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed
- **coorg-chikmagalur** (bangalore): dated departures end on 2026-12-19; schedule for 2027 needed
- **coorg** (mysore): no dated departures (recurrence text: "Weekly departures")
- **dudhsagar-dandeli** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **gandikota-camping** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **goa** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **gokarna-dandeli-couple** (hyderabad): dated departures end on 2026-12-25; schedule for 2027 needed
- **gokarna-dandeli-couple** (bangalore): dated departures end on 2026-12-11; schedule for 2027 needed
- **gokarna-dandeli** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed
- **gokarna-dandeli** (bangalore): dated departures end on 2026-12-11; schedule for 2027 needed
- **gokarna-dandeli** (vijayawada): dated departures end on 2026-12-25; schedule for 2027 needed
- **golden-triangle** (hyderabad): no dated departures (recurrence text: "Group dates on request")
- **hampi-gokarna-murudeshwar** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **harishchandragad-kalu-trek** (hyderabad): no dated departures (recurrence text: "Weekly in the monsoon")
- **isha-ooty-coonoor** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed
- **kashmir** (srinagar): no dated departures (recurrence text: "Group dates on request")
- **kerala-backwaters-beaches** (hyderabad): no dated departures (recurrence text: "Group dates on request")
- **kerala-honeymoon** (kochi): no dated departures (recurrence text: "Your dates, on request")
- **kerala-munnar-alleppey** (hyderabad): no dated departures (recurrence text: "Group dates on request")
- **kerala-munnar-alleppey** (bangalore): dated departures end on 2026-11-06; schedule for 2027 needed
- **lonavala-matheran** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed
- **manali-kasol** (delhi): no dated departures (recurrence text: "Group dates on request")
- **munnar** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **munnar** (bangalore): dated departures end on 2026-12-18; schedule for 2027 needed
- **munnar** (vijayawada): no dated departures (recurrence text: "Weekly departures")
- **narsapur-camping** (hyderabad): dated departures end on 2026-12-26; schedule for 2027 needed
- **ooty-coonoor-couple** (hyderabad): no dated departures (recurrence text: "Your dates, on request")
- **ooty-coonoor** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed
- **pondicherry** (hyderabad): no dated departures (recurrence text: "Weekly departures")
- **shimla-manali** (delhi): no dated departures (recurrence text: "Group dates on request")
- **wayanad-ooty-mysore** (hyderabad): no dated departures (recurrence text: "Group dates on request")
- **wayanad** (hyderabad): dated departures end on 2026-12-31; schedule for 2027 needed

### Reference price (35)

- **andharban-devkund-lohagad-trek** (hyderabad): crossed-out price ₹8500 is shown; confirm it is a genuine previous price
- **araku-vanajangi-vizag** (hyderabad): crossed-out price ₹8500 is shown; confirm it is a genuine previous price
- **arunachalam-pondicherry** (hyderabad): crossed-out price ₹8500 is shown; confirm it is a genuine previous price
- **coorg-chikmagalur** (hyderabad): crossed-out price ₹8500 is shown; confirm it is a genuine previous price
- **coorg-chikmagalur** (bangalore): crossed-out price ₹8500 is shown; confirm it is a genuine previous price
- **coorg** (mysore): crossed-out price ₹9500 is shown; confirm it is a genuine previous price
- **dudhsagar-dandeli** (hyderabad): crossed-out price ₹8999 is shown; confirm it is a genuine previous price
- **gandikota-camping** (hyderabad): crossed-out price ₹2500 is shown; confirm it is a genuine previous price
- **goa** (hyderabad): crossed-out price ₹12000 is shown; confirm it is a genuine previous price
- **gokarna-dandeli-couple** (hyderabad): crossed-out price ₹20000 is shown; confirm it is a genuine previous price
- **gokarna-dandeli-couple** (bangalore): crossed-out price ₹20000 is shown; confirm it is a genuine previous price
- **gokarna-dandeli** (hyderabad): crossed-out price ₹7500 is shown; confirm it is a genuine previous price
- **gokarna-dandeli** (bangalore): crossed-out price ₹7500 is shown; confirm it is a genuine previous price
- **gokarna-dandeli** (vijayawada): crossed-out price ₹7500 is shown; confirm it is a genuine previous price
- **golden-triangle** (hyderabad): crossed-out price ₹12999 is shown; confirm it is a genuine previous price
- **hampi-gokarna-murudeshwar** (hyderabad): crossed-out price ₹12500 is shown; confirm it is a genuine previous price
- **harishchandragad-kalu-trek** (hyderabad): crossed-out price ₹8999 is shown; confirm it is a genuine previous price
- **isha-ooty-coonoor** (hyderabad): crossed-out price ₹9500 is shown; confirm it is a genuine previous price
- **kashmir** (srinagar): crossed-out price ₹22000 is shown; confirm it is a genuine previous price
- **kerala-backwaters-beaches** (hyderabad): crossed-out price ₹16000 is shown; confirm it is a genuine previous price
- **kerala-honeymoon** (kochi): crossed-out price ₹24000 is shown; confirm it is a genuine previous price
- **kerala-munnar-alleppey** (hyderabad): crossed-out price ₹16999 is shown; confirm it is a genuine previous price
- **kerala-munnar-alleppey** (bangalore): crossed-out price ₹16999 is shown; confirm it is a genuine previous price
- **lonavala-matheran** (hyderabad): crossed-out price ₹8500 is shown; confirm it is a genuine previous price
- **manali-kasol** (delhi): crossed-out price ₹16000 is shown; confirm it is a genuine previous price
- **munnar** (hyderabad): crossed-out price ₹12500 is shown; confirm it is a genuine previous price
- **munnar** (bangalore): crossed-out price ₹12500 is shown; confirm it is a genuine previous price
- **munnar** (vijayawada): crossed-out price ₹12500 is shown; confirm it is a genuine previous price
- **narsapur-camping** (hyderabad): crossed-out price ₹2500 is shown; confirm it is a genuine previous price
- **ooty-coonoor-couple** (hyderabad): crossed-out price ₹22500 is shown; confirm it is a genuine previous price
- **ooty-coonoor** (hyderabad): crossed-out price ₹9500 is shown; confirm it is a genuine previous price
- **pondicherry** (hyderabad): crossed-out price ₹9999 is shown; confirm it is a genuine previous price
- **shimla-manali** (delhi): crossed-out price ₹14000 is shown; confirm it is a genuine previous price
- **wayanad-ooty-mysore** (hyderabad): crossed-out price ₹18999 is shown; confirm it is a genuine previous price
- **wayanad** (hyderabad): crossed-out price ₹11500 is shown; confirm it is a genuine previous price

### Suitable for (34)

- **andharban-devkund-lohagad-trek** (hyderabad): not stated
- **araku-vanajangi-vizag** (hyderabad): not stated
- **arunachalam-pondicherry** (hyderabad): not stated
- **coorg-chikmagalur** (hyderabad): not stated
- **coorg-chikmagalur** (bangalore): not stated
- **coorg** (mysore): not stated
- **dudhsagar-dandeli** (hyderabad): not stated
- **gandikota-camping** (hyderabad): not stated
- **goa** (hyderabad): not stated
- **gokarna-dandeli-couple** (hyderabad): not stated
- **gokarna-dandeli-couple** (bangalore): not stated
- **gokarna-dandeli** (hyderabad): not stated
- **gokarna-dandeli** (bangalore): not stated
- **gokarna-dandeli** (vijayawada): not stated
- **golden-triangle** (hyderabad): not stated
- **hampi-gokarna-murudeshwar** (hyderabad): not stated
- **harishchandragad-kalu-trek** (hyderabad): not stated
- **isha-ooty-coonoor** (hyderabad): not stated
- **kashmir** (srinagar): not stated
- **kerala-backwaters-beaches** (hyderabad): not stated
- **kerala-honeymoon** (kochi): not stated
- **kerala-munnar-alleppey** (hyderabad): not stated
- **kerala-munnar-alleppey** (bangalore): not stated
- **lonavala-matheran** (hyderabad): not stated
- **manali-kasol** (delhi): not stated
- **munnar** (hyderabad): not stated
- **munnar** (bangalore): not stated
- **munnar** (vijayawada): not stated
- **narsapur-camping** (hyderabad): not stated
- **ooty-coonoor-couple** (hyderabad): not stated
- **pondicherry** (hyderabad): not stated
- **shimla-manali** (delhi): not stated
- **wayanad-ooty-mysore** (hyderabad): not stated
- **wayanad** (hyderabad): not stated

### Accommodation (31)

- **andharban-devkund-lohagad-trek** (hyderabad): no stay type
- **araku-vanajangi-vizag** (hyderabad): no stay type
- **arunachalam-pondicherry** (hyderabad): no stay type
- **coorg-chikmagalur** (hyderabad): no stay type
- **coorg-chikmagalur** (bangalore): no stay type
- **coorg** (mysore): no stay type
- **dudhsagar-dandeli** (hyderabad): no stay type
- **gandikota-camping** (hyderabad): no stay type
- **goa** (hyderabad): no stay type
- **gokarna-dandeli-couple** (hyderabad): no stay type
- **gokarna-dandeli-couple** (bangalore): no stay type
- **golden-triangle** (hyderabad): no stay type
- **hampi-gokarna-murudeshwar** (hyderabad): no stay type
- **harishchandragad-kalu-trek** (hyderabad): no stay type
- **isha-ooty-coonoor** (hyderabad): no stay type
- **kashmir** (srinagar): no stay type
- **kerala-backwaters-beaches** (hyderabad): no stay type
- **kerala-honeymoon** (kochi): no stay type
- **kerala-munnar-alleppey** (hyderabad): no stay type
- **kerala-munnar-alleppey** (bangalore): no stay type
- **lonavala-matheran** (hyderabad): no stay type
- **manali-kasol** (delhi): no stay type
- **munnar** (hyderabad): no stay type
- **munnar** (bangalore): no stay type
- **munnar** (vijayawada): no stay type
- **narsapur-camping** (hyderabad): no stay type
- **ooty-coonoor-couple** (hyderabad): no stay type
- **pondicherry** (hyderabad): no stay type
- **shimla-manali** (delhi): no stay type
- **wayanad-ooty-mysore** (hyderabad): no stay type
- **wayanad** (hyderabad): no stay type

### Group size (30)

- **ananthagiri-camping** (hyderabad): not stated
- **ananthagiri-harivillu-camping** (hyderabad): not stated
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): not stated
- **ananthagiri-trance-veechika-camping** (hyderabad): not stated
- **andharban-devkund-lohagad-trek** (hyderabad): not stated
- **araku-vanajangi-vizag** (hyderabad): not stated
- **arunachalam-pondicherry** (hyderabad): not stated
- **coorg** (mysore): not stated
- **dudhsagar-dandeli** (hyderabad): not stated
- **gandikota-camping** (hyderabad): not stated
- **goa** (hyderabad): not stated
- **gokarna-dandeli-couple** (hyderabad): not stated
- **gokarna-dandeli-couple** (bangalore): not stated
- **golden-triangle** (hyderabad): not stated
- **hampi-gokarna-murudeshwar** (hyderabad): not stated
- **harishchandragad-kalu-trek** (hyderabad): not stated
- **kerala-backwaters-beaches** (hyderabad): not stated
- **kerala-honeymoon** (kochi): not stated
- **kerala-munnar-alleppey** (hyderabad): not stated
- **kerala-munnar-alleppey** (bangalore): not stated
- **lonavala-matheran** (hyderabad): not stated
- **manali-kasol** (delhi): not stated
- **munnar** (hyderabad): not stated
- **munnar** (bangalore): not stated
- **munnar** (vijayawada): not stated
- **narsapur-camping** (hyderabad): not stated
- **ooty-coonoor-couple** (hyderabad): not stated
- **pondicherry** (hyderabad): not stated
- **shimla-manali** (delhi): not stated
- **wayanad-ooty-mysore** (hyderabad): not stated

### Booking / advance (30)

- **ananthagiri-harivillu-camping** (hyderabad): no advance amount
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): no advance amount
- **ananthagiri-trance-veechika-camping** (hyderabad): no advance amount
- **araku-vanajangi-vizag** (hyderabad): no advance amount
- **coorg-chikmagalur** (hyderabad): no advance amount
- **coorg-chikmagalur** (bangalore): no advance amount
- **coorg** (mysore): no advance amount
- **dudhsagar-dandeli** (hyderabad): no advance amount
- **gandikota-camping** (hyderabad): no advance amount
- **goa** (hyderabad): no advance amount
- **gokarna-dandeli-couple** (hyderabad): no advance amount
- **gokarna-dandeli-couple** (bangalore): no advance amount
- **golden-triangle** (hyderabad): no advance amount
- **hampi-gokarna-murudeshwar** (hyderabad): no advance amount
- **harishchandragad-kalu-trek** (hyderabad): no advance amount
- **kashmir** (srinagar): no advance amount
- **kerala-honeymoon** (kochi): no advance amount
- **kerala-munnar-alleppey** (hyderabad): no advance amount
- **kerala-munnar-alleppey** (bangalore): no advance amount
- **lonavala-matheran** (hyderabad): no advance amount
- **manali-kasol** (delhi): no advance amount
- **munnar** (hyderabad): no advance amount
- **munnar** (bangalore): no advance amount
- **munnar** (vijayawada): no advance amount
- **narsapur-camping** (hyderabad): no advance amount
- **ooty-coonoor-couple** (hyderabad): no advance amount
- **pondicherry** (hyderabad): no advance amount
- **shimla-manali** (delhi): no advance amount
- **wayanad-ooty-mysore** (hyderabad): no advance amount
- **wayanad** (hyderabad): no advance amount

### Trip coordinator (25)

- **ananthagiri-camping** (hyderabad): inclusions do not mention a trip captain/coordinator
- **ananthagiri-harivillu-camping** (hyderabad): inclusions do not mention a trip captain/coordinator
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): inclusions do not mention a trip captain/coordinator
- **ananthagiri-trance-veechika-camping** (hyderabad): inclusions do not mention a trip captain/coordinator
- **andharban-devkund-lohagad-trek** (hyderabad): inclusions do not mention a trip captain/coordinator
- **coorg-chikmagalur** (bangalore): inclusions do not mention a trip captain/coordinator
- **gandikota-camping** (hyderabad): inclusions do not mention a trip captain/coordinator
- **goa** (hyderabad): inclusions do not mention a trip captain/coordinator
- **gokarna-dandeli-couple** (hyderabad): inclusions do not mention a trip captain/coordinator
- **gokarna-dandeli-couple** (bangalore): inclusions do not mention a trip captain/coordinator
- **gokarna-dandeli** (hyderabad): inclusions do not mention a trip captain/coordinator
- **gokarna-dandeli** (bangalore): inclusions do not mention a trip captain/coordinator
- **gokarna-dandeli** (vijayawada): inclusions do not mention a trip captain/coordinator
- **golden-triangle** (hyderabad): inclusions do not mention a trip captain/coordinator
- **hampi-gokarna-murudeshwar** (hyderabad): inclusions do not mention a trip captain/coordinator
- **harishchandragad-kalu-trek** (hyderabad): inclusions do not mention a trip captain/coordinator
- **kashmir** (srinagar): inclusions do not mention a trip captain/coordinator
- **kerala-honeymoon** (kochi): inclusions do not mention a trip captain/coordinator
- **kerala-munnar-alleppey** (hyderabad): inclusions do not mention a trip captain/coordinator
- **kerala-munnar-alleppey** (bangalore): inclusions do not mention a trip captain/coordinator
- **manali-kasol** (delhi): inclusions do not mention a trip captain/coordinator
- **narsapur-camping** (hyderabad): inclusions do not mention a trip captain/coordinator
- **ooty-coonoor-couple** (hyderabad): inclusions do not mention a trip captain/coordinator
- **shimla-manali** (delhi): inclusions do not mention a trip captain/coordinator
- **wayanad-ooty-mysore** (hyderabad): inclusions do not mention a trip captain/coordinator

### Open item (24)

- **ananthagiri-harivillu-camping** (hyderabad): Advance amount and payment terms
- **ananthagiri-harivillu-camping** (hyderabad): Cancellation terms for this campsite
- **ananthagiri-harivillu-camping** (hyderabad): GST (reference pages say +5%; HCC price is shown without GST)
- **ananthagiri-harivillu-camping** (hyderabad): Children policy
- **ananthagiri-harivillu-camping** (hyderabad): Dated departures (reference: Saturdays)
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): Advance amount and payment terms
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): Cancellation terms for this campsite
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): GST (reference pages say +5%; HCC price is shown without GST)
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): Children policy
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): Dated departures (reference: Saturdays)
- **ananthagiri-trance-veechika-camping** (hyderabad): Advance amount and payment terms
- **ananthagiri-trance-veechika-camping** (hyderabad): Cancellation terms for this campsite
- **ananthagiri-trance-veechika-camping** (hyderabad): GST (reference pages say +5%; HCC price is shown without GST)
- **ananthagiri-trance-veechika-camping** (hyderabad): Children policy
- **ananthagiri-trance-veechika-camping** (hyderabad): Dated departures (reference: Saturdays)
- **gokarna-dandeli-couple** (bangalore): Arrival time back in Bangalore
- **gokarna-dandeli** (bangalore): Arrival time back in Bangalore
- **gokarna-dandeli** (bangalore): Whether the 3AC upgrade price (+₹1,700) is the same from Bangalore
- **kerala-munnar-alleppey** (bangalore): Bangalore departure station
- **kerala-munnar-alleppey** (bangalore): Bangalore departure time
- **kerala-munnar-alleppey** (bangalore): Return time from Kochi and arrival time back in Bangalore
- **munnar** (bangalore): Bangalore departure station
- **munnar** (bangalore): Bangalore departure time
- **munnar** (bangalore): Arrival time back in Bangalore (data says the next morning)

### Departure point & time (24)

- **andharban-devkund-lohagad-trek** (hyderabad): no pickup point
- **arunachalam-pondicherry** (hyderabad): no pickup point
- **coorg** (mysore): no pickup point
- **dudhsagar-dandeli** (hyderabad): no pickup point
- **gandikota-camping** (hyderabad): no pickup point
- **goa** (hyderabad): no pickup point
- **gokarna-dandeli** (vijayawada): no pickup point
- **golden-triangle** (hyderabad): no pickup point
- **hampi-gokarna-murudeshwar** (hyderabad): no pickup point
- **harishchandragad-kalu-trek** (hyderabad): no pickup point
- **isha-ooty-coonoor** (hyderabad): no pickup point
- **kashmir** (srinagar): no pickup point
- **kerala-backwaters-beaches** (hyderabad): no pickup point
- **kerala-honeymoon** (kochi): no pickup point
- **kerala-munnar-alleppey** (hyderabad): no pickup point
- **kerala-munnar-alleppey** (bangalore): no pickup point
- **lonavala-matheran** (hyderabad): no pickup point
- **manali-kasol** (delhi): no pickup point
- **munnar** (hyderabad): no pickup point
- **munnar** (bangalore): no pickup point
- **munnar** (vijayawada): no pickup point
- **ooty-coonoor-couple** (hyderabad): no pickup point
- **shimla-manali** (delhi): no pickup point
- **wayanad-ooty-mysore** (hyderabad): no pickup point

### Inclusions (6)

- **gokarna-dandeli-couple** (bangalore): uses the Hyderabad inclusions; confirm for Bangalore
- **gokarna-dandeli** (bangalore): uses the Hyderabad inclusions; confirm for Bangalore
- **gokarna-dandeli** (vijayawada): uses the Hyderabad inclusions; confirm for Vijayawada
- **kerala-munnar-alleppey** (bangalore): uses the Hyderabad inclusions; confirm for Bangalore
- **munnar** (bangalore): uses the Hyderabad inclusions; confirm for Bangalore
- **munnar** (vijayawada): uses the Hyderabad inclusions; confirm for Vijayawada

### Cancellation (4)

- **ananthagiri-harivillu-camping** (hyderabad): no trip-specific summary (site-wide policy applies)
- **ananthagiri-sarpanpally-lake-camping** (hyderabad): no trip-specific summary (site-wide policy applies)
- **ananthagiri-trance-veechika-camping** (hyderabad): no trip-specific summary (site-wide policy applies)
- **narsapur-camping** (hyderabad): no trip-specific summary (site-wide policy applies)

### Return time (4)

- **kerala-munnar-alleppey** (bangalore): not stated
- **munnar** (vijayawada): not stated
- **narsapur-camping** (hyderabad): not stated
- **pondicherry** (hyderabad): not stated

### Departure days (3)

- **kerala-munnar-alleppey** (bangalore): uses the trip-level "Group dates on request"; confirm it applies from Bangalore
- **munnar** (bangalore): uses the trip-level "Weekly departures"; confirm it applies from Bangalore
- **munnar** (vijayawada): uses the trip-level "Weekly departures"; confirm it applies from Vijayawada

### Itinerary (3)

- **kerala-munnar-alleppey** (bangalore): uses the Hyderabad itinerary; confirm or add a Bangalore itinerary
- **munnar** (bangalore): uses the Hyderabad itinerary; confirm or add a Bangalore itinerary
- **munnar** (vijayawada): uses the Hyderabad itinerary; confirm or add a Vijayawada itinerary

## Duplicate trips

None (no two live trips share a title and departure city).

## WhatsApp Business Catalog intake (2)

### WA-001: Shirdi + 3 Jyotirlingas Special
- Classification: **NEW_TRIP** · Status: **PENDING_APPROVAL** · Received: 2026-10-09
- Possible existing matches: none
- NEEDS CONFIRMATION: destination, departureCity, duration, referencePrice, departureDays, departureDates, departureTime, returnTime, transport, accommodation, itinerary, inclusions, exclusions, difficulty, food, advance, cancellation, coordinator, photos

### WA-002: Ujjain & Omkareshwar Jyotirlingas Tour
- Classification: **NEW_TRIP** · Status: **PENDING_APPROVAL** · Received: 2026-10-09
- Possible existing matches: none
- NEEDS CONFIRMATION: destination, departureCity, duration, referencePrice, departureDays, departureDates, departureTime, returnTime, transport, accommodation, itinerary, inclusions, exclusions, difficulty, food, advance, cancellation, coordinator, photos

