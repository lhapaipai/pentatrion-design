import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import { SelectOption } from "../select/types";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { RadiosField } from "./RadiosField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/fields/RadiosField",
  component: RadiosField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof RadiosField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  color: z.enum(["red", "green", "blue"]),
});

const colorOptions: SelectOption[] = [
  { label: "red", value: "red" },
  { label: "Green", value: "green" },
  { label: "blue", value: "blue" },
  { label: "pink", value: "pink" },
];

const defaultValue = {
  color: "red",
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
  });

  const dirty = useFormData(form.id, (formData) => isDirty(formData, { defaultValue }) ?? false);
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.color.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <RadiosField
            label="Your favorite color"
            name={fields.color.name}
            options={colorOptions}
          />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-xs w-32 rounded-xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>dirty</dt>
          <dd>{dirty ? "true" : "false"}</dd>
        </dl>
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd>{value}</dd>
        </dl>
      </div>
    </>
  );
};
