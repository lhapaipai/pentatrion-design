import type { Meta, StoryObj } from "@storybook/react-vite";

import type { WysiwygRef } from "./Wysiwyg";
import { Wysiwyg } from "./Wysiwyg";
import { useRef, useState } from "react";
import { Button } from "../../button";
import { action } from "storybook/actions";
import { WysiwygValue } from "./types";
import { editorStateRichText } from "./_fixtures";

const meta = {
  component: Wysiwyg,
  title: "Components/fields/Wysiwyg",
} satisfies Meta<typeof Wysiwyg>;

export default meta;

type Story = StoryObj<typeof meta>;

const storybookOnChange = action("handleChange");

export const Default: Story = {
  args: {},
};

export const Context: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render() {
    const wysiwygRef = useRef<WysiwygRef>(null!);

    const [description, setDescription] = useState({
      state: editorStateRichText,
    });

    async function handleGetValue() {
      const nextValue = await wysiwygRef.current.getValue();
      setDescription(nextValue);
    }

    function handleChange(value: WysiwygValue) {
      storybookOnChange(value);
      setDescription(value);
    }

    function handleSetHtml() {
      wysiwygRef.current.setHtml("<p>Nouveau contenu...</p>", true);
    }

    function handleClear() {
      wysiwygRef.current.clear(true);
    }

    return (
      <div className="storybook-bg yellow-squircle-smooth p-2 lg:p-4">
        <div className="flex gap-2 p-2">
          <Button type="button" onClick={handleGetValue}>
            getValue
          </Button>
          <Button type="button" onClick={handleSetHtml}>
            setHtml
          </Button>
          <Button type="button" onClick={handleClear}>
            clear
          </Button>
        </div>
        <Wysiwyg
          ref={wysiwygRef}
          debounceChange={3000}
          onChange={handleChange}
          defaultValue={description}
          contentEditableClassName="min-h-36"
        />
        <code className="mt-4 p-2">
          <pre className="text-body-xs break-all whitespace-pre-wrap">
            {JSON.stringify(description, undefined, 2)}
          </pre>
        </code>
      </div>
    );
  },
};
