import { Meta } from "@storybook/react";
import { Radio, RadioButton, RadioWithLegend } from "./Radio";
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
      <div>
        <h3 className="text-body-md mt-8 font-medium">With preChildren</h3>
        <div className="grid-cols-repeat-fill-160 grid gap-x-2 lg:gap-x-4">
          <RadioWithLegend name="sport-flex" value="climbing" label="Climbing">
            <span className="text-body-4xl">
              <i className="fe-raster"></i>
            </span>
          </RadioWithLegend>
          <RadioWithLegend name="sport-flex" value="tennis" label="Tennis">
            <span className="block">
              <i className="fe-raster"></i>
            </span>
          </RadioWithLegend>
          <RadioWithLegend name="sport-flex" value="soccer" label="Soccer">
            <span className="block">
              <i className="fe-raster"></i>
            </span>
          </RadioWithLegend>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {colors.map((color) => (
          <div key={color}>
            <h3 className="text-body-md font-medium">{color}</h3>

            <div>
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
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-body-md mt-8 font-medium">Horizontal</h3>
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
          <h3 className="text-body-md mt-8 font-medium">Variant : {variant}</h3>
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
