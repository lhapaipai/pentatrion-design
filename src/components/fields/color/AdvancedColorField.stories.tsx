import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
  FieldName,
} from "@conform-to/react/future";
import { configureCoercion } from "@conform-to/zod/v4/future";
import { AdvancedColorField } from "./AdvancedColorField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { BrandPalette, Color, colorSchema, RawColor } from "../../color";

const meta = {
  title: "Components/fields/Color",
  component: AdvancedColorField,
} satisfies Meta<typeof AdvancedColorField>;
export default meta;

const onChangeAction = action("onChange");

function parseColorValue(payload: unknown) {
  if (payload == null || payload === "") {
    return undefined;
  }
  if (typeof payload !== "string") {
    throw new Error("color value must be a JSON string");
  }
  try {
    return JSON.parse(payload);
  } catch {
    // JSON corrompu (ex. donnée persistée avant une migration de schéma) : on dégrade
    // gracieusement vers "absent" plutôt que de faire planter le rendu du champ.
    return undefined;
  }
}

function serializeColorValue(value: unknown): string | null {
  return value == null ? null : typeof value === "string" ? value : JSON.stringify(value);
}

const { coerceFormValue } = configureCoercion({
  customize(type) {
    if (type === colorSchema) {
      return parseColorValue;
    }

    return null;
  },
});

const formSchema = coerceFormValue(
  z.object({
    color: z._default(z.nullable(colorSchema), null),
  }),
);

const defaultValue = {
  color: { type: "named", name: "primary", variant: 0 },
};

const samplePalette: BrandPalette = {
  primary: "#ffca0a",
  secondary: "#3b82f6",
  tertiary: "#ec4899",
  text: "#323232",
};

const refColor: RawColor = {
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
    // appelé par conform chaque fois qu'une valeur typée doit être reconvertie en
    // string DOM : au montage / changement de defaultValue, sur form.reset(),
    // lors de la resync d'un lastResult serveur, et par isDirty() ci-dessous
    // pour comparer le defaultValue sérialisé au FormData courant.
    serialize(value, context) {
      if (context.name === "color") {
        return serializeColorValue(value);
      }

      return context.defaultSerialize(value);
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) => isDirty(formData, { defaultValue, serialize: form.context.serialize }) ?? false,
  );

  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.color.name, { type: "string", optional: true }),
  );

  return (
    <>
      <div className="max-w-sm">
        <FormProvider context={form.context}>
          <form {...form.props} method="post">
            <AdvancedColorField
              label="Couleur"
              name={fields.color.name as FieldName<Color | null>}
              palette={samplePalette}
              refColor={refColor}
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

export { Playbook as AdvancedColorField };
