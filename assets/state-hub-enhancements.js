(function initSaahiStateHubEnhancements() {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  // 1. Add Approved Tariff & Premium Protocol pills to top hub-bar if not already present
  const hubBar = document.querySelector('.hub-bar');
  if (hubBar && !hubBar.querySelector('a[href="tariff-guide.html"]')) {
    hubBar.insertAdjacentHTML('beforeend', `
      <a href="tariff-guide.html" class="hub-pill">📋 Approved Tariff</a>
      <a href="premium-privilege.html" class="hub-pill" style="border-color:#00F0FF;color:#00F0FF">👑 Premium Protocol</a>
    `);
  }

  // Avoid duplicate injection on hot reload
  if (document.getElementById('saahiStateFleetAndCharters')) return;

  const FLEET_VISUALS = [
    {
      name: 'Commuter Bike (Petrol)',
      badge: 'PETROL • SOLO EXPRESS',
      badgeColor: '#FFE27A',
      rate: '₹10 – ₹13 / km',
      diff: 'Agile 2-wheeler for solo office commutes & quick city hops; instant fuel range across all zones.',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Bike"><circle cx="38" cy="54" r="16" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="142" cy="54" r="16" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M38 54 L72 30 L108 30 L126 54 M72 30 L62 18 L82 18 M108 30 L122 18 L136 22" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="74" y="24" width="28" height="7" rx="3" fill="#D4AF37"/></svg>`
    },
    {
      name: 'Scooty (Petrol — Gearless)',
      badge: 'PETROL • STEP-THROUGH',
      badgeColor: '#FFE27A',
      rate: '₹12 – ₹15 / km',
      diff: 'Flat footboard with front hook space for grocery bags or laptop backpack; smooth automatic ride.',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Scooty Petrol"><circle cx="40" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="140" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M40 55 Q42 32 68 32 L106 32 Q122 32 128 18 L138 55" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round"/><rect x="56" y="26" width="32" height="7" rx="3" fill="#D4AF37"/></svg>`
    },
    {
      name: 'Scooty EV (100% Electric)',
      badge: '⚡ ZERO EMISSION • SILENT EV',
      badgeColor: '#6ee7b7',
      rate: '₹16 / km (Dedicated)',
      diff: 'Battery-powered green scooter: whisper-quiet motor, zero tailpipe smoke & zero vibration for eco-conscious city rides.',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Scooty EV"><circle cx="40" cy="55" r="14" fill="none" stroke="#6ee7b7" stroke-width="4"/><circle cx="140" cy="55" r="14" fill="none" stroke="#6ee7b7" stroke-width="4"/><path d="M40 55 Q42 32 68 32 L106 32 Q122 32 128 18 L138 55" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round"/><polygon points="88,10 78,26 87,26 83,40 97,22 88,22" fill="#6ee7b7"/></svg>`
    },
    {
      name: 'Auto Rickshaw (Petrol / CNG)',
      badge: '3-SEATER • OPEN AIR',
      badgeColor: '#FFE27A',
      rate: '₹16.50 – ₹19 / km',
      diff: 'Classic 3-passenger neighborhood & market workhorse with easy hop-on access & zero surge pricing.',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Auto Rickshaw"><circle cx="44" cy="56" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="138" cy="56" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M32 52 L32 24 Q32 14 48 14 L112 14 L132 34 L144 52 Z" fill="none" stroke="#00F0FF" stroke-width="3.5" stroke-linejoin="round"/><line x1="78" y1="14" x2="78" y2="52" stroke="#D4AF37" stroke-width="3"/></svg>`
    },
    {
      name: 'Electric Auto (100% EV)',
      badge: '⚡ ZERO SMOKE • SMOOTH EV',
      badgeColor: '#6ee7b7',
      rate: '₹19 / km (Dedicated)',
      diff: 'Next-gen battery e-Auto: zero engine noise, zero exhaust fumes & smooth jerk-free pickup for families & seniors.',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Electric Auto"><circle cx="44" cy="56" r="13" fill="none" stroke="#6ee7b7" stroke-width="4"/><circle cx="138" cy="56" r="13" fill="none" stroke="#6ee7b7" stroke-width="4"/><path d="M32 52 L32 24 Q32 14 48 14 L112 14 L132 34 L144 52 Z" fill="none" stroke="#00F0FF" stroke-width="3.5" stroke-linejoin="round"/><polygon points="88,18 80,31 87,31 84,43 96,28 89,28" fill="#6ee7b7"/></svg>`
    },
    {
      name: 'Non-AC & AC City Cabs (4-Seater)',
      badge: '4-SEATER • WEATHER-SEALED',
      badgeColor: '#FFE27A',
      rate: 'Non-AC ₹19.50–₹22 | AC ₹22.50–₹25/km',
      diff: 'Enclosed 4-door sedan/hatchback comfort with boot space—choose budget Non-AC or climate-controlled AC.',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="City Cab"><circle cx="44" cy="55" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="136" cy="55" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M22 50 L28 34 L54 18 L120 18 L146 34 L158 50 Z" fill="none" stroke="#00F0FF" stroke-width="3.5" stroke-linejoin="round"/><rect x="74" y="10" width="28" height="7" rx="2" fill="#D4AF37"/></svg>`
    },
    {
      name: 'Outstation SUV / Ertiga & Innova Crysta',
      badge: '6–7 SEATER • ALL-INCLUSIVE',
      badgeColor: '#FFE27A',
      rate: 'SUV ₹20–₹22 | Crysta ₹24–₹25/km',
      diff: 'High-ground-clearance 6–7 seater family & temple-circuit MUVs (300 km both ways / 350 km single way min, all-inclusive).',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Outstation SUV"><circle cx="42" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="138" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M18 50 L24 28 L46 15 L142 15 L158 34 L162 50 Z" fill="none" stroke="#00F0FF" stroke-width="3.5" stroke-linejoin="round"/><line x1="92" y1="15" x2="92" y2="50" stroke="#D4AF37" stroke-width="2.5"/></svg>`
    },
    {
      name: 'Premium Protocol & Group Van (≤ 12-Mo Old)',
      badge: '👑 C-SUITE / PSU • ≤ 1 YR FLEET',
      badgeColor: '#00F0FF',
      rate: 'Van ₹41 | MPV ₹48 | Sedan ₹63/km',
      diff: 'Strictly ≤12-month-old Camry/C-Class, Hycross ZX/Carnival & Force Urbania (3-hr TAT; Luxury Caravan on 1-mo request).',
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Premium Executive"><circle cx="42" cy="55" r="14" fill="none" stroke="#00F0FF" stroke-width="4"/><circle cx="138" cy="55" r="14" fill="none" stroke="#00F0FF" stroke-width="4"/><path d="M18 50 L22 20 L150 20 L162 36 L162 50 Z" fill="none" stroke="#FFE27A" stroke-width="3.5" stroke-linejoin="round"/><polygon points="90,4 94,12 103,12 96,17 98,25 90,20 82,25 84,17 77,12 86,12" fill="#D4AF37"/></svg>`
    }
  ];

  const bundle = document.createElement('div');
  bundle.id = 'saahiStateFleetAndCharters';
  bundle.innerHTML = `
  <!-- 1. VISUAL FLEET SHOWCASE: EV vs PETROL & VEHICLE CATEGORIES -->
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:18px 0">
    <div style="text-align:center;max-width:880px;margin:0 auto">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #6ee7b7;color:#6ee7b7;font-size:11.5px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase">Know Your Ride • EV vs. Petrol &amp; Fleet Guide</span>
      <h2 style="margin:8px 0;color:#FFE27A">Visual Vehicle Guide: Choose the Exact Ride That Fits Your Journey</h2>
      <p style="margin:0;color:#dbe4f4;font-size:14.5px">Compare standard petrol vehicles against whisper-quiet, zero-emission <strong>EV</strong> options, city cabs, all-inclusive outstation MUVs, and <strong>≤12-month-old Premium Protocol</strong> vehicles.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:18px">
      ${FLEET_VISUALS.map(v => `
        <article style="background:linear-gradient(145deg,#10284d,#0b1c3d);border:1px solid rgba(212,175,55,.38);border-radius:14px;padding:16px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <span style="font-size:10.5px;font-weight:900;letter-spacing:1px;color:${v.badgeColor};display:block;margin-bottom:6px">${v.badge}</span>
            <div style="text-align:center;background:#06122E;border-radius:10px;padding:8px;margin-bottom:10px;border:1px solid rgba(0,240,255,.22)">${v.svg}</div>
            <h3 style="margin:0 0 4px;color:#fff;font-size:16.5px">${v.name}</h3>
            <div style="display:inline-block;padding:3px 9px;border-radius:6px;background:#D4AF37;color:#06122E;font-weight:900;font-size:12.5px;margin-bottom:8px">${v.rate}</div>
            <p style="margin:0;font-size:13.5px;color:#cbd5e1;line-height:1.5">${v.diff}</p>
          </div>
        </article>
      `).join('')}
    </div>

    <div style="text-align:center;margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
      <a href="tariff-guide.html" style="padding:10px 16px;border-radius:9px;background:#D4AF37;color:#06122E;font-weight:900;text-decoration:none;font-size:13.5px">📋 Open Full City &amp; Outstation Tariff Calculator →</a>
      <a href="premium-privilege.html" style="padding:10px 16px;border-radius:9px;border:1px solid #00F0FF;background:#0b1c3d;color:#00F0FF;font-weight:900;text-decoration:none;font-size:13.5px">👑 Explore Premium Protocol &amp; Privilege Card →</a>
    </div>
  </section>

    <!-- 2. PASSENGER PROMISE & RIDE CHARTER — PILLAR #4 -->
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:18px 0">
    <div style="text-align:center;max-width:860px;margin:0 auto">
      <h2 style="margin:0 0 6px;color:#FFE27A">SaahiRides Passenger Promise &amp; Ride Charter — Pillar #4</h2>
      <p style="margin:0;color:#dbe4f4">Brand Ambassador Dignity, Zero-Tipping &amp; 24-Hour Customer KYC Verification</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:16px">
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🤝</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">Brand Ambassador Dignity &amp; Zero-Tipping</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Our drivers are our brand ambassadors. Kindly treat every SaahiRides partner with full dignity and respect. Tipping is not expected; misconduct, harassment or inhumane treatment is not acceptable.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🛡️</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">Zero-Argument Support Policy</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Please do not argue with drivers. For any trip or billing concern, contact SaahiRides Support immediately on <strong>+91 93479 46026</strong> so the matter can be handled calmly through the official support process.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🪪</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">24-Hour Customer KYC Validation Window</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Kindly allow SaahiRides up to 24 hours to verify your profile and service eligibility—especially for new accounts, subscriptions, outstation trips, and self-drive/rental bookings. Valid ID proof may be requested before boarding or during your journey.</p>
      </article>
    </div>
  </section>

  <!-- 3. BRAND AMBASSADOR & DRIVER CHARTER — PARTNER POLICY -->
  <section class="panel" style="background:#071931;border:1.5px solid rgba(0,240,255,.45);border-radius:16px;padding:24px;margin:18px 0">
    <div style="text-align:center;max-width:860px;margin:0 auto">
      <h2 style="margin:0 0 6px;color:#FFE27A">SaahiRides Brand Ambassador &amp; Driver Charter — Partner Policy</h2>
      <p style="margin:0;color:#dbe4f4">75% Fair Partner Earnings, Zero-Argument Escalation &amp; 24-Hour Fleet Verification</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:16px">
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">💼</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">75% Partner Split &amp; ₹0 Joining Fee</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Every SaahiRides Brand Ambassador retains <strong>75% of the fare</strong> with <strong>25% platform share</strong>—with <strong>₹0 joining fee</strong>, zero hidden deductions, and zero forced surge targets. Tipping is never solicited from passengers.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🛡️</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">Zero-Argument &amp; Safe Conduct Policy</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Drivers must never argue with passengers over routes, tolls, or billing. In case of any dispute, safety concern, or unverified passenger request, pause calmly and call <strong>SaahiRides Partner Desk on +91 93479 46026</strong> immediately.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🪪</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">24-Hour KYC, Fleet Hygiene &amp; Punctuality</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">All new driver-partners undergo a mandatory <strong>24-hour KYC, DL, RC &amp; insurance verification</strong> before activation. Clean vehicle interiors, courteous etiquette, and punctual pickup reporting are required on every trip.</p>
      </article>
    </div>
  </section>

  <!-- 4. FREE VEHICLE KNOW-HOW & DIY HOME MAINTENANCE CHARTER -->
  <section class="panel" style="background:#071931;border:1.5px solid rgba(110,231,183,.45);border-radius:16px;padding:24px;margin:18px 0">
    <div style="text-align:center;max-width:860px;margin:0 auto">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #6ee7b7;color:#6ee7b7;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase">Free Community &amp; Partner Learning Initiative</span>
      <h2 style="margin:6px 0;color:#FFE27A">SaahiRides Vehicle Know-How &amp; DIY Home Care Charter</h2>
      <p style="margin:0;color:#dbe4f4">Free automobile awareness &amp; safe at-home basic maintenance guides for interested learners, commuters &amp; driver-partners</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:16px">
      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">⚙️</div>
        <h3 style="margin:0 0 6px;color:#6ee7b7;font-size:17px">1. Automobile &amp; EV Engineering Basics (Free)</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Understand how internal combustion engines, gearless CVT transmissions, regenerative braking, and lithium-ion EV drivetrains work—so you choose and drive every vehicle smarter.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🧰</div>
        <h3 style="margin:0 0 6px;color:#6ee7b7;font-size:17px">2. Safe DIY Basic Repairs &amp; Checks at Home</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Step-by-step home care: checking tyre PSI &amp; tread depth, topping up windshield washer &amp; coolant levels, cleaning air filters, checking 12V battery terminals, and replacing blown cabin fuses.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">⚡</div>
        <h3 style="margin:0 0 6px;color:#6ee7b7;font-size:17px">3. Safety Guardrails: DIY vs. Certified Workshop</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Learn what <strong>never</strong> to touch at home—high-voltage orange EV cables, brake hydraulics, and airbag wiring—ensuring zero injury and long vehicle life. Free session registration open on WhatsApp.</p>
      </article>
    </div>

    <div style="text-align:center;margin-top:16px">
      <a href="https://wa.me" target="_blank" rel="noopener" style="display:inline-block;padding:10px 18px;border-radius:9px;background:#10b981;color:#04130d;font-weight:900;text-decoration:none;font-size:13.5px">🔧 Register Interest for Free Vehicle Know-How Sessions (WhatsApp)</a>
    </div>
  </section>
  `;

  const footerEl = mainEl.querySelector('footer');
  if (footerEl) {
    mainEl.insertBefore(bundle, footerEl);
  } else {
    mainEl.appendChild(bundle);
  }
})();
      svg: `<svg viewBox="0 0 180 76" width="160" height="68" aria-label="Premium Executive"><circle cx="42" cy="55" r="14" fill="none" stroke="#00F0FF" stroke-width="4"/><circle cx="138" cy="55" r="14" fill="none" stroke="#00F0FF" stroke-width="4"/><path d="M18 50 L22 20 L150 20 L162 36 L162 50 Z" fill="none" stroke="#FFE27A" stroke-width="3.5" stroke-linejoin="round"/><polygon points="90,4 94,12 103,12 96,17 98,25 90,20 82,25 84,17 77,12 86,12" fill="#D4AF37"/></svg>`
    }
  ];

  const bundle = document.createElement('div');
  bundle.id = 'saahiStateFleetAndCharters';
  bundle.innerHTML = `
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <div style="text-align:center;max-width:880px;margin:0 auto">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #6ee7b7;color:#6ee7b7;font-size:11.5px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase">Know Your Ride • EV vs. Petrol &amp; Fleet Guide</span>
      <h2 style="margin:8px 0;color:#FFE27A">Visual Vehicle Guide: Choose the Exact Ride That Fits Your Journey</h2>
      <p style="margin:0;color:#dbe4f4;font-size:14.5px">Compare standard petrol vehicles against whisper-quiet, zero-emission <strong>EV</strong> options, city cabs, all-inclusive outstation MUVs, and <strong>≤12-month-old Premium Protocol</strong> vehicles.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:18px">
      ${FLEET_VISUALS.map(v => `
        <article style="background:linear-gradient(145deg,#10284d,#0b1c3d);border:1px solid rgba(212,175,55,.38);border-radius:14px;padding:16px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <span style="font-size:10.5px;font-weight:900;letter-spacing:1px;color:${v.badgeColor};display:block;margin-bottom:6px">${v.badge}</span>
            <div style="text-align:center;background:#06122E;border-radius:10px;padding:8px;margin-bottom:10px;border:1px solid rgba(0,240,255,.22)">${v.svg}</div>
            <h3 style="margin:0 0 4px;color:#fff;font-size:16.5px">${v.name}</h3>
            <div style="display:inline-block;padding:3px 9px;border-radius:6px;background:#D4AF37;color:#06122E;font-weight:900;font-size:12.5px;margin-bottom:8px">${v.rate}</div>
            <p style="margin:0;font-size:13.5px;color:#cbd5e1;line-height:1.5">${v.diff}</p>
          </div>
        </article>
      `).join('')}
    </div>

    <div style="text-align:center;margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
      <a href="tariff-guide.html" style="padding:10px 16px;border-radius:9px;background:#D4AF37;color:#06122E;font-weight:900;text-decoration:none;font-size:13.5px">📋 Open Full City &amp; Outstation Tariff Calculator →</a>
      <a href="premium-privilege.html" style="padding:10px 16px;border-radius:9px;border:1px solid #00F0FF;background:#0b1c3d;color:#00F0FF;font-weight:900;text-decoration:none;font-size:13.5px">👑 Explore Premium Protocol &amp; Privilege Card →</a>
    </div>
  </section>

  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <div style="text-align:center;max-width:860px;margin:0 auto">
      <h2 style="margin:0 0 6px;color:#FFE27A">SaahiRides Passenger Promise &amp; Ride Charter — Pillar #4</h2>
      <p style="margin:0;color:#dbe4f4">Brand Ambassador Dignity, Zero-Tipping &amp; 24-Hour Customer KYC Verification</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:16px">
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🤝</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">Brand Ambassador Dignity &amp; Zero-Tipping</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Our drivers are our brand ambassadors. Kindly treat every SaahiRides partner with full dignity and respect. Tipping is not expected; misconduct, harassment or inhumane treatment is not acceptable.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🛡️</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">Zero-Argument Support Policy</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Please do not argue with drivers. For any trip or billing concern, contact SaahiRides Support immediately on <strong>+91 93479 46026</strong> so the matter can be handled calmly through the official support process.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🪪</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">24-Hour Customer KYC Validation Window</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Kindly allow SaahiRides up to 24 hours to verify your profile and service eligibility—especially for new accounts, subscriptions, outstation trips, and self-drive/rental bookings. Valid ID proof may be requested before boarding or during your journey.</p>
      </article>
    </div>
  </section>

  <section class="panel" style="background:#071931;border:1.5px solid rgba(0,240,255,.45);border-radius:16px;padding:24px;margin:20px 24px">
    <div style="text-align:center;max-width:860px;margin:0 auto">
      <h2 style="margin:0 0 6px;color:#FFE27A">SaahiRides Brand Ambassador &amp; Driver Charter — Partner Policy</h2>
      <p style="margin:0;color:#dbe4f4">75% Fair Partner Earnings, Zero-Argument Escalation &amp; 24-Hour Fleet Verification</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:16px">
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">💼</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">75% Partner Split &amp; ₹0 Joining Fee</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Every SaahiRides Brand Ambassador retains <strong>75% of the fare</strong> with <strong>25% platform share</strong>—with <strong>₹0 joining fee</strong>, zero hidden deductions, and zero forced surge targets. Tipping is never solicited from passengers.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🛡️</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">Zero-Argument &amp; Safe Conduct Policy</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Drivers must never argue with passengers over routes, tolls, or billing. In case of any dispute, safety concern, or unverified passenger request, pause calmly and call <strong>SaahiRides Partner Desk on +91 93479 46026</strong> immediately.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🪪</div>
        <h3 style="margin:0 0 6px;color:#FFE27A;font-size:17px">24-Hour KYC, Fleet Hygiene &amp; Punctuality</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">All new driver-partners undergo a mandatory <strong>24-hour KYC, DL, RC &amp; insurance verification</strong> before activation. Clean vehicle interiors, courteous etiquette, and punctual pickup reporting are required on every trip.</p>
      </article>
    </div>
  </section>

  <section class="panel" style="background:#071931;border:1.5px solid rgba(110,231,183,.45);border-radius:16px;padding:24px;margin:20px 24px">
    <div style="text-align:center;max-width:860px;margin:0 auto">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #6ee7b7;color:#6ee7b7;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase">Free Community &amp; Partner Learning Initiative</span>
      <h2 style="margin:6px 0;color:#FFE27A">SaahiRides Vehicle Know-How &amp; DIY Home Care Charter</h2>
      <p style="margin:0;color:#dbe4f4">Free automobile awareness &amp; safe at-home basic maintenance guides for interested learners, commuters &amp; driver-partners</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:16px">
      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">⚙️</div>
        <h3 style="margin:0 0 6px;color:#6ee7b7;font-size:17px">1. Automobile &amp; EV Engineering Basics (Free)</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Understand how internal combustion engines, gearless CVT transmissions, regenerative braking, and lithium-ion EV drivetrains work—so you choose and drive every vehicle smarter.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">🧰</div>
        <h3 style="margin:0 0 6px;color:#6ee7b7;font-size:17px">2. Safe DIY Basic Repairs &amp; Checks at Home</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Step-by-step home care: checking tyre PSI &amp; tread depth, topping up windshield washer &amp; coolant levels, cleaning air filters, checking 12V battery terminals, and replacing blown cabin fuses.</p>
      </article>

      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:18px">
        <div style="font-size:24px;margin-bottom:6px">⚡</div>
        <h3 style="margin:0 0 6px;color:#6ee7b7;font-size:17px">3. Safety Guardrails: DIY vs. Certified Workshop</h3>
        <p style="margin:0;font-size:14.5px;color:#dbe4f4">Learn what <strong>never</strong> to touch at home—high-voltage orange EV cables, brake hydraulics, and airbag wiring—ensuring zero injury and long vehicle life. Free session registration open on WhatsApp.</p>
      </article>
    </div>

    <div style="text-align:center;margin-top:16px">
      <a href="https://wa.me" target="_blank" rel="noopener" style="display:inline-block;padding:10px 18px;border-radius:9px;background:#10b981;color:#04130d;font-weight:900;text-decoration:none;font-size:13.5px">🔧 Register Interest for Free Vehicle Know-How Sessions (WhatsApp)</a>
    </div>
  </section>
  `;

  const flashBarEl = containerEl.querySelector('.flash-bar') || containerEl.querySelector('footer');
  if (flashBarEl) {
    containerEl.insertBefore(bundle, flashBarEl);
  } else {
    containerEl.appendChild(bundle);
  }
})();
