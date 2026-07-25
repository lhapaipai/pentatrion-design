import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { RangeField } from "./RangeField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { coerceFormValue } from "@conform-to/zod/v4/future";

const meta = {
  title: "Components/fields/Range",
  component: RangeField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof RangeField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = coerceFormValue(
  z.object({
    volume: z.number(),
  }),
);

const defaultValue = {
  volume: 30,
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
    getFieldValue(formData, fields.volume.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <RangeField label="Volume" name={fields.volume.name} min={0} max={100} step={1} />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-sm w-32 rounded-xl mt-4 p-2">
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

export { Playbook as RangeField };
