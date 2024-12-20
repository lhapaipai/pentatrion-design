import { Meta, StoryObj } from "@storybook/react";
import { ChangeEvent, useState } from "react";
import { InputField } from "./InputField";
import { Toggle } from "../input/Toggle";
import { Checkbox } from "../input/Checkbox";
import { Radio } from "../input/Radio";
import { Input } from "../input";

const meta = {
  title: "Components/Form/InputField",
  component: InputField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof InputField>;
export default meta;

type Story = StoryObj<typeof InputField>;

export const Basic: Story = {
  args: {
    label: "Nom",
    hint: "Votre nom complet",
    description: "Nom + Prénom",
    errors: false,
    warning: false,
    children: <Input />,
  },
};

export const Simple = () => {
  const [label, setLabel] = useState("Your label");
  return (
    <InputField label="Label" errors="il y a une erreur !">
      <Input
        placeholder="What is your name ?"
        value={label}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
      />
    </InputField>
  );
};

export const Playbook = () => {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("Your label");
  const [hint, setHint] = useState("Any hint related to input field");
  const [placeholder, setPlaceholder] = useState("Ex: Fernando");
  const [description, setDescription] = useState("Description message at the top of the field");
  const [warning, setWarning] = useState("");
  const [errors, setErrors] = useState("");

  return (
    <>
      <div className="mb-12 rounded-2xl p-12 shadow-md dark:shadow-dark">
        <InputField
          label={label}
          hint={hint}
          description={description}
          warning={warning}
          errors={errors}
        >
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Label">
          <Input
            placeholder="What is your name ?"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </InputField>
        <InputField label="Hint">
          <Input placeholder="One hint ?" value={hint} onChange={(e) => setHint(e.target.value)} />
        </InputField>
        <InputField label="Placeholder">
          <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
        </InputField>
        <InputField label="Help">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </InputField>
        <InputField label="Warning">
          <Input
            placeholder="warning message"
            value={warning}
            onChange={(e) => setWarning(e.target.value)}
          />
        </InputField>
        <InputField label="Errors">
          <Input
            placeholder="Errors message"
            value={errors}
            onChange={(e) => setErrors(e.target.value)}
          />
        </InputField>
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
      <InputField
        label="What is your name"
        hint="Any hint related to input field"
        description="Description message at the top of the field"
      >
        <Input placeholder="Ex: Fernando" value={name} onChange={(e) => setName(e.target.value)} />
      </InputField>
      <InputField
        label="What is your name"
        hint="Any hint related to input field"
        description="Description message at the top of the field"
        errors="Input is required"
      >
        <Input placeholder="Ex: Fernando" value={name} onChange={(e) => setName(e.target.value)} />
      </InputField>
      <InputField
        label="What is your name"
        hint="Any hint related to input field"
        description="Description message at the top of the field"
        warning="Only your firstname"
      >
        <Input value={name} placeholder="Ex: Fernando" onChange={(e) => setName(e.target.value)} />
      </InputField>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <InputField
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
        </InputField>
        <InputField
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
        </InputField>

        <InputField
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
        </InputField>
      </div>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <InputField label="Gender" hint="One hint">
          <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)}>
            I agree
          </Checkbox>
        </InputField>
        <InputField label="Gender" hint="One hint" warning="Make your choice">
          <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)}>
            I agree
          </Checkbox>
        </InputField>
        <InputField label="Gender" hint="One hint" errors="This field is required">
          <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)}>
            I agree
          </Checkbox>
        </InputField>
      </div>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <InputField label="Label" hint="">
          <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)}>
            Enabled
          </Toggle>
        </InputField>
        <InputField label="Label" hint="One hint" warning="Make your choice">
          <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)}>
            Enabled
          </Toggle>
        </InputField>
        <InputField label="Label" hint="One hint" errors="This field is required">
          <Toggle checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)}>
            Enabled
          </Toggle>
        </InputField>
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
