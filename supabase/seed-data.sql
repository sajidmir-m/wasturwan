-- ============================================
-- SEED DATA FOR WASTURWAN TRAVELS
-- ============================================

-- Sample admin user (link this to a real auth user later)
insert into public.users (id, email, name, role)
values
  (gen_random_uuid(), 'admin@example.com', 'Demo Admin', 'admin')
on conflict (email) do nothing;

-- Packages
insert into public.packages (title, location, category, price, days, nights, duration, description, status, featured, rating, main_image_url, itinerary, inclusions, exclusions)
values
  (
    'Kashmir Winter Wonderland',
    'Srinagar, Gulmarg, Pahalgam',
    'Kashmir',
    24999,
    5,
    4,
    '5D/4N',
    'Snow-clad valleys, Dal Lake sunsets and Gulmarg adventures in one curated winter package.',
    'active',
    true,
    4.7,
    'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop',
    '[
      {"day":1,"title":"Arrival Srinagar","desc":"Airport pickup, Dal Lake shikara ride and houseboat/hotel check-in."},
      {"day":2,"title":"Gulmarg Day Trip","desc":"Drive to Gulmarg, optional Gondola ride and snow activities (seasonal)."},
      {"day":3,"title":"Pahalgam","desc":"Scenic drive to Pahalgam, riverside walks and local sightseeing."},
      {"day":4,"title":"Srinagar City Tour","desc":"Mughal gardens, old city markets and local crafts."},
      {"day":5,"title":"Departure","desc":"Free time and airport drop."}
    ]'::jsonb,
    '["Private cab transfers","Accommodation","Breakfast","Basic sightseeing as per itinerary"]'::jsonb,
    '["Flights","Lunch & dinner","Entry tickets","Gondola tickets"]'::jsonb
  ),
  (
    'Gulmarg Adventure Escape',
    'Gulmarg',
    'Adventure',
    15999,
    3,
    2,
    '3D/2N',
    'Short and sweet high-altitude escape to Gulmarg with meadows or snow views depending on season.',
    'active',
    true,
    4.6,
    'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2070&auto=format&fit=crop',
    '[
      {"day":1,"title":"Arrival Srinagar","desc":"Pickup and transfer to Gulmarg, evening at leisure."},
      {"day":2,"title":"Full Day Gulmarg","desc":"Explore meadows/snow fields, optional Gondola, leisure time."},
      {"day":3,"title":"Departure","desc":"Drive back to Srinagar airport / hotel."}
    ]'::jsonb,
    '["Transfers","Accommodation in Gulmarg","Breakfast"]'::jsonb,
    '["Gondola tickets","Lunch & dinner","Guide charges"]'::jsonb
  ),
  (
    'Classic Kashmir Tour',
    'Srinagar, Gulmarg, Pahalgam, Sonamarg',
    'Family',
    28999,
    6,
    5,
    '6D/5N',
    'Most-loved Kashmir circuit covering Dal Lake, Gulmarg meadows, Pahalgam valleys and Sonamarg in one itinerary.',
    'active',
    true,
    4.8,
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop',
    '[
      {"day":1,"title":"Arrival Srinagar","desc":"Airport pickup and evening shikara ride at Dal Lake."},
      {"day":2,"title":"Gulmarg Day Trip","desc":"Full day excursion to Gulmarg with optional Gondola ride."},
      {"day":3,"title":"Pahalgam Transfer","desc":"Drive to Pahalgam via saffron fields and Awantipora ruins."},
      {"day":4,"title":"Pahalgam Valleys","desc":"Explore Betaab, Aru or Chandanwari as per season."},
      {"day":5,"title":"Sonamarg Day Trip","desc":"Drive to Sonamarg and return to Srinagar in the evening."},
      {"day":6,"title":"Departure","desc":"Free time for shopping and airport drop."}
    ]'::jsonb,
    '["Private cab for full tour","Accommodation in Srinagar & Pahalgam","Breakfast","Airport transfers"]'::jsonb,
    '["Flights","Lunch & dinner","Gondola & pony rides","Entry tickets","Union cabs in certain areas"]'::jsonb
  ),
  (
    'Honeymoon Special Kashmir',
    'Srinagar, Gulmarg, Pahalgam',
    'Honeymoon',
    31999,
    6,
    5,
    '6D/5N',
    'Romantic houseboat stay, private cab and relaxed pace itinerary crafted specially for couples.',
    'active',
    true,
    4.9,
    'https://images.unsplash.com/photo-1534448311378-1e193fb2570e?q=80&w=2070&auto=format&fit=crop',
    '[
      {"day":1,"title":"Arrival & Houseboat","desc":"Check-in to deluxe houseboat and evening shikara ride."},
      {"day":2,"title":"Srinagar City & Gardens","desc":"Visit Mughal gardens, old city and local handicraft showrooms."},
      {"day":3,"title":"Gulmarg for a Day","desc":"Day excursion to Gulmarg and back to Srinagar."},
      {"day":4,"title":"Pahalgam Transfer","desc":"Drive to Pahalgam, evening by the river."},
      {"day":5,"title":"Pahalgam at Leisure","desc":"Explore nearby valleys or relax at the resort."},
      {"day":6,"title":"Departure","desc":"Return to Srinagar airport."}
    ]'::jsonb,
    '["Houseboat & hotel stay","Breakfast","One special honeymoon dinner","Private cab for sightseeing"]'::jsonb,
    '["Flights","Lunch","Activities & entry tickets","Personal expenses"]'::jsonb
  );

