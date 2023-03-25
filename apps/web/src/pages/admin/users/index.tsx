/**
 * apps/web/src/pages/admin/users/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.22
 *
 */

import { useLoggedIn } from "@codeup/hooks";
import router from "next/router";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaEllipsisH,
  FaEllipsisV,
  FaEye,
  FaFilter,
  FaHome,
  FaPlus,
  FaSort,
  FaTrash,
  FaUser,
} from "react-icons/fa";
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
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";
import { FiMoreHorizontal, FiRotateCw } from "react-icons/fi";
import AdminUserViewer from "@codeup/components/admin/AdminUserViewer";
import AdminUserCreator from "@codeup/components/admin/AdminUserCreator";
import DataTable from "@codeup/components/extra/DataTable";
import Head from "next/head";
import * as React from "react";

type User = {
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

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  const [loaded, setLoaded] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();

  const [currentUser, setCurrentUser] = useState<any>(null);

  const reload = () => {
    REST.Admin.listAccounts(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setUsers(res.payload.accounts);
          setLoaded(true);
        } else {
          setError("Benutzer konnten nicht geladen werden.");
          setLoaded(true);
        }
      }
    );
  };
  useEffect(() => {
    reload();
  }, []);

  const userToRow = (user: any) => {
    return [
      () => {
        setCurrentUser(user);
        onOpen();
      },
      <Avatar size={"md"} src={"/api/account/" + user.username + "/picture"} />,
      <>
        <Text>
          {user.firstName}&nbsp;{user.lastName}
        </Text>
        <Text>{user.username}</Text>
      </>,
      user.email,
      user.role,
      user.active ? "Ja" : "Nein",
      user.twoFactor ? "Ja" : "Nein",
      new Date(user.createdAt).toLocaleString(),
    ];
  };

  return (
    <>
      <Head>
        <title>Benutzer - Admin - CodeUp</title>
      </Head>
      {loaded && error !== "" ? (
        <>
          <ErrorComponent description={error} />
        </>
      ) : null}
      {loaded && error === "" ? (
        <>
          <AdminLayout>
            <>
              <Flex>
                <Box flex={"10%"}></Box>
                <Box flex={"80%"}>
                  <Flex
                    w={"100%"}
                    minH={"100vh"}
                    h="fit-content"
                    direction={"column"}
                  >
                    <Flex
                      maxW={"75%"}
                      direction={"row"}
                      justify={"space-between"}
                      alignItems={"center"}
                      p={"2rem"}
                    >
                      <Heading
                        textAlign={"center"}
                        size={"lg"}
                        mt={4}
                        flex={"100%"}
                      >
                        Benutzerverwaltung
                      </Heading>
                      <Button
                        onClick={() => {
                          onOpenViewer();
                        }}
                        colorScheme={"green"}
                        leftIcon={<FaPlus />}
                      >
                        Neu
                      </Button>
                    </Flex>
                    <Flex
                      w={"100%"}
                      h={"100%"}
                      direction={"column"}
                      gap={"6rem"}
                      alignItems={"center"}
                      mt={4}
                    >
                      <Box w={"100%"}>
                        <DataTable
                          columns={[
                            "Profilbild",
                            "Name",
                            "E-Mail",
                            "Rolle",
                            "Aktiv",
                            "2FA",
                            "Erstellt",
                          ]}
                          data={users.map(userToRow)}
                          filter={(q: string, f: string, s: string) => {
                            let x = users.filter((user: any) => {
                              return (
                                user.username
                                  .toLowerCase()
                                  .includes(q.toLowerCase()) ||
                                user.email
                                  .toLowerCase()
                                  .includes(q.toLowerCase())
                              );
                            });

                            switch (f.toLowerCase()) {
                              case "alle":
                                break;
                              case "aktive":
                                x = x.filter((user: any) => user.active);
                                break;
                              case "inaktive":
                                x = x.filter((user: any) => !user.active);
                                break;
                              default:
                                break;
                            }

                            switch (s.toLowerCase()) {
                              case "alphabetisch":
                                x = x.sort((a: any, b: any) => {
                                  if (
                                    a.username.toLowerCase() <
                                    b.username.toLowerCase()
                                  ) {
                                    return -1;
                                  } else if (
                                    a.username.toLowerCase() >
                                    b.username.toLowerCase()
                                  ) {
                                    return 1;
                                  } else {
                                    return 0;
                                  }
                                });
                                break;
                              case "neuste zuerst":
                                x = x.sort((a: any, b: any) => {
                                  return (
                                    new Date(b.createdAt).getTime() -
                                    new Date(a.createdAt).getTime()
                                  );
                                });
                                break;
                              case "älteste zuerst":
                                x = x.sort((a: any, b: any) => {
                                  return (
                                    new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime()
                                  );
                                });
                                break;
                              default:
                                break;
                            }

                            return x.map(userToRow);
                          }}
                          filterOptions={["Alle", "Aktive", "Inaktive"]}
                          sortOptions={[
                            "Alphabetisch",
                            "Neuste zuerst",
                            "Älteste zuerst",
                          ]}
                          reload={reload}
                        />
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
                <Box flex={"10%"}></Box>
              </Flex>
            </>
            <AdminUserViewer
              onOpen={onOpen}
              onClose={onClose}
              isOpen={isOpen}
              user={(currentUser as User) || null}
              users={users}
              setUsers={setUsers}
              setCurrentUser={setCurrentUser}
            />
            <AdminUserCreator
              onOpen={onOpenViewer}
              onClose={onCloseViewer}
              isOpen={isOpenViewer}
              setUsers={setUsers}
              users={users}
            />
          </AdminLayout>
        </>
      ) : null}
    </>
  );
}
