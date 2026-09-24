/* ExpatBase — dynamic business listings from Supabase
   Reads window.EB_CATEGORY, loads approved businesses for that category,
   takes over the page's listings grid: removes any hardcoded/sample cards
   and shows real businesses, or a clean empty state.
   Also records privacy-first, anonymous engagement events (profile views,
   profile clicks, website click-throughs) to power monthly Pro stats.
   Self-contained: no external dependency, safe to fail. */
(function () {
  var SB = 'https://etxqrlrqbjcbjmitnspv.supabase.co';
  var KEY = 'sb_publishable_i38f7jyt2HYOjUTNuOsklg_aMofdDvE';
  var CATEGORY = window.EB_CATEGORY;
  if (!CATEGORY) return;

  /* ── anonymous visitor id (no personal data) ── */
  function vid() {
    try {
      var v = localStorage.getItem('eb_vid');
      if (!v) {
        v = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : ('v' + Date.now() + Math.random().toString(36).slice(2));
        localStorage.setItem('eb_vid', v);
      }
      return v;
    } catch (e) { return null; }
  }
  /* dedupe profile impressions to once per visitor per business per day */
  function seenToday(id) {
    try {
      var day = new Date().toISOString().slice(0, 10);
      var o = JSON.parse(localStorage.getItem('eb_seen') || '{}');
      if (o.day !== day) o = { day: day, ids: {} };
      if (o.ids[id]) return true;
      o.ids[id] = 1;
      localStorage.setItem('eb_seen', JSON.stringify(o));
      return false;
    } catch (e) { return false; }
  }
  function track(type, bizId) {
    if (!bizId) return;
    try {
      fetch(SB + '/rest/v1/events', {
        method: 'POST',
        headers: {
          apikey: KEY, Authorization: 'Bearer ' + KEY,
          'Content-Type': 'application/json', Prefer: 'return=minimal'
        },
        body: JSON.stringify({ business_id: bizId, type: type, visitor_id: vid() }),
        keepalive: true
      }).catch(function () {});
    } catch (e) { /* never break the page */ }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function initials(n) {
    return String(n || '?').trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w[0]; }).join('').toUpperCase();
  }
  function findGrid() {
    return document.querySelector('[data-eb-grid]')
      || document.querySelector('[id$="-grid"]')
      || (function () {
        var secs = document.querySelectorAll('.cards-section');
        for (var i = 0; i < secs.length; i++) if (secs[i].querySelector('.empty-state')) return secs[i];
        return secs[0] || null;
      })();
  }
  function injectCSS() {
    if (document.getElementById('ebl-css')) return;
    var st = document.createElement('style');
    st.id = 'ebl-css';
    st.textContent =
    ".ebl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px}" +
    ".ebl-card{background:#fff;border:1px solid #E4EBF3;border-radius:18px;padding:22px;box-shadow:0 2px 16px rgba(26,79,138,.08);display:flex;flex-direction:column;gap:12px;font-family:'DM Sans',system-ui,sans-serif;transition:transform .2s,box-shadow .2s}" +
    ".ebl-card:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(26,79,138,.16)}" +
    ".ebl-head{display:flex;gap:14px;align-items:center}" +
    ".ebl-av{width:52px;height:52px;border-radius:14px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Urbanist',system-ui,sans-serif;font-weight:800;font-size:18px;background:linear-gradient(135deg,#1A4F8A,#2E9E6B)}" +
    ".ebl-name{font-family:'Urbanist',system-ui,sans-serif;font-weight:700;font-size:1.1rem;color:#0F3360;line-height:1.2}" +
    ".ebl-cat{font-size:.82rem;color:#6B7A90}" +
    ".ebl-badges{display:flex;gap:6px;flex-wrap:wrap}" +
    ".ebl-badge{font-family:'Urbanist',system-ui,sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.04em;padding:3px 9px;border-radius:999px}" +
    ".ebl-en{background:#E6F7EF;color:#1D7A50}" +
    ".ebl-prem{background:linear-gradient(135deg,#0F3360,#2563EB);color:#fff}" +
    ".ebl-desc{font-size:.92rem;color:#3B4A5E;margin:0;line-height:1.5}" +
    ".ebl-contact{display:flex;flex-direction:column;gap:7px;margin-top:auto}" +
    ".ebl-row{display:flex;gap:9px;align-items:flex-start;font-size:.9rem;color:#3B4A5E;text-decoration:none}" +
    ".ebl-row span{color:#2E9E6B;flex:0 0 auto}" +
    "a.ebl-row:hover{color:#1A4F8A}" +
    ".ebl-links{display:flex;gap:8px;flex-wrap:wrap;font-size:.86rem;padding-top:10px;border-top:1px solid #EEF3F8}" +
    ".ebl-links a{color:#1A4F8A;font-weight:600;text-decoration:none}" +
    ".ebl-links a:hover{text-decoration:underline}" +
    ".ebl-empty{text-align:center;max-width:520px;margin:16px auto;padding:44px 26px;background:#fff;border:1px solid #E4EBF3;border-radius:20px;box-shadow:0 2px 16px rgba(26,79,138,.06);font-family:'DM Sans',system-ui,sans-serif}" +
    ".ebl-empty h3{font-family:'Urbanist',system-ui,sans-serif;font-weight:800;color:#0F3360;font-size:1.3rem;margin:0 0 10px}" +
    ".ebl-empty p{color:#6B7A90;margin:0 0 20px;line-height:1.55}" +
    ".ebl-empty a{display:inline-block;background:linear-gradient(135deg,#1D7A50,#2E9E6B);color:#fff;font-family:'Urbanist',system-ui,sans-serif;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px}";
    document.head.appendChild(st);
  }
  function card(b) {
    /* founding partners get Pro-level display (website/socials) during launch */
    var prem = b.plan === 'premium' || b.plan === 'founding';
    var badges = [
      b.english_speaking ? '<span class="ebl-badge ebl-en">English-speaking</span>' : '',
      prem ? '<span class="ebl-badge ebl-prem">Premium</span>' : ''
    ].join('');
    var contact = [
      b.phone ? '<a href="tel:' + esc(b.phone) + '" class="ebl-row"><span>☎</span>' + esc(b.phone) + '</a>' : '',
      b.email ? '<a href="mailto:' + esc(b.email) + '" class="ebl-row"><span>✉</span>' + esc(b.email) + '</a>' : '',
      b.address ? '<div class="ebl-row"><span>◎</span>' + esc(b.address) + '</div>' : ''
    ].join('');
    var extra = '';
    if (prem) {
      var s = b.social_links || {};
      var links = [
        b.website ? '<a class="ebl-weblink" href="' + esc(b.website) + '" target="_blank" rel="noopener">Website</a>' : '',
        s.instagram ? '<a class="ebl-weblink" href="' + esc(s.instagram) + '" target="_blank" rel="noopener">Instagram</a>' : '',
        s.facebook ? '<a class="ebl-weblink" href="' + esc(s.facebook) + '" target="_blank" rel="noopener">Facebook</a>' : ''
      ].filter(Boolean).join(' · ');
      if (links) extra = '<div class="ebl-links">' + links + '</div>';
    }
    return '<div class="ebl-card" data-eb-id="' + esc(b.id) + '">' +
      '<div class="ebl-head"><div class="ebl-av">' + esc(initials(b.name)) + '</div>' +
      '<div class="ebl-hd"><div class="ebl-name">' + esc(b.name) + '</div>' +
      '<div class="ebl-cat">' + esc(b.category) + '</div></div></div>' +
      (badges.replace(/\s/g, '') ? '<div class="ebl-badges">' + badges + '</div>' : '') +
      (b.description ? '<p class="ebl-desc">' + esc(b.description) + '</p>' : '') +
      '<div class="ebl-contact">' + contact + '</div>' + extra + '</div>';
  }
  function setupTracking(holder) {
    /* impressions: one 'view' per visitor per business per day */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            io.unobserve(en.target);
            var id = en.target.getAttribute('data-eb-id');
            if (id && !seenToday(id)) track('view', id);
          }
        });
      }, { threshold: 0.5 });
      holder.querySelectorAll('.ebl-card').forEach(function (c) { io.observe(c); });
    }
    /* clicks: website click-throughs, contact clicks, and profile clicks */
    holder.addEventListener('click', function (e) {
      var cardEl = e.target.closest('.ebl-card');
      if (!cardEl) return;
      var id = cardEl.getAttribute('data-eb-id');
      if (!id) return;
      var link = e.target.closest('a');
      if (link) {
        var href = link.getAttribute('href') || '';
        if (link.classList.contains('ebl-weblink') || /^https?:/i.test(href)) { track('website_click', id); return; }
        if (/^tel:|^mailto:/i.test(href)) { track('contact_click', id); return; }
      }
      track('profile_click', id);
    });
  }
  function render(rows) {
    var grid = findGrid();
    if (!grid) return;
    injectCSS();
    // Take over the grid: remove any hardcoded/sample cards or empty state.
    grid.innerHTML = '';
    if (rows && rows.length) {
      var holder = document.createElement('div');
      holder.className = 'ebl-grid';
      holder.innerHTML = rows.map(card).join('');
      grid.appendChild(holder);
      setupTracking(holder);
    } else {
      grid.innerHTML =
        '<div class="ebl-empty"><h3>No listings yet</h3>' +
        '<p>Be among the first verified English-speaking professionals in this category to appear here.</p>' +
        '<a href="index.html#submit">List your business →</a></div>';
    }
  }
  function load() {
    var url = SB + '/rest/v1/businesses?status=eq.approved&category=eq.' +
      encodeURIComponent(CATEGORY) + '&select=*&order=plan.desc,created_at.desc';
    fetch(url, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) { if (rows) render(Array.isArray(rows) ? rows : []); })
      .catch(function () { /* leave page untouched on failure */ });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else { load(); }
})();
