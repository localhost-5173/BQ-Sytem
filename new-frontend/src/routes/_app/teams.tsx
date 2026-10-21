import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createTeam, deleteTeam, listTeams, updateTeam } from "@/lib/api/teams";
import { listStudents } from "@/lib/api/students";
import { COURSES } from "@/lib/constants";
import type { Team } from "@/lib/api/types";

export const Route = createFileRoute("/_app/teams")({
  loader: async () => {
    const [teams, students] = await Promise.all([listTeams(), listStudents()]);
    return { teams, students };
  },
  component: TeamsPage,
});

function TeamsPage() {
  const { teams, students } = Route.useLoaderData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [removing, setRemoving] = useState<Team | null>(null);

  return (
    <div>
      <PageHeader
        crumb="Teams"
        title="Registered Teams"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add Team
          </Button>
        }
      />
      {teams.length === 0 ? (
        <EmptyState message="No teams found" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="px-6 py-4 font-medium">#</th>
                  <th className="px-4 py-4 font-medium">Team Name</th>
                  <th className="px-4 py-4 font-medium">Assigned Project</th>
                  <th className="px-4 py-4 font-medium">Team Leader</th>
                  <th className="px-4 py-4 font-medium">Members</th>
                  <th className="px-4 py-4 font-medium">Field</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, i) => (
                  <tr key={team.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-5 text-sm text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-5 font-semibold text-ink">{team.name}</td>
                    <td className="px-4 py-5 text-sm font-medium text-ink/80">
                      {team.projectName ? (
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {team.projectName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-ink">{team.leaderName ?? "—"}</td>
                    <td className="px-4 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {team.members.length === 0 ? (
                          <span className="text-sm text-muted-foreground">—</span>
                        ) : (
                          team.members.map((m) => (
                            <span
                              key={m.id}
                              className="rounded-full bg-muted px-3 py-1 text-xs text-ink"
                            >
                              {m.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm">{team.field}</td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditing(team);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setRemoving(team)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TeamDialog
        open={open}
        onOpenChange={setOpen}
        team={editing}
        students={students}
        onSubmit={async (payload) => {
          if (editing) await updateTeam({ data: { id: editing.id, ...payload } });
          else await createTeam({ data: payload });
          toast.success(editing ? "Team updated" : "Team created");
          await router.invalidate();
        }}
      />

      <AlertDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {removing?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Assigned projects will keep running without this team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!removing) return;
                await deleteTeam({ data: { id: removing.id } });
                toast.success("Team deleted");
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

function TeamDialog({
  open,
  onOpenChange,
  team,
  students,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  team: Team | null;
  students: { id: string | number; name: string }[];
  onSubmit: (data: {
    name: string;
    leaderId: string | number | null;
    field: string;
    memberIds: (string | number)[];
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState<string>("none");
  const [field, setField] = useState("Web Development");
  const [memberIds, setMemberIds] = useState<(string | number)[]>([]);
  const [busy, setBusy] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(team?.name ?? "");
    setLeaderId(team?.leaderId ? String(team.leaderId) : "none");
    setField(team?.field ?? "Web Development");
    setMemberIds(team?.members.map((m) => m.id) ?? []);
    setMemberQuery("");
  }, [open, team]);

  const visible = useMemo(() => {
    const t = memberQuery.trim().toLowerCase();
    return students.filter((s) => !t || s.name.toLowerCase().includes(t));
  }, [students, memberQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? "Edit team" : "Add team"}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await onSubmit({
                name,
                leaderId: leaderId === "none" ? null : leaderId,
                field,
                memberIds,
              });
              onOpenChange(false);
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="grid gap-1.5">
            <Label>Team name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-1.5">
            <Label>Team leader</Label>
            <Select value={leaderId} onValueChange={setLeaderId}>
              <SelectTrigger>
                <SelectValue placeholder="Select leader" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No leader</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Field</Label>
            <Select value={field} onValueChange={setField}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Members</Label>
            <Input
              placeholder="Filter students"
              value={memberQuery}
              onChange={(e) => setMemberQuery(e.target.value)}
            />
            <div className="max-h-40 overflow-auto rounded-xl bg-muted p-2">
              {visible.slice(0, 40).map((s) => {
                const checked = memberIds.includes(s.id);
                return (
                  <label key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setMemberIds((ids) =>
                          checked ? ids.filter((id) => id !== s.id) : [...ids, s.id],
                        )
                      }
                    />
                    {s.name}
                  </label>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
