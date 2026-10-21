import api from "../axios";
import type { FieldType, FormField, FormSection, Student } from "./types";

// ====================================================
// Official Bano Qabil Courses (26 Options from Source)
// ====================================================
export const BANO_QABIL_COURSES: string[] = [
  "AI for Everyone",
  "Backend Development with Node.js",
  "CIT & Programming Foundations",
  "Computer Information and Technology (CIT)",
  "Cyber Security Essentials",
  "Data Analytics & Business Intelligence",
  "DevOps Foundations",
  "Digital Content Creation",
  "Digital Forensic and Ethical Hacking",
  "Digital Journalism",
  "Digital Marketing",
  "E-Commerce Development Mastery",
  "E-Commerce Marketplace",
  "Essentials for AI & Prompt Mastery",
  "Freelancing & Tech Sales Mastery",
  "Frontend Web Development",
  "Game Development with Blender",
  "Game Development with Unity",
  "Generative AI",
  "Graphic Designing",
  "Mobile Application Development with Flutter",
  "Social Media Management",
  "SQA & Test Automation",
  "UI/UX Design with Figma",
  "Video Editing & Animations",
  "Web Development with AI",
];

// ====================================================
// Official Bano Qabil Campuses (32 Karachi Campuses)
// ====================================================
export const BANO_QABIL_CAMPUSES: string[] = [
  "Al Huda Campus (North Karachi - Power House)",
  "Al-Aqsa Campus (Gulshan-e-Iqbal 13D)",
  "Anjuman Complex Campus (Sakhi Hasan)",
  "Askari Degree College (Bahadurabad)",
  "Bahadurabad Campus - Escuela Schooling System",
  "Bahria Town Campus",
  "BanoQabil Shah Latif Town Campus",
  "Clifton Campus",
  "Dr. Mehmood Hussain Campus (Shahfaisal Town)",
  "Etawa Campus (Gulshan-e-Maymar)",
  "Garden Campus",
  "Gulberg Campus",
  "Gulshan-e-Hadeed Campus",
  "Gulshan-e-Iqbal Campus - Circle Social Welfare",
  "HOL Kara Bai Campus (Lyari)",
  "Harmain Campus (P.E.C.H.S-6)",
  "Idara Noor-e-Haq Campus",
  "Jamia Millia School Campus (Shah Faisal)",
  "Jamia Tul Ansar Campus",
  "KMA Protech Institute Campus",
  "Kausar Town Campus (Malir)",
  "Korangi Allah Wala Town Campus",
  "Landhi#6 Campus",
  "Liaquatabad Campus",
  "Metroville Campus",
  "North Karachi Campus - 11L",
  "Orangi Town 11 ½ Campus - Salman Farsi",
  "PIA Society Campus",
  "Pakistan Central Homeopathic Medical College (Nazimabad)",
  "Piston College Campus",
  "SKIT - Keamari Campus",
  "Sherwani Suites Campus",
];

// ====================================================
// Canonical Section Definitions
// ====================================================
export const CANONICAL_SECTIONS = [
  {
    id: "Personal Information",
    title: "Personal Information",
    description: "Please provide your personal information.",
    sortOrder: 0,
  },
  {
    id: "Contact Information",
    title: "Contact Information",
    description: "Please provide your contact information.",
    sortOrder: 1,
  },
  {
    id: "Course & Campus Details",
    title: "Course & Campus Details",
    description: "Please provide your course and campus preferences.",
    sortOrder: 2,
  },
];

