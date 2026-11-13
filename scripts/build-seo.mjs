#!/usr/bin/env node
/* ExpatBase — SEO build step (run BEFORE every deploy)
 *
 *   node scripts/build-seo.mjs
 *   npx wrangler pages deploy . --project-name=expatease-final
 *
 * What it does (all idempotent — safe to run again and again):
 *  1. Loads approved businesses from Supabase (public publishable key).
 *  2. Writes a static, Google-readable profile page for every business with a
 *     full profile (Founding Partner / Pro) to  experts/<slug>.html
 *     → live URL  https://expatbase.sk/experts/<slug>
 *     The page is a copy of expert.html with the title, description,
 *     canonical, Open Graph, schema.org data and the main text already in
 *     the HTML; the normal script then loads reviews etc. as before.
 *  3. Writes eb-slugs.js (business id → slug) so cards on category pages
 *     link to the new clean URLs.
 *  4. Pre-renders the list of businesses into each category page, so
 *     Google sees them even without JavaScript (listings.js still replaces
 *     it with the interactive cards for visitors).
 *  5. Updates sitemap.xml with all profile URLs.
 *
 * Test without network:  node scripts/build-seo.mjs --data sample.json
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://expatbase.sk';
const SB = 'https://etxqrlrqbjcbjmitnspv.supabase.co';
const KEY = 'sb_publishable_i38f7jyt2HYOjUTNuOsklg_aMofdDvE';
const OUT_DIR = 'experts';

const rd = (f) => fs.readFile(path.join(ROOT, f), 'utf8');
const wr = (f, s) => fs.writeFile(path.join(ROOT, f), s);

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const jsonLd = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };
const isPro = (b) => b.plan === 'premium' || b.plan === 'founding';
const subs = (b) => (Array.isArray(b.subcategories) ? b.subcategories : []).filter((x) => x && x !== 'Other');

function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 70).replace(/-+$/, '') || 'expert';
}

function replaceBlock(html, name, content) {
  const start = `<!--EB-SEO:${name}-->`, end = `<!--/EB-SEO:${name}-->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  const block = `${start}${content}${end}`;
  return re.test(html) ? html.replace(re, () => block) : null;
}

async function loadBusinesses() {
  const i = process.argv.indexOf('--data');
  if (i !== -1) return JSON.parse(await fs.readFile(process.argv[i + 1], 'utf8'));
  const url = `${SB}/rest/v1/businesses?status=eq.approved&select=*&order=created_at.asc`;
  const r = await fetch(url, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

/* category pages: read EB_CATEGORY / EB_CATEGORY_SUBS straight from the HTML */
async function categoryPages() {
  const files = (await fs.readdir(ROOT)).filter((f) => f.endsWith('.html'));
  const out = [];
  for (const f of files) {
    const h = await rd(f);
    const m = h.match(/window\.EB_CATEGORY\s*=\s*"([^"]+)"/);
    if (!m) continue;
    const s = h.match(/window\.EB_CATEGORY_SUBS\s*=\s*(\[[^\]]*\])/);
    out.push({ file: f, category: m[1], extraSubs: s ? JSON.parse(s[1]) : [] });
  }
  return out;
}

