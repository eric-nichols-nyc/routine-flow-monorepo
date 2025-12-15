import { expect } from "@storybook/jest";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import type { ComponentProps } from "react";

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

type RoutineListProps = ComponentProps<typeof RoutineList>;

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
  render: (args) => {
    const [{ items }, updateArgs] = useArgs<RoutineListProps>();

    return (
      <RoutineList
        {...args}
        items={items}
        onReorder={(updatedItems) => updateArgs({ items: updatedItems })}
      />
    );
  },
  play: async ({ canvasElement, step, updateArgs, args }) => {
    const canvas = within(canvasElement);

    await step("Add a new routine item", async () => {
      updateArgs({
        items: [
          ...args.items,
          {
            id: "4",
            routine_id: "routine-1",
            position: 4,
            name: "Journal reflections",
            icon: "📝",
            duration_seconds: 180,
            created_at: null,
            updated_at: null,
          },
        ],
      });

      await expect(
        canvas.findByText("Journal reflections"),
      ).resolves.toBeInTheDocument();
    });
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
