import { getFieldValue, useField, useFormData, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../Field";
import { Input } from "./Input";
import { Button } from "../../button";
import { useState } from "react";
import { getPasswordStrength, gradientVariantFromScore } from "../../../lib/pass-checker";
import clsx from "clsx";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<string | undefined | null>;
  showScore?: boolean;
}

export function PasswordField({ name, showScore = false, ...rest }: Props) {
  const field = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const value = useFormData(field.formId, (formData) =>
    getFieldValue(formData, field.name, { type: "string" }),
  );

  const passwordScore = getPasswordStrength(value);

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
      <Input
        className="relative overflow-hidden"
        suffix={
          <Button
            size="input"
            type="button"
            withRipple={true}
            icon
            variant="ghost"
            color="gray"
            onClick={() => setShowPassword((s) => !s)}
          >
            <i className={showPassword ? "fe-eye" : "fe-eye-closed"}></i>
          </Button>
        }
        defaultValue={field.defaultValue}
        name={field.name}
        type={showPassword ? "text" : "password"}
      >
        {showScore && (
          <div
            className="absolute bottom-0 left-0 h-[3px] overflow-hidden"
            style={{ width: `${passwordScore * 20}%` }}
          >
            <div
              className={clsx(
                "absolute right-0 -bottom-px left-0 h-[3px] rounded-xs bg-linear-to-r",
                gradientVariantFromScore(passwordScore),
              )}
            ></div>
          </div>
        )}
      </Input>
    </Field>
  );
}
