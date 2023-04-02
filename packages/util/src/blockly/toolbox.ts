/**
 * packages/util/src/blockly/toolbox.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.04.2023
 *
 */

export const defaultToolbox = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
   <category colour="210" name="Global">
      <block type="html" />
      <block type="html_close" />
      <block type="head" />
      <block type="head_close" />
      <block type="body" />
      <block type="body_close" />
   </category>
   <category colour="180" name="Meta"> 
      <block type="title" />
      <block type="meta" />
   </category>
   <category colour="120" name="Text">
      <block type="custom_text" />
      <block type="h1" />
      <block type="h2" />
      <block type="h3" />
      <block type="h4" />
      <block type="h5" />
      <block type="h6" />
      <block type="p" />
      <block type="span" />
      <block type="a" />
      <block type="a_close" />
      <block type="b" />
      <block type="b_close" />
      <block type="blockquote" />
      <block type="blockquote_close" />
      <block type="br" />
   </category>
   <category colour="170" name="Listen"> 
      <block type="ul" />
      <block type="ul_close" />
      <block type="ol" />
      <block type="ol_close" />
      <block type="li" />
      <block type="li_close" />
   </category>
   <category colour="240" name="Layout"> 
      <block type="div" />
      <block type="div_close" />
      <block type="hr" />
   </category>
   <category colour="0" name="Tabellen"> 
      <block type="table" />
      <block type="table_close" />
      <block type="thead" />
      <block type="thead_close" />
      <block type="tbody" />
      <block type="tbody_close" />
      <block type="tfoot" />
      <block type="tfoot_close" />
      <block type="td" />
      <block type="td_close" />
      <block type="th" />
      <block type="th_close" />
      <block type="tr" />
      <block type="tr_close" />
   </category>
   <category colour="140" name="Medien"> 
      <block type="image" />
      <block type="video" />
   </category>
</xml>`;
