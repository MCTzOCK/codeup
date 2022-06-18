/**
 * src/pages/community/profile/[id].ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.06.2022
 *
 */
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import redirect from "../../../util/userworkflow/redirect";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Text,
    Textarea,
    useDisclosure, useToast
} from "@chakra-ui/react";
import ProfileBadges from "../../../components/community/profile/ProfileBadges";
import ProfileBanner from "../../../components/community/profile/ProfileBanner";
import ProfileAvatar from "../../../components/community/profile/ProfileAvatar";
import ProfileNotFound from "../../../components/community/profile/ProfileNotFound";
import ProfileMenuButton from "../../../components/community/profile/ProfileMenuButton";
import useUserInfo from "../../../hooks/useUserInfo";
import {FaBirthdayCake, FaGlobe, FaMapMarkerAlt} from "react-icons/fa";

export default function ProfileView() {

    const router = useRouter();

    const [profile, setProfile] = useState({
        _id: "",
        user: "",
        profilePicture: "",
        profileBanner: "",
        username: "",
        displayName: "",
        verified: false,
        specialStatus: "",
        bio: "",
        location: "",
        birthday: "",
        sexuality: "",
        gender: "",
        followers: [],
        createdAt: new Date(),
        website: "",
        __v: 0
    });

    const name = router.query.name;

    const [notFound, setNotFound] = useState(false);
    const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useDisclosure()

    useEffect(() => {
        redirect({
            allowAnonymous: false,
            redirectTo: window.location.href,
            redirectToLogin: true,
            forceAnonymous: false
        })
    }, [])

    const userInfo = useUserInfo();

    useEffect(() => {
        fetch("/api/community/profile/" + name, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            res.json().then(data => {
                if (res.status === 200) {
                    setProfile(data.profile)
                    setNotFound(false);
                } else {
                    setNotFound(true)
                }
            })
        })
    }, [name, userInfo])

    const [displayNameValid, setDisplayNameValid] = useState(true);
    const [bioValid, setBioValid] = useState(true);
    const [locationValid, setLocationValid] = useState(true);
    const [birthdayValid, setBirthdayValid] = useState(true);
    const [websiteValid, setWebsiteValid] = useState(true);

    const toast = useToast();


    return (
        <>
            {
                notFound ? <ProfileNotFound/> : <Profile profile={profile} editProfile={{
                    isEditOpen,
                    onEditOpen,
                    onEditClose
                }}/>
            }
            <Drawer
                isOpen={isEditOpen}
                placement='left'
                onClose={onEditClose}
                size={['full', 'lg']}
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        setDisplayNameValid(true);
                        setBioValid(true);
                        setLocationValid(true);
                        setBirthdayValid(true);
                        setWebsiteValid(true);


                        const displayName = (document.getElementById("displayName") as HTMLInputElement).value;
                        const bio = (document.getElementById("biography") as HTMLTextAreaElement).value;
                        const location = (document.getElementById("location") as HTMLInputElement).value;
                        const birthday = (document.getElementById("birthday") as HTMLInputElement).value;
                        const website = (document.getElementById("website") as HTMLInputElement).value;

                        if (!(displayName.length > 0 && displayName.length < 51)) {
                            setDisplayNameValid(false);
                            return;
                        }

                        if (!(bio.length > 0 && bio.length < 201)) {
                            setBioValid(false);
                            return;
                        }


                        if(website.length > 0) {
                            if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(website)) {
                                setWebsiteValid(false);
                                return;
                            }
                        }

                        if (!(location.length < 51)) {
                            setLocationValid(false);
                            return;
                        }

                        if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
                            setBirthdayValid(false);
                            return;
                        }


                        fetch("/api/community/profile/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                token: localStorage.getItem("token"),
                                update: {
                                    displayName,
                                    bio,
                                    location,
                                    birthday,
                                    website
                                }
                            })
                        }).then(res => {
                            if(res.status === 200) {
                                toast({
                                    title: "Profile Updated",
                                    description: "Your profile has been updated successfully",
                                    status: "success",
                                    position: "top",
                                    duration: 3000,
                                    onCloseComplete: () => {
                                        window.location.reload();
                                    }
                                })
                            } else {
                                toast({
                                    title: "Profile Update Failed",
                                    description: "Your profile update failed",
                                    status: "error",
                                })
                            }
                        })

                    }}>

                        <DrawerCloseButton/>
                        <DrawerHeader>Edit Profile</DrawerHeader>

                        <DrawerBody>
                            <Flex flexDirection='column' gap={"2rem"}>
                                <FormControl isInvalid={!displayNameValid}>
                                    <FormLabel>Displayname</FormLabel>
                                    <Input id={"displayName"} placeholder={"Displayname"}
                                           defaultValue={profile.displayName}/>
                                    <FormErrorMessage>This Displayname is not valid!</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!bioValid}>
                                    <FormLabel>Biography</FormLabel>
                                    <Textarea id={"biography"} placeholder={"Biography"} defaultValue={profile.bio}
                                              maxLength={256}/>
                                    <FormErrorMessage>This Biography is not valid!</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!websiteValid}>
                                    <FormLabel>Website</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon>
                                            <FaGlobe/>
                                        </InputLeftAddon>
                                        <Input id={"website"} placeholder={"Website"} defaultValue={profile.website}/>
                                    </InputGroup>
                                    <FormErrorMessage>This Website is not valid!</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!locationValid}>
                                    <FormLabel>Location</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon>
                                            <FaMapMarkerAlt/>
                                        </InputLeftAddon>
                                        <Input id={"location"} placeholder={"Location"}
                                               defaultValue={profile.location}/>
                                    </InputGroup>
                                    <FormErrorMessage>This Location is not valid!</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!birthdayValid}>
                                    <FormLabel>Birthday</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon>
                                            <FaBirthdayCake/>
                                        </InputLeftAddon>
                                        <Input id={"birthday"} type={"date"} placeholder={"Birthday"}
                                               defaultValue={profile.birthday}/>
                                    </InputGroup>
                                    <FormErrorMessage>This Birthday is not valid!</FormErrorMessage>
                                </FormControl>
                            </Flex>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onEditClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' type={"submit"}>Save</Button>
                        </DrawerFooter>

                    </form>
                </DrawerContent>
            </Drawer>
        </>
    )
}

