import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StudentDialog } from "@/components/admin/student-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createStudent, deleteStudent, listStudents, updateStudent } from "@/lib/api/students";
import { CAMPUSES, COURSES, SHIFTS } from "@/lib/constants";
import { initials } from "@/lib/utils";
import type { Student } from "@/lib/api/types";
import { Check, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_app/students")({
  loader: () => listStudents(),
  component: StudentsPage,
});

function StudentsPage() {
  const students = Route.useLoaderData();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "Male" | "Female">("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [campusFilter, setCampusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [removing, setRemoving] = useState<Student | null>(null);

  // Dynamic real counts based on real student records
  const totalCount = students.length;
  const maleCount = students.filter((s) => s.gender === "Male").length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;
  const morningCount = students.filter((s) => s.shift === "Morning").length;
  const eveningCount = students.filter((s) => s.shift === "Evening").length;

  const filtered = useMemo(() => {
    return students.filter((s) => {
      // Gender filter
      if (genderFilter !== "all" && s.gender !== genderFilter) {
        return false;
      }
      // Course filter
      if (courseFilter !== "all" && s.course !== courseFilter) {
        return false;
      }
      // Shift filter
      if (shiftFilter !== "all" && s.shift !== shiftFilter) {
        return false;
      }
      // Campus filter
      if (campusFilter !== "all" && s.campus !== campusFilter) {
        return false;
      }
      // Search term
      const term = q.trim().toLowerCase();
      if (!term) return true;
      return (
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.bqId.toLowerCase().includes(term) ||
        s.numericId.toLowerCase().includes(term) ||
        s.course.toLowerCase().includes(term) ||
        s.phone.includes(term)
      );
    });
  }, [students, q, genderFilter, courseFilter, shiftFilter, campusFilter]);

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) return;
    window.open(`https://wa.me/${cleanPhone}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <PageHeader
        crumb="Students"
        title="Students"
        description="Enrolled incubatees across all courses."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add student
          </Button>
        }
      />

      {/* Real Stats Cards */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-card px-6 py-5 shadow-card">
          <p className="text-4xl font-semibold tabular-nums text-ink">{totalCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Students</p>
        </div>
        <div className="rounded-2xl bg-card px-6 py-5 shadow-card">
          <p className="text-4xl font-semibold tabular-nums text-ink">{maleCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">Male Candidates</p>
        </div>
        <div className="rounded-2xl bg-card px-6 py-5 shadow-card">
          <p className="text-4xl font-semibold tabular-nums text-ink">{femaleCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">Female Candidates</p>
        </div>
        <div className="rounded-2xl bg-card px-6 py-5 shadow-card">
          <p className="text-4xl font-semibold tabular-nums text-ink">
            {morningCount} / {eveningCount}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Morning / Evening</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-5 rounded-2xl bg-card p-4 shadow-card sm:p-5">
        {/* Male / Female Candidate Tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <span className="text-xs font-medium text-muted-foreground mr-1">Candidate Gender:</span>
          <button
            type="button"
            onClick={() => setGenderFilter("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              genderFilter === "all"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-ink"
            }`}
          >
            All Candidates ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter("Male")}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              genderFilter === "Male"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-ink"
            }`}
          >
            Male ({maleCount})
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter("Female")}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              genderFilter === "Female"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-ink"
            }`}
          >
            Female ({femaleCount})
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Search student</Label>
            <Input
              placeholder="Name, BQ ID, Roll No, email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Course</Label>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Shift</Label>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Shifts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {SHIFTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Campus</Label>
            <Select value={campusFilter} onValueChange={setCampusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Campuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                {CAMPUSES.map((camp) => (
                  <SelectItem key={camp} value={camp}>
                    {camp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No students found" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-4 py-4 font-medium">BQ ID</th>
                  <th className="px-4 py-4 font-medium">Roll No</th>
                  <th className="px-4 py-4 font-medium">Course</th>
                  <th className="px-4 py-4 font-medium">Shift</th>
                  <th className="px-4 py-4 font-medium">Phone</th>
                  <th className="px-4 py-4 font-medium">Campus</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar className="size-10 border border-border">
                            <AvatarImage src={s.avatar || undefined} alt={s.name} />
                            <AvatarFallback className="bg-muted text-xs font-semibold text-ink">
                              {initials(s.name)}
                            </AvatarFallback>
                          </Avatar>
                          {s.isVerified && (
                            <div
                              className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-background"
                              title="Verified User"
                            >
                              <Check className="size-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-ink">{s.name}</p>
                            {s.gender && s.gender !== "—" && (
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  s.gender === "Male"
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                }`}
                              >
                                {s.gender}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-ink">{s.bqId}</td>
                    <td className="px-4 py-4 text-sm">
                      {s.numericId && s.numericId !== "—" ? (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-ink">
                          {s.numericId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">{s.course}</td>
                    <td className="px-4 py-4 text-sm capitalize">{s.shift}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{s.phone}</span>
                        {s.phone && s.phone !== "—" && (
                          <button
                            type="button"
                            title="Chat on WhatsApp"
                            className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-500/10 transition-colors"
                            onClick={() => openWhatsApp(s.phone)}
                          >
                            <MessageSquare className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{s.campus}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditing(s);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setRemoving(s)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <StudentDialog
        open={open}
        onOpenChange={setOpen}
        student={editing}
        onSubmit={async (input) => {
          try {
            if (editing) await updateStudent({ data: { id: editing.id, ...input } });
            else await createStudent({ data: input });
            toast.success(editing ? "Student updated" : "Student added");
            await router.invalidate();
          } catch (err: any) {
            const errorMsg =
              err.response?.data?.message ||
              (err.response?.data?.errors ? Object.values(err.response.data.errors)[0] : null) ||
              err.message ||
              "Could not save student";
            toast.error(errorMsg as string);
            throw err;
          }
        }}
      />

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {removing?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the student record from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!removing) return;
                try {
                  await deleteStudent({ data: { id: removing.id } });
                  toast.success("Student deleted");
                  setRemoving(null);
                  await router.invalidate();
                } catch (err: any) {
                  const errorMsg =
                    err.response?.data?.message ||
                    (err.response?.data?.errors ? Object.values(err.response.data.errors)[0] : null) ||
                    err.message ||
                    "Could not delete student";
                  toast.error(errorMsg as string);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
