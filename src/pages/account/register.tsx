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
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Link as ChakraLink,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import Link from "next/link";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";

export default function Register() {

    const [firstNameInvalid, setFirstNameInvalid] = React.useState(false);
    const [lastNameInvalid, setLastNameInvalid] = React.useState(false);
    const [emailInvalid, setEmailInvalid] = React.useState(false);
    const [passwordInvalid, setPasswordInvalid] = React.useState(false);
    const [passwordConfirmInvalid, setPasswordConfirmInvalid] = React.useState(false);


    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = React.useState(false);

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');

    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertType, setAlertType] = React.useState<'error' | 'info' | 'success' | 'warning'>('error');


    return (
        <>
            {
                alertVisible ? (
                    <Alert status={alertType} variant={"top-accent"}>
                        <AlertIcon/>
                        <AlertDescription>{alertMessage}</AlertDescription>
                    </Alert>
                    ): null
            }
            <Flex alignItems={"center"} justifyContent={"center"} minW={"100%"} minH={"100vh"} padding={"1.2rem"}>
                <Box maxW={["100%", "50%"]} minW={["100%", "50%"]} bgColor={useColorModeValue("gray.400", "gray.900")}
                     padding={"4rem"} rounded={"12px"} shadow={"xl"}>
                    <Flex direction={"column"} gap={"2rem"}>
                        <Flex alignItems={"center"} justifyContent={"center"} direction={"column"}>
                            <Heading size={"xl"}>Register</Heading>
                            <Text textAlign={"center"} mt={".4rem"}>Create an account or&nbsp;
                                <Link href={"/account/login"}>
                                    <ChakraLink color={"blue.400"} href={"/account/login"}>login</ChakraLink>
                                </Link>
                                &nbsp;to an existing one.
                            </Text>
                        </Flex>
                        <Flex direction={"row"} gap={"2rem"}>
                            <FormControl isInvalid={firstNameInvalid}>
                                <FormLabel htmlFor={"firstName"}>First Name</FormLabel>
                                <Input id={"firstName"} placeholder={"First Name"}
                                       onChange={(e) => {
                                           if (e.target.value.length > 0) {
                                               setFirstNameInvalid(false);
                                               setFirstName(e.target.value);
                                           } else {
                                               setFirstNameInvalid(true);
                                           }
                                       }}/>
                                <FormErrorMessage>Please enter your first name</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={lastNameInvalid}>
                                <FormLabel htmlFor={"lastName"}>Last Name</FormLabel>
                                <Input id={"lastName"} placeholder={"Last Name"}
                                       onChange={(e) => {
                                           if (e.target.value.length > 0) {
                                               setLastNameInvalid(false);
                                               setLastName(e.target.value);
                                           } else {
                                               setLastNameInvalid(true);
                                           }
                                       }}/>
                                <FormErrorMessage>Please enter your Last name</FormErrorMessage>
                            </FormControl>
                        </Flex>
                        <FormControl isInvalid={emailInvalid}>
                            <FormLabel htmlFor={"email"}>Email</FormLabel>
                            <Input id={"email"} placeholder={"Email"}
                                   onChange={(e) => {
                                       if (e.target.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                                           setEmailInvalid(false);
                                           setEmail(e.target.value);
                                       } else {
                                           setEmailInvalid(true);
                                       }
                                   }}/>
                            <FormErrorMessage>Please enter a valid email</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={passwordInvalid}>
                            <FormLabel htmlFor={"password"}>Password</FormLabel>
                            <InputGroup>
                                <Input id={"password"} placeholder={"Password"}
                                       type={passwordVisible ? "text" : "password"}
                                       onChange={(e) => {
                                           if (e.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
                                               setPasswordInvalid(false);
                                               setPassword(e.target.value);
                                           } else {
                                               setPasswordInvalid(true);
                                           }
                                       }}/>
                                <InputRightElement cursor={"pointer"} onClick={() => {
                                    setPasswordVisible(!passwordVisible);
                                }}>
                                    {
                                        passwordVisible ? <AiFillEyeInvisible/> : <AiFillEye/>
                                    }
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                                Please enter a password with at least 8 characters, one uppercase, one lowercase, one
                                number and one special character
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={passwordConfirmInvalid}>
                            <FormLabel htmlFor={"passwordConfirm"}>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input id={"passwordConfirm"} placeholder={"Confirm Password"}
                                       type={passwordConfirmVisible ? "text" : "password"}
                                       onChange={(e) => {
                                           if (e.target.value === password) {
                                               setPasswordConfirmInvalid(false);
                                               setPasswordConfirm(e.target.value);
                                           } else {
                                               setPasswordConfirmInvalid(true);
                                           }
                                       }}/>
                                <InputRightElement cursor={"pointer"} onClick={() => {
                                    setPasswordConfirmVisible(!passwordConfirmVisible);
                                }}>
                                    {
                                        passwordConfirmVisible ? <AiFillEyeInvisible/> : <AiFillEye/>
                                    }
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                                The passwords do not match
                            </FormErrorMessage>
                        </FormControl>
                        <Button variant={"solid"} type={"button"} onClick={() => {
                            if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
                                setPasswordInvalid(true)
                                return;
                            }

                            if(password !== passwordConfirm) {
                                setPasswordConfirmInvalid(true)
                                return;
                            }

                            if(!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
                                setEmailInvalid(true)
                                return;
                            }


                            if(!(firstName.length > 0)) {
                                setFirstNameInvalid(true)
                                return;
                            }

                            if(!(lastName.length > 0)) {
                                setLastNameInvalid(true)
                                return;
                            }

                            const body = {
                                email: email,
                                password: password,
                                firstName: firstName,
                                lastName: lastName
                            }

                            fetch("/api/account/register", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(body)
                            }).then((res) => {
                                res.json().then((data) => {
                                    if(res.status === 200) {
                                        setAlertType("success")
                                        setAlertMessage(data.message)
                                    } else {
                                        setAlertType("error")
                                        setAlertMessage(data.error)
                                    }
                                    setAlertVisible(true)
                                })
                            })
                        }}>
                            Register
                        </Button>
                        <Text textAlign={"center"} mt={"1rem"}>
                            By registering, you agree to our <Link href={"/legal/tos"}>
                            <ChakraLink href={"/legal/tos"} color={"blue.400"}>
                                Terms of Service
                            </ChakraLink></Link> and <Link href={"/legal/privacy"}>
                            <ChakraLink href={"/legal/privacy"} color={"blue.400"}>
                                Privacy Policy
                            </ChakraLink></Link>
                        </Text>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}