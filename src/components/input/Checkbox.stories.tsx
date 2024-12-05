import { Meta } from "@storybook/react";
import { useState } from "react";
import { Checkbox, CheckboxButton } from "./Checkbox";

const meta = {
  title: "Components/Input/Checkbox",
  component: Checkbox,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Checkbox>;
export default meta;

const variants = ["contained", "light", "outlined", "text", "ghost"] as const;

export const Basic = () => (
  <div>
    <Checkbox>I agree</Checkbox>
    <Checkbox color="gray">I agree</Checkbox>
    <Checkbox color="red">I agree</Checkbox>
    <Checkbox color="orange">I agree</Checkbox>
    <Checkbox color="blue">I agree</Checkbox>
    <Checkbox color="green">I agree</Checkbox>

    <h3 className="mb-4 mt-8 text-body-md">Checkbox button</h3>

    {variants.map((variant) => (
      <div key={variant} className="mb-2 flex gap-2">
        <CheckboxButton variant={variant}>I agree</CheckboxButton>
        <CheckboxButton variant={variant} color="gray">
          I agree
        </CheckboxButton>
        <CheckboxButton variant={variant} color="red">
          I agree
        </CheckboxButton>
        <CheckboxButton variant={variant} color="orange">
          I agree
        </CheckboxButton>
        <CheckboxButton variant={variant} color="blue">
          I agree
        </CheckboxButton>
        <CheckboxButton variant={variant} color="green">
          I agree
        </CheckboxButton>
      </div>
    ))}
  </div>
);

export const Controlled = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
      Checkbox value : {checked ? "True" : "False"}
    </Checkbox>
  );
};

export const WithIndeterminate = () => {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  function handleChange() {
    if (checked && !indeterminate) {
      setIndeterminate(true);
      setChecked(false);
    } else if (!checked && indeterminate) {
      setIndeterminate(false);
    } else {
      setChecked((checked) => !checked);
    }
  }

  return (
    <Checkbox checked={checked} indeterminate={indeterminate} onChange={handleChange}>
      Checkbox value : {checked ? "True" : "False"}, Indeterminate value :{" "}
      {indeterminate ? "True" : "False"}
    </Checkbox>
  );
};
