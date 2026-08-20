import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { HexColorField } from "./HexColorField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { Color } from "../../color";

const meta = {
  title: "Components/fields/Color",
  component: HexColorField,
} satisfies Meta<typeof HexColorField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  color: z.string(),
});

const defaultValue = {
  color: "#ffca0a",
};

const refColor: Color = {
  type: "raw",
  hex: "#ffca0a",
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
    getFieldValue(formData, fields.color.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <HexColorField refColor={refColor} label="Color" name={fields.color.name} />

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
          <dd>{value}</dd>
        </dl>
      </div>
    </>
  );
};

export { Playbook as HexColorField };
