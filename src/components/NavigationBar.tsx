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
    Heading, IconButton,
    Link,
    useColorModeValue, useDisclosure,
    useMediaQuery
} from "@chakra-ui/react";
import {GiHamburgerMenu} from "react-icons/gi";
import useUserInfo from "../hooks/useUserInfo";

export default function NavigationBar() {
    const [isMobile] = useMediaQuery("(max-width: 768px)")
    const { isOpen, onOpen, onClose } = useDisclosure()

    const userInfo = useUserInfo();

    return (
        <>
            <Box w={"100%"} bg={useColorModeValue("gray.400", "gray.900")} padding={"1.2rem"}>
                <Flex direction={["column", "row"]}>
                    <Heading flex={"flex-start"} textAlign={["center", "left"]}><Link href={"/"}>CodeUp</Link></Heading>
                    <Flex justifyContent={"center"} flex={"100%"} alignItems={"center"}>
                        {
                            !isMobile ?
                                <>
                                    <Button variant={"ghost"}>
                                        <Link href={"/"}>Home</Link>
                                    </Button>
                                </>
                                :
                                <>
                                    <IconButton onClick={onOpen}
                                                aria-label={'Menu'}
                                                icon={<GiHamburgerMenu />}
                                                mt={"2rem"}
                                    />
                                    <Drawer
                                        isOpen={isOpen}
                                        placement='right'
                                        onClose={onClose}
                                        size={"full"}
                                    >
                                        <DrawerOverlay/>
                                        <DrawerContent>
                                            <DrawerCloseButton/>
                                            <DrawerHeader>CodeUp</DrawerHeader>

                                            <DrawerBody>
                                                <Heading>Menu</Heading>
                                            </DrawerBody>

                                        </DrawerContent>
                                    </Drawer>
                                </>
                        }
                    </Flex>
                    <Flex justifyContent={["center", "flex-end"]} flex={"10%"} alignItems={"center"} gap={"1.2rem"}
                          mt={["2rem", 0]}>
                        {
                            userInfo.id === "" ?
                                <>
                                    <Button variant={"solid"} colorScheme={"whatsapp"}>
                                        <Link href={"/account/register"}>Join</Link>
                                    </Button>
                                    <Button variant={"solid"}>
                                        <Link href={"/account/login"}>Login</Link>
                                    </Button>
                                </>
                                :
                                <>
                                    <Button variant={"solid"} colorScheme={"red"}>
                                        <Link href={"/account/logout"}>Logout</Link>
                                    </Button>
                                </>
                        }
                    </Flex>

                </Flex>
            </Box>
            <Divider/>
        </>
    )
}