/* ExpatBase — lightweight contact modal.
   Any element with [data-contact-open] opens a contact form popup.
   Submits to /send-email (Cloudflare Pages Function) which emails
   hello@expatbase.sk via Brevo, with Reply-To set to the sender.
   No dependencies. Modal + styles are built lazily on first open. */
(function () {
  if (window.__ebContact) return;
  window.__ebContact = true;

  var modal, form, statusEl;

  function injectCSS() {
    if (document.getElementById('eb-contact-css')) return;
    var s = document.createElement('style');
    s.id = 'eb-contact-css';
    s.textContent = [
      '#eb-c-ov{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(10,18,35,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
      '#eb-c-ov.open{display:flex}',
      '#eb-c-card{width:100%;max-width:440px;background:#fff;border-radius:20px;box-shadow:0 24px 70px rgba(10,18,35,.35);overflow:hidden;font-family:"DM Sans",system-ui,sans-serif;animation:eb-c-in .22s ease}',
      '@keyframes eb-c-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
      '#eb-c-head{background:linear-gradient(135deg,#1A4F8A,#2E9E6B);padding:22px 24px;color:#fff;position:relative}',
      '#eb-c-head h3{margin:0;font-family:"Urbanist",system-ui,sans-serif;font-weight:800;font-size:1.25rem}',
      '#eb-c-head p{margin:4px 0 0;font-size:.88rem;opacity:.9}',
      '#eb-c-x{position:absolute;top:16px;right:16px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:18px;line-height:1;cursor:pointer}',
      '#eb-c-x:hover{background:rgba(255,255,255,.3)}',
      '#eb-c-body{padding:22px 24px 26px}',
      '.eb-c-field{margin-bottom:14px}',
      '.eb-c-field label{display:block;font-size:.8rem;font-weight:600;color:#3B4A5E;margin-bottom:6px}',
      '.eb-c-field input,.eb-c-field textarea{width:100%;box-sizing:border-box;border:1px solid #D9E2EC;border-radius:12px;padding:11px 13px;font-size:.95rem;font-family:inherit;color:#0F3360;background:#fff;transition:border-color .15s,box-shadow .15s}',
      '.eb-c-field input:focus,.eb-c-field textarea:focus{outline:0;border-color:#2E9E6B;box-shadow:0 0 0 3px rgba(46,158,107,.15)}',
      '.eb-c-field textarea{resize:vertical;min-height:110px}',
      '#eb-c-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}',
      '#eb-c-send{width:100%;border:0;border-radius:999px;padding:13px;font-family:"Urbanist",system-ui,sans-serif;font-weight:700;font-size:1rem;color:#fff;background:linear-gradient(135deg,#1D7A50,#2E9E6B);cursor:pointer;transition:opacity .15s}',
      '#eb-c-send:hover{opacity:.92}',
      '#eb-c-send:disabled{opacity:.6;cursor:default}',
      '#eb-c-status{font-size:.88rem;margin-top:12px;text-align:center;min-height:1.1em}',
      '#eb-c-status.err{color:#c0392b}',
      '#eb-c-done{text-align:center;padding:14px 4px}',
      '#eb-c-done .eb-c-tick{width:56px;height:56px;border-radius:50%;background:#E6F7EF;color:#1D7A50;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:28px}',
      '#eb-c-done h4{margin:0 0 6px;font-family:"Urbanist",system-ui,sans-serif;font-weight:800;color:#0F3360;font-size:1.15rem}',
      '#eb-c-done p{margin:0;color:#6B7A90;font-size:.92rem}'
    ].join('');
    document.head.appendChild(s);
  }

  function build() {
    injectCSS();
    modal = document.createElement('div');
    modal.id = 'eb-c-ov';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Contact ExpatBase');
    modal.innerHTML =
      '<div id="eb-c-card">' +
        '<div id="eb-c-head">' +
          '<button id="eb-c-x" aria-label="Close">&#x2715;</button>' +
          '<h3>Get in touch</h3>' +
          '<p>Questions, feedback, or a business to suggest? We read every message.</p>' +
        '</div>' +
        '<div id="eb-c-body">' +
          '<form id="eb-c-form" novalidate>' +
            '<div class="eb-c-field"><label for="eb-c-name">Your name</label><input id="eb-c-name" name="name" type="text" autocomplete="name" required></div>' +
            '<div class="eb-c-field"><label for="eb-c-email">Your email</label><input id="eb-c-email" name="email" type="email" autocomplete="email" required></div>' +
            '<div class="eb-c-field"><label for="eb-c-msg">Message</label><textarea id="eb-c-msg" name="message" required></textarea></div>' +
            '<div id="eb-c-hp"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div>' +
            '<button id="eb-c-send" type="submit">Send message</button>' +
            '<div id="eb-c-status" role="status"></div>' +
          '</form>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    form = modal.querySelector('#eb-c-form');
    statusEl = modal.querySelector('#eb-c-status');

    modal.querySelector('#eb-c-x').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    form.addEventListener('submit', submit);
  }

  function open(e) {
    if (e) e.preventDefault();
    if (!modal) build();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var n = modal.querySelector('#eb-c-name'); if (n) n.focus(); }, 60);
  }
  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function submit(e) {
    e.preventDefault();
    var data = {
      type: 'contact',
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      company: form.company.value
    };
    statusEl.className = '';
    if (!data.name || !data.email || !data.message) {
      statusEl.className = 'err'; statusEl.textContent = 'Please fill in all fields.'; return;
    }
    var btn = form.querySelector('#eb-c-send');
    btn.disabled = true; btn.textContent = 'Sending…'; statusEl.textContent = '';
    fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r); })
      .then(function () { done(); })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send message';
        statusEl.className = 'err';
        statusEl.textContent = 'Something went wrong. Please email hello@expatbase.sk directly.';
      });
  }

  function done() {
    modal.querySelector('#eb-c-body').innerHTML =
      '<div id="eb-c-done"><div class="eb-c-tick">&#10003;</div>' +
      '<h4>Message sent</h4><p>Thanks for reaching out — we\'ll get back to you soon.</p></div>';
    setTimeout(close, 2600);
  }

  window.ebOpenContact = open;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-contact-open]');
    if (t) open(e);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) close();
  });
})();
