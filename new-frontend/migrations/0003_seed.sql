-- Seed incubation demo data (idempotent)
insert into app_settings (key, value) values
  ('working_days', '[1,2,3,4,5]'),
  ('morning_start', '09:00'),
  ('morning_late_after', '09:15'),
  ('evening_start', '15:00'),
  ('evening_late_after', '15:30')
on conflict (key) do nothing;

insert into students (name, email, bq_id, numeric_id, course, campus, gender, phone, created_at) values
  ('Zeeshan Siddiqui', 'zeeshan.siddiqui@incubate.local', 'inc-0091', '86997', 'Web Development', 'Karachi', 'Female', '03011000000', now() - interval '0 hours'),
  ('Muhammad Nehal', 'muhammad.nehal@incubate.local', 'inc-0088', '80135', 'Web Development', 'Lahore', 'Female', '03011000001', now() - interval '1 hours'),
  ('Saifullah', 'saifullah@incubate.local', 'inc-0087', '37244', 'Web Development', 'Islamabad', 'Male', '03011000002', now() - interval '2 hours'),
  ('Areeb Baig', 'ourtemporarylife@gmail.com', 'inc-0090', '57482', 'Web Development', 'Rawalpindi', 'Female', '03011000003', now() - interval '11 hours'),
  ('Ali', 'qazialiasad75@gmail.com', 'inc-0078', '27181', 'Web Development', 'Faisalabad', 'Male', '03011000004', now() - interval '12 hours'),
  ('Taha Khan', 'neptuneu051@gmail.com', 'inc-0077', '53183', 'Web Development', 'Multan', 'Female', '03011000005', now() - interval '13 hours'),
  ('Muhammad Sadeem', 'sadeem.tech01@gmail.com', 'inc-0079', '98521', 'Web Development', 'Peshawar', 'Male', '03011000006', now() - interval '14 hours'),
  ('Khalid Sanawer', 'khalid.sanawer@incubate.local', 'inc-0080', '44120', 'Web Development', 'Hyderabad', 'Female', '03011000007', now() - interval '15 hours'),
  ('Muhammad Kaif', 'muhammad.kaif@incubate.local', 'inc-0081', '55231', 'Web Development', 'Karachi', 'Male', '03011000008', now() - interval '16 hours'),
  ('Ahmed Raza', 'ahmed.raza@incubate.local', 'inc-0010', '11010', 'Web Development', 'Lahore', 'Female', '03011000009', now() - interval '17 hours'),
  ('Hassan Ali', 'hassan.ali@incubate.local', 'inc-0011', '11011', 'Web Development', 'Islamabad', 'Male', '03011000010', now() - interval '18 hours'),
  ('Usman Sheikh', 'usman.sheikh@incubate.local', 'inc-0012', '11012', 'Web Development', 'Rawalpindi', 'Female', '03011000011', now() - interval '19 hours'),
  ('Bilal Ahmad', 'bilal.ahmad@incubate.local', 'inc-0013', '11013', 'Web Development', 'Faisalabad', 'Male', '03011000012', now() - interval '20 hours'),
  ('Hamza Farooq', 'hamza.farooq@incubate.local', 'inc-0014', '11014', 'Web Development', 'Multan', 'Female', '03011000013', now() - interval '21 hours'),
  ('Omar Malik', 'omar.malik@incubate.local', 'inc-0015', '11015', 'Web Development', 'Peshawar', 'Male', '03011000014', now() - interval '22 hours'),
  ('Zainab Fatima', 'zainab.fatima@incubate.local', 'inc-0016', '11016', 'Web Development', 'Hyderabad', 'Female', '03011000015', now() - interval '23 hours'),
  ('Ayesha Noor', 'ayesha.noor@incubate.local', 'inc-0017', '11017', 'Web Development', 'Karachi', 'Female', '03011000016', now() - interval '24 hours'),
  ('Hira Shah', 'hira.shah@incubate.local', 'inc-0018', '11018', 'Web Development', 'Lahore', 'Female', '03011000017', now() - interval '25 hours'),
  ('Daniyal Khan', 'daniyal.khan@incubate.local', 'inc-0019', '11019', 'Web Development', 'Islamabad', 'Male', '03011000018', now() - interval '26 hours'),
  ('Fahad Iqbal', 'fahad.iqbal@incubate.local', 'inc-0020', '11020', 'Web Development', 'Rawalpindi', 'Female', '03011000019', now() - interval '27 hours'),
  ('Ibrahim Qureshi', 'ibrahim.qureshi@incubate.local', 'inc-0021', '11021', 'Web Development', 'Faisalabad', 'Male', '03011000020', now() - interval '28 hours'),
  ('Laiba Ahmed', 'laiba.ahmed@incubate.local', 'inc-0022', '11022', 'Web Development', 'Multan', 'Female', '03011000021', now() - interval '29 hours'),
  ('Maham Ali', 'maham.ali@incubate.local', 'inc-0023', '11023', 'Web Development', 'Peshawar', 'Female', '03011000022', now() - interval '30 hours'),
  ('Noman Tariq', 'noman.tariq@incubate.local', 'inc-0024', '11024', 'Web Development', 'Hyderabad', 'Female', '03011000023', now() - interval '31 hours'),
  ('Rehan Siddiqui', 'rehan.siddiqui@incubate.local', 'inc-0025', '11025', 'Web Development', 'Karachi', 'Male', '03011000024', now() - interval '32 hours'),
  ('Sanaullah Khan', 'sanaullah.khan@incubate.local', 'inc-0026', '11026', 'Web Development', 'Lahore', 'Female', '03011000025', now() - interval '33 hours'),
  ('Talha Butt', 'talha.butt@incubate.local', 'inc-0027', '11027', 'Web Development', 'Islamabad', 'Male', '03011000026', now() - interval '34 hours'),
  ('Waleed Anwar', 'waleed.anwar@incubate.local', 'inc-0028', '11028', 'Web Development', 'Rawalpindi', 'Female', '03011000027', now() - interval '35 hours'),
  ('Adeel Chaudhry', 'adeel.chaudhry@incubate.local', 'inc-0029', '11029', 'Web Development', 'Faisalabad', 'Male', '03011000028', now() - interval '36 hours'),
  ('Samar Naz', 'samarnaz183@gmail.com', 'inc-0089', '292914', 'Digital Marketing', 'Multan', 'Female', '03011000029', now() - interval '37 hours'),
  ('Amina Tariq', 'amina.tariq@incubate.local', 'inc-0030', '12030', 'Digital Marketing', 'Peshawar', 'Female', '03011000030', now() - interval '38 hours'),
  ('Bushra Khan', 'bushra.khan@incubate.local', 'inc-0031', '12031', 'Digital Marketing', 'Hyderabad', 'Female', '03011000031', now() - interval '39 hours'),
  ('Esha Malik', 'esha.malik@incubate.local', 'inc-0032', '12032', 'Digital Marketing', 'Karachi', 'Female', '03011000032', now() - interval '40 hours'),
  ('Fiza Rahman', 'fiza.rahman@incubate.local', 'inc-0033', '12033', 'Digital Marketing', 'Lahore', 'Female', '03011000033', now() - interval '41 hours'),
  ('Hafsa Javed', 'hafsa.javed@incubate.local', 'inc-0034', '12034', 'Digital Marketing', 'Islamabad', 'Female', '03011000034', now() - interval '42 hours'),
  ('Iqra Nadeem', 'iqra.nadeem@incubate.local', 'inc-0035', '12035', 'Digital Marketing', 'Rawalpindi', 'Female', '03011000035', now() - interval '43 hours'),
  ('Javeria Ali', 'javeria.ali@incubate.local', 'inc-0036', '12036', 'Digital Marketing', 'Faisalabad', 'Female', '03011000036', now() - interval '44 hours'),
  ('Kiran Shah', 'kiran.shah@incubate.local', 'inc-0037', '12037', 'Digital Marketing', 'Multan', 'Female', '03011000037', now() - interval '45 hours'),
  ('Maha Hassan', 'maha.hassan@incubate.local', 'inc-0038', '12038', 'Digital Marketing', 'Peshawar', 'Female', '03011000038', now() - interval '46 hours'),
  ('Nida Farooq', 'nida.farooq@incubate.local', 'inc-0039', '12039', 'Digital Marketing', 'Hyderabad', 'Female', '03011000039', now() - interval '47 hours'),
  ('Rabia Aziz', 'rabia.aziz@incubate.local', 'inc-0040', '12040', 'Digital Marketing', 'Karachi', 'Female', '03011000040', now() - interval '48 hours'),
  ('Sana Khalid', 'sana.khalid@incubate.local', 'inc-0041', '12041', 'Digital Marketing', 'Lahore', 'Female', '03011000041', now() - interval '49 hours'),
  ('Urooj Fatima', 'urooj.fatima@incubate.local', 'inc-0042', '12042', 'Digital Marketing', 'Islamabad', 'Female', '03011000042', now() - interval '50 hours'),
  ('Zara Sheikh', 'zara.sheikh@incubate.local', 'inc-0043', '12043', 'Digital Marketing', 'Rawalpindi', 'Female', '03011000043', now() - interval '51 hours'),
  ('Asad Mehmood', 'asad.mehmood@incubate.local', 'inc-0044', '12044', 'Digital Marketing', 'Faisalabad', 'Male', '03011000044', now() - interval '52 hours'),
  ('Faisal Qadir', 'faisal.qadir@incubate.local', 'inc-0045', '12045', 'Digital Marketing', 'Multan', 'Female', '03011000045', now() - interval '53 hours'),
  ('Haris Nawaz', 'haris.nawaz@incubate.local', 'inc-0046', '12046', 'Digital Marketing', 'Peshawar', 'Male', '03011000046', now() - interval '54 hours'),
  ('Imran Baig', 'imran.baig@incubate.local', 'inc-0047', '12047', 'Digital Marketing', 'Hyderabad', 'Female', '03011000047', now() - interval '55 hours'),
  ('Junaid Akhtar', 'junaid.akhtar@incubate.local', 'inc-0048', '12048', 'Digital Marketing', 'Karachi', 'Male', '03011000048', now() - interval '56 hours'),
  ('Kamran Liaqat', 'kamran.liaqat@incubate.local', 'inc-0049', '12049', 'Digital Marketing', 'Lahore', 'Female', '03011000049', now() - interval '57 hours'),
  ('Moiz Ahmed', 'moiz.ahmed@incubate.local', 'inc-0050', '12050', 'Digital Marketing', 'Islamabad', 'Male', '03011000050', now() - interval '58 hours'),
  ('Naveed Anjum', 'naveed.anjum@incubate.local', 'inc-0051', '12051', 'Digital Marketing', 'Rawalpindi', 'Female', '03011000051', now() - interval '59 hours'),
  ('Osama Rauf', 'osama.rauf@incubate.local', 'inc-0052', '12052', 'Digital Marketing', 'Faisalabad', 'Male', '03011000052', now() - interval '60 hours'),
  ('Shahzaib Ali', 'shahzaib.ali@incubate.local', 'inc-0053', '12053', 'Digital Marketing', 'Multan', 'Female', '03011000053', now() - interval '61 hours'),
  ('Yasir Mehmood', 'yasir.mehmood@incubate.local', 'inc-0054', '12054', 'Digital Marketing', 'Peshawar', 'Male', '03011000054', now() - interval '62 hours'),
  ('Mishal Khan', 'mishal.khan@incubate.local', 'inc-0055', '12055', 'Digital Marketing', 'Hyderabad', 'Female', '03011000055', now() - interval '63 hours'),
  ('Anum Gul', 'anum.gul@incubate.local', 'inc-0056', '13056', 'Graphic Designing', 'Karachi', 'Female', '03011000056', now() - interval '64 hours'),
  ('Bakhtawar Saeed', 'bakhtawar.saeed@incubate.local', 'inc-0057', '13057', 'Graphic Designing', 'Lahore', 'Female', '03011000057', now() - interval '65 hours'),
  ('Dua Zehra', 'dua.zehra@incubate.local', 'inc-0058', '13058', 'Graphic Designing', 'Islamabad', 'Female', '03011000058', now() - interval '66 hours'),
  ('Emaan Fatima', 'emaan.fatima@incubate.local', 'inc-0059', '13059', 'Graphic Designing', 'Rawalpindi', 'Female', '03011000059', now() - interval '67 hours'),
  ('Ghulam Mustafa', 'ghulam.mustafa@incubate.local', 'inc-0060', '13060', 'Graphic Designing', 'Faisalabad', 'Female', '03011000060', now() - interval '68 hours'),
  ('Hina Aslam', 'hina.aslam@incubate.local', 'inc-0061', '13061', 'Graphic Designing', 'Multan', 'Female', '03011000061', now() - interval '69 hours'),
  ('Irtiza Hassan', 'irtiza.hassan@incubate.local', 'inc-0062', '13062', 'Graphic Designing', 'Peshawar', 'Male', '03011000062', now() - interval '70 hours'),
  ('Komal Riaz', 'komal.riaz@incubate.local', 'inc-0063', '13063', 'Graphic Designing', 'Hyderabad', 'Female', '03011000063', now() - interval '71 hours'),
  ('Lubna Shahid', 'lubna.shahid@incubate.local', 'inc-0064', '13064', 'Graphic Designing', 'Karachi', 'Female', '03011000064', now() - interval '72 hours'),
  ('Mehwish Noor', 'mehwish.noor@incubate.local', 'inc-0065', '13065', 'Graphic Designing', 'Lahore', 'Female', '03011000065', now() - interval '73 hours'),
  ('Nida Khan', 'nida.khan@incubate.local', 'inc-0066', '13066', 'Graphic Designing', 'Islamabad', 'Female', '03011000066', now() - interval '74 hours'),
  ('Aryan Patel', 'aryan.patel@incubate.local', 'inc-0067', '14067', 'Data Science', 'Rawalpindi', 'Female', '03011000067', now() - interval '75 hours'),
  ('Saima Qureshi', 'saima.qureshi@incubate.local', 'inc-0068', '14068', 'Data Science', 'Faisalabad', 'Female', '03011000068', now() - interval '76 hours'),
  ('Raza Haider', 'raza.haider@incubate.local', 'inc-0069', '15069', 'Video Editing', 'Multan', 'Female', '03011000069', now() - interval '77 hours'),
  ('Tehreem Ali', 'tehreem.ali@incubate.local', 'inc-0070', '15070', 'Video Editing', 'Peshawar', 'Female', '03011000070', now() - interval '78 hours')
