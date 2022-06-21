/**
 * src/pages/account/reset-password.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Flex,
    Heading,
    Text,
    useColorModeValue,
    Link as ChakraLink,
    FormLabel, Input, FormControl, FormErrorMessage, Button
} from "@chakra-ui/react";
import Link from "next/link";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

export default function Reset() {
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertType, setAlertType] = React.useState<'error' | 'info' | 'success' | 'warning'>('error');

    const [emailInvalid, setEmailInvalid] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');

    const [loading, setLoading] = React.useState(false);

    const [forceDisable, setForceDisable] = React.useState(false);

    const {t} = useTranslation();

    return (
        <>
            {
                alertVisible ? (
                    <Alert status={alertType} variant={"top-accent"}>
                        <AlertIcon/>
                        <AlertDescription>{alertMessage}</AlertDescription>
                    </Alert>
                ) : null
            }
            <Flex alignItems={"center"} justifyContent={"center"} minW={"100%"} minH={"100vh"} padding={"1.2rem"}>
                <Box maxW={["100%", "50%"]} minW={["100%", "50%"]} bgColor={useColorModeValue("gray.400", "gray.900")}
                     padding={"4rem"} rounded={"12px"} shadow={"xl"}>
                    <Flex direction={"column"} gap={"2rem"}>
                        <Flex alignItems={"center"} justifyContent={"center"} direction={"column"}>
                            <Heading size={"xl"}>
                                {
                                    t("reset-password:reset-password")
                                }
                            </Heading>
                            <Text textAlign={"center"} mt={".4rem"}>
                                {
                                    t("reset-password:subtitle_start")
                                }&nbsp;
                                <Link href={"/account/login"}>
                                    <ChakraLink href={"/account/login"} color={"blue.400"}>
                                        {
                                            t("account:login")
                                        }
                                    </ChakraLink>
                                </Link>
                                &nbsp;
                                {
                                    t("reset-password:subtitle_end")
                                }
                            </Text>
                        </Flex>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setLoading(true);

                            fetch("/api/account/reset", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    // @ts-ignore
                                    email: e.target.elements.email.value
                                })
                            }).then((res) => {
                                res.json().then((data) => {
                                    setLoading(false);
                                    if (res.status === 200) {
                                        setAlertVisible(true);
                                        setAlertMessage(data.message);
                                        setAlertType('success');
                                        setForceDisable(true)
                                    } else {
                                        setAlertVisible(true);
                                        setAlertMessage(data.error);
                                        setAlertType('error');
                                    }
                                });
                            })
                        }}>
                            <FormControl isInvalid={emailInvalid}>
                                <FormLabel htmlFor={"email"}>Email</FormLabel>
                                <Input id={"email"} placeholder={"Email"}
                                       onChange={(e) => {

                                       }}/>
                                <FormErrorMessage>{emailError}</FormErrorMessage>
                            </FormControl>
                            <Button variant={"solid"} type={"button"} isLoading={loading} disabled={forceDisable || loading } w={"100%"} mt={"2rem"}>
                                {
                                    t("reset-password:reset-password")
                                }
                            </Button>
                        </form>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export async function getServerSideProps({locale}: { locale: string }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'account', 'navbar', 'footer', 'reset-password']),
        }
    }
}