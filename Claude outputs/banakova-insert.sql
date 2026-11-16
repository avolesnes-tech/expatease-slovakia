-- ExpatBase: publish profile JUDr. Petra Baňáková (status approved)
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, logo_url, cover_url, gallery)
select
  'f989884d-22b5-4c0f-a3c2-dce4c559d04e'::uuid, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, logo_url, cover_url, gallery
from jsonb_populate_record(null::public.businesses, $json${
  "name": "JUDr. Petra Baňáková – Attorney at Law",
  "category": "Lawyers & Legal",
  "subcategories": [
    "Family & Divorce",
    "Corporate & Business",
    "Property & Real Estate"
  ],
  "contact_name": "Petra Baňáková",
  "email": "banakova@advocatenitra.eu",
  "phone": "+421 905 309 394",
  "address": "Dunajská 4",
  "district": "Staré Mesto",
  "description": "Get expert legal advice and support for you and your business activities in Slovakia, in English, German and Spanish.",
  "tagline": "Get expert legal advice and support for you and your business activities in Slovakia, in English, German and Spanish.",
  "about": "With years of experience and expertise, I strive to provide first-class legal services to individuals and companies in German, English and Spanish. Whether you need help with family, civil or commercial law, drafting contracts or resolving disputes, I am here to guide you through the complexities of the Slovak legal system.\n\nI have been working as a lawyer since 2008. I specialize in the areas of family, civil and commercial law. I also practice real estate law. From 2016 to 2021 I worked as the head of the Slovak office of the international law firm Moreno Vlk & Asociados, which allowed me to work internationally and gain experience in various areas of law. At The Hague Academy of International Law I took the Winter Course in International Law (Public and Private).\n\nFamily law: legal advice and representation in divorce proceedings and in proceedings involving minor children, including visitation, custody and child support.\nCommercial law: drafting contracts and representing companies before the commercial register.\nReal estate law: reviewing and preparing real estate transfer agreements, including their authorization.\nEnforcement law: recovery of claims based on enforcement titles issued in Slovakia and across the EU, such as the European Payment Order.\nInheritance law: advising foreigners living in Slovakia on cross-border succession and declarations of applicable law.\nRecognition and enforcement of foreign judgments, issued in the EU and outside the EU.\n\nMy priority is clear communication, attention to detail and commitment to your goal.",
  "english_speaking": true,
  "languages": [
    "Slovak",
    "English",
    "German",
    "Spanish"
  ],
  "plan": "founding",
  "status": "approved",
  "website": "https://advocatenitra.eu/en/",
  "social_links": {
    "instagram": "https://www.instagram.com/advokat_petra_banakova/",
    "facebook": "https://www.facebook.com/profile.php?id=100063476225669"
  },
  "logo_url": "https://advocatenitra.eu/wp-content/uploads/2023/11/advocatenitra-detailed-right-logo-200x65.png",
  "cover_url": null,
  "gallery": [
    "https://advocatenitra.eu/wp-content/uploads/2023/11/Nr-1.jpg"
  ]
}$json$::jsonb)
returning id, name, status;
