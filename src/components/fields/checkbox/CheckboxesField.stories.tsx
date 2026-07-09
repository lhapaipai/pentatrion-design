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
import { CheckboxesField } from "./CheckboxesField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { coerceFormValue } from "@conform-to/zod/v4/future";

const meta = {
  title: "Components/form/CheckboxesField",
  component: CheckboxesField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof CheckboxesField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    colors: z.array(z.enum(["red", "green", "blue"])),
  }),
);

const colorOptions: SelectOption[] = [
  { label: "red", value: "red" },
  { label: "Green", value: "green" },
  { label: "blue", value: "blue" },
  { label: "pink", value: "pink" },
];

const defaultValue = {
  colors: ["red"],
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      console.log(ctx);
      onChangeAction(ctx.value);
    },
  });

  const dirty = useFormData(form.id, (formData) => isDirty(formData, { defaultValue }) ?? false);
  const value = useFormData(
    form.id,
    (formData) =>
      getFieldValue(formData, fields.colors.name, {
        type: "string",
        array: true,
        optional: true,
      }) ?? [],
  );

  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <CheckboxesField
            label="Your favorite colors"
            name={fields.colors.name}
            options={colorOptions}
          />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-xs w-72 rounded-xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>dirty</dt>
          <dd>{dirty ? "true" : "false"}</dd>
        </dl>
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd>{JSON.stringify(value)}</dd>
        </dl>
      </div>
    </>
  );
};
