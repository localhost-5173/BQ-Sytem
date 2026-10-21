import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getDashboard } from "@/lib/api/dashboard";
import { listStudents } from "@/lib/api/students";
import { getTodayMarks, markAttendanceBulk } from "@/lib/api/attendance";
import { initials, nowHHMM, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkAttendanceDialog } from "@/components/admin/mark-attendance-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/")({
  loader: () => getDashboard(),
  component: DashboardPage,
});

function DashboardPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const [markOpen, setMarkOpen] = useState(false);
  const pct =
    data.todayTotal === 0 ? 0 : Math.round((data.todayPresent / data.todayTotal) * 100);
  const maxBar = Math.max(1, ...data.weekSeries.map((d) => d.present));

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-card p-6 shadow-card sm:p-8">
          <p className="text-sm text-muted-foreground">Total students</p>
          <p className="mt-2 text-6xl font-semibold tracking-tight tabular-nums text-ink">
            {data.studentCount}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Enrolled incubatees</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <StatMini value={data.managerCount} label="Managers" />
            <StatMini value={data.teamCount} label="Active team" />
            <StatMini value={data.projectCount} label="Projects" />
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-muted-foreground">Today's attendance</p>
            <Button size="sm" onClick={() => setMarkOpen(true)}>
              Mark attendance
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <p className="text-6xl font-semibold tracking-tight tabular-nums text-ink">{pct}%</p>
            <p className="mb-2 text-sm text-muted-foreground">
              {data.todayPresent} of {data.todayTotal} present
            </p>
          </div>
          <div className="mt-8 flex h-24 items-end gap-1.5 sm:gap-2">
            {data.weekSeries.map((d, i) => {
              const h = Math.max(6, (d.present / maxBar) * 100);
              const last = i === data.weekSeries.length - 1;
              return (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.present} present`}
                  className={last ? "flex-1 rounded-sm bg-primary" : "flex-1 rounded-sm bg-nav/70"}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Courses</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.courses.length === 0 ? (
              <li className="py-6 text-sm text-muted-foreground">No students yet</li>
            ) : (
              data.courses.map((c) => (
                <li key={c.course} className="flex items-center justify-between py-3.5">
                  <span className="text-sm text-ink">{c.course}</span>
                  <span className="text-sm font-medium tabular-nums text-ink">{c.count}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Recent students</h2>
            <Link to="/students" className="text-sm text-muted-foreground hover:text-ink">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {data.recentStudents.length === 0 ? (
              <li className="py-6 text-sm text-muted-foreground">No students yet</li>
            ) : (
              data.recentStudents.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-3.5">
                  <Avatar className="size-10 shrink-0 border border-border">
                    <AvatarImage src={s.avatar || undefined} alt={s.name} />
                    <AvatarFallback className="bg-muted text-sm font-semibold text-ink">
                      {initials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.course}</p>
                  </div>
                  <span className="text-sm tabular-nums text-muted-foreground">{s.numericId}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

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
        }}
      />
    </div>
  );
}

function StatMini({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums text-ink">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
