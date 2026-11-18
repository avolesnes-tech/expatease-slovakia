-- ExpatBase: publish profile IKKOS Premium Fitness (status approved)
insert into public.businesses
  (id, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, opening_hours, logo_url, cover_url, gallery)
select
  'b654a8c6-b99e-4373-adc1-1d75c35f90e1'::uuid, name, category, subcategories, contact_name, email, phone, address, district, description, tagline, about, english_speaking, languages, plan, status, website, social_links, opening_hours, logo_url, cover_url, gallery
from jsonb_populate_record(null::public.businesses, $json${
  "name": "IKKOS Premium Fitness",
  "category": "Sports & Leisure",
  "subcategories": [
    "Gym",
    "Personal Trainer"
  ],
  "contact_name": "Martin",
  "email": "martin@ikkos.sk",
  "phone": "+421 902 214 743",
  "address": "Suché mýto 1 (The Europeum passage)",
  "district": "Staré Mesto",
  "description": "Premium fitness club in Bratislava's Old Town where you always train with a personal trainer. Free first training, no contract.",
  "tagline": "Premium fitness club in Bratislava's Old Town where you always train with a personal trainer. Free first training, no contract.",
  "about": "We are a premium fitness club in Bratislava's Old Town (Staré Mesto), offering a complete lifestyle upgrade. We focus on real results. Your only job is to come and get your workout done. We take care of everything else.\n\nAt IKKOS you always train with a personal trainer. Because only a limited number of clients train with us at any time, you never wait for equipment and never feel like you are on display. Coffee, towels and shower toiletries are included, garage parking is free for clients, and there is no contract to sign.\n\nYour first session (60 minutes) is free. We get to know each other, go through your medical history and do an FMS movement assessment. Your trainer then builds a tailor-made plan based on your goal, and regular measurements show whether the plan works. Training is one-to-one, in pairs or in small groups.\n\nWe help with weight loss and body shaping, improving fitness and sports preparation, back pain, scoliosis and Scheuermann's disease, and healthy movement for people with desk jobs. Five of our eight trainers graduated in coaching from FTVŠ UK or UMB, and our trainers hold EXOS, CFSC, FMS, DNS and McGill Method certifications.",
  "english_speaking": true,
  "languages": [
    "Slovak",
    "English"
  ],
  "plan": "founding",
  "status": "approved",
  "website": "https://ikkos.sk/en/premium-fitness-in-the-old-town/",
  "social_links": {
    "instagram": "https://www.instagram.com/ikkos_premium_fitness/",
    "facebook": "https://www.facebook.com/IKKOS-Premium-Fitness-106109524456965/"
  },
  "opening_hours": {
    "monday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    },
    "tuesday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    },
    "wednesday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    },
    "thursday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    },
    "friday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    },
    "saturday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    },
    "sunday": {
      "open": true,
      "from": "06:00",
      "to": "21:00"
    }
  },
  "logo_url": "https://ikkos.sk/wp-content/uploads/2022/01/ikkos-logo-green.png",
  "cover_url": null,
  "gallery": [
    "https://ikkos.sk/wp-content/uploads/2022/03/ikkos-galeria-1.jpg",
    "https://ikkos.sk/wp-content/uploads/2022/03/ikkos-galeria-5.jpg",
    "https://ikkos.sk/wp-content/uploads/2022/03/ikkos-galeria-7.jpg"
  ]
}$json$::jsonb)
returning id, name, status;
