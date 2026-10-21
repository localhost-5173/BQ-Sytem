import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/lib/api/types";

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `field-${field.id}`;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {field.fieldType === "textarea" ? (
        <Textarea id={id} value={value} required={field.required} onChange={(e) => onChange(e.target.value)} />
      ) : field.fieldType === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.fieldType === "radio" ? (
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-4">
          {field.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={opt} />
              {opt}
            </label>
          ))}
        </RadioGroup>
      ) : field.fieldType === "checkbox" ? (
        field.options && field.options.length > 0 ? (
          <div className="flex flex-wrap gap-4 pt-1">
            {field.options.map((opt) => {
              const selected = value ? value.split(",").map((s) => s.trim()) : [];
              const checked = selected.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border accent-primary"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selected, opt]
                        : selected.filter((s) => s !== opt);
                      onChange(next.join(", "));
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        ) : (
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer pt-1">
            <input
              type="checkbox"
              className="size-4 rounded border-border accent-primary"
              checked={value === "true" || value === "yes"}
              onChange={(e) => onChange(e.target.checked ? "true" : "false")}
            />
            <span>{field.placeholder || "I agree"}</span>
          </label>
        )
      ) : (
        <Input
          id={id}
          type={
            field.fieldType === "email"
              ? "email"
              : field.fieldType === "number"
                ? "number"
                : field.fieldType === "date"
                  ? "date"
                  : field.fieldType === "phone"
                    ? "tel"
                    : "text"
          }
          value={value}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
