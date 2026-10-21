/* ExpatBase — business-recruitment ribbon.
   A subtle, dismissible bottom bar inviting business owners to list for free.
   Shows once the visitor has settled (short delay OR a bit of scrolling),
   never blocks the page, and remembers dismissal so it won't nag.
   Not shown on the business-facing / admin pages.
   No dependencies. Bar + styles are built lazily. */
(function () {
  if (window.__ebBizPromo) return;
  window.__ebBizPromo = true;

  // Pages where the promo should NOT appear (business-facing / internal).
  var EXCLUDE = [
    'for-businesses.html',
    'for-businesses-sk.html',
    'business-dashboard.html',
    'business-login.html',
    'admin.html',
    'profile.html'
  ];
  var STORE_KEY = 'eb_bizpromo_dismissed';
  var DELAY_MS = 6000;      // show after this long on the page…
  var SCROLL_PX = 700;      // …or once the visitor scrolls this far, whichever first.

  var path = (location.pathname || '').toLowerCase();
  var i;
  for (i = 0; i < EXCLUDE.length; i++) {
    if (path === '/' + EXCLUDE[i] || path.indexOf('/' + EXCLUDE[i]) === path.length - EXCLUDE[i].length - 1) return;
  }

  // Already dismissed?
  try {
    if (localStorage.getItem(STORE_KEY) === '1') return;
  } catch (e) { /* storage blocked — proceed, just won't persist */ }

  var bar, shown = false, timer = null;

  function injectCSS() {
    if (document.getElementById('eb-bp-css')) return;
    var s = document.createElement('style');
    s.id = 'eb-bp-css';
    s.textContent = [
      '#eb-bp{position:fixed;left:0;right:0;bottom:0;z-index:9500;transform:translateY(120%);transition:transform .4s cubic-bezier(.22,.61,.36,1);font-family:"DM Sans",system-ui,sans-serif;pointer-events:none}',
      '#eb-bp.show{transform:none}',
      '#eb-bp-inner{pointer-events:auto;max-width:1120px;margin:0 auto 14px;background:linear-gradient(135deg,#1A4F8A,#0F3360);color:#fff;border-radius:16px;box-shadow:0 14px 44px rgba(10,18,35,.34);display:flex;align-items:center;gap:16px;padding:14px 18px;border:1px solid rgba(255,255,255,.08)}',
      '#eb-bp-icon{flex:0 0 auto;width:40px;height:40px;border-radius:12px;background:rgba(46,158,107,.22);display:flex;align-items:center;justify-content:center;font-size:20px}',
      '#eb-bp-txt{flex:1 1 auto;min-width:0;line-height:1.35}',
      '#eb-bp-txt strong{display:block;font-family:"Urbanist",system-ui,sans-serif;font-weight:800;font-size:1rem}',
      '#eb-bp-txt span{display:block;font-size:.86rem;opacity:.82}',
      '#eb-bp-cta{flex:0 0 auto;background:linear-gradient(135deg,#2E9E6B,#1D7A50);color:#fff;text-decoration:none;font-family:"Urbanist",system-ui,sans-serif;font-weight:700;font-size:.95rem;padding:11px 20px;border-radius:999px;white-space:nowrap;transition:opacity .15s,transform .15s}',
      '#eb-bp-cta:hover{opacity:.93;transform:translateY(-1px)}',
      '#eb-bp-x{flex:0 0 auto;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:16px;line-height:1;cursor:pointer;transition:background .15s}',
      '#eb-bp-x:hover{background:rgba(255,255,255,.24)}',
      '@media(max-width:620px){',
      '#eb-bp-inner{flex-wrap:wrap;gap:10px 12px;margin:0 10px 10px;padding:13px 14px}',
      '#eb-bp-icon{display:none}',
      '#eb-bp-txt{flex:1 1 100%;order:1}',
      '#eb-bp-cta{order:3;flex:1 1 auto;text-align:center;padding:11px 16px}',
      '#eb-bp-x{order:2;margin-left:auto}',
      '#eb-bp-txt span{font-size:.82rem}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function build() {
    injectCSS();
    bar = document.createElement('div');
    bar.id = 'eb-bp';
    bar.setAttribute('role', 'complementary');
    bar.setAttribute('aria-label', 'List your business on ExpatBase');
    bar.innerHTML =
      '<div id="eb-bp-inner">' +
        '<div id="eb-bp-icon" aria-hidden="true">📍</div>' +
        '<div id="eb-bp-txt">' +
          '<strong>Own a business? Listing is free forever.</strong>' +
          '<span>Get discovered by expats in your city — add your business today.</span>' +
        '</div>' +
        '<a id="eb-bp-cta" href="for-businesses.html">Add your business &rarr;</a>' +
        '<button id="eb-bp-x" aria-label="Dismiss">&#x2715;</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.querySelector('#eb-bp-x').addEventListener('click', dismiss);
    bar.querySelector('#eb-bp-cta').addEventListener('click', remember);
  }

  function show() {
    if (shown) return;
    shown = true;
    if (timer) { clearTimeout(timer); timer = null; }
    window.removeEventListener('scroll', onScroll);
    build();
    // force reflow so the transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.classList.add('show'); });
    });
  }

  function remember() {
    try { localStorage.setItem(STORE_KEY, '1'); } catch (e) {}
  }

  function dismiss() {
    remember();
    if (bar) {
      bar.classList.remove('show');
      setTimeout(function () { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); }, 420);
    }
  }

  function onScroll() {
    if (window.pageYOffset > SCROLL_PX) show();
  }

  function start() {
    timer = setTimeout(show, DELAY_MS);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
