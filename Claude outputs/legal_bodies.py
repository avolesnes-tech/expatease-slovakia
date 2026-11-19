import re, sys, os
os.chdir(sys.argv[1])

TH = 'style="text-align:left; padding:10px 14px; font-weight:600; color:var(--gray-900);"'
TD = 'style="padding:10px 14px; border-bottom:1px solid var(--gray-100); vertical-align:top;"'
def table(head, rows):
    h = ''.join(f'<th {TH}>{c}</th>' for c in head)
    b = ''.join('<tr>' + ''.join(f'<td {TD}>{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<table style="width:100%; border-collapse:collapse; font-size:14px; margin:16px 0 24px;">'
            f'<thead><tr style="background:var(--blue-light);">{h}</tr></thead><tbody>{b}</tbody></table>')

DATE = '19 November 2026'

COOKIE = f'''
 <div class="legal-box">
 This Cookie Policy explains which cookies and similar technologies (such as browser local storage) ExpatBase Slovakia uses and how you can control them. It should be read together with our <a href="privacy-policy.html">Privacy Policy</a>.
 </div>

 <h2>1. What are cookies and local storage?</h2>
 <p>Cookies are small text files that a website saves in your browser. Local storage works in a similar way. Under Slovak law (Act No. 452/2021 Coll. on Electronic Communications, Section 109) we may store or read such information on your device without your consent only where it is strictly necessary to provide a service you asked for. Everything else needs your consent.</p>

 <h2>2. Strictly necessary (always on)</h2>
 <p>These are needed for the website to work and cannot be switched off.</p>
 {table(['Name','Purpose','Type / duration'], [
   ['ee_cookie_consent, ee_cookie_consent_at','Remembers your cookie choice and when you made it','Local storage, until you change it or clear your browser data'],
   ['sb-…-auth-token','Keeps you signed in if you log in (community account or business dashboard)','Local storage, until you sign out'],
   ['ee_member','Remembers that you joined the community, so you are not asked again before writing a review','Local storage, until you clear your browser data'],
   ['__cf_bm, cf_clearance','Set by Cloudflare to protect the site against bots and attacks','Cookie, 30 minutes or up to the session'],
 ])}

 <h2>3. Only with your consent</h2>
 <p>These are loaded or stored <strong>only after you click "Accept"</strong> in our cookie banner. If you decline, they are never set.</p>
 {table(['Name','Purpose','Type / duration'], [
   ['_ga, _ga_CDQ8WCZ8WW','Google Analytics 4: measures how the site is used (pages visited, where visitors come from). IP addresses are not stored by Google Analytics 4 and data is not used for advertising.','Cookie, up to 24 months'],
   ['eb_vid, eb_seen','A random anonymous ID that lets us give listed businesses simple statistics (for example "your profile was viewed 120 times this month") and avoid counting the same visitor twice a day. It is not linked to your name or email.','Local storage, until you withdraw consent or clear your browser data'],
 ])}
 <p>We also use <strong>Cloudflare Web Analytics</strong> to measure overall traffic. It does not use cookies, does not store anything on your device and does not identify you.</p>

 <h2>4. What we do not use</h2>
 <ul>
 <li>Advertising or retargeting cookies</li>
 <li>Facebook Pixel or other social-media tracking</li>
 <li>Any technology that tracks you across other websites</li>
 </ul>

 <h2>5. Changing or withdrawing your consent</h2>
 <p>You can change your choice at any time by clicking <a href="#" data-cookie-settings><strong>Cookie settings</strong></a> (also in the footer of every page). If you withdraw consent, we stop Google Analytics and delete the anonymous ID from your browser. Withdrawing consent does not affect the lawfulness of processing before the withdrawal. You can also delete cookies and local storage in your browser settings.</p>

 <h2>6. Changes to this Cookie Policy</h2>
 <p>We update this policy when we change the technologies we use. The date at the top shows the latest version.</p>

 <h2>7. Contact</h2>
 <p>Questions about cookies: <a href="mailto:hello@expatbase.sk">hello@expatbase.sk</a></p>
'''

PRIVACY = f'''
 <div class="legal-box">
 This Privacy Policy explains how ExpatBase Slovakia processes personal data under the General Data Protection Regulation (EU) 2016/679 ("GDPR") and Slovak Act No. 18/2018 Coll. on Personal Data Protection. It covers visitors, community members, reviewers, newsletter subscribers and businesses listed on ExpatBase.
 </div>

 <h2>1. Data controller</h2>
 <p>Anna Lockwoodová<br>Dlhá 38/A, 903 01 Senec, Slovakia<br>Email: <a href="mailto:hello@expatbase.sk">hello@expatbase.sk</a></p>
 <p>We have not appointed a data protection officer, as we are not required to. For any privacy question, write to the email above.</p>

 <h2>2. What data we process, why, and on what legal basis</h2>

 <h3>2.1 Businesses and professionals listed on ExpatBase</h3>
 <p><strong>Data:</strong> business name, contact person's name, phone, email, address, district, website and social media links (Instagram, Facebook, LinkedIn), description, categories, languages, opening hours, logo and photos, and, where the professional is a natural person (for example a doctor or lawyer), their name and professional details. If you log in to the business dashboard, also your login email.</p>
 <p><strong>Purpose:</strong> to review, publish and maintain your listing, to let you manage it, and to send you service emails about it (confirmation, publication, important changes).</p>
 <p><strong>Legal basis:</strong> performance of the agreement on your listing, which you conclude by submitting it (Art. 6(1)(b) GDPR). The anonymous view and click statistics we may share with you are aggregated and contain no personal data of visitors.</p>

 <h3>2.2 Community members, Google sign-in and favourites</h3>
 <p><strong>Data:</strong> your name and email address; if you sign in with Google, also the name, email and profile picture Google shares with us; your saved favourites and badges.</p>
 <p><strong>Purpose:</strong> to create and run your community account and let you save favourites and write reviews.</p>
 <p><strong>Legal basis:</strong> performance of the agreement on your free account (Art. 6(1)(b) GDPR).</p>

 <h3>2.3 Reviews</h3>
 <p><strong>Data:</strong> your name as you enter it (published next to the review), your email (never published), rating, review text and date.</p>
 <p><strong>Purpose:</strong> to publish your review, prevent abuse and contact you about it if needed.</p>
 <p><strong>Legal basis:</strong> performance of the agreement on your account (Art. 6(1)(b) GDPR) and our legitimate interest in keeping reviews genuine and lawful (Art. 6(1)(f) GDPR). Please do not include other people's personal data in a review.</p>

 <h3>2.4 "Suggest a business"</h3>
 <p><strong>Data:</strong> the business details you suggest and your account details.</p>
 <p><strong>Purpose and legal basis:</strong> to review the suggestion and possibly contact the business (Art. 6(1)(f) GDPR, our legitimate interest in growing a useful directory). We only publish a business after it registers itself or agrees.</p>

 <h3>2.5 Newsletter</h3>
 <p><strong>Data:</strong> email address and, if given, your name.</p>
 <p><strong>Purpose:</strong> to send you the ExpatBase newsletter (new experts, practical tips, community news).</p>
 <p><strong>Legal basis:</strong> your consent (Art. 6(1)(a) GDPR and Section 116 of Act No. 452/2021 Coll.). The box is never pre-ticked. You can unsubscribe at any time via the link in every email or by writing to us.</p>

 <h3>2.6 Contact form and emails</h3>
 <p><strong>Data:</strong> name, email and the content of your message.</p>
 <p><strong>Purpose and legal basis:</strong> to answer your enquiry (Art. 6(1)(b) GDPR, or Art. 6(1)(f) GDPR, our legitimate interest in replying to messages). Messages go only to ExpatBase; we do not forward them to listed businesses.</p>

 <h3>2.7 Website analytics and security</h3>
 <p><strong>Cloudflare</strong> processes technical connection data (such as IP address and browser type) to deliver and protect the website, and provides cookie-less, aggregate traffic statistics (legitimate interest, Art. 6(1)(f) GDPR).</p>
 <p><strong>Google Analytics 4</strong> and the <strong>anonymous ID</strong> used for listing statistics are used <strong>only with your consent</strong> (Art. 6(1)(a) GDPR). Details are in our <a href="cookie-policy.html">Cookie Policy</a>.</p>

 <h2>3. Who processes data for us (processors) and transfers outside the EU</h2>
 {table(['Provider','What they do','Location / safeguard'], [
   ['Supabase, Inc.','Database, file storage (logos, photos) and user login','Data stored in the EU (AWS, Ireland); EU Standard Contractual Clauses for any access from outside the EU'],
   ['Cloudflare, Inc.','Hosting, security, delivery of the website, cookie-less analytics, server functions','Global network; EU–U.S. Data Privacy Framework and Standard Contractual Clauses'],
   ['Airtable, Inc.','Stores the list of community members and newsletter subscribers','USA; EU Standard Contractual Clauses in Airtable&rsquo;s Data Processing Addendum'],
   ['Sendinblue SAS (Brevo)','Sending emails (confirmations, notifications, newsletter)','France, EU'],
   ['Google Ireland Ltd. / Google LLC','Google sign-in; Google Analytics (only with consent)','EU / USA; EU–U.S. Data Privacy Framework'],
   ['WebSupport s.r.o.','Our mailbox hello@expatbase.sk','Slovakia, EU'],
 ])}
 <p>Information you publish in a listing or a review is public and visible to anyone visiting the website. We do not sell or rent personal data and do not share it for third parties&rsquo; marketing.</p>

 <h2>4. How long we keep data</h2>
 <ul>
 <li><strong>Listings:</strong> while the listing is active, then up to 12 months after it ends (to handle questions or disputes), unless a longer period is required by law (for example accounting records once paid plans exist).</li>
 <li><strong>Community accounts and favourites:</strong> until you delete your account or ask us to.</li>
 <li><strong>Reviews:</strong> while published; deleted reviews are kept up to 6 months for abuse prevention.</li>
 <li><strong>Newsletter:</strong> until you unsubscribe; removed within 30 days.</li>
 <li><strong>Contact messages:</strong> up to 24 months after the conversation ends.</li>
 <li><strong>Google Analytics:</strong> 14 months.</li>
 </ul>

 <h2>5. Your rights</h2>
 <p>You have the right to access your data, to rectification, erasure, restriction of processing and data portability, to object to processing based on legitimate interest (Art. 6(1)(f) GDPR), and to withdraw consent at any time without affecting earlier processing. We do not use automated decision-making or profiling. To exercise your rights, write to <a href="mailto:hello@expatbase.sk">hello@expatbase.sk</a>. We reply within one month.</p>

 <h2>6. Complaints</h2>
 <p>You can lodge a complaint with the Office for Personal Data Protection of the Slovak Republic (Úrad na ochranu osobných údajov SR), Hraničná 12, 820 07 Bratislava, <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer">dataprotection.gov.sk</a>.</p>

 <h2>7. Do you have to provide data?</h2>
 <p>Browsing ExpatBase requires no personal data. Data marked as required in our forms is needed to create a listing, an account or a review; without it we cannot provide that service.</p>

 <h2>8. Security</h2>
 <p>We use encrypted connections (HTTPS), access restricted to the operator, database access rules and reputable providers with their own security certifications.</p>

 <h2>9. Changes to this policy</h2>
 <p>We update this policy when our services or the law change. The date at the top shows the latest version; important changes will be announced on the website or by email.</p>

 <h2>10. Contact</h2>
 <p><a href="mailto:hello@expatbase.sk">hello@expatbase.sk</a></p>
'''

for f, body in [('cookie-policy.html', COOKIE), ('privacy-policy.html', PRIVACY)]:
    s = open(f, encoding='utf-8').read()
    s = re.sub(r'Last updated: [^<]*', f'Last updated: {DATE}', s, count=1)
    a = s.index('<div class="legal-body">') + len('<div class="legal-body">')
    b = s.index('<footer', a)
    end = s.rindex('</div>', a, b)
    s = s[:a] + body + s[end:]
    open(f, 'w', encoding='utf-8').write(s)
    print(f, 'ok')
