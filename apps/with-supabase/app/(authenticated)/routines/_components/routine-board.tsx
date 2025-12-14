import Link from "next/link";
import type { Routine } from "@/types/routine";

interface RoutineBoardProps {
  routines: Routine[];
}

export function RoutineBoard({ routines }: RoutineBoardProps) {
  if (routines.length === 0) {
    return <p className="text-muted-foreground">No routines yet.</p>;
  }

  return (
    <div className="space-y-4">
      {routines.map((routine) => (
        <RoutineItem key={routine.id} routine={routine} />
      ))}
    </div>
  );
}

interface RoutineItemProps {
  routine: Routine;
}

export function RoutineItem({ routine }: RoutineItemProps) {
  return (
    <Link
      href={`/routines/${routine.id}`}
      className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
    >
      <h3 className="font-medium">{routine.title}</h3>
      {routine.created_at && (
        <p className="text-sm text-muted-foreground mt-1">
          Created {new Date(routine.created_at).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}