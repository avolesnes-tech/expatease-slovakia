-- ExpatBase: publish profile JUDr. Miroslav Repka (status approved)
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district,
   description, tagline, about, english_speaking, languages, plan, status,
   website, social_links, logo_url, cover_url, gallery, opening_hours)
select
  gen_random_uuid(), name, category, subcategories, contact_name, email, phone, address, district,
  description, tagline, about, english_speaking, languages, plan, status,
  website, social_links, logo_url, cover_url, gallery, opening_hours
from jsonb_populate_record(null::public.businesses, $json${
  "name": "JUDr. Miroslav Repka – Family Lawyer & Mediator",
  "category": "Lawyers & Legal",
  "subcategories": ["Family & Divorce"],
  "contact_name": "Miroslav Repka",
  "email": "miro@repka.sk",
  "phone": "+421 905 736 582",
  "address": "Leškova 3/A",
  "district": "Staré Mesto",
  "description": "Family lawyer and mediator in Bratislava: divorce, custody, maintenance and property settlement, handled calmly, humanely and towards agreement.",
  "tagline": "Family lawyer and mediator in Bratislava: divorce, custody, maintenance and property settlement, handled calmly, humanely and towards agreement.",
  "about": "JUDr. Miroslav Repka has practised law and mediation since 2007 and focuses exclusively on family law. He graduated from the Faculty of Law of Comenius University and is a registered attorney (Slovak Bar Association no. 5527) and mediator (reg. no. 88). He represents clients in contested and uncontested divorces, child custody and shared-custody arrangements, child and spousal maintenance, and the division of marital property, including real estate, loans and business shares. As a mediator he helps couples and parents reach agreements out of court. In urgent situations, such as domestic violence or an endangered child, he can act quickly, also outside office hours. Clients can follow their case online through a secure client portal, and psychological and parenting support is available through a partner team.",
  "english_speaking": true,
  "languages": ["Slovak", "English"],
  "plan": "founding",
  "status": "approved",
  "website": "https://repka.sk/en/",
  "social_links": {"instagram": "https://www.instagram.com/rodinny.advokat/", "facebook": "https://www.facebook.com/rodinnyadvokat"},
  "logo_url": "https://repka.sk/foto-repka.jpg",
  "cover_url": "https://repka.sk/media/zdielanie.jpg",
  "gallery": ["https://repka.sk/media/reel-portal-nahlad-en.jpg"],
  "opening_hours": {
    "monday": {"open": true, "from": "08:30", "to": "16:30"},
    "tuesday": {"open": true, "from": "08:30", "to": "16:30"},
    "wednesday": {"open": true, "from": "08:30", "to": "16:30"},
    "thursday": {"open": true, "from": "08:30", "to": "16:30"},
    "friday": {"open": true, "from": "08:30", "to": "16:30"},
    "saturday": {"open": false},
    "sunday": {"open": false}
  }
}$json$::jsonb)
returning id, name, status;
