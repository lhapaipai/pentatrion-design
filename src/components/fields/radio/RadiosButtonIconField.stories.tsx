import { action } from "storybook/actions";
import { z } from "zod/v4-mini";
import {
  useForm,
  FormProvider,
  isDirty,
  useFormData,
  getFieldValue,
} from "@conform-to/react/future";
import { RadiosButtonIconField, type RadioButtonIconOption } from "./RadiosButtonIconField";
import { Button } from "../../button";
import { Meta } from "@storybook/react-vite";

const meta = {
  title: "Components/form/RadiosButtonIconField",
  component: RadiosButtonIconField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof RadiosButtonIconField>;
export default meta;

const onChangeAction = action("onChange");

const formSchema = z.object({
  view: z.enum(["grid", "list", "settings"]),
});

const viewOptions: RadioButtonIconOption[] = [
  { value: "grid", icon: "fe-raster", label: "Grid" },
  { value: "list", icon: "fe-sidebar-collapse", label: "List" },
  { value: "settings", icon: "fe-settings", label: "Settings" },
];

const defaultValue = {
  view: "grid",
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
    getFieldValue(formData, fields.view.name, { type: "string" }),
  );

  return (
    <>
      <FormProvider context={form.context}>
        <form {...form.props} method="post">
          <RadiosButtonIconField label="View mode" name={fields.view.name} options={viewOptions} />

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
