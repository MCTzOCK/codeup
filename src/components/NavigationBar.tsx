/**
 * src/components/NavigationBar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from 'react';
import {
    Box,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    Link as ChakraLink,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
    useMediaQuery
} from "@chakra-ui/react";
import {GiHamburgerMenu} from "react-icons/gi";
import useUserInfo from "../hooks/useUserInfo";
import Link from "next/link";
import {AiFillCaretDown} from "react-icons/ai";
import {useTranslation} from "react-i18next";

export default function NavigationBar() {
    const [isMobile] = useMediaQuery("(max-width: 768px)")
    const {isOpen, onOpen, onClose} = useDisclosure()

    const userInfo = useUserInfo();

    const {t} = useTranslation(["common", "account", "navbar"])

    const Menu = () => {
        return (
            <>
                <Link href={"/"}>
                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                        {
                            t('common:home')
                        }
                    </Button>
                </Link>
                <Link href={"/explore"}>
                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                        {
                            t("navbar:explore")
                        }
                    </Button>
                </Link>
                <Popover>
                    <PopoverTrigger>
                        <Button variant={"ghost"} size={"lg"} rightIcon={<AiFillCaretDown/>}>
                            {
                                t("common:more")
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent bg={"black"}>
                        <PopoverArrow/>
                        <PopoverBody>
                            <Flex w={"100%"} direction={"column"}>
                                <Link href={"/extra/project-ideas"}>
                                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                        {
                                            t("navbar:project-ideas")
                                        }
                                    </Button>
                                </Link>
                                <Link href={"/community"}>
                                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                        {
                                            t("navbar:community")
                                        }
                                    </Button>
                                </Link>
                                <Link href={"/hackathons"}>
                                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                        {
                                            t("navbar:hackathons")
                                        }
                                    </Button>
                                </Link>
                                <Link href={"/challenges"}>
                                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                        {
                                            t("navbar:challenges")
                                        }
                                    </Button>
                                </Link>
                                <Link href={"/certificates"}>
                                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                        {
                                            t("navbar:certificates")
                                        }
                                    </Button>
                                </Link>
                                <Link href={"/hosting"}>
                                    <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                        {
                                            t("navbar:hosting")
                                        }
                                    </Button>
                                </Link>
                            </Flex>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>{
                userInfo.id !== "" ?
                    <>
                        <Popover>
                            <PopoverTrigger>
                                <Button variant={"ghost"} size={"lg"} rightIcon={<AiFillCaretDown/>}>
                                    {
                                        t("account:account")
                                    }
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent bg={"black"}>
                                <PopoverArrow/>
                                <PopoverBody>
                                    <Flex w={"100%"} direction={"column"}>
                                        <Link href={"/account/settings"}>
                                            <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                                {
                                                    t("common:settings")
                                                }
                                            </Button>
                                        </Link>

                                        <Link href={"/dashboard"}>
                                            <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                                {
                                                    t("navbar:dashboard")
                                                }
                                            </Button>
                                        </Link>

                                        <Link href={"/account/logout"}>
                                            <Button variant={"ghost"} size={"lg"} onClick={onClose}>
                                                {
                                                    t("account:logout")
                                                }
                                            </Button>
                                        </Link>
                                    </Flex>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </>
                    : null
            }
            </>
        )
    }

    const MenuButtons = () => {
        return (
            <>
                {
                    userInfo.id === "" ?
                        <>
                            <Link href={"/account/register"}>
                                <Button variant={"solid"} colorScheme={"whatsapp"} onClick={onClose}>
                                    {
                                        t("account:join")
                                    }
                                </Button>
                            </Link>
                            <Link href={"/account/login"}>
                                <Button variant={"solid"} onClick={onClose}>
                                    {
                                        t("account:login")
                                    }
                                </Button>
                            </Link>
                        </>
                        :
                        <>
                            <Link href={"/dashboard"}>
                                <Button variant={"solid"} colorScheme={"blue"} onClick={onClose}>
                                    {
                                        t("navbar:dashboard")
                                    }
                                </Button>
                            </Link>
                            <Link href={"/account/logout"}>
                                <Button variant={"solid"} colorScheme={"red"} onClick={onClose}>
                                    {
                                        t("account:logout")
                                    }
                                </Button>
                            </Link>
                        </>
                }
            </>
        )
    }

    return (
        <>
            <Box w={"100%"} bg={"black"} padding={"1.2rem"}>
                <Flex direction={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Heading flex={"flex-start"} textAlign={["center", "left"]}><ChakraLink
                        href={"/"}>CodeUp</ChakraLink></Heading>
                    <Flex justifyContent={isMobile ? "right" : "center"} flex={"100%"} alignItems={"center"}>
                        {
                            !isMobile ? <Menu/>
                                :
                                <>
                                    <IconButton onClick={onOpen}
                                                aria-label={'Menu'}
                                                icon={<GiHamburgerMenu/>}
                                                flex={"flex-end"}
                                    />
                                    <Drawer
                                        isOpen={isOpen}
                                        placement='right'
                                        onClose={onClose}
                                        size={"full"}

                                    >
                                        <DrawerOverlay/>
                                        <DrawerContent bg={"black"}>
                                            <DrawerCloseButton/>
                                            <DrawerHeader>CodeUp</DrawerHeader>

                                            <DrawerBody>
                                                <Flex w={"100%"} direction={"column"}>
                                                    <Menu/>
                                                </Flex>
                                            </DrawerBody>

                                            <DrawerFooter gap={"2rem"} alignItems={"center"} justifyContent={"center"}>
                                                <MenuButtons/>
                                            </DrawerFooter>

                                        </DrawerContent>
                                    </Drawer>
                                </>
                        }
                    </Flex>
                    {
                        !isMobile ?
                            <Flex justifyContent={["center", "flex-end"]} flex={"10%"} alignItems={"center"}
                                  gap={"1.2rem"}
                                  mt={["2rem", 0]}>
                                <MenuButtons/>
                            </Flex>
                            : null
                    }
                </Flex>
            </Box>
            <Divider/>
        </>
    )
}