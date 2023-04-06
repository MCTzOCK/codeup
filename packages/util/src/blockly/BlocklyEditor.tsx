/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import * as React from "react";
import { useEffect } from "react";
import Blockly from "blockly";
import * as DarkTheme from "./blockly/theme/BlocklyThemeDark";
import Blocks from "./blockly/Blocks";
import * as DE from "blockly/msg/de";
import { defaultToolbox } from "./toolbox";

export interface BlocklyProps {
  initialXml: string;
  readonly?: boolean;
}

export default function BlocklyEditor(props: BlocklyProps) {
  useEffect(() => {
    // @ts-ignore
    if (window.injectedBlockly) return;
    // @ts-ignore
    window.injectedBlockly = true;

    Blocks.register();
    Blockly.setLocale(DE);
    const ws = Blockly.inject("blockly", {
      toolbox: defaultToolbox,
      renderer: "zelos",
      theme: DarkTheme.default,
      scrollbars: true,
      zoom: {
        controls: true,
        startScale: 0.8,
      },
    });
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(props.initialXml), ws);
    console.log(Blockly.getMainWorkspace());
  }, []);

  return (
    <>
      <div
        id="blockly"
        style={{ width: "100%", height: "100vh", margin: "0" }}
      />
    </>
  );
}
