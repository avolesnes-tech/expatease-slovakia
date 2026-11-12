-- ExpatBase: unify business addresses (address column only; district and filtering untouched)
update public.businesses b
set address = v.addr
from (values
  -- JUDr. Nina Haki
  ('e0ebb039-8299-43e5-8a47-b85912ca27c1', 'Budyšínska 3A, Nové Mesto, Bratislava'),
  -- PVK Transportation
  ('eb561fab-3a5b-46cb-bae2-b99882825ad7', 'Tobrucká 7, Staré Mesto, Bratislava'),
  -- IBN SINNA
  ('b51c2309-1509-4fbb-ac8e-2bbc16669622', 'Hubeného 2 (Poliklinika Hubeného, door 119), Nové Mesto, Bratislava'),
  -- Uhlalilah pet services
  ('59882ab3-b482-4beb-b61c-690e545f46dd', 'Rusovce, Bratislava'),
  -- Autoservis Dubravka
  ('11044816-38e5-4fa6-98bb-4f2939197e21', 'Agátová 4, Dúbravka, Bratislava'),
  -- Petra Kovarova
  ('3e556228-92ed-4876-a5ef-da3c2c38ad22', 'Ružinovská 42, Ružinov, Bratislava'),
  -- Elektro Martin
  ('2f92bf71-e046-4b49-bf44-1771294ee5be', 'Záhradnícka 571, Kvetoslavov'),
  -- Autoškola Zeman
  ('4d23817d-5396-431e-a3d9-f7849cfef5d5', 'Karloveská 6/A (Allianz building), Karlova Ves, Bratislava'),
  -- VLKOVÁ
  ('3cbc599a-0343-480a-a1ca-e120462cbef1', 'Tallerova 1, Staré Mesto, Bratislava'),
  -- Oftalentis
  ('699717c9-f6f1-4f75-9a08-e8124ab87e6f', 'Saratovská 24, Dúbravka, Bratislava'),
  -- Vet & Dent
  ('fa64460e-1a91-4206-b16d-a9f06ae48e9a', 'Tehelná 16, Nové Mesto, Bratislava'),
  -- KadanMed
  ('ca252f19-4922-4be6-9c02-c917f8540f77', 'Vajnorská 62, Nové Mesto, Bratislava'),
  -- BERLITZ
  ('c00e91fd-448e-430b-8fb2-7ee7c8db1ea2', 'Rusovská cesta 46–48, Petržalka, Bratislava'),
  -- ExpressMoving
  ('fae8ca8a-7938-4b26-9102-88c78557d581', 'Suché mýto 4769/2, Staré Mesto, Bratislava'),
  -- Gabriela Szomolaiová
  ('9011605f-81be-48ae-9d1c-2c0a176c6e43', '29. augusta 18, Staré Mesto, Bratislava'),
  -- Klinika ReFit
  ('a0bc185a-b5ab-408a-b015-84cbdbaa6998', 'Gagarinova 5B, Ružinov, Bratislava'),
  -- Frederic Moreno
  ('004b181a-0739-42b0-86d7-2a4073ae7583', 'Karadžičova 8A (CBC I), Ružinov, Bratislava'),
  -- Da-Car Pneuservice
  ('85934764-3730-48e7-bb9e-7b4215a058b6', 'Mlynské nivy 56, Ružinov, Bratislava'),
  -- AJEETS
  ('60f0e935-09ee-40bf-bb51-322410fbf66c', '811 01 Bratislava')
) as v(id, addr)
where b.id::text = v.id
returning b.name, b.address;
