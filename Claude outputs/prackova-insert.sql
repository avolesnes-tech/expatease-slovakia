-- ExpatBase: publish profile JUDr. Mgr. Zuzana Pračková – Moja Právnička (status approved)
-- Run once in Supabase → SQL Editor. Safe to re-run: it skips if the email already exists.
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, logo_url, cover_url, gallery)
select
  gen_random_uuid(), name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, logo_url, cover_url, gallery
from jsonb_populate_record(null::public.businesses, $json${
  "name": "JUDr. Mgr. Zuzana Pračková – Moja Právnička",
  "category": "Lawyers & Legal",
  "subcategories": [
    "Family & Divorce",
    "Property & Real Estate"
  ],
  "contact_name": "Zuzana Pračková",
  "email": "prackova@wolfcase.sk",
  "phone": "+421 904 922 041",
  "address": "Štefanovičova 18",
  "district": "Staré Mesto",
  "description": "Law firm in Bratislava's Old Town: divorce, family crisis situations, property settlement and disputes.",
  "tagline": "Law firm in Bratislava's Old Town: divorce, family crisis situations, property settlement and disputes.",
  "about": "Divorce is an emotionally difficult process and at the same time a new beginning, so we understand that you want to be sure everything goes smoothly and without delays. We provide individual legal advice on divorce proceedings, prepare the divorce petition or your response to it, and represent you in court.\n\nSettlement of marital property (BSM): advice on your rights and the ways of settlement, preparing settlement agreements, negotiating with the other party and representing you in court.\n\nContracts: review and drafting of contracts tailored to your needs, so that they protect your rights and minimise legal risks.\n\nProperty law: protection of ownership, purchase, lease and transfer agreements, and registration with the land registry (kataster).\n\nCivil disputes: debt recovery, compensation for damage, contractual disputes and representation in court.\n\nYou can book a consultation online. We run a weekly legal advice column on Topky.sk. Parking near the office is paid; just give us your car's registration number and we will pay the parking for the time of your consultation.",
  "english_speaking": true,
  "languages": [
    "Slovak",
    "English"
  ],
  "plan": "founding",
  "status": "approved",
  "website": "https://mojapravnicka.sk/",
  "social_links": {
    "instagram": "https://www.instagram.com/mojapravnicka.sk"
  },
  "logo_url": "https://mojapravnicka.sk/dist/assets/images/logoMojaPravnickaLowProfile.svg",
  "cover_url": "https://mojapravnicka.sk/dist/assets/images/ZuzanaHQ.0771d8d8.jpg",
  "gallery": [
    "https://mojapravnicka.sk/media/pages/home/50635527f9-1793562388/televizia01.jpeg",
    "https://mojapravnicka.sk/media/pages/home/03aa7bda30-1793562386/televizia03.jpg"
  ]
}$json$::jsonb)
where not exists (select 1 from public.businesses where email = 'prackova@wolfcase.sk')
returning id, name, status;
