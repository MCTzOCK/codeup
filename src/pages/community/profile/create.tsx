/**
 * src/pages/community/profile/create.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */

import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    Textarea,
    useToast
} from "@chakra-ui/react";
import redirect from "../../../util/userworkflow/redirect";
import useHasProfile from "../../../hooks/hasProfile";

export default function Create() {

    const hasProfile = useHasProfile();

    useEffect(() => {

        if (hasProfile.tried && hasProfile.hasProfile) {
            redirect({
                allowAnonymous: false,
                redirectTo: '/community',
                redirectToLogin: false,
                forceAnonymous: false
            })
        }

    }, [hasProfile]);

    const [displayNameInvalid, setDisplayNameInvalid] = useState(false)
    const [bioInvalid, setBioInvalid] = useState(false)

    const toast = useToast({
        position: 'top',
    });

    return (
        <>
            <Flex justifyContent={"center"} minW={"100%"} minH={"99vh"}>
                <Box mt={"2rem"} background={"gray.900"} p={"2rem"} rounded={"xl"} h={"fit-content"}>
                    <Heading color={"green.300"} fontSize={"10rem"} textAlign={"center"} display={"flex"}
                             flexDirection={"column"} as={"div"}>
                        <Heading color={"white"}>
                            Create your profile
                        </Heading>
                    </Heading>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (displayNameInvalid || bioInvalid) {
                            return;
                        }
                        // @ts-ignore
                        const displayName = e.target.elements.displayName.value
                        // @ts-ignore
                        const bio = e.target.elements.bio.value

                        fetch('/api/community/profile/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                displayName,
                                bio,
                                token: localStorage.getItem('token')
                            })
                        }).then(res => {
                            res.json().then(data => {
                                if (data.success) {
                                    toast({
                                        title: 'Profile created',
                                        description: 'Your profile has been created successfully. You will be redirected soon.',
                                        status: 'success',
                                        duration: 3000,
                                        onCloseComplete: () => {
                                            window.location.href = "/community";
                                        }
                                    });
                                }
                            })
                        })
                    }}>
                        <FormControl isInvalid={displayNameInvalid} mt={"2rem"} isRequired>
                            <FormLabel htmlFor={"displayName"}>Display Name</FormLabel>
                            <InputGroup>
                                <Input name={"displayName"} placeholder={"Display Name"} onChange={(e) => {
                                    // @ts-ignore
                                    if (e.target.value.length > 0) {
                                        setDisplayNameInvalid(false)
                                    } else {
                                        setDisplayNameInvalid(true)
                                    }
                                }}/>
                            </InputGroup>
                            <FormErrorMessage>Display Name is required</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={bioInvalid} mt={"2rem"} isRequired>
                            <FormLabel htmlFor={"bio"}>Biography</FormLabel>
                            <InputGroup>
                                <Textarea name={"bio"} placeholder={"Biography"} onChange={(e) => {
                                    // @ts-ignore
                                    if (e.target.value.length > 0) {
                                        setBioInvalid(false)
                                    } else {
                                        setBioInvalid(true)
                                    }
                                }}/>
                            </InputGroup>
                            <FormErrorMessage>Biography is required</FormErrorMessage>
                        </FormControl>
                        <Box mt={"2rem"} textAlign={"center"}>
                            <Button type={"submit"} colorScheme={"whatsapp"}>Create</Button>
                        </Box>
                    </form>
                </Box>
            </Flex>
        </>
    )
}