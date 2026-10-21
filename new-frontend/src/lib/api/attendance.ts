import api from "../axios";
import type { AttendanceFilters, AttendanceRecord, AttendanceStats, Shift, AttendanceStatus } from "./types";

function mapAttendanceItem(item: any, fallbackDate?: string): AttendanceRecord {
  const u = item.user || item;
  const rawStatus = (item.status || "Absent").toString();
  let status: AttendanceStatus = "absent";
  const lower = rawStatus.toLowerCase();
  if (lower === "present") status = "present";
  else if (lower.includes("late")) status = "late";
  else if (lower === "incomplete" || lower === "early leave" || lower === "no checkout") status = "incomplete";
  else if (lower === "absent") status = "absent";
  else status = "present";

  return {
    id: item._id || item.id || "",
    studentId: u._id || item.user || item.studentId || "",
    studentName: u.name || item.name || "—",
    email: u.email || item.email || "",
    bqId: u.bq_id || item.bq_id || "—",
    numericId: u.incubation_id || item.incubation_id || "—",
    date: item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : (fallbackDate || new Date().toISOString().split("T")[0]),
    shift: (item.shift || item.assignedShift || u.shift || "Morning") as Shift,
    status,
    checkIn: item.checkInTime || item.checkIn || null,
    checkOut: item.checkOutTime || item.checkOut || null,
  };
}

export async function listAttendance({
  data,
}: {
  data?: AttendanceFilters;
}): Promise<AttendanceRecord[]> {
  try {
    const params = new URLSearchParams();
    if (data?.q) params.set("search", data.q);
    if (data?.shift && data.shift !== "all") params.set("shift", data.shift);
    if (data?.status && data.status !== "all") {
      const capStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1);
      params.set("status", capStatus);
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const range = data?.range || "all";

    if (range === "today") {
      params.set("date", todayStr);
      params.set("limit", "100");
      const res = await api.get(`/api/attendance/status?${params.toString()}`);
      const rows = res.data?.data || [];
      return Array.isArray(rows) ? rows.map((r: any) => mapAttendanceItem(r, res.data?.date || todayStr)) : [];
    }

    if (range === "yesterday") {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      params.set("date", yesterday);
      params.set("limit", "100");
      const res = await api.get(`/api/attendance/status?${params.toString()}`);
      const rows = res.data?.data || [];
      return Array.isArray(rows) ? rows.map((r: any) => mapAttendanceItem(r, yesterday)) : [];
    }

    if (range === "week") {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      params.set("startDate", weekAgo);
      params.set("endDate", todayStr);
    } else if (range === "month") {
      const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      params.set("startDate", monthAgo);
      params.set("endDate", todayStr);
    }

    params.set("limit", "100");
    const res = await api.get(`/api/attendance/history?${params.toString()}`);
    const rows = res.data?.data || [];
    return Array.isArray(rows) ? rows.map((r: any) => mapAttendanceItem(r)) : [];
  } catch (err) {
    console.warn("Could not fetch attendance records from backend:", err);
    return [];
  }
}

export async function getAttendanceStats({
  data,
}: {
  data?: AttendanceFilters;
}): Promise<AttendanceStats> {
  try {
    const params = new URLSearchParams();
    if (data?.q) params.set("search", data.q);
    if (data?.shift && data.shift !== "all") params.set("shift", data.shift);
    if (data?.status && data.status !== "all") {
      const capStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1);
      params.set("status", capStatus);
    }

    const range = data?.range || "all";
    let endpoint = "/api/attendance/status";
    if (range === "today") {
      params.set("date", new Date().toISOString().split("T")[0]);
    } else if (range === "yesterday") {
      params.set("date", new Date(Date.now() - 86400000).toISOString().split("T")[0]);
    } else {
      endpoint = "/api/attendance/history";
      if (range === "week") {
        params.set("startDate", new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]);
        params.set("endDate", new Date().toISOString().split("T")[0]);
      } else if (range === "month") {
        params.set("startDate", new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]);
        params.set("endDate", new Date().toISOString().split("T")[0]);
      }
    }

    const res = await api.get(`${endpoint}?${params.toString()}`);
    const s = res.data?.stats || {};
    return {
      total: s.total ?? 0,
      present: s.present ?? 0,
      late: s.late ?? 0,
      absent: s.absent ?? 0,
      incomplete: s.incomplete ?? 0,
    };
  } catch (err) {
    console.warn("Could not fetch attendance summary from backend:", err);
    return { total: 0, present: 0, late: 0, absent: 0, incomplete: 0 };
  }
}

export async function markAttendanceBulk({
  data,
}: {
  data: {
    date: string;
    shift: Shift;
    marks: Array<{
      studentId: string | number;
      status: AttendanceStatus;
      checkIn?: string | null;
    }>;
  };
}): Promise<{ ok: boolean; count: number }> {
  try {
    for (const m of data.marks) {
      try {
        await api.post(`/api/attendance/checkin/${m.studentId}`, {
          shift: data.shift,
          status: m.status,
        });
      } catch {
        // Continue
      }
    }
    return { ok: true, count: data.marks.length };
  } catch (err) {
    console.warn("Failed bulk attendance checkin:", err);
    return { ok: false, count: 0 };
  }
}

export async function getTodayMarks({
  data,
}: {
  data: { date: string; shift: string };
}): Promise<Array<{ student_id: string | number; status: string; check_in: string | null }>> {
  try {
    const res = await api.get(`/api/attendance/status?date=${data.date}&shift=${data.shift}`);
    const rows = res.data?.data || [];
    if (!Array.isArray(rows)) return [];
    return rows.map((r: any) => ({
      student_id: r._id || r.id,
      status: r.status,
      check_in: r.checkInTime,
    }));
  } catch {
    return [];
  }
}

