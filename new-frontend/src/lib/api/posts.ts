import api from "../axios";
import type { Post } from "./types";

export function mapBackendPost(p: any): Post {
  return {
    id: p._id || p.id || "",
    title: p.title || p.caption || "Announcement",
    body: p.body || p.content || p.description || "",
    imageUrl: p.imageUrl || p.image || undefined,
    createdAt: p.createdAt || new Date().toISOString(),
  };
}

export async function listPosts(): Promise<Post[]> {
  try {
    const res = await api.get("/api/admin/post");
    const posts = res.data?.data || res.data || [];
    return Array.isArray(posts) ? posts.map(mapBackendPost) : [];
  } catch (err) {
    console.warn("Could not fetch posts from backend:", err);
    return [];
  }
}

export async function createPost({
  data,
}: {
  data: { title: string; body?: string };
}): Promise<Post> {
  const payload = {
    title: data.title,
    caption: data.title,
    content: data.body || "",
    body: data.body || "",
  };
  const res = await api.post("/api/admin/post", payload);
  const created = res.data?.data || res.data || payload;
  return mapBackendPost(created);
}

export async function updatePost({
  data,
}: {
  data: { id: string | number; title: string; body?: string };
}): Promise<{ ok: boolean }> {
  const payload = {
    title: data.title,
    caption: data.title,
    content: data.body || "",
    body: data.body || "",
  };
  await api.put(`/api/admin/post/${data.id}`, payload);
  return { ok: true };
}

export async function deletePost({ data }: { data: { id: string | number } }): Promise<{ ok: boolean }> {
  await api.delete(`/api/admin/post/${data.id}`);
  return { ok: true };
}