function Profile(props: {
    profile: {
        _id: string,
        user: string,
        username: string
        profilePicture: string,
        profileBanner: string,
        displayName: string,
        verified: boolean,
        specialStatus: string,
        bio: string,
        location: string,
        birthday: string,
        sexuality: string,
        gender: string,
        followers: string[],
        createdAt: Date,
        website: string,
        __v: number,
    },
    editProfile: {
        onEditOpen: () => void,
        onEditClose: () => void,
        isEditOpen: boolean
    }
}) {
    return (
        <>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                direction={"column"}
            >
                <Box
                    maxWidth={1640}
                    minHeight={[312, 624]}
                    minWidth={{base: "fit-content", xl: 1640}}
                >
                    <ProfileBanner url={props.profile.profileBanner}/>
                    <Flex flexDirection={["column", "row"]} flex={"100%"} gap={"1.2rem"}>
                        <ProfileAvatar url={props.profile.profilePicture}/>
                        <Flex
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                            flex={"20%"}
                            mt={"1rem"}
                            ml={[0, "-128px"]}
                        >
                            <Heading as={"h1"} fontSize={["3xl", "4xl"]}>
                                {props.profile.displayName}
                            </Heading>
                            <Text color={"gray.500"}>
                                @{props.profile.username}
                            </Text>
                            <ProfileBadges verified={props.profile.verified}
                                           specialStatus={props.profile.specialStatus}/>
                        </Flex>
                        <ProfileMenuButton profile={{
                            website: props.profile.website,
                            username: props.profile.username
                        }} editProfile={props.editProfile}/>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

