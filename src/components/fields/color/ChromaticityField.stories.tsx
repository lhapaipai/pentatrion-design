import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { configureCoercion } from "@conform-to/zod/v4/future";
import { ChromaticityField } from "./ChromaticityField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { chromaticitySchema } from "../../color";

const meta = {
  title: "Components/fields/ChromaticityField",
  component: ChromaticityField,
} satisfies Meta<typeof ChromaticityField>;
export default meta;

const onChangeAction = action("onChange");

function parseChromaticityValue(payload: unknown) {
  if (payload == null || payload === "") {
    return undefined;
  }
  if (typeof payload !== "string") {
    throw new Error("chromaticity value must be a JSON string");
  }
  try {
    return JSON.parse(payload);
  } catch {
    return undefined;
  }
}

function serializeChromaticityValue(value: unknown): string | null {
  return value == null ? null : typeof value === "string" ? value : JSON.stringify(value);
}

const { coerceFormValue } = configureCoercion({
  customize(type) {
    if (type === chromaticitySchema) {
      return parseChromaticityValue;
    }

    return null;
  },
});

const formSchema = coerceFormValue(
  z.object({
    textChromaticity: z._default(z.nullable(chromaticitySchema), null),
  }),
);

const defaultValue = {
  textChromaticity: { hue: 67, chroma: 0.012 },
};

const Playbook = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
    serialize(value, context) {
      if (context.name === "textChromaticity") {
        return serializeChromaticityValue(value);
      }

      return context.defaultSerialize(value);
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) => isDirty(formData, { defaultValue, serialize: form.context.serialize }) ?? false,
  );

  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.textChromaticity.name, { type: "string", optional: true }),
  );

  return (
    <>
      <div className="max-w-sm">
        <FormProvider context={form.context}>
          <form {...form.props} method="post">
            <ChromaticityField
              label="Chromaticité du texte"
              name={fields.textChromaticity.name}
              allowInherit={true}
            />

            <Button>Valider</Button>
          </form>
        </FormProvider>
      </div>
      <div className="shadow-sm w-sm rounded-xl mt-4 p-2">
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

export { Playbook as ChromaticityField };
