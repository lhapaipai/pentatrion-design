import { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { Field } from "./Field";
import { Toggle } from "../input/Toggle";
import { Checkbox } from "../input/Checkbox";
import { Radio } from "../input/Radio";
import { Input } from "../input";

const meta = {
  title: "Components/Form/Field",
  component: Field,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Field>;
export default meta;

export const Playbook = () => {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("Your label");
  const [hint, setHint] = useState("Any hint related to input field");
  const [placeholder, setPlaceholder] = useState("Ex: Fernando");
  const [description, setDescription] = useState("");
  const [footerDescription, setFooterDescription] = useState("");
  const [warning, setWarning] = useState("");
  const [errors, setErrors] = useState("");

  return (
    <>
      <div className="dark:shadow-dark mb-12 rounded-2xl p-12 shadow-md">
        <Field
          label={label}
          hint={hint}
          description={description}
          warning={warning}
          errors={errors}
          footerDescription={footerDescription}
        >
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Label">
          <Input
            placeholder="What is your name ?"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Field>
        <Field label="Hint">
          <Input placeholder="One hint ?" value={hint} onChange={(e) => setHint(e.target.value)} />
        </Field>
        <Field label="Placeholder">
          <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
        </Field>
        <Field label="Description">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Footer Description">
          <Input value={footerDescription} onChange={(e) => setFooterDescription(e.target.value)} />
        </Field>
        <Field label="Warning">
          <Input
            placeholder="warning message"
            value={warning}
            onChange={(e) => setWarning(e.target.value)}
          />
        </Field>
        <Field label="Errors">
          <Input
            placeholder="Errors message"
            value={errors}
            onChange={(e) => setErrors(e.target.value)}
          />
        </Field>
      </div>
    </>
  );
};

export const Context = () => {
  const [name, setName] = useState("");
  const [isAgree, setIsAgree] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="What is your name"
        hint="Any hint related to input field"
        description="Description message at the top of the field"
      >
        <Input placeholder="Ex: Fernando" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field
        label="What is your name"
        hint="Any hint related to input field"
        description="Description message at the top of the field"
        errors="Input is required"
      >
        <Input placeholder="Ex: Fernando" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field
        label="What is your name"
        hint="Any hint related to input field"
        description="Description message at the top of the field"
        warning="Only your firstname"
      >
        <Input value={name} placeholder="Ex: Fernando" onChange={(e) => setName(e.target.value)} />
      </Field>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <Field
          label="What is your gender"
          hint="You don't have to answer"
          description="You still have to check a box"
        >
          <div>
            <Radio name="gender" value="male">
              Male
            </Radio>
            <Radio name="gender" value="female">
              Female
            </Radio>
            <Radio name="gender" value="undefined">
              I don't want to answer
            </Radio>
          </div>
        </Field>
        <Field
          label="What is your gender"
          hint="You don't have to answer"
          errors="This field is required"
          description="You still have to check a box"
        >
          <div>
            <Radio name="gender" value="male">
              Male
            </Radio>
            <Radio name="gender" value="female">
              Female
            </Radio>
            <Radio name="gender" value="undefined">
              I don't want to answer
            </Radio>
          </div>
        </Field>

        <Field
          label="What is your gender"
          hint="You don't have to answer"
          warning="Make your choice"
          description="You still have to check a box"
        >
          <div>
            <Radio name="gender" value="male">
              Male
            </Radio>
            <Radio name="gender" value="female">
              Female
            </Radio>
            <Radio name="gender" value="undefined">
              I don't want to answer
            </Radio>
          </div>
        </Field>
      </div>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <Field label="Gender" hint="One hint">
          <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)}>
            I agree
          </Checkbox>
        </Field>
        <Field label="Gender" hint="One hint" warning="Make your choice">
          <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)}>
            I agree
          </Checkbox>
        </Field>
        <Field label="Gender" hint="One hint" errors="This field is required">
          <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)}>
            I agree
          </Checkbox>
        </Field>
      </div>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <Field label="Label" hint="">
          <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)}>
            Enabled
          </Toggle>
        </Field>
        <Field label="Label" hint="One hint" warning="Make your choice">
          <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)}>
            Enabled
          </Toggle>
        </Field>
        <Field label="Label" hint="One hint" errors="This field is required">
          <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)}>
            Enabled
          </Toggle>
        </Field>
      </div>
      <pre>
        name: {name}
        <br />
        agree: {isAgree ? "True" : "False"}
        <br />
        enabled: {isEnabled ? "True" : "False"}
      </pre>
    </div>
  );
};
