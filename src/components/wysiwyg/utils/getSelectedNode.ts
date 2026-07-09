/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $isAtNodeEnd } from "@lexical/selection";
import type { ElementNode, RangeSelection, TextNode } from "lexical";

export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  /**
   * in a selection of a text
   *      ---------
   *     ^ anchor  ^
   *               | focus (end)
   */
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    // @ts-ignore
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    // @ts-ignore
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}
