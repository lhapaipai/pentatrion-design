import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { CheckboxField } from "./CheckboxField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { coerceFormValue } from "@conform-to/zod/v4/future";

const meta = {
  title: "Components/form/CheckboxField",
  component: CheckboxField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof CheckboxField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    agree: z._default(z.boolean(), false),
  }),
);

const defaultValue = {
  agree: false,
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
      getFieldValue(formData, fields.agree.name, {
        type: "string",
        optional: true,
      }) === "on",
  );

  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <CheckboxField label="RGPD" name={fields.agree.name} checkboxLabel="I agree" />

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
