# SaahiRides Pricing Rules — Copy/Paste Reference
**Status:** Confirmed rules for implementation  
**Scope:** SaahiRides city pricing and city-traveller outstation handoff  
**Website:** https://www.saahirides.co.in/

## 1. City cumulative pricing
- City pricing applies up to and including 30 km.
- First 3 km: base fare = 3 × approved base rate per kilometre (or actual distance × rate for trips shorter than 3 km).
- Above 3 km, calculate each distance slab cumulatively. Apply the multiplier only to the kilometres inside that slab:
  - 3–5 km: 1.15× base rate
  - 5–10 km: 1.25× base rate
  - 10–15 km: 1.50× base rate
  - 15–20 km: 1.75× base rate
  - 20–25 km: 2.00× base rate
  - 25–30 km: 2.25× base rate
- Do not apply a slab multiplier to the entire trip; each slab is calculated separately.
- No city vehicle may continue under city pricing beyond 30 km.
- Published fare tables and customer-facing fare estimates round the calculated trip fare to the nearest rupee.

## 2. Base rates per kilometre
| Vehicle | Standard | Express | Super Fast |
|---|---:|---:|---:|
| Bike | ₹10/km | ₹12/km | ₹13/km |
| Scooty | ₹12/km | ₹13.50/km | ₹15/km |
| Scooty EV | **Single rate: ₹16/km** | Not applicable | Not applicable |
| Auto Rickshaw | ₹16.50/km | ₹17.50/km | ₹19/km |
| Electric Auto Rickshaw | **Single rate: ₹19/km** | Not applicable | Not applicable |
| Non-AC Cab | ₹19.50/km | ₹21/km | ₹22/km |
| AC Cab | ₹22.50/km | ₹24/km | ₹25/km |

Scooty EV and Electric Auto Rickshaw use one rate each only. Express and Super Fast tiers do not apply to these two vehicle categories. These rates supersede the earlier rate card.

## 3. City travellers whose actual trip exceeds 30 km
This threshold rule applies only to a city traveller whose trip exceeds the 30 km city limit. Stop city fare calculation and hand off to the existing outstation pricing engine.

| Actual city-cab distance | Billing basis |
|---|---|
| Up to 30 km | Actual distance, progressive cumulative city pricing |
| 30.01–50 km | 50 km rate basis × 1.25 = 62.5 rate-equivalent km |
| 50.01–100 km | Linear increase from 62.5 to 150 rate-equivalent km: 62.5 + (actual km − 50) × 1.75 |
| Above 100 km | Separately approved normal outstation rules; no further city-model band |

Confirmed examples:
- 35 km → 50 km rate basis × 1.25 = 62.5 rate-equivalent km
- 50 km → 62.5 rate-equivalent km
- 51 km → 64.25 rate-equivalent km
- 75 km → 106.25 rate-equivalent km
- 80 km → 115 rate-equivalent km
- 100 km → 150 rate-equivalent km

Multiply the rate-equivalent kilometres by the applicable Non-AC or AC city-cab approved per-kilometre rate. This extended city-cab rule does not apply to bikes, scooties, Scooty EV, Auto Rickshaw or Electric Auto Rickshaw. Do not replace or rewrite normal outstation booking rules with this city-traveller threshold. The formula is continuous at 50 km and avoids a sudden 50-to-51 km fare jump.

## 4. Existing outstation booking policy — keep separate
Previously shared outstation rates and terms remain unchanged:
- Sedan: ₹18/km one-way; ₹16/km round trip.
- Ertiga: ₹22/km one-way; ₹20/km round trip.
- Innova/Crysta: ₹25/km one-way; ₹24/km round trip.
- Normal one-way outstation bookings: 350 km minimum.
- Normal round-trip outstation bookings: 300 km/day minimum.
- Hyderabad garage-to-garage distance calculation.
- 50% advance to confirm; balance as stated in the confirmed quote.
- 5% GST extra.
- Fuel, toll, parking, driver food and driver bata are included; do not add them again as separate customer charges.
- Insurance through Akiko General; state applicable coverage and policy details in the booking confirmation.
- Do not add unapproved surcharges or undisclosed exclusions.

**Important:** The 50 km / 100 km threshold is only for a city traveller crossing the 30 km city limit. It is not a replacement for the normal 350 km one-way or 300 km/day round-trip minimums for regular outstation bookings.


## 5. Subscription model — approved pricing
- Subscription period: 30 days.
- Eligible subscription distances: 3 km, 5 km, 10 km and 15 km.
- Subscription calculation: matching On-Demand fare × 30 one-way trips or × 60 trip legs for both-way service, then apply a straight 15% discount (multiply by 0.85).
- Round the final 30-day subscription total to the nearest rupee.
- No separate joining fee and no separate route-lock add-on. The 15% discount replaces the previous ₹199/₹299 route-lock add-on calculation.
- Subscription savings are 15% against the comparable On-Demand total for every vehicle and service tier, including Bike and Scooty EV.
- Planned benefits (route lock, dedicated driver, SOS and ride insurance subject to applicable coverage terms, eligible unused-balance carry-forward with a 5-day use window, and expiry reminder 5 days before expiry) remain subject to their separate operating and coverage rules.
- Automated bot handling for eligibility, balance deductions, carry-forward and reminders is planned.
- The 15-day free trial offer ran 1–15 October 2026 and is no longer a current offer.

## 6. Website and data safety
- Update the existing website in place; do not rebuild it from scratch.
- Do not modify Supabase data.
- Do not add extra vehicle tiers or alter the approved outstation billing rules.
