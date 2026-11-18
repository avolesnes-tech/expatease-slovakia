-- ExpatBase: publish profile Chiropraxia Dávid Szekeres (status approved)
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, opening_hours, logo_url, cover_url, gallery)
select
  'f5e474c0-eddb-44f4-a983-d4dd32a8489d'::uuid, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, opening_hours, logo_url, cover_url, gallery
from jsonb_populate_record(null::public.businesses, $json${
  "name": "Chiropraxia Dávid Szekeres",
  "category": "Doctors & Specialists",
  "subcategories": [
    "Physiotherapy"
  ],
  "contact_name": "Dávid Szekeres",
  "email": "chiropraxiads@gmail.com",
  "phone": "+421 918 210 837",
  "address": "Šusteková 2422/2 (Polyclinic, 3rd floor)",
  "district": "Petržalka",
  "description": "New chiropractic clinic in Petržalka, Bratislava. 8 years of experience, care in English. Book by phone or email.",
  "tagline": "New chiropractic clinic in Petržalka, Bratislava. 8 years of experience, care in English. Book by phone or email.",
  "about": "I am Dávid Szekeres, a chiropractor with 8 years of experience, and I have just opened my new clinic at the Šusteková Polyclinic in Petržalka, Bratislava. I speak English, so you can explain everything that bothers you without a language barrier.\n\nIf you have back pain or simply want to feel better in your body, feel free to reach out. I use hands-on chiropractic adjustments of the spine and joints to help release blockages and get your body moving freely again.\n\nYou will find me on the 3rd floor of the polyclinic. I see clients Monday to Friday from 8:00 to 13:00. To book an appointment, simply call me or send me an email.",
  "english_speaking": true,
  "languages": [
    "Slovak",
    "English"
  ],
  "plan": "founding",
  "status": "approved",
  "website": null,
  "social_links": {
    "facebook": "https://www.facebook.com/profile.php?id=61581076408532"
  },
  "opening_hours": {
    "monday": {
      "open": true,
      "from": "08:00",
      "to": "13:00"
    },
    "tuesday": {
      "open": true,
      "from": "08:00",
      "to": "13:00"
    },
    "wednesday": {
      "open": true,
      "from": "08:00",
      "to": "13:00"
    },
    "thursday": {
      "open": true,
      "from": "08:00",
      "to": "13:00"
    },
    "friday": {
      "open": true,
      "from": "08:00",
      "to": "13:00"
    },
    "saturday": {
      "open": false
    },
    "sunday": {
      "open": false
    }
  },
  "logo_url": "https://etxqrlrqbjcbjmitnspv.supabase.co/storage/v1/object/public/business-media/f5e474c0-eddb-44f4-a983-d4dd32a8489d/logo.jpg",
  "cover_url": null,
  "gallery": [
    "https://etxqrlrqbjcbjmitnspv.supabase.co/storage/v1/object/public/business-media/f5e474c0-eddb-44f4-a983-d4dd32a8489d/gal_g1.jpg",
    "https://etxqrlrqbjcbjmitnspv.supabase.co/storage/v1/object/public/business-media/f5e474c0-eddb-44f4-a983-d4dd32a8489d/gal_g2.jpg",
    "https://etxqrlrqbjcbjmitnspv.supabase.co/storage/v1/object/public/business-media/f5e474c0-eddb-44f4-a983-d4dd32a8489d/gal_g3.jpg"
  ]
}$json$::jsonb)
returning id, name, status;
