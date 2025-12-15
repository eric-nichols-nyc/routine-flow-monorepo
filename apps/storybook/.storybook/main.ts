import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Apps - only include app folder, not node_modules
    "../../with-supabase/app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../docs/app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Packages - only include src/components folders
    "../../../packages/design-system/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
};

export default config;
