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
  const planNote = plan === 'premium'
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

function approvalNotifyEmail({ bizName, contactName, profileUrl, magicLink }) {
  return {
    subject: `Your ExpatBase listing is live — ${bizName}`,
    htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F8F6;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a18;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#2A7D5F;padding:32px 40px;text-align:center;">
          <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">You're live on ExpatBase! 🎉</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">English-speaking expats can now find you</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="font-size:15px;margin:0 0 20px;">Hi ${contactName},</p>
          <p style="font-size:15px;margin:0 0 28px;">Great news — <strong>${bizName}</strong> is now live on ExpatBase Slovakia. Expats searching for English-speaking professionals in Bratislava can find and contact you.</p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
            <tr><td align="center">
              <a href="${profileUrl}" style="display:inline-block;background:#1A4F8A;color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">View your listing →</a>
            </td></tr>
          </table>

          <p style="font-size:15px;font-weight:600;margin:0 0 8px;">Manage your profile</p>
          <p style="font-size:14px;color:#555;margin:0 0 16px;">Click the button below to set up your account and edit your listing — update your description, opening hours, add photos, and see your reviews.</p>

          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
            <tr><td align="center">
              <a href="${magicLink}" style="display:inline-block;background:#F8F8F6;border:1.5px solid #dce4f0;color:#1A4F8A;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">Access my dashboard →</a>
            </td></tr>
          </table>

          <p style="font-size:12px;color:#999;margin:0;">This login link expires in 24 hours. If you need a new one, reply to this email.</p>
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
      const { bizName, contactName, bizEmail, profileUrl, magicLink } = body;
      const tpl = approvalNotifyEmail({ bizName, contactName, profileUrl, magicLink });
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: bizEmail, name: contactName }],
        ...tpl,
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
