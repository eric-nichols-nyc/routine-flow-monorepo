import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime } from "@/lib/utils";
import type { RoutineItem } from "@/types/routine";

interface UseRoutineTimerOptions {
  items: RoutineItem[];
}

interface UseRoutineTimerReturn {
  // State
  isSheetOpen: boolean;
  currentIndex: number;
  elapsedSeconds: number;
  isPaused: boolean;

  // Current task info
  currentTask: RoutineItem | undefined;
  nextTask: RoutineItem | undefined;
  remainingSeconds: number;
  isOvertime: boolean;

  // Formatted values
  formattedAllocated: string;
  formattedTime: string;
  formattedOvertime: string;
  progress: number;

  // Actions
  startRoutine: () => void;
  resetRoutine: () => void;
  goToNextTask: () => void;
  togglePause: () => void;
  closeSheet: () => void;
}

export function useRoutineTimer({
  items,
}: UseRoutineTimerOptions): UseRoutineTimerReturn {
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

  // Timer interval effect
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

  // Sound effect when timer expires
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

  const togglePause = () => {
    setIsPaused((paused) => !paused);
  };

  const closeSheet = () => {
    resetRoutine();
  };

  // Derived values
  const formattedAllocated = formatTime(currentTask?.duration_seconds ?? 0);
  const formattedTime = formatTime(Math.max(remainingSeconds, 0));
  const formattedOvertime = formatTime(Math.abs(remainingSeconds));
  const progress = currentTask
    ? Math.min(elapsedSeconds / Math.max(currentTask.duration_seconds, 1), 1)
    : 0;

  return {
    // State
    isSheetOpen,
    currentIndex,
    elapsedSeconds,
    isPaused,

    // Current task info
    currentTask,
    nextTask,
    remainingSeconds,
    isOvertime,

    // Formatted values
    formattedAllocated,
    formattedTime,
    formattedOvertime,
    progress,

    // Actions
    startRoutine,
    resetRoutine,
    goToNextTask,
    togglePause,
    closeSheet,
  };
}

