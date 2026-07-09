import { action } from "storybook/actions";
import { z } from "zod/v4-mini";

import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { coerceFormValue } from "@conform-to/zod/v4/future";
import { DateField } from "./DateField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/form/DateField",
  component: DateField,
} satisfies Meta<typeof DateField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    birthday: z.date(),
  }),
);

const defaultValue = {
  birthday: new Date("2002-02-28T13:00:00Z"),
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
    serialize(value, context) {
      if (context.name === "birthday") {
        return value instanceof Date ? value.toISOString() : value?.toString();
      }
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) => isDirty(formData, { defaultValue, serialize: form.context.serialize }) ?? false,
  );
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.birthday.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <DateField name={fields.birthday.name} />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-xs w-64 rounded-xl mt-4 p-2">
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
