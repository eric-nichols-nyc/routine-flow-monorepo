import { Clock } from "lucide-react";
import type { RoutineItem } from "@/types/routine";

interface RoutineListProps {
  items: RoutineItem[];
}

export function RoutineList({ items }: RoutineListProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground">No items yet.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <RoutineListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

interface RoutineListItemProps {
  item: RoutineItem;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) {
    return `${seconds}s`;
  }
  return `${minutes}m`;
}

export function RoutineListItem({ item }: RoutineListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{item.name}</span>
      </div>
      <span className="text-sm text-muted-foreground">
        {formatDuration(item.duration_seconds)}
      </span>
    </div>
  );
}