-- Services
insert into public.services (title, description, icon, status)
values
  ('Cab Rentals', 'Airport pickups, local sightseeing and intercity transfers with neat & clean cabs.', 'Car', 'active'),
  ('Hotel Bookings', 'Handpicked stays across Kashmir and Ladakh from houseboats to boutique hotels.', 'Home', 'active'),
  ('Sightseeing Tours', 'Day tours and multi-day circuits covering iconic and offbeat locations.', 'Map', 'active');

-- Example contacts (for admin UI testing later)
insert into public.contacts (name, email, phone, subject, message, status)
values
  ('Test User', 'test@example.com', '9999999999', 'Website Inquiry', 'I would like to know more about Kashmir packages.', 'pending');

-- ======================
-- CABS (for admin + UI)
-- ======================
insert into public.cabs (name, slug, type, capacity, luggage_capacity, description, base_fare, per_km_rate, featured, status, main_image_url, tags)
values
  (
    'Sedan Cab',
    'sedan-cab',
    'sedan',
    3,
    2,
    'Comfortable AC sedans ideal for airport transfers and city sightseeing for couples or small families.',
    1200,
    18,
    true,
    'active',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop',
    array['AC','Budget friendly','Point-to-point']
  ),
  (
    'Innova',
    'innova',
    'innova',
    6,
    3,
    'Spacious Innova cabs perfect for families and small groups with extra legroom and luggage space.',
    1800,
    22,
    true,
    'active',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2070&auto=format&fit=crop',
    array['Family trips','AC','Long routes']
  ),
  (
    'Innova Crysta',
    'innova-crysta',
    'crysta',
    6,
    3,
    'Premium Innova Crysta fleet for guests who prefer more comfort and a smoother ride for long journeys.',
    2200,
    26,
    true,
    'active',
    'https://images.unsplash.com/photo-1590362891954-009230e86b2c?q=80&w=2070&auto=format&fit=crop',
    array['Premium','Comfort','Family trips']
  ),
  (
    'Tempo Traveller',
    'tempo-traveller',
    'tempo',
    12,
    6,
    'Neat and well‑maintained Tempo Travellers for larger groups, corporates and extended families.',
    3200,
    32,
    true,
    'active',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2070&auto=format&fit=crop',
    array['Group travel','Sightseeing','Multi-day tours']
  );

-- ========================
-- PLACES (for admin + UI)
-- ========================
insert into public.places (name, slug, region, short_description, description, hero_image_url, gallery, status, featured)
values
  (
    'Srinagar',
    'srinagar',
    'Kashmir Valley',
    'Dal Lake, Mughal gardens and old city heritage.',
    'Shikara rides on Dal Lake, Mughal gardens and old Srinagar lanes with rich culture.',
    'https://images.unsplash.com/photo-1601277000017-04edd6f0f3a9?q=80&w=2070&auto=format&fit=crop',
    '[
      {"url":"/dal.png","label":"Dal Lake"},
      {"url":"/1767803609020.jpeg","label":"Shikara ride"}
    ]'::jsonb,
    'active',
    true
  ),
  (
    'Gulmarg',
    'gulmarg',
    'Kashmir Valley',
    'Snow meadows and Gulmarg Gondola.',
    'Snow-clad meadows, Gondola rides and winter sports in season.',
    '/1767803609020.jpeg',
    '[]'::jsonb,
    'active',
    true
  ),
  (
    'Pahalgam',
    'pahalgam',
    'Kashmir Valley',
    'Riverside valleys and Betaab Valley.',
    'Riverside walks, pine forests and family‑friendly valleys like Betaab and Aru.',
    '/1767803600176.jpeg',
    '[]'::jsonb,
    'active',
    true
  ),
  (
    'Sonamarg',
    'sonamarg',
    'Kashmir Valley',
    'Golden meadows and glacier views.',
    'Gateway to high‑altitude drives towards Ladakh with stunning glacier views.',
    '/1767803650229.jpeg',
    '[]'::jsonb,
    'active',
    true
  );