// ====================================================
// Standard 14 Default Fields Specification
// ====================================================
export const DEFAULT_FORM_FIELDS: Array<{
  section: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder: string;
  required: boolean;
  options: string[];
}> = [
  // Step 1: Personal Information
  {
    section: "Personal Information",
    name: "fullName",
    label: "Full name",
    type: "text",
    placeholder: "e.g. MUHAMMAD ALI",
    required: true,
    options: [],
  },
  {
    section: "Personal Information",
    name: "dateOfBirth",
    label: "Date of birth",
    type: "date",
    placeholder: "",
    required: true,
    options: [],
  },
  {
    section: "Personal Information",
    name: "gender",
    label: "Gender",
    type: "radio",
    placeholder: "",
    required: true,
    options: ["Male", "Female"],
  },
  {
    section: "Personal Information",
    name: "cnicNumber",
    label: "CNIC number",
    type: "text",
    placeholder: "e.g. 42101-1234567-1",
    required: true,
    options: [],
  },
  {
    section: "Personal Information",
    name: "fatherOrGuardianName",
    label: "Father/Guardian name",
    type: "text",
    placeholder: "e.g. ABDUL REHMAN",
    required: true,
    options: [],
  },
  {
    section: "Personal Information",
    name: "aboutYou",
    label: "About yourself",
    type: "textarea",
    placeholder: "Briefly introduce yourself, your interests, skills, and goals...",
    required: true,
    options: [],
  },

  // Step 2: Contact Information
  {
    section: "Contact Information",
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "e.g. House #, Street, Area, City",
    required: true,
    options: [],
  },
  {
    section: "Contact Information",
    name: "emailAddress",
    label: "Email address",
    type: "email",
    placeholder: "e.g. student@example.com",
    required: true,
    options: [],
  },
  {
    section: "Contact Information",
    name: "phoneNumber",
    label: "Phone number",
    type: "phone",
    placeholder: "300 1234567",
    required: true,
    options: [],
  },
  {
    section: "Contact Information",
    name: "guardianNumber",
    label: "Guardian number",
    type: "phone",
    placeholder: "300 1234567",
    required: false,
    options: [],
  },

  // Step 3: Course & Campus Details
  {
    section: "Course & Campus Details",
    name: "course",
    label: "Course",
    type: "select",
    placeholder: "Select course",
    required: true,
    options: BANO_QABIL_COURSES,
  },
  {
    section: "Course & Campus Details",
    name: "teacherName",
    label: "Teacher name",
    type: "text",
    placeholder: "e.g. Sir Kashif",
    required: true,
    options: [],
  },
  {
    section: "Course & Campus Details",
    name: "campus",
    label: "Campus",
    type: "select",
    placeholder: "Select Karachi campus",
    required: true,
    options: BANO_QABIL_CAMPUSES,
  },
  {
    section: "Course & Campus Details",
    name: "obtainedMarks",
    label: "Obtained marks",
    type: "number",
    placeholder: "e.g. 85 or 85%",
    required: true,
    options: [],
  },
];

let isSeeding = false;

async function seedDefaultFields() {
  if (isSeeding) return;
  isSeeding = true;
  try {
    for (const field of DEFAULT_FORM_FIELDS) {
      try {
        await api.post("/api/form-config", field);
      } catch (err: any) {
        if (err.response?.status !== 400) {
          console.warn(`Could not seed field ${field.name}:`, err.message);
        }
      }
    }
  } finally {
    isSeeding = false;
  }
}

function transformBackendData(groupedData: Record<string, any[]>): FormSection[] {
  const sectionMap = new Map<string, FormField[]>();

  CANONICAL_SECTIONS.forEach((sec) => {
    sectionMap.set(sec.title, []);
  });

  Object.entries(groupedData || {}).forEach(([sectionName, fields]) => {
    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, []);
    }
    const existing = sectionMap.get(sectionName)!;
    fields.forEach((f: any, idx: number) => {
      let opts = Array.isArray(f.options) ? f.options : [];
      if (f.name === "course" && opts.length === 0) opts = BANO_QABIL_COURSES;
      if (f.name === "campus" && opts.length === 0) opts = BANO_QABIL_CAMPUSES;

      existing.push({
        id: f._id || f.id || f.name,
        sectionId: f.section || sectionName,
        section: f.section || sectionName,
        name: f.name || f.label?.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        label: f.label || f.name,
        fieldType: (f.type as FieldType) || "text",
        placeholder: f.placeholder || "",
        required: Boolean(f.required),
        options: opts,
        sortOrder: idx,
      });
    });
  });

  const sections: FormSection[] = [];
  let secOrder = 0;

  CANONICAL_SECTIONS.forEach((canonical) => {
    const fields = sectionMap.get(canonical.title) || [];
    sections.push({
      id: canonical.title,
      title: canonical.title,
      description: canonical.description,
      sortOrder: secOrder++,
      fields,
    });
    sectionMap.delete(canonical.title);
  });

  sectionMap.forEach((fields, title) => {
    sections.push({
      id: title,
      title,
      description: `Fields configured under ${title}`,
      sortOrder: secOrder++,
      fields,
    });
  });

  return sections;
}

