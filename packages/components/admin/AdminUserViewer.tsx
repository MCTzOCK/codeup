/**
 * packages/components/admin/AdminUserViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
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
} from "react-icons/fa";
import { useEffect } from "react";
import REST from "@codeup/rest";

export default function AdminUserViewer(props: {
  user?: {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    twoFactorEnabled: boolean;
    twoFactorCode: string;
    active: boolean;
    activationToken: string;
    deletionToken: string;
    resetToken: string;
    emailChangeCode: string;
    newEmail: string;
    profilePicture: string;
    createdAt: string;
    sso: string;
    admin: boolean;
    __v: number;
  };
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  users: any[];
  setUsers: (users: any[]) => void;
  setCurrentUser: (user: any) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);

  return (
    <>
      <CodeUpModal
        onOpen={props.onOpen}
        onClose={() => {
          setEditMode(false);
          props.onClose();
        }}
        isOpen={props.isOpen}
        title={"Benutzerverwaltung"}
      >
        <Box>
          <Flex alignItems={"center"}>
            <Avatar
              size={"xl"}
              src={"/api/account/" + props.user?.username + "/picture"}
            />
            <Box ml={4}>
              {!editMode ? (
                <>
                  <Heading size={"md"}>
                    {props.user?.firstName}&nbsp;{props.user?.lastName}
                  </Heading>
                  <Text>@{props.user?.username}</Text>
                  <Text>{props.user?.email}</Text>
                </>
              ) : (
                <>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const data = new FormData(e.target as HTMLFormElement);

                      const firstName = data.get("firstName");
                      const lastName = data.get("lastName");
                      const email = data.get("email");
                      const password = data.get("password");

                      const update: { [key: string]: string } = {};

                      if (
                        firstName &&
                        firstName !== "" &&
                        firstName !== props.user?.firstName
                      ) {
                        update["firstName"] = firstName as string;
                      }

                      if (
                        lastName &&
                        lastName !== "" &&
                        lastName !== props.user?.lastName
                      ) {
                        update["lastName"] = lastName as string;
                      }

                      if (
                        email &&
                        email !== "" &&
                        email !== props.user?.email
                      ) {
                        update["email"] = email as string;
                      }

                      if (
                        password &&
                        password !== "" &&
                        password !== props.user?.password
                      ) {
                        update["password"] = password as string;
                      }

                      const r = await REST.Admin.updateAccount({
                        token: localStorage.getItem("token") as string,
                        username: props.user?.username as string,
                        update: update,
                      });

                      const userU = r.payload.user;

                      const newUsers = props.users.map((user) => {
                        if (user.username === props.user?.username) {
                          return userU;
                        } else {
                          return user;
                        }
                      });

                      props.setUsers(newUsers);

                      props.setCurrentUser(userU);

                      setEditMode(false);
                    }}
                  >
                    <FormControl>
                      <FormLabel>Benutzername</FormLabel>
                      <InputGroup mb={3}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaUser} />
                        </InputLeftElement>
                        <Input
                          disabled
                          placeholder="Benutzername"
                          defaultValue={props.user?.username}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Vorname</FormLabel>
                      <InputGroup mb={3}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaPen} />
                        </InputLeftElement>
                        <Input
                          placeholder="Vorname"
                          defaultValue={props.user?.firstName}
                          name={"firstName"}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Nachname</FormLabel>
                      <InputGroup mb={3}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaPen} />
                        </InputLeftElement>
                        <Input
                          placeholder="Nachname"
                          defaultValue={props.user?.lastName}
                          name={"lastName"}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>E-Mail</FormLabel>
                      <InputGroup mb={3}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaEnvelope} />
                        </InputLeftElement>
                        <Input
                          placeholder="E-Mail"
                          defaultValue={props.user?.email}
                          type={"email"}
                          name={"email"}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Passwort</FormLabel>
                      <InputGroup mb={3}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaLock} />
                        </InputLeftElement>
                        <Input
                          placeholder="Passwort"
                          defaultValue={""}
                          name={"password"}
                        />
                      </InputGroup>
                    </FormControl>
                    <ButtonGroup w={"100%"} justifyContent={"end"}>
                      <Button
                        colorScheme={"red"}
                        onClick={() => {
                          setEditMode(false);
                        }}
                      >
                        Abbrechen
                      </Button>
                      <Button colorScheme={"green"} type={"submit"}>
                        Speichern
                      </Button>
                    </ButtonGroup>
                  </form>
                </>
              )}
            </Box>
            {!editMode ? (
              <ButtonGroup ml={"auto"}>
                <IconButton
                  colorScheme={"red"}
                  aria-label={"delete"}
                  icon={<FaTrash />}
                />
                {props.user?.active ? (
                  <>
                    <IconButton
                      aria-label={"deactivate"}
                      icon={<FaWindowClose />}
                      colorScheme={"red"}
                    />
                  </>
                ) : (
                  <>
                    <IconButton
                      aria-label={"activate"}
                      icon={<FaCheckSquare />}
                      colorScheme={"green"}
                    />
                  </>
                )}
                <IconButton
                  aria-label={"edit"}
                  icon={<FaEdit />}
                  colorScheme={"orange"}
                  onClick={() => setEditMode(true)}
                />
              </ButtonGroup>
            ) : null}
          </Flex>
          <Box mt={4}>
            <Heading size={"sm"}>Allgemein</Heading>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>Benutzername</Th>
                  <Th>E-Mail</Th>
                  <Th>Admin</Th>
                  <Th>2FA</Th>
                  <Th>Aktiv</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{props.user?.username}</Td>
                  <Td>{props.user?.email}</Td>
                  <Td>{props.user?.admin ? "Ja" : "Nein"}</Td>
                  <Td>{props.user?.twoFactorEnabled ? "Ja" : "Nein"}</Td>
                  <Td>{props.user?.active ? "Ja" : "Nein"}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box mt={4}>
            <Heading size={"sm"}>Sonstiges</Heading>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>SSO</Th>
                  <Th>Registrierungsdatum</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {props.user?.sso === "no-sso"
                      ? "Echter Account"
                      : props.user?.sso}
                  </Td>
                  <Td>
                    {new Date(props.user?.createdAt as string).toLocaleString()}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </CodeUpModal>
    </>
  );
}
