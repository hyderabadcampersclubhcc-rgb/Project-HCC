---
# SAMPLE CONTENT: illustrates the data model and component states in /styleguide/ and
# /preview/trip/. Not shown on public pages. Replace with HCC's real itinerary, prices and policies.
title: Ooty & Coonoor
tagline: Tea-estate walks, Nilgiri viewpoints and a slow Sunday in Coonoor.
tripTypes: [weekend]
destinations: [ooty, coonoor]
durationNights: 2
durationDays: 3
difficulty: easy
groupSize: { min: 12, max: 30 }
ageRange: 18–45
origins:
  - city: hyderabad
    label: Hyderabad
    pickupPoints:
      - { name: Kacheguda Railway Station, time: '18:30', note: 'Sample: meet the coordinator at the main entrance' }
      - { name: Secunderabad Junction, time: '19:00', note: 'Sample: platform shared on WhatsApp' }
    outbound: 'Sample: overnight sleeper train on Friday evening'
    return: 'Sample: overnight train on Sunday, back Monday morning'
transportOptions:
  - { id: sl, label: Sleeper train, mode: train, class: Sleeper, priceDelta: 0 }
  - { id: 3a, label: 3AC train, mode: train, class: 3AC, priceDelta: 1200 }
stayOptions:
  - { id: quad, label: Quad sharing, sharing: 4, priceDelta: 0 }
  - { id: triple, label: Triple sharing, sharing: 3, priceDelta: 500 }
  - { id: twin, label: Twin sharing, sharing: 2, priceDelta: 1300 }
basePrice: 6999
originalPrice: 7999
advanceAmount: 2000
gstPercent: 5
highlights:
  - Tea-estate walk with a factory visit
  - Doddabetta & Lamb's Rock viewpoints
  - Nilgiri toy train
  - Campfire evening
inclusions:
  - { text: 'Sample: return train tickets (class as selected)', icon: train, showOnCard: true, cardLabel: Train }
  - { text: 'Sample: 2 nights homestay, room sharing as selected', icon: bed, showOnCard: true, cardLabel: Stays }
  - { text: 'Sample: 2 breakfasts and 1 dinner', icon: food, showOnCard: true, cardLabel: Meals }
  - { text: 'Sample: sightseeing by cab as per itinerary', icon: compass, showOnCard: true, cardLabel: Sightseeing }
  - { text: Nilgiri toy train ride, icon: train, conditional: true, fallback: Cab transfer up the ghat }
  - { text: 'Sample: trip coordinator', icon: users }
exclusions:
  - Lunch on all days
  - Entry tickets
  - Personal expenses
  - 'GST (5%), shown in the price summary'
itinerary:
  - { day: 0, title: Depart Hyderabad, description: 'Sample: board the overnight train with the group. Your coordinator meets everyone at the pickup point.', meals: [] }
  - { day: 1, title: Coonoor tea country, description: "Sample: tea-estate walk, factory visit and the Lamb's Rock viewpoint. Evening campfire at the homestay.", meals: [breakfast, dinner], stay: Homestay, Ooty }
  - { day: 2, title: Ooty and return, description: 'Sample: Doddabetta peak, Ooty lake and the botanical garden, then the overnight train home.', meals: [breakfast] }
  - { day: 3, title: Back in Hyderabad, description: 'Sample: arrive Monday morning.', meals: [] }
stays:
  - { type: Homestay, location: Ooty, washroom: attached, description: 'Sample: family-run homestay 10 minutes from the lake. Hot water, Wi-Fi in common areas.' }
thingsToCarry:
  - Warm jacket (nights drop to 10°C)
  - Comfortable walking shoes
  - Government photo ID (needed on the train)
  - Power bank
importantInfo:
  - 'Sample: train class depends on availability at booking; confirmed before you pay the balance.'
  - 'Sample: itinerary order may change with weather.'
suitableFor:
  - First-time group travellers
  - Solo travellers
  - Easy walkers
notSuitableFor:
  - Travellers looking for adventure activities
cancellationPolicy: 'Sample policy summary. HCC to supply the real cancellation terms.'
faqs:
  - { q: "Can I join if I'm travelling alone?", a: 'Sample answer. HCC to supply.' }
  - { q: How much do I pay to reserve a seat?, a: 'Sample answer. HCC to supply.' }
  - { q: Is the toy train guaranteed?, a: 'Sample answer: it is subject to availability; if unavailable we transfer you by cab.' }
featured: true
featuredStory: Overnight train, two days in tea country and a campfire with new friends. Back at your desk on Monday morning.
sortOrder: 10
primaryKeyword: ooty trip from hyderabad
legacyPaths: ['/ooty-coonoor/', '/isha-ooty-coonoor/']
status: live
sample: true
---

**Sample overview copy.** This is where HCC tells the trip's story in two or three short paragraphs: what the weekend feels like, who it suits, and what makes this itinerary different. It is written once in the CMS and rendered here as real, crawlable text.

The overview is unique per trip, so every trip page has its own content rather than a template with the destination name swapped.
