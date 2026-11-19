// Retired Nov 2026: Airtable is no longer used (members & newsletter → functions/subscribe.js).
export async function onRequest() {
  return new Response(JSON.stringify({ error: 'Gone' }), { status: 410, headers: { 'Content-Type': 'application/json' } });
}
