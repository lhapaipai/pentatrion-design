import { Modal, ModalContent, ModalFooter } from "pentatrion-design/modal";
import { useState } from "react";
import { Field, FieldProps } from "pentatrion-design/fields/field";
import { NamedColorGrid } from "./NamedColorGrid";
import { Button } from "pentatrion-design/button";
import { ColorPreview } from "./ColorPreview";
import { Color, ColorTheme } from "./config";
import { Tabs } from "pentatrion-design/tabs";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { inputConfig } from "pentatrion-design/fields/text";
import clsx from "clsx";
import { useTranslate } from "../i18n";
import { RawColorGrid } from "./RawColorGrid";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  palette?: ColorTheme;
  value: Color;
  onChange: (value: Color) => void;
  allowInherit?: boolean;
}

export function ColorPicker({ palette, value, onChange, allowInherit = false, ...rest }: Props) {
  const t = useTranslate();

  const [tempValue, setTempValue] = useState<null | Color>(null);
  const [tabId, setTabId] = useState<string | number>(
    value?.type === "raw" ? "custom" : "palette",
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
        <NamedColorGrid
          palette={palette}
          value={tempValue?.type === "named" ? tempValue : null}
          onChange={(nextValue) => {
            setTempValue(null);
            onChange(nextValue);
          }}
        />
      ),
    },
    {
      id: "predefined",
      title: t?.("common.colorPredefined") ?? "Nuanciers",
      content: (
        <RawColorGrid
          value={tempValue?.type === "raw" ? tempValue.value : null}
          onChange={(nextValue) => {
            setTempValue(null);
            onChange({ type: "raw", value: nextValue });
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
            color={tempValue?.type === "raw" ? tempValue.value : undefined}
            onChange={(value) => {
              setTempValue({ type: "raw", value });
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
              color={tempValue?.type === "raw" ? tempValue.value : undefined}
              onChange={(value) => setTempValue({ type: "raw", value })}
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
        <ModalContent className="max-w-140" zClassName="z-modal-overlay">
          <div>
            <Tabs
              tabs={tabs}
              value={tabId}
              onChange={setTabId}
              contentClassName="h-[320px] overflow-auto"
              className="rounded-t-2xl"
              action={
                <Button icon variant="text" color="gray" onClick={() => setTempValue(null)}>
                  <i className="fe-cancel"></i>
                </Button>
              }
            />
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
