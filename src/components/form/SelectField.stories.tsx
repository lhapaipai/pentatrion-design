import { Meta } from "@storybook/react";
import { ChangeEvent, useState } from "react";
import { SelectField } from "./SelectField";
import { options } from "../select/_fixtures";
import { InputField } from "./InputField";

const meta = {
  title: "Components/Form/SelectField",
  component: SelectField,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof SelectField>;
export default meta;

export const Playbook = () => {
  const [value, setValue] = useState<number | string | null>("");
  const [label, setLabel] = useState("Your label");
  const [hint, setHint] = useState("Any hint related to input field");
  const [placeholder, setPlaceholder] = useState("Select your Town");
  const [description, setDescription] = useState("Description message at the top of the field");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");

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
          error={error}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Label"
          placeholder="What is your name ?"
          value={label}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
        />
        <InputField
          label="Hint"
          placeholder="One hint ?"
          value={hint}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHint(e.target.value)}
        />
        <InputField
          label="Placeholder"
          value={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPlaceholder(e.target.value)}
        />
        <InputField
          label="Help"
          value={description}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        />
        <InputField
          label="Warning"
          placeholder="warning message"
          value={warning}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setWarning(e.target.value)}
        />
        <InputField
          label="Error"
          placeholder="Error message"
          value={error}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setError(e.target.value)}
        />
      </div>
      <div>
        Result = <pre className="inline-block">{JSON.stringify(value)}</pre>
      </div>
    </>
  );
};
