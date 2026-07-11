import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { RadiosWithLegendField, RadioWithLegendOption } from "./RadioWithLegendField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/fields/RadioWithLegendField",
  component: RadiosWithLegendField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof RadiosWithLegendField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  profile: z.enum(["musician", "listener"]),
});

const userProfileOptions = [
  {
    label: "Musicien",
    value: "musician",
    children: (
      <span
        data-radio="legend"
        className="border-gray-1 bg-gray-0/40 flex-center inline-flex h-28 flex-col gap-2 rounded-sm border p-2"
      >
        <span className="border-gray-0 flex-center bg-gray-1 aspect-square w-16 border shadow-sm">
          <i className="fe-music text-body-2xl"></i>
        </span>
      </span>
    ),
  },
  {
    label: "Mélomane",
    value: "listener",
    children: (
      <span
        data-radio="legend"
        className="border-gray-1 bg-gray-0/40 flex-center inline-flex h-28 flex-col gap-2 rounded-sm border p-2"
      >
        <span className="border-gray-0 flex-center bg-gray-1 aspect-square w-16 border shadow-sm">
          <i className="fe-headphones text-body-2xl"></i>
        </span>
      </span>
    ),
  },
] as const satisfies RadioWithLegendOption[];

const defaultValue = {
  profile: "musician",
};

export const WithConform = () => {
  const { form, fields } = useForm(formSchema, {
    defaultValue,
    onSubmit(event, ctx) {
      event.preventDefault();
      onChangeAction(ctx.value);
    },
  });

  const dirty = useFormData(form.id, (formData) => isDirty(formData, { defaultValue }) ?? false);
  const value = useFormData(form.id, (formData) =>
    getFieldValue(formData, fields.profile.name, { type: "string" }),
  );
  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <RadiosWithLegendField
            label="Your profile"
            name={fields.profile.name}
            options={userProfileOptions}
            className="flex gap-4"
          />

          <Button>Valider</Button>
        </form>
      </FormProvider>
      <div className="shadow-xs w-32 rounded-xl mt-4 p-2">
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
