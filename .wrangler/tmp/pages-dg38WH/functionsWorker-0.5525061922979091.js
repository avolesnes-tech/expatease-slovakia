var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// airtable-submit.js
async function onRequestPost(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  const token = env.AIRTABLE_TOKEN;
  const baseId = "appB4cWwPnCEuHSgI";
  if (!token) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: cors });
  }
  const url = new URL(request.url);
  const table = url.searchParams.get("table") || "Submissions";
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: cors });
  }
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields: body })
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `Airtable ${res.status}`);
    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200, headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
  }
}
__name(onRequestPost, "onRequestPost");
async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");

// send-email.js
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};
var BREVO_URL = "https://api.brevo.com/v3/smtp/email";
var FROM = { name: "ExpatBase Slovakia", email: "hello@expatbase.sk" };
function response(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}
__name(response, "response");
async function sendBrevo(apiKey, payload) {
  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo ${res.status}: ${err}`);
  }
  return res.json();
}
__name(sendBrevo, "sendBrevo");
function submissionConfirmEmail({ bizName, contactName, plan }) {
  const planNote = plan === "founding" ? "You're joining as a <strong>Founding Member</strong> \u2014 a complete profile, free during our launch. No payment is needed now, and we'll always give you advance notice before any paid plans launch." : plan === "premium" ? "You applied for a <strong>Premium listing</strong>. Our team will be in touch to arrange your photos and confirm payment once the listing is approved." : "You applied for a <strong>Basic (free) listing</strong>.";
  return {
    subject: `We received your ExpatBase listing \u2014 ${bizName}`,
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
          <p style="font-size:12px;color:#999;margin:0;">ExpatBase Slovakia \xB7 Bratislava \xB7 <a href="https://expatbase.sk" style="color:#1A4F8A;text-decoration:none;">expatbase.sk</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  };
}
__name(submissionConfirmEmail, "submissionConfirmEmail");
function approvalNotifyEmail({ bizName, contactName, profileUrl, magicLink }) {
  return {
    subject: `Your ExpatBase listing is live \u2014 ${bizName}`,
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
          <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">You're live on ExpatBase! \u{1F389}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">English-speaking expats can now find you</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="font-size:15px;margin:0 0 20px;">Hi ${contactName},</p>
          <p style="font-size:15px;margin:0 0 28px;">Great news \u2014 <strong>${bizName}</strong> is now live on ExpatBase Slovakia. Expats searching for English-speaking professionals in Bratislava can find and contact you.</p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
            <tr><td align="center">
              <a href="${profileUrl}" style="display:inline-block;background:#1A4F8A;color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">View your listing \u2192</a>
            </td></tr>
          </table>

          <p style="font-size:15px;font-weight:600;margin:0 0 8px;">Manage your profile</p>
          <p style="font-size:14px;color:#555;margin:0 0 16px;">Click the button below to set up your account and edit your listing \u2014 update your description, opening hours, add photos, and see your reviews.</p>

          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
            <tr><td align="center">
              <a href="${magicLink}" style="display:inline-block;background:#F8F8F6;border:1.5px solid #dce4f0;color:#1A4F8A;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">Access my dashboard \u2192</a>
            </td></tr>
          </table>

          <p style="font-size:12px;color:#999;margin:0;">This login link expires in 24 hours. If you need a new one, reply to this email.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F8F8F6;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="font-size:12px;color:#999;margin:0;">ExpatBase Slovakia \xB7 Bratislava \xB7 <a href="https://expatbase.sk" style="color:#1A4F8A;text-decoration:none;">expatbase.sk</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
  };
}
__name(approvalNotifyEmail, "approvalNotifyEmail");
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
<p><a href="https://supabase.com/dashboard/project/etxqrlrqbjcbjmitnspv/editor" style="color:#1A4F8A;">Review in Supabase \u2192</a></p>`
  };
}
__name(adminNotifyEmail, "adminNotifyEmail");
async function onRequestPost2(context) {
  const { request, env } = context;
  const apiKey = env.BREVO_API_KEY;
  const adminEmail = env.ADMIN_EMAIL || "avolesnes@gmail.com";
  if (!apiKey) return response({ error: "Email service not configured" }, 500);
  let body;
  try {
    body = await request.json();
  } catch {
    return response({ error: "Invalid JSON" }, 400);
  }
  const { type } = body;
  try {
    if (type === "submission_confirm") {
      const { bizName, contactName, bizEmail, category, plan } = body;
      const tpl = submissionConfirmEmail({ bizName, contactName, plan });
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: bizEmail, name: contactName }],
        ...tpl
      });
      const adminTpl = adminNotifyEmail({ bizName, contactName, bizEmail, category, plan, adminEmail });
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: adminEmail, name: "Anna" }],
        ...adminTpl
      });
      return response({ success: true });
    }
    if (type === "approval_notify") {
      const { bizName, contactName, bizEmail, profileUrl, magicLink } = body;
      const tpl = approvalNotifyEmail({ bizName, contactName, profileUrl, magicLink });
      await sendBrevo(apiKey, {
        sender: FROM,
        to: [{ email: bizEmail, name: contactName }],
        ...tpl
      });
      return response({ success: true });
    }
    return response({ error: "Unknown email type" }, 400);
  } catch (err) {
    console.error("send-email error:", err.message);
    return response({ error: err.message }, 500);
  }
}
__name(onRequestPost2, "onRequestPost");
async function onRequestOptions2() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });
}
__name(onRequestOptions2, "onRequestOptions");

