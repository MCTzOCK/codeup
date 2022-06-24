/**
 * src/components/community/post/TipTap.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

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
import { useTranslation } from "next-i18next";

const MenuBar = ({ editor, onOpen }: { editor: any; onOpen: () => void }) => {
  const { t } = useTranslation();

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
          {t("community:tt-size")}
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
            {t("community:tt-size_huge")}
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
            {t("community:tt-size_large")}
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
            {t("community:tt-size_medium")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            {t("community:tt-size_normal")}
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
          {t("community:tt-decoration")}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            {t("community:tt-decoration_bold")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            {t("community:tt-decoration_italic")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("strikeThrough") ? "is-active" : ""}
          >
            {t("community:tt-decoration_strikeThrough")}
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
          {t("community:tt-highlight")}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            style={{ flex: "1 1 auto" }}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            {t("community:tt-highlight_yellow")}
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
            {t("community:tt-highlight_red")}
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
            {t("community:tt-highlight_green")}
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
            {t("community:tt-highlight_blue")}
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
          {t("community:tt-align")}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            {t("community:tt-align_left")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            {t("community:tt-align_center")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
          >
            {t("community:tt-align_right")}
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
          {t("community:tt-list")}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            {t("community:tt-list_bullet")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            {t("community:tt-list_ordered")}
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
          {t("community:tt-code")}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().toggleCode().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            {t("community:tt-code_inline")}
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            style={{ flex: "1 1 auto" }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            {t("community:tt-code_block")}
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
          {t("community:tt-image")}
        </MenuButton>
      </Menu>
      <Menu>
        <MenuButton
          marginInline=".7rem"
          marginBlock=".7rem"
          as={Button}
          rightIcon={<GoChevronDown />}
        >
          {t("community:tt-font")}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => editor.chain().focus().unsetFontFamily().run()}
            style={{ flex: "1 1 auto" }}
          >
            {t("community:tt-font_default")}
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
          {t("community:tt-color")}
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
    content: "<p>Hello World! 🌎️</p>",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const { t } = useTranslation();

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
          onClick={() => {
            const html = editor?.getHTML();
            fetch("/api/community/post/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: localStorage.getItem("token"),
                content: html,
                parent: props.parentPost || null,
              }),
            }).then((res) => {
              res.json().then((data) => {
                if (data.success) {
                  if (props.parentPost) {
                    toast({
                      title: t("community:comment-created"),
                      description: t("community:comment-created_description"),
                      status: "success",
                      duration: 6000,
                      isClosable: false,
                      position: "top",
                    });
                    if (props.setShowEditor) {
                      props.setShowEditor(false);
                    }
                  } else {
                    window.location.href = "/community/post/" + data.post;
                  }
                } else {
                  toast({
                    title: t("common:error"),
                    description: data.error,
                    status: "error",
                    duration: 9000,
                  });
                }
              });
            });
          }}
        >
          {t("community:publish")}
        </Button>
      </Box>
    </>
  );
};

export default TipTap;