function profilePage(tpl, b, slug, catFile) {
  const url = `${SITE}/${OUT_DIR}/${slug}`;
  const label = subs(b).join(', ') || b.category || 'Professional';
  const place = b.district && !/online|wide/i.test(b.district) ? `${b.district}, Bratislava` : 'Bratislava';
  const title = `${b.name} – English-speaking ${subs(b)[0] || b.category || 'professional'} in ${place} | ExpatBase`;
  const desc = clip([b.tagline, b.description || b.about].filter(Boolean).join(' — ') || `${b.name}: English-speaking ${label} in Bratislava, listed on ExpatBase Slovakia.`, 158);
  const img = b.cover_url || b.logo_url || `${SITE}/brand/expatbase-logo-square-gradient.png`;

  let h = tpl;
  // 1) every relative link/asset → absolute, because the page lives in /experts/
  h = h.replace(/(\s(?:href|src)=")(?![a-z][a-z0-9+.-]*:|\/|#|'|")/gi, '$1/');
  h = h.replace(/href="'\+catSlug\(/g, `href="/'+catSlug(`);
  // 2) head
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}">`);
  h = h.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}">`);
  const ld = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: b.name, url,
    description: desc, image: img, knowsLanguage: b.languages || undefined,
    address: b.address ? { '@type': 'PostalAddress', streetAddress: b.address, addressLocality: 'Bratislava', addressCountry: 'SK' } : undefined,
    telephone: b.phone || undefined, sameAs: b.website ? [b.website] : undefined,
  };
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: b.category || 'Experts', item: `${SITE}/${catFile.replace(/\.html$/, '')}` },
      { '@type': 'ListItem', position: 3, name: b.name, item: url }],
  };
  const head =
    `\n<meta property="og:type" content="profile"><meta property="og:site_name" content="ExpatBase Slovakia">` +
    `<meta property="og:title" content="${esc(b.name)} | ExpatBase Slovakia"><meta property="og:description" content="${esc(desc)}">` +
    `<meta property="og:url" content="${url}"><meta property="og:image" content="${esc(img)}"><meta name="twitter:card" content="summary_large_image">\n` +
    `<script type="application/ld+json" id="ld-biz">${jsonLd(ld)}</script>\n<script type="application/ld+json">${jsonLd(crumbs)}</script>\n` +
    `<script>window.EB_ID=${JSON.stringify(b.id)};window.EB_CANON=${JSON.stringify(url)};</script>\n</head>`;
  h = h.replace('</head>', () => head);
  // the live script adds its own ld-biz; drop the static one once it renders (avoid duplicates)
  h = h.replace("var _e=document.createElement('script');_e.type='application/ld+json';_e.id='ld-biz';",
    "var _old=document.getElementById('ld-biz');if(_old)_old.remove();var _e=document.createElement('script');_e.type='application/ld+json';_e.id='ld-biz';");
  // 3) body: readable content inside the loading block (hidden by the script once the full profile renders)
  const pre =
    `<div id="loading" class="state" style="text-align:left;max-width:860px;margin:0 auto">` +
    `<p style="font-size:13px;color:#6B7A90"><a href="/">ExpatBase</a> › <a href="/${catFile.replace(/\.html$/, '')}">${esc(b.category || 'Experts')}</a></p>` +
    `<h1 style="font-family:Urbanist,sans-serif;margin:8px 0">${esc(b.name)}</h1>` +
    `<p><strong>${esc(label)}</strong>${b.district ? ' · ' + esc(b.district) : ''}${b.english_speaking ? ' · English-speaking' : ''}</p>` +
    (b.tagline ? `<p>${esc(b.tagline)}</p>` : '') +
    (b.description && b.description !== b.about ? `<p>${esc(b.description)}</p>` : '') +
    (b.about ? `<p style="white-space:pre-line">${esc(b.about)}</p>` : '') +
    (b.address ? `<p>Address: ${esc(b.address)}</p>` : '') +
    (b.languages?.length ? `<p>Languages: ${esc(b.languages.join(', '))}</p>` : '') +
    `</div>`;
  h = h.replace(/<div id="loading" class="state">[^<]*<\/div>/, () => pre);
  return h;
}

function categoryList(rows, slugs) {
  if (!rows.length) return '';
  const li = rows.map((b) => {
    const name = slugs[b.id] ? `<a href="/${OUT_DIR}/${slugs[b.id]}">${esc(b.name)}</a>` : esc(b.name);
    const meta = [subs(b).join(', '), b.district].filter(Boolean).join(' · ');
    return `<li style="margin:0 0 14px"><strong>${name}</strong>${meta ? ` <span style="color:#6B7A90">— ${esc(meta)}</span>` : ''}` +
      (b.description ? `<br><span>${esc(clip(b.description, 220))}</span>` : '') + `</li>`;
  }).join('');
  return `<div class="eb-seo-list" style="max-width:1100px;margin:0 auto;padding:10px 20px"><ul style="list-style:none;padding:0">${li}</ul></div>`;
}

