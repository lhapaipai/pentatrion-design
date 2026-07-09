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
import { FileField, Media, mediaSchema } from "./FileField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/fields/FileField",
  component: FileField,
} satisfies Meta<typeof FileField>;
export default meta;

const onChangeAction = action("onChange");

const { coerceFormValue } = configureCoercion({
  customize(type) {
    if (type === mediaSchema) {
      return (value) => {
        if (value == null || value === "") {
          return undefined;
        }
        if (typeof value !== "string") {
          throw new Error("Expected a string value for media");
        }

        return JSON.parse(value);
      };
    }

    return null;
  },
});

const formSchema = coerceFormValue(
  z.object({
    avatar: z._default(z.nullable(mediaSchema), null),
  }),
);

const defaultValue = {
  avatar: null,
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onValidate({ error, schemaValue }) {
      console.log("onValidate", error, schemaValue);
      return error;
    },
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
    // appelé par conform chaque fois qu'une valeur typée doit être reconvertie en
    // string DOM : au montage / changement de defaultValue, sur form.reset(),
    // lors de la resync d'un lastResult serveur, et par isDirty() ci-dessous
    // pour comparer le defaultValue sérialisé au FormData courant.
    serialize(value, context) {
      if (context.name === "avatar") {
        return typeof value === "string" || value == null ? value : JSON.stringify(value);
      }

      return context.defaultSerialize(value);
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) => isDirty(formData, { defaultValue, serialize: form.context.serialize }) ?? false,
  );

  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.avatar.name, { type: "string", optional: true }),
  );

  return (
    <>
      <div className="max-w-lg">
        <FormProvider context={form.context}>
          <form {...form.props} method="post">
            <FileField name={fields.avatar.name as FieldName<Media | null>} />

            <Button>Valider</Button>
          </form>
        </FormProvider>
      </div>
      <div className="shadow-xs w-lg rounded-xl mt-4 p-2">
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
