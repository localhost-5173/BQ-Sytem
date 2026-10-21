import { writeFileSync } from "node:fs";

const COURSES = {
  "Web Development": [
    ["Zeeshan Siddiqui", "zeeshan.siddiqui@incubate.local", "inc-0091", "86997"],
    ["Muhammad Nehal", "muhammad.nehal@incubate.local", "inc-0088", "80135"],
    ["Saifullah", "saifullah@incubate.local", "inc-0087", "37244"],
    ["Areeb Baig", "ourtemporarylife@gmail.com", "inc-0090", "57482"],
    ["Ali", "qazialiasad75@gmail.com", "inc-0078", "27181"],
    ["Taha Khan", "neptuneu051@gmail.com", "inc-0077", "53183"],
    ["Muhammad Sadeem", "sadeem.tech01@gmail.com", "inc-0079", "98521"],
    ["Khalid Sanawer", "khalid.sanawer@incubate.local", "inc-0080", "44120"],
    ["Muhammad Kaif", "muhammad.kaif@incubate.local", "inc-0081", "55231"],
    ["Ahmed Raza", "ahmed.raza@incubate.local", "inc-0010", "11010"],
    ["Hassan Ali", "hassan.ali@incubate.local", "inc-0011", "11011"],
    ["Usman Sheikh", "usman.sheikh@incubate.local", "inc-0012", "11012"],
    ["Bilal Ahmad", "bilal.ahmad@incubate.local", "inc-0013", "11013"],
    ["Hamza Farooq", "hamza.farooq@incubate.local", "inc-0014", "11014"],
    ["Omar Malik", "omar.malik@incubate.local", "inc-0015", "11015"],
    ["Zainab Fatima", "zainab.fatima@incubate.local", "inc-0016", "11016"],
    ["Ayesha Noor", "ayesha.noor@incubate.local", "inc-0017", "11017"],
    ["Hira Shah", "hira.shah@incubate.local", "inc-0018", "11018"],
    ["Daniyal Khan", "daniyal.khan@incubate.local", "inc-0019", "11019"],
    ["Fahad Iqbal", "fahad.iqbal@incubate.local", "inc-0020", "11020"],
    ["Ibrahim Qureshi", "ibrahim.qureshi@incubate.local", "inc-0021", "11021"],
    ["Laiba Ahmed", "laiba.ahmed@incubate.local", "inc-0022", "11022"],
    ["Maham Ali", "maham.ali@incubate.local", "inc-0023", "11023"],
    ["Noman Tariq", "noman.tariq@incubate.local", "inc-0024", "11024"],
    ["Rehan Siddiqui", "rehan.siddiqui@incubate.local", "inc-0025", "11025"],
    ["Sanaullah Khan", "sanaullah.khan@incubate.local", "inc-0026", "11026"],
    ["Talha Butt", "talha.butt@incubate.local", "inc-0027", "11027"],
    ["Waleed Anwar", "waleed.anwar@incubate.local", "inc-0028", "11028"],
    ["Adeel Chaudhry", "adeel.chaudhry@incubate.local", "inc-0029", "11029"],
  ],
  "Digital Marketing": [
    ["Samar Naz", "samarnaz183@gmail.com", "inc-0089", "292914"],
    ["Amina Tariq", "amina.tariq@incubate.local", "inc-0030", "12030"],
    ["Bushra Khan", "bushra.khan@incubate.local", "inc-0031", "12031"],
    ["Esha Malik", "esha.malik@incubate.local", "inc-0032", "12032"],
    ["Fiza Rahman", "fiza.rahman@incubate.local", "inc-0033", "12033"],
    ["Hafsa Javed", "hafsa.javed@incubate.local", "inc-0034", "12034"],
    ["Iqra Nadeem", "iqra.nadeem@incubate.local", "inc-0035", "12035"],
    ["Javeria Ali", "javeria.ali@incubate.local", "inc-0036", "12036"],
    ["Kiran Shah", "kiran.shah@incubate.local", "inc-0037", "12037"],
    ["Maha Hassan", "maha.hassan@incubate.local", "inc-0038", "12038"],
    ["Nida Farooq", "nida.farooq@incubate.local", "inc-0039", "12039"],
    ["Rabia Aziz", "rabia.aziz@incubate.local", "inc-0040", "12040"],
    ["Sana Khalid", "sana.khalid@incubate.local", "inc-0041", "12041"],
    ["Urooj Fatima", "urooj.fatima@incubate.local", "inc-0042", "12042"],
    ["Zara Sheikh", "zara.sheikh@incubate.local", "inc-0043", "12043"],
    ["Asad Mehmood", "asad.mehmood@incubate.local", "inc-0044", "12044"],
    ["Faisal Qadir", "faisal.qadir@incubate.local", "inc-0045", "12045"],
    ["Haris Nawaz", "haris.nawaz@incubate.local", "inc-0046", "12046"],
    ["Imran Baig", "imran.baig@incubate.local", "inc-0047", "12047"],
    ["Junaid Akhtar", "junaid.akhtar@incubate.local", "inc-0048", "12048"],
    ["Kamran Liaqat", "kamran.liaqat@incubate.local", "inc-0049", "12049"],
    ["Moiz Ahmed", "moiz.ahmed@incubate.local", "inc-0050", "12050"],
    ["Naveed Anjum", "naveed.anjum@incubate.local", "inc-0051", "12051"],
    ["Osama Rauf", "osama.rauf@incubate.local", "inc-0052", "12052"],
    ["Shahzaib Ali", "shahzaib.ali@incubate.local", "inc-0053", "12053"],
    ["Yasir Mehmood", "yasir.mehmood@incubate.local", "inc-0054", "12054"],
    ["Mishal Khan", "mishal.khan@incubate.local", "inc-0055", "12055"],
  ],
  "Graphic Designing": [
    ["Anum Gul", "anum.gul@incubate.local", "inc-0056", "13056"],
    ["Bakhtawar Saeed", "bakhtawar.saeed@incubate.local", "inc-0057", "13057"],
    ["Dua Zehra", "dua.zehra@incubate.local", "inc-0058", "13058"],
    ["Emaan Fatima", "emaan.fatima@incubate.local", "inc-0059", "13059"],
    ["Ghulam Mustafa", "ghulam.mustafa@incubate.local", "inc-0060", "13060"],
    ["Hina Aslam", "hina.aslam@incubate.local", "inc-0061", "13061"],
    ["Irtiza Hassan", "irtiza.hassan@incubate.local", "inc-0062", "13062"],
    ["Komal Riaz", "komal.riaz@incubate.local", "inc-0063", "13063"],
    ["Lubna Shahid", "lubna.shahid@incubate.local", "inc-0064", "13064"],
    ["Mehwish Noor", "mehwish.noor@incubate.local", "inc-0065", "13065"],
    ["Nida Khan", "nida.khan@incubate.local", "inc-0066", "13066"],
  ],
  "Data Science": [
    ["Aryan Patel", "aryan.patel@incubate.local", "inc-0067", "14067"],
    ["Saima Qureshi", "saima.qureshi@incubate.local", "inc-0068", "14068"],
  ],
  "Video Editing": [
    ["Raza Haider", "raza.haider@incubate.local", "inc-0069", "15069"],
    ["Tehreem Ali", "tehreem.ali@incubate.local", "inc-0070", "15070"],
  ],
};

