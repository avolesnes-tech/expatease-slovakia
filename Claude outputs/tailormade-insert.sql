-- ExpatBase: publish profile TAILOR MADE (status approved)
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, opening_hours, logo_url, cover_url, gallery)
select
  '27cdf9dc-abaf-4408-bb41-5c42698afe02'::uuid, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, opening_hours, logo_url, cover_url, gallery
from jsonb_populate_record(null::public.businesses, $json${
  "name": "TAILOR MADE",
  "category": "Others",
  "subcategories": [
    "Tailor & Seamstress"
  ],
  "contact_name": "Andreas Kreutz",
  "email": "tailormade@tailormade.sk",
  "phone": "+421 917 539 521",
  "address": "Pribinova 8, EUROVEA",
  "district": "Staré Mesto",
  "description": "Bespoke suits, made-to-measure shirts and premium menswear in EUROVEA, Bratislava. Tailoring with love since 2011.",
  "tagline": "Bespoke suits, made-to-measure shirts and premium menswear in EUROVEA, Bratislava. Tailoring with love since 2011.",
  "about": "TAILOR MADE means exactly that: made to measure. It has been our motto since 2011. We make clothes precisely to our clients' wishes and body measurements, and we help men put together the right styling for a specific occasion or their personality.\n\nWe are specialists in made-to-measure tailoring and, at the same time, a boutique full of beautiful pieces from Italy, England, Spain and France. You will find modern and timeless collections of men's suits, shoes and accessories, as well as jeans and casual pieces.\n\nBespoke suits: every suit is cut individually for you, cut out by hand and finished with your monogram inside the jacket. We start with a consultation about your style and the occasions you will wear it for, then take your measurements and invite you to a fitting where we fine-tune every detail. The whole process usually takes 6 to 8 weeks. Bespoke suits start from approx. €900.\n\nMade-to-measure shirts: choose the collar, cuffs, buttons, monogram and more from over 1,000 cotton and linen fabrics. A shirt takes about 4 weeks, or about 5 working days with our express service. Prices start from €150.\n\nShoes to order: if we don't have your size or style in store, we can order shoes directly from BARKER in England or DOUCAL'S in Italy.\n\nVisit us on the 1st floor of EUROVEA. For made-to-measure orders, it is best to book an appointment in advance.",
  "english_speaking": true,
  "languages": [
    "Slovak",
    "English",
    "German"
  ],
  "plan": "founding",
  "status": "approved",
  "website": "https://tailormade.sk/",
  "social_links": {
    "instagram": "https://www.instagram.com/tailor_made_boutique/",
    "facebook": "https://www.facebook.com/tailormade.sk/"
  },
  "opening_hours": {
    "monday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    },
    "tuesday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    },
    "wednesday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    },
    "thursday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    },
    "friday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    },
    "saturday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    },
    "sunday": {
      "open": true,
      "from": "10:00",
      "to": "21:00"
    }
  },
  "logo_url": "https://tailormade.sk/wp-content/uploads/2024/03/LOGO_tailormade-02.png",
  "cover_url": null,
  "gallery": [
    "https://tailormade.sk/wp-content/uploads/2024/05/pansky-oblek-elegancia.jpg",
    "https://tailormade.sk/wp-content/uploads/2024/05/elegantny-oblek-sako-motylik.jpg",
    "https://tailormade.sk/wp-content/uploads/2024/05/vzorkovnik-kvalitne-luxusne-latky-materialy-1229x800.jpg",
    "https://tailormade.sk/wp-content/uploads/2024/05/luxusne-elegantne-topanky-site-na-mieru-800x800.jpg"
  ]
}$json$::jsonb)
returning id, name, status;
