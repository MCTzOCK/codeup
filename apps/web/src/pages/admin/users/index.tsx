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
import { FaCheck, FaFilter, FaUser } from "react-icons/fa";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
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
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import AuthenticateLoadingIndicator from "@codeup/components/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/global/ErrorComponent";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import REST from "@codeup/rest";

export default function UserManagement() {
  const [users, setUsers] = useState<
    {
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
    }[]
  >([]);

  const [loaded, setLoaded] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [query, setQuery] = useState<string>("");

  const [filter, setFilter] = useState<
    "admin" | "active" | "inactive" | "all" | ""
  >("all");

  useEffect(() => {
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
  }, []);

  return (
    <>
      {loaded && error !== "" ? (
        <>
          <ErrorComponent description={error} />
        </>
      ) : null}
      {loaded && error === "" ? (
        <>
          <AdminLayout>
            <>
              <Flex w={"100%"} h={"100vh"} direction={"column"}>
                <Heading textAlign={"center"} size={"lg"} mt={4}>
                  Benutzerverwaltung
                </Heading>
                <Flex
                  w={"100%"}
                  h={"100%"}
                  direction={"column"}
                  gap={"6rem"}
                  alignItems={"center"}
                  mt={4}
                  p={"2rem"}
                >
                  <Box w={"100%"}>
                    <Flex
                      w={"100%"}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={2}
                    >
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaUser} />
                        </InputLeftElement>
                        <Input
                          type="text"
                          placeholder="Benutzername"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </InputGroup>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FaFilter />}
                          aria-label={"Filter"}
                        />
                        <MenuList>
                          <MenuItem
                            icon={filter === "all" ? <FaCheck /> : <></>}
                            onClick={() => setFilter("all")}
                          >
                            Alle
                          </MenuItem>
                          <MenuItem
                            icon={filter === "admin" ? <FaCheck /> : <></>}
                            onClick={() => setFilter("admin")}
                          >
                            Admins
                          </MenuItem>
                          <MenuItem
                            icon={filter === "active" ? <FaCheck /> : <></>}
                            onClick={() => setFilter("active")}
                          >
                            Aktive
                          </MenuItem>
                          <MenuItem
                            icon={filter === "inactive" ? <FaCheck /> : <></>}
                            onClick={() => setFilter("inactive")}
                          >
                            Inaktive
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </Box>
                  <Box w={"100%"}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Profilbild</Th>
                          <Th>Name</Th>
                          <Th>E-Mail</Th>
                          <Th>Admin</Th>
                          <Th>Aktiv</Th>
                          <Th>2FA</Th>
                          <Th>Erstellt am</Th>
                          <Th>Aktionen</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {users
                          .filter((user) => {
                            if (query === "") {
                              return true;
                            } else {
                              return (
                                user.username
                                  .toLowerCase()
                                  .includes(query.toLowerCase()) ||
                                user.email
                                  .toLowerCase()
                                  .includes(query.toLowerCase())
                              );
                            }
                          })
                          .filter((user) => {
                            if (filter === "all") {
                              return true;
                            } else if (filter === "admin") {
                              return user.admin;
                            } else if (filter === "active") {
                              return user.active;
                            } else if (filter === "inactive") {
                              return !user.active;
                            } else {
                              return true;
                            }
                          })
                          .map((user) => {
                            return (
                              <Tr>
                                <Td>
                                  <img
                                    src={
                                      "/api/account/" +
                                      user.username +
                                      "/picture"
                                    }
                                    style={{
                                      width: "2rem",
                                      height: "2rem",
                                      borderRadius: "50%",
                                      marginRight: "1rem",
                                    }}
                                    alt={"Profile Picture"}
                                  />
                                </Td>
                                <Td>
                                  <Flex direction={"column"}>
                                    <Text>
                                      {user.firstName}&nbsp;{user.lastName}
                                    </Text>
                                    <Text>@{user.username}</Text>
                                  </Flex>
                                </Td>
                                <Td>{user.email}</Td>
                                <Td>{user.admin ? "Ja" : "Nein"}</Td>
                                <Td>{user.active ? "Ja" : "Nein"}</Td>
                                <Td>{user.twoFactorEnabled ? "Ja" : "Nein"}</Td>
                                <Td>
                                  {new Date(user.createdAt).toLocaleString()}
                                </Td>
                                <Td>
                                  <HStack>
                                    <IconButton
                                      aria-label="Edit"
                                      icon={<FaUser />}
                                      onClick={() => {}}
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            );
                          })}
                      </Tbody>
                    </Table>
                  </Box>
                </Flex>
              </Flex>
            </>
          </AdminLayout>
        </>
      ) : null}
    </>
  );
}
