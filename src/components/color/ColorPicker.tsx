import { Modal, ModalContent, ModalFooter } from "pentatrion-design/modal";
import { useState } from "react";
import { Field, FieldProps } from "pentatrion-design/fields/field";
import { PaletteSwatchGrid } from "./PaletteSwatchGrid";
import { Button } from "pentatrion-design/button";
import { ColorPreview } from "./ColorPreview";
import { Color, Palette } from "./config";
import { Tabs } from "pentatrion-design/tabs";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { inputConfig } from "pentatrion-design/fields/text";
import clsx from "clsx";
import { useTranslate } from "../i18n";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  palette?: Palette;
  value: Color;
  onChange: (value: Color) => void;
  variants?: number | number[];
  allowInherit?: boolean;
}

export function ColorPicker({
  palette,
  value,
  onChange,
  variants,
  id: forcedId,
  allowInherit = false,
  ...rest
}: Props) {
  const t = useTranslate();

  const [tempValue, setTempValue] = useState<null | Color>(null);
  const [tabId, setTabId] = useState<string | number>(
    value?.type === "custom" ? "custom" : "palette",
  );

  function handleSubmit() {
    if (tempValue) {
      onChange(tempValue);
    }
    setTempValue(null);
  }

  const tabs = [
    {
      id: "palette",
      title: t?.("common.colorPalette") ?? "Couleurs prédéfinies",
      content: (
        <PaletteSwatchGrid
          palette={palette}
          value={tempValue?.type === "palette" ? tempValue : null}
          onChange={(nextValue) => {
            setTempValue(null);
            onChange(nextValue);
          }}
        />
      ),
    },
    {
      id: "custom",
      title: t?.("common.colorCustom") ?? "Palette personnalisée",
      content: (
        <div className="p-2 flex flex-col gap-2 react-colorful-container">
          <HexColorPicker
            color={tempValue?.type === "custom" ? tempValue.value : undefined}
            onChange={(value) => {
              setTempValue({ type: "custom", value });
            }}
          />
          <div
            data-color="yellow"
            data-variant="normal"
            className={clsx(inputConfig.container, "px-2")}
          >
            <HexColorInput
              className={inputConfig.input}
              prefixed={true}
              color={tempValue?.type === "custom" ? tempValue.value : undefined}
              onChange={(value) => setTempValue({ type: "custom", value })}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Field {...rest}>
        <ColorPreview
          type="button"
          palette={palette}
          color={value}
          onClick={() => setTempValue(value ?? "")}
        />
      </Field>
      <Modal
        open={tempValue !== null}
        /* There is not Modal trigger, onOpen is called only by
         * FloatingOverlay to close the modal */
        onOpen={(modalKeepOpen) => !modalKeepOpen && setTempValue(null)}
      >
        <ModalContent className="max-w-84 overflow-auto" zClassName="z-modal-overlay">
          <div className="max-h-72">
            <Tabs tabs={tabs} value={tabId} onChange={setTabId} contentClassName="min-h-[260px]">
              <Button icon variant="text" color="gray" onClick={() => setTempValue(null)}>
                <i className="fe-cancel"></i>
              </Button>
            </Tabs>
          </div>

          <ModalFooter className="mt-2">
            <div className="flex justify-between">
              <Button type="button" variant="text" color="gray" onClick={() => setTempValue(null)}>
                {t?.("button.cancel") ?? "Annuler"}
              </Button>
              {allowInherit && (
                <Button icon type="button" variant="outlined" color="gray" onClick={handleSubmit}>
                  <i className="fe-settings"></i>
                  <span>{t?.("form.values.color.inherit") ?? "Par défault"}</span>
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
