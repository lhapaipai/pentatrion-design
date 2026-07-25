import type { ElementFormatType, LexicalEditor } from "lexical";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { DropdownMenu, DropdownMenuItem } from "../../../dropdown-menu";
import { Button } from "../../../button";
import { useTranslate } from "../../../i18n";
import clsx from "clsx";

interface Props {
  editor: LexicalEditor;
  value: ElementFormatType;
  isFocusable?: boolean;
}

const icons = {
  left: "fe-align-left",
  center: "fe-align-center",
  right: "fe-align-right",
  justify: "fe-align-justify",
  start: "fe-align-left",
  end: "fe-align-right",
  "": "",
};

export function ElementFormatDropdown({ editor, value, isFocusable = true }: Props) {
  const translate = useTranslate();
  return (
    <DropdownMenu
      data-testid="menubar-user-dropdown"
      placement="bottom-start"
      className="min-w-36"
      listClassName="flex flex-col gap-1"
      trigger={
        <Button icon variant="text" color="gray" type="button" tabIndex={isFocusable ? 0 : -1}>
          <i className={icons[value || "left"]}></i>
          <i className="fe-angle-down -ml-4"></i>
        </Button>
      }
    >
      <DropdownMenuItem
        type="button"
        className={clsx(value === "left" && "bg-gray-2!", "gap-2")}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
      >
        <i className={icons.left}></i>
        {translate?.("wysiwyg.elementFormats.left")}
      </DropdownMenuItem>{" "}
      <DropdownMenuItem
        type="button"
        className={clsx(value === "center" && "bg-gray-2!", "gap-2")}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
      >
        <i className={icons.center}></i>
        {translate?.("wysiwyg.elementFormats.center")}
      </DropdownMenuItem>{" "}
      <DropdownMenuItem
        type="button"
        className={clsx(value === "right" && "bg-gray-2!", "gap-2")}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
      >
        <i className={icons.right}></i>
        {translate?.("wysiwyg.elementFormats.right")}
      </DropdownMenuItem>{" "}
      <DropdownMenuItem
        type="button"
        className={clsx(value === "justify" && "bg-gray-2!", "gap-2")}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
      >
        <i className={icons.justify}></i>
        {translate?.("wysiwyg.elementFormats.justify")}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
