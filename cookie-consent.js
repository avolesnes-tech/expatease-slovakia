/* ExpatBase — GDPR cookie consent + Google Analytics (GA4) loader.
   GA is loaded ONLY after the visitor clicks "Accept". No Google cookies before consent. */
(function(){
  var GA_ID='G-CDQ8WCZ8WW';
  var KEY='ee_cookie_consent';
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
  var choice=null; try{choice=localStorage.getItem(KEY);}catch(e){}
  if(choice==='granted'){loadGA();return;}
  if(choice==='denied'){return;}

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
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  function show(){
    var d=document.createElement('div'); d.className='ee-cc'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Cookie consent');
    d.innerHTML='<div class="ee-cc-text">We use cookies to measure site traffic anonymously (Google Analytics) and improve ExpatBase. See our <a href="cookie-policy.html">Cookie Policy</a>.</div>'
      +'<div class="ee-cc-btns"><button class="ee-cc-decline" type="button">Decline</button><button class="ee-cc-accept" type="button">Accept</button></div>';
    document.body.appendChild(d);
    d.querySelector('.ee-cc-accept').addEventListener('click',function(){try{localStorage.setItem(KEY,'granted');}catch(e){}loadGA();d.remove();});
    d.querySelector('.ee-cc-decline').addEventListener('click',function(){try{localStorage.setItem(KEY,'denied');}catch(e){}d.remove();});
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded',show);
})();
