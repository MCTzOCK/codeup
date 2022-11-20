/**
 * apps/web/src/pages/creator/studio/builder-new.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.11.2022
 *
 */

import * as React from "react";
import { GrapesjsReact } from "grapesjs-react";
import { default as pluginInitFlexbox } from "@codeup/util/src/grapejs/plugin-flexbox";
import grapesjs from "grapesjs";
import {
  FaCode,
  FaHeading,
  FaImage,
  FaLink,
  FaList,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaVideo,
} from "react-icons/fa";
import { Box, Flex } from "@chakra-ui/react";

export default function Builder() {
  return (
    <>
      <Flex
        w={"100%"}
        minH={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box w={"75%"} h={"fit-content"}>
          <GrapesjsReact
            id={"grapesjs-react"}
            showDevices={false}
            showOffsetsSelected={false}
            style={
              "body { color-scheme: dark; background-color: black; color: white; padding-inline: .4rem; }"
            }
            deviceManager={{
              deviceLabel: "Tablet",
              devices: [
                {
                  name: "Tablet",
                  width: "768px",
                },
              ],
            }}
            richTextEditor={true}
            storageManager={false}
            selectorManager={{
              selectedLabel: "",
            }}
            onInit={(editor) => {
              if (editor) {
                editor.Panels.getButton("views", "open-blocks")?.set(
                  "className",
                  "fa fa-plus-square"
                );

                editor.Panels.getButton("views", "open-blocks")?.set(
                  "active",
                  true
                );

                editor.Commands.run("sw-visibility");
                editor.Commands.run("open-blocks");

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
                      content: `<h1 style="font-size: 1.2rem; font-family: 'Arial';">Insert your text here</h1>`,
                    },
                  },
                  {
                    id: "heading",
                    block: {
                      label: "Heading",
                      category: "Text",
                      media: reactIconToSVG(FaHeading),
                      content: `<p style="font-size: 2rem; font-weight: 700; font-family: 'Arial Black'">Insert your text here</p>`,
                    },
                  },
                  {
                    id: "link",
                    block: {
                      label: "Link",
                      category: "Text",
                      content: `<a style="font-size: 1.2rem font-family: 'Arial';" href="#" class="cup-dpe-link">Link</a>`,
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
                        const functionName = randomString(32);

                        // @ts-ignore
                        window[functionName] = () => {
                          const code = (
                            document.getElementById(
                              functionName
                            ) as HTMLTextAreaElement
                          ).value;
                        };

                        editor.Modal.open({
                          title: "Code",
                          content: `
                            <textarea id="${functionName}" style="width: 100%; height: 50vh;"></textarea>
                            <button onClick="window.${functionName}()">Run</button>
                        `,
                        });
                      },
                    },
                  },
                ];

                for (const block of blocks) {
                  editor.BlockManager.add(block.id, block.block);
                }
                pluginInitFlexbox(editor);
              }
            }}
          />
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

function randomString(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
