/* SaahiRides site-wide promotions launcher — November 2026 */
(function(){
  if (document.getElementById('saahi-promo-launcher')) return;
  const style = document.createElement('style');
  style.textContent = `
  #saahi-promo-launcher{position:fixed;right:16px;bottom:18px;z-index:99999;font-family:inherit}
  #saahi-booking-strip{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:99997;display:flex;gap:8px;width:min(520px,calc(100vw - 190px));font-family:inherit}
  #saahi-booking-strip a{flex:1;min-width:0;text-align:center;text-decoration:none;border-radius:999px;padding:12px 13px;font-size:13px;line-height:1.2;font-weight:900;box-shadow:0 8px 22px #0008;white-space:nowrap}
  #saahi-booking-strip .saahi-book-ride{background:linear-gradient(110deg,#d4af37,#ffe27a);color:#07152f;border:1px solid #ffe27a}
  #saahi-booking-strip .saahi-plan-trip{background:linear-gradient(110deg,#123b70,#2f80c9);color:#fff;border:1px solid #9ed0ff}
  #saahi-driver-floater{position:fixed;left:16px;bottom:18px;z-index:99998;border:2px solid #9ed0ff;border-radius:999px;padding:12px 16px;background:linear-gradient(110deg,#123b70,#2f80c9,#b9e2ff);color:#06152b;font-weight:900;font-size:13px;box-shadow:0 8px 26px #0008;cursor:pointer;text-decoration:none;animation:saahiPromoPulse 1.9s ease-in-out infinite}\n  #saahi-promo-toggle{border:2px solid #ffe27a;border-radius:999px;padding:12px 17px;background:linear-gradient(110deg,#b8860b,#ffe27a,#d4af37);color:#07152f;font-weight:900;font-size:14px;box-shadow:0 8px 26px #0008,0 0 0 3px #ffc10722;cursor:pointer;animation:saahiPromoPulse 1.8s ease-in-out infinite}
  @keyframes saahiPromoPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.055);box-shadow:0 10px 30px #ffc10766}}
  #saahi-promo-panel{display:none;position:absolute;right:0;bottom:60px;width:min( min(360px, calc(100vw - 28px)), 360px);max-height:min(76vh,650px);overflow:auto;background:#0b1832;color:#fff;border:1px solid #d4af37;border-radius:18px;padding:16px;box-shadow:0 18px 50px #000b}
  #saahi-promo-panel.open{display:block}
  .saahi-promo-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
  .saahi-promo-head strong{color:#ffd45b;font-size:17px}
  #saahi-promo-close{border:0;border-radius:50%;width:32px;height:32px;font-size:20px;background:#fff;color:#07152f;cursor:pointer}
  .saahi-promo-card{border:1px solid #ffffff28;border-radius:13px;padding:13px;margin:10px 0;background:linear-gradient(145deg,#172d50,#101c35)}
  .saahi-promo-card h3{margin:3px 0 7px;color:#ffd45b;font-size:16px}
  .saahi-promo-card p{margin:5px 0;color:#e5edf8;font-size:13px;line-height:1.5}
  .saahi-promo-tag{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#63e8f1;font-weight:900}
  .saahi-promo-link{display:block;text-align:center;text-decoration:none;margin-top:10px;padding:10px 12px;border-radius:9px;background:#25d366;color:#062014;font-size:13px;font-weight:900}
  @media(max-width:480px){#saahi-driver-floater{left:10px;bottom:12px;font-size:11px;padding:11px 12px}#saahi-promo-launcher{right:10px;bottom:12px}#saahi-promo-toggle{font-size:12px;padding:11px 13px}#saahi-promo-panel{right:0}
    #saahi-booking-strip{bottom:62px;width:calc(100vw - 20px);gap:7px}
    #saahi-booking-strip a{font-size:12px;padding:12px 8px}
  }
  @media(prefers-reduced-motion:reduce){#saahi-promo-toggle{animation:none}}
  `;
  document.head.appendChild(style);
  const root=document.createElement('div');root.id='saahi-promo-launcher';
  root.innerHTML=`
    <section id="saahi-promo-panel" aria-label="SaahiRides promotions">
      <div class="saahi-promo-head"><strong>SaahiRides November Bonanza</strong><button id="saahi-promo-close" aria-label="Close promotions">×</button></div>
      <article class="saahi-promo-card"><span class="saahi-promo-tag">Customer bonanza</span><h3>Save on your next ride</h3><p><b>5% OFF</b> every eligible subscription, <b>5% OFF</b> on-demand city rides during your first month, and <b>6% OFF</b> tours for the first 100 customers in November.</p><a class="saahi-promo-link" href="offers.html">Explore customer offers</a></article>
      <article class="saahi-promo-card"><span class="saahi-promo-tag">Customer referral reward</span><h3>Refer a friend. Both benefit.</h3><p>New customer: 2.5% this month + 2.5% next month. Referring customer: 5% this month + 2.5% next month. One referral per person per month. Conditions apply.</p><a class="saahi-promo-link" href="offers.html">See referral details</a></article>
    </section>
    <button id="saahi-promo-toggle" type="button" aria-expanded="false" aria-controls="saahi-promo-panel">🎁 OFFERS & BONANZA</button>`;
  document.body.appendChild(root);
  if (!/upload-images\\.html$/i.test(location.pathname)) {
    const bookingStrip=document.createElement('nav');
    bookingStrip.id='saahi-booking-strip';
    bookingStrip.setAttribute('aria-label','Quick booking actions');
    const bookHref=/fare-estimator\\.html$/i.test(location.pathname)?'https://wa.me/919347946026?text=BOOK%0AHello%20SaahiRides%2C%20I%20want%20to%20book%20a%20ride.':'fare-estimator.html';
    const planHref=/travel-tours\\.html$/i.test(location.pathname)?'#state-trip-builder':'travel-tours.html';
    bookingStrip.innerHTML='<a class="saahi-book-ride" href="'+bookHref+'">🚕 BOOK MY RIDE</a><a class="saahi-plan-trip" href="'+planHref+'">🧭 PLAN MY TRIP</a>';
    document.body.appendChild(bookingStrip);
  }
  const driverLink=document.createElement("a");driverLink.id="saahi-driver-floater";driverLink.href="driver.html#driver-recruitment";driverLink.textContent="🚘 DRIVER RECRUITMENT";driverLink.setAttribute("aria-label","Open SaahiRides driver recruitment card");document.body.appendChild(driverLink);
  const toggle=root.querySelector('#saahi-promo-toggle'),panel=root.querySelector('#saahi-promo-panel');
  function close(){panel.classList.remove('open');toggle.setAttribute('aria-expanded','false')}
  toggle.addEventListener('click',function(){const open=panel.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
  root.querySelector('#saahi-promo-close').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();