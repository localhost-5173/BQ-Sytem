import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus } from "@/lib/api/types";

const LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  incomplete: "Incomplete",
};

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  return <Badge variant={status}>{LABELS[status]}</Badge>;
}
