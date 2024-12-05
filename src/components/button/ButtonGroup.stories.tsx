import { ThemeColor } from "../../types";
import { Meta } from "@storybook/react";
import { useState } from "react";

import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof ButtonGroup>;
export default meta;

const buttonLabels = ["one", "two", "three"];
const colors: ThemeColor[] = ["yellow", "gray", "blue", "red"];
const variants = ["contained", "light", "outlined", "text"] as const;
const directions = ["horizontal", "vertical"] as const;

export const Context = () => {
  const [val, setVal] = useState("one");
  return (
    <div className="grid grid-cols-1 gap-8">
      <div>selection : {val}</div>
      {directions.map((direction) => (
        <div className="flex flex-col gap-4">
          {variants.map((variant) => (
            <div key={variant} className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              {colors.map((color) => (
                <ButtonGroup key={color} direction={direction}>
                  {buttonLabels.map((label) => (
                    <Button
                      variant={variant}
                      color={color}
                      key={label}
                      selected={val === label}
                      onClick={() => setVal(label)}
                    >
                      {label}
                    </Button>
                  ))}
                </ButtonGroup>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
