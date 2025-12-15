"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlarmClock,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
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
import type { RoutineItem } from "@/types/routine";

interface RoutineListProps {
  items: RoutineItem[];
}

export function RoutineList({ items }: RoutineListProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasPlayedCompletionSound = useRef(false);

  const currentTask = items[currentIndex];
  const nextTask = items[currentIndex + 1];

  const playCompletionSound = useMemo(
    () =>
      () => {
        if (typeof window === "undefined") return;

        const AudioContextConstructor =
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextConstructor) return;

        const context = new AudioContextConstructor();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        // Short sine ping to signal that the allocated time expired.
        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gainNode.gain.setValueAtTime(0.2, context.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + 0.4);
      },
    []
  );

  useEffect(() => {
    if (!isSheetOpen || !currentTask || isPaused) return;

    const interval = window.setInterval(() => {
      // Keep the timer increment in state so UI and derived values stay in sync.
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, isSheetOpen, currentTask]);

  const remainingSeconds = (currentTask?.duration_seconds ?? 0) - elapsedSeconds;
  const isOvertime = remainingSeconds < 0;

  useEffect(() => {
    if (remainingSeconds <= 0 && !hasPlayedCompletionSound.current && currentTask) {
      // Play the alert once per task when the timer crosses zero.
      playCompletionSound();
      hasPlayedCompletionSound.current = true;
    }

    if (remainingSeconds > 0) {
      hasPlayedCompletionSound.current = false;
    }
  }, [currentTask, playCompletionSound, remainingSeconds]);

  const startRoutine = () => {
    if (items.length === 0) return;
    setIsSheetOpen(true);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setIsPaused(false);
    hasPlayedCompletionSound.current = false;
  };

  const resetRoutine = () => {
    setIsSheetOpen(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setIsPaused(false);
    hasPlayedCompletionSound.current = false;
  };

  const goToNextTask = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((index) => index + 1);
      setElapsedSeconds(0);
      setIsPaused(false);
      hasPlayedCompletionSound.current = false;
      return;
    }

    resetRoutine();
  };

  const formattedAllocated = formatTime(currentTask?.duration_seconds ?? 0);
  const formattedTime = formatTime(Math.max(remainingSeconds, 0));
  const formattedOvertime = formatTime(Math.abs(remainingSeconds));
  const progress = currentTask
    ? Math.min(elapsedSeconds / Math.max(currentTask.duration_seconds, 1), 1)
    : 0;

  return (
    <div className="flex max-h-[calc(100vh-160px)] flex-col rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold leading-none">Routine items</p>
          <p className="text-xs text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={startRoutine}
            disabled={items.length === 0}
          >
            <Play className="mr-2 h-4 w-4" /> Start routine
          </Button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
            No items yet. Start building your routine below.
          </p>
        ) : (
          items.map((item) => <RoutineListItem key={item.id} item={item} />)
        )}
      </div>

      <div className="border-t px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          Add routine item
        </button>
      </div>

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetRoutine();
          }
        }}
      >
        <SheetContent
          side="right"
          className="inset-0 h-full w-full max-w-full rounded-none border-none p-0 sm:max-w-full"
        >
          <div className="flex h-full flex-col bg-background">
            <SheetHeader className="border-b p-6">
              <SheetTitle className="text-2xl font-semibold">
                {currentTask ? currentTask.name : "Routine complete"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                {currentTask
                  ? `Task ${currentIndex + 1} of ${items.length}`
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
                        isOvertime ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <AlarmClock className="h-6 w-6" />
                    </div>
                    <div className="text-4xl font-semibold">
                      {currentTask ? (isOvertime ? `+${formattedOvertime}` : formattedTime) : "--:--"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentTask ? `${isOvertime ? "Overtime" : "Time remaining"} · ${formattedAllocated}` : "No active task"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current task</p>
                  <p className="text-xl font-semibold leading-tight">{currentTask?.name ?? "All tasks completed"}</p>
                  <p className="text-sm text-muted-foreground">
                    Allocated time: {formattedAllocated}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={isPaused ? "secondary" : "outline"}
                    onClick={() => setIsPaused((paused) => !paused)}
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
                    onClick={goToNextTask}
                    disabled={!currentTask}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                  </Button>

                  <Button
                    variant="outline"
                    onClick={goToNextTask}
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

function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (clamped % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

interface CircularCountdownProps {
  progress: number;
  overtime: boolean;
  hasDuration: boolean;
}

function CircularCountdown({ progress, overtime, hasDuration }: CircularCountdownProps) {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = hasDuration ? Math.min(Math.max(progress, 0), 1) : 0;
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <svg className="h-full w-full" viewBox="0 0 260 260" aria-hidden="true">
      <circle
        className="text-muted stroke-[12]"
        stroke="currentColor"
        fill="transparent"
        strokeWidth="12"
        cx="130"
        cy="130"
        r={radius}
        opacity={0.3}
      />
      <circle
        className={`stroke-[12] transition-[stroke-dashoffset] duration-300 ${
          overtime ? "text-destructive" : "text-primary"
        }`}
        stroke="currentColor"
        fill="transparent"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        cx="130"
        cy="130"
        r={radius}
      />
    </svg>
  );
}

export function RoutineListItem({ item }: RoutineListItemProps) {
  return (
    <div className="rounded-xl border bg-muted/40 px-4 py-3 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {item.icon || <Clock className="h-4 w-4" />}
          </div>
          <div className="space-y-1">
            <p className="font-medium leading-tight">{item.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDuration(item.duration_seconds)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}