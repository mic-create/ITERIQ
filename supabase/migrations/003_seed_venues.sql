-- Seed approved Bells University lecture venues with coordinates left null awaiting provisioning
insert into public.venues (venue_id, venue_name, latitude, longitude, permitted_radius_meters, max_gps_accuracy_meters, is_active)
values
    ('BUT-VEN-001', 'JEREMIAH OJEDIRAN HALL', 6.684387, 3.173601, 50, 15, true),
    ('BUT-VEN-002', 'EDOZIEN LECTURE THEATRE (ELT)', 6.684081, 3.1684382, 40, 15, true),
    ('BUT-VEN-003', 'BUPF CONFERENCE CENTER (BUPF CC)', 6.685361, 3.169830, 50, 15, true),
    ('BUT-VEN-004', 'BUPF LT', null, null, 40, 15, true),
    ('BUT-VEN-005', 'LECTURE THEATRE (LT) 1', null, null, 40, 15, true),
    ('BUT-VEN-006', 'LECTURE THEATRE (LT) 2', null, null, 40, 15, true)
on conflict (venue_id) do nothing;