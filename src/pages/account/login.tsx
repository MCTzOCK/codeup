/**
 * src/pages/account/register.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import * as React from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading, HStack,
    Input,
    InputGroup,
    InputRightElement,
    Link as ChakraLink, PinInput, PinInputField,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import Link from "next/link";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import useUserLoggedInRedirect from "../../hooks/useUserLoggedInRedirect";
import redirect from "../../util/userworkflow/redirect";
import {useEffect} from "react";

export default function Register() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const [btnDisabled, setBtnDisabled] = React.useState(false);

    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertType, setAlertType] = React.useState<'error' | 'info' | 'success' | 'warning'>('error');

    const [_2fa, set2fa] = React.useState(false);


    useEffect(() => {
        redirect({
            allowAnonymous: true,
            redirectTo: '/dashboard',
            redirectToLogin: false,
            forceAnonymous: true
        })

    }, [])

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
                    {
                        !_2fa ?
                            <>
                                <Flex direction={"column"} gap={"2rem"}>
                                    <Flex alignItems={"center"} justifyContent={"center"} direction={"column"}>
                                        <Heading size={"xl"}>Login</Heading>
                                        <Text textAlign={"center"} mt={".4rem"}>Login to your account or&nbsp;
                                            <Link href={"/account/register"}>
                                                <ChakraLink color={"blue.400"}
                                                            href={"/account/register"}>register</ChakraLink>
                                            </Link>
                                            &nbsp;a new one.
                                        </Text>
                                    </Flex>
                                    <FormControl>
                                        <FormLabel htmlFor={"email"}>Email</FormLabel>
                                        <Input id={"email"} placeholder={"Email"}
                                               onChange={(e) => {
                                                   setEmail(e.target.value);
                                               }}/>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor={"password"}>Password</FormLabel>
                                        <InputGroup>
                                            <Input id={"password"} placeholder={"Password"}
                                                   type={passwordVisible ? "text" : "password"}
                                                   onChange={(e) => {
                                                       setPassword(e.target.value);
                                                   }}/>
                                            <InputRightElement cursor={"pointer"} onClick={() => {
                                                setPasswordVisible(!passwordVisible);
                                            }}>
                                                {
                                                    passwordVisible ? <AiFillEyeInvisible/> : <AiFillEye/>
                                                }
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Button variant={"solid"} type={"button"} isLoading={btnDisabled} disabled={btnDisabled} onClick={() => {

                                        setBtnDisabled(true);

                                        fetch("/api/account/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                email,
                                                password
                                            })
                                        }).then((res) => {
                                            res.json().then((data) => {
                                                if (res.status !== 200) {
                                                    setAlertType("error");
                                                    setAlertMessage(data.error);
                                                    setAlertVisible(true);
                                                    setBtnDisabled(false)
                                                } else {
                                                    if (data.token) {
                                                        localStorage.setItem("token", data.token);
                                                        window.location.href = "/dashboard";
                                                    } else {
                                                        set2fa(true)
                                                    }
                                                }

                                            })
                                        })
                                    }}>
                                        Login
                                    </Button>
                                    <Text textAlign={"center"} mt={"1rem"}>
                                        Forgot your password? <Link href={"/account/reset"}><ChakraLink
                                        href={"/account/reset-password"} color={"blue.400"}>Reset
                                        it.</ChakraLink></Link>
                                    </Text>
                                </Flex>
                            </>
                            :
                            <>
                                <Flex direction={"column"} gap={"2rem"}>
                                    <Flex alignItems={"center"} justifyContent={"center"} direction={"column"}>
                                        <Heading size={"xl"} textAlign={"center"}>2-Factor Authentication</Heading>
                                        <Text textAlign={"center"} mt={".4rem"}>
                                            Check your email for a code.
                                        </Text>
                                    </Flex>
                                    <HStack alignItems={"center"} justifyContent={"center"}>
                                        <PinInput size='lg' onComplete={(code) => {
                                            fetch("/api/account/login", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    email,
                                                    password,
                                                    code
                                                })
                                            }).then((res) => {
                                                res.json().then((data) => {
                                                    if (res.status !== 200) {
                                                        setAlertType("error");
                                                        setAlertMessage(data.error);
                                                        setAlertVisible(true);
                                                    } else {
                                                        localStorage.setItem("token", data.token);
                                                        const redirect = new URLSearchParams(window.location.search).get("redirect");
                                                        if (redirect) {
                                                            window.location.href = redirect;
                                                        } else {
                                                            window.location.href = "/dashboard";
                                                        }
                                                    }
                                                })
                                            })}
                                        }>
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                        </PinInput>
                                    </HStack>
                                </Flex>
                            </>
                    }
                </Box>
            </Flex>
        </>
    )
}