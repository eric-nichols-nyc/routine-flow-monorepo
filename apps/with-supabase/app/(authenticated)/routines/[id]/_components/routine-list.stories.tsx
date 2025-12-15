import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import type { RoutineItem } from "@/types/routine";
import { RoutineList } from "./routine-list";

const meta: Meta<typeof RoutineList> = {
  title: "Routines/RoutineList",
  component: RoutineList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onAddItem: { action: "onAddItem" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseItems = [
  {
    id: "1",
    routine_id: "routine-1",
    position: 1,
    name: "Morning stretch",
    icon: "🧘",
    duration_seconds: 300,
    created_at: null,
    updated_at: null,
  },
  {
    id: "2",
    routine_id: "routine-1",
    position: 2,
    name: "Brew coffee",
    icon: "☕",
    duration_seconds: 240,
    created_at: null,
    updated_at: null,
  },
  {
    id: "3",
    routine_id: "routine-1",
    position: 3,
    name: "Plan the day",
    icon: "🗒️",
    duration_seconds: 420,
    created_at: null,
    updated_at: null,
  }
];

export const Default: Story = {
  args: {
    items: baseItems,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

const sampleIcons = ["💪", "📚", "🏃", "🎯", "✍️", "🧘", "🎨", "🎵"];
const sampleNames = [
  "Exercise",
  "Read for 15 min",
  "Go for a walk",
  "Set daily goals",
  "Journal",
  "Meditate",
  "Creative time",
  "Listen to music",
];

function InteractiveRoutineList() {
  const [items, setItems] = useState<RoutineItem[]>(baseItems);

  const handleAddItem = () => {
    const newItem: RoutineItem = {
      id: crypto.randomUUID(),
      routine_id: "routine-1",
      position: items.length + 1,
      name: sampleNames[Math.floor(Math.random() * sampleNames.length)]!,
      icon: sampleIcons[Math.floor(Math.random() * sampleIcons.length)]!,
      duration_seconds: Math.floor(Math.random() * 600) + 60,
      created_at: null,
      updated_at: null,
    };
    setItems([...items, newItem]);
  };

  return <RoutineList items={items} onAddItem={handleAddItem} />;
}

export const Interactive: Story = {
  render: () => <InteractiveRoutineList />,
};
