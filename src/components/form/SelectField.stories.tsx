import { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { SelectField } from "./SelectField";
import { options } from "../select/_fixtures";
import { InputField } from "./InputField";
import { Input } from "../input";
import { SelectValue } from "../select/Select";

const meta = {
  title: "Components/Form/SelectField",
  component: SelectField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof SelectField>;
export default meta;

export const Playbook = () => {
  const [value, setValue] = useState<SelectValue>("");
  const [label, setLabel] = useState("Your label");
  const [hint, setHint] = useState("Any hint related to input field");
  const [placeholder, setPlaceholder] = useState("Select your Town");
  const [description, setDescription] = useState("Description message at the top of the field");
  const [warning, setWarning] = useState("");
  const [errors, setErrors] = useState("");

  return (
    <>
      <div className="mb-12 rounded-2xl p-12 shadow-md dark:shadow-dark">
        <SelectField
          options={options}
          label={label}
          hint={hint}
          placeholder={placeholder}
          description={description}
          value={value}
          warning={warning}
          errors={errors}
          onChange={(e) => setValue(e.target.value)}
        />
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
      <div>
        Result = <pre className="inline-block">{JSON.stringify(value)}</pre>
      </div>
    </>
  );
};
