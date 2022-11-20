/**
 * packages/components/admin/AdminProfileViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.22
 *
 */

import * as React from "react";
import CodeUpModal from "../codeup/CodeUpModal";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCheckSquare,
  FaCross,
  FaEdit,
  FaTrash,
  FaWindowClose,
  FaUser,
  FaLock,
  FaEnvelope,
  FaPen,
  FaUserShield,
  FaMapMarkerAlt,
  FaGlobe,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useEffect } from "react";
import REST from "@codeup/rest";
import { useLoggedIn, useUserInfo } from "@codeup/hooks";

export default function AdminProfileViewer(props: {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  profile: {
    username: string;
    displayName: string;
    verified: boolean;
    bio: string;
    website: string;
    location: string;
    createdAt: string;
  };
  profiles: any[];
  setProfiles: (profiles: any[]) => void;
  setCurrentProfile: (profile: any) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const toast = useToast();

  if (!props.profile) {
    return <></>;
  }

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={() => {
          setEditMode(false);
          props.onClose();
        }}
        isOpen={props.isOpen}
        title={"Profilverwaltung"}
      >
        <form
          id={"upd_forum_profile"}
          onSubmit={async (e) => {
            e.preventDefault();

            const data = new FormData(e.target as HTMLFormElement);

            const displayName = data.get("displayName") as string;
            const bio = data.get("bio") as string;
            const website = data.get("website") as string;
            const location = data.get("location") as string;
            const verified = data.get("verified") as string;

            const r = await REST.Admin.updateForumProfile({
              token: localStorage.getItem("token") as string,
              username: props.profile.username,
              update: {
                displayName:
                  displayName !== "" &&
                  displayName !== props.profile.displayName
                    ? displayName
                    : props.profile.displayName,
                bio:
                  bio !== "" && bio !== props.profile.bio
                    ? bio
                    : props.profile.bio,
                website:
                  website !== "" && website !== props.profile.website
                    ? website
                    : props.profile.website,
                location:
                  location !== "" && location !== props.profile.location
                    ? location
                    : props.profile.location,
                // @ts-ignore
                verified:
                  // @ts-ignore
                  verified !== "" && verified !== props.profile.verified
                    ? verified
                    : props.profile.verified,
              },
            });

            if (r.status === 200) {
              toast({
                title: "Profil aktualisiert",
                description: "Das Profil wurde erfolgreich aktualisiert",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
              });

              const profile = r.payload.profile;

              props.setProfiles(
                props.profiles.map((p) => {
                  if (p.username === profile.username) {
                    return profile;
                  } else {
                    return p;
                  }
                })
              );

              props.setCurrentProfile(profile);

              setEditMode(false);
            }
          }}
        >
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Box>
              {!editMode ? (
                <>
                  <Heading size="md">{props.profile.displayName}</Heading>
                  <Avatar
                    size={"xl"}
                    src={"/api/account/" + props.profile.username + "/picture"}
                    mt={4}
                  />
                  <Text mt={4}>
                    <b>Benutzername:</b> @{props.profile.username}
                  </Text>
                  <Text mt={4}>
                    <b>Erstellt am:</b>{" "}
                    {new Date(props.profile.createdAt).toLocaleString()}
                  </Text>
                  <Text mt={4} alignItems={"center"} justifyContent={"center"}>
                    <b>Verifiziert:</b>&nbsp;
                    {props.profile.verified ? (
                      <Icon as={FaCheckSquare} color={"green.500"} />
                    ) : (
                      <Icon as={FaWindowClose} color={"red.500"} />
                    )}
                  </Text>
                  <Text mt={4}>
                    <b>Biografie:</b> {props.profile.bio}
                  </Text>
                  <Text mt={4}>
                    <b>Website:</b> {props.profile.website}
                  </Text>
                  <Text mt={4}>
                    <b>Ort:</b> {props.profile.location}
                  </Text>
                </>
              ) : (
                <>
                  <FormControl id="displayName">
                    <FormLabel>Anzeigename</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaUser />
                      </InputLeftElement>
                      <Input
                        type="text"
                        defaultValue={props.profile.displayName}
                        name={"displayName"}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Benutzername</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaUser />
                      </InputLeftElement>
                      <Input
                        type="text"
                        defaultValue={props.profile.username}
                        disabled
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="bio" mt={4}>
                    <FormLabel>Biografie</FormLabel>
                    <Textarea defaultValue={props.profile.bio} name={"bio"} />
                  </FormControl>
                  <FormControl id={"website"} mt={4}>
                    <FormLabel>Website</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaGlobe />
                      </InputLeftElement>
                      <Input
                        type="text"
                        defaultValue={props.profile.website}
                        name={"website"}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="location" mt={4}>
                    <FormLabel>Ort</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaMapMarkerAlt />
                      </InputLeftElement>
                      <Input
                        type="text"
                        defaultValue={props.profile.location}
                        name={"location"}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="verified" mt={4}>
                    <FormLabel>Verifiziert</FormLabel>
                    <Select name={"verified"}>
                      <option value={"true"} selected={props.profile.verified}>
                        Ja
                      </option>
                      <option
                        value={"false"}
                        selected={!props.profile.verified}
                      >
                        Nein
                      </option>
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
            <Box>
              <Heading size="md">Aktionen</Heading>
              <ButtonGroup mt={4} spacing={4}>
                <Button
                  leftIcon={<Icon as={FaEdit} />}
                  colorScheme={"blue"}
                  onClick={() => {
                    setEditMode(true);
                  }}
                  disabled={editMode}
                >
                  Bearbeiten
                </Button>
                <Button
                  leftIcon={<Icon as={FaTrash} />}
                  colorScheme={"red"}
                  onClick={async () => {
                    const r = await REST.Admin.deleteForumProfile({
                      token: localStorage.getItem("token") as string,
                      username: props.profile.username,
                    });

                    if (r.status === 200) {
                      props.setProfiles(
                        props.profiles.filter(
                          // @ts-ignore
                          (profile) =>
                            profile.username !== props.profile.username
                        )
                      );

                      props.onClose();
                    } else {
                      toast({
                        title: "Fehler",
                        description:
                          "Beim Löschen des Profils ist ein Fehler aufgetreten.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }}
                >
                  Löschen
                </Button>
              </ButtonGroup>
              {editMode ? (
                <>
                  <Heading size={"md"} mt={4}>
                    Bearbeitung
                  </Heading>
                  <ButtonGroup mt={4} spacing={4}>
                    <Button
                      leftIcon={<Icon as={FaSave} />}
                      colorScheme={"green"}
                      type={"submit"}
                    >
                      Speichern
                    </Button>
                    <Button
                      leftIcon={<Icon as={FaTimes} />}
                      colorScheme={"red"}
                      onClick={() => {
                        setEditMode(false);
                      }}
                    >
                      Abbrechen
                    </Button>
                  </ButtonGroup>
                </>
              ) : null}
            </Box>
          </Grid>
        </form>
      </CodeUpModal>
    </>
  );
}
