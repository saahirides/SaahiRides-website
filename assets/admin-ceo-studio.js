(function initSaahiAdminCeoStudio() {
  const SUPABASE_URL = 'https://supabase.co';
  const SUPABASE_KEY = 'sb_publishable_AKz39xiMSvpcrkowSFJ1EQ_6yo5cCOq';

  // Remove any legacy inline studio cards if present so there are zero duplicates
  ['ceoPanIndiaCard', 'tbStudioCard'].forEach(id => {
    const oldEl = document.getElementById(id);
    if (oldEl) oldEl.remove();
  });

  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'saahiExternalCeoStudio';
  wrapper.innerHTML = `
  <!-- 1. FOUNDER & CEO PAN-INDIA LIVE BROADCAST & STATE COMMAND PANEL -->
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

  <!-- 2. REFINED TALK BACK STUDIO (MIDDLE POSTER TEXT + SAMPLE VOICE + MP4 EXPORT) -->
  <section class="card" id="tbStudioCard" style="border:1.5px solid #f5b82e;background:linear-gradient(145deg,#0b1c3d,#06122e)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div>
        <div class="brand" style="font-size:.82rem">SAAHIRIDES TALK BACK STUDIO</div>
        <h2 style="margin:2px 0;color:#ffe27a">Talking Poster (Middle Open-Space Text), Sample Voice &amp; MP4 Export</h2>
      </div>
      <span class="small">9:16 Reel / Status Canvas Recorder</span>
    </div>

    <div class="grid" style="margin-top:14px">
      <div>
        <label for="tbScriptInput">1. Paste Narration Script (Displayed in Open Middle Space of Poster)</label>
        <textarea id="tbScriptInput" style="min-height:105px" placeholder="Paste script here... e.g., Namaste Hyderabad! SaahiRides par ab zero surge pricing aur zero cancellation ke saath apni sawari book karein."></textarea>

        <div class="grid" style="margin-top:8px">
          <div>
            <label for="tbThirdLang">3rd Marquee Language</label>
            <select id="tbThirdLang">
              <option value="te" selected>Telugu (తెలుగు — TS &amp; AP)</option>
              <option value="kn">Kannada (ಕನ್ನಡ — Karnataka)</option>
            </select>
          </div>
          <div>
            <label for="tbScrollSpeed">Marquee Speed</label>
            <select id="tbScrollSpeed">
              <option value="2.2">Slow &amp; Clear</option>
              <option value="3.8" selected>Medium Reel Pace</option>
              <option value="5.5">Fast Ticker</option>
            </select>
          </div>
        </div>

        <div style="margin-top:12px">
          <button type="button" id="tbBuildBtn">✨ 1. Build 3-Language Marquee</button>
          <button type="button" class="secondary" id="tbToggleScrollBtn">⏸ Pause / Resume</button>
        </div>
      </div>

      <div>
        <label for="tbPosterUpload">2. Upload Poster Image</label>
        <input id="tbPosterUpload" type="file" accept="image/*">

        <label for="tbBgMusicUpload">3. Upload Sample Voice / Narration Audio</label>
        <input id="tbBgMusicUpload" type="file" accept="audio/*">

        <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
          <button type="button" id="tbSpeakPosterBtn">🗣️ Poster Speak (Sample Voice / AI)</button>
          <button type="button" id="tbStopSpeakBtn" style="background:#991b1b;color:#fff">⏹ Stop Voice</button>
        </div>

        <div style="margin-top:12px;padding-top:10px;border-top:1px solid #28436d">
          <button type="button" id="tbRecordExportBtn" style="background:linear-gradient(100deg,#10b981,#34d399);color:#04130d">🎬 Record &amp; Download Video (MP4)</button>
          <button type="button" id="tbStopExportBtn" class="secondary" disabled>⏹ Finish &amp; Save File</button>
          <div id="tbExportStatus" class="small" style="margin-top:6px;color:#ffe27a">Ready to preview or export 9:16 video.</div>
        </div>
        <audio id="tbBgAudio" crossorigin="anonymous" style="width:100%;margin-top:8px" controls></audio>
      </div>
    </div>

    <div style="margin-top:18px;text-align:center;background:#040d21;border:1px solid #28436d;border-radius:14px;padding:16px">
      <div class="small" style="color:#f5b82e;font-weight:800;margin-bottom:8px">LIVE 9:16 REEL &amp; WHATSAPP STATUS PREVIEW CANVAS</div>
      <canvas id="tbVideoCanvas" width="720" height="1280" style="width:min(100%,320px);height:auto;border-radius:14px;border:2px solid #f5b82e;background:#071329"></canvas>
    </div>
  </section>`;

  mainEl.appendChild(wrapper);

  // --- PART A: CEO PAN-INDIA LIVE BROADCAST LOGIC ---
  if (window.supabase && window.supabase.createClient) {
    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage: window.sessionStorage, persistSession: true }
    });
