/**
 * src/components/community/post/TipTap.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "./StarterKit";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import { GoChevronDown } from "react-icons/go";
import { Image } from "@tiptap/extension-image";
import PostMediaUploader from "./PostMediaUploader";
import { FontFamily } from "@tiptap/extension-font-family";
import { Link } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import REST from "@codeup/rest";

const MenuBar = ({ editor, onOpen }: { editor: any; onOpen: () => void }) => {
  if (!editor) {
    return null;
  }

  return (
    <Flex
      direction={"row"}
      mb={"2rem"}
      gap={"2rem"}
      display={["block", "block"]}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
    >
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Größe
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            Riesig
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            Groß
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            Mittel
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            Normal
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Dekoration
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            Fett
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            Kursiv
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("strikeThrough") ? "is-active" : ""}
          >
            Durchgestrichen
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Markieren
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            Gelb
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "red" }).run()
            }
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive("highlight", { color: "red" }) ? "is-active" : ""
            }
          >
            Rot
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "green" }).run()
            }
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive("highlight", { color: "green" })
                ? "is-active"
                : ""
            }
          >
            Grün
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "blue" }).run()
            }
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive("highlight", { color: "blue" }) ? "is-active" : ""
            }
          >
            Blau
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Ausrichtung
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            Links
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            Mitte
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
          >
            Rechts
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Liste
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            Ungeordnet
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            Geordnet
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Code
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleCode().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            Code
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            Code Block
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          onClick={() => {
            onOpen();
          }}
        >
          Bild
        </MenuButton>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          Schriftart
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().unsetFontFamily().run()}
            style={{ flex: "1 1 auto" }}
          >
            Standart
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor
                .chain()
                .focus()
                .setFontFamily("Comic Sans MS, Comic Sans")
                .run()
            }
            style={{ flex: "1 1 auto" }}
          >
            Comic Sans
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().setFontFamily("sans-serif").run()
            }
            style={{ flex: "1 1 auto" }}
          >
            Sans Serif
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().setFontFamily("monospace").run()
            }
            style={{ flex: "1 1 auto" }}
          >
            Monospace
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          onClick={() => {
            (
              document.getElementById("post-color-picker") as HTMLInputElement
            ).click();
          }}
        >
          Farbe
        </MenuButton>
        <input
          type="color"
          onInput={(event) =>
            // @ts-ignore
            editor.chain().focus().setColor(event.target.value).run()
          }
          value={editor.getAttributes("textStyle").color}
          id={"post-color-picker"}
          style={{ display: "none" }}
        />
      </Menu>
    </Flex>
  );
};

const TipTap = (props: {
  parentPost?: string;
  setShowEditor?: Dispatch<SetStateAction<boolean>>;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Code,
      CodeBlock,
      Image.configure({
        allowBase64: true,
      }),
      FontFamily,
      TextStyle,
      Link.configure({
        autolink: true,
        protocols: ["http", "https", "mailto"],
        linkOnPaste: true,
        HTMLAttributes: {
          class: "post-link",
        },
      }),
      Color,
    ],
    content: "<p>Hallo Welt!</p>",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <PostMediaUploader
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        editor={editor}
      />
      <MenuBar editor={editor} onOpen={onOpen} />
      <EditorContent editor={editor} />

      <Box w={"100%"} textAlign={"right"}>
        <Button
          mt={"2rem"}
          colorScheme={"whatsapp"}
          onClick={async () => {
            const html = editor?.getHTML();

            const res = await REST.Community.createPost({
              token: localStorage.getItem("token") as string,
              content: html as string,
              parent: props.parentPost || null,
            });

            if (res.payload.success) {
              if (props.parentPost) {
                toast({
                  title: "Kommentar erstellt!",
                  description:
                    "Dein Kommentar wurde erstellt mund ist bald sichtbar.",
                  status: "success",
                  duration: 6000,
                  isClosable: false,
                  position: "top",
                });
                if (props.setShowEditor) {
                  props.setShowEditor(false);
                }
              } else {
                window.location.href = "/community/post/" + res.payload.post;
              }
            } else {
              toast({
                title: "Fehler",
                description: res.payload.error,
                status: "error",
                duration: 9000,
              });
            }
          }}
        >
          Posten
        </Button>
      </Box>
    </>
  );
};

export default TipTap;
