import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import { SelectOption } from "../select/types";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { RadiosField, type RadioOption } from "./RadiosField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";
import { coerceFormValue } from "@conform-to/zod/v4/future";

const meta = {
  title: "Components/fields/Radio",
  component: RadiosField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof RadiosField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  color: z.enum(["red", "green", "blue"]),
});

const colorOptions: SelectOption[] = [
  { label: "red", value: "red" },
  { label: "Green", value: "green" },
  { label: "blue", value: "blue" },
  { label: "pink", value: "pink" },
];

const defaultValue: z.input<typeof formSchema> = {
  color: "red",
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
          <RadiosField
            label="Your favorite color"
            name={fields.color.name}
            options={colorOptions}
          />

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

const levelSchema = coerceFormValue(
  z.object({
    level: z._default(z.nullable(z.enum(["beginner", "intermediate", "advanced"])), null),
  }),
);

const levelOptions: RadioOption[] = [
  { label: "I'd rather not say", value: "" },
  {
    label: "Beginner",
    value: "beginner",
    description: "You are starting out or coming back after a break.",
  },
  {
    label: "Intermediate",
    value: "intermediate",
    description: "You can hold your part on songs you know and you grow by playing with others.",
  },
  {
    label: "Advanced",
    value: "advanced",
    description: "You have been playing for years and pick up new repertoire with ease.",
  },
];

const levelDefaultValue: z.input<typeof levelSchema> = {
  level: null,
};

const WithDescriptionPlaybook = () => {
  const { form, fields } = useForm(levelSchema, {
    defaultValue: levelDefaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
  });

  const dirty = useFormData(
    form.id,
    (formData) => isDirty(formData, { defaultValue: levelDefaultValue }) ?? false,
  );
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.level.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post" className="max-w-md">
          <RadiosField
            label="Your level"
            description="A rough guide, not an assessment."
            name={fields.level.name}
            options={levelOptions}
          />

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

export { Playbook as RadiosField, WithDescriptionPlaybook as RadiosFieldWithDescription };
