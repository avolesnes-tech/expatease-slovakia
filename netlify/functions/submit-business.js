const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // Validate required fields
  const required = ['name', 'category', 'phone', 'email', 'address', 'description', 'plan', 'contact_name'];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === '') {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: `Missing required field: ${field}` }),
      };
    }
  }

  const row = {
    name: body.name.trim(),
    category: body.category.trim(),
    phone: body.phone.trim(),
    email: body.email.trim(),
    address: body.address.trim(),
    description: body.description.trim(),
    plan: body.plan === 'premium' ? 'premium' : 'basic',
    contact_name: body.contact_name.trim(),
    english_speaking: body.english_speaking === true,
    status: 'pending',
    website: body.website ? body.website.trim() : null,
    social_links: body.social_links || null,
    about: body.about ? body.about.trim() : null,
    opening_hours: body.opening_hours || null,
  };

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/businesses`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });

    if (response.status === 201) {
      const data = await response.json();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, id: data[0]?.id }),
      };
    }

    const errBody = await response.text();
    console.error('Supabase error:', response.status, errBody);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Database error' }) };
  } catch (err) {
    console.error('submit-business error:', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
