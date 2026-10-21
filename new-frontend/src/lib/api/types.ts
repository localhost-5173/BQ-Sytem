export type AttendanceStatus = "present" | "late" | "absent" | "incomplete";
export type Shift = "Morning" | "Evening";
export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "date"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

export type Student = {
  id: string | number;
  name: string;
  email: string;
  bqId: string;
  numericId: string;
  course: string;
  shift?: string;
  campus: string;
  gender: string;
  phone: string;
  cnic?: string;
  avatar?: string | null;
  isVerified?: boolean;
  createdAt: string;
};

export type ProjectManager = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type TeamMember = { id: string | number; name: string };

export type Team = {
  id: string | number;
  name: string;
  leaderId: string | number | null;
  leaderName: string | null;
  field: string;
  projectName?: string | null;
  members: TeamMember[];
  createdAt: string;
};

export type Project = {
  id: string | number;
  title: string;
  description: string;
  teamId: string | number | null;
  teamName: string | null;
  status: string;
  createdAt: string;
};

export type AttendanceRecord = {
  id: string | number;
  studentId: string | number;
  studentName: string;
  email: string;
  bqId: string;
  numericId: string;
  date: string;
  shift: Shift;
  status: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
};

export type AttendanceFilters = {
  q?: string;
  status?: string;
  shift?: string;
  range?: string;
};

export type AttendanceStats = {
  total: number;
  present: number;
  late: number;
  absent: number;
  incomplete: number;
};

export type Post = {
  id: string | number;
  title: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
};

export type CalendarEntry = {
  id: string | number;
  date: string;
  kind: "holiday" | "event" | "working";
  title: string;
};

export type AppSettings = {
  workingDays: number[];
  morningStart: string;
  morningLateAfter: string;
  eveningStart: string;
  eveningLateAfter: string;
};

export type FormField = {
  id: string | number;
  sectionId: string | number;
  section?: string;
  name?: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  required: boolean;
  options: string[];
  sortOrder: number;
};

export type FormSection = {
  id: string | number;
  title: string;
  description?: string;
  sortOrder: number;
  fields: FormField[];
};

export type DashboardData = {
  studentCount: number;
  managerCount: number;
  teamCount: number;
  projectCount: number;
  todayPresent: number;
  todayTotal: number;
  courses: { course: string; count: number }[];
  recentStudents: Student[];
  weekSeries: { date: string; present: number }[];
};

export type StudentInput = {
  name: string;
  email: string;
  course: string;
  shift?: string;
  campus?: string;
  gender?: string;
  phone?: string;
  cnic?: string;
  bqId?: string;
  numericId?: string;
  password?: string;
  dob?: string;
};
