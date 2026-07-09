import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { WysiwygField } from "./WysiwygField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { coerceFormValue } from "@conform-to/zod/v4/future";

const meta = {
  title: "Components/fields/WysiwygField",
  component: WysiwygField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof WysiwygField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    content: z._default(z.string(), ""),
  }),
);

const defaultValue = {
  content: "<p>Hello <strong>world</strong>!</p>",
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
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.content.name, { type: "string", optional: true }),
  );

  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <WysiwygField label="Contenu" name={fields.content.name} lazyOnChange={300} />

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
          <dd className="break-all">{JSON.stringify(value)}</dd>
        </dl>
      </div>
    </>
  );
};
