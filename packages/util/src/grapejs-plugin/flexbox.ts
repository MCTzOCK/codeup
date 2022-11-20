/**
 * packages/util/src/grapejs-plugin/flexbox.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.11.2022
 *
 * Original: https://github.com/artf/grapesjs-blocks-flexbox/blob/c56b4f6d9d0395407251f349f8c2b5cf7c45512e/src/blocks.js
 *
 */
import { FaColumns } from "react-icons/fa";

export default (
  editor: any,
  opt: any = {
    flexboxBlock: {},
    stylePrefix: "",
    labelRow: "Row",
    labelColumn: "Column",
  }
) => {
  const bm = editor.BlockManager;
  const blocks = opt.blocks || [];
  const stylePrefix = opt.stylePrefix;
  const toAdd = (name: any) => blocks.indexOf(name) >= 0;
  const nameClm1 = "flexbox";
  const clsRow = `${stylePrefix}row`;
  const clsCell = `${stylePrefix}cell`;
  const labelRow = opt.labelRow;
  const labelCell = opt.labelColumn;
  const attrsToString = (attrs: any) => {
    const result = [];

    for (let key in attrs) {
      let value = attrs[key];
      const toParse = value instanceof Array || value instanceof Object;
      value = toParse ? JSON.stringify(value) : value;
      result.push(`${key}=${toParse ? `'${value}'` : `"${value}"`}`);
    }

    return result.length ? ` ${result.join(" ")}` : "";
  };

  // Flex elements do not react on width style change therefore I use
  // 'flex-basis' as keyWidth for the resizer on columns
  const keyWidth = "flex-basis";
  const step = 0.2;
  const minDim = 1;
  const currentUnit = 1;
  const resizerBtm = {
    tl: 0,
    tc: 0,
    tr: 0,
    cl: 0,
    cr: 0,
    bl: 0,
    br: 0,
    minDim,
  };
  const resizerRight = {
    ...resizerBtm,
    cr: 1,
    bc: 0,
    keyWidth,
    currentUnit,
    minDim,
    step,
  };
  const rowAttr = {
    class: clsRow,
    "data-gjs-droppable": `.${clsCell}`,
    "data-gjs-resizable": resizerBtm,
    "data-gjs-custom-name": labelRow,
  };

  const colAttr = {
    class: clsCell,
    "data-gjs-draggable": `.${clsRow}`,
    "data-gjs-resizable": resizerRight,
    "data-gjs-custom-name": labelCell,
    "data-gjs-droppable": "*",
    // X Flex
    "data-gjs-unstylable": ["width"],
    "data-gjs-stylable-require": ["flex-basis"],
  };

  const privateCls = [`.${clsRow}`, `.${clsCell}`];
  editor.on(
    "selector:add",
    (selector: any) =>
      privateCls.indexOf(selector.getFullName()) >= 0 &&
      selector.set("private", 1)
  );

  const label = "Flexbox";
  const category = "Layout";
  const attrsRow = attrsToString(rowAttr);
  const attrsCell = attrsToString(colAttr);
  const styleRow = `
    .${clsRow} {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      padding: 10px;
    }
    `;
  const styleClm = `
    .${clsCell} {
      min-height: 75px;
      flex: 100%;
    }`;

  bm.add("flexbox-row", {
    label: "Row",
    category,
    media: reactIconToSVG(FaColumns),
    content: `
        <div ${attrsRow}>
        </div>
        <style>
          ${styleRow}
        </style>
        `,
  });

  bm.add("flexbox-column", {
    label: "Column",
    category,
    media: reactIconToSVG(FaColumns),
    content: `
        <div ${attrsCell}>
        </div>
        <style>
          ${styleClm}
        </style>
        `,
  });

  bm.add("flexbox-1c", {
    label: "1 Column",
    category,
    media: reactIconToSVG(FaColumns),
    content: `
        <div ${attrsRow}>
          <div ${attrsCell}></div>
        </div>
        <style>
          ${styleRow}
          ${styleClm}
        </style>
        `,
  });

  bm.add("flexbox-2c", {
    label: "2 Columns",
    category,
    media: reactIconToSVG(FaColumns),
    content: `
        <div ${attrsRow}>
          <div ${attrsCell}></div>
          <div ${attrsCell}></div>
        </div>
        <style>
          ${styleRow}
          ${styleClm}
        </style>
        `,
  });

  bm.add("flexbox-3c", {
    label: "3 Columns",
    category,
    media: reactIconToSVG(FaColumns),
    content: `
        <div ${attrsRow}>
          <div ${attrsCell}></div>
          <div ${attrsCell}></div>
          <div ${attrsCell}></div>
        </div>
        <style>
          ${styleRow}
          ${styleClm}
        </style>
        `,
  });
};

function reactIconToSVG(icon: any) {
  return `<svg viewBox="0 0 512 512"><path d="${
    icon().props.children[0].props.d
  }" /></svg>`;
}
