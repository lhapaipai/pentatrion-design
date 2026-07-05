import { Meta } from "@storybook/react-vite";

import { useState } from "react";

import { action } from "storybook/actions";

import { Select } from "./Select";
import { options } from "./_fixtures";
import { z } from "zod/v4-mini";
import { SelectOption } from "./types";
import { useForm, FormProvider } from "@conform-to/react/future";
import { SelectField } from "./SelectField";
import { Button } from "../button";

const onChangeAction = action("onChange");

const meta = {
  title: "Components/Select",
  component: Select,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Select>;
export default meta;

export const Basic = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <Select
          placeholder="Select your town..."
          options={options}
          value={value}
          onChange={(value) => {
            onChangeAction(value);
            setValue(value);
          }}
        ></Select>
      </div>
    </>
  );
};

const formSchema = z.object({
  color: z.enum(["red", "green", "blue"]),
});

const colorOptions: SelectOption[] = [
  { label: "red", value: "red" },
  { label: "Green", value: "green" },
  { label: "blue", value: "blue" },
  { label: "pink", value: "pink" },
];

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue: {
      color: "red",
    },
    onValidate(ctx) {
      console.log(ctx);
      return ctx.error;
    },
    onSubmit(event) {
      event.preventDefault();
      console.log("submit");
    },
  });

  return (
    <FormProvider context={form.context}>
      <form {...form.props} method="post">
        <SelectField name={fields.color.name} options={colorOptions} />

        <Button>Valider</Button>
      </form>
    </FormProvider>
  );
};
