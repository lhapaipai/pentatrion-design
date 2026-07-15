import type { Meta, StoryObj } from "@storybook/react-vite";

import { WysiwygReader } from "./WysiwygReader";
import { editorStateRichText } from "./_fixtures";

const meta = {
  component: WysiwygReader,
  title: "Components/fields/WysiwygReader",
} satisfies Meta<typeof WysiwygReader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FromState: Story = {
  args: {
    value: { state: editorStateRichText },
  },
};

export const FromHtml: Story = {
  args: {
    value: {
      html: "<h1>Welcome</h1><blockquote><p>Hello world</p></blockquote>",
      state: editorStateRichText,
    },
  },
};
