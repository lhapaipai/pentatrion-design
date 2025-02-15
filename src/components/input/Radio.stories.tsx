import { Meta } from "@storybook/react";
import { Radio, RadioButton } from "./Radio";
import { buttonGroupVariants } from "../button/ButtonGroup";
import clsx from "clsx";

const meta = {
  title: "Components/Input/Radio",
  component: Radio,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Radio>;
export default meta;

const variants = ["contained", "light", "outlined", "text", "ghost"] as const;
const colors = ["yellow", "gray", "orange", "red", "green", "blue"] as const;
export const Basic = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        {colors.map((color) => (
          <div key={color}>
            <Radio color={color} name={`sport-${color}`} value="climbing">
              Climbing
            </Radio>
            <Radio color={color} name={`sport-${color}`} value="tennis">
              Tennis
            </Radio>
            <Radio color={color} name={`sport-${color}`} value="soccer">
              Soccer
            </Radio>
          </div>
        ))}
        <div className="flex gap-2">
          <Radio name="sport-flex" value="climbing">
            Climbing
          </Radio>
          <Radio name="sport-flex" value="tennis">
            Tennis
          </Radio>
          <Radio name="sport-flex" value="soccer">
            Soccer
          </Radio>
        </div>
      </div>

      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-4">
          <h3 className="text-body-md">Variant : {variant}</h3>
          <div className="grid grid-cols-2">
            <div
              className={clsx(
                "inline-flex w-fit gap-2",
                ["text", "ghost"].includes(variant) && "rounded-full shadow-sm",
              )}
            >
              <RadioButton name={`sport-${variant}-btn`} value="climbing" variant={variant}>
                Climbing
              </RadioButton>
              <RadioButton name={`sport-${variant}-btn`} value="tennis" variant={variant}>
                Tennis
              </RadioButton>
              <RadioButton name={`sport-${variant}-btn`} value="soccer" variant={variant}>
                Soccer
              </RadioButton>
            </div>
            <div
              className={clsx(
                "inline-flex w-fit",
                buttonGroupVariants(),
                ["text", "ghost"].includes(variant) && "rounded-full shadow-sm",
              )}
            >
              <RadioButton name={`sport-${variant}-btngrp`} value="climbing" variant={variant}>
                Climbing
              </RadioButton>
              <RadioButton name={`sport-${variant}-btngrp`} value="tennis" variant={variant}>
                Tennis
              </RadioButton>
              <RadioButton name={`sport-${variant}-btngrp`} value="soccer" variant={variant}>
                Soccer
              </RadioButton>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
