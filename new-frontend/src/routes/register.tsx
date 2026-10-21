import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FieldRenderer } from "@/components/admin/field-renderer";
import { Button } from "@/components/ui/button";
import { getFormSchema, submitRegistration } from "@/lib/api/forms";

export const Route = createFileRoute("/register")({
  loader: () => getFormSchema(),
  component: RegisterPage,
});

function RegisterPage() {
  const sections = Route.useLoaderData();
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Incubation</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Internship registration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fields are managed live from the admin form builder.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link to="/">Admin</Link>
        </Button>
      </div>

      {done ? (
        <div className="rounded-2xl bg-card p-8 shadow-card">
          <h2 className="text-xl font-semibold">You're registered</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {done} is now in the student list. Keep this page if you need to submit another
            application.
          </p>
          <Button className="mt-6" onClick={() => setDone(null)}>
            Submit another
          </Button>
        </div>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const student = await submitRegistration({ data: { payload: values } });
              toast.success("Registration submitted");
              setValues({});
              setDone(student.name);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not submit");
            } finally {
              setBusy(false);
            }
          }}
        >
          {sections.map((section) => (
            <section key={section.id} className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">{section.title}</h2>
              <div className="grid gap-4">
                {section.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={values[field.label] ?? ""}
                    onChange={(v) => setValues((s) => ({ ...s, [field.label]: v }))}
                  />
                ))}
              </div>
            </section>
          ))}
          <Button type="submit" disabled={busy} className="justify-self-start">
            {busy ? "Submitting…" : "Submit registration"}
          </Button>
        </form>
      )}
    </div>
  );
}
