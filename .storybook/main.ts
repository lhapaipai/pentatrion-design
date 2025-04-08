import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {} from "@storybook/types";
import { UserConfig } from "vite";

const projectDir = resolve(fileURLToPath(new URL("..", import.meta.url)));

const config: StorybookConfig = {
  stories: [
    `${projectDir}/src/styles/**/*.stories.@(ts|tsx)`,
    `${projectDir}/src/components/**/*.stories.@(ts|tsx)`,
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
    builder: {
      name: "@storybook/builder-vite",
      options: {
        viteConfigPath: "./.storybook/vite.config.ts",
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["./public"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async viteFinal(config, options) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      optimizeDeps: {},
    } satisfies UserConfig);
  },
};
export default config;
