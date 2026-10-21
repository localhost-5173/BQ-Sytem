import api from "../axios";
import type { Project } from "./types";

export function mapBackendProject(p: any): Project {
  const teamObj = p.teamName || p.team;
  const teamId = teamObj?._id || teamObj || null;
  const teamName = typeof teamObj === "object" ? (teamObj.teamName || teamObj.name) : (typeof teamObj === "string" ? teamObj : null);

  return {
    id: p._id || p.id || "",
    title: p.title || p.name || "—",
    description: p.description || "",
    teamId: teamId ? String(teamId) : null,
    teamName: teamName || null,
    status: p.status || "In Progress",
    createdAt: p.createdAt || "",
  };
}

export async function listProjects(): Promise<Project[]> {
  try {
    const res = await api.get("/api/admin/project");
    const projects = res.data?.data || res.data || [];
    return Array.isArray(projects) ? projects.map(mapBackendProject) : [];
  } catch (err) {
    console.warn("Error fetching projects from backend:", err);
    return [];
  }
}

export async function createProject({
  data,
}: {
  data: {
    title: string;
    description?: string;
    teamId: string | number | null;
    pmId?: string | number | null;
    status?: string;
  };
}): Promise<Project> {
  let pmId = data.pmId;
  if (!pmId) {
    try {
      const pmRes = await api.get("/api/admin/pm");
      const pms = pmRes.data?.data || pmRes.data || [];
      if (Array.isArray(pms) && pms.length > 0) {
        pmId = pms[0]._id;
      }
    } catch {
      // ignore
    }
  }

  const payload = {
    title: data.title,
    description: data.description && data.description.length >= 20 ? data.description : `${data.title} project details and documentation.`,
    teamName: data.teamId ? String(data.teamId) : "",
    PM: pmId ? String(pmId) : "",
  };
  const res = await api.post("/api/admin/createproject", payload);
  const created = res.data?.data || res.data || payload;
  return mapBackendProject(created);
}

export async function updateProject({
  data,
}: {
  data: {
    id: string | number;
    title: string;
    description?: string;
    teamId: string | number | null;
    pmId?: string | number | null;
    status?: string;
  };
}): Promise<{ ok: boolean }> {
  let pmId = data.pmId;
  if (!pmId) {
    try {
      const pmRes = await api.get("/api/admin/pm");
      const pms = pmRes.data?.data || pmRes.data || [];
      if (Array.isArray(pms) && pms.length > 0) {
        pmId = pms[0]._id;
      }
    } catch {
      // ignore
    }
  }

  const payload = {
    title: data.title,
    description: data.description && data.description.length >= 20 ? data.description : `${data.title} project details and documentation.`,
    teamName: data.teamId ? String(data.teamId) : "",
    PM: pmId ? String(pmId) : "",
  };
  await api.put(`/api/admin/project/${data.id}`, payload);
  return { ok: true };
}

export async function deleteProject({ data }: { data: { id: string | number } }): Promise<{ ok: boolean }> {
  await api.delete(`/api/admin/project/${data.id}`);
  return { ok: true };
}

