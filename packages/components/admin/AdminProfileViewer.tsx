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
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
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
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box>
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
          </Box>
          <Box>
            <Heading size="md">Aktionen</Heading>
            <ButtonGroup mt={4} spacing={4}>
              <Button
                leftIcon={<Icon as={FaEdit} />}
                colorScheme={"blue"}
                onClick={() => {}}
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
                        (profile) => profile.username !== props.profile.username
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
          </Box>
        </Grid>
      </CodeUpModal>
    </>
  );
}
