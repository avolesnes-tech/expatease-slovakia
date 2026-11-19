// Cloudflare Pages Function — POST /subscribe
// Community sign-ups and newsletter subscriptions (replaces Airtable, Nov 2026).
//  1. Saves the member to Supabase table `members` (EU) — insert-only via RLS;
//     an email that is already there (409) counts as success.
//  2. If the visitor ticked the newsletter box, adds/updates the contact in the
//     Brevo list BREVO_LIST_ID (EU). Brevo handles unsubscribes.
// Env: BREVO_API_KEY (already set), optional SUPABASE_URL / SUPABASE_ANON_KEY.
// Accepts { name, email, newsletter } or the old { Name, Email, Newsletter } shape.

const BREVO_LIST_ID = 3; // Brevo list "ExpatBase newsletter" (#3, created 19 Nov 2026)
const SB_URL = 'https://etxqrlrqbjcbjmitnspv.supabase.co';
const SB_KEY = 'sb_publishable_i38f7jyt2HYOjUTNuOsklg_aMofdDvE';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const email = String(b.email ?? b.Email ?? '').trim().toLowerCase();
  const name = String(b.name ?? b.Name ?? '').trim().slice(0, 80) || null;
  const newsletter = (b.newsletter ?? b.Newsletter) === true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return json({ error: 'Invalid email' }, 400);
  if (b.website) return json({ success: true }); // honeypot

  let source = 'website';
  try { source = new URL(request.headers.get('Referer') || '').pathname || 'website'; } catch {}
  const now = new Date().toISOString();

  // 1) Supabase
  const sbUrl = env.SUPABASE_URL || SB_URL;
  const sbKey = env.SUPABASE_ANON_KEY || SB_KEY;
  const sb = await fetch(`${sbUrl}/rest/v1/members`, {
    method: 'POST',
    headers: {
      apikey: sbKey, Authorization: `Bearer ${sbKey}`, 'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ email, name, newsletter, newsletter_consent_at: newsletter ? now : null, source }),
  }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
  const sbOk = sb.ok || sb.status === 409; // 409 = already a member
  if (!sbOk) console.error('members insert failed', sb.status, await sb.text());

  // 2) Brevo newsletter list
  let brevoOk = !newsletter;
  if (newsletter && env.BREVO_API_KEY && BREVO_LIST_ID) {
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        email, updateEnabled: true, listIds: [BREVO_LIST_ID],
        attributes: name ? { FIRSTNAME: name } : {},
      }),
    }).catch(() => null);
    brevoOk = !!(r && (r.ok || r.status === 204));
    if (!brevoOk) console.error('brevo contact failed', r && r.status, r && (await r.text()));
  }

  if (!sbOk && !brevoOk) return json({ error: 'Could not save' }, 502);
  return json({ success: true });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
