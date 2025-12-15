import type { Meta, StoryObj } from "@storybook/react";

import { RoutineList } from "./routine-list";

const meta: Meta<typeof RoutineList> = {
  title: "Routines/RoutineList",
  component: RoutineList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
  },
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
