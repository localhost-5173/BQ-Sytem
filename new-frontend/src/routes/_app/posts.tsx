import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPost, deletePost, listPosts } from "@/lib/api/posts";
import { formatDay } from "@/lib/utils";
import type { Post } from "@/lib/api/types";

export const Route = createFileRoute("/_app/posts")({
  loader: () => listPosts(),
  component: PostsPage,
});

function PostsPage() {
  const posts = Route.useLoaderData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <PageHeader
        crumb="Posts"
        title="Posts"
        actions={<Button onClick={() => setOpen(true)}>Add Post</Button>}
      />
      {posts.length === 0 ? (
        <EmptyState message="No posts found" />
      ) : (
        <div className="grid gap-3">
          {posts.map((p: Post) => (
            <article key={p.id} className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDay(p.createdAt)}</p>
                  {p.body ? <p className="mt-3 text-sm text-foreground/80">{p.body}</p> : null}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await deletePost({ data: { id: p.id } });
                    toast.success("Post deleted");
                    await router.invalidate();
                  }}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add post</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await createPost({ data: { title, body } });
                toast.success("Post published");
                setTitle("");
                setBody("");
                setOpen(false);
                await router.invalidate();
              } finally {
                setBusy(false);
              }
            }}
          >
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label>Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Publish"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
