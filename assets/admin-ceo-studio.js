(function initSaahiAdminCeoStudio() {
  const SUPABASE_URL = 'https://supabase.co';
  const SUPABASE_KEY = 'sb_publishable_AKz39xiMSvpcrkowSFJ1EQ_6yo5cCOq';

  const oldEl = document.getElementById('saahiExternalCeoStudio');
  if (oldEl) oldEl.remove();

  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'saahiExternalCeoStudio';
  wrapper.innerHTML = `
  <!-- PART A: FOUNDER & CEO PAN-INDIA LIVE BROADCAST & STATE COMMAND PANEL -->
  <section class="card" id="ceoPanIndiaCard" style="border:1.5px solid #00f0ff;background:linear-gradient(145deg,#091d3e,#06122e)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div>
        <div class="brand" style="font-size:.82rem;color:#00f0ff">FOUNDER &amp; CEO CENTRAL COMMAND</div>
        <h2 style="margin:2px 0;color:#ffe27a">Pan-India Live Broadcast, State Offers &amp; Executive Rollup</h2>
      </div>
      <button type="button" class="secondary" id="ceoLoadAllBtn">🔄 Load Live State Data</button>
    </div>

    <div class="grid" style="margin-top:14px">
      <div class="tile"><div class="small">PAN-INDIA STAFF</div><h3 id="ceoTotalStaff">—</h3><p class="small" id="ceoStaffSplit">Sign in above, then click Load Live State Data</p></div>
      <div class="tile"><div class="small">PAN-INDIA REVENUE (PRIVATE)</div><h3 id="ceoTotalRev">—</h3><p class="small">Restricted to authenticated Owner/Admin</p></div>
      <div class="tile"><div class="small">ACTIVE TRAVEL PARTNERS</div><h3 id="ceoTotalPartners">—</h3><p class="small">State-managed pilgrimage &amp; tour desks</p></div>
    </div>

    <div class="policy" style="margin-top:14px">
      <h3 style="color:#00f0ff;margin-bottom:8px">📡 Push Live CEO Message, State Offer &amp; News Ticker</h3>
      <div class="grid">
        <div>
          <label for="ceoTargetState">Choose Target Hub</label>
          <select id="ceoTargetState">
            <option value="HYD">1. Hyderabad Core HQ (Default)</option>
            <option value="TS" selected>2. Telangana State (Hyderabad)</option>
            <option value="AP">3. Andhra Pradesh (Amaravati)</option>
            <option value="KA">4. Karnataka (Bengaluru)</option>
          </select>
        </div>
        <div>
          <label for="ceoTickerInput">Live State Broadcast Ticker</label>
          <input id="ceoTickerInput" placeholder="e.g., TELANGANA BROADCAST: Warangal & Karimnagar booking live">
        </div>
      </div>

      <div class="grid">
        <div>
          <label for="ceoMsgEn">CEO Message (English)</label>
          <textarea id="ceoMsgEn" style="min-height:85px" placeholder="Enter live CEO message in English..."></textarea>
        </div>
        <div>
          <label for="ceoMsgReg">CEO Message (Regional Language: Telugu / Kannada)</label>
          <textarea id="ceoMsgReg" style="min-height:85px" placeholder="Enter regional language translation..."></textarea>
        </div>
      </div>

      <div class="grid">
        <div>
          <label for="ceoOfferEn">Live State Offer (English)</label>
          <input id="ceoOfferEn" placeholder="e.g., Flat 6% Off State Pilgrimage Packages for First 100 Families">
        </div>
        <div>
          <label for="ceoOfferReg">Live State Offer (Regional Language)</label>
          <input id="ceoOfferReg" placeholder="Regional offer banner text...">
        </div>
      </div>

      <div style="margin-top:12px">
        <button type="button" id="ceoPublishBroadcastBtn" style="background:linear-gradient(100deg,#10b981,#34d399);color:#04130d">🚀 Push Live to State Page Now</button>
        <span id="ceoBroadcastStatus" class="small" style="margin-left:10px;color:#ffe27a">Ready. Sign in above, then click Load Live State Data.</span>
      </div>
    </div>

    <div class="policy" style="border-bottom:0;padding-bottom:0">
      <h3 style="color:#ffe27a;margin-bottom:8px">🛕 Publish State Travel Partner Package</h3>
      <div class="grid">
        <div>
          <label for="pkgState">State Hub</label>
          <select id="pkgState">
            <option value="TS">Telangana (TS)</option>
            <option value="AP">Andhra Pradesh (AP)</option>
            <option value="KA">Karnataka (KA)</option>
          </select>
        </div>
        <div>
          <label for="pkgAgency">State Travel Partner Agency Name</label>
          <input id="pkgAgency" placeholder="e.g., Tirupati Balaji Partner Travels">
        </div>
        <div>
          <label for="pkgTitle">Package Title</label>
          <input id="pkgTitle" placeholder="e.g., Srisailam & Mahanandi 2-Day Yatra">
        </div>
      </div>
      <div class="grid">
        <div>
          <label for="pkgCat">Category</label>
          <select id="pkgCat">
            <option value="Pilgrimage">Pilgrimage</option>
            <option value="State Tour">State Tour</option>
            <option value="Family Combo">Family Combo</option>
          </select>
        </div>
        <div>
          <label for="pkgDuration">Duration</label>
          <input id="pkgDuration" placeholder="e.g., 2 Days / 1 Night">
        </div>
        <div>
          <label for="pkgPrice">Starting Price (₹ INR)</label>
          <input id="pkgPrice" type="number" placeholder="e.g., 4999">
        </div>
      </div>
      <label for="pkgHighlights">Package Highlights &amp; Inclusions</label>
      <input id="pkgHighlights" placeholder="e.g., Dedicated AC SUV, experienced temple route driver, transparent tolls & parking">
      <div style="margin-top:12px">
        <button type="button" id="ceoAddPkgBtn">➕ Approve &amp; Publish Partner Package</button>
      </div>
    </div>
  </section>

  <!-- PART C: SMART MOBILE PHOTO UPLOADER (OCR LABEL CHECK + VISUAL SEARCH + AUTO-RENAME) -->
  <section class="card" style="border:1.5px solid #25D366;background:linear-gradient(145deg,#091d3e,#06122e)">
    <div class="brand" style="font-size:.82rem;color:#6ee7b7">SMART MOBILE PHOTO UPLOADER &amp; AUTO-NAMER</div>
    <h2 style="margin:2px 0;color:#ffe27a">Upload from Mobile → Auto-Detect Label / Visual Search → Save Named to Supabase</h2>
    <p class="small">Reads any signboard/label in your mobile photo (OCR), suggests a clean landmark filename, or lets you verify via Google Visual Search before publishing to ceo-blog.html.</p>
    <div class="grid" style="margin-top:10px">
      <div>
        <label for="mobDestSelect">1. Choose Destination (01–20)</label>
        <select id="mobDestSelect">
          <option value="08" selected>08 · Jaisalmer (Golden Fort &amp; Thar Desert)</option>
          <option value="01">01 · Panchavati, Nashik</option>
          <option value="02">02 · Puri &amp; Coastal Odisha</option>
          <option value="03">03 · Vellore Golden Temple</option>
          <option value="04">04 · Tirupati Balaji</option>
          <option value="05">05 · Hyderabad &amp; Telangana</option>
          <option value="06">06 · Ramoji &amp; Yadadri</option>
          <option value="07">07 · Divine Pilgrimage Pass</option>
          <option value="09">09 · Mysuru &amp; Bengaluru</option>
          <option value="10">10 · Ooty &amp; Coonoor</option>
          <option value="11">11 · Madurai &amp; Rameswaram</option>
          <option value="12">12 · Vijayawada &amp; Amaravati</option>
          <option value="13">13 · Srisailam &amp; Ahobilam</option>
          <option value="14">14 · Araku Valley &amp; Vizag</option>
          <option value="15">15 · Bhadrachalam &amp; Papi Hills</option>
          <option value="16">16 · Warangal &amp; Ramappa</option>
          <option value="17">17 · Hampi &amp; Badami</option>
          <option value="18">18 · Dharmasthala &amp; Coorg</option>
          <option value="19">19 · Shirdi &amp; Ellora</option>
          <option value="20">20 · Kerala (Munnar &amp; Alleppey)</option>
        </select>
      </div>
      <div>
        <label for="mobDestFile">2. Pick Photo from Mobile Gallery / Camera</label>
        <input id="mobDestFile" type="file" accept="image/*">
      </div>
    </div>
    <div style="margin-top:10px">
      <label for="mobDetectedName">3. Detected / Verified Landmark Name</label>
      <input id="mobDetectedName" placeholder="Will auto-detect label from image or use destination name…">
    </div>
    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center">
      <button type="button" id="mobUploadDestBtn" style="background:linear-gradient(100deg,#10b981,#34d399);color:#04130d">📲 Rename, Upload &amp; Publish Live</button>
      <button type="button" id="mobVisualSearchBtn" class="secondary" disabled>🔍 Search Landmark on Google</button>
      <span id="mobDestStatus" class="small" style="color:#ffe27a">Pick a mobile photo to auto-check its label.</span>
    </div>
  </section>`;

  mainEl.appendChild(wrapper);

  if (!window.supabase || !window.supabase.createClient) return;
  const sb = window.supabase.createClient('https://uzwubbzlytqqewqibobr.supabase.co', SUPABASE_KEY, {
    auth: { storage: window.sessionStorage, persistSession: true }
  });

  // Part A Handlers
  const stateSelect = document.getElementById('ceoTargetState');
  const statusEl = document.getElementById('ceoBroadcastStatus');
  let broadcastCache = {};

  function populateForm(code) {
    const row = broadcastCache[code];
    if (!row) return;
    document.getElementById('ceoTickerInput').value = row.state_news_ticker || '';
    document.getElementById('ceoMsgEn').value = row.ceo_message_en || '';
    document.getElementById('ceoMsgReg').value = row.ceo_message_reg || '';
    document.getElementById('ceoOfferEn').value = row.active_offer_en || '';
    document.getElementById('ceoOfferReg').value = row.active_offer_reg || '';
  }

  async function loadPanIndiaData() {
    statusEl.textContent = 'Loading live Pan-India broadcasts & private metrics…';
    const [bRes, mRes] = await Promise.all([
      sb.from('state_live_broadcasts').select('*'),
      sb.from('state_command_metrics').select('*')
    ]);
    if (bRes.data) {
      broadcastCache = {};
      bRes.data.forEach(r => { broadcastCache[r.state_code] = r; });
      populateForm(stateSelect.value);
    }
    if (mRes.data && mRes.data.length) {
      let totalStaff = 0, totalRev = 0, totalPartners = 0;
      const splitLines = [];
      mRes.data.forEach(m => {
        totalStaff += Number(m.staff_count || 0);
        totalRev += Number(m.monthly_revenue_inr || 0);
        totalPartners += Number(m.active_travel_partners || 0);
        splitLines.push(m.state_code + ': ' + m.staff_count + ' staff');
      });
      document.getElementById('ceoTotalStaff').textContent = totalStaff + ' Total';
      document.getElementById('ceoStaffSplit').textContent = splitLines.join(' • ');
      document.getElementById('ceoTotalRev').textContent = '₹' + totalRev.toLocaleString('en-IN');
      document.getElementById('ceoTotalPartners').textContent = totalPartners + ' Verified';
      statusEl.textContent = '✓ Live Pan-India state data & private metrics loaded.';
    } else {
      statusEl.textContent = 'Sign in to Admin above first so your authenticated session unlocks private metrics.';
    }
  }

  stateSelect.addEventListener('change', () => populateForm(stateSelect.value));
  document.getElementById('ceoLoadAllBtn').onclick = loadPanIndiaData;

  document.getElementById('ceoPublishBroadcastBtn').onclick = async () => {
    const code = stateSelect.value;
    statusEl.textContent = 'Pushing live update to ' + code + '…';
    const { error } = await sb.from('state_live_broadcasts').update({
      state_news_ticker: document.getElementById('ceoTickerInput').value.trim(),
      ceo_message_en: document.getElementById('ceoMsgEn').value.trim(),
      ceo_message_reg: document.getElementById('ceoMsgReg').value.trim(),
      active_offer_en: document.getElementById('ceoOfferEn').value.trim(),
      active_offer_reg: document.getElementById('ceoOfferReg').value.trim(),
      updated_at: new Date().toISOString()
    }).eq('state_code', code);

    statusEl.textContent = error
      ? '⛔ Push failed (confirm Admin sign-in & RLS SQL): ' + error.message
      : '✅ Live on ' + code + ' hub immediately!';
    if (!error) await loadPanIndiaData();
  };

  document.getElementById('ceoAddPkgBtn').onclick = async () => {
    const payload = {
      state_code: document.getElementById('pkgState').value,
      partner_agency_name: document.getElementById('pkgAgency').value.trim(),
      package_title: document.getElementById('pkgTitle').value.trim(),
      package_category: document.getElementById('pkgCat').value,
      duration_label: document.getElementById('pkgDuration').value.trim() || '1 Day',
      starting_price_inr: Number(document.getElementById('pkgPrice').value || 0),
      highlights: document.getElementById('pkgHighlights').value.trim(),
      is_approved: true
    };
    if (!payload.partner_agency_name || !payload.package_title) {
      statusEl.textContent = 'Enter Partner Agency Name and Package Title first.';
      return;
    }
    const { error } = await sb.from('state_partner_packages').insert(payload);
    statusEl.textContent = error
      ? '⛔ Could not publish package: ' + error.message
      : '✅ Partner package published live to ' + payload.state_code + ' hub!';
    if (!error) ['pkgAgency', 'pkgTitle', 'pkgDuration', 'pkgPrice', 'pkgHighlights'].forEach(id => { document.getElementById(id).value = ''; });
  };

  // Part C Handlers (Smart Mobile Photo Auto-Namer)
  let lastUploadedPublicUrl = '';
  const mobFileEl = document.getElementById('mobDestFile');
  const mobNameEl = document.getElementById('mobDetectedName');
  const mobDestEl = document.getElementById('mobDestSelect');
  const mobStatusEl = document.getElementById('mobDestStatus');
  const mobSearchBtn = document.getElementById('mobVisualSearchBtn');

  function getDefaultDestSlug() {
    const label = mobDestEl.options.item(mobDestEl.selectedIndex)?.text || 'destination';
    return label.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  }

  mobFileEl.addEventListener('change', async () => {
    const file = mobFileEl.files ? mobFileEl.files.item(0) : null;
    if (!file) return;
    mobStatusEl.textContent = 'Checking photo for visible signboard / text label (OCR)…';
    mobNameEl.value = getDefaultDestSlug();

    try {
      if (!window.Tesseract) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://jsdelivr.net';
          s.onload = resolve;
          s.onerror = () => reject(new Error('OCR unavailable'));
          document.head.appendChild(s);
        });
      }
      const res = await window.Tesseract.recognize(file, 'eng');
      const rawText = (res && res.data && res.data.text ? res.data.text : '').replace(/\s+/g, ' ').trim();
      const cleanLabel = rawText.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
      if (cleanLabel.length >= 4) {
        mobNameEl.value = cleanLabel.slice(0, 65).toLowerCase().replace(/\s+/g, '-');
        mobStatusEl.textContent = '✓ Label detected in photo: "' + cleanLabel.slice(0, 50) + '". Ready to save!';
      } else {
        mobStatusEl.textContent = 'No text label inside photo — named from destination (' + mobNameEl.value + ').';
      }
    } catch {
      mobStatusEl.textContent = 'Named from destination (' + mobNameEl.value + '). Ready to upload!';
    }
  });

  mobSearchBtn.onclick = () => {
    if (lastUploadedPublicUrl) window.open('https://google.com' + encodeURIComponent(lastUploadedPublicUrl), '_blank', 'noopener');
  };

  document.getElementById('mobUploadDestBtn').onclick = async () => {
    const destId = mobDestEl.value;
    const file = mobFileEl.files ? mobFileEl.files.item(0) : null;
    if (!file) { mobStatusEl.textContent = 'Select a photo from your mobile first.'; return; }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const baseSlug = (mobNameEl.value.trim() || getDefaultDestSlug()).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
    const finalFileName = destId + '-' + baseSlug + '-' + new Date().toISOString().slice(0, 10) + '.' + ext;
    const storagePath = 'approved/destinations/' + finalFileName;

    mobStatusEl.textContent = 'Saving renamed file "' + finalFileName + '" to Supabase…';
    const { error: upErr } = await sb.storage.from('social-images').upload(storagePath, file, {
      contentType: file.type || 'image/jpeg',
      upsert: true
    });
    if (upErr) { mobStatusEl.textContent = '⛔ Upload failed (sign in to Admin above first): ' + upErr.message; return; }

    lastUploadedPublicUrl = sb.storage.from('social-images').getPublicUrl(storagePath).data.publicUrl;
    mobSearchBtn.disabled = false;

    const { error: dbErr } = await sb.from('ceo_destination_photos').upsert({
      dest_id: destId,
      image_url: lastUploadedPublicUrl,
      caption: baseSlug.replace(/-/g, ' '),
      updated_at: new Date().toISOString()
    });
    mobStatusEl.textContent = dbErr
      ? '⛔ File saved as ' + finalFileName + ', but DB link failed: ' + dbErr.message
      : '✅ Saved as "' + finalFileName + '" & live on ceo-blog.html!';
    if (!dbErr) mobFileEl.value = '';
  };
})();