const CAMPUSES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Hyderabad",
];
const GENDERS = ["Male", "Female"];

function esc(s) {
  return s.replaceAll("'", "''");
}

const rows = [];
let i = 0;
for (const [course, people] of Object.entries(COURSES)) {
  for (const [name, email, bq, num] of people) {
    const campus = CAMPUSES[i % CAMPUSES.length];
    const gender = /a$|um$|ra$|na$|ia$|een$|hor$|ish$|war$|num |dua |emaan|hina|komal|lubna|mehwish|nida|saima|tehreem|samar|amina|bushra|esha|fiza|hafsa|iqra|javeria|kiran|maha|rabia|sana |urooj|zara|mishal|zainab|ayesha|hira|laiba|maham/i.test(
      name,
    )
      ? "Female"
      : GENDERS[i % 2 === 0 ? 0 : 1];
    const phone = `0301${String(1000000 + i).slice(-7)}`;
    const hours = i < 3 ? i : i + 8;
    rows.push(
      `  ('${esc(name)}', '${esc(email)}', '${bq}', '${num}', '${esc(course)}', '${campus}', '${gender}', '${phone}', now() - interval '${hours} hours')`,
    );
    i += 1;
  }
}

const courses = [
  "Web Development",
  "Digital Marketing",
  "Graphic Designing",
  "Data Science",
  "Video Editing",
  "Mobile App Development",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
  "AI & ML",
  "Game Development",
  "SEO",
  "Content Writing",
  "E-commerce",
  "Python Programming",
  "Java Programming",
  "Flutter",
  "React Native",
  "DevOps",
  "Blockchain",
  "3D Animation",
  "Photography",
  "Interior Design",
  "Freelancing",
  "Spoken English",
  "Office Management",
];

const campuses = [
  "Karachi Main",
  "Karachi Gulshan",
  "Karachi North",
  "Lahore Main",
  "Lahore Johar",
  "Islamabad F-8",
  "Islamabad I-9",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Sukkur",
  "Larkana",
  "Mardan",
  "Rahim Yar Khan",
  "Sahiwal",
  "Okara",
  "Wah Cantt",
  "Dera Ghazi Khan",
  "Sheikhupura",
  "Jhelum",
  "Gujrat",
  "Mingora",
  "Nawabshah",
  "Mirpur",
];

const sql = `-- Seed incubation demo data (idempotent)
insert into app_settings (key, value) values
  ('working_days', '[1,2,3,4,5]'),
  ('morning_start', '09:00'),
  ('morning_late_after', '09:15'),
  ('evening_start', '15:00'),
  ('evening_late_after', '15:30')
on conflict (key) do nothing;

insert into students (name, email, bq_id, numeric_id, course, campus, gender, phone, created_at) values
${rows.join(",\n")}
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
  ('Course & Campus Details', 'Course', 'select', true, '${JSON.stringify(courses).replaceAll("'", "''")}', 1),
  ('Course & Campus Details', 'Teacher name', 'text', true, '[]', 2),
  ('Course & Campus Details', 'Campus', 'select', true, '${JSON.stringify(campuses).replaceAll("'", "''")}', 3),
  ('Course & Campus Details', 'Obtained marks', 'number', true, '[]', 4)
) as v(section, label, field_type, required, options, sort_order)
  on s.title = v.section
where not exists (select 1 from form_fields);

insert into calendar_entries (date, kind, title)
select current_date + 10, 'holiday', 'Founders Day'
where not exists (select 1 from calendar_entries);
`;

writeFileSync("/workspace/migrations/0003_seed.sql", sql);
console.log("students", rows.length);
