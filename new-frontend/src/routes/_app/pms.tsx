import { useState } from "react";
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
import { createPm, deletePm, listPms } from "@/lib/api/pms";
import type { ProjectManager } from "@/lib/api/types";

export const Route = createFileRoute("/_app/pms")({
  loader: () => listPms(),
  component: PmsPage,
});

function PmsPage() {
  const pms = Route.useLoaderData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Project Manager");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <PageHeader
        crumb="Pm"
        title="Registered Project Managers"
        actions={<Button onClick={() => setOpen(true)}>Add PM</Button>}
      />
      {pms.length === 0 ? (
        <EmptyState message="No PMs found" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="px-6 py-4 font-medium">#</th>
                  <th className="px-4 py-4 font-medium">Name</th>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pms.map((pm: ProjectManager, i: number) => (
                  <tr key={pm.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-4 font-medium">{pm.name}</td>
                    <td className="px-4 py-4 text-sm">{pm.email}</td>
                    <td className="px-4 py-4 text-sm">{pm.role}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await deletePm({ data: { id: pm.id } });
                          toast.success("PM removed");
                          await router.invalidate();
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add project manager</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await createPm({ data: { name, email, role } });
                toast.success("PM added");
                setName("");
                setEmail("");
                setRole("Project Manager");
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
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
