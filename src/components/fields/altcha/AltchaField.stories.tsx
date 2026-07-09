import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { AltchaField } from "./AltchaField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { coerceFormValue } from "@conform-to/zod/v4/future";

const meta = {
  title: "Components/fields/AltchaField",
  component: AltchaField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof AltchaField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    captcha: z._default(z.string(), ""),
  }),
);

const defaultValue = {
  captcha: "",
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
    getFieldValue(formData, fields.captcha.name, { type: "string", optional: true }),
  );
  console.log(value);
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <AltchaField
            label="Vérification"
            name={fields.captcha.name}
            challengeUrl="/altcha-challenge.json"
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
