import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Apps - explicitly list to avoid node_modules
    "../../with-supabase/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Packages
    "../../../packages/design-system/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
