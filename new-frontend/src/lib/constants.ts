export const COURSES = [
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
] as const;

export const CAMPUSES = [
  "Bahadurabad",
  "Expo (Fossphorus)",
  "Clifton",
  "Idarah Noor e Haq",
  "Jamia Millia",
] as const;

export const LOCATIONS = CAMPUSES;

export const SHIFTS = ["Morning", "Evening"] as const;

export const GENDERS = ["Male", "Female"] as const;

export const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
] as const;

export const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
] as const;
