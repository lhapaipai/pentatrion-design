import { ThemeColor } from "../../types";
import { Meta } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof ButtonGroup>;
export default meta;

const buttonLabels = ["A", "B", "C"];
const colors: ThemeColor[] = [
  "yellow",
  "yellow-alpha",
  "gray",
  "gray-alpha",
  "red",
  "orange",
  "green",
  "blue",
];
const variants = ["contained", "light", "outlined", "text"] as const;
const directions = ["horizontal", "vertical"] as const;

export const Context = () => {
  const [val, setVal] = useState("one");

  const result = (
    <div className="grid  grid-cols-1 gap-4">
      {directions.map((direction) => (
        <div className="flex flex-col gap-2" key={direction}>
          {variants.map((variant) => (
            <div key={variant} className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-8">
              {colors.map((color) => (
                <ButtonGroup key={color} direction={direction}>
                  {buttonLabels.map((label) => (
                    <Button
                      variant={variant}
                      color={color}
                      key={label}
                      selected={val === label}
                      onClick={() => setVal(label)}
                      width={direction === "vertical" ? "full" : "fit"}
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

  return (
    <div className="grid grid-cols-1 gap-8">
      <div>selection : {val}</div>

      <h3 className="sb-h3">with Melodineo bg</h3>
      <div className="bg-[url(/bg/yellow-squircle-smooth-80.webp)] bg-center">
        <div className="bg-[url(/bg/noise.png)]  p-2">{result}</div>
      </div>

      <h3 className="sb-h3">Default state</h3>
      {result}

      <h3 className="sb-h3">with Map</h3>
      <div className="bg-[url(/bg-map.jpg)] p-2">{result}</div>
    </div>
  );
};
