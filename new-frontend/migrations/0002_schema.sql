create table if not exists students (
  id serial primary key,
  name text not null,
  email text not null unique,
  bq_id text not null unique,
  numeric_id text not null,
  course text not null,
  campus text not null default '',
  gender text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists project_managers (
  id serial primary key,
  name text not null,
  email text not null unique,
  role text not null default 'Project Manager',
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id serial primary key,
  name text not null,
  leader_id int references students(id) on delete set null,
  field text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  team_id int not null references teams(id) on delete cascade,
  student_id int not null references students(id) on delete cascade,
  primary key (team_id, student_id)
);

create table if not exists projects (
  id serial primary key,
  title text not null,
  description text not null default '',
  team_id int references teams(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists attendance (
  id serial primary key,
  student_id int not null references students(id) on delete cascade,
  date date not null,
  shift text not null,
  status text not null,
  check_in text,
  check_out text,
  unique (student_id, date, shift)
);

create index if not exists attendance_date_idx on attendance (date desc);
create index if not exists attendance_student_idx on attendance (student_id);

create table if not exists posts (
  id serial primary key,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists calendar_entries (
  id serial primary key,
  date date not null,
  kind text not null default 'holiday',
  title text not null
);

create table if not exists form_sections (
  id serial primary key,
  title text not null,
  sort_order int not null default 0
);

create table if not exists form_fields (
  id serial primary key,
  section_id int not null references form_sections(id) on delete cascade,
  label text not null,
  field_type text not null,
  required boolean not null default true,
  options text not null default '[]',
  sort_order int not null default 0
);

create table if not exists form_submissions (
  id serial primary key,
  payload text not null,
  student_id int references students(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value text not null
);

create index if not exists students_course_idx on students (course);
create index if not exists students_created_idx on students (created_at desc);
