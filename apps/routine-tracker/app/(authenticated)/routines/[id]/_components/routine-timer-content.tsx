"use client";

import {
  AlarmClock,
  CheckCircle2,
  Pause,
  Play,
  SkipForward,
} from "lucide-react";
import { CircularCountdown } from "./circular-countdown";
import type { RoutineItem } from "@/types/routine";

interface RoutineTimerContentProps {
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

/**
 * Timer content component that displays the routine timer UI.
 * Shows the current task, countdown timer, controls, and next task preview.
 */
export function RoutineTimerContent({
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
}: RoutineTimerContentProps) {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-2xl w-full">
      {/* Header: Task name and progress indicator */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {currentTask ? currentTask.name : "Routine complete"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentTask
            ? `Task ${currentIndex + 1} of ${totalTasks}`
            : "You finished all tasks in this routine."}
        </p>
      </div>

      {/* Circular countdown timer display */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* SVG circular progress indicator */}
          <CircularCountdown
            progress={progress}
            overtime={isOvertime}
            hasDuration={!!currentTask}
          />
          {/* Overlay: Timer display with icon, time, and status */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            {/* Alarm icon with color-coded background (red for overtime, primary for normal) */}
            <div
              className={`rounded-full p-3 ${
                isOvertime
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <AlarmClock className="h-6 w-6" />
            </div>
            {/* Large time display: shows remaining time or overtime */}
            <div className="text-4xl font-semibold">
              {currentTask
                ? isOvertime
                  ? `+${formattedOvertime}`
                  : formattedTime
                : "--:--"}
            </div>
            {/* Status text: "Time remaining" or "Overtime" with allocated time */}
            <p className="text-sm text-muted-foreground">
              {currentTask
                ? `${isOvertime ? "Overtime" : ""} ${formattedAllocated}`
                : "No active task"}
            </p>
          </div>
        </div>
      </div>
      {/* Current task info and control buttons */}
      <div className="flex flex-col gap-4 md:flex-row mx-auto">
        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pause/Resume toggle button */}
          <button
            type="button"
            onClick={onPauseToggle}
            disabled={!currentTask}
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
              isPaused
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPaused ? (
              <Play size={16} />
            ) : (
              <Pause size={16} />
            )}
          </button>

          {/* Complete current task button */}
          <button
            type="button"
            onClick={onNextTask}
            disabled={!currentTask}
            className="h-28 w-28 rounded-full flex items-center justify-center bg-tranaparent text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={72} color="black"/>
          </button>

          {/* Skip to next task button */}
          <button
            type="button"
            onClick={onNextTask}
            disabled={!currentTask}
            className="h-16 w-16 rounded-full flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>

      {/* Next task preview card */}
      <div className="flex gap-2 rounded-2xl border bg-muted/40 p-4 text-md text-muted-foreground mx-auto">
        <p className="text-md text-muted-foreground">Next up</p>
        <p className="text-md">
          {nextTask ? nextTask.name : "All tasks done"}
        </p>
      </div>
    </div>
  );
}

