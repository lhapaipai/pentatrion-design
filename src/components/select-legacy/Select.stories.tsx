import { Meta } from "@storybook/react-vite";

import { useState } from "react";

import { action } from "storybook/actions";

import { SelectValue, SelectLegacy } from "./Select";
import {
  SelectOptionComponent,
  SelectSelectionComponent,
  StarOption,
  departments,
  options,
  townsByDepartment,
} from "./_fixtures";

const onChangeAction = action("onChange");

const meta = {
  title: "Components/SelectLegacy",
  component: SelectLegacy,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof SelectLegacy>;
export default meta;

export const Basic = () => {
  const [value, setValue] = useState<SelectValue>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <div>UnControlled</div>
        <SelectLegacy
          searchable={false}
          defaultValue="aixenprovence"
          placeholder="Select your town..."
          options={options}
        ></SelectLegacy>
        <div>Controlled</div>
        <SelectLegacy
          searchable={false}
          placeholder="Select your town..."
          options={options}
          value={value}
          onChange={(o) => {
            onChangeAction(o);
            setValue(o.target.value);
          }}
        ></SelectLegacy>
      </div>
    </>
  );
};

export const Variants = () => {
  const [value, setValue] = useState<SelectValue>(null);
  return (
    <div className="grid grid-cols-1 gap-2">
      <SelectLegacy
        searchable={false}
        placeholder="Select your town..."
        options={options}
        value={value}
        onChange={(o) => {
          onChangeAction(o);
          setValue(o.target.value);
        }}
      ></SelectLegacy>
      <SelectLegacy
        variant="ghost"
        searchable={false}
        placeholder="Select your town..."
        options={options}
        value={value}
        onChange={(o) => {
          onChangeAction(o);
          setValue(o.target.value);
        }}
      ></SelectLegacy>
      <SelectLegacy
        placeholder="Select your town..."
        options={options}
        disabled={true}
        value={"aixenprovence"}
        onChange={(o) => {
          onChangeAction(o);
          setValue(o.target.value);
        }}
      ></SelectLegacy>

      <SelectLegacy
        placeholder="Select your town..."
        options={options}
        size="large"
        dialogClassName="[--h-input:48px] rounded-[calc(var(--h-input)/2)]"
        value={value}
        onChange={(o) => {
          onChangeAction(o);
          setValue(o.target.value);
        }}
      ></SelectLegacy>

      <SelectLegacy
        placeholder="Select your town..."
        options={options}
        size="custom"
        selectionClassName="[--h-input:128px] h-(--h-input)"
        dialogClassName="[--h-input:128px] rounded-[calc(var(--h-input)/2)]"
        value={value}
        onChange={(o) => {
          onChangeAction(o);
          setValue(o.target.value);
        }}
      ></SelectLegacy>
    </div>
  );
};

export const NotRequired = () => {
  const [value, setValue] = useState<SelectValue>(null);
  return (
    <SelectLegacy
      required={false}
      placeholder="Select your town..."
      options={options}
      value={value}
      onChange={(o) => {
        onChangeAction(o);
        setValue(o.target.value);
      }}
    ></SelectLegacy>
  );
};

export const Searchable = () => {
  const [value, setValue] = useState<SelectValue>(null);
  return (
    <SelectLegacy
      searchable={true}
      placeholder="Select your town..."
      options={options}
      value={value}
      onChange={(o) => {
        onChangeAction(o);
        setValue(o.target.value);
      }}
    ></SelectLegacy>
  );
};

function isDepartment(
  department: number | string | null | readonly string[],
): department is "38" | "73" | "74" {
  return department !== null && ["38", "73", "74"].indexOf(department.toString()) !== -1;
}

export const Dynamic = () => {
  const [town, setTown] = useState<SelectValue>(null);
  const [department, setDepartment] = useState<SelectValue>(null);
  return (
    <>
      <div className="flex flex-col gap-2">
        <SelectLegacy
          required={false}
          placeholder="Select your department..."
          options={departments}
          value={department}
          onChange={(o) => {
            onChangeAction(o);
            setDepartment(o.target.value);
            setTown(null);
          }}
        ></SelectLegacy>
        {isDepartment(department) && (
          <SelectLegacy
            required={false}
            placeholder="Select your town..."
            options={townsByDepartment[department] ?? []}
            value={town}
            onChange={(o) => {
              onChangeAction(o);
              setTown(o.target.value);
            }}
          ></SelectLegacy>
        )}
      </div>
    </>
  );
};

const stars: StarOption[] = [
  { value: 0, label: "Empty", icon: "fe-star-empty" },
  { value: 1, label: "Half", icon: "fe-star-half" },
  { value: 2, label: "Fill", icon: "fe-star" },
];

// @ts-ignore
export const CustomRenderer = ({ disabled, searchable, showArrow }) => {
  const [value, setValue] = useState<SelectValue>(1);
  return (
    <>
      <SelectLegacy
        disabled={disabled}
        showArrow={showArrow}
        selectionClassName="ml-auto"
        width="37px"
        placement="bottom-end"
        searchable={searchable}
        options={stars}
        value={value}
        onChange={(o) => {
          onChangeAction(o);
          setValue(o.target.value);
        }}
        selectSelectionComponent={SelectSelectionComponent}
        selectOptionComponent={SelectOptionComponent}
      ></SelectLegacy>
    </>
  );
};

CustomRenderer.args = {
  disabled: false,
  searchable: false,
  showArrow: false,
};
