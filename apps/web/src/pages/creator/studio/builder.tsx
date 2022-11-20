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
import { default as pluginInitFlexbox } from "@codeup/util/src/grapejs/plugin-flexbox";
import {
  FaCode,
  FaHeading,
  FaImage,
  FaLink,
  FaList,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaTable,
  FaVideo,
} from "react-icons/fa";

export default function Builder() {
  useEffect(() => {
    fetch(
      "/_static/creator_builder/default/templates/default_template.html"
    ).then((res) => {
      res.text().then((html) => {
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
            <p class="cup-dpe-paragraph">Insert your text here</p>`,
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
            <p class="cup-dpe-heading heading-${randomString()}">Insert your text here</p>
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
          {
            id: "video",
            block: {
              label: "Video",
              category: "Media",
              content: `<iframe width="1280" height="720" src="https://www.youtube.com/embed/p1inZ7hvz70" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
              media: reactIconToSVG(FaVideo),
            },
          },
          {
            id: "unordered-list",
            block: {
              label: "Unordered List",
              category: "List",
              content: `<ul style="font-size: 1.2rem; font-family: Arial"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`,
              media: reactIconToSVG(FaListUl),
            },
          },
          {
            id: "ordered-list",
            block: {
              label: "Ordered List",
              category: "List",
              content: `<ol style="font-size: 1.2rem; font-family: Arial"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>`,
              media: reactIconToSVG(FaListOl),
            },
          },
          {
            id: "list-item",
            block: {
              label: "List Item",
              category: "List",
              content: `<li style="font-size: 1.2rem; font-family: Arial">Item</li>`,
              media: reactIconToSVG(FaList),
            },
          },
          {
            id: "code",
            block: {
              label: "Code (Click to Add)",
              category: "Text",
              content: `<></>`,
              media: reactIconToSVG(FaCode),
              onClick: () => {
                editor.Modal.open({
                  title: "New Code",
                });
              },
            },
          },
        ];

        const editor = grapesjs.init({
          container: "#grape_editor",
          components: html,
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

        editor.Panels.getButton("views", "open-blocks")?.set(
          "className",
          "fa fa-plus-square"
        );

        editor.Panels.getButton("views", "open-blocks")?.set("active", true);

        editor.Commands.run("sw-visibility");
        editor.Commands.run("open-blocks");
      });
    });
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
        <Box maxW={"75%"} h={"fit-content"} w={"100%"} boxShadow={"2xl"}>
          <div id={"grape_editor"}></div>
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

function randomString(length: number = 16) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
