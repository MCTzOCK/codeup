/**
 * src/pages/settings.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.06.2022
 *
 */

import * as React from 'react';
import {useEffect} from 'react';
import useUserInfo from "../../hooks/useUserInfo";
import redirect from "../../util/userworkflow/redirect";
import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    SimpleGrid,
    Spinner,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import {FaUserCircle} from "react-icons/fa";
import {BsFillHouseDoorFill} from "react-icons/bs";
import {useRouter} from "next/router";

export default function Settings() {

    const router = useRouter();

    useEffect(() => {
        redirect({
            allowAnonymous: false,
            redirectTo: '/account/settings',
            redirectToLogin: true,
            forceAnonymous: false
        })
    }, [])

    const userInfo = useUserInfo();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.has('component')) {
            switch (query.get('component')) {
                case 'account':
                    setCurrentComponent(<Account userInfo={userInfo}/>)
                    setCurrentSelected("account")
                    break;
                default:
                    setCurrentComponent(<Home userInfo={userInfo}/>)
                    setCurrentSelected("home")
                    break;
            }
        } else {
            setCurrentComponent(<Home userInfo={userInfo}/>)
            setCurrentSelected("home")
        }
        if(query.has("newToken")) {
            alert("Hello world")
            localStorage.setItem("token", query.get("newToken") as string)
            window.location.href = "/account/settings?component=account";
        }
    }, [userInfo])

    const [currentComponent, setCurrentComponent] = React.useState<JSX.Element | null>(<><Spinner size='xl'/></>)

    const [currentSelected, setCurrentSelected] = React.useState<string>('home')

    return (
        <>
            <Flex direction={["column", "row"]} minW={"100%"} minH={"100vh"}>
                <Flex direction={"column"} flex={"15%"} minH={"100%"}
                      bgColor={useColorModeValue("gray.400", "gray.900")} p={"1.2rem"}>
                    <Heading textAlign={"center"}>Settings</Heading>
                    <Button m={"1.2rem"} variant={currentSelected === "home" ? "solid" : "ghost"}
                            leftIcon={<BsFillHouseDoorFill/>} onClick={() => {
                        setCurrentSelected('home')
                        setCurrentComponent(<Home userInfo={userInfo}/>)
                        router.push("/account/settings?component=home")
                    }}>Home</Button>
                    <Button marginInline={"1.2rem"} variant={currentSelected === "account" ? "solid" : "ghost"}
                            leftIcon={<FaUserCircle/>} onClick={() => {
                        setCurrentSelected('account')
                        setCurrentComponent(<Account userInfo={userInfo}/>)
                        router.push("/account/settings?component=account")
                    }}>Account</Button>
                </Flex>
                <Flex direction={"column"} flex={"85%"} minH={"100%"}>
                    {
                        currentComponent
                    }
                </Flex>
            </Flex>
        </>
    )
}

function Home(props: {
    userInfo: {
        id: string,
        email: string,
        firstName: string,
        lastName: string,
    }
}) {
    return (
        <Flex alignItems={"center"} justifyContent={"center"} marginTop={"-2rem"} w={"100%"} h={"100vh"}
              direction={"column"} textAlign={"center"}>
            <Heading mb={"1.2rem"}>Welcome, {props.userInfo.firstName}!</Heading>
            <Text>Here you can manage your account and other settings to customize CodeUp as you like.</Text>
            <Text>Pick a section from the left/top to change your preferences!</Text>
        </Flex>
    )
}

