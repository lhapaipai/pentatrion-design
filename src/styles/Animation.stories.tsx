import { useState } from "react";
import { Button } from "../components/button";
import { useIsClosing } from "../hooks";
import clsx from "clsx";
import { StoryFn } from "@storybook/react-vite";

export default {
  title: "Styles/Animation",
  // @ts-ignore
  decorators: [(Story: StoryFn) => <Story />],
};

export const Basic = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => setIsOpen((v) => !v)}>{isOpen ? "Masquer" : "Afficher"}</Button>
      </div>
      {isOpen && (
        <div className="flex-center motion-safe:animate-fade-in h-[300px] w-[300px] origin-top-left shadow-xl">
          Modal
        </div>
      )}
    </div>
  );
};

export const InOut = () => {
  const { isOpen, isClosing, setIsOpen } = useIsClosing(false);
  const classNames = clsx([
    "shadow-xl w-[300px] h-[300px]",
    "origin-top-left",
    "flex-center",
    isClosing ? "motion-safe:animate-fade-out" : "motion-safe:animate-fade-in",
  ]);

  return (
    <div>
      <div>
        <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Masquer" : "Afficher"}</Button>
      </div>
      {isOpen && <div className={classNames}>Modal</div>}
    </div>
  );
};
