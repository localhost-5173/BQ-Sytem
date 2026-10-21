import api from "../axios";
import type { Team, TeamMember } from "./types";

export function mapBackendTeam(t: any, projects?: any[]): Team {
  const allMembers = Array.isArray(t.members) ? t.members : [];
  const leaderObj = allMembers.find((m: any) => m.role === "Team Leader");
  const memberObjs = allMembers.filter((m: any) => m.role === "Member");

  const leaderUser = leaderObj?.user;
  const leaderId = leaderUser?._id || leaderUser || null;
  const leaderName = typeof leaderUser === "object" ? leaderUser?.name : (leaderUser ? "Leader" : null);

  const members: TeamMember[] = memberObjs.map((m: any) => {
    const u = m.user;
    return {
      id: u?._id || u || m._id || "",
      name: typeof u === "object" ? u?.name : (u || "Member"),
    };
  });

  let projectName: string | null = null;
  if (Array.isArray(projects)) {
    const teamIdStr = String(t._id || t.id);
    const matchedProj = projects.find((p: any) => {
      const pTeamId = p.teamName?._id || p.teamName || p.team?._id || p.team;
      return String(pTeamId) === teamIdStr;
    });
    if (matchedProj) {
      projectName = matchedProj.title || matchedProj.name || null;
    }
  }

  return {
    id: t._id || t.id || "",
    name: t.teamName || t.name || "—",
    leaderId,
    leaderName,
    field: t.field || "—",
    projectName,
    members,
    createdAt: t.createdAt || "",
  };
}

export async function listTeams(): Promise<Team[]> {
  try {
    const [teamsRes, projectsRes] = await Promise.all([
      api.get("/api/admin/team?page=1&limit=100"),
      api.get("/api/admin/project").catch(() => ({ data: [] })),
    ]);

    const teams = teamsRes.data?.data || teamsRes.data || [];
    const projects = projectsRes.data?.data || projectsRes.data || [];

    if (!Array.isArray(teams)) return [];
    return teams.map((t: any) => mapBackendTeam(t, Array.isArray(projects) ? projects : []));
  } catch (err) {
    console.warn("Error fetching teams from backend:", err);
    return [];
  }
}

export async function createTeam({
  data,
}: {
  data: {
    name: string;
    leaderId: string | number | null;
    field: string;
    memberIds: Array<string | number>;
  };
}): Promise<Team[]> {
  const members = [];
  if (data.leaderId && data.leaderId !== "none") {
    members.push({ user: data.leaderId, role: "Team Leader" });
  }
  for (const mid of data.memberIds) {
    if (mid !== data.leaderId && mid !== "none") {
      members.push({ user: mid, role: "Member" });
    }
  }

  const payload = {
    teamName: data.name,
    field: data.field,
    members,
  };
  await api.post("/api/admin/createteam", payload);
  return listTeams();
}

export async function updateTeam({
  data,
}: {
  data: {
    id: string | number;
    name: string;
    leaderId: string | number | null;
    field: string;
    memberIds: Array<string | number>;
  };
}): Promise<Team[]> {
  const members = [];
  if (data.leaderId && data.leaderId !== "none") {
    members.push({ user: data.leaderId, role: "Team Leader" });
  }
  for (const mid of data.memberIds) {
    if (mid !== data.leaderId && mid !== "none") {
      members.push({ user: mid, role: "Member" });
    }
  }

  const payload = {
    teamName: data.name,
    field: data.field,
    members,
  };
  await api.put(`/api/admin/team/${data.id}`, payload);
  return listTeams();
}

export async function deleteTeam({ data }: { data: { id: string | number } }): Promise<{ ok: boolean }> {
  await api.delete(`/api/admin/team/${data.id}`);
  return { ok: true };
}

