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
import { WysiwygField } from "./WysiwygField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { configureCoercion } from "@conform-to/zod/v4/future";
import { parseWysiwygValue, serializeWysiwygValue, wysiwygSchema, WysiwygValue } from "./types";
import { editorStateRichText } from "./_fixtures";

const meta = {
  title: "Components/fields/WysiwygField",
  component: WysiwygField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof WysiwygField>;
export default meta;

const storybookOnChange = action("onChange");

const { coerceFormValue } = configureCoercion({
  customize(type) {
    if (type === wysiwygSchema) {
      return parseWysiwygValue;
    }

    return null;
  },
});

const formSchema = coerceFormValue(
  z.object({
    description: wysiwygSchema,
  }),
);

const defaultValue = {
  description: {
    state: editorStateRichText,
  },
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onValidate({ error }) {
      // console.log("onValidate", error, schemaValue);
      return error;
    },
    onSubmit(event, ctx) {
      event.preventDefault();
      // console.log(ctx);
      storybookOnChange(ctx.value);
    },
    serialize(value, context) {
      if (context.name === "description") {
        return typeof value === "string" || value == null
          ? value
          : serializeWysiwygValue(value as WysiwygValue);
      }

      return context.defaultSerialize(value);
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) =>
      isDirty(formData, {
        defaultValue,
        serialize: form.context.serialize,
      }) ?? false,
  );

  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.description.name, { type: "string", optional: true }),
  );

  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <WysiwygField
            label="Contenu"
            name={fields.description.name as FieldName<WysiwygValue | undefined | null>}
            debounceChange={300}
          />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-xs rounded-xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>dirty</dt>
          <dd>{dirty ? "true" : "false"}</dd>
        </dl>
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd className="break-all">{value}</dd>
        </dl>
      </div>
    </>
  );
};
