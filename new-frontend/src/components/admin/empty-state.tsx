export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-36 items-center justify-center rounded-2xl bg-card px-6 py-16 text-sm text-muted-foreground shadow-card">
      {message}
    </div>
  );
}
