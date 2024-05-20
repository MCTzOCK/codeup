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
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
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
  FaUserTag,
  FaChartLine,
} from "react-icons/fa";
import { useEffect } from "react";
import REST from "@codeup/rest";
import { useLoggedIn, useUserInfo } from "@codeup/hooks";
import PopupManager from "@codeup/web/src/global/PopupManager";
import AccountManager from "@codeup/util/src/AccountManager";
import { useRouter } from "next/router";
import { FiMail } from "react-icons/fi";
import AdminUserContact from "./AdminUserContact";
import { CHeading } from "../global/CHeading";

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
    role: string;
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

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [analyticsData, setAnalyticsData] = React.useState<{
    first: {
      view: string;
      page: string;
      browser: string;
      os: string;
    };
    last: {
      view: string;
      page: string;
      browser: string;
      os: string;
    };
    totalViews: number;
    averageViewsPerDay: number;
  }>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    if (props.user) {
      REST.Admin.getUserAnalytics({
        token: AccountManager.getActiveToken(),
        // @ts-ignore
        userId: props.user._id,
      }).then((res) => {
        setAnalyticsData(res.payload as any);
      });
    }
  }, [props.user]);

  const router = useRouter();

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
                  <CHeading size={"md"}>
                    {props.user?.firstName}&nbsp;{props.user?.lastName}
                  </CHeading>
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
                      const role = data.get("role");

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

                      if (role && role !== "" && role !== props.user?.role) {
                        update["role"] = role as string;
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

                      if (userU.username === userInfo.username) {
                        localStorage.removeItem("token");
                        return;
                      }
                    }}
                  >
                    <Stack spacing={2}>
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
                      <FormControl>
                        <FormLabel>Rolle</FormLabel>
                        <InputGroup mb={3}>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FaUserTag} />
                          </InputLeftElement>
                          <Input
                            placeholder="Rolle"
                            defaultValue={props.user?.role}
                            name={"role"}
                          />
                        </InputGroup>
                      </FormControl>
                      <ButtonGroup w={"100%"} justifyContent={"end"}>
                        <Button
                          onClick={() => {
                            setEditMode(false);
                          }}
                          w={"100%"}
                        >
                          Abbrechen
                        </Button>
                        <Button variant={"brand"} type={"submit"} w={"100%"}>
                          Speichern
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </form>
                </>
              )}
            </Box>
            {!editMode ? (
              <Flex ml={"auto"} direction={["column", "row"]} gap={2}>
                <IconButton
                  aria-label={"message"}
                  icon={<FaEnvelope />}
                  variant={"brand"}
                  onClick={onOpen}
                />
                <IconButton
                  aria-label={"analytics"}
                  variant={"brand"}
                  icon={<FaChartLine />}
                  onClick={async () => {
                    // @ts-ignore
                    router.push("/admin/analytics/" + props.user._id);
                  }}
                />
                {props.user?.active ? (
                  <>
                    <IconButton
                      colorScheme={"red"}
                      aria-label={"delete"}
                      icon={<FaTrash />}
                      onClick={async () => {
                        if (
                          await PopupManager.confirmAsync({
                            title: "Benutzer löschen",
                            question:
                              "Willst du den Benutzer wirklich unwiederruflich löschen?",
                          })
                        ) {
                          const r = await REST.Admin.deleteAccount({
                            token: localStorage.getItem("token") as string,
                            username: props.user?.username as string,
                          });

                          if (r.payload.success) {
                            const newUsers = props.users.filter(
                              (user) => user.username !== props.user?.username
                            );

                            props.setUsers(newUsers);
                            props.setCurrentUser(null);

                            props.onClose();
                          } else {
                            PopupManager.alert({
                              title: "Fehler",
                              description: r.payload.error,
                            });
                          }
                        }
                      }}
                    />
                    <IconButton
                      aria-label={"deactivate"}
                      icon={<FaWindowClose />}
                      colorScheme={"red"}
                      onClick={async () => {
                        const update: { [key: string]: any } = {
                          active: false,
                        };

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
                    />
                  </>
                ) : (
                  <>
                    <IconButton
                      aria-label={"activate"}
                      icon={<FaCheckSquare />}
                      colorScheme={"green"}
                      onClick={async () => {
                        const update: { [key: string]: any } = {
                          active: true,
                        };

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
                    />
                  </>
                )}
                <IconButton
                  aria-label={"login as user"}
                  icon={<FaLock />}
                  variant={"brand"}
                  onClick={async () => {
                    const jwtRes = await REST.Admin.getUserJWT({
                      token: localStorage.getItem("token") as string,
                      username: props.user?.username as string,
                    });

                    if (jwtRes.status === 200) {
                      await AccountManager.setActiveToken(jwtRes.payload.jwt);
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description: jwtRes.payload.error,
                      });
                    }
                  }}
                />
                <IconButton
                  aria-label={"edit"}
                  icon={<FaEdit />}
                  variant={"brand"}
                  onClick={() => setEditMode(true)}
                />
              </Flex>
            ) : null}
          </Flex>
          <Box mt={4}>
            <CHeading size={"md"}>Allgemein</CHeading>
            <TableContainer>
              <Table variant={"simple"}>
                <Thead>
                  <Tr>
                    <Th>Benutzername</Th>
                    <Th>E-Mail</Th>
                    <Th>Rolle</Th>
                    <Th>2FA</Th>
                    <Th>Aktiv</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{props.user?.username}</Td>
                    <Td>{props.user?.email}</Td>
                    <Td>{props.user?.role}</Td>
                    <Td>{props.user?.twoFactorEnabled ? "Ja" : "Nein"}</Td>
                    <Td>{props.user?.active ? "Ja" : "Nein"}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box mt={4}>
            <CHeading size={"md"}>Sonstiges</CHeading>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>SSO</Th>
                  <Th>Registrierungsdatum</Th>
                  <Th>ID</Th>
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
                  <Td>
                    {
                      // @ts-ignore
                      props.user?._id
                    }
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box mt={4}>
            <CHeading size={"md"}>Analytics</CHeading>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>Erster Login</Th>
                  <Th>Letzter Login</Th>
                  <Th>Besuche</Th>
                  <Th>&#216;Besuche/Tag</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {new Date(
                      analyticsData?.first.view as string
                    ).toLocaleString()}
                    <br />
                    <b>Seite:&nbsp;</b>
                    {analyticsData?.first.page}
                    <br />
                    <b>Browser:&nbsp;</b>
                    {analyticsData?.first.browser}
                    <br />
                    <b>OS:&nbsp;</b>
                    {analyticsData?.first.os}
                  </Td>
                  <Td>
                    {new Date(
                      analyticsData?.last.view as string
                    ).toLocaleString()}
                    <br />
                    <b>Seite:&nbsp;</b>
                    {analyticsData?.last.page}
                    <br />
                    <b>Browser:&nbsp;</b>
                    {analyticsData?.last.browser}
                    <br />
                    <b>OS:&nbsp;</b>
                    {analyticsData?.last.os}
                  </Td>
                  <Td>{analyticsData?.totalViews}</Td>
                  <Td>
                    {Math.round(analyticsData?.averageViewsPerDay as number)}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </CodeUpModal>
      <AdminUserContact
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
        title={"Nachricht an " + (props.user ? props.user.username : "")}
        username={props.user ? props.user.username : ""}
      />
    </>
  );
}
