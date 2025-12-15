"use client";

import { useEffect, useMemo, useState } from "react";
import { RoutineList } from "./routine-list";
import { RoutineTimerSheet } from "./routine-timer-sheet";
import { useRoutineTimer } from "../hooks/use-routine-timer";
import type { RoutineItem } from "@/types/routine";

interface RoutineDetailClientProps {
  items: RoutineItem[];
}

export function RoutineDetailClient({ items }: RoutineDetailClientProps) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.position - b.position),
    [items],
  );

  const [orderedItems, setOrderedItems] = useState<RoutineItem[]>(sortedItems);

  useEffect(() => {
    setOrderedItems(sortedItems);
  }, [sortedItems]);

  const timer = useRoutineTimer({ items: orderedItems });

  const handleReorder = (reorderedItems: RoutineItem[]) => {
    setOrderedItems(reorderedItems);
  };

  return (
    <>
      <RoutineList
        items={items}
        orderedItems={orderedItems}
        onOrderedItemsChange={setOrderedItems}
        onStartRoutine={timer.startRoutine}
        onReorder={handleReorder}
      />

      <RoutineTimerSheet
        open={timer.isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            timer.closeSheet();
          }
        }}
        currentTask={timer.currentTask}
        nextTask={timer.nextTask}
        currentIndex={timer.currentIndex}
        totalTasks={orderedItems.length}
        isPaused={timer.isPaused}
        onPauseToggle={timer.togglePause}
        onNextTask={timer.goToNextTask}
        formattedAllocated={timer.formattedAllocated}
        formattedTime={timer.formattedTime}
        formattedOvertime={timer.formattedOvertime}
        progress={timer.progress}
        isOvertime={timer.isOvertime}
      />
    </>
  );
}

