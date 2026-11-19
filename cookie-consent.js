/* ExpatBase — GDPR / ePrivacy consent banner + Google Analytics (GA4) loader.
   Nothing optional is loaded or stored before the visitor clicks "Accept":
   - Google Analytics 4 (cookies _ga, _ga_*)
   - anonymous visitor id for listing statistics (localStorage eb_vid / eb_seen, read by listings.js)
   The choice can be changed any time via any element with [data-cookie-settings]
   (footer link "Cookie settings") or window.ebCookieSettings(). */
(function(){
  if(window.__eeCC)return; window.__eeCC=true;
  var GA_ID='G-CDQ8WCZ8WW';
  var KEY='ee_cookie_consent';

  function get(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function set(v){try{localStorage.setItem(KEY,v);localStorage.setItem(KEY+'_at',new Date().toISOString());}catch(e){}}
  window.ebConsentGranted=function(){return get()==='granted';};

  function loadGA(){
    if(window.__eeGA)return; window.__eeGA=true;
    var s=document.createElement('script');
    s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments);};
    gtag('js',new Date());
    gtag('config',GA_ID,{anonymize_ip:true});
  }
  /* withdrawal: remove what we stored and expire GA cookies on this domain */
  function clearOptional(){
    try{localStorage.removeItem('eb_vid');localStorage.removeItem('eb_seen');}catch(e){}
    try{
      document.cookie.split(';').forEach(function(c){
        var n=c.split('=')[0].trim();
        if(/^_ga/.test(n)){
          ['', '; domain=.'+location.hostname.replace(/^www\./,''), '; domain='+location.hostname].forEach(function(d){
            document.cookie=n+'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'+d;
          });
        }
      });
    }catch(e){}
    try{ if(window.gtag) gtag('consent','update',{analytics_storage:'denied'}); }catch(e){}
  }

  var css=''
    +'.ee-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:640px;margin:0 auto;'
    +'background:#fff;border:1px solid #E3E9F2;border-radius:16px;box-shadow:0 12px 40px rgba(15,51,96,.18);'
    +'padding:16px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;'
    +"font-family:'Urbanist',system-ui,-apple-system,'Segoe UI',sans-serif;animation:eeccIn .35s ease}"
    +'@keyframes eeccIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'
    +'.ee-cc-text{flex:1;min-width:220px;font-size:13.5px;line-height:1.5;color:#44515F}'
    +'.ee-cc-text a{color:#1A4F8A;font-weight:600;text-decoration:underline}'
    +'.ee-cc-btns{display:flex;gap:8px;flex-shrink:0}'
    +'.ee-cc button{font-family:inherit;font-weight:700;font-size:13.5px;padding:9px 18px;border-radius:999px;cursor:pointer;border:0;transition:opacity .15s}'
    +'.ee-cc button:hover{opacity:.88}'
    +'.ee-cc-decline{background:#fff;border:1.5px solid #D7DEE8;color:#44515F}'
    +'.ee-cc-accept{background:linear-gradient(135deg,#1A7F5A,#2E9E6B);color:#fff}'
    +'@media(max-width:520px){.ee-cc{flex-direction:column;align-items:stretch}.ee-cc-btns{justify-content:flex-end}}';
  var styled=false;
  function style(){ if(styled)return; styled=true; var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st); }

  var open=null;
  function show(){
    style();
    if(open)open.remove();
    var cur=get();
    var d=document.createElement('div'); d.className='ee-cc'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Cookie consent');
    d.innerHTML='<div class="ee-cc-text">With your consent we use <strong>Google Analytics</strong> to see how the site is used, and an <strong>anonymous ID</strong> in your browser to count profile views for listed businesses. Nothing is stored until you accept, and you can change your choice any time via “Cookie settings”. <a href="/cookie-policy.html">Cookie Policy</a>'
      +(cur?'<br><span style="font-size:12.5px;color:#6B7A90">Current choice: '+(cur==='granted'?'accepted':'declined')+'</span>':'')+'</div>'
      +'<div class="ee-cc-btns"><button class="ee-cc-decline" type="button">Decline</button><button class="ee-cc-accept" type="button">Accept</button></div>';
    document.body.appendChild(d); open=d;
    d.querySelector('.ee-cc-accept').addEventListener('click',function(){set('granted');loadGA();d.remove();open=null;});
    d.querySelector('.ee-cc-decline').addEventListener('click',function(){var was=get();set('denied');clearOptional();d.remove();open=null;if(was==='granted'&&window.__eeGA)location.reload();});
  }
  window.ebCookieSettings=function(){ if(document.body) show(); else document.addEventListener('DOMContentLoaded',show); };
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('[data-cookie-settings]'):null;
    if(t){e.preventDefault();window.ebCookieSettings();}
  });

  var choice=get();
  if(choice==='granted'){loadGA();return;}
  if(choice==='denied'){return;}
  window.ebCookieSettings();
})();
