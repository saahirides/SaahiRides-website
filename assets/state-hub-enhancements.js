(function initSaahiStateHubEnhancements() {
  const containerEl = document.querySelector('.container') || document.querySelector('main');
  if (!containerEl) return;

  const hubBar = document.querySelector('.hub-bar');
  if (hubBar && !hubBar.querySelector('a[href="tariff-guide.html"]')) {
    hubBar.insertAdjacentHTML('beforeend', `
      <a href="tariff-guide.html" class="hub-pill">📋 Approved Tariff</a>
      <a href="premium-privilege.html" class="hub-pill" style="border-color:#00F0FF;color:#00F0FF">👑 Premium Protocol</a>
    `);
  }

  const navLinks = document.querySelector('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="premium-privilege.html"]')) {
    navLinks.insertAdjacentHTML('beforeend', `
      <a href="tariff-guide.html">Approved Tariff</a>
      <a href="premium-privilege.html" style="color:#00F0FF">👑 Premium Protocol</a>
    `);
  }

  const commonGrid = document.querySelector('.common-grid');
  if (commonGrid && !commonGrid.querySelector('a[href="premium-privilege.html"]')) {
    commonGrid.querySelectorAll('a.common-card').forEach(card => {
      const title = (card.textContent || '').toLowerCase();
      if (title.includes('price')) card.setAttribute('href', 'tariff-guide.html');
      else if (title.includes('vehicle')) card.setAttribute('href', '#saahiStateFleetAndCharters');
      else if (title.includes('pilgrimage') || title.includes('20 destinations')) card.setAttribute('href', 'ceo-blog.html');
      else if (title.includes('garage')) {
        card.setAttribute('href', '#garage-coming-soon');
        card.addEventListener('click', (e) => {
          e.preventDefault();
          let modal = document.getElementById('saahiGarageModal');
          if (!modal) {
            modal = document.createElement('div');
            modal.id = 'saahiGarageModal';
            modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,23,.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px';
            modal.innerHTML = `<div style="max-width:440px;width:100%;background:#0b1c3d;border:2px solid #D4AF37;border-radius:16px;padding:24px;text-align:center;color:#fff"><div style="font-size:34px;margin-bottom:8px">🔧</div><h3 style="margin:6px 0 8px;color:#FFE27A;font-size:21px">SaahiRides Central Garage Network — Coming Soon!</h3><p style="margin:0 0 16px;font-size:14px;color:#dbe4f4">Centralised vehicle inspection bays, EV diagnostics &amp; partner service hubs launching shortly across Telangana, Andhra Pradesh &amp; Karnataka.</p><button type="button" onclick="document.getElementById('saahiGarageModal').style.display='none'" style="padding:10px 20px;border-radius:9px;border:0;background:#D4AF37;color:#06122E;font-weight:900;cursor:pointer">Got It</button></div>`;
            document.body.appendChild(modal);
          } else { modal.style.display = 'flex'; }
        });
      }
    });

    commonGrid.insertAdjacentHTML('afterbegin', `
      <a href="premium-privilege.html" class="common-card" style="border-color:#00F0FF"><h3 style="color:#00F0FF">👑 Premium Protocol &amp; Privilege Card</h3><p>≤12-month-old luxury fleet (₹41–₹63/km), ₹10K 50/50 rolling card, 3-hr TAT &amp; Luxury Caravan.</p></a>
    `);
  }

  if (document.getElementById('saahiStateFleetAndCharters')) return;

  const FLEET = [
    ['Commuter Bike (Petrol)', 'PETROL • SOLO EXPRESS', '#FFE27A', '₹10 – ₹13 / km', 'Agile 2-wheeler for solo office commutes & quick city hops; instant fuel range across all zones.', '<circle cx="38" cy="54" r="16" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="142" cy="54" r="16" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M38 54 L72 30 L108 30 L126 54 M72 30 L62 18 L82 18 M108 30 L122 18 L136 22" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round"/><rect x="74" y="24" width="28" height="7" rx="3" fill="#D4AF37"/>'],
    ['Scooty (Petrol — Gearless)', 'PETROL • STEP-THROUGH', '#FFE27A', '₹12 – ₹15 / km', 'Flat footboard with front hook space for grocery bags or laptop backpack; smooth automatic ride.', '<circle cx="40" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="140" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M40 55 Q42 32 68 32 L106 32 Q122 32 128 18 L138 55" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round"/><rect x="56" y="26" width="32" height="7" rx="3" fill="#D4AF37"/>'],
    ['Scooty EV (100% Electric)', '⚡ ZERO EMISSION • SILENT EV', '#6ee7b7', '₹16 / km (Dedicated)', 'Battery-powered green scooter: whisper-quiet motor, zero tailpipe smoke & zero vibration for eco-conscious city rides.', '<circle cx="40" cy="55" r="14" fill="none" stroke="#6ee7b7" stroke-width="4"/><circle cx="140" cy="55" r="14" fill="none" stroke="#6ee7b7" stroke-width="4"/><path d="M40 55 Q42 32 68 32 L106 32 Q122 32 128 18 L138 55" fill="none" stroke="#00F0FF" stroke-width="4" stroke-linecap="round"/><polygon points="88,10 78,26 87,26 83,40 97,22 88,22" fill="#6ee7b7"/>'],
    ['Auto Rickshaw (Petrol / CNG)', '3-SEATER • OPEN AIR', '#FFE27A', '₹16.50 – ₹19 / km', 'Classic 3-passenger neighborhood & market workhorse with easy hop-on access & zero surge pricing.', '<circle cx="44" cy="56" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="138" cy="56" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M32 52 L32 24 Q32 14 48 14 L112 14 L132 34 L144 52 Z" fill="none" stroke="#00F0FF" stroke-width="3.5"/><line x1="78" y1="14" x2="78" y2="52" stroke="#D4AF37" stroke-width="3"/>'],
    ['Electric Auto (100% EV)', '⚡ ZERO SMOKE • SMOOTH EV', '#6ee7b7', '₹19 / km (Dedicated)', 'Next-gen battery e-Auto: zero engine noise, zero exhaust fumes & smooth jerk-free pickup for families & seniors.', '<circle cx="44" cy="56" r="13" fill="none" stroke="#6ee7b7" stroke-width="4"/><circle cx="138" cy="56" r="13" fill="none" stroke="#6ee7b7" stroke-width="4"/><path d="M32 52 L32 24 Q32 14 48 14 L112 14 L132 34 L144 52 Z" fill="none" stroke="#00F0FF" stroke-width="3.5"/><polygon points="88,18 80,31 87,31 84,43 96,28 89,28" fill="#6ee7b7"/>'],
    ['Non-AC & AC City Cabs (4-Seater)', '4-SEATER • WEATHER-SEALED', '#FFE27A', 'Non-AC ₹19.50–₹22 | AC ₹22.50–₹25/km', 'Enclosed 4-door sedan/hatchback comfort with boot space—choose budget Non-AC or climate-controlled AC.', '<circle cx="44" cy="55" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="136" cy="55" r="13" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M22 50 L28 34 L54 18 L120 18 L146 34 L158 50 Z" fill="none" stroke="#00F0FF" stroke-width="3.5"/><rect x="74" y="10" width="28" height="7" rx="2" fill="#D4AF37"/>'],
    ['Outstation SUV / Ertiga & Innova Crysta', '6–7 SEATER • ALL-INCLUSIVE', '#FFE27A', 'SUV ₹20–₹22 | Crysta ₹24–₹25/km', 'High-ground-clearance 6–7 seater family & temple-circuit MUVs (300 km both ways / 350 km single way min, all-inclusive).', '<circle cx="42" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><circle cx="138" cy="55" r="14" fill="none" stroke="#FFE27A" stroke-width="4"/><path d="M18 50 L24 28 L46 15 L142 15 L158 34 L162 50 Z" fill="none" stroke="#00F0FF" stroke-width="3.5"/><line x1="92" y1="15" x2="92" y2="50" stroke="#D4AF37" stroke-width="2.5"/>'],
    ['Premium Protocol & Group Van (≤ 12-Mo Old)', '👑 C-SUITE / PSU • ≤ 1 YR FLEET', '#00F0FF', 'Van ₹41 | MPV ₹48 | Sedan ₹63/km', 'Strictly ≤12-month-old Camry/C-Class, Hycross ZX/Carnival & Force Urbania (3-hr TAT; Luxury Caravan on 1-mo request).', '<circle cx="42" cy="55" r="14" fill="none" stroke="#00F0FF" stroke-width="4"/><circle cx="138" cy="55" r="14" fill="none" stroke="#00F0FF" stroke-width="4"/><path d="M18 50 L22 20 L150 20 L162 36 L162 50 Z" fill="none" stroke="#FFE27A" stroke-width="3.5"/><polygon points="90,4 94,12 103,12 96,17 98,25 90,20 82,25 84,17 77,12 86,12" fill="#D4AF37"/>']
  ];

  const bundle = document.createElement('div');
  bundle.id = 'saahiStateFleetAndCharters';
  bundle.innerHTML = `
  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <div style="text-align:center;max-width:880px;margin:0 auto">
      <h2 style="margin:0 0 6px;color:#FFE27A">Visual Vehicle Guide: EV vs. Petrol &amp; Fleet Categories</h2>
      <p style="margin:0;color:#dbe4f4;font-size:14.5px">Compare petrol vehicles against zero-emission EVs, city cabs, all-inclusive outstation MUVs &amp; ≤12-month-old Premium Protocol vehicles.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:16px">
      ${FLEET.map(([name, badge, color, rate, diff, svg]) => `<article style="background:#0b1c3d;border:1px solid rgba(212,175,55,.38);border-radius:14px;padding:16px"><span style="font-size:10.5px;font-weight:900;color:${color};display:block;margin-bottom:6px">${badge}</span><div style="text-align:center;background:#06122E;border-radius:10px;padding:8px;margin-bottom:10px"><svg viewBox="0 0 180 76" width="160" height="68">${svg}</svg></div><h3 style="margin:0 0 4px;color:#fff;font-size:16px">${name}</h3><div style="display:inline-block;padding:3px 9px;border-radius:6px;background:#D4AF37;color:#06122E;font-weight:900;font-size:12px;margin-bottom:8px">${rate}</div><p style="margin:0;font-size:13.5px;color:#cbd5e1">${diff}</p></article>`).join('')}
    </div>
  </section>

  <section class="panel" style="background:#071931;border:1px solid rgba(212,175,55,.42);border-radius:16px;padding:24px;margin:20px 24px">
    <h2 style="text-align:center;margin:0 0 14px;color:#FFE27A">SaahiRides Passenger Promise (Pillar #4) &amp; Brand Ambassador Driver Charter</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