on conflict (email) do nothing;

insert into teams (name, leader_id, field)
select 'Alpha group', s.id, 'Web Development'
from students s
where s.name = 'Muhammad Nehal'
  and not exists (select 1 from teams t where t.name = 'Alpha group');

insert into team_members (team_id, student_id)
select t.id, s.id
from teams t
join students s on s.name in ('Khalid Sanawer', 'Muhammad Kaif')
where t.name = 'Alpha group'
on conflict do nothing;

insert into attendance (student_id, date, shift, status, check_in, check_out)
select
  s.id,
  d::date,
  case when s.id % 3 = 0 then 'Morning' else 'Evening' end,
  case
    when (s.id + extract(doy from d)::int) % 11 = 0 then 'late'
    when (s.id + extract(doy from d)::int) % 7 = 0 then 'present'
    when (s.id + extract(doy from d)::int) % 13 = 0 then 'incomplete'
    else 'absent'
  end,
  case
    when (s.id + extract(doy from d)::int) % 13 = 0 then '13:18'
    when s.id % 3 = 0 then '09:04'
    else '15:40'
  end,
  case when (s.id + extract(doy from d)::int) % 13 = 0 then '14:57' else null end
from students s
cross join generate_series(current_date - 40, current_date - 1, interval '1 day') d
where extract(dow from d) between 1 and 5
on conflict (student_id, date, shift) do nothing;

