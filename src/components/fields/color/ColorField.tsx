import { useField, useControl, type FieldName } from "@conform-to/react/future";
import { Field, type FieldProps } from "../field/Field";
import { Color } from "./Color";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader } from "../../modal";
import { useState } from "react";
import { Button } from "../../button/Button";
import { RawColorGrid } from "../../color/RawColorGrid";
import { useTranslate } from "../../i18n";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  name: FieldName<string | null | undefined>;
  allowInherit?: boolean;
}

export function ColorField({ name, id: forcedId, allowInherit = false, ...rest }: Props) {
  const t = useTranslate();

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
    control.change(null);
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
          label={control.value ? undefined : (t?.("form.values.color.inherit") ?? "Par défaut")}
        />
      </Field>
      <Modal
        open={tempValue !== null}
        /* There is not Modal trigger, onOpen is called only by
         * FloatingOverlay to close the modal */
        onOpen={(modalKeepOpen) => !modalKeepOpen && setTempValue(null)}
      >
        <ModalContent className="max-w-190 overflow-auto" zClassName="z-modal-overlay">
          <ModalHeader>{t?.("form.label.pickYourColor") ?? "Choisissez votre couleur"}</ModalHeader>
          <ModalDescription className="max-h-[calc(100lvh-6.5rem)]" scrollable={true}>
            <RawColorGrid value={tempValue} onChange={handleSelectAndSubmit} />
          </ModalDescription>
          <ModalFooter className="mt-2">
            <div className="flex justify-between">
              <Button type="button" variant="text" color="gray" onClick={() => setTempValue(null)}>
                {t?.("button.cancel") ?? "Annuler"}
              </Button>
              {allowInherit && (
                <Button
                  icon
                  type="button"
                  variant="outlined"
                  color="gray"
                  onClick={handleSubmitInherit}
                >
                  <i className="fe-settings"></i>
                  <span>{t?.("form.values.color.inherit") ?? "Par défaut"}</span>
                </Button>
              )}
              <Button type="button" color="yellow" onClick={handleSubmit}>
                {t?.("button.validate") ?? "Valider"}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
