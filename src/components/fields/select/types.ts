export interface SelectOption<V extends string | number = string> {
  label: string;
  value: V;
  icon?: string;
}

export type SelectChangeEvent<V extends string | number = string> = {
  type: "select-one";
  name: string;
  value: V | null;
};

export interface SelectHandle {
  focus: () => void;
}