function Account(props: {
    userInfo: {
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        _2fa: boolean,
    }
}) {

    console.log(props)

    const [firstNameButtonDisabled, setFirstNameButtonDisabled] = React.useState<boolean>(false)
    const [lastNameButtonDisabled, setLastNameButtonDisabled] = React.useState<boolean>(false)
    const [emailButtonDisabled, setEmailButtonDisabled] = React.useState<boolean>(false)
    const [_2faButtonDisabled, set_2faButtonDisabled] = React.useState<boolean>(false)

    const [firstNameError, setFirstNameError] = React.useState<string | null>(null)
    const [lastNameError, setLastNameError] = React.useState<string | null>(null)
    const [emailError, setEmailError] = React.useState<string | null>(null)

    return (
        <>
            <Heading textAlign={"center"} mb={"1.2rem"} mt={"1.2rem"}>Manage Account</Heading>
            <SimpleGrid minChildWidth={200} spacing={"2rem"} margin={"2rem"} columns={1}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    setFirstNameButtonDisabled(true)
                    setFirstNameError(null)

                    // @ts-ignore
                    const firstName = e.target.elements.firstName.value;

                    if (firstName === "") {
                        setFirstNameError("First name cannot be empty!")
                        setFirstNameButtonDisabled(false)
                        return
                    }

                    fetch("/api/account/update", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem("token") as string,
                            keyName: "firstName",
                            keyValue: firstName
                        })
                    }).then(res => {
                        res.json().then(data => {
                            if (data.success) {
                                localStorage.setItem("token", data.newToken)
                                window.location.reload();
                            } else {
                                setFirstNameError(data.error)
                                setFirstNameButtonDisabled(false)
                            }
                        })
                    })

                }}>
                    <Flex direction={"column"}>
                        <FormControl isInvalid={firstNameError !== null}>
                            <FormLabel htmlFor="firstName">First Name</FormLabel>
                            <Input id="firstName" defaultValue={props.userInfo.firstName}/>
                            <FormErrorMessage>{firstNameError}</FormErrorMessage>
                            <Button type="submit" disabled={firstNameButtonDisabled} isLoading={firstNameButtonDisabled}
                                    colorScheme="blue" marginBlock={"1.2rem"}>Update</Button>
                        </FormControl>
                    </Flex>
                </form>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    setLastNameButtonDisabled(true)
                    setLastNameError(null)

                    // @ts-ignore
                    const lastName = e.target.elements.lastName.value;

                    if (lastName === "") {
                        setLastNameError("Last name cannot be empty!")
                        setLastNameButtonDisabled(false)
                        return
                    }

                    fetch("/api/account/update", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem("token") as string,
                            keyName: "lastName",
                            keyValue: lastName
                        })
                    }).then(res => {
                        res.json().then(data => {
                            if (data.success) {
                                localStorage.setItem("token", data.newToken)
                                window.location.reload();
                            } else {
                                setLastNameError(data.error)
                                setLastNameButtonDisabled(false)
                            }
                        })
                    })

                }}>
                    <Flex direction={"column"}>
                        <FormControl isInvalid={lastNameError !== null}>
                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                            <Input id="lastName" defaultValue={props.userInfo.lastName}/>
                            <FormErrorMessage>{lastNameError}</FormErrorMessage>
                            <Button type="submit" disabled={lastNameButtonDisabled} isLoading={lastNameButtonDisabled}
                                    colorScheme="blue" marginBlock={"1.2rem"}>Update</Button>
                        </FormControl>
                    </Flex>
                </form>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    setEmailButtonDisabled(true)
                    setEmailError(null)

                    // @ts-ignore
                    const email = e.target.elements.email.value;

                    if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                        setEmailError("Invalid email!")
                        setEmailButtonDisabled(false)
                        return
                    }

                    fetch("/api/account/update", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem("token") as string,
                            keyName: "email",
                            keyValue: email
                        })
                    }).then(res => {
                        res.json().then(data => {
                            if (data.success) {
                                setEmailError("Check your email to verify your new email address!")
                                setEmailButtonDisabled(false)
                            } else {
                                setEmailError(data.error)
                                setEmailButtonDisabled(false)
                            }
                        })
                    })

                }}>
                    <Flex direction={"column"}>
                        <FormControl isInvalid={emailError !== null}>
                            <FormLabel htmlFor="email">E-Mail</FormLabel>
                            <Input id="email" defaultValue={props.userInfo.email}/>
                            <FormErrorMessage>{emailError}</FormErrorMessage>
                            <Button type="submit" disabled={emailButtonDisabled} isLoading={emailButtonDisabled}
                                    colorScheme="blue" marginBlock={"1.2rem"}>Update</Button>
                        </FormControl>
                    </Flex>
                </form>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    set_2faButtonDisabled(true)


                    console.log(!props.userInfo._2fa)

                    fetch("/api/account/update", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem("token") as string,
                            keyName: "2fa",
                            keyValue: !props.userInfo._2fa === true ? "true" : "false"
                        })
                    }).then(res => {
                        res.json().then(data => {
                            if (data.success) {
                                localStorage.setItem("token", data.newToken)
                                window.location.reload();
                            }
                        })
                    })

                }}>
                    <Flex direction={"column"}>
                        <FormControl>
                            <FormLabel>2 Factor</FormLabel>
                            <Button type="submit" disabled={_2faButtonDisabled} isLoading={_2faButtonDisabled}
                                    colorScheme={
                                        props.userInfo._2fa ? "red" : "green"
                                    }>
                                {
                                    props.userInfo._2fa ? "Disable 2FA" : "Enable 2FA"
                                }
                            </Button>
                        </FormControl>
                    </Flex>
                </form>
            </SimpleGrid>
        </>
    )
}