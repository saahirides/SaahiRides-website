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

  const panel = root.querySelector('.sb-panel');
  const body = root.querySelector('.sb-body');
  const launch = root.querySelector('.sb-launch');
  root.querySelector('.sb-close').onclick = () => panel.hidden = true;
  launch.onclick = () => panel.hidden = !panel.hidden;

  const state = { mode: '', step: 0, data: {} };
  const customerSteps = [
    ['service', 'What do you need?', [['on_demand','On-Demand Ride'],['subscription','Route-Lock Pass'],['rental','Rental'],['outstation','Outstation']]],
    ['vehicle', 'Choose your vehicle category.', [['bike','Bike'],['scooty','Scooty'],['auto','Auto'],['non_ac','Non AC Cab'],['ac','AC Cab']]],
    ['pickup', 'Please enter your pickup location.'],
    ['drop', 'Please enter your drop location.'],
    ['time', 'What pickup date and time do you need?'],
    ['ride_type', 'Is this a Sawari or Sawari Premium ride?', [['sawari','Sawari'],['premium','Sawari Premium']]],
    ['name', 'Please enter your name.'],
    ['phone', 'Please enter your mobile number.']
  ];
  const driverSteps = [
    ['name','Please enter your full name.'],
    ['phone','Please enter your mobile number.'],
    ['vehicle','Choose your vehicle category.', [['bike','Bike'],['scooty','Scooty'],['auto','Auto'],['non_ac','Non AC Cab'],['ac','AC Cab']]],
    ['city','Which city will you operate in?'],
    ['kyc','Enter your KYC/document details (for example: DL, RC, insurance).'],
    ['availability','What days/times are you generally available?']
  ];

  function renderQuestion() {
    const steps = state.mode === 'customer' ? customerSteps : driverSteps;
    const current = steps[state.step];
    if (!current) return finish();
    const [key, question, options] = current;
    body.innerHTML = `<div class="sb-msg">${question}</div>`;
    if (options) {
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
      `Vehicle: ${d.vehicle}`,
      `Pickup: ${d.pickup}`,
      `Drop: ${d.drop}`,
      `Pickup time: ${d.time}`,
      `Ride type: ${d.ride_type}`,
      `Name: ${d.name}`,
      `Mobile: ${d.phone}`
    ] : [
      'SaahiRides Driver Partner Enquiry',
      `Name: ${d.name}`,
      `Mobile: ${d.phone}`,
      `Vehicle: ${d.vehicle}`,
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
    #saahi-bots{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:Arial,Helvetica,sans-serif}
    .sb-launch{border:0;border-radius:999px;background:#ff6a00;color:#fff;padding:14px 19px;font-weight:900;font-size:14px;box-shadow:0 10px 28px rgba(0,0,0,.22);cursor:pointer}
    .sb-panel{width:min(390px,calc(100vw - 28px));height:min(590px,calc(100vh - 110px));background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);border:1px solid #e7e7e7;margin-bottom:10px}
    .sb-head{background:#07182b;color:#fff;padding:17px 18px;display:flex;align-items:center;justify-content:space-between}.sb-head strong{display:block;font-size:16px}.sb-head small{display:block;color:#c9d4e1;margin-top:3px}.sb-close{border:0;background:transparent;color:#fff;font-size:26px;cursor:pointer}
    .sb-body{padding:18px;overflow:auto;height:calc(100% - 73px);background:#f7f9fb}.sb-msg{background:#fff;border:1px solid #e2e7ec;border-radius:14px;padding:13px 14px;line-height:1.45;color:#17283d;margin-bottom:13px}.sb-user{margin:7px 0 12px;margin-left:auto;width:max-content;max-width:85%;background:#ffeadb;color:#7b3200;border-radius:13px;padding:9px 12px}.sb-choice{display:grid;grid-template-columns:1fr;gap:9px}.sb-choice button,.sb-form button,.sb-reset,.sb-wa{border:0;border-radius:10px;padding:12px 13px;font-weight:800;cursor:pointer}.sb-choice button{background:#fff;border:1px solid #ff6a00;color:#a94200;text-align:left}.sb-choice button:hover{background:#fff1e7}.sb-form{display:flex;gap:8px}.sb-form input{min-width:0;flex:1;border:1px solid #cfd8e1;border-radius:10px;padding:12px}.sb-form button{background:#ff6a00;color:#fff}.sb-wa{display:block;background:#20a85a;color:#fff;text-align:center;text-decoration:none;margin-bottom:9px}.sb-reset{width:100%;background:#07182b;color:#fff}
    @media(max-width:520px){#saahi-bots{right:12px;bottom:12px}.sb-launch span{display:none}.sb-launch{width:52px;height:52px;padding:0;font-size:21px}.sb-panel{width:calc(100vw - 24px);height:min(590px,calc(100vh - 90px))}}
  `;
  document.head.appendChild(style);
})();
