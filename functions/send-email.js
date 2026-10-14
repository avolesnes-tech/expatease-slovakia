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

function approvalNotifyEmail({ bizName, contactName, profileUrl, loginUrl, bizEmail, tips }) {
  const li = (t) =>
    `<tr><td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#2E9E6B;font-weight:bold;">&bull;</td>` +
    `<td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#1F2937;">${t}</td></tr>`;

  const tipsBlock = (tips && tips.length)
    ? `A few details are still missing from your profile. Each one makes it easier for someone to choose you:<br><br>
      <table cellpadding="5" cellspacing="0" border="0">${tips.map(li).join('')}</table><br>`
    : `Your profile is already complete \u2014 which puts you ahead of most listings. The one thing that would strengthen it further is a review from a client you have worked with.<br><br>`;

  return {
    subject: `${bizName} is now live on ExpatBase`,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body bgcolor="#FFFFFF" style="margin:0;background-color:#FFFFFF;">
<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="width:600px;max-width:100%;background-color:#FFFFFF;border:1px solid #E4EBF3;">

  <tr><td bgcolor="#0F3360" style="background-color:#0F3360;">
    <table width="100%" cellpadding="22" cellspacing="0" border="0"><tr>
      <td align="left" valign="middle" bgcolor="#0F3360" style="background-color:#0F3360;"><a href="https://expatbase.sk/"><img src="https://expatbase.sk/mail/email-logo.png" width="170" alt="ExpatBase" border="0" style="display:block;width:170px;"></a></td>
      <td align="right" valign="middle" bgcolor="#0F3360" style="background-color:#0F3360;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8FE0B6;">Your listing is live</td>
    </tr></table>
  </td></tr>

  <tr><td>
    <table width="100%" cellpadding="30" cellspacing="0" border="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#1F2937;">

Dear ${contactName},<br><br>
<span style="font-size:17px;">Your application has been reviewed and approved. <b style="color:#0F3360;">${bizName}</b> is now listed on ExpatBase.sk.</span><br><br>
Foreigners living in Bratislava use ExpatBase to find professionals who can look after them in English. Most of them know exactly what they need \u2014 what they are missing is someone they can trust to understand them. From today, your business is one of the names they will find.<br><br>

      <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td align="center" bgcolor="#2E9E6B" style="background-color:#2E9E6B;border-radius:999px;">
          <table cellpadding="14" cellspacing="0" border="0"><tr><td bgcolor="#2E9E6B" align="center" style="background-color:#2E9E6B;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">&nbsp;&nbsp;&nbsp;<a href="${profileUrl}" style="color:#FFFFFF;text-decoration:none;font-weight:bold;">View your listing</a>&nbsp;&nbsp;&nbsp;</td></tr></table>
        </td>
      </tr></table>
<br><br>
      <table width="100%" cellpadding="20" cellspacing="0" border="0" bgcolor="#E8F1FB" style="background-color:#E8F1FB;"><tr><td bgcolor="#E8F1FB" style="background-color:#E8F1FB;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#1F2937;">
        <span style="font-size:17px;font-weight:bold;color:#0F3360;">Managing your listing</span><br><br>
        <b>1.</b> Go to <a href="${loginUrl}" style="color:#1A4F8A;font-weight:bold;">${loginUrl.replace(/^https:\/\//, '').replace(/\.html$/, '')}</a><br>
        <b>2.</b> Enter <b>${bizEmail}</b> \u2014 the address you registered with<br>
        <b>3.</b> A sign-in link arrives within a minute. Click it and you are in.<br><br>
        There is no password to create. The link is valid for one hour; request a new one at any time.
      </td></tr></table>
<br><br>
${tipsBlock}
Should anything not work as expected, simply reply to this email.<br><br>
Kind regards,<br><br>

      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#E4EBF3" style="background-color:#E4EBF3;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
      <br>
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle"><a href="https://expatbase.sk/"><img src="https://expatbase.sk/mail/email-pin.png" width="51" height="64" alt="ExpatBase" border="0" style="display:block;width:51px;height:64px;"></a></td>
        <td width="16">&nbsp;&nbsp;&nbsp;</td>
        <td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:#5A6676;">
          <span style="font-size:16px;font-weight:bold;color:#0F3360;">Anna Lockwoodov\u00e1</span><br>
          Founder, ExpatBase.sk<br>
          <a href="mailto:hello@expatbase.sk" style="color:#1A4F8A;text-decoration:none;">hello@expatbase.sk</a> &nbsp;\u00b7&nbsp; <a href="https://expatbase.sk/" style="color:#1A4F8A;text-decoration:none;">expatbase.sk</a><br>
          <a href="tel:+421902641684" style="color:#1A4F8A;text-decoration:none;">+421&nbsp;902&nbsp;641&nbsp;684</a>
        </td>
      </tr></table>

    </td></tr></table>
  </td></tr>

  <tr><td bgcolor="#F4F6F9" style="background-color:#F4F6F9;">
    <table width="100%" cellpadding="22" cellspacing="0" border="0"><tr><td bgcolor="#F4F6F9" style="background-color:#F4F6F9;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8C97A8;">
      A basic listing on ExpatBase is free, permanently. As one of our first partners you also receive the extended Pro profile free for six months and the Founding Partner badge, which stays on your listing for good.
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

      const sbHeaders = { apikey: sbKey, Authorization: `Bearer ${sbKey}` };
      const look = await fetch(
        `${sbUrl}/rest/v1/businesses?select=id,name,contact_name,email,status,about,website,logo_url,cover_url,gallery,opening_hours,social_links&id=eq.${encodeURIComponent(id)}`,
        { headers: sbHeaders }
      );
      const rows = await look.json();
      if (!Array.isArray(rows) || !rows.length) return response({ error: 'Listing not found' }, 404);

      const biz = rows[0];
      if (biz.status !== 'approved') return response({ error: 'Listing is not approved yet' }, 409);

      // Does this listing already have reviews? (non-fatal if the lookup fails)
      let reviewCount = 0;
      try {
        const rev = await fetch(
          `${sbUrl}/rest/v1/reviews?business_id=eq.${encodeURIComponent(biz.id)}&select=id`,
          { headers: sbHeaders }
        );
        const revRows = await rev.json();
        if (Array.isArray(revRows)) reviewCount = revRows.length;
      } catch { /* ignore */ }

      // Build the suggestions from what is actually missing, so nobody is asked
      // to add something they have already filled in.
      const filled = (v) => typeof v === 'string' && v.trim() !== '';
      const hasPhotos = filled(biz.logo_url) || filled(biz.cover_url) ||
                        (Array.isArray(biz.gallery) && biz.gallery.length > 0);
      const hasHours  = biz.opening_hours && typeof biz.opening_hours === 'object' &&
                        Object.keys(biz.opening_hours).some(k => biz.opening_hours[k] && biz.opening_hours[k].open);
      const sl = biz.social_links || {};
      const hasSocial = filled(sl.instagram) || filled(sl.facebook);

      const tips = [];
      if (!hasPhotos)            tips.push('<b>Add your logo and a few photos</b> \u2014 listings with images are opened far more often than those without.');
      if (!filled(biz.about))    tips.push('<b>Write a fuller description</b> \u2014 three or four sentences on what you do and who you do it for.');
      if (!filled(biz.website))  tips.push('<b>Add your website</b> \u2014 most people check a business online before they call.');
      if (!hasHours)             tips.push('<b>Set your opening hours</b> \u2014 your listing then shows a live &ldquo;Open now&rdquo; label.');
      if (!hasSocial)            tips.push('<b>Link your Facebook or Instagram</b> \u2014 an active page reassures people you are still trading.');
      if (reviewCount === 0)     tips.push('<b>Ask a client for a review</b> \u2014 reviews are what expats rely on most, and yours would be the first.');

      const tpl = approvalNotifyEmail({
        bizName:     biz.name,
        contactName: biz.contact_name || biz.name,
        bizEmail:    biz.email,
        profileUrl:  `https://expatbase.sk/expert.html?id=${biz.id}`,
        loginUrl:    'https://expatbase.sk/business-login.html',
        tips,
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
