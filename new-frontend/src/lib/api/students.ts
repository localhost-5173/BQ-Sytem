import api from "../axios";
import type { Student, StudentInput } from "./types";

export function mapUserToStudent(u: any): Student {
  return {
    id: u._id || u.id || "",
    name: u.name || u.fullName || "—",
    email: u.email || u.emailAddress || "—",
    bqId: u.bq_id || u.bqId || "—",
    numericId: u.incubation_id || u.numericId || "—",
    course: u.course || "—",
    shift: u.shift || "—",
    campus: u.location || u.campus || "—",
    gender: u.gender || "—",
    phone: u.phone || u.phoneNumber || "—",
    cnic: u.CNIC || u.cnic || "—",
    avatar: u.avatar || null,
    isVerified: Boolean(u.isVerified),
    createdAt: u.createdAt || "",
  };
}

export type EnumsData = {
  courses: string[];
  genders: string[];
  shifts: string[];
  locations: string[];
};

export async function getStudentEnums(): Promise<EnumsData> {
  try {
    const res = await api.get("/api/user/enums");
    return res.data;
  } catch {
    return {
      courses: [
        "Web Development",
        "Graphic Designing",
        "Digital Marketing",
        "Data Science",
        "Data Analytics",
        "Cyber Security",
        "Mobile App Development",
        "E-commerce",
        "Content Writing",
        "Video Editing",
      ],
      genders: ["Male", "Female"],
      shifts: ["Morning", "Evening"],
      locations: [
        "Bahadurabad",
        "Expo (Fossphorus)",
        "Clifton",
        "Idarah Noor e Haq",
        "Jamia Millia",
      ],
    };
  }
}

export async function listStudents(): Promise<Student[]> {
  try {
    const res = await api.get("/api/user/signup?limit=1000");
    const users = res.data?.data?.users || res.data?.users || res.data?.data || [];
    if (Array.isArray(users) && users.length > 0) {
      return users.map(mapUserToStudent);
    }

    // Fallback: check registrations if user list is empty
    const regRes = await api.get("/api/registration");
    const registrations = regRes.data?.data || [];
    return registrations.map(mapUserToStudent);
  } catch (err) {
    console.warn("Error fetching students from backend, checking registrations:", err);
    try {
      const regRes = await api.get("/api/registration");
      const registrations = regRes.data?.data || [];
      return registrations.map(mapUserToStudent);
    } catch {
      return [];
    }
  }
}

export async function getStudent({ data }: { data: { id: string | number } }): Promise<Student | null> {
  try {
    const res = await api.get(`/api/user/public/${data.id}`);
    const u = res.data?.data || res.data;
    return u ? mapUserToStudent(u) : null;
  } catch {
    try {
      const res = await api.get(`/api/registration/${data.id}`);
      const u = res.data?.data || res.data;
      return u ? mapUserToStudent(u) : null;
    } catch {
      return null;
    }
  }
}

export async function createStudent({ data }: { data: StudentInput }): Promise<Student> {
  const payload = {
    bq_id: data.bqId?.trim() || "",
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password || "",
    phone: data.phone?.trim() || "",
    CNIC: data.cnic?.trim() || "",
    course: data.course,
    gender: data.gender || "Male",
    shift: data.shift || "Morning",
    location: data.campus || "Bahadurabad",
    dob: data.dob || "2000-01-01",
    termsAccepted: true,
  };

  const res = await api.post("/api/user/signup", payload);
  const created = res.data?.data?.user || res.data?.user || res.data?.data || payload;
  return mapUserToStudent(created);
}

export async function updateStudent({
  data,
}: {
  data: StudentInput & { id: string | number };
}): Promise<Student | null> {
  const payload: Record<string, any> = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    course: data.course,
    gender: data.gender,
    shift: data.shift,
    location: data.campus,
    phone: data.phone?.trim(),
    CNIC: data.cnic?.trim(),
  };
  if (data.bqId?.trim()) payload.bq_id = data.bqId.trim();
  if (data.password?.trim()) payload.password = data.password.trim();

  const res = await api.put(`/api/user/update/${data.id}`, payload);
  const updated = res.data?.data?.user || res.data?.user || res.data?.data;
  return updated ? mapUserToStudent(updated) : null;
}

export async function deleteStudent({ data }: { data: { id: string | number } }): Promise<{ ok: boolean }> {
  await api.delete(`/api/user/delete/${data.id}`);
  return { ok: true };
}

export async function verifyStudent({ data }: { data: { id: string | number } }): Promise<void> {
  await api.patch(`/api/user/verify-user/${data.id}`);
}

export async function resendStudentVerification({ data }: { data: { email: string } }): Promise<void> {
  await api.post("/api/user/resend-verification", { email: data.email });
}
