import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it } from "vitest";
import { SimpleAutocomplete } from "./SimpleAutocomplete";
import { Option } from "../select-legacy";

const options: Option[] = [
  { value: "agde", label: "Agde" },
  { value: "agen", label: "Agen" },
];

describe("<Autocomplete />", () => {
  it("should expose options directly inside the listbox", async () => {
    const user = userEvent.setup();
    render(<SimpleAutocomplete options={options} onChangeSelection={() => {}} />);

    const combobox = screen.getByRole("combobox");
    expect(combobox.tagName).toBe("INPUT");

    await user.type(combobox, "Ag");
    const listbox = await screen.findByRole("listbox");

    expect(within(listbox).queryByRole("dialog")).toBeNull();
    for (const option of within(listbox).getAllByRole("option")) {
      expect(
        option.parentElement?.closest('[role]:not([role="presentation"]):not([role="none"])'),
      ).toBe(listbox);
    }
  });
});
