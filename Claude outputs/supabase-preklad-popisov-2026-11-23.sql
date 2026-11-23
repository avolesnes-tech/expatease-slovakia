-- ExpatBase: preklad slovenských popisov do angličtiny + oprava preklepov (23. 11. 2026)
-- Spusti v Supabase → SQL Editor. Mení iba stĺpec description pri 4 profiloch.

begin;

-- KadanMed (GP) – popis bol po slovensky
update businesses
set description = 'We provide high-quality, caring and accessible healthcare for adults in a pleasant environment.'
where id = 'ca252f19-4922-4be6-9c02-c917f8540f77';

-- Ihlove s. r. o. (krajčírstvo) – popis bol po slovensky
update businesses
set description = 'We offer tailoring services: made-to-measure clothing, plus repairs and alterations.'
where id = '89f23dcb-3389-4561-a89b-86d09296fdf1';

-- Oftalentis (očný lekár) – preklepy (Opthalmology, ands)
update businesses
set description = 'Eye examinations for children (from birth) and adults. Eye surgery: cataract surgery, PRELEX and retinal surgery.'
where id = '699717c9-f6f1-4f75-9a08-e8124ab87e6f';

-- Gerin s.r.o. (psychiatria) – preklep (Psyhiatric)
update businesses
set description = 'Psychiatric examination available in English.'
where id = 'f31320b9-dda8-4acc-8c02-fd2b59af82bb';

-- kontrola: mali by sa vrátiť 4 riadky s novými textami
select name, description from businesses
where id in ('ca252f19-4922-4be6-9c02-c917f8540f77','89f23dcb-3389-4561-a89b-86d09296fdf1',
             '699717c9-f6f1-4f75-9a08-e8124ab87e6f','f31320b9-dda8-4acc-8c02-fd2b59af82bb');

commit;
