import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAMPUSES, COURSES, GENDERS, SHIFTS } from "@/lib/constants";
import { getStudentEnums, type EnumsData } from "@/lib/api/students";
import type { Student, StudentInput } from "@/lib/api/types";

const defaultEmpty: StudentInput = {
  name: "",
  bqId: "",
  email: "",
  phone: "92",
  cnic: "",
  password: "",
  course: COURSES[0],
  campus: CAMPUSES[0],
  gender: "Male",
  shift: "Morning",
};

export function StudentDialog({
  open,
  onOpenChange,
  student,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSubmit: (data: StudentInput) => Promise<void>;
}) {
  const [form, setForm] = useState<StudentInput>(defaultEmpty);
  const [enums, setEnums] = useState<EnumsData>({
    courses: [...COURSES],
    locations: [...CAMPUSES],
    shifts: [...SHIFTS],
    genders: [...GENDERS],
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getStudentEnums().then((data) => {
      if (data) setEnums(data);
    });
  }, []);

  useEffect(() => {
    if (open) {
      if (student) {
        setForm({
          name: student.name === "—" ? "" : student.name,
          bqId: student.bqId === "—" ? "" : student.bqId,
          email: student.email === "—" ? "" : student.email,
          phone: student.phone === "—" ? "92" : student.phone,
          cnic: student.cnic === "—" ? "" : student.cnic || "",
          course: student.course === "—" ? (enums.courses[0] || "Web Development") : student.course,
          campus: student.campus === "—" ? (enums.locations[0] || "Bahadurabad") : student.campus,
          gender: student.gender === "—" ? "Male" : student.gender,
          shift: student.shift === "—" ? "Morning" : student.shift || "Morning",
          password: "",
        });
      } else {
        setForm({
          ...defaultEmpty,
          course: enums.courses[0] || COURSES[0],
          campus: enums.locations[0] || CAMPUSES[0],
        });
      }
    }
  }, [open, student, enums]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? "Edit student" : "Add new student"}</DialogTitle>
          <DialogDescription>
            {student
              ? "Update incubatee details. Password can be left blank to keep unchanged."
              : "Register a new student with actual profile details and required credentials."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await onSubmit(form);
              onOpenChange(false);
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="st-name">Full name *</Label>
              <Input
                id="st-name"
                placeholder="Muhammad Ahmed"
                value={form.name}
                minLength={3}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="st-bqid">BQ ID * (min 5 characters)</Label>
              <Input
                id="st-bqid"
                placeholder="80135"
                value={form.bqId || ""}
                minLength={5}
                onChange={(e) => setForm({ ...form, bqId: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="st-email">Email address *</Label>
              <Input
                id="st-email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="st-phone">Phone number * (e.g. 923001234567)</Label>
              <Input
                id="st-phone"
                placeholder="923001234567"
                value={form.phone}
                pattern="^92\d{10}$"
                title="Phone must start with 92 and contain 12 digits (e.g. 923001234567)"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="st-cnic">CNIC * (xxxxx-xxxxxxx-x)</Label>
              <Input
                id="st-cnic"
                placeholder="42101-1234567-1"
                value={form.cnic || ""}
                pattern="^\d{5}-\d{7}-\d$"
                title="CNIC must be in xxxxx-xxxxxxx-x format"
                onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                required={!student}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="st-pass">
                {student ? "New password (Optional)" : "Password * (min 8 characters)"}
              </Label>
              <Input
                id="st-pass"
                type="password"
                placeholder="••••••••"
                value={form.password || ""}
                minLength={student && !form.password ? 0 : 8}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!student}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Course *</Label>
              <Select
                value={form.course}
                onValueChange={(course) => setForm({ ...form, course })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {enums.courses.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Shift *</Label>
              <Select
                value={form.shift || "Morning"}
                onValueChange={(shift) => setForm({ ...form, shift })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {enums.shifts.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Gender *</Label>
              <Select
                value={form.gender || "Male"}
                onValueChange={(gender) => setForm({ ...form, gender })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {enums.genders.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Campus Location *</Label>
              <Select
                value={form.campus || enums.locations[0] || "Bahadurabad"}
                onValueChange={(campus) => setForm({ ...form, campus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {enums.locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : student ? "Update Student" : "Create Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
