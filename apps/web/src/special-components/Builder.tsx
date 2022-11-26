/**
 * apps/web/src/special-components/Builder.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.11.2022
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { GrapesjsReact } from "grapesjs-react";
import { default as pluginInitFlexbox } from "@codeup/util/src/grapejs/plugin-flexbox";
import grapesjs from "grapesjs";
import {
  FaArrowsAlt,
  FaCamera,
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
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from "@chakra-ui/react";
import CodeUpModal from "@codeup/components/codeup/CodeUpModal";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import html2canvas from "html2canvas";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export default function Builder(props: {
  content?: string;
  custom_event_id: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editorHook, setEditorHook] = React.useState<grapesjs.Editor | null>(
    null
  );

  const [monacoHook, setMonacoHook] = React.useState<Monaco | null>(null);
  const [monacoEditorHook, setMonacoEditorHook] =
    React.useState<IStandaloneCodeEditor | null>(null);
  const [monacoEditorLanguage, setMonacoEditorLanguage] = React.useState<
    string | null
  >(null);
  const [monacoEditorContent, setMonacoEditorContent] =
    React.useState<string>("");

  const [defaultTemplate, setDefaultTemplate] = useState<string>();

  useEffect(() => {
    if (
      !props.content ||
      props.content === "" ||
      props.content === "__codeup.__no_text_content"
    ) {
      fetch(
        "/_static/creator_builder/default/templates/default_template.html"
      ).then((res) => {
        res.text().then((text) => {
          setDefaultTemplate(text);
        });
      });
    } else {
      setDefaultTemplate(props.content);
    }
  }, []);

  return (
    <>
      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        title={"Code Block Erstellen"}
        customSize={["6xl"]}
      >
        <Box w={"100%"} minH={"40vh"} h={"fit-content"}>
          {!monacoEditorLanguage && (
            <InputGroup w={"100%"} overflow={"auto"} mb={"2rem"}>
              <InputLeftElement>
                <FaCode />
              </InputLeftElement>
              <Input
                placeholder={"Programmiersprache eingeben..."}
                w={"100%"}
                id={"codeup-code-block-language"}
              />
              <Button
                ml={2}
                colorScheme={"green"}
                boxShadow={"2xl"}
                onClick={() => {
                  // remove monaco editor if exists
                  if (monacoEditorHook) {
                    monacoEditorHook.dispose();
                  }

                  // set language
                  setMonacoEditorLanguage(
                    (
                      document.getElementById(
                        "codeup-code-block-language"
                      ) as HTMLInputElement
                    )?.value || ""
                  );
                }}
              >
                Erstellen
              </Button>
            </InputGroup>
          )}
          {monacoEditorLanguage && (
            <>
              <Box id={"codeup_code_image_creator_monaco"}>
                <Editor
                  defaultLanguage={monacoEditorLanguage}
                  defaultValue={monacoEditorContent}
                  onMount={(editor, monaco) => {
                    if (editor && monaco) {
                      setMonacoHook(monaco);
                      setMonacoEditorHook(editor);
                    }
                  }}
                  onChange={(value, ev) => {
                    setMonacoEditorContent(value || "");
                  }}
                  theme={"vs-dark"}
                  height={"40vh"}
                  options={{
                    fontSize: 20,
                    minimap: {
                      enabled: false,
                    },
                    scrollbar: {
                      scrollByPage: true,
                    },
                  }}
                />
              </Box>
            </>
          )}
          {monacoEditorLanguage && (
            <ButtonGroup w={"100%"} mt={"2rem"}>
              <Button
                leftIcon={<FaArrowsAlt />}
                w={"100%"}
                colorScheme={"red"}
                onClick={() => {
                  setMonacoEditorLanguage(null);
                }}
              >
                Sprache wechseln
              </Button>
              <Button
                colorScheme={"green"}
                w={"100%"}
                leftIcon={<FaCamera />}
                onClick={async () => {
                  const i = await html2canvas(
                    document.getElementsByClassName(
                      "monaco-editor"
                    )[0] as HTMLElement
                  );

                  const img = new Image();
                  img.src = i.toDataURL();

                  editorHook?.AssetManager.add(img.src, img);

                  editorHook?.addComponents(`<img src="${img.src}" />`);

                  onClose();
                }}
              >
                Screenshots erstellen
              </Button>
            </ButtonGroup>
          )}
        </Box>
      </CodeUpModal>

      <Flex w={"100%"} justifyContent={"center"}>
        <Box w={"75%"} h={"fit-content"}>
          {defaultTemplate && (
            <>
              <GrapesjsReact
                id={"grapesjs-react"}
                components={defaultTemplate}
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
                    setEditorHook(editor);
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
                            onOpen();
                          },
                        },
                      },
                    ];

                    for (const block of blocks) {
                      editor.BlockManager.add(block.id, block.block);
                    }
                    pluginInitFlexbox(editor);

                    const listener = () => {
                      const html = editor.getHtml();
                      const css = editor
                        .getCss()
                        .toString()
                        .replace("max-width: 768px", "min-width: 2px");

                      const merged = `<html><head><style>${css}</style></head>${html}</html>`;

                      // @ts-ignore
                      if (!window.codeup) {
                        // @ts-ignore
                        window.codeup = {};
                      }
                      // @ts-ignore
                      window.codeup.webBuilderHTMLExport = merged;
                    };

                    window.addEventListener(
                      "codeup::webbuilder::export_" + props.custom_event_id,
                      listener
                    );
                  }
                }}
              />
            </>
          )}
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