// submit-business.js
async function onRequestPost3(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }
  const required = ["name", "category", "phone", "email", "address", "description", "plan", "contact_name"];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return new Response(
        JSON.stringify({ error: `Missing required field: ${field}` }),
        { status: 400, headers: corsHeaders }
      );
    }
  }
  const row = {
    name: body.name.trim(),
    category: body.category.trim(),
    phone: body.phone.trim(),
    email: body.email.trim(),
    address: body.address.trim(),
    description: body.description.trim(),
    plan: body.plan === "premium" ? "premium" : "basic",
    contact_name: body.contact_name.trim(),
    english_speaking: body.english_speaking === true,
    status: "pending",
    website: body.website ? body.website.trim() : null,
    social_links: body.social_links || null,
    about: body.about ? body.about.trim() : null,
    opening_hours: body.opening_hours || null
  };
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: corsHeaders });
  }
  try {
    const response2 = await fetch(`${supabaseUrl}/rest/v1/businesses`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(row)
    });
    if (response2.status === 201) {
      const data = await response2.json();
      return new Response(
        JSON.stringify({ success: true, id: data[0]?.id }),
        { status: 200, headers: corsHeaders }
      );
    }
    const errBody = await response2.text();
    console.error("Supabase error:", response2.status, errBody);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500, headers: corsHeaders });
  } catch (err) {
    console.error("submit-business error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}
__name(onRequestPost3, "onRequestPost");
async function onRequestOptions3() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });
}
__name(onRequestOptions3, "onRequestOptions");

// ../.wrangler/tmp/pages-dg38WH/functionsRoutes-0.6326226699204718.mjs
var routes = [
  {
    routePath: "/airtable-submit",
    mountPath: "/",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/airtable-submit",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/send-email",
    mountPath: "/",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/send-email",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/submit-business",
    mountPath: "/",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions3]
  },
  {
    routePath: "/submit-business",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  }
];

// ../../../../../../.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response2 = await handler(context);
        if (!(response2 instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response2);
      } else if ("ASSETS") {
        const response2 = await env["ASSETS"].fetch(request);
        return cloneResponse(response2);
      } else {
        const response2 = await fetch(request);
        return cloneResponse(response2);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response2 = await env["ASSETS"].fetch(request);
        return cloneResponse(response2);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response2) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response2.status) ? null : response2.body,
    response2
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
