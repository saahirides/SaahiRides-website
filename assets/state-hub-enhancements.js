(function initSaahiUniversalFleetAndCharters() {
  const isHome = /(^|\/)(index\.html)?$/i.test(window.location.pathname);
  const rootEl = document.querySelector('.container') || document.querySelector('main');
  if (!rootEl) return;

  // 1. State-Hub-Only Navigation & 7-Card Module Grid Wiring
  if (!isHome) {
    const hubBar = document.querySelector('.hub-bar');
    if (hubBar && !hubBar.querySelector('a[href="tariff-guide.html"]')) {
      hubBar.insertAdjacentHTML('beforeend', `<a href="tariff-guide.html" class="hub-pill">📋 Approved Tariff</a><a href="premium-privilege.html" class="hub-pill" style="border-color:#00F0FF;color:#00F0FF">👑 Premium Protocol</a><a href="pan-india-hub.html" class="hub-pill">🇮🇳 Pan-India Tiers</a>`);
    }

    function openGarageModal() {
      let m = document.getElementById('saahiGarageModal');
      if (!m) {
        m = document.createElement('div');
        m.id = 'saahiGarageModal';
        m.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,23,.88);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px';
        m.innerHTML = `<div style="max-width:440px;width:100%;background:#0b1c3d;border:2px solid #D4AF37;border-radius:16px;padding:24px;text-align:center;color:#fff"><div style="font-size:34px;margin-bottom:8px">🔧</div><h3 style="margin:6px 0 8px;color:#FFE27A;font-size:21px">SaahiRides Central Garage Network — Coming Soon!</h3><p style="margin:0 0 16px;font-size:14px;color:#dbe4f4">Centralised vehicle inspection bays, EV diagnostic centers &amp; partner service hubs launching shortly across Telangana, Andhra Pradesh &amp; Karnataka.</p><button type="button" onclick="document.getElementById('saahiGarageModal').style.display='none'" style="padding:10px 22px;border-radius:9px;border:0;background:#D4AF37;color:#06122E;font-weight:900;cursor:pointer">Got It</button></div>`;
        document.body.appendChild(m);
      } else { m.style.display = 'flex'; }
    }

    const commonGrid = document.querySelector('.common-grid');
    if (commonGrid && !commonGrid.querySelector('a[href="premium-privilege.html"]')) {
      commonGrid.insertAdjacentHTML('afterbegin', `<a href="premium-privilege.html" class="common-card" style="border-color:#00F0FF"><h3 style="color:#00F0FF">👑 Premium Protocol &amp; Privilege Card</h3><p>≤12-month-old luxury fleet (₹41–₹63/km), ₹10K 50/50 rolling card, 3-hr TAT &amp; downloadable Pilgrimage Pass.</p></a>`);
      commonGrid.querySelectorAll('a.common-card').forEach(c => {
        const t = (c.textContent || '').toLowerCase();
        if (t.includes('price')) c.setAttribute('href', 'tariff-guide.html');
        else if (t.includes('vehicle')) {
          c.setAttribute('href', '#saahiUniversalFleetSection');
          c.onclick = (e) => { e.preventDefault(); document.getElementById('saahiUniversalFleetSection')?.scrollIntoView({ behavior: 'smooth' }); };
        } else if (t.includes('pilgrimage') || t.includes('20 destinations') || t.includes('blog')) c.setAttribute('href', 'ceo-blog.html');
        else if (t.includes('hr')) c.setAttribute('href', 'hr.html');
        else if (t.includes('garage')) { c.setAttribute('href', '#garage-coming-soon'); c.onclick = (e) => { e.preventDefault(); openGarageModal(); }; }
      });
    }
  }

  if (document.getElementById('saahiUniversalFleetSection')) return;

  // 2. Complete 20-Vehicle Master Catalogue (Matches Your Son's 20-Filename Checklist)
  const VEHICLES_20 = [
    ['bike', 'Bike Standard', '₹10 / km', 'Hero Splendor Plus / Bajaj Platina 100 / TVS Sport', '100cc–110cc everyday commuter bike for zero-surge solo rides.', 'vehicles/bike-std.jpg', 'tariff-guide.html', '🏍️', '#FFE27A'],
    ['bike', 'Bike Express', '₹12 / km', 'Honda Shine 125 / Bajaj Pulsar 125 / TVS Raider 125', '125cc nimble city express bike for faster office hops.', 'vehicles/bike-express.jpg', 'tariff-guide.html', '🏍️', '#FFE27A'],
    ['bike', 'Bike Super Fast', '₹13 / km', 'Bajaj Pulsar NS160 / TVS Apache RTR 160 / Yamaha FZ-S', '150cc–160cc priority-dispatch commuter motorcycle.', 'vehicles/bike-superfast.jpg', 'tariff-guide.html', '🏍️', '#FFE27A'],

    ['scooty', 'Scooty Standard', '₹12 / km', 'TVS Scooty Pep+ / Hero Pleasure+ / Honda Dio', 'Lightweight 110cc gearless scooter for effortless neighborhood rides.', 'vehicles/scooty-std.jpg', 'tariff-guide.html', '🛵', '#FFE27A'],
    ['scooty', 'Scooty Express', '₹13.50 / km', 'Honda Activa 6G / TVS Jupiter 110', 'Flat-footboard family scooter with front bag hook space.', 'vehicles/scooty-express.jpg', 'tariff-guide.html', '🛵', '#FFE27A'],
    ['scooty', 'Scooty Super Fast', '₹15 / km', 'Suzuki Access 125 / TVS Ntorq 125 / Yamaha RayZR 125', '125cc high-pickup gearless scooter for brisk urban travel.', 'vehicles/scooty-superfast.jpg', 'tariff-guide.html', '🛵', '#FFE27A'],
    ['scooty', 'Scooty EV (100% Electric)', '₹16 / km', 'Ather 450X / TVS iQube / Ola S1 Pro (Green Plate)', 'Whisper-quiet battery scooter with zero tailpipe smoke & zero vibration.', 'vehicles/scooty-ev.jpg', 'tariff-guide.html', '⚡🛵', '#6ee7b7'],

    ['auto', 'Auto Standard', '₹16.50 / km', 'Bajaj RE Compact / Piaggio Ape City', 'Classic 3-seater city & market auto with zero surge pricing.', 'vehicles/auto-std.jpg', 'tariff-guide.html', '🛺', '#FFE27A'],
    ['auto', 'Auto Express', '₹17.50 / km', 'Bajaj Maxima Z / TVS King Deluxe', 'Wide-cabin 3-passenger commuter auto for comfortable family hops.', 'vehicles/auto-express.jpg', 'tariff-guide.html', '🛺', '#FFE27A'],
    ['auto', 'Auto Super Fast', '₹19 / km', 'Bajaj RE Optima / Piaggio Ape Xtra', 'Priority-dispatch 3-wheeler for quick station & office transfers.', 'vehicles/auto-superfast.jpg', 'tariff-guide.html', '🛺', '#FFE27A'],
    ['auto', 'Electric Auto (100% EV)', '₹19 / km', 'Mahindra Treo / Piaggio Ape E-City (Green Plate)', 'Zero-smoke, low-noise battery e-Auto for smooth, jerk-free rides.', 'vehicles/e-auto.jpg', 'tariff-guide.html', '⚡🛺', '#6ee7b7'],

    ['cab', 'Non-AC City Cab', '₹19.50 – ₹22 / km', 'Maruti WagonR Tour / Tata Tiago / Hyundai Santro', 'Weather-sealed 4-door hatchback cab (Std ₹19.50 | Exp ₹21 | Super Fast ₹22/km).', 'vehicles/cab-nonac.jpg', 'tariff-guide.html', '🚖', '#FFE27A'],
    ['cab', 'AC City Cab', '₹22.50 – ₹25 / km', 'Maruti Dzire Tour / Hyundai Aura / Honda Amaze', 'Climate-controlled 4-door AC sedan cab (Std ₹22.50 | Exp ₹24 | Super Fast ₹25/km).', 'vehicles/cab-ac.jpg', 'tariff-guide.html', '❄️🚖', '#FFE27A'],

    ['outstation', 'Outstation Sedan', '₹16/km Round | ₹18/km 1-Way', 'Toyota Etios / Maruti Suzuki Dzire', 'All-inclusive highway sedan (300 km both ways / 350 km single way min, +5% GST).', 'vehicles/outstation-sedan.jpg', 'tariff-guide.html', '🛣️🚗', '#FFE27A'],
    ['outstation', 'Outstation SUV / Ertiga', '₹20/km Round | ₹22/km 1-Way', 'Maruti Suzuki Ertiga / Kia Carens', '6–7 seater family & temple-circuit MUV (toll, parking, fuel & driver bata included).', 'vehicles/outstation-suv.jpg', 'tariff-guide.html', '🚙', '#FFE27A'],
    ['outstation', 'Outstation Innova / Crysta', '₹24/km Round | ₹25/km 1-Way', 'Toyota Innova Crysta', 'Captain-seat long-distance highway MUV (Hyderabad garage-to-garage all-inclusive).', 'vehicles/outstation-innova.jpg', 'tariff-guide.html', '🚐', '#FFE27A'],

    ['premium', 'Premium Executive Sedan (≤12-Mo)', '₹63 / km', 'Toyota Camry Hybrid / Skoda Superb / C-Class / 3 Series', 'Strictly ≤12-month-old luxury sedan for C-Suite, Govt/PSU & VIP airport protocol (3-hr TAT).', 'vehicles/premium-sedan.jpg', 'premium-privilege.html', '👑🚘', '#00F0FF'],
    ['premium', 'Premium Luxury MPV / SUV (≤12-Mo)', '₹48 / km', 'Toyota Innova Hycross ZX / Fortuner / Kia Carnival', 'Strictly ≤12-month-old executive MPV/SUV for corporate delegations (3-hr TAT; night ₹200/hr).', 'vehicles/premium-mpv.jpg', 'premium-privilege.html', '👑🚙', '#00F0FF'],
    ['premium', 'Executive Group Van (≤12-Mo)', '₹41 / km', 'Force Urbania (10–17 Seater) / Executive Traveller', 'High-roof ≤12-month-old executive shuttle for board offsites & group airport arrivals.', 'vehicles/premium-van.jpg', 'premium-privilege.html', '👑🚐', '#00F0FF'],
    ['premium', 'Luxury Caravan (Special Request)', 'Separate Bespoke Billing', 'Force Urbania Luxury Motorhome / Custom Overland Caravan', 'Available on special request with ≥1-month advance notice under separate bespoke billing.', 'vehicles/luxury-caravan.jpg', 'premium-privilege.html', '🏕️👑', '#00F0FF']
  ];

  const fleetSection = document.createElement('section');
  fleetSection.id = 'saahiUniversalFleetSection';
  fleetSection.className = 'panel';
  fleetSection.style.cssText = `background:#071931;border:1.5px solid rgba(212,175,55,.48);border-radius:16px;padding:24px;margin:${isHome ? '18px 0' : '20px 24px'}`;
  fleetSection.innerHTML = `
    <div style="text-align:center;max-width:900px;margin:0 auto">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #6ee7b7;color:#6ee7b7;font-size:11px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase">Complete 20-Model Fleet Directory • EV vs. Petrol &amp; Luxury Protocol</span>
      <h2 style="margin:8px 0 6px;color:#FFE27A">SaahiRides Complete Vehicle List &amp; Model Guide</h2>
      <p style="margin:0;color:#dbe4f4;font-size:14.5px">Filter by category below to inspect exact Indian models, EV vs. Petrol differences, and approved per-km rates.</p>
    </div>

    <div id="saahiFleetFilterBar" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:16px 0">
      <button type="button" data-cat="all" style="padding:8px 14px;border-radius:9px;border:1px solid #D4AF37;background:#D4AF37;color:#06122E;font-weight:900;cursor:pointer;font-size:12.5px">All 20 Vehicles</button>
      <button type="button" data-cat="bike" style="padding:8px 14px;border-radius:9px;border:1px solid #46618b;background:#0b1c3d;color:#fff;font-weight:800;cursor:pointer;font-size:12.5px">🏍️ Bikes (Std/Exp/SF)</button>
      <button type="button" data-cat="scooty" style="padding:8px 14px;border-radius:9px;border:1px solid #46618b;background:#0b1c3d;color:#fff;font-weight:800;cursor:pointer;font-size:12.5px">🛵 Scooty &amp; EV</button>
      <button type="button" data-cat="auto" style="padding:8px 14px;border-radius:9px;border:1px solid #46618b;background:#0b1c3d;color:#fff;font-weight:800;cursor:pointer;font-size:12.5px">🛺 Autos &amp; e-Auto</button>
      <button type="button" data-cat="cab" style="padding:8px 14px;border-radius:9px;border:1px solid #46618b;background:#0b1c3d;color:#fff;font-weight:800;cursor:pointer;font-size:12.5px">🚖 City Cabs</button>
      <button type="button" data-cat="outstation" style="padding:8px 14px;border-radius:9px;border:1px solid #46618b;background:#0b1c3d;color:#fff;font-weight:800;cursor:pointer;font-size:12.5px">🚙 Outstation</button>
      <button type="button" data-cat="premium" style="padding:8px 14px;border-radius:9px;border:1px solid #00F0FF;background:#0b1c3d;color:#00F0FF;font-weight:900;cursor:pointer;font-size:12.5px">👑 Premium (≤12-Mo)</button>
    </div>

    <div id="saahiFleetCardsGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:14px">
      ${VEHICLES_20.map(([cat, title, rate, models, desc, imgPath, link, emoji, badgeCol]) => `
        <a href="${link}" data-vcat="${cat}" style="text-decoration:none;background:#0b1c3d;border:1px solid rgba(212,175,55,.38);border-radius:14px;padding:14px;display:flex;flex-direction:column;justify-content:space-between" onmouseover="this.style.borderColor='#00F0FF'" onmouseout="this.style.borderColor='rgba(212,175,55,.38)'">
          <div>
            <span style="font-size:10.5px;font-weight:900;color:${badgeCol};text-transform:uppercase;letter-spacing:.9px;display:block;margin-bottom:6px">${cat.toUpperCase()} TIER</span>
            <div style="background:linear-gradient(135deg,#06122E,#132b53);border-radius:10px;overflow:hidden;height:125px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(0,240,255,.22)">
              <img src="${imgPath}" alt="${title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" style="width:100%;height:100%;object-fit:cover">
              <div style="display:none;flex-direction:column;align-items:center;justify-content:center;gap:4px">
                <span style="font-size:38px;line-height:1">${emoji}</span>
                <span style="font-size:10px;color:#00F0FF;font-weight:800">TAP FOR FARE &amp; BOOKING →</span>
              </div>
            </div>
            <h3 style="margin:0 0 4px;color:#fff;font-size:16px">${title}</h3>
            <div style="display:inline-block;padding:3px 9px;border-radius:6px;background:#D4AF37;color:#06122E;font-weight:900;font-size:12px;margin-bottom:6px">${rate}</div>
            <p style="margin:0 0 6px;font-size:12.5px;color:#FFE27A;font-weight:700">${models}</p>
            <p style="margin:0;font-size:13px;color:#cbd5e1;line-height:1.45">${desc}</p>
          </div>
        </a>
      `).join('')}
    </div>
  `;

  if (isHome) {
    const oldVehSec = document.getElementById('vehicle-lists');
    if (oldVehSec) oldVehSec.replaceWith(fleetSection);
    else rootEl.appendChild(fleetSection);
  } else {
    const extraWrap = document.createElement('div');
    extraWrap.appendChild(fleetSection);
    extraWrap.insertAdjacentHTML('beforeend', `
      <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
        <h2 style="text-align:center;margin:0 0 4px;color:#FFE27A">SaahiRides Passenger Promise &amp; Ride Charter — Pillar #4</h2>
        <p style="text-align:center;margin:0 0 14px;color:#dbe4f4;font-size:14px">Brand Ambassador Dignity, Zero-Tipping &amp; 24-Hour Customer KYC Verification</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
          <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🤝 Brand Ambassador Dignity &amp; Zero-Tipping</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Our drivers are our brand ambassadors. Kindly treat every SaahiRides partner with full dignity and respect. Tipping is not expected; misconduct, harassment or inhumane treatment is not acceptable.</p></article>
          <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🛡️ Zero-Argument Support Policy</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Please do not argue with drivers. For any trip or billing concern, contact SaahiRides Support immediately on <strong>+91 93479 46026</strong> so the matter can be handled calmly through the official support process.</p></article>
          <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🪪 24-Hour Customer KYC Validation Window</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Kindly allow SaahiRides up to 24 hours to verify your profile and service eligibility—especially for new accounts, subscriptions, outstation trips, and self-drive/rental bookings.</p></article>
        </div>
      </section>

      <section class="panel" style="background:#071931;border:1.5px solid rgba(0,240,255,.45);border-radius:16px;padding:24px;margin:20px 24px">
        <h2 style="text-align:center;margin:0 0 4px;color:#00F0FF">SaahiRides Brand Ambassador &amp; Driver Charter — Partner Policy</h2>
        <p style="text-align:center;margin:0 0 14px;color:#dbe4f4;font-size:14px">75% Fair Partner Earnings, Zero-Argument Escalation &amp; 24-Hour Fleet Verification</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
          <article style="background:#0b1c3d;border:1px solid rgba(0,240,255,.35);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">💼 75% Partner Split &amp; ₹0 Joining Fee</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Every SaahiRides Brand Ambassador retains <strong>75% of the fare</strong> with <strong>25% platform share</strong>—with <strong>₹0 joining fee</strong>, zero hidden deductions, and zero forced surge targets. Tipping is never solicited.</p></article>
          <article style="background:#0b1c3d;border:1px solid rgba(0,240,255,.35);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🛡️ Zero-Argument &amp; Safe Conduct Policy</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Drivers must never argue with passengers over routes, tolls, or billing. In case of any dispute or unverified request, pause calmly and call <strong>SaahiRides Partner Desk on +91 93479 46026</strong> immediately.</p></article>
          <article style="background:#0b1c3d;border:1px solid rgba(0,240,255,.35);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🪪 24-Hour KYC, Fleet Hygiene &amp; Punctuality</h3><p style="margin:0;font-size:14px;color:#dbe4f4">All new driver-partners undergo mandatory <strong>24-hour KYC, DL, RC &amp; insurance verification</strong> before activation. Clean vehicle interiors, courteous etiquette &amp; punctual pickup reporting are required.</p></article>
        </div>
      </section>

      <section class="panel" style="background:#071931;border:1.5px solid rgba(110,231,183,.45);border-radius:16px;padding:24px;margin:20px 24px">
        <h2 style="text-align:center;margin:0 0 12px;color:#6ee7b7">🔧 Free Vehicle Know-How &amp; Safe DIY Home Care Charter</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
          <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">1. Automobile &amp; EV Basics (Free)</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Free guides on Petrol vs. EV drivetrains, CVT gearless systems, regenerative braking &amp; battery health for learners and partners.</p></article>
          <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">2. Safe DIY Checks at Home</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Tyre PSI &amp; tread checks, windshield washer &amp; coolant top-ups, air filter dust cleaning, 12V terminal care &amp; cabin fuse replacement.</p></article>
          <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">3. Workshop Safety Guardrails</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Clear safety rules on high-voltage orange EV cables &amp; brake hydraulics that strictly require a certified workshop. <a href="https://wa.me" target="_blank" rel="noopener" style="color:#FFE27A;font-weight:800">Register Interest →</a></p></article>
        </div>
      </section>
    `);
    const flashBarEl = rootEl.querySelector('.flash-bar') || rootEl.querySelector('footer');
    if (flashBarEl) rootEl.insertBefore(extraWrap, flashBarEl);
    else rootEl.appendChild(extraWrap);
  }

  const filterBtns = fleetSection.querySelectorAll('#saahiFleetFilterBar button');
  const fleetCards = fleetSection.querySelectorAll('#saahiFleetCardsGrid a');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.style.background = '#0b1c3d'; b.style.color = b.dataset.cat === 'premium' ? '#00F0FF' : '#fff'; });
          <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">3. Workshop Safety Guardrails</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Clear safety rules on high-voltage orange EV cables &amp; brake hydraulics that strictly require a certified workshop. <a href="https://wa.me" target="_blank" rel="noopener" style="color:#FFE27A;font-weight:800">Register Interest →</a></p></article>
        </div>
      </section>
    `);
    const flashBarEl = rootEl.querySelector('.flash-bar') || rootEl.querySelector('footer');
    if (flashBarEl) rootEl.insertBefore(extraWrap, flashBarEl);
    else rootEl.appendChild(extraWrap);
  }

  const filterBtns = fleetSection.querySelectorAll('#saahiFleetFilterBar button');
  const fleetCards = fleetSection.querySelectorAll('#saahiFleetCardsGrid a');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.style.background = '#0b1c3d'; b.style.color = b.dataset.cat === 'premium' ? '#00F0FF' : '#fff'; });
      btn.style.background = '#D4AF37'; btn.style.color = '#06122E';
      const cat = btn.dataset.cat;
      fleetCards.forEach(card => { card.style.display = (cat === 'all' || card.dataset.vcat === cat) ? 'flex' : 'none'; });
    });
  });
})();
