"use client";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo } from "react";
import { Clock, GripVertical, MoreHorizontal, Play, Plus } from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { formatDuration } from "@/lib/utils";
import type { RoutineItem } from "@/types/routine";

interface RoutineListProps {
  items: RoutineItem[];
  orderedItems: RoutineItem[];
  onOrderedItemsChange: (items: RoutineItem[]) => void;
  onStartRoutine: () => void;
  onAddItem?: () => void;
  onReorder?: (items: RoutineItem[]) => void;
}

export function RoutineList({
  items,
  orderedItems,
  onOrderedItemsChange,
  onStartRoutine,
  onAddItem,
  onReorder,
}: RoutineListProps) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.position - b.position),
    [items],
  );

  useEffect(() => {
    onOrderedItemsChange(sortedItems);
  }, [sortedItems, onOrderedItemsChange]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = orderedItems.findIndex((item) => item.id === active.id);
    const newIndex = orderedItems.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedItems = arrayMove(orderedItems, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        position: index + 1,
      }),
    );

    onOrderedItemsChange(reorderedItems);
    onReorder?.(reorderedItems);
  };


  return (
    <div className="flex max-h-[calc(100vh-160px)] min-w-96 flex-col rounded-2xl border bg-card shadow-sm w-full">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold leading-none">Routine items</p>
          <p className="text-xs text-muted-foreground">
            {orderedItems.length} item{orderedItems.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onStartRoutine}
            disabled={orderedItems.length === 0}
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

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {orderedItems.length === 0 ? (
              <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                No items yet. Start building your routine below.
              </p>
            ) : (
              orderedItems.map((item) => (
                <SortableRoutineListItem key={item.id} item={item} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="border-t px-4 py-3">
        <button
          type="button"
          onClick={onAddItem}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          Add routine item
        </button>
      </div>
    </div>
  );
}

interface RoutineListItemProps {
  item: RoutineItem;
}

function SortableRoutineListItem({ item }: RoutineListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border bg-muted/40 px-4 py-3 transition-colors hover:border-primary/50 ${isDragging ? "border-primary shadow-sm" : ""}`}
      {...attributes}
      {...listeners}
    >
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

        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium text-muted-foreground/70">{item.position}</span>
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
