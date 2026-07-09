import { useField, type FieldName } from "@conform-to/react/future";
import { Altcha } from "./Altcha";
import { Field, FieldProps } from "../Field";
import { useIntersectionObserver } from "../../../hooks";

interface Props extends Omit<FieldProps, "errors" | "children"> {
  name: FieldName<string>;
  challengeUrl: string;
}

export function AltchaField({ name, challengeUrl, ...rest }: Props) {
  const field = useField(name);
  const { isIntersecting, ref: altchaContainerRef } = useIntersectionObserver({
    freezeOnceVisible: true,
  });

  return (
    <Field errors={field.errors} data-testid={field.name} {...rest}>
      <div ref={altchaContainerRef} className="h-6">
        {isIntersecting && <Altcha name={field.name} challengeUrl={challengeUrl} />}
      </div>
    </Field>
  );
}
