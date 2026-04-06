export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: corsHeaders });
  }

  // Validate required fields
  const required = ['name', 'category', 'phone', 'email', 'address', 'description', 'plan', 'contact_name'];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === '') {
      return new Response(
        JSON.stringify({ error: `Missing required field: ${field}` }),
        { status: 400, headers: corsHeaders }
      );
    }
  }

  const row = {
    name:             body.name.trim(),
    category:         body.category.trim(),
    phone:            body.phone.trim(),
    email:            body.email.trim(),
    address:          body.address.trim(),
    description:      body.description.trim(),
    plan:             body.plan === 'premium' ? 'premium' : 'basic',
    contact_name:     body.contact_name.trim(),
    english_speaking: body.english_speaking === true,
    status:           'pending',
    website:          body.website ? body.website.trim() : null,
    social_links:     body.social_links || null,
    about:            body.about ? body.about.trim() : null,
    opening_hours:    body.opening_hours || null,
  };

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: corsHeaders });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/businesses`, {
      method: 'POST',
      headers: {
        apikey:          supabaseKey,
        Authorization:   `Bearer ${supabaseKey}`,
        'Content-Type':  'application/json',
        Prefer:          'return=representation',
      },
      body: JSON.stringify(row),
    });

    if (response.status === 201) {
      const data = await response.json();
      return new Response(
        JSON.stringify({ success: true, id: data[0]?.id }),
        { status: 200, headers: corsHeaders }
      );
    }

    const errBody = await response.text();
    console.error('Supabase error:', response.status, errBody);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500, headers: corsHeaders });

  } catch (err) {
    console.error('submit-business error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
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
