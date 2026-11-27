(function initSaahiStateHubEnhancements() {
  const containerEl = document.querySelector('.container') || document.querySelector('main');
  if (!containerEl) return;

  // 1. Add Approved Tariff, Premium Protocol & Pan-India Tiers pills to top hub-bar & top-nav
  const hubBar = document.querySelector('.hub-bar');
  if (hubBar && !hubBar.querySelector('a[href="tariff-guide.html"]')) {
    hubBar.insertAdjacentHTML('beforeend', `
      <a href="tariff-guide.html" class="hub-pill">📋 Approved Tariff</a>
      <a href="premium-privilege.html" class="hub-pill" style="border-color:#00F0FF;color:#00F0FF">👑 Premium Protocol</a>
      <a href="pan-india-hub.html" class="hub-pill">🇮🇳 Pan-India Tiers</a>
    `);
  }

  const navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="premium-privilege.html"]')) {
    navLinks.insertAdjacentHTML('beforeend', `
      <a href="tariff-guide.html">Approved Tariff</a>
      <a href="premium-privilege.html" style="color:#00F0FF">👑 Premium Protocol</a>
      <a href="pan-india-hub.html">🇮🇳 Pan-India</a>
    `);
  }

  // 2. Global Garage "Coming Soon" Modal Helper
  function openGarageComingSoonModal() {
    let modal = document.getElementById('saahiGarageModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'saahiGarageModal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,23,.88);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px';
      modal.innerHTML = `
        <div style="max-width:450px;width:100%;background:#0b1c3d;border:2px solid #D4AF37;border-radius:16px;padding:24px;text-align:center;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.65)">
          <div style="font-size:36px;margin-bottom:8px">🔧</div>
          <span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #00F0FF;color:#00F0FF;font-size:11px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase">SaahiRides Central Garage Network</span>
          <h3 style="margin:10px 0 8px;color:#FFE27A;font-size:21px">Coming Soon Across All Hubs!</h3>
          <p style="margin:0 0 16px;font-size:14px;color:#dbe4f4;line-height:1.6">Our centralised vehicle inspection bays, EV diagnostic centers, and partner service hubs are launching shortly across Telangana, Andhra Pradesh &amp; Karnataka.</p>
          <button type="button" id="closeSaahiGarageBtn" style="padding:10px 22px;border-radius:9px;border:0;background:#D4AF37;color:#06122E;font-weight:900;cursor:pointer">Got It</button>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('closeSaahiGarageBtn').onclick = () => { modal.style.display = 'none'; };
      modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.style.display = 'none'; });
    } else {
      modal.style.display = 'flex';
    }
  }

  // 3. Wire all 6 Shared Pan-India Module Cards + inject 7th Premium Protocol Card
  const commonGrid = document.querySelector('.common-grid');
  if (commonGrid && !commonGrid.querySelector('a[href="premium-privilege.html"]')) {
    commonGrid.querySelectorAll('a.common-card').forEach(card => {
      const title = (card.textContent || '').toLowerCase();
      if (title.includes('price')) card.setAttribute('href', 'tariff-guide.html');
      else if (title.includes('vehicle')) card.setAttribute('href', '#saahiStateFleetAndCharters');
      else if (title.includes('pilgrimage') || title.includes('20 destinations')) card.setAttribute('href', 'ceo-blog.html');
      else if (title.includes('garage')) {
        card.setAttribute('href', '#garage-coming-soon');
        card.onclick = (e) => { e.preventDefault(); openGarageComingSoonModal(); };
      }
    });

    commonGrid.insertAdjacentHTML('afterbegin', `
      <a href="premium-privilege.html" class="common-card" style="border-color:#00F0FF"><h3 style="color:#00F0FF">👑 Premium Protocol &amp; Privilege Card</h3><p>≤12-month-old luxury fleet (₹41–₹63/km), ₹10K 50/50 rolling card, 3-hr TAT &amp; downloadable Pilgrimage Pass.</p></a>
    `);
  }

  if (document.getElementById('saahiStateFleetAndCharters')) return;

  // Real photography for every vehicle category (with clean fallback if offline)
  const FLEET_REAL = [
    ['Commuter Bike (Petrol)', 'PETROL • SOLO EXPRESS', '#FFE27A', '₹10 – ₹13 / km', 'Agile 2-wheeler for solo office commutes & quick city hops; instant fuel range across all zones.', 'https://wikimedia.org'],
    ['Scooty (Petrol — Gearless)', 'PETROL • STEP-THROUGH', '#FFE27A', '₹12 – ₹15 / km', 'Flat footboard with front hook space for grocery bags or laptop backpack; smooth automatic ride.', 'https://wikimedia.org'],
    ['Scooty EV (100% Electric)', '⚡ ZERO EMISSION • SILENT EV', '#6ee7b7', '₹16 / km (Dedicated)', 'Battery-powered green-plate scooter: whisper-quiet motor, zero tailpipe smoke & zero vibration for eco-conscious city rides.', 'https://wikimedia.org'],
    ['Auto Rickshaw (Petrol / CNG)', '3-SEATER • OPEN AIR', '#FFE27A', '₹16.50 – ₹19 / km', 'Classic 3-passenger neighborhood & market workhorse with easy hop-on access & zero surge pricing.', 'https://wikimedia.org'],
    ['Electric Auto (100% EV)', '⚡ ZERO SMOKE • SMOOTH EV', '#6ee7b7', '₹19 / km (Dedicated)', 'Next-gen battery e-Auto: zero engine noise, zero exhaust fumes & smooth jerk-free pickup for families & seniors.', 'https://wikimedia.org'],
    ['Non-AC & AC City Cabs (4-Seater)', '4-SEATER • WEATHER-SEALED', '#FFE27A', 'Non-AC ₹19.50–₹22 | AC ₹22.50–₹25/km', 'Enclosed 4-door sedan/hatchback comfort with boot space—choose budget Non-AC or climate-controlled AC.', 'https://wikimedia.org'],
    ['Outstation SUV / Ertiga & Innova Crysta', '6–7 SEATER • ALL-INCLUSIVE', '#FFE27A', 'SUV ₹20–₹22 | Crysta ₹24–₹25/km', 'High-ground-clearance 6–7 seater family & temple-circuit MUVs (300 km both ways / 350 km single way min, all-inclusive).', 'https://wikimedia.org'],
    ['Premium Protocol & Group Van (≤ 12-Mo Old)', '👑 C-SUITE / PSU • ≤ 1 YR FLEET', '#00F0FF', 'Van ₹41 | MPV ₹48 | Sedan ₹63/km', 'Strictly ≤12-month-old Camry/C-Class, Hycross ZX/Carnival & Force Urbania (3-hr TAT; Luxury Caravan on 1-mo request).', 'https://wikimedia.org']
  ];

  const bundle = document.createElement('div');
  bundle.id = 'saahiStateFleetAndCharters';
  bundle.innerHTML = `
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <div style="text-align:center;max-width:880px;margin:0 auto">
      <h2 style="margin:0 0 6px;color:#FFE27A">Visual Vehicle Guide: EV vs. Petrol &amp; Fleet Categories</h2>
      <p style="margin:0;color:#dbe4f4;font-size:14.5px">Real vehicle photos comparing petrol models against zero-emission EVs, city cabs, all-inclusive outstation MUVs &amp; ≤12-month-old Premium Protocol vehicles.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:16px">
      ${FLEET_REAL.map(([name, badge, color, rate, diff, imgUrl]) => `
        <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.38);border-radius:14px;padding:14px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <span style="font-size:10.5px;font-weight:900;color:${color};display:block;margin-bottom:6px">${badge}</span>
            <div style="background:#06122E;border-radius:10px;overflow:hidden;height:135px;margin-bottom:10px;border:1px solid rgba(0,240,255,.22)">
              <img src="${imgUrl}" alt="${name}" loading="lazy" onerror="this.src='logo.png';this.style.objectFit='contain'" style="width:100%;height:100%;object-fit:cover;display:block">
            </div>
            <h3 style="margin:0 0 4px;color:#fff;font-size:16px">${name}</h3>
            <div style="display:inline-block;padding:3px 9px;border-radius:6px;background:#D4AF37;color:#06122E;font-weight:900;font-size:12px;margin-bottom:8px">${rate}</div>
            <p style="margin:0;font-size:13.5px;color:#cbd5e1;line-height:1.5">${diff}</p>
          </div>
        </article>
      `).join('')}
    </div>
  </section>

  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <h2 style="text-align:center;margin:0 0 14px;color:#FFE27A">SaahiRides Passenger Promise (Pillar #4) &amp; Brand Ambassador Driver Charter</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🤝 Brand Ambassador Dignity &amp; Zero-Tipping</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Drivers are our brand ambassadors—treat every partner with full dignity. Tipping is not expected; misconduct or harassment is not acceptable.</p></article>
