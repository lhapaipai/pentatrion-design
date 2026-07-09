import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const toolbarVariants = cva("p-1 border-custom-2 border gap-1 bg-gray-0/40", {
  variants: {
    sticky: {
      mobileOnly: "max-lg:sticky max-lg:top-0 max-lg:backdrop-blur-xs lg:rounded-t-2xl",
      allDevice: "max-lg:sticky max-lg:top-0 max-lg:backdrop-blur-xs lg:rounded-t-2xl",
      false: "",
    },
    visible: {
      always: "flex",
      custom: "",
      desktopOnly: "hidden lg:flex rounded-t-2xl",
    },
  },
  defaultVariants: {
    sticky: "mobileOnly",
    visible: "always",
  },
});
export type ToolbarVariantProps = VariantProps<typeof toolbarVariants>;

export const defaultContentEditableStyle =
  "p8n-editor-input border-custom-2 rounded-b-2xl border border-t-0 p-2 -outline-offset-2";

export const chatContentEditableStyle =
  "p8n-editor-input border-custom-2 rounded-2xl border px-2 py-1 -outline-offset-2 lg:py-2 lg:border-t-0 lg:rounded-t-none";

export const contentEditableStyles = {
  normal: "p8n-editor-input border-custom-2 rounded-b-2xl border border-t-0 p-2 -outline-offset-2",
  withoutToolbarOnMobile:
    "p8n-editor-input border-custom-2 rounded-2xl border px-2 py-1 -outline-offset-2 lg:py-2 lg:border-t-0 lg:rounded-t-none",
};
