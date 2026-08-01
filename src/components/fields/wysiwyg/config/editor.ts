import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { exportMap } from "../parsers/exportMap";
import { constructImportMap } from "../parsers/importMap";
import { ParagraphNode } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

export const editorConfig: Pick<
  InitialConfigType,
  "theme" | "html" | "namespace" | "nodes" | "onError"
> = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "Melodineo Wysiwyg",
  nodes: [
    HorizontalRuleNode,
    ParagraphNode,
    HeadingNode,
    AutoLinkNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
  ],
  onError(error) {
    throw error;
  },
};
