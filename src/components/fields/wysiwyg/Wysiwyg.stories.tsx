import type { Meta, StoryObj } from "@storybook/react-vite";

import type { WysiwygRef } from "./Wysiwyg";
import { Wysiwyg } from "./Wysiwyg";
import { useRef, useState } from "react";
import { Button } from "../../button";
import type { LazyOnChangeArgs } from "./plugins/LazyOnChangePlugin";

const meta = {
  component: Wysiwyg,
  title: "Components/fields/Wysiwyg",
} satisfies Meta<typeof Wysiwyg>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Context: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render() {
    const initialHtml = "<p>Hello <b>World</b></p>";
    const wysiwygRef = useRef<WysiwygRef>(null!);

    const [html, setHtml] = useState(initialHtml);

    async function handleGetHtml() {
      const nextHtml = await wysiwygRef.current.getHtml();
      setHtml(nextHtml);
    }

    function handleChange({ html }: LazyOnChangeArgs) {
      setHtml(html);
    }

    function handleSetHtml() {
      wysiwygRef.current.setHtml("<p>Nouveau contenu...</p>");
    }

    return (
      <div className="storybook-bg yellow-squircle-smooth p-2 lg:p-4">
        {Array.from({ length: 1 }).map((_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam dignissimos illum
            consequuntur? Deleniti tempora accusantium, hic facilis necessitatibus ut nam rem dolore
            suscipit provident aliquid sint, iure architecto doloremque esse?
          </p>
        ))}

        <div className="flex gap-2 p-2">
          <Button type="button" onClick={handleGetHtml}>
            getHtml
          </Button>
          <Button type="button" onClick={handleSetHtml}>
            setHtml
          </Button>
        </div>
        <Wysiwyg
          ref={wysiwygRef}
          lazyOnChange={3000}
          onChange={handleChange}
          initialHtml={initialHtml}
          contentEditableClassName="min-h-36"
        />
        <code className="mt-4 p-2">
          <pre className="text-body-xs break-all whitespace-pre-wrap">{html}</pre>
        </code>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam dignissimos illum
            consequuntur? Deleniti tempora accusantium, hic facilis necessitatibus ut nam rem dolore
            suscipit provident aliquid sint, iure architecto doloremque esse?
          </p>
        ))}
      </div>
    );
  },
};
