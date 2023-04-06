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
      zoom: {
        controls: true,
      },
    });
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(props.initialXml), ws);
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

const defaultToolbox = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
   <category colour="210" name="Programm">
      <block type="start" />
   </category>
   <category colour="120" name="Anzeige">
      <block type="log" />
      <block type="ask" />
      <block type="add_to_screen" />
      <block type="add_to_element" />
   </category>
   <category colour="290" name="Funktionen">
      <block type="create_method" />
      <block type="call_method" />
   </category>
   <category colour="30" name="Variabeln">
      <block type="var_create" />
      <block type="var_create_type" />
      <block type="var_set_text" />
      <block type="var_set_color" />
      <block type="var_set_decor_props" />
      <block type="var_set_text_align" />
      <block type="var_set_pos" />
      <block type="var_set_border_style" />
      <block type="var_set_font_weight" />
   </category>
   <category colour="210" name="Schleifen">
      <block type="repeat_x_times" />
      <block type="repeat_while" />
      <block type="repeat_while_number" />
   </category>
   <category colour="#5577EE" name="Abfragen">
      <block type="if_text" />
      <block type="if_number" />
      <block type="if_event" />
      <block type="else_if_text" />
      <block type="else_if_number" />
      <block type="else" />
   </category>
</xml>`;
