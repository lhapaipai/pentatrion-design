import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Color } from "./Color";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader } from "../../modal";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "../../button/Button";
import { colorByGroups } from "../../../lib/color";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<string | null | undefined>;
}

export function ColorField({ name, id: forcedId, ...rest }: Props) {
  const field = useField(name);
  const id = forcedId ?? field.id;

  const control = useControl({
    defaultValue: field.defaultValue,
  });

  const [tempValue, setTempValue] = useState<null | string>(null);

  function handleSelectAndSubmit(selectedValue: string) {
    control.change(selectedValue);
    setTempValue(null);
  }

  function handleSubmit() {
    if (tempValue) {
      control.change(tempValue);
    }
    setTempValue(null);
  }

  function handleSubmitInherit() {
    control.change("inherit");
    setTempValue(null);
  }

  return (
    <>
      <input
        hidden
        type="text"
        name={field.name}
        autoComplete="off"
        ref={control.register}
        defaultValue={field.defaultValue}
      />
      <Field id={id} errors={field.errors} data-testid={field.name} {...rest}>
        <Color
          type="button"
          value={control.value}
          onClick={() => setTempValue(control.value ?? "")}
          label={control.value === "inherit" ? "inherit" : undefined}
        />
      </Field>
      <Modal
        open={tempValue !== null}
        /* There is not Modal trigger, onOpen is called only by
         * FloatingOverlay to close the modal */
        onOpen={(modalKeepOpen) => !modalKeepOpen && setTempValue(null)}
      >
        <ModalContent
          className="my-4 max-h-[90vh] w-full max-w-[650px] overflow-auto"
          zClassName="z-[120]"
        >
          <ModalHeader>Choose your color</ModalHeader>
          <ModalDescription>
            <div className="grid-cols-repeat-fill-50 grid gap-1 text-center text-sm">
              {colorByGroups.map(({ name, colors }) => (
                <div key={name}>
                  <div className="text-body-xs truncate">{name}</div>
                  <div className="grid shadow">
                    {colors.map(([colorNumber, colorCode]) => (
                      <button
                        key={colorNumber}
                        className={clsx(
                          "cursor-pointer",
                          parseInt(colorNumber) > 600 ? "text-white" : "text-black",
                          "hover:z-20 hover:scale-125 hover:rounded hover:shadow active:scale-125",
                          tempValue === colorCode && "outline-yellow-5 z-10 rounded outline-2",
                        )}
                        style={{ backgroundColor: colorCode }}
                        onClick={() => handleSelectAndSubmit(colorCode)}
                      >
                        {colorNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ModalDescription>
          <ModalFooter className="mt-2">
            <div className="flex justify-between">
              <Button type="button" variant="text" color="gray" onClick={() => setTempValue(null)}>
                Cancel
              </Button>
              <Button
                icon
                type="button"
                variant="outlined"
                color="gray"
                onClick={handleSubmitInherit}
              >
                <i className="fe-settings"></i>
                <span>Inherit</span>
              </Button>
              <Button type="button" color="yellow" onClick={handleSubmit}>
                Validate
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
