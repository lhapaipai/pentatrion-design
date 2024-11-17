import { Meta } from "@storybook/react";
import { z } from "zod";
import { useForm, getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
import { Button } from "../button";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { Option } from "../select";

const meta = {
  title: "Components/Form",
} satisfies Meta;
export default meta;

const FormSchema = z.object({
  email: z.string().email(),
  gender: z.enum(["male", "female"]).optional(),
});

const options: Option[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const WithConform = () => {
  const [form, { email, gender }] = useForm({
    constraint: getZodConstraint(FormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: FormSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      console.log("submit", formData);
    },
  });
  return (
    /**
     * id, onSubmit, noValidate
     */
    <form method="post" {...getFormProps(form)} className="flex flex-col gap-2">
      {/**
       * required, id, name, form, aria-invalid, aria-describedby, type
       */}
      <InputField label="email" error={email.errors} {...getInputProps(email, { type: "email" })} />
      <SelectField
        label="gender"
        options={options}
        error={gender.errors}
        required={false}
        {...getSelectProps(gender)}
      />
      <div>
        <Button>Envoyer</Button>
      </div>
    </form>
  );
};
