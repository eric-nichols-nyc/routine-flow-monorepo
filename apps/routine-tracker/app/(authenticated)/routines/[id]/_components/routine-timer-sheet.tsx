"use client";

import { X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
} from "@repo/design-system/components/ui/sheet";
import { RoutineTimerContent } from "./routine-timer-content";
import type { RoutineItem } from "@/types/routine";

interface RoutineTimerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: RoutineItem | undefined;
  nextTask: RoutineItem | undefined;
  currentIndex: number;
  totalTasks: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onNextTask: () => void;
  formattedAllocated: string;
  formattedTime: string;
  formattedOvertime: string;
  progress: number;
  isOvertime: boolean;
}

export function RoutineTimerSheet({
  open,
  onOpenChange,
  currentTask,
  nextTask,
  currentIndex,
  totalTasks,
  isPaused,
  onPauseToggle,
  onNextTask,
  formattedAllocated,
  formattedTime,
  formattedOvertime,
  progress,
  isOvertime,
}: RoutineTimerSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-screen w-full max-w-full rounded-t-2xl border-none p-0 [&>button:has(svg.size-4)]:hidden"
      >
        {/* Custom larger close button */}
        <SheetClose className="absolute top-6 right-6 z-50 rounded-full bg-background/80 backdrop-blur-sm border border-border p-3 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </SheetClose>

        <div className="flex h-full flex-col items-center justify-center bg-background">
          <RoutineTimerContent
            currentTask={currentTask}
            nextTask={nextTask}
            currentIndex={currentIndex}
            totalTasks={totalTasks}
            isPaused={isPaused}
            onPauseToggle={onPauseToggle}
            onNextTask={onNextTask}
            formattedAllocated={formattedAllocated}
            formattedTime={formattedTime}
            formattedOvertime={formattedOvertime}
            progress={progress}
            isOvertime={isOvertime}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