delete from attendance where date = current_date;

insert into attendance (student_id, date, shift, status, check_in, check_out)
select s.id, current_date,
  case when s.name = 'Samar Naz' then 'Morning' else 'Evening' end,
  case
    when s.name in ('Ali','Taha Khan','Muhammad Sadeem','Zeeshan Siddiqui','Muhammad Nehal','Saifullah','Khalid Sanawer','Muhammad Kaif','Ahmed Raza','Hassan Ali','Usman Sheikh') then 'present'
    when s.name = 'Areeb Baig' then 'late'
    when s.name = 'Samar Naz' then 'incomplete'
    else 'absent'
  end,
  case
    when s.name = 'Areeb Baig' then '16:00'
    when s.name = 'Ali' then '15:42'
    when s.name = 'Taha Khan' then '15:40'
    when s.name = 'Muhammad Sadeem' then '15:33'
    when s.name = 'Samar Naz' then '13:18'
    when s.name in ('Zeeshan Siddiqui','Muhammad Nehal','Saifullah','Khalid Sanawer','Muhammad Kaif','Ahmed Raza','Hassan Ali','Usman Sheikh') then '15:10'
    else null
  end,
  case when s.name = 'Samar Naz' then '14:57' else null end
from students s
on conflict (student_id, date, shift) do nothing;

