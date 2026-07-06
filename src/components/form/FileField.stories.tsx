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
import { FileField, mediaSchema } from "./FileField";
import { Button } from "../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/form/FileField",
  component: FileField,
} satisfies Meta<typeof FileField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    avatar: z._default(z.nullable(mediaSchema), null),
  }),
);

const defaultValue = {
  avatar: undefined,
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
    serialize(value, context) {
      if (context.name === "avatar") {
        return typeof value === "object" ? JSON.stringify(value) : value?.toString();
      }
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) => isDirty(formData, { defaultValue, serialize: form.context.serialize }) ?? false,
  );
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.avatar.name, { type: "object", optional: true }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <FileField name={fields.avatar.name} />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-xs w-128 rounded-xl mt-4 p-2">
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
