import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { SlugField } from "./SlugField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/fields/Text",
  component: SlugField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof SlugField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  slug: z.string(),
});

const defaultValue = {
  slug: "my-first-article",
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
    getFieldValue(formData, fields.slug.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <SlugField label="Slug" name={fields.slug.name} />

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

export { Playbook as SlugField };
