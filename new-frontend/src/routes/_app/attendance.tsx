import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { MarkAttendanceDialog } from "@/components/admin/mark-attendance-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAttendanceStats, getTodayMarks, listAttendance, markAttendanceBulk } from "@/lib/api/attendance";
import { getSettings, saveSettings } from "@/lib/api/calendar";
import { listStudents } from "@/lib/api/students";
import { formatDay, formatTime, nowHHMM, todayISO } from "@/lib/utils";
import type { AppSettings, AttendanceFilters, AttendanceRecord, AttendanceStats } from "@/lib/api/types";

export const Route = createFileRoute("/_app/attendance")({
  loader: async () => {
    const filters: AttendanceFilters = { q: "", status: "all", shift: "all", range: "all" };
    const [records, stats, settings] = await Promise.all([
      listAttendance({ data: filters }),
      getAttendanceStats({ data: filters }),
      getSettings(),
    ]);
    return { records, stats, settings };
  },
  component: AttendancePage,
});

function AttendancePage() {
  const initial = Route.useLoaderData();
  const router = useRouter();
  const [filters, setFilters] = useState<AttendanceFilters>({
    q: "",
    status: "all",
    shift: "all",
    range: "all",
  });
  const [records, setRecords] = useState<AttendanceRecord[]>(initial.records);
  const [stats, setStats] = useState<AttendanceStats>(initial.stats);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(initial.settings);
  const [markOpen, setMarkOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      void Promise.all([
        listAttendance({ data: filters }),
        getAttendanceStats({ data: filters }),
      ]).then(([r, s]) => {
        setRecords(r);
        setStats(s);
      });
    }, 200);
    return () => clearTimeout(t);
  }, [filters]);

  return (
    <div>
      <PageHeader
        crumb="Attendance"
        title="Attendance History"
        description="Monitor and manage attendance records"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={async () => {
                const [r, s] = await Promise.all([
                  listAttendance({ data: filters }),
                  getAttendanceStats({ data: filters }),
                ]);
                setRecords(r);
                setStats(s);
                toast.success("Refreshed");
              }}
            >
              Refresh
            </Button>
            <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>
            <Button onClick={() => setMarkOpen(true)}>Mark attendance</Button>
          </>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={stats.total} label="Total records" tone="plain" />
        <StatCard value={stats.present} label="Present" tone="present" />
        <StatCard value={stats.late} label="Late" tone="late" />
        <StatCard value={stats.absent} label="Absent" tone="absent" />
      </div>

      <div className="mb-5 rounded-2xl bg-card p-4 shadow-card sm:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Search student</Label>
            <Input
              placeholder="Name, BQ ID, email"
              value={filters.q ?? ""}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <FilterSelect
            label="Date range"
            value={filters.range ?? "all"}
            onChange={(range) => setFilters({ ...filters, range })}
            options={[
              ["all", "All time"],
              ["today", "Today"],
              ["week", "Last 7 days"],
              ["month", "Last 30 days"],
            ]}
          />
          <FilterSelect
            label="Status"
            value={filters.status ?? "all"}
            onChange={(status) => setFilters({ ...filters, status })}
            options={[
              ["all", "All status"],
              ["present", "Present"],
              ["late", "Late"],
              ["absent", "Absent"],
              ["incomplete", "Incomplete"],
            ]}
          />
          <FilterSelect
            label="Shift"
            value={filters.shift ?? "all"}
            onChange={(shift) => setFilters({ ...filters, shift })}
            options={[
              ["all", "All shifts"],
              ["Morning", "Morning"],
              ["Evening", "Evening"],
            ]}
          />
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState message="No attendance records found" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Shift</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Check in</th>
                  <th className="px-6 py-4 font-medium">Check out</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-ink">{row.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {[
                          row.numericId && row.numericId !== "—" ? row.numericId : null,
                          row.bqId && row.bqId !== "—" ? row.bqId : null,
                          row.email,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm">{formatDay(row.date)}</td>
                    <td className="px-4 py-4 text-sm">{row.shift}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-4 text-sm tabular-nums">{formatTime(row.checkIn)}</td>
                    <td className="px-6 py-4 text-sm tabular-nums">{formatTime(row.checkOut)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance settings</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <TimeField
              label="Morning start"
              value={settings.morningStart}
              onChange={(morningStart) => setSettings({ ...settings, morningStart })}
            />
            <TimeField
              label="Late after (morning)"
              value={settings.morningLateAfter}
              onChange={(morningLateAfter) => setSettings({ ...settings, morningLateAfter })}
            />
            <TimeField
              label="Evening start"
              value={settings.eveningStart}
              onChange={(eveningStart) => setSettings({ ...settings, eveningStart })}
            />
            <TimeField
              label="Late after (evening)"
              value={settings.eveningLateAfter}
              onChange={(eveningLateAfter) => setSettings({ ...settings, eveningLateAfter })}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await saveSettings({ data: settings });
                toast.success("Settings saved");
                setSettingsOpen(false);
                await router.invalidate();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MarkAttendanceDialog
        open={markOpen}
        onOpenChange={setMarkOpen}
        onLoad={async () => {
          const [students, marks] = await Promise.all([
            listStudents(),
            getTodayMarks({ data: { date: todayISO(), shift: "Evening" } }),
          ]);
          return { students, marks };
        }}
        onSave={async (payload) => {
          await markAttendanceBulk({
            data: {
              date: todayISO(),
              shift: payload.shift,
              marks: payload.marks.map((m) => ({
                ...m,
                checkIn: m.status === "absent" ? null : nowHHMM(),
              })),
            },
          });
          toast.success("Attendance saved");
          await router.invalidate();
          const [r, s] = await Promise.all([
            listAttendance({ data: filters }),
            getAttendanceStats({ data: filters }),
          ]);
          setRecords(r);
          setStats(s);
        }}
      />
    </div>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "plain" | "present" | "late" | "absent";
}) {
  const bg =
    tone === "present"
      ? "bg-present/70"
      : tone === "late"
        ? "bg-late/80"
        : tone === "absent"
          ? "bg-absent/80"
          : "bg-card";
  const color =
    tone === "present"
      ? "text-present-fg"
      : tone === "late"
        ? "text-late-fg"
        : tone === "absent"
          ? "text-absent-fg"
          : "text-ink";
  return (
    <div className={`rounded-2xl ${bg} px-6 py-5 shadow-card`}>
      <p className={`text-4xl font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input type="time" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
