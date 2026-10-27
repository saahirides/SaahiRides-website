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
- The supplied calculator rounds the calculated fare to two decimal places.

## 2. Base rates per kilometre
| Vehicle | Standard | Express | Super Fast |
|---|---:|---:|---:|
| Bike | ₹10/km | ₹12/km | ₹13/km |
| Scooty | ₹14/km | ₹15/km | ₹17/km |
| Scooty EV | ₹16/km | Unconfirmed | Unconfirmed |
| Auto Rickshaw | ₹23/km | ₹25/km | ₹26/km |
| Electric Auto Rickshaw | ₹25/km | Unconfirmed | Unconfirmed |
| Non-AC Cab | ₹25/km | ₹27/km | ₹28/km |
| AC Cab | ₹30/km | ₹32/km | ₹33/km |

Unconfirmed rates must remain blocked until approved.

## 3. City travellers whose actual trip exceeds 30 km
This threshold rule applies only to a city traveller whose trip exceeds the 30 km city limit. Stop city fare calculation and hand off to the existing outstation pricing engine.

| Actual distance | Billable distance |
|---|---:|
| Up to 30 km | Actual distance, city cumulative pricing |
| 30.01–50 km | 50 km minimum, outstation pricing |
| 50.01–100 km | 100 km minimum, outstation pricing |

Confirmed examples:
- 35 km → bill 50 km
- 50 km → bill 50 km
- 51 km → bill 100 km
- 80 km → bill 100 km
- 100 km → bill 100 km

Do not use city multipliers above 30 km. Do not replace or rewrite normal outstation booking rules with this city-traveller threshold.

## 4. Existing outstation booking policy — keep separate
Previously shared outstation rates and terms remain unchanged:
- Sedan: ₹18/km one-way; ₹16/km round trip.
- Ertiga: ₹22/km one-way; ₹20/km round trip.
- Innova/Crysta: ₹25/km one-way; ₹24/km round trip.
- Normal one-way outstation bookings: 350 km minimum.
- Normal round-trip outstation bookings: 300 km/day minimum.
- Hyderabad garage-to-garage distance calculation.
- 5% GST extra; toll, parking and driver bata included.
- Payment, waiting and cancellation terms remain as separately approved.

**Important:** The 50 km / 100 km threshold is only for a city traveller crossing the 30 km city limit. It is not a replacement for the normal 350 km one-way or 300 km/day round-trip minimums for regular outstation bookings.

## 5. Website and data safety
- Update the existing website in place; do not rebuild it from scratch.
- Do not modify Supabase data.
- Do not invent unconfirmed vehicle/tier rates or outstation billing rules beyond those confirmed above.
