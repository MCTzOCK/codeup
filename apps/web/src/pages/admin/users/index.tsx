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
  TableContainer,
  Tbody,
  Td,
  Text,
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
import { FiMoreHorizontal } from "react-icons/fi";
import AdminUserViewer from "@codeup/components/admin/AdminUserViewer";
import AdminUserCreator from "@codeup/components/admin/AdminUserCreator";

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
  admin: boolean;
  __v: number;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  const [loaded, setLoaded] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [query, setQuery] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();

  const [currentUser, setCurrentUser] = useState<any>(null);

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
                <Flex
                  w={"100%"}
                  direction={"row"}
                  justify={"space-between"}
                  alignItems={"center"}
                  p={"2rem"}
                >
                  <Button
                    onClick={() => router.push("/admin")}
                    colorScheme={"red"}
                    leftIcon={<FaHome />}
                  >
                    Zurück
                  </Button>
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
                    <TableContainer>
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
                                <Tr
                                  _hover={{
                                    backgroundColor: "gray.700",
                                  }}
                                  cursor={"pointer"}
                                  onClick={() => {
                                    setCurrentUser(user);
                                    onOpen();
                                  }}
                                >
                                  <Td>
                                    <Avatar
                                      size={"md"}
                                      src={
                                        "/api/account/" +
                                        user.username +
                                        "/picture"
                                      }
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
                                  <Td>
                                    {user.twoFactorEnabled ? "Ja" : "Nein"}
                                  </Td>
                                  <Td>
                                    {new Date(user.createdAt).toLocaleString()}
                                  </Td>
                                </Tr>
                              );
                            })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Flex>
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
