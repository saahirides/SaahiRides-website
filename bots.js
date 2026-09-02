(() => {
  const WA = '919347946026';
  const root = document.createElement('div');
  root.id = 'saahi-bots';
  root.innerHTML = `
    <button class="sb-launch" aria-label="Open SaahiRides Assistant">🦅 <span>SaahiRides Assistant</span></button>
    <div class="sb-panel" hidden>
      <div class="sb-head"><div><strong>SaahiRides Assistant</strong><small>Choose what you need</small></div><button class="sb-close" aria-label="Close">×</button></div>
      <div class="sb-body"><div class="sb-msg">Welcome to SaahiRides. Are you a customer or a driver partner?</div><div class="sb-choice"><button data-mode="customer">🚘 Customer</button><button data-mode="driver">🧑‍✈️ Driver Partner</button></div></div>
    </div>`;
  document.body.appendChild(root);

  const vehicleSection = document.createElement('section');
  vehicleSection.id = 'vehicle-categories';
  vehicleSection.className = 'vehicle-section';
  vehicleSection.innerHTML = `
    <div class="vehicle-inner">
      <div class="eyebrow">SAAHIRIDES • VEHICLE CATEGORIES</div>
      <h2 class="vehicle-title">Choose the ride that fits your journey.</h2>
      <p class="vehicle-intro">Our master vehicle &amp; service structure — built for Sawari, Premium, On-Demand and Subscription journeys.</p>
      <div class="vehicle-grid">
        <article class="vehicle-card"><span class="vehicle-icon">🏍️</span><h3>Two-Wheelers</h3><p>6 vehicle types</p><ul><li>Bike Standard</li><li>Bike Priority</li><li>Bike Premium</li><li>Scooty Standard</li><li>Scooty Priority</li><li>Scooty EV</li></ul><small>Sawari / Premium • On-Demand / Subscription • One-Way / Two-Way</small></article>
        <article class="vehicle-card"><span class="vehicle-icon">🛺</span><h3>Autos</h3><p>4 vehicle types</p><ul><li>Auto Standard</li><li>Auto Priority</li><li>Auto Premium</li><li>EV Auto</li></ul><small>Sawari / Premium • On-Demand / Subscription • One-Way / Two-Way</small></article>
        <article class="vehicle-card"><span class="vehicle-icon">🚗</span><h3>Non-AC Cabs</h3><p>5 vehicle types / services</p><ul><li>Non-AC Cab Standard</li><li>Non-AC Cab Priority</li><li>Non-AC Cab Premium</li><li>Non-AC Cab Rentals</li><li>Non-AC Cab Outstation</li></ul><small>Sawari / Premium • On-Demand / Subscription where applicable</small></article>
        <article class="vehicle-card"><span class="vehicle-icon">🚘</span><h3>AC Cabs</h3><p>5 vehicle types / services</p><ul><li>AC Cab Standard</li><li>AC Cab Priority</li><li>AC Cab Premium</li><li>AC Cab Rentals</li><li>AC Cab Outstation</li></ul><small>Sawari / Premium • On-Demand / Subscription where applicable</small></article>
        <article class="vehicle-card wide"><span class="vehicle-icon">👨‍👩‍👧‍👦</span><h3>AC Premium Family / Group</h3><p>Premium family &amp; group vehicles</p><ul class="inline-list"><li>Eeco AC</li><li>Force 10 AC</li><li>Winger AC</li><li>Innova Crysta</li></ul><small>Family Trips • City Tourism • Group Outings • Office Pick-up &amp; Drop • Outstation • Rental</small></article>
        <article class="vehicle-card service"><span class="vehicle-icon">🕐</span><h3>Rental</h3><p>Service category — not a vehicle category</p><ul><li>Non-AC Premium</li><li>AC Premium</li><li>AC Family / Group</li><li>Other applicable categories</li></ul><small>Own pricing, duration, night charges and terms</small></article>
        <article class="vehicle-card service"><span class="vehicle-icon">🛣️</span><h3>Outstation</h3><p>Service category — not a vehicle category</p><ul><li>Non-AC Premium</li><li>AC Premium</li><li>AC Family / Group</li><li>Other applicable categories</li></ul><small>Own pricing, distance calculation, night charges and terms</small></article>
      </div>
      <div class="premium-strip"><strong>Primary Premium Services:</strong> Financial District • Airports • Railway Stations • Outstation • Rental</div>
    </div>`;
  const footer = document.querySelector('footer');
  document.body.insertBefore(vehicleSection, footer || null);

  const panel = root.querySelector('.sb-panel');
  const body = root.querySelector('.sb-body');
  const launch = root.querySelector('.sb-launch');
  root.querySelector('.sb-close').onclick = () => panel.hidden = true;
  launch.onclick = () => panel.hidden = !panel.hidden;

  const state = { mode: '', step: 0, data: {} };
  const customerSteps = [
    ['service', 'What do you need?', [['on_demand','On-Demand Ride'],['subscription','Route-Lock Pass'],['rental','Rental'],['outstation','Outstation']]],
    ['vehicle', 'Choose your vehicle category.', [['two_wheeler','Two-Wheeler'],['auto','Auto'],['non_ac','Non-AC Cab'],['ac','AC Cab'],['family','AC Premium Family / Group']]],
    ['vehicle_type', 'Choose the specific vehicle type.'],
    ['pickup', 'Please enter your pickup location.'],
    ['drop', 'Please enter your drop location.'],
    ['time', 'What pickup date and time do you need?'],
    ['ride_type', 'Is this a Sawari or Sawari Premium journey?', [['sawari','Sawari'],['premium','Sawari Premium']]],
    ['direction', 'Is this one-way or two-way?', [['one_way','One-Way'],['two_way','Two-Way']]],
    ['name', 'Please enter your name.'],
    ['phone', 'Please enter your mobile number.']
  ];
  const driverSteps = [
    ['name','Please enter your full name.'],
    ['phone','Please enter your mobile number.'],
    ['vehicle','Choose your vehicle category.', [['two_wheeler','Two-Wheeler'],['auto','Auto'],['non_ac','Non-AC Cab'],['ac','AC Cab'],['family','AC Premium Family / Group']]],
    ['vehicle_type','Enter your exact vehicle type/model.'],
    ['city','Which city will you operate in?'],
    ['kyc','Enter your KYC/document details (for example: DL, RC, insurance).'],
    ['availability','What days/times are you generally available?']
  ];
  const vehicleOptions = {
    two_wheeler:[['bike_standard','Bike Standard'],['bike_priority','Bike Priority'],['bike_premium','Bike Premium'],['scooty_standard','Scooty Standard'],['scooty_priority','Scooty Priority'],['scooty_ev','Scooty EV']],
    auto:[['auto_standard','Auto Standard'],['auto_priority','Auto Priority'],['auto_premium','Auto Premium'],['ev_auto','EV Auto']],
    non_ac:[['non_ac_standard','Non-AC Cab Standard'],['non_ac_priority','Non-AC Cab Priority'],['non_ac_premium','Non-AC Cab Premium'],['non_ac_rental','Non-AC Cab Rental'],['non_ac_outstation','Non-AC Cab Outstation']],
    ac:[['ac_standard','AC Cab Standard'],['ac_priority','AC Cab Priority'],['ac_premium','AC Cab Premium'],['ac_rental','AC Cab Rental'],['ac_outstation','AC Cab Outstation']],
    family:[['eeco_ac','Eeco AC'],['force_10_ac','Force 10 AC'],['winger_ac','Winger AC'],['innova_crysta','Innova Crysta']]
  };

  function renderQuestion() {
    const steps = state.mode === 'customer' ? customerSteps : driverSteps;
    let current = steps[state.step];
    if (current && current[0] === 'vehicle_type' && state.data.vehicle) current = ['vehicle_type','Choose the specific vehicle type.',vehicleOptions[state.data.vehicle] || []];
    if (!current) return finish();
    const [key, question, options] = current;
    body.innerHTML = `<div class="sb-msg">${question}</div>`;
    if (options && options.length) {
      const wrap = document.createElement('div'); wrap.className = 'sb-choice';
      options.forEach(([value,label]) => { const b=document.createElement('button'); b.textContent=label; b.onclick=()=>answer(key,value,label); wrap.appendChild(b); });
      body.appendChild(wrap);
    } else {
      const form=document.createElement('form'); form.className='sb-form';
      form.innerHTML=`<input required autocomplete="off" placeholder="Type your answer"><button type="submit">Continue</button>`;
      form.onsubmit=(e)=>{e.preventDefault();answer(key,form.querySelector('input').value.trim(),form.querySelector('input').value.trim())};
      body.appendChild(form); form.querySelector('input').focus();
    }
  }

  function answer(key,value,label) {
    state.data[key]=value;
    const reply=document.createElement('div'); reply.className='sb-user'; reply.textContent=label; body.appendChild(reply);
    state.step++;
    setTimeout(renderQuestion,120);
  }

  function finish() {
    const d=state.data;
    const isCustomer=state.mode==='customer';
    const lines=isCustomer ? [
      'SaahiRides Customer Booking Request',
      `Service: ${d.service}`,
      `Vehicle category: ${d.vehicle}`,
      `Vehicle type: ${d.vehicle_type}`,
      `Pickup: ${d.pickup}`,
      `Drop: ${d.drop}`,
      `Pickup time: ${d.time}`,
      `Ride type: ${d.ride_type}`,
      `Direction: ${d.direction}`,
      `Name: ${d.name}`,
      `Mobile: ${d.phone}`
    ] : [
      'SaahiRides Driver Partner Enquiry',
      `Name: ${d.name}`,
      `Mobile: ${d.phone}`,
      `Vehicle category: ${d.vehicle}`,
      `Vehicle type/model: ${d.vehicle_type}`,
      `City: ${d.city}`,
      `KYC/Documents: ${d.kyc}`,
      `Availability: ${d.availability}`
    ];
    const text=encodeURIComponent(lines.join('\n'));
    body.innerHTML=`<div class="sb-msg"><strong>Thank you.</strong><br>Your details are ready. Continue in WhatsApp to send this request to SaahiRides.</div><a class="sb-wa" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${text}">💬 Continue on WhatsApp</a><button class="sb-reset">Start Again</button>`;
    body.querySelector('.sb-reset').onclick=()=>{state.step=0;state.data={};renderQuestion()};
  }

  root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;state.step=0;state.data={};renderQuestion()});

  const style=document.createElement('style');
  style.textContent=`
    .vehicle-section{padding:78px 7%;background:#f7f9fb;color:#14243a}.vehicle-inner{max-width:1450px;margin:auto}.vehicle-section .eyebrow{color:#ff6a00;font-weight:900;letter-spacing:.09em}.vehicle-title{font-size:clamp(30px,4vw,52px);margin:9px 0 10px}.vehicle-intro{max-width:850px;color:#5b6878;line-height:1.6}.vehicle-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:30px}.vehicle-card{background:#fff;border:1px solid #e1e7ed;border-radius:16px;padding:24px;box-shadow:0 8px 25px rgba(0,0,0,.05)}.vehicle-card.wide{grid-column:span 2}.vehicle-card.service{background:#07182b;color:#fff;border-color:#07182b}.vehicle-icon{font-size:28px}.vehicle-card h3{margin:10px 0 5px;font-size:22px}.vehicle-card p{margin:0 0 12px;color:#667486}.vehicle-card.service p{color:#cbd6e3}.vehicle-card ul{margin:0 0 15px;padding-left:19px;line-height:1.65}.vehicle-card small{display:block;color:#68788a;line-height:1.45}.vehicle-card.service small{color:#b9c8d8}.inline-list{display:flex;gap:20px;flex-wrap:wrap;list-style:none;padding:0!important}.premium-strip{margin-top:18px;padding:16px 18px;border-radius:12px;background:#fff0df;color:#7d3500;line-height:1.5}.premium-strip strong{color:#bd4f00}
    #saahi-bots{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:Arial,Helvetica,sans-serif}.sb-launch{border:0;border-radius:999px;background:#ff6a00;color:#fff;padding:14px 19px;font-weight:900;font-size:14px;box-shadow:0 10px 28px rgba(0,0,0,.22);cursor:pointer}.sb-panel{width:min(390px,calc(100vw - 28px));height:min(590px,calc(100vh - 110px));background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);border:1px solid #e7e7e7;margin-bottom:10px}.sb-head{background:#07182b;color:#fff;padding:17px 18px;display:flex;align-items:center;justify-content:space-between}.sb-head strong{display:block;font-size:16px}.sb-head small{display:block;color:#c9d4e1;margin-top:3px}.sb-close{border:0;background:transparent;color:#fff;font-size:26px;cursor:pointer}.sb-body{padding:18px;overflow:auto;height:calc(100% - 73px);background:#f7f9fb}.sb-msg{background:#fff;border:1px solid #e2e7ec;border-radius:14px;padding:13px 14px;line-height:1.45;color:#17283d;margin-bottom:13px}.sb-user{margin:7px 0 12px;margin-left:auto;width:max-content;max-width:85%;background:#ffeadb;color:#7b3200;border-radius:13px;padding:9px 12px}.sb-choice{display:grid;grid-template-columns:1fr;gap:9px}.sb-choice button,.sb-form button,.sb-reset,.sb-wa{border:0;border-radius:10px;padding:12px 13px;font-weight:800;cursor:pointer}.sb-choice button{background:#fff;border:1px solid #ff6a00;color:#a94200;text-align:left}.sb-choice button:hover{background:#fff1e7}.sb-form{display:flex;gap:8px}.sb-form input{min-width:0;flex:1;border:1px solid #cfd8e1;border-radius:10px;padding:12px}.sb-form button{background:#ff6a00;color:#fff}.sb-wa{display:block;background:#20a85a;color:#fff;text-align:center;text-decoration:none;margin-bottom:9px}.sb-reset{width:100%;background:#07182b;color:#fff}
    @media(max-width:900px){.vehicle-grid{grid-template-columns:1fr 1fr}.vehicle-card.wide{grid-column:span 2}}@media(max-width:520px){.vehicle-section{padding:60px 5%}.vehicle-grid{grid-template-columns:1fr}.vehicle-card.wide{grid-column:span 1}.inline-list{display:block}.inline-list li{margin-bottom:5px}#saahi-bots{right:12px;bottom:12px}.sb-launch span{display:none}.sb-launch{width:52px;height:52px;padding:0;font-size:21px}.sb-panel{width:calc(100vw - 24px);height:min(590px,calc(100vh - 90px))}}
  `;
  document.head.appendChild(style);
})();