insert into form_sections (title, sort_order)
select v.title, v.sort_order
from (values
  ('Personal Information', 1),
  ('Contact Information', 2),
  ('Course & Campus Details', 3)
) as v(title, sort_order)
where not exists (select 1 from form_sections);

insert into form_fields (section_id, label, field_type, required, options, sort_order)
select s.id, v.label, v.field_type, v.required, v.options, v.sort_order
from form_sections s
join (values
  ('Personal Information', 'Full name', 'text', true, '[]', 1),
  ('Personal Information', 'Date of birth', 'date', true, '[]', 2),
  ('Personal Information', 'Gender', 'radio', true, '["Male","Female"]', 3),
  ('Personal Information', 'CNIC number', 'text', true, '[]', 4),
  ('Personal Information', 'Father/Guardian name', 'text', true, '[]', 5),
  ('Personal Information', 'About yourself', 'textarea', true, '[]', 6),
  ('Contact Information', 'Address', 'text', true, '[]', 1),
  ('Contact Information', 'Email address', 'email', true, '[]', 2),
  ('Contact Information', 'Phone number', 'phone', true, '[]', 3),
  ('Contact Information', 'Guardian number', 'phone', false, '[]', 4),
  ('Course & Campus Details', 'Course', 'select', true, '["Web Development","Digital Marketing","Graphic Designing","Data Science","Video Editing","Mobile App Development","UI/UX Design","Cybersecurity","Cloud Computing","AI & ML","Game Development","SEO","Content Writing","E-commerce","Python Programming","Java Programming","Flutter","React Native","DevOps","Blockchain","3D Animation","Photography","Interior Design","Freelancing","Spoken English","Office Management"]', 1),
  ('Course & Campus Details', 'Teacher name', 'text', true, '[]', 2),
  ('Course & Campus Details', 'Campus', 'select', true, '["Karachi Main","Karachi Gulshan","Karachi North","Lahore Main","Lahore Johar","Islamabad F-8","Islamabad I-9","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta","Hyderabad","Sialkot","Gujranwala","Bahawalpur","Sargodha","Abbottabad","Sukkur","Larkana","Mardan","Rahim Yar Khan","Sahiwal","Okara","Wah Cantt","Dera Ghazi Khan","Sheikhupura","Jhelum","Gujrat","Mingora","Nawabshah","Mirpur"]', 3),
  ('Course & Campus Details', 'Obtained marks', 'number', true, '[]', 4)
) as v(section, label, field_type, required, options, sort_order)
  on s.title = v.section
where not exists (select 1 from form_fields);

insert into calendar_entries (date, kind, title)
select current_date + 10, 'holiday', 'Founders Day'
where not exists (select 1 from calendar_entries);
