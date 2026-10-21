import api from "../axios";
import type { DashboardData } from "./types";
import { listStudents } from "./students";

export async function getDashboard(): Promise<DashboardData> {
  try {
    const [statsRes, students] = await Promise.all([
      api.get("/api/admin/dashboard-stats").catch(() => ({ data: null })),
      listStudents().catch(() => []),
    ]);

    const stats = statsRes.data || {};
    const totalStudents = stats.totalStudents ?? students.length;
    const totalPMs = stats.totalPMs ?? 0;
    const totalTeams = stats.totalTeams ?? 0;
    const totalProjects = stats.totalProjects ?? 0;

    const todayAttendance = stats.todayAttendance || { total: totalStudents, present: 0, rate: 0 };
    const courseDistribution = Array.isArray(stats.courseDistribution) ? stats.courseDistribution : [];

    // Format week series from attendanceTrend (last 7 days) if available
    let weekSeries = [];
    if (Array.isArray(stats.attendanceTrend) && stats.attendanceTrend.length > 0) {
      weekSeries = stats.attendanceTrend.slice(-7).map((t: any) => ({
        date: t.date || "",
        present: Number(t.present || 0),
      }));
    } else {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      weekSeries = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dayName = days[d.getDay()];
        return {
          date: `${dayName} ${d.getDate()}`,
          present: i === 6 ? (todayAttendance.present || 0) : 0,
        };
      });
    }

    return {
      studentCount: totalStudents,
      managerCount: totalPMs,
      teamCount: totalTeams,
      projectCount: totalProjects,
      todayPresent: todayAttendance.present ?? 0,
      todayTotal: totalStudents,
      courses: courseDistribution.map((c: any) => ({
        course: c.course || "General",
        count: Number(c.count || 0),
      })),
      recentStudents: students.slice(0, 5),
      weekSeries,
    };
  } catch (err) {
    console.error("Failed to load dashboard stats from backend:", err);
    return {
      studentCount: 0,
      managerCount: 0,
      teamCount: 0,
      projectCount: 0,
      todayPresent: 0,
      todayTotal: 0,
      courses: [],
      recentStudents: [],
      weekSeries: [],
    };
  }
}
