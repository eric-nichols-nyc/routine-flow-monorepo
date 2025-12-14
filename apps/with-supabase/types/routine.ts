// Types generated from Prisma schema
// These match the database models in packages/prisma/prisma/schema.prisma

export type Routine = {
  id: string;
  user_id: string;
  title: string;
  created_at: Date | null;
  updated_at: Date | null;
};

export type RoutineItem = {
  id: string;
  routine_id: string;
  position: number;
  name: string;
  icon: string;
  duration_seconds: number;
  created_at: Date | null;
  updated_at: Date | null;
};

export type RoutineRun = {
  id: string;
  routine_id: string;
  user_id: string;
  status: string;
  current_item_position: number;
  started_at: Date | null;
  completed_at: Date | null;
};

export type RoutineRunItem = {
  id: string;
  run_id: string;
  routine_item_id: string;
  position: number;
  name: string;
  icon: string;
  duration_seconds: number;
  status: string;
  completed_at: Date | null;
};

// Routine with related items
export type RoutineWithItems = Routine & {
  routine_items: RoutineItem[];
};

// Routine run with related items
export type RoutineRunWithItems = RoutineRun & {
  routine_run_items: RoutineRunItem[];
};

// Full routine with items and runs
export type RoutineWithItemsAndRuns = Routine & {
  routine_items: RoutineItem[];
  routine_runs: RoutineRun[];
};

// Input types for creating/updating
export type CreateRoutineInput = Pick<Routine, "title" | "user_id">;

export type CreateRoutineItemInput = Pick<
  RoutineItem,
  "routine_id" | "position" | "name" | "icon" | "duration_seconds"
>;

export type UpdateRoutineInput = Partial<Pick<Routine, "title">>;

export type UpdateRoutineItemInput = Partial<
  Pick<RoutineItem, "position" | "name" | "icon" | "duration_seconds">
>;

// Run status types
export type RoutineRunStatus = "in_progress" | "completed" | "cancelled";
export type RoutineRunItemStatus = "pending" | "in_progress" | "completed" | "skipped";
