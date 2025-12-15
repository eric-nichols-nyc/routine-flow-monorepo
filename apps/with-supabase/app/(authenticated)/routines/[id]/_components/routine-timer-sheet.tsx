"use client";

import {
  AlarmClock,
  CheckCircle2,
  Pause,
  Play,
  SkipForward,
} from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { Separator } from "@repo/design-system/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@repo/design-system/components/ui/sheet";
import { formatTime } from "@/lib/utils";
import { CircularCountdown } from "./circular-countdown";
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
        className="h-screen w-full max-w-full rounded-t-2xl border-none p-0"
      >
        <div className="flex h-full flex-col bg-background">
          <SheetHeader className="border-b p-6">
            <SheetTitle className="text-2xl font-semibold">
              {currentTask ? currentTask.name : "Routine complete"}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {currentTask
                ? `Task ${currentIndex + 1} of ${totalTasks}`
                : "You finished all tasks in this routine."}
            </p>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex h-64 w-64 items-center justify-center">
                <CircularCountdown
                  progress={progress}
                  overtime={isOvertime}
                  hasDuration={!!currentTask}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <div
                    className={`rounded-full p-3 ${
                      isOvertime
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <AlarmClock className="h-6 w-6" />
                  </div>
                  <div className="text-4xl font-semibold">
                    {currentTask
                      ? isOvertime
                        ? `+${formattedOvertime}`
                        : formattedTime
                      : "--:--"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentTask
                      ? `${isOvertime ? "Overtime" : "Time remaining"} · ${formattedAllocated}`
                      : "No active task"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current task</p>
                <p className="text-xl font-semibold leading-tight">
                  {currentTask?.name ?? "All tasks completed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Allocated time: {formattedAllocated}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={isPaused ? "secondary" : "outline"}
                  onClick={onPauseToggle}
                  disabled={!currentTask}
                >
                  {isPaused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  )}
                </Button>

                <Button
                  variant="default"
                  onClick={onNextTask}
                  disabled={!currentTask}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                </Button>

                <Button
                  variant="outline"
                  onClick={onNextTask}
                  disabled={!currentTask}
                >
                  <SkipForward className="mr-2 h-4 w-4" /> Next task
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Next up</p>
              <p className="text-lg font-semibold">
                {nextTask ? nextTask.name : "All tasks done"}
              </p>
              {nextTask && (
                <p className="text-sm text-muted-foreground">
                  {formatTime(nextTask.duration_seconds)} allocated
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

