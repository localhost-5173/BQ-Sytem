import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FieldRenderer } from "@/components/admin/field-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  createField,
  createSection,
  deleteField,
  deleteSection,
  getFormSchema,
  resetFormSchema,
  updateField,
} from "@/lib/api/forms";
import { FIELD_TYPES } from "@/lib/constants";
import type { FieldType, FormField, FormSection } from "@/lib/api/types";

export const Route = createFileRoute("/_app/form-builder")({
  loader: () => getFormSchema(),
  component: FormBuilderPage,
});

const isOptionType = (t: string) => t === "select" || t === "radio" || t === "checkbox";

function FormBuilderPage() {
  const sections = Route.useLoaderData();
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [fieldOpen, setFieldOpen] = useState(false);
  const [editing, setEditing] = useState<FormField | null>(null);
  const [fieldForm, setFieldForm] = useState<{
    sectionId: string | number;
    label: string;
    fieldType: FieldType;
    required: boolean;
    options: string[];
  }>({
    sectionId: sections[0]?.id ?? "Personal Information",
    label: "",
    fieldType: "text" as FieldType,
    required: true,
    options: [],
  });
  const [values, setValues] = useState<Record<string, string>>({});
  const [resetting, setResetting] = useState(false);

  function openField(field?: FormField, sectionId?: string | number) {
    setEditing(field ?? null);
    const fType = field?.fieldType ?? "text";
    let initialOptions: string[] = [];
    if (field?.options && field.options.length > 0) {
      initialOptions = [...field.options];
    } else if (isOptionType(fType)) {
      initialOptions = ["Option 1", "Option 2"];
    }

    setFieldForm({
      sectionId: field?.sectionId ?? sectionId ?? sections[0]?.id ?? "Personal Information",
      label: field?.label ?? "",
      fieldType: fType,
      required: field?.required ?? true,
      options: initialOptions,
    });
    setFieldOpen(true);
  }

  return (
    <div>
      <PageHeader
        crumb="Form Builder"
        title="Registration Form"
        description="Fields and sections of the internship registration form."
        actions={
          <>
            <Button
              variant="outline"
              disabled={resetting}
              onClick={async () => {
                if (!confirm("Are you sure you want to reset all form fields to default?")) return;
                setResetting(true);
                try {
                  await resetFormSchema();
                  toast.success("Form fields reset to default");
                  await router.invalidate();
                } catch {
                  toast.error("Failed to reset form fields");
                } finally {
                  setResetting(false);
                }
              }}
            >
              {resetting ? "Resetting..." : "Reset to default"}
            </Button>
            <Button variant="secondary" onClick={() => setPreview(true)}>
              Preview form
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSectionTitle("");
                setSectionOpen(true);
              }}
            >
              Add section
            </Button>
            <Button onClick={() => openField()}>Add field</Button>
          </>
        }
      />

      <div className="mb-5 rounded-full bg-card px-5 py-3 text-sm text-muted-foreground shadow-soft">
        Connected to <span className="font-semibold text-ink">Internship Registration</span>. Changes
        made here go live on the{" "}
        <Link to="/register" className="font-medium text-ink underline-offset-2 hover:underline">
          public registration form
        </Link>{" "}
        immediately.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <section key={section.id} className="rounded-2xl bg-card p-5 shadow-card sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {section.fields.length} field{section.fields.length === 1 ? "" : "s"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await deleteSection({ data: { id: section.id } });
                  toast.success("Section removed");
                  await router.invalidate();
                }}
              >
                Remove
              </Button>
            </div>
            <ul className="space-y-3">
              {section.fields.map((field) => (
                <li
                  key={field.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted/80 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{field.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {labelForType(field.fieldType)} · {field.required ? "Required" : "Optional"}
                      {field.options.length ? ` · ${field.options.length} options` : ""}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => openField(field)}>
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Dialog open={sectionOpen} onOpenChange={setSectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add section</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await createSection({ data: { title: sectionTitle } });
              toast.success("Section added");
              setSectionOpen(false);
              await router.invalidate();
            }}
          >
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setSectionOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={fieldOpen} onOpenChange={setFieldOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit field" : "Add field"}</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const cleanOptions = isOptionType(fieldForm.fieldType)
                ? fieldForm.options.map((s) => s.trim()).filter(Boolean)
                : [];

              if (isOptionType(fieldForm.fieldType) && cleanOptions.length === 0) {
                toast.error("Please add at least one option");
                return;
              }

              const payload = {
                sectionId: fieldForm.sectionId,
                label: fieldForm.label.trim(),
                fieldType: fieldForm.fieldType,
                required: fieldForm.required,
                options: cleanOptions,
              };

              try {
                if (editing) await updateField({ data: { id: editing.id, ...payload } });
                else await createField({ data: payload });
                toast.success(editing ? "Field updated" : "Field added");
                setFieldOpen(false);
                await router.invalidate();
              } catch (err: any) {
                toast.error(err?.response?.data?.message || "Failed to save field");
              }
            }}
          >
            <div className="grid gap-1.5">
              <Label>Section</Label>
              <Select
                value={String(fieldForm.sectionId)}
                onValueChange={(v) => setFieldForm({ ...fieldForm, sectionId: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s: FormSection) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Label</Label>
              <Input
                value={fieldForm.label}
                onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                placeholder="e.g. Course Preference"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={fieldForm.fieldType}
                onValueChange={(v) => {
                  const newType = v as FieldType;
                  let newOpts = fieldForm.options;
                  if (isOptionType(newType) && newOpts.length === 0) {
                    newOpts = ["Option 1", "Option 2"];
                  }
                  setFieldForm({ ...fieldForm, fieldType: newType, options: newOpts });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isOptionType(fieldForm.fieldType) && (
              <div className="grid gap-2 border-t pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Options ({fieldForm.options.length})
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() =>
                      setFieldForm((prev) => ({
                        ...prev,
                        options: [...prev.options, `Option ${prev.options.length + 1}`],
                      }))
                    }
                  >
                    + Add Option
                  </Button>
                </div>
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {fieldForm.options.length === 0 ? (
                    <p className="py-2 text-center text-xs text-muted-foreground">
                      No options configured. Click &quot;+ Add Option&quot; above.
                    </p>
                  ) : (
                    fieldForm.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const updated = [...fieldForm.options];
                            updated[idx] = e.target.value;
                            setFieldForm({ ...fieldForm, options: updated });
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="h-8 text-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => {
                            const updated = fieldForm.options.filter((_, i) => i !== idx);
                            setFieldForm({ ...fieldForm, options: updated });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <label className="flex items-center justify-between gap-3 text-sm pt-1">
              Required
              <Switch
                checked={fieldForm.required}
                onCheckedChange={(required) => setFieldForm({ ...fieldForm, required })}
              />
            </label>
            {editing ? (
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  await deleteField({ data: { id: editing.id } });
                  toast.success("Field deleted");
                  setFieldOpen(false);
                  await router.invalidate();
                }}
              >
                Delete field
              </Button>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setFieldOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form preview</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            {sections.map((section) => (
              <div key={section.id} className="grid gap-3">
                <h3 className="font-semibold">{section.title}</h3>
                {section.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={values[field.label] ?? ""}
                    onChange={(v) => setValues((s) => ({ ...s, [field.label]: v }))}
                  />
                ))}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function labelForType(t: string) {
  return FIELD_TYPES.find((x) => x.value === t)?.label ?? t;
}
