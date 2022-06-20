/**
 * src/components/community/post/TipTap.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.06.2022
 *
 */

import {EditorContent, useEditor} from '@tiptap/react'
import {StarterKit} from "./StarterKit";
import {Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, useDisclosure, useToast} from "@chakra-ui/react";
import {TextAlign} from "@tiptap/extension-text-align";
import {Highlight} from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import {GoChevronDown} from "react-icons/go";
import {Image} from "@tiptap/extension-image";
import PostMediaUploader from "./PostMediaUploader";
import {FontFamily} from "@tiptap/extension-font-family";
import {Link} from "@tiptap/extension-link";
import {TextStyle} from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";
import {useRouter} from "next/router";
import {Dispatch, SetStateAction} from "react";


const MenuBar = ({editor, onOpen}: { editor: any, onOpen: () => void }) => {
    if (!editor) {
        return null
    }

    return (
        <Flex direction={"row"} mb={"2rem"} gap={"2rem"} display={["block", "block"]} justifyContent={"center"}
              alignItems={"center"} textAlign={"center"}>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>Size</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}>
                        Huge
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}>
                        Large
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive('heading', {level: 3}) ? 'is-active' : ''}>
                        Medium
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setParagraph().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive('paragraph') ? 'is-active' : ''}>
                        Normal
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>Decoration</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().toggleBold().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive('bold') ? 'is-active' : ''}>
                        Bold
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleItalic().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive('italic') ? 'is-active' : ''}>
                        Italic
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleStrike().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive('strikeThrough') ? 'is-active' : ''}>
                        Strike
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>Highlight</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().toggleHighlight().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive('highlight') ? 'is-active' : ''}>
                        Yellow
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleHighlight({color: 'red'}).run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive('highlight', {color: 'red'}) ? 'is-active' : ''}>
                        Red
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleHighlight({color: 'green'}).run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive('highlight', {color: 'green'}) ? 'is-active' : ''}>
                        Green
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleHighlight({color: 'blue'}).run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive('highlight', {color: 'blue'}) ? 'is-active' : ''}>
                        Blue
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>Align</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().setTextAlign('left').run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'left'}) ? 'is-active' : ''}>
                        Left
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setTextAlign('center').run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'center'}) ? 'is-active' : ''}>
                        Center
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setTextAlign('right').run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'right'}) ? 'is-active' : ''}>
                        Right
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'justify'}) ? 'is-active' : ''}>
                        Justify
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>List</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().toggleBulletList().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'left'}) ? 'is-active' : ''}>
                        Bullet List
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}
                              style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'center'}) ? 'is-active' : ''}>
                        Ordered List
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>Code</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().toggleCode().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'left'}) ? 'is-active' : ''}>
                        Inline Code
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={{flex: "1 1 auto"}}
                              className={editor.isActive({textAlign: 'center'}) ? 'is-active' : ''}>
                        Code Block
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button} onClick={() => {
                    onOpen();
                }}>Image</MenuButton>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            rightIcon={<GoChevronDown/>}>Font</MenuButton>
                <MenuList>
                    <MenuItem onClick={() => editor.chain().focus().unsetFontFamily().run()} style={{flex: "1 1 auto"}}>
                        Default
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setFontFamily("Comic Sans MS, Comic Sans").run()} style={{flex: "1 1 auto"}}>
                        Comic Sans
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setFontFamily("sans-serif").run()} style={{flex: "1 1 auto"}}>
                        Sans Serif
                    </MenuItem>
                    <MenuItem onClick={() => editor.chain().focus().setFontFamily("monospace").run()} style={{flex: "1 1 auto"}}>
                        Monospace
                    </MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton marginInline=".7rem" marginBlock=".7rem" as={Button}
                            onClick={() => {
                                (document.getElementById("post-color-picker") as HTMLInputElement).click();
                            }}
                >Color</MenuButton>
                <input
                    type="color"
                    // @ts-ignore
                    onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                    value={editor.getAttributes('textStyle').color}
                    id={"post-color-picker"}
                    style={{ display: "none"}}
                />
            </Menu>

        </Flex>
    )
}

const TipTap = (props: {
    parentPost?: string,
    setShowEditor?: Dispatch<SetStateAction<boolean>>
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Highlight.configure({
                multicolor: true
            }),
            Code,
            CodeBlock,
            Image.configure({
                allowBase64: true
            }),
            FontFamily,
            TextStyle,
            Link.configure({
                autolink: true,
                protocols: ['http', 'https', 'mailto'],
                linkOnPaste: true,
                HTMLAttributes: {
                    class: "post-link"
                }
            }),
            Color
        ],
        content: '<p>Hello World! 🌎️</p>',
    })

    const {isOpen, onOpen, onClose} = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    return (
        <>
            <PostMediaUploader isOpen={isOpen} onOpen={onOpen} onClose={onClose} editor={editor}/>
            <MenuBar editor={editor} onOpen={onOpen}/>
            <EditorContent editor={editor}/>

            <Box w={"100%"} textAlign={"right"}>
                <Button mt={"2rem"} colorScheme={"whatsapp"} onClick={() => {
                    const html = editor?.getHTML();
                    fetch("/api/community/post/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem("token"),
                            content: html,
                            parent: props.parentPost || null
                        })
                    }).then(res => {
                        res.json().then(data => {
                            if (data.success) {
                                if(props.parentPost) {
                                    toast({
                                        title: "Comment created!",
                                        description: "Your comment has been created and will be visible soon.",
                                        status: "success",
                                        duration: 6000,
                                        isClosable: false,
                                        position: "top",
                                    });
                                    if(props.setShowEditor) {
                                        props.setShowEditor(false)
                                    }
                                } else {
                                    window.location.href = "/community/post/" + data.post;
                                }
                            } else {
                                toast({
                                    title: "Error",
                                    description: data.error,
                                    status: "error",
                                    duration: 9000,
                                });
                            }
                        })
                    })
                }}>Publish</Button>
            </Box>
        </>
    )
}

export default TipTap;