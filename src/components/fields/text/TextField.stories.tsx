import { action } from "storybook/actions";
import { z } from "zod/v4-mini";

import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  parseSubmission,
} from "@conform-to/react/future";
import { coerceFormValue } from "@conform-to/zod/v4/future";
import { TextField } from "./TextField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/fields/Text",
  component: TextField,
} satisfies Meta<typeof TextField>;
export default meta;

const onChangeAction = action("onChange");
const onValidateAction = action("onValidate");

const formSchema = coerceFormValue(
  z.object({
    username: z._default(z.nullable(z.string()), null),
  }),
);

const defaultValue = {
  username: "lhapaipai",
};

const Playbook = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onValidate({ error, schemaValue }) {
      onValidateAction(schemaValue);
      return error;
    },
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
    shouldValidate: "onInput",
  });

  const dirty = useFormData(form.id, (formData) => isDirty(formData, { defaultValue }) ?? false);

  const value = useFormData(form.id, (formData) => {
    const submission = parseSubmission(formData);
    const result = formSchema.safeParse(submission.payload);
    return result.success ? result.data.username : undefined;
  });

  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <TextField label="Username" name={fields.username.name} placeholder="john.doe" />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-sm w-72 rounded-xl mt-4 p-2">
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

export { Playbook as TextField };