async function main() {
  const rows = await loadBusinesses();
  const cats = await categoryPages();
  const catFileFor = (b) => (cats.find((c) => c.category === b.category) || {}).file || 'index.html';

  // slugs: stable (oldest business keeps the plain slug)
  const slugs = {}, used = new Set();
  for (const b of [...rows].sort((a, c) => String(a.created_at).localeCompare(String(c.created_at)))) {
    if (!isPro(b)) continue;
    let s = slugify(b.name), n = 2;
    while (used.has(s)) s = `${slugify(b.name)}-${n++}`;
    used.add(s); slugs[b.id] = s;
  }

  // 1) profiles (clear old generated pages first so removed businesses disappear)
  await fs.mkdir(path.join(ROOT, OUT_DIR), { recursive: true });
  for (const f of await fs.readdir(path.join(ROOT, OUT_DIR))) {
    if (f.endsWith('.html')) await fs.unlink(path.join(ROOT, OUT_DIR, f)).catch(() => {});
  }
  const tpl = await rd('expert.html');
  for (const b of rows) if (slugs[b.id]) await wr(`${OUT_DIR}/${slugs[b.id]}.html`, profilePage(tpl, b, slugs[b.id], catFileFor(b)));

  // 2) id → slug map for the live scripts
  await wr('eb-slugs.js', `/* generated by scripts/build-seo.mjs — do not edit */\nwindow.EB_SLUGS=${JSON.stringify(slugs)};\n`);

  // 3) category pages
  let catDone = 0;
  for (const c of cats) {
    const list = rows.filter((b) => b.category === c.category || subs(b).some((s) => c.extraSubs.includes(s)))
      .sort((a, b) => String(b.plan).localeCompare(String(a.plan)) || String(b.created_at).localeCompare(String(a.created_at)));
    let h = await rd(c.file);
    const content = categoryList(list, slugs);
    let next = replaceBlock(h, 'list', content);
    if (next === null) next = h.replace(/(<(?:div|section)[^>]*\sid="[a-z-]+-grid"[^>]*>)/, (m) => `${m}<!--EB-SEO:list-->${content}<!--/EB-SEO:list-->`);
    if (!next.includes('/eb-slugs.js')) next = next.replace(/<script src="listings\.js/, '<script src="/eb-slugs.js"></script>\n<script src="listings.js');
    if (next !== h) { await wr(c.file, next); catDone++; }
  }
  // homepage cards also link to profiles
  let idx = await rd('index.html');
  if (!idx.includes('/eb-slugs.js')) { idx = idx.replace(/<script src="listings\.js/, '<script src="/eb-slugs.js"></script>\n<script src="listings.js'); await wr('index.html', idx); }

  // 4) sitemap
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.values(slugs).sort().map((s) =>
    `  <url><loc>${SITE}/${OUT_DIR}/${s}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join('\n');
  let sm = await rd('sitemap.xml');
  const block = `\n  <!-- Expert profiles (generated) -->\n${urls}\n  `;
  sm = replaceBlock(sm, 'profiles', block) ?? sm.replace('</urlset>', `  <!--EB-SEO:profiles-->${block}<!--/EB-SEO:profiles-->\n</urlset>`);
  await wr('sitemap.xml', sm);

  console.log(`✓ ${rows.length} businesses · ${Object.keys(slugs).length} profile pages in /${OUT_DIR}/ · ${catDone} category pages updated · sitemap updated`);
}

main().catch((e) => { console.error('✗ SEO build failed:', e.message); process.exit(1); });
