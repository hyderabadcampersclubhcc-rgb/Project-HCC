---
# SAMPLE CONTENT: illustrates the data model and component states in /styleguide/.
# Not shown on public pages. Replace with HCC's real itinerary, prices and policies.
title: Ooty & Coonoor
tagline: Tea-estate walks, Nilgiri viewpoints and a slow Sunday in Coonoor.
tripTypes: [weekend]
destinations: [ooty, coonoor]
durationNights: 2
durationDays: 3
difficulty: easy
groupSize: { min: 12, max: 30 }
origins:
  - city: hyderabad
    label: Hyderabad
    pickupPoints:
      - { name: Kacheguda Railway Station, time: '18:30', note: Meet the coordinator at the main entrance }
    outbound: Overnight sleeper train on Friday evening
    return: Overnight train on Sunday, back Monday morning
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
  - { text: Train, icon: train, showOnCard: true }
  - { text: Stays, icon: bed, showOnCard: true }
  - { text: Meals, icon: food, showOnCard: true }
  - { text: Sightseeing, icon: compass, showOnCard: true }
  - { text: Nilgiri toy train ride, icon: train, conditional: true, fallback: Cab transfer up the ghat }
exclusions:
  - Lunch on all days
  - Entry tickets
  - Personal expenses
itinerary:
  - { day: 0, title: Depart Hyderabad, description: Board the overnight train with the group. Your coordinator meets everyone at the pickup point., meals: [] }
  - { day: 1, title: Coonoor tea country, description: Tea-estate walk, factory visit and the Lamb's Rock viewpoint. Evening campfire., meals: [breakfast, dinner], stay: Homestay, Ooty }
  - { day: 2, title: Ooty and return, description: Doddabetta peak and Ooty lake, then the overnight train home., meals: [breakfast] }
stays:
  - { type: Homestay, location: Ooty, washroom: attached }
cancellationPolicy: Sample policy text. HCC to supply.
faqs:
  - { q: Can I join if I'm travelling alone?, a: Sample answer. HCC to supply. }
featured: true
featuredStory: Overnight train, two days in tea country and a campfire with new friends. Back at your desk on Monday morning.
sortOrder: 10
status: live
sample: true
---

Sample overview copy. The trip story is written here in markdown and rendered on the trip page.
