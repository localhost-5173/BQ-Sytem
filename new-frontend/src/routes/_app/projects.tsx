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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createProject, deleteProject, listProjects } from "@/lib/api/projects";
import { listTeams } from "@/lib/api/teams";
import type { Project } from "@/lib/api/types";

export const Route = createFileRoute("/_app/projects")({
  loader: async () => {
    const [projects, teams] = await Promise.all([listProjects(), listTeams()]);
    return { projects, teams };
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, teams } = Route.useLoaderData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<Project | null>(null);

  return (
    <div>
      <PageHeader
        crumb="Projects"
        title="Projects"
        actions={<Button onClick={() => setOpen(true)}>Assign Project</Button>}
      />
      {projects.length === 0 ? (
        <EmptyState message="No projects found" />
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <article key={p.id} className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.teamName ?? "Unassigned"} · {p.status}
                  </p>
                  {p.description ? <p className="mt-3 text-sm">{p.description}</p> : null}
                </div>
                <Button variant="destructive" size="sm" onClick={() => setRemoving(p)}>
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
            <DialogTitle>Assign project</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await createProject({
                  data: {
                    title,
                    description,
                    teamId: teamId || null,
                  },
                });
                toast.success("Project assigned");
                setTitle("");
                setDescription("");
                setTeamId("");
                setOpen(false);
                await router.invalidate();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not save");
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
              <Label>Team</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!removing) return;
                await deleteProject({ data: { id: removing.id } });
                toast.success("Project deleted");
                setRemoving(null);
                await router.invalidate();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
