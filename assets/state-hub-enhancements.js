(function initSaahiStateHubEnhancements() {
  const containerEl = document.querySelector('.container') || document.querySelector('main');
  if (!containerEl) return;

  const hubBar = document.querySelector('.hub-bar');
  if (hubBar && !hubBar.querySelector('a[href="tariff-guide.html"]')) {
    hubBar.insertAdjacentHTML('beforeend', `<a href="tariff-guide.html" class="hub-pill">📋 Approved Tariff</a><a href="premium-privilege.html" class="hub-pill" style="border-color:#00F0FF;color:#00F0FF">👑 Premium Protocol</a><a href="pan-india-hub.html" class="hub-pill">🇮🇳 Pan-India Tiers</a>`);
  }

  const navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="premium-privilege.html"]')) {
    navLinks.insertAdjacentHTML('beforeend', `<a href="tariff-guide.html">Approved Tariff</a><a href="premium-privilege.html" style="color:#00F0FF">👑 Premium Protocol</a><a href="pan-india-hub.html">🇮🇳 Pan-India</a>`);
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
    commonGrid.querySelectorAll('a.common-card').forEach(c => {
      const t = (c.textContent || '').toLowerCase();
      if (t.includes('price')) c.setAttribute('href', 'tariff-guide.html');
      else if (t.includes('vehicle')) c.setAttribute('href', '#saahiStateFleetAndCharters');
      else if (t.includes('pilgrimage') || t.includes('20 destinations')) c.setAttribute('href', 'ceo-blog.html');
      else if (t.includes('garage')) { c.setAttribute('href', '#garage-coming-soon'); c.onclick = (e) => { e.preventDefault(); openGarageModal(); }; }
    });
    commonGrid.insertAdjacentHTML('afterbegin', `<a href="premium-privilege.html" class="common-card" style="border-color:#00F0FF"><h3 style="color:#00F0FF">👑 Premium Protocol &amp; Privilege Card</h3><p>≤12-month-old luxury fleet (₹41–₹63/km), ₹10K 50/50 rolling card, 3-hr TAT &amp; downloadable Pilgrimage Pass.</p></a>`);
  }

  if (document.getElementById('saahiStateFleetAndCharters')) return;

  const FLEET = [
    ['Commuter Bike (Petrol)', 'PETROL • SOLO EXPRESS', '#FFE27A', '₹10 – ₹13 / km', 'Agile 2-wheeler for solo office commutes & quick city hops; instant fuel range.', 'https://wikimedia.org'],
    ['Scooty (Petrol — Gearless)', 'PETROL • STEP-THROUGH', '#FFE27A', '₹12 – ₹15 / km', 'Flat footboard with front hook space for grocery bags or laptop backpack.', 'https://wikimedia.org'],
    ['Scooty EV (100% Electric)', '⚡ ZERO EMISSION • SILENT EV', '#6ee7b7', '₹16 / km (Dedicated)', 'Battery-powered green scooter: whisper-quiet motor & zero tailpipe smoke.', 'https://wikimedia.org'],
    ['Auto Rickshaw (Petrol / CNG)', '3-SEATER • OPEN AIR', '#FFE27A', '₹16.50 – ₹19 / km', 'Classic 3-passenger neighborhood & market workhorse with zero surge pricing.', 'https://wikimedia.org'],
    ['Electric Auto (100% EV)', '⚡ ZERO SMOKE • SMOOTH EV', '#6ee7b7', '₹19 / km (Dedicated)', 'Next-gen battery e-Auto: zero engine noise, zero fumes & smooth pickup.', 'https://wikimedia.org'],
    ['Non-AC & AC City Cabs', '4-SEATER • WEATHER-SEALED', '#FFE27A', 'Non-AC ₹19.50–₹22 | AC ₹22.50–₹25/km', 'Enclosed 4-door sedan/hatchback comfort with boot space—Non-AC or AC.', 'https://wikimedia.org'],
    ['Outstation SUV / Innova Crysta', '6–7 SEATER • ALL-INCLUSIVE', '#FFE27A', 'SUV ₹20–₹22 | Crysta ₹24–₹25/km', '6–7 seater family & temple-circuit MUVs (300 km both ways / 350 km single way min).', 'https://wikimedia.org'],
    ['Premium Protocol & Group Van', '👑 C-SUITE / PSU • ≤ 1 YR FLEET', '#00F0FF', 'Van ₹41 | MPV ₹48 | Sedan ₹63/km', 'Strictly ≤12-month-old Camry/C-Class, Hycross ZX & Force Urbania (3-hr TAT).', 'https://wikimedia.org']
  ];

  const bundle = document.createElement('div');
  bundle.id = 'saahiStateFleetAndCharters';
  bundle.innerHTML = `
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <h2 style="text-align:center;margin:0 0 6px;color:#FFE27A">Visual Vehicle Guide: EV vs. Petrol &amp; Fleet Categories</h2>
    <p style="text-align:center;margin:0 0 16px;color:#dbe4f4;font-size:14.5px">Real vehicle photos comparing petrol models against zero-emission EVs, city cabs, outstation MUVs &amp; ≤12-month-old Premium Protocol vehicles.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
      ${FLEET.map(([name, badge, color, rate, diff, img]) => `<article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.38);border-radius:14px;padding:14px"><span style="font-size:10.5px;font-weight:900;color:${color};display:block;margin-bottom:6px">${badge}</span><div style="background:#06122E;border-radius:10px;overflow:hidden;height:135px;margin-bottom:10px"><img src="${img}" alt="${name}" loading="lazy" onerror="this.src='logo.png';this.style.objectFit='contain'" style="width:100%;height:100%;object-fit:cover;display:block"></div><h3 style="margin:0 0 4px;color:#fff;font-size:16px">${name}</h3><div style="display:inline-block;padding:3px 9px;border-radius:6px;background:#D4AF37;color:#06122E;font-weight:900;font-size:12px;margin-bottom:8px">${rate}</div><p style="margin:0;font-size:13.5px;color:#cbd5e1">${diff}</p></article>`).join('')}
    </div>
  </section>
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <h2 style="text-align:center;margin:0 0 14px;color:#FFE27A">SaahiRides Passenger Promise (Pillar #4) &amp; Brand Ambassador Driver Charter</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🤝 Brand Ambassador Dignity &amp; Zero-Tipping</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Drivers are our brand ambassadors—treat every partner with full dignity. Tipping is not expected; misconduct or harassment is not acceptable.</p></article>
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">🛡️ Zero-Argument Support (+91 93479 46026)</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Neither passengers nor drivers should argue over routes or billing. Pause calmly and call SaahiRides Support immediately on <strong>+91 93479 46026</strong>.</p></article>
      <article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.4);border-radius:14px;padding:18px"><h3 style="margin:0 0 6px;color:#FFE27A;font-size:16.5px">💼 75% Partner Split &amp; 24-Hour KYC</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Drivers retain <strong>75% fare share</strong> with <strong>₹0 joining fee</strong>. Both passengers (new/outstation/rental) and drivers undergo <strong>24-hour KYC/DL/RC verification</strong>.</p></article>
    </div>
  </section>
  <section class="panel" style="background:#071931;border:1.5px solid rgba(110,231,183,.45);border-radius:16px;padding:24px;margin:20px 24px">
    <h2 style="text-align:center;margin:0 0 12px;color:#6ee7b7">🔧 Free Vehicle Know-How &amp; Safe DIY Home Care Charter</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">1. Automobile &amp; EV Basics (Free)</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Free guides on Petrol vs. EV drivetrains, CVT gearless systems, regenerative braking &amp; battery health for learners and partners.</p></article>
      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">2. Safe DIY Checks at Home</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Tyre PSI &amp; tread checks, windshield washer &amp; coolant top-ups, air filter dust cleaning, 12V terminal care &amp; cabin fuse replacement.</p></article>
      <article style="background:#0b1c3d;border:1px solid rgba(110,231,183,.38);border-radius:14px;padding:16px"><h3 style="margin:0 0 6px;color:#6ee7b7;font-size:16px">3. Workshop Safety Guardrails</h3><p style="margin:0;font-size:14px;color:#dbe4f4">Clear safety rules on high-voltage orange EV cables &amp; brake hydraulics that strictly require a certified workshop. <a href="https://wa.me" target="_blank" rel="noopener" style="color:#FFE27A;font-weight:800">Register Interest →</a></p></article>
    </div>
  </section>`;

  const flashBarEl = containerEl.querySelector('.flash-bar') || containerEl.querySelector('footer');
  if (flashBarEl) containerEl.insertBefore(bundle, flashBarEl);
  else containerEl.appendChild(bundle);
})();
