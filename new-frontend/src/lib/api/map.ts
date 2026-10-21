import type {
  AttendanceRecord,
  AttendanceStatus,
  FieldType,
  FormField,
  Project,
  ProjectManager,
  Shift,
  Student,
  Team,
} from "./types";

export type StudentRow = {
  id: number;
  name: string;
  email: string;
  bq_id: string;
  numeric_id: string;
  course: string;
  campus: string;
  gender: string;
  phone: string;
  created_at: string;
};

export function mapStudent(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    bqId: row.bq_id,
    numericId: row.numeric_id,
    course: row.course,
    campus: row.campus,
    gender: row.gender,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export function mapPm(row: {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}): ProjectManager {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  };
}

export function mapProject(row: {
  id: number;
  title: string;
  description: string;
  team_id: number | null;
  team_name: string | null;
  status: string;
  created_at: string;
}): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    teamId: row.team_id,
    teamName: row.team_name,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapAttendance(row: {
  id: number;
  student_id: number;
  student_name: string;
  email: string;
  bq_id: string;
  numeric_id: string;
  date: string;
  shift: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
}): AttendanceRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    email: row.email,
    bqId: row.bq_id,
    numericId: row.numeric_id,
    date: row.date,
    shift: row.shift as Shift,
    status: row.status as AttendanceStatus,
    checkIn: row.check_in,
    checkOut: row.check_out,
  };
}

export function mapField(row: {
  id: number;
  section_id: number;
  label: string;
  field_type: string;
  required: boolean;
  options: string;
  sort_order: number;
}): FormField {
  let options: string[] = [];
  try {
    const parsed = JSON.parse(row.options || "[]") as unknown;
    if (Array.isArray(parsed)) options = parsed.map(String);
  } catch {
    options = [];
  }
  return {
    id: row.id,
    sectionId: row.section_id,
    label: row.label,
    fieldType: row.field_type as FieldType,
    required: row.required,
    options,
    sortOrder: row.sort_order,
  };
}

export function nextBqId(existing: string[]): string {
  let max = 0;
  for (const id of existing) {
    const n = Number(/inc-(\d+)/i.exec(id)?.[1] ?? 0);
    if (n > max) max = n;
  }
  return `inc-${String(max + 1).padStart(4, "0")}`;
}

export function randomNumericId(): string {
  return String(10000 + Math.floor(Math.random() * 90000));
}

export type TeamRow = {
  id: number;
  name: string;
  leader_id: number | null;
  leader_name: string | null;
  field: string;
  created_at: string;
};

export function mapTeam(
  row: TeamRow,
  members: { id: number; name: string }[],
): Team {
  return {
    id: row.id,
    name: row.name,
    leaderId: row.leader_id,
    leaderName: row.leader_name,
    field: row.field,
    members,
    createdAt: row.created_at,
  };
}
