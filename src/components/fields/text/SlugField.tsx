import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Input } from "./Input";
import { slugify } from "../../../lib/strUtil";
import type { ChangeEvent } from "react";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<string | null | undefined>;
  placeholder?: string;
}

export function SlugField({ name, id: forcedId, placeholder, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;
  const control = useControl({
    defaultValue: field.defaultValue,
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const slug = slugify(input.value, false, false);
    if (slug !== input.value) {
      // the cursor stays after the same characters once the text before it is slugified
      const cursor = input.selectionStart ?? input.value.length;
      const slugCursor = Math.min(
        slugify(input.value.slice(0, cursor), false, false).length,
        slug.length,
      );
      input.value = slug;
      input.setSelectionRange(slugCursor, slugCursor);
    }
    control.change(slug);
  }

  function handleBlur() {
    if (control.value) {
      control.change(slugify(control.value, false));
    }
    control.blur();
  }

  return (
    <>
      <input
        type="text"
        hidden
        name={field.name}
        ref={control.register}
        defaultValue={field.defaultValue}
      />
      <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
        <Input
          value={control.value ?? ""}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </Field>
    </>
  );
}
