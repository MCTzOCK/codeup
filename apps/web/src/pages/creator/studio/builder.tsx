/**
 * apps/web/src/pages/creator/studio/builder.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.11.2022
 *
 */

import * as React from "react";
import { useEffect } from "react";
import grapesjs from "grapesjs";
import Head from "next/head";
import { Box, Flex } from "@chakra-ui/react";
import { default as pluginInitFlexbox } from "@codeup/util/src/grapejs-plugin/flexbox";
import { FaHeading, FaImage, FaLink, FaParagraph } from "react-icons/fa";

export default function Builder() {
  useEffect(() => {
    const blocks: {
      id: string;
      block: grapesjs.BlockOptions;
    }[] = [
      {
        id: "paragraph",
        block: {
          label: "Paragraph",
          category: "Text",
          media: reactIconToSVG(FaParagraph),
          content: `<style>
              .cup-dpe-paragraph {
                font-size: 1.2rem;
                font-family: 'Arial';
              }          
            </style>
            <h1 class="cup-dpe-paragraph">Insert your text here</h1>`,
        },
      },
      {
        id: "heading",
        block: {
          label: "Heading",
          category: "Text",
          media: reactIconToSVG(FaHeading),
          content: `
            <style>
              .cup-dpe-heading {
                font-size: 2rem;
                font-weight: 700;
                font-family: 'Arial Black';
              }          
            </style>
            <h1 class="cup-dpe-heading">Insert your text here</h1>
          `,
        },
      },
      {
        id: "link",
        block: {
          label: "Link",
          category: "Text",
          content: `<style>.cup-dpe-link { font-size: 1.2rem font-family: 'Arial'; }</style><a href="#" class="cup-dpe-link">Link</a>`,
          media: reactIconToSVG(FaLink),
        },
      },
      {
        id: "image",
        block: {
          label: "Image",
          category: "Media",
          media: reactIconToSVG(FaImage),
          content: { type: "image" },
        },
      },
    ];

    const editor = grapesjs.init({
      container: "#grape_editor",
      components: "",
      showDevices: false,
      showOffsetsSelected: false,
      style: `body { color-scheme: dark; background-color: black; color: white; padding-inline: .4rem; }`,
      deviceManager: {
        deviceLabel: "Tablet",
        devices: [
          {
            name: "Tablet",
            width: "768px",
          },
        ],
      },
      richTextEditor: true,
      storageManager: false,
      selectorManager: {
        selectedLabel: "",
      },
    });

    editor.on("load", () => {
      pluginInitFlexbox(editor);
    });

    for (const block of blocks) {
      editor.BlockManager.add(block.id, block.block);
    }

    editor.Panels.removeButton("options", "sw-visibility");
    editor.Panels.removeButton("options", "fullscreen");
    editor.Panels.removeButton("options", "export-template");

    editor.Panels.getButton("views", "open-blocks")?.set(
      "className",
      "fa fa-plus-square"
    );

    editor.Panels.getButton("views", "open-blocks")?.set("active", true);

    editor.Commands.run("sw-visibility");
    editor.Commands.run("open-blocks");
  }, []);

  return (
    <>
      <Head>
        <link
          rel={"stylesheet"}
          type={"text/css"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.20.1/css/grapes.min.css"
          }
        />
      </Head>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box maxW={"75%"} h={"fit-content"} w={"100%"}>
          <div id={"grape_editor"}></div>
          <div id="layers"></div>
        </Box>
      </Flex>
    </>
  );
}

function reactIconToSVG(icon: any) {
  return `<svg viewBox="0 0 512 512"><path d="${
    icon().props.children[0].props.d
  }" /></svg>`;
}
