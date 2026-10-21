import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  createCalendarEntry,
  deleteCalendarEntry,
  getSettings,
  listCalendarEntries,
  saveSettings,
} from "@/lib/api/calendar";
import { WEEKDAYS } from "@/lib/constants";
import { cn, todayISO } from "@/lib/utils";
import type { CalendarEntry } from "@/lib/api/types";

export const Route = createFileRoute("/_app/calendar")({
  loader: async () => {
    const [settings, entries] = await Promise.all([getSettings(), listCalendarEntries()]);
    return { settings, entries };
  },
  component: CalendarPage,
});

function CalendarPage() {
  const { settings, entries } = Route.useLoaderData();
  const router = useRouter();
  const today = todayISO();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState<"month" | "year">("month");
  const [workingDays, setWorkingDays] = useState<number[]>(settings.workingDays);
  const [addOpen, setAddOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(today);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryKind, setEntryKind] = useState<"holiday" | "event">("holiday");

  const years = Array.from({ length: 7 }, (_, i) => now.getFullYear() - 2 + i);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const e of entries) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [entries]);

  return (
    <div>
      <PageHeader
        crumb="Calendar"
        title="Incubation Calendar"
        description="Manage holidays, events, and working days."
        actions={<Button onClick={() => setAddOpen(true)}>Add entry</Button>}
      />

      <section className="mb-5 rounded-2xl bg-card p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">Working days</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select which days are considered working days.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={async () => {
              await saveSettings({ data: { workingDays } });
              toast.success("Working days saved");
              await router.invalidate();
            }}
          >
            Save config
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {WEEKDAYS.map((d) => {
            const on = workingDays.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                onClick={() =>
                  setWorkingDays((days) =>
                    on ? days.filter((x) => x !== d.value) : [...days, d.value].sort(),
                  )
                }
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm shadow-soft",
                  on ? "bg-card text-ink" : "bg-muted text-muted-foreground",
                )}
              >
                <Checkbox checked={on} className="pointer-events-none" />
                {d.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-card p-4 shadow-card sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={m} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex rounded-full bg-muted p-1">
            <button
              type="button"
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium",
                view === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
              onClick={() => setView("month")}
            >
              Month
            </button>
            <button
              type="button"
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium",
                view === "year" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
              onClick={() => setView("year")}
            >
              Year
            </button>
          </div>
        </div>

        {view === "month" ? (
          <MonthGrid
            year={year}
            month={month}
            today={today}
            workingDays={workingDays}
            byDate={byDate}
            onSelectDate={(iso) => {
              setEntryDate(iso);
              setAddOpen(true);
            }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {months.map((_, i) => (
              <div key={i}>
                <p className="mb-2 text-sm font-medium">{months[i]}</p>
                <MonthGrid
                  compact
                  year={year}
                  month={i}
                  today={today}
                  workingDays={workingDays}
                  byDate={byDate}
                  onSelectDate={(iso) => {
                    setMonth(i);
                    setView("month");
                    setEntryDate(iso);
                    setAddOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {entries.length > 0 ? (
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.date} · {e.kind}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await deleteCalendarEntry({ data: { id: e.id } });
                    toast.success("Entry removed");
                    await router.invalidate();
                  }}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add calendar entry</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await createCalendarEntry({
                data: { date: entryDate, kind: entryKind, title: entryTitle },
              });
              toast.success("Entry added");
              setEntryTitle("");
              setAddOpen(false);
              await router.invalidate();
            }}
          >
            <div className="grid gap-1.5">
              <Label>Date</Label>
              <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={entryKind} onValueChange={(v) => setEntryKind(v as "holiday" | "event")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input value={entryTitle} onChange={(e) => setEntryTitle(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MonthGrid({
  year,
  month,
  today,
  workingDays,
  byDate,
  onSelectDate,
  compact,
}: {
  year: number;
  month: number;
  today: string;
  workingDays: number[];
  byDate: Map<string, CalendarEntry[]>;
  onSelectDate: (iso: string) => void;
  compact?: boolean;
}) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { iso?: string; day?: number; outside?: boolean }[] = [];
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    cells.push({ day: prevDays - i, outside: true });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ iso, day: d });
  }
  while (cells.length % 7 !== 0) cells.push({ outside: true });

  const labels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {labels.map((l) => (
          <div key={l} className={cn("py-2", compact && "py-1")}>
            {l}
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            const dow = i % 7;
            const off = cell.iso ? !workingDays.includes(dow) : false;
            const isToday = cell.iso === today;
            const hasEntry = cell.iso ? (byDate.get(cell.iso)?.length ?? 0) > 0 : false;
            return (
              <button
                key={i}
                type="button"
                disabled={!cell.iso}
                onClick={() => cell.iso && onSelectDate(cell.iso)}
                className={cn(
                  "relative min-h-16 border-r border-b border-border text-left last:border-r-0",
                  compact ? "min-h-9 p-1" : "min-h-[5.5rem] p-2 sm:min-h-24",
                  cell.iso && "hover:bg-muted",
                  isToday && "bg-incomplete",
                  i % 7 === 6 && "border-r-0",
                )}
              >
                {off || hasEntry ? (
                  <span className="absolute top-2 left-2 size-1.5 rounded-full bg-destructive" />
                ) : null}
                <span
                  className={cn(
                    "absolute top-2 right-2 text-sm tabular-nums",
                    cell.outside || !cell.iso ? "text-muted-foreground/40" : "text-muted-foreground",
                    compact && "static block text-right text-xs",
                  )}
                >
                  {cell.day ?? ""}
                </span>
                {!compact && cell.iso && hasEntry ? (
                  <p className="mt-6 truncate text-xs text-ink">
                    {byDate.get(cell.iso)?.[0]?.title}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
