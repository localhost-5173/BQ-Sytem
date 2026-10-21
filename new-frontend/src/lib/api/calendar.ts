import api from "../axios";
import type { AppSettings, CalendarEntry } from "./types";

const DEFAULT_SETTINGS: AppSettings = {
  workingDays: [1, 2, 3, 4, 5],
  morningStart: "09:00",
  morningLateAfter: "09:15",
  eveningStart: "15:00",
  eveningLateAfter: "15:30",
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const res = await api.get("/api/attendance/settings");
    const s = res.data?.data || res.data || {};
    return {
      workingDays: s.workingDays || DEFAULT_SETTINGS.workingDays,
      morningStart: s.morningShift?.startTime || DEFAULT_SETTINGS.morningStart,
      morningLateAfter: s.morningShift?.lateThreshold || DEFAULT_SETTINGS.morningLateAfter,
      eveningStart: s.eveningShift?.startTime || DEFAULT_SETTINGS.eveningStart,
      eveningLateAfter: s.eveningShift?.lateThreshold || DEFAULT_SETTINGS.eveningLateAfter,
    };
  } catch (err) {
    console.warn("Using default settings fallback:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings({
  data,
}: {
  data: Partial<AppSettings>;
}): Promise<{ ok: boolean }> {
  try {
    const payload = {
      workingDays: data.workingDays,
      morningShift: {
        startTime: data.morningStart,
        lateThreshold: data.morningLateAfter,
      },
      eveningShift: {
        startTime: data.eveningStart,
        lateThreshold: data.eveningLateAfter,
      },
    };
    await api.put("/api/attendance/settings", payload);
    return { ok: true };
  } catch (err) {
    console.warn("Failed to update settings:", err);
    return { ok: false };
  }
}

export async function listCalendarEntries(): Promise<CalendarEntry[]> {
  try {
    const res = await api.get("/api/calendar/events");
    const events = res.data?.data || res.data || [];
    if (!Array.isArray(events)) return [];
    return events.map((e: any) => ({
      id: e._id || e.id || "",
      date: e.date ? new Date(e.date).toISOString().split("T")[0] : e.startDate || new Date().toISOString().split("T")[0],
      kind: (e.type?.toLowerCase() || e.kind || "event") as CalendarEntry["kind"],
      title: e.title || e.name || "Event",
    }));
  } catch (err) {
    console.warn("Could not fetch calendar events:", err);
    return [];
  }
}

export async function createCalendarEntry({
  data,
}: {
  data: {
    date: string;
    kind: "holiday" | "event" | "working";
    title: string;
  };
}): Promise<CalendarEntry> {
  const payload = {
    title: data.title,
    date: data.date,
    type: data.kind,
  };
  const res = await api.post("/api/calendar/events", payload);
  const created = res.data?.data || res.data || payload;
  return {
    id: created._id || created.id || Date.now(),
    date: data.date,
    kind: data.kind,
    title: data.title,
  };
}

export async function deleteCalendarEntry({ data }: { data: { id: string | number } }): Promise<{ ok: boolean }> {
  await api.delete(`/api/calendar/events/${data.id}`);
  return { ok: true };
}
