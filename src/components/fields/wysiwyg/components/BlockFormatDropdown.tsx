import type { LexicalEditor } from "lexical";
import type { BlockType } from "../ToolbarContext";
import { DropdownMenu, DropdownMenuItem } from "../../../dropdown-menu";
import { Button } from "../../../button";
import clsx from "clsx";
import { formatBulletList, formatHeading, formatParagraph, formatQuote } from "../utils/formatters";
import { useTranslate } from "../../../i18n";

interface Props {
  blockType: BlockType;
  editor: LexicalEditor;
  isFocusable?: boolean;
}

const icons: {
  [K in BlockType]: string;
} = {
  bullet: "fe-list-bullet",
  check: "fe-help",
  h1: "fe-h1",
  h2: "fe-h2",
  h3: "fe-h3",
  number: "fe-list-numbered",
  paragraph: "fe-paragraph",
  quote: "fe-quote",
};

export function BlockFormatDropdown({ blockType, editor, isFocusable = true }: Props) {
  const translate = useTranslate();

  return (
    <DropdownMenu
      data-testid="menubar-user-dropdown"
      placement="bottom-start"
      listClassName="flex flex-col gap-1"
      trigger={
        <Button type="button" variant="text" icon color="gray" tabIndex={isFocusable ? 0 : -1}>
          <i className={icons[blockType]}></i>
          <i className="fe-angle-down -ml-4"></i>
        </Button>
      }
    >
      <DropdownMenuItem
        type="button"
        className={clsx(blockType === "paragraph" && "bg-gray-2!", "gap-2")}
        onClick={() => formatParagraph(editor)}
      >
        <i className={icons.paragraph}></i>
        {translate?.("wysiwyg.formats.paragraph")}
      </DropdownMenuItem>
      <DropdownMenuItem
        type="button"
        className={clsx(blockType === "h1" && "bg-gray-2!", "gap-2")}
        onClick={() => formatHeading(editor, blockType, "h1")}
      >
        <i className={icons.h1}></i>
        {translate?.("wysiwyg.formats.h1")}
      </DropdownMenuItem>
      <DropdownMenuItem
        type="button"
        className={clsx(blockType === "h2" && "bg-gray-2!", "gap-2")}
        onClick={() => formatHeading(editor, blockType, "h2")}
      >
        <i className={icons.h2}></i>
        {translate?.("wysiwyg.formats.h2")}
      </DropdownMenuItem>
      <DropdownMenuItem
        type="button"
        className={clsx(blockType === "h3" && "bg-gray-2!", "gap-2")}
        onClick={() => formatHeading(editor, blockType, "h3")}
      >
        <i className={icons.h3}></i>
        {translate?.("wysiwyg.formats.h3")}
      </DropdownMenuItem>
      <DropdownMenuItem
        type="button"
        className={clsx(blockType === "bullet" && "bg-gray-2!", "gap-2")}
        onClick={() => formatBulletList(editor, blockType)}
      >
        <i className={icons.bullet}></i>
        {translate?.("wysiwyg.formats.bullet")}
      </DropdownMenuItem>
      {/* <DropdownMenuItem
        type="button"
        className={clsx(blockType === "number" && "bg-gray-2!", "gap-2")}
        onClick={() => formatNumberedList(editor, blockType)}
      >
        {translate?.("wysiwyg.formats.number")}
      </DropdownMenuItem> */}
      <DropdownMenuItem
        type="button"
        className={clsx(blockType === "quote" && "bg-gray-2!", "gap-2")}
        onClick={() => formatQuote(editor, blockType)}
      >
        <i className={icons.quote}></i>
        {translate?.("wysiwyg.formats.quote")}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
