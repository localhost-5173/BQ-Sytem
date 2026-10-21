import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AttendanceStatus, Shift, Student } from "@/lib/api/types";

const STATUSES: AttendanceStatus[] = ["present", "late", "absent", "incomplete"];

type Mark = { studentId: string | number; status: AttendanceStatus };

export function MarkAttendanceDialog({
  open,
  onOpenChange,
  onLoad,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: () => Promise<{
    students: Student[];
    marks: { student_id: string | number; status: string; check_in: string | null }[];
  }>;
  onSave: (payload: { shift: Shift; marks: Mark[] }) => Promise<void>;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [shift, setShift] = useState<Shift>("Evening");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    void onLoad().then(({ students: list, marks: existing }) => {
      setStudents(list);
      const next: Record<string, AttendanceStatus> = {};
      for (const row of existing) next[String(row.student_id)] = row.status as AttendanceStatus;
      setMarks(next);
    });
  }, [open, onLoad]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.bqId.toLowerCase().includes(term),
    );
  }, [students, q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark attendance</DialogTitle>
          <DialogDescription>Set today's status per student. Saves into attendance history.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Search student" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={shift} onValueChange={(v) => setShift(v as Shift)}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="h-[50vh] rounded-xl bg-muted/60">
          <ul className="divide-y divide-border">
            {filtered.map((s) => (
              <li key={s.id} className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.bqId}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMarks((m) => ({ ...m, [String(s.id)]: st }))}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs capitalize",
                        marks[String(s.id)] === st
                          ? st === "present"
                            ? "bg-present text-present-fg"
                            : st === "late"
                              ? "bg-late text-late-fg"
                              : st === "absent"
                                ? "bg-absent text-absent-fg"
                                : "bg-incomplete text-incomplete-fg"
                          : "bg-card text-muted-foreground shadow-soft",
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                const payload = Object.entries(marks).map(([id, status]) => ({
                  studentId: id,
                  status,
                }));
                await onSave({ shift, marks: payload });
                onOpenChange(false);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
