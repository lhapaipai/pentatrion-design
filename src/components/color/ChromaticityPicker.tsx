import { Modal, ModalContent, ModalFooter } from "pentatrion-design/modal";
import { useState } from "react";
import { Field, FieldProps } from "pentatrion-design/fields/field";
import { Button } from "pentatrion-design/button";
import { Tabs } from "pentatrion-design/tabs";
import clsx from "clsx";
import { ColorPreview } from "./ColorPreview";
import { Chromaticity } from "./config";
import { ChromaticityGrid } from "./ChromaticityGrid";
import { ChromaticityArea } from "./ChromaticityArea";
import { useTranslate } from "../i18n";
import {
  chromaticityGridChromas,
  chromaticityGridHues,
  getChromaticityValue,
} from "../../lib/palette";

const gridChromas: number[] = Object.values(chromaticityGridChromas);

function isInGrid({ hue, chroma }: Chromaticity) {
  return chromaticityGridHues.includes(hue) && gridChromas.includes(chroma);
}

interface Props extends Omit<FieldProps, "children" | "group"> {
  value: Chromaticity | null;
  onChange: (value: Chromaticity | null) => void;
  allowInherit?: boolean;
}

export function ChromaticityPicker({ value, onChange, allowInherit = false, ...rest }: Props) {
  const t = useTranslate();

  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<Chromaticity | null>(null);
  const [tabId, setTabId] = useState<string | number>("swatches");

  function handleOpen() {
    setTempValue(value);
    setTabId(!value || isInGrid(value) ? "swatches" : "custom");
    setIsOpen(true);
  }

  function handleSubmit() {
    onChange(tempValue);
    setIsOpen(false);
  }

  function handleInherit() {
    onChange(null);
    setIsOpen(false);
  }

  const tabs = [
    {
      id: "swatches",
      title: t?.("common.colorSwatches") ?? "Nuancier",
      content: <ChromaticityGrid value={tempValue} onChange={setTempValue} />,
    },
    {
      id: "custom",
      title: t?.("common.colorCustom") ?? "Sur mesure",
      content: (
        <div className="p-2">
          <ChromaticityArea value={tempValue} onChange={setTempValue} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Field {...rest}>
        <ColorPreview
          type="button"
          value={value ? getChromaticityValue(value) : null}
          onClick={handleOpen}
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
              contentClassName="h-64 overflow-auto"
              className="rounded-t-2xl"
              action={
                <Button icon variant="text" color="gray" onClick={() => setIsOpen(false)}>
                  <i className="fe-cancel"></i>
                </Button>
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2 px-2">
            <ChromaticityPreview value={tempValue} />
            <ChromaticityPreview value={tempValue} dark />
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

function ChromaticityPreview({
  value,
  dark = false,
}: {
  value: Chromaticity | null;
  dark?: boolean;
}) {
  const t = useTranslate();

  const titleColor = value
    ? getChromaticityValue(value, "var(--chromaticity-title-l)")
    : "var(--color-gray-8)";
  const textColor = value
    ? getChromaticityValue(value, "var(--chromaticity-text-l)")
    : "var(--color-gray-7)";

  return (
    <div className={clsx(dark && "dark", "bg-gray-0 border-gray-2 rounded-xl border p-3")}>
      <div className="font-semibold" style={{ color: titleColor }}>
        {t?.("form.values.chromaticity.previewTitle") ?? "Titre de section"}
      </div>
      <div className="text-body-sm" style={{ color: textColor }}>
        {t?.("form.values.chromaticity.previewText") ?? "Le texte courant de la page."}
      </div>
    </div>
  );
}
