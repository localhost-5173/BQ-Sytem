import api from "../axios";
import type { ProjectManager } from "./types";

export function mapBackendPm(pm: any): ProjectManager {
  return {
    id: pm._id || pm.id || "",
    name: pm.name || pm.fullName || "—",
    email: pm.email || "",
    role: pm.role || "PM",
    createdAt: pm.createdAt || "",
  };
}

export async function listPms(): Promise<ProjectManager[]> {
  try {
    const res = await api.get("/api/admin/pm");
    const pms = res.data?.data || res.data || [];
    return Array.isArray(pms) ? pms.map(mapBackendPm) : [];
  } catch (err) {
    console.warn("Error fetching PMs from backend:", err);
    return [];
  }
}

export async function createPm({
  data,
}: {
  data: {
    name: string;
    email: string;
    role: string;
    password?: string;
  };
}): Promise<ProjectManager> {
  const payload = {
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
    password: data.password || "Pm123456!",
  };
  const res = await api.post("/api/admin/pm", payload);
  const created = res.data?.data || res.data || payload;
  return mapBackendPm(created);
}

export async function updatePm({
  data,
}: {
  data: {
    id: string | number;
    name: string;
    email: string;
    role: string;
  };
}): Promise<{ ok: boolean }> {
  const payload = {
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
  };
  await api.put(`/api/admin/pm/${data.id}`, payload);
  return { ok: true };
}

export async function deletePm({ data }: { data: { id: string | number } }): Promise<{ ok: boolean }> {
  await api.delete(`/api/admin/pm/${data.id}`);
  return { ok: true };
}