export async function getFormSchema(): Promise<FormSection[]> {
  try {
    const res = await api.get("/api/form-config");
    const grouped = res.data?.data || {};
    const totalFields = Object.values(grouped).reduce(
      (sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0),
      0
    );

    if (totalFields === 0) {
      await seedDefaultFields();
      const refreshed = await api.get("/api/form-config");
      return transformBackendData(refreshed.data?.data || {});
    }

    // Ensure course and campus options are complete
    let needsRefresh = false;
    const allFields: any[] = Object.values(grouped).flat();
    for (const field of allFields) {
      if (
        field.name === "course" &&
        Array.isArray(field.options) &&
        field.options.length < BANO_QABIL_COURSES.length
      ) {
        try {
          await api.put(`/api/form-config/${field._id}`, {
            options: BANO_QABIL_COURSES,
          });
          needsRefresh = true;
        } catch (e) {
          console.warn("Failed to sync course options:", e);
        }
      }
      if (
        field.name === "campus" &&
        Array.isArray(field.options) &&
        field.options.length < BANO_QABIL_CAMPUSES.length
      ) {
        try {
          await api.put(`/api/form-config/${field._id}`, {
            options: BANO_QABIL_CAMPUSES,
          });
          needsRefresh = true;
        } catch (e) {
          console.warn("Failed to sync campus options:", e);
        }
      }
    }

    if (needsRefresh) {
      const refreshed = await api.get("/api/form-config");
      return transformBackendData(refreshed.data?.data || {});
    }

    return transformBackendData(grouped);
  } catch (err) {
    console.warn("Error fetching /api/form-config, returning fallback canonical sections:", err);
    return CANONICAL_SECTIONS.map((sec) => ({
      id: sec.id,
      title: sec.title,
      description: sec.description,
      sortOrder: sec.sortOrder,
      fields: DEFAULT_FORM_FIELDS.filter((f) => f.section === sec.title).map((f, idx) => ({
        id: `def_${f.name}`,
        sectionId: sec.id,
        section: f.section,
        name: f.name,
        label: f.label,
        fieldType: f.type,
        placeholder: f.placeholder,
        required: f.required,
        options: f.options,
        sortOrder: idx,
      })),
    }));
  }
}

export async function createSection({ data }: { data: { title: string } }): Promise<FormSection[]> {
  const sectionTitle = data.title.trim();
  const dummyField = {
    section: sectionTitle,
    label: `${sectionTitle} Notes`,
    name: `${sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_notes_${Date.now().toString().slice(-4)}`,
    type: "text" as FieldType,
    placeholder: "Enter details",
    required: false,
    options: [],
  };
  try {
    await api.post("/api/form-config", dummyField);
  } catch (err) {
    console.warn("Could not create initial section field:", err);
  }
  return getFormSchema();
}

export async function updateSection({ data }: { data: { id: string | number; title: string } }): Promise<FormSection[]> {
  const oldTitle = String(data.id);
  const newTitle = data.title.trim();
  const current = await getFormSchema();
  const section = current.find((s) => String(s.id) === oldTitle);

  if (section) {
    for (const field of section.fields) {
      try {
        await api.put(`/api/form-config/${field.id}`, { section: newTitle });
      } catch (e) {
        console.warn(`Failed to update field section ${field.id}:`, e);
      }
    }
  }
  return getFormSchema();
}

export async function deleteSection({ data }: { data: { id: string | number } }): Promise<FormSection[]> {
  const sectionId = String(data.id);
  const current = await getFormSchema();
  const section = current.find((s) => String(s.id) === sectionId);

  if (section) {
    for (const field of section.fields) {
      try {
        await api.delete(`/api/form-config/${field.id}`);
      } catch (e) {
        console.warn(`Failed to delete field ${field.id}:`, e);
      }
    }
  }
  return getFormSchema();
}

export async function createField({
  data,
}: {
  data: {
    sectionId: string | number;
    label: string;
    fieldType: FieldType;
    required: boolean;
    options: string[];
    placeholder?: string;
  };
}): Promise<FormSection[]> {
  const sectionName = String(data.sectionId);
  const baseName =
    data.label.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Math.floor(1000 + Math.random() * 9000);

  await api.post("/api/form-config", {
    section: sectionName,
    label: data.label,
    name: baseName,
    type: data.fieldType,
    placeholder: data.placeholder || "",
    required: data.required,
    options: data.options || [],
  });

  return getFormSchema();
}

