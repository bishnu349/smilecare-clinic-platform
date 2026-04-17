// ─── Admin Utility Helpers ────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Approved":
      return "bg-success/15 text-success";
    case "Pending":
      return "bg-warning/15 text-warning-foreground";
    case "Rejected":
      return "bg-destructive/10 text-destructive";
    case "Completed":
      return "bg-primary/15 text-primary";
    case "SuggestedNewTime":
      return "bg-accent/20 text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function formatTimeAgo(nanos: number): string {
  if (!nanos) return "—";
  const ms = nanos / 1_000_000;
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
