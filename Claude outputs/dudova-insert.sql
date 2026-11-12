-- ExpatBase: publish profile Ing. Mária Dudová (status approved)
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, logo_url, cover_url, gallery)
select
  'e5230416-d455-4df3-8560-4967403b6dec'::uuid, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, logo_url, cover_url, gallery
from jsonb_populate_record(null::public.businesses, $json${
  "name": "Ing. Mária Dudová – Financial Advisor",
  "category": "Banks & Finance",
  "subcategories": [
    "Financial Advisor",
    "Mortgage Advisor"
  ],
  "contact_name": "Mária Dudová",
  "email": "maria.dudova@swisslifeselect.sk",
  "phone": "+421 908 686 379",
  "address": "Za Kasárňou 1",
  "district": "Nové Mesto",
  "description": "Financial planning and investment advice. I'll save you time and money so you can focus on the things that really matter.",
  "tagline": "Financial planning and investment advice. I'll save you time and money so you can focus on the things that really matter.",
  "about": "The offer of my services is rich. I offer broker services in the following areas.\n\nTailor-made mortgage: I will tell you what conditions must be met if you want to apply for a mortgage in Slovakia and how much you can afford to borrow as a result. As I work with all banks, I can tell you which one is the best option for you. With me, you will get a tailor-made mortgage.\n\nInvestment and savings: Whether you are saving up for retirement or college fees for your child, our common goal is to maximize the return on your investment. We will draw up a scheme that suits your needs best thanks to a wide portfolio of investment products.\n\nInsurance: Life is full of unexpected situations and I will help you prepare for them. I will explain to you what potential risks you face and what insurance policy will provide you with sufficient financial support in difficult times.\n\nIt is important that clients consult their financial needs with a professional. I have licences valid in all banking sectors, and my business partners are all the banks and insurance companies operating in Slovakia. Therefore, I am able to choose the most suitable product for my clients. My recommendations are based on facts and statistics, not assumptions. I provide comprehensive financial solutions. I help people make money, protect their assets and build the future they have always imagined.\n\nBased on Act 186/2009 on financial intermediation and financial advisory, I am an independent financial agent. I receive a commission from the financial institution whose product we contract. Consultation and financial broker services are free of charge.",
  "english_speaking": true,
  "languages": [
    "Slovak",
    "English"
  ],
  "plan": "founding",
  "status": "approved",
  "website": "https://www.mariadudova.sk/en/home/",
  "social_links": {
    "instagram": "https://www.instagram.com/financie_s_mery",
    "facebook": "https://www.facebook.com/FinanciesMery/"
  },
  "logo_url": "https://www.mariadudova.sk/wp-content/uploads/2024/04/MD-Logo-CMYK.png",
  "cover_url": null,
  "gallery": [
    "https://www.mariadudova.sk/wp-content/uploads/2025/11/Maria-Dudova-najlepsi-financny-poradca.jpg"
  ]
}$json$::jsonb)
returning id, name, status;
