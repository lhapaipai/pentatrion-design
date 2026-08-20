import { Modal, ModalContent, ModalFooter } from "pentatrion-design/modal";
import { useState } from "react";
import { Field, FieldProps } from "pentatrion-design/fields/field";
import { NamedColorGrid } from "./NamedColorGrid";
import { Button } from "pentatrion-design/button";
import { ColorPreview } from "./ColorPreview";
import { Color, BrandPalette, RawColor } from "./config";
import { Tabs } from "pentatrion-design/tabs";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { inputConfig } from "pentatrion-design/fields/text";
import clsx from "clsx";
import { useTranslate } from "../i18n";
import { RawColorGrid } from "./RawColorGrid";
import { HarmonyColorGrid } from "./HarmonyColorGrid";

interface Props extends Omit<FieldProps, "errors" | "children" | "group"> {
  palette?: BrandPalette;
  value: Color | null;
  refColor?: RawColor;
  onChange: (value: Color | null) => void;
  allowInherit?: boolean;
}

export function ColorPicker({
  palette,
  value,
  refColor,
  onChange,
  allowInherit = false,
  ...rest
}: Props) {
  const t = useTranslate();

  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<null | Color>(null);
  const [tabId, setTabId] = useState<string | number>(value?.type === "raw" ? "custom" : "palette");

  function handleSubmit() {
    onChange(tempValue);
    setIsOpen(false);
  }

  function handleInherit() {
    onChange(null);
    setIsOpen(false);
  }

  const tabs = [
    ...(palette
      ? [
          {
            id: "palette",
            title: t?.("common.colorPalette") ?? "Couleurs du thème",
            content: (
              <NamedColorGrid
                palette={palette}
                color={tempValue?.type === "named" ? tempValue : null}
                onChange={setTempValue}
              />
            ),
          },
        ]
      : []),
    ...(refColor
      ? [
          {
            id: "harmony",
            title: t?.("common.harmonyColors") ?? "Harmonies",
            content: (
              <HarmonyColorGrid
                refColor={refColor}
                color={tempValue?.type === "raw" ? tempValue : null}
                onChange={setTempValue}
              />
            ),
          },
        ]
      : []),
    {
      id: "predefined",
      title: t?.("common.colorPredefined") ?? "Nuancier",
      content: (
        <RawColorGrid
          color={tempValue?.type === "raw" ? tempValue : null}
          onChange={setTempValue}
        />
      ),
    },
    {
      id: "custom",
      title: t?.("common.colorCustom") ?? "Sur mesure",
      content: (
        <div className="p-2 flex flex-col gap-2 react-colorful-container">
          <HexColorPicker
            color={tempValue?.type === "raw" ? tempValue.hex : undefined}
            onChange={(hex) => {
              setTempValue({ type: "raw", hex });
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
              color={tempValue?.type === "raw" ? tempValue.hex : undefined}
              onChange={(hex) => setTempValue({ type: "raw", hex })}
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
          onClick={() => {
            setIsOpen(true);
            setTempValue(value);
          }}
        />
      </Field>
      <Modal
        open={isOpen}
        /* There is not Modal trigger, onOpen is called only by
         * FloatingOverlay to close the modal */
        onOpen={(modalKeepOpen) => !modalKeepOpen && setIsOpen(false)}
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
                <Button icon variant="text" color="gray" onClick={() => setIsOpen(false)}>
                  <i className="fe-cancel"></i>
                </Button>
              }
            />
          </div>

          <ModalFooter className="mt-2">
            <div className="flex justify-between">
              <Button type="button" variant="text" color="gray" onClick={() => setIsOpen(false)}>
                {t?.("button.cancel") ?? "Annuler"}
              </Button>
              {allowInherit && (
                <Button icon type="button" variant="outlined" color="gray" onClick={handleInherit}>
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
