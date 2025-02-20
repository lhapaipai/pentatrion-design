import { ChangeEvent, Fragment, KeyboardEvent, RefObject, useEffect, useMemo, useRef } from "react";
import { Input } from "./Input";
import clsx from "clsx";

interface TotpInputProps {
  value: string;
  length: number;
  onValue: (value: string) => void;
  type?: "number" | "alphabet";
  autoFocus?: boolean;
  autoComplete?: "one-time-code";
}

const space = " ";

const getIsValidValue = (value: string, type: TotpInputProps["type"]) => {
  if (type === "number") {
    return /[0-9]/.test(value);
  }
  return /[0-9A-Za-z]/.test(value);
};

export function TotpInput({
  value = "",
  length,
  onValue,
  type = "alphabet",
  autoFocus,
}: TotpInputProps) {
  const list = useMemo(() => Array.from({ length }), [length]);
  const splitValues = value.split("");
  const values = list.map((_, i) => {
    // TODO different from [i]?.[0] vs [i]
    const value = splitValues[i] || space;
    if (!getIsValidValue(value, type)) {
      return space;
    }
    return value;
  });

  const refArray = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => {
    const el = refArray.current?.[i];
    el?.focus?.();
  };

  useEffect(() => {
    if (refArray.current.length !== list.length) {
      refArray.current = refArray.current.slice(0, list.length);
    }
  }, [list.length]);

  const handleMultipleValues = (multipleValues: string, i: number) => {
    const result = multipleValues
      .slice(0, list.length - i)
      .split("")
      .filter((pastedValue) => {
        const value = pastedValue[0];
        return getIsValidValue(value, type);
      });
    if (!result.length) {
      return;
    }
    const newValues = [...values];
    newValues.splice(i, result.length, ...result);
    focus(Math.min(i + result.length, length - 1));
    onValue(newValues.join(""));
  };

  const focusIndex = Math.min(value.trim().length, length - 1);

  return (
    <div className="flex flex-nowrap gap-2">
      {list.map((_, i) => {
        // trim only for replacing ' ' with ''
        const value = values[i].trim();
        const isValidValue = getIsValidValue(value, type);
        return (
          <Fragment key={i}>
            <Input
              size="custom"
              autoFocus={i === focusIndex ? autoFocus : undefined}
              type={type === "number" ? "tel" : "text"}
              inputMode={type === "number" ? "numeric" : undefined}
              className={clsx("h-(--h-input) w-18 shrink-0 p-0 [--h-input:72px]")}
              inputClassName="text-center text-body-3xl"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              ref={(ref) => {
                refArray.current[i] = ref;
              }}
              value={value}
              onFocus={(event) => {
                event.currentTarget.select();
              }}
              onPaste={(event) => {
                handleMultipleValues(event.clipboardData?.getData("text/plain") || "", i);
                event.preventDefault();
              }}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                switch (event.key) {
                  case "ArrowLeft":
                    event.preventDefault();
                    focus(i - 1);
                    break;
                  case "ArrowRight":
                    event.preventDefault();
                    focus(i + 1);
                    break;
                  case "Backspace": {
                    // onChange doesn't trigger on empty values, or when backspacing the left-most selection
                    const targetIndex = i - 1;
                    if (
                      targetIndex >= 0 &&
                      (event.currentTarget.selectionStart !== 0 ||
                        event.currentTarget.selectionEnd !== 0)
                    ) {
                      return;
                    }
                    event.preventDefault();
                    const newValues = [...values];
                    newValues[targetIndex] = space;
                    focus(targetIndex);
                    onValue(newValues.join(""));
                    break;
                  }
                }
              }}
              onInput={(event: ChangeEvent<HTMLInputElement>) => {
                // onChange won't trigger if the values are the same
                if (event.target.value === value) {
                  focus(i + 1);
                }
              }}
              onChange={(event) => {
                if (event.target.value.length > 1) {
                  handleMultipleValues(event.target.value, i);
                  return;
                }
                const newValue = event.target.value.length === 1 ? event.target.value[0] : space;
                const isNewValueValid = getIsValidValue(newValue, type);
                if (!isNewValueValid && newValue !== space) {
                  return;
                }
                const removedValidValue = isValidValue && newValue === space;
                if (removedValidValue || isNewValueValid) {
                  const newValues = [...values];
                  newValues[i] = newValue;
                  if (isNewValueValid) {
                    focus(i + 1);
                  }
                  onValue(newValues.join(""));
                }
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
