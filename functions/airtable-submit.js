// Cloudflare Pages Function — proxies Airtable writes server-side
// Token lives in env var AIRTABLE_TOKEN (set in Cloudflare dashboard)
// Handles both /functions/airtable-submit?table=Submissions and ?table=Members

export async function onRequestPost(context) {
  const { request, env } = context;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  const token  = env.AIRTABLE_TOKEN;
  const baseId = 'appB4cWwPnCEuHSgI';

  if (!token) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: cors });
  }

  const url    = new URL(request.url);
  const table  = url.searchParams.get('table') || 'Submissions';

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: cors });
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: body }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `Airtable ${res.status}`);
    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200, headers: cors });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
