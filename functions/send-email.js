// Cloudflare Pages Function — sends transactional emails via Brevo
// BREVO_API_KEY must be set in Cloudflare Pages environment variables
// ADMIN_EMAIL  must be set to Anna's email address

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM = { name: 'ExpatBase Slovakia', email: 'hello@expatbase.sk' };

function response(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}

async function sendBrevo(apiKey, payload) {
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Email templates ──────────────────────────────────────────────

function submissionConfirmEmail({ bizName, contactName, plan }) {
  const planNote = plan === 'founding'
    ? 'You\'re joining as a <strong>Founding Member</strong> — a complete profile, free during our launch. No payment is needed now, and we\'ll always give you advance notice before any paid plans launch.'
    : plan === 'premium'
    ? 'You applied for a <strong>Premium listing</strong>. Our team will be in touch to arrange your photos and confirm payment once the listing is approved.'
    : 'You applied for a <strong>Basic (free) listing</strong>.';

  return {
    subject: `We received your ExpatBase listing — ${bizName}`,
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F8F6;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a18;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1A4F8A;padding:32px 40px;text-align:center;">
          <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">ExpatBase Slovakia</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">English-speaking professionals in Bratislava</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="font-size:15px;margin:0 0 20px;">Hi ${contactName},</p>
          <p style="font-size:15px;margin:0 0 20px;">Thank you for submitting <strong>${bizName}</strong> to ExpatBase Slovakia. We've received your listing and will review it within <strong>2 business days</strong>.</p>
          <p style="font-size:14px;color:#555;margin:0 0 20px;">${planNote}</p>
          <p style="font-size:15px;margin:0 0 8px;font-weight:600;">What happens next:</p>
          <ol style="font-size:14px;color:#444;padding-left:20px;margin:0 0 28px;line-height:1.8;">
            <li>We review your submission for quality and accuracy</li>
            <li>You receive an email with a link to claim and manage your profile</li>
            <li>Your listing goes live and English-speaking expats can find you</li>
          </ol>
          <p style="font-size:14px;color:#555;margin:0;">If you have any questions, reply to this email and we'll get back to you.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F8F8F6;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="font-size:12px;color:#999;margin:0;">ExpatBase Slovakia · Bratislava · <a href="https://expatbase.sk" style="color:#1A4F8A;text-decoration:none;">expatbase.sk</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

function approvalNotifyEmail({ bizName, contactName, profileUrl, loginUrl, bizEmail }) {
  return {
    subject: `V\u00e1\u0161 profil na ExpatBase je online \u2014 ${bizName}`,
    htmlContent: `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body bgcolor="#FFFFFF" style="margin:0;background-color:#FFFFFF;">
<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="width:600px;max-width:100%;background-color:#FFFFFF;border:1px solid #E4EBF3;">

  <tr><td bgcolor="#0F3360" style="background-color:#0F3360;">
    <table width="100%" cellpadding="22" cellspacing="0" border="0"><tr>
      <td align="left" valign="middle" bgcolor="#0F3360" style="background-color:#0F3360;"><a href="https://expatbase.sk/"><img src="https://expatbase.sk/mail/email-logo.png" width="170" alt="ExpatBase" border="0" style="display:block;width:170px;"></a></td>
      <td align="right" valign="middle" bgcolor="#0F3360" style="background-color:#0F3360;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8FE0B6;">V\u00e1\u0161 profil je spusten\u00fd</td>
    </tr></table>
  </td></tr>

  <tr><td>
    <table width="100%" cellpadding="30" cellspacing="0" border="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#1F2937;">

Dobr\u00fd de\u0148, ${contactName},<br><br>
<span style="font-size:17px;">m\u00e1m pre v\u00e1s dobr\u00fa spr\u00e1vu \u2014 profil <b style="color:#0F3360;">${bizName}</b> je od tejto chv\u00edle <b>naživo na ExpatBase.sk</b>.</span><br><br>
Cudzinci, ktor\u00ed v Bratislave h\u013eadaj\u00fa anglicky hovoriacich odborn\u00edkov, v\u00e1s u\u017e n\u00e1jdu a m\u00f4\u017eu v\u00e1s priamo kontaktova\u0165.<br><br>

      <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td align="center" bgcolor="#2E9E6B" style="background-color:#2E9E6B;border-radius:999px;">
          <table cellpadding="14" cellspacing="0" border="0"><tr><td bgcolor="#2E9E6B" align="center" style="background-color:#2E9E6B;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">&nbsp;&nbsp;&nbsp;<a href="${profileUrl}" style="color:#FFFFFF;text-decoration:none;font-weight:bold;">Pozrie\u0165 si m\u00f4j profil</a>&nbsp;&nbsp;&nbsp;</td></tr></table>
        </td>
      </tr></table>
<br><br>
      <table width="100%" cellpadding="20" cellspacing="0" border="0" bgcolor="#E8F1FB" style="background-color:#E8F1FB;"><tr><td bgcolor="#E8F1FB" style="background-color:#E8F1FB;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#1F2937;">
        <span style="font-size:17px;font-weight:bold;color:#0F3360;">Ako si profil kedyko\u013evek uprav\u00edte</span><br><br>
        <b>1.</b> Otvorte <a href="${loginUrl}" style="color:#1A4F8A;font-weight:bold;">${loginUrl}</a><br>
        <b>2.</b> Zadajte e-mail <b>${bizEmail}</b> \u2014 presne ten, ktor\u00fd ste uviedli pri registr\u00e1cii<br>
        <b>3.</b> Do min\u00faty v\u00e1m pr\u00edde prihlasovac\u00ed odkaz. Kliknete na\u0148 a ste vn\u00fatri.<br><br>
        \u017diadne heslo si nevytv\u00e1rate. Odkaz plat\u00ed jednu hodinu; ak vypr\u0161\u00ed, jednoducho si vy\u017eiadajte nov\u00fd.
      </td></tr></table>
<br><br>
\u010co sa oplat\u00ed doplni\u0165, aby v\u00e1s expati kontaktovali \u010dastej\u0161ie:<br><br>
      <table cellpadding="5" cellspacing="0" border="0">
        <tr><td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;">\u2022</td><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#1F2937;"><b>Logo a fotky</b> \u2014 profil s obr\u00e1zkom m\u00e1 v\u00fdrazne vy\u0161\u0161iu mieru preklikov.</td></tr>
        <tr><td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;">\u2022</td><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#1F2937;"><b>Otv\u00e1racie hodiny</b> \u2014 na profile sa zobrazia so \u017eiv\u00fdm ozna\u010den\u00edm \u201eOpen now\u201c.</td></tr>
        <tr><td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;">\u2022</td><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#1F2937;"><b>Dlh\u0161\u00ed popis</b> \u2014 pokojne tri a\u017e \u0161tyri vety o tom, \u010do presne rob\u00edte a pre koho.</td></tr>
        <tr><td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;">\u2022</td><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#1F2937;"><b>Recenzia od spokojn\u00e9ho klienta</b> \u2014 pod\u013ea recenzi\u00ed sa expati rozhoduj\u00fa najviac.</td></tr>
      </table>
<br>
Ak by \u010doko\u013evek nefungovalo, alebo si profil rad\u0161ej nech\u00e1te doplni\u0165 odo m\u0148a, sta\u010d\u00ed odp\u00edsa\u0165 na tento e-mail.<br><br>
Prajem pekn\u00fd de\u0148,<br><br>

      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#E4EBF3" style="background-color:#E4EBF3;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
      <br>
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle"><a href="https://expatbase.sk/"><img src="https://expatbase.sk/mail/email-pin.png" width="51" height="64" alt="ExpatBase" border="0" style="display:block;width:51px;height:64px;"></a></td>
        <td width="16">&nbsp;&nbsp;&nbsp;</td>
        <td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#5A6676;">
          <span style="font-size:16px;font-weight:bold;color:#0F3360;">Anna Lockwoodov\u00e1</span><br>
          Zakladate\u013eka, ExpatBase.sk<br>
          <a href="mailto:hello@expatbase.sk" style="color:#1A4F8A;text-decoration:none;">hello@expatbase.sk</a> &nbsp;\u00b7&nbsp; <a href="https://expatbase.sk/" style="color:#1A4F8A;text-decoration:none;">expatbase.sk</a><br>
          <a href="tel:+421902641684" style="color:#1A4F8A;text-decoration:none;">+421&nbsp;902&nbsp;641&nbsp;684</a>
        </td>
      </tr></table>

    </td></tr></table>
  </td></tr>

  <tr><td bgcolor="#F4F6F9" style="background-color:#F4F6F9;">
    <table width="100%" cellpadding="22" cellspacing="0" border="0"><tr><td bgcolor="#F4F6F9" style="background-color:#F4F6F9;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8C97A8;">
      Z\u00e1kladn\u00e9 \u010dlenstvo v datab\u00e1ze je bezplatn\u00e9 natrvalo. Ako jeden z prv\u00fdch partnerov m\u00e1te nav\u00fd\u0161e roz\u0161\u00edren\u00fd Pro profil na 6 mesiacov zadarmo a odznak Founding Partner, ktor\u00fd v\u00e1m v profile zostane natrvalo.
    </td></tr></table>
  </td></tr>

</table>
</body>
</html>`,
  };
}

function adminNotifyEmail({ bizName, contactName, bizEmail, category, plan, adminEmail }) {
  return {
    subject: `[ExpatBase] New submission: ${bizName} (${plan})`,
    htmlContent: `
<p>New business submission on ExpatBase:</p>
<ul>
  <li><strong>Business:</strong> ${bizName}</li>
  <li><strong>Contact:</strong> ${contactName}</li>
  <li><strong>Email:</strong> ${bizEmail}</li>
  <li><strong>Category:</strong> ${category}</li>
  <li><strong>Plan:</strong> ${plan}</li>
</ul>
<p><a href="https://supabase.com/dashboard/project/etxqrlrqbjcbjmitnspv/editor" style="color:#1A4F8A;">Review in Supabase →</a></p>`,
  };
}

// ── Route handler ─────────────────────────────────────────────────

export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.BREVO_API_KEY;
  const adminEmail = env.ADMIN_EMAIL || 'avolesnes@gmail.com';

  if (!apiKey) return response({ error: 'Email service not configured' }, 500);

  let body;
  try { body = await request.json(); } catch {
    return response({ error: 'Invalid JSON' }, 400);
  }

  const { type } = body;

  try {
    if (type === 'submission_confirm') {
      // Email to business + notify admin
      const { bizName, contactName, bizEmail, category, plan } = body;

      const tpl = submissionConfirmEmail({ bizName, contactName, plan });
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: bizEmail, name: contactName }],
        ...tpl,
      });

      // Notify Anna
      const adminTpl = adminNotifyEmail({ bizName, contactName, bizEmail, category, plan, adminEmail });
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: adminEmail, name: 'Anna' }],
        ...adminTpl,
      });

      return response({ success: true });
    }

    if (type === 'approval_notify') {
      // Admin-only: this type sends mail to a third party, so it needs the shared token.
      const adminToken = env.ADMIN_TOKEN;
      if (!adminToken) return response({ error: 'ADMIN_TOKEN not configured' }, 500);
      if (body.token !== adminToken) return response({ error: 'Not authorised' }, 401);

      // Look the listing up server-side so the caller cannot pick an arbitrary recipient.
      const { id } = body;
      if (!id) return response({ error: 'Missing id' }, 400);

      const sbUrl = env.SUPABASE_URL;
      const sbKey = env.SUPABASE_ANON_KEY;
      if (!sbUrl || !sbKey) return response({ error: 'Supabase not configured' }, 500);

      const look = await fetch(
        `${sbUrl}/rest/v1/businesses?select=id,name,contact_name,email,status&id=eq.${encodeURIComponent(id)}`,
        { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } }
      );
      const rows = await look.json();
      if (!Array.isArray(rows) || !rows.length) return response({ error: 'Listing not found' }, 404);

      const biz = rows[0];
      if (biz.status !== 'approved') return response({ error: 'Listing is not approved yet' }, 409);

      const tpl = approvalNotifyEmail({
        bizName:     biz.name,
        contactName: biz.contact_name || biz.name,
        bizEmail:    biz.email,
        profileUrl:  `https://expatbase.sk/expert.html?id=${biz.id}`,
        loginUrl:    'https://expatbase.sk/business-login.html',
      });

      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: biz.email, name: biz.contact_name || biz.name }],
        ...tpl,
      });
      return response({ success: true, sentTo: biz.email });
    }

    if (type === 'contact') {
      const { name, email, message, company } = body;
      if (company) return response({ success: true }); // honeypot: silently accept bots
      if (!email || !message) return response({ error: 'Missing fields' }, 400);
      const esc = (s) => String(s || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: 'hello@expatbase.sk', name: 'ExpatBase' }],
        replyTo: { email, name: name || email },
        subject: `[ExpatBase] Contact form — ${name || email}`,
        htmlContent: `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p><strong>Message:</strong></p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
      });
      return response({ success: true });
    }

    return response({ error: 'Unknown email type' }, 400);

  } catch (err) {
    console.error('send-email error:', err.message);
    return response({ error: err.message }, 500);
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
