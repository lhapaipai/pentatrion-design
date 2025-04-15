import { Meta, ReactRenderer } from "@storybook/react";
import { PartialStoryFn } from "@storybook/types";
import { useRef } from "react";
import { Button } from "../button/Button";
import { Toasts } from "./Toasts";
import { addToast, notifyError } from "./toastsManager";

const meta = {
  title: "Components/Toast",
  component: Toasts,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toasts />
      </>
    ),
  ] as ((story: PartialStoryFn<ReactRenderer, any>) => React.JSX.Element)[],
} satisfies Meta<typeof Toasts>;
export default meta;

export const Context = () => {
  const counter = useRef(0);
  function handleClick() {
    counter.current += 1;
    addToast(`Toast num. ${counter.current}`, {
      expiration: 5000,
    });
  }

  function throwError() {
    try {
      throw new Error("Custom error message");
    } catch (e) {
      notifyError(e);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <Button onClick={handleClick}>Show info toast</Button>
      <Button onClick={throwError}>Throw custom error</Button>
    </div>
  );
};