export async function updateField({
  data,
}: {
  data: {
    id: string | number;
    sectionId: string | number;
    label: string;
    fieldType: FieldType;
    required: boolean;
    options: string[];
    placeholder?: string;
  };
}): Promise<FormSection[]> {
  const sectionName = String(data.sectionId);

  await api.put(`/api/form-config/${data.id}`, {
    section: sectionName,
    label: data.label,
    type: data.fieldType,
    placeholder: data.placeholder,
    required: data.required,
    options: data.options,
  });

  return getFormSchema();
}

export async function deleteField({ data }: { data: { id: string | number } }): Promise<FormSection[]> {
  await api.delete(`/api/form-config/${data.id}`);
  return getFormSchema();
}

export async function resetFormSchema(): Promise<FormSection[]> {
  try {
    const res = await api.get("/api/form-config");
    const grouped = res.data?.data || {};
    const allFields: any[] = Object.values(grouped).flat();

    for (const f of allFields) {
      if (f._id) {
        try {
          await api.delete(`/api/form-config/${f._id}`);
        } catch {
          // Ignore
        }
      }
    }

    await seedDefaultFields();
    const refreshed = await api.get("/api/form-config");
    return transformBackendData(refreshed.data?.data || {});
  } catch (err) {
    console.error("Failed to reset form on server:", err);
    return getFormSchema();
  }
}

export async function submitRegistration({
  data,
}: {
  data: { payload: Record<string, any> };
}): Promise<Student> {
  const p = data.payload;

  const payload: Record<string, any> = {
    fullName: p.fullName || p.name || p["Full name"] || p["Full Name"] || "",
    dateOfBirth: p.dateOfBirth || p.dob || p["Date of birth"] || new Date().toISOString(),
    gender: p.gender || p.Gender || "Male",
    address: p.address || p.Address || "",
    emailAddress: (p.emailAddress || p.email || p["Email address"] || "").toLowerCase(),
    phoneNumber: p.phoneNumber || p.phone || p["Phone number"] || "",
    guardianNumber: p.guardianNumber || p["Guardian number"] || "",
    cnicNumber: p.cnicNumber || p.cnic || p["CNIC number"] || "",
    fatherOrGuardianName: p.fatherOrGuardianName || p["Father/Guardian name"] || "",
    course: p.course || p.Course || "",
    teacherName: p.teacherName || p["Teacher name"] || "Sir Kashif",
    campus: p.campus || p.Campus || "",
    obtainedMarks: String(p.obtainedMarks || p["Obtained marks"] || "85"),
    aboutYou: p.aboutYou || p["About yourself"] || "",
    dynamicData: {},
  };

  const standardKeys = new Set([
    "fullName", "name", "Full name", "Full Name",
    "dateOfBirth", "dob", "Date of birth",
    "gender", "Gender",
    "address", "Address",
    "emailAddress", "email", "Email address",
    "phoneNumber", "phone", "Phone number",
    "guardianNumber", "Guardian number",
    "cnicNumber", "cnic", "CNIC number",
    "fatherOrGuardianName", "Father/Guardian name",
    "course", "Course",
    "teacherName", "Teacher name",
    "campus", "Campus",
    "obtainedMarks", "Obtained marks",
    "aboutYou", "About yourself"
  ]);

  Object.entries(p).forEach(([k, v]) => {
    if (!standardKeys.has(k)) {
      payload.dynamicData[k] = v;
    }
  });

  const res = await api.post("/api/registration", payload);
  const created = res.data?.data;

  return {
    id: created?._id || `REG-${Date.now()}`,
    name: created?.fullName || payload.fullName,
    email: created?.emailAddress || payload.emailAddress,
    bqId: created?._id?.slice(-6).toUpperCase() || `BQ-${Date.now().toString().slice(-4)}`,
    numericId: Date.now().toString().slice(-6),
    course: created?.course || payload.course,
    campus: created?.campus || payload.campus,
    gender: created?.gender || payload.gender,
    phone: created?.phoneNumber || payload.phoneNumber,
    createdAt: created?.createdAt || new Date().toISOString(),
  };
}
