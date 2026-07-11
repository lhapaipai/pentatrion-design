import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { TextareaField } from "./TextareaField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/fields/Textarea",
  component: TextareaField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof TextareaField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  description: z.string(),
});

const defaultValue = {
  description: "A short description",
};

const Playbook = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
  });

  const dirty = useFormData(form.id, (formData) => isDirty(formData, { defaultValue }) ?? false);
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.description.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <TextareaField label="Description" name={fields.description.name} />

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

export { Playbook as TextareaField };
