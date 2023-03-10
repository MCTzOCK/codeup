/**
 * apps/web/src/pages/orgs/[name]/manage.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.03.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import OrgAdminLayout from "@codeup/components/orgs/OrgAdminLayout";
import { useRouter } from "next/router";
import {
  Box, Button,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Table, TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text, Tfoot,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/src/AccountManager";
import { FaPen, FaSearch, FaTrash } from "react-icons/fa";
import PopupManager from "../../../global/PopupManager";

export default function ManageDashboard() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();
  const router = useRouter();
  const [org, setOrg] = React.useState<{
    owner: string;
    name: string;
    members: string[];
    icon: string;
    subscription: string;
    createdAt: string;
    _id: string;
  } | null>();

  const [fetchedMembers, setFetchedMembers] = React.useState<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  }[]>([]);

  const [memberQuery, setMemberQuery] = React.useState<string>("");

  const fetchOrg = () => {
    REST.Orgs.getOrg({
      token: AccountManager.getActiveToken(),
      name: router.query.name as string
    }).then(async (r) => {
      if (r.status === 200) {
        setOrg(r.payload.org);

        let members: typeof fetchedMembers = [];

        for (const member of r.payload.org.members as string[]) {
          const r = await REST.Account.getUserById(member);

          if (r.status === 200) {
            members.push(r.payload.user);
          } else {
            console.error(r);
          }
        }

        setFetchedMembers(members);
      }
    });
  };

  React.useEffect(() => {
    if (!router || !router.query || !router.query.name) return;
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else {
      fetchOrg();
    }
  }, [loaded, loggedIn, router]);

  return (
    <>
      <OrgAdminLayout orgName={router.query.name as string}>
        <Flex
          w={"100%"}
          h={"fit-content"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            w={["100%", "75%", "50%"]}
            shadow={"xl"}
            bgColor={"black"}
            mt={4}
            rounded={"lg"}
            p={6}
          >
            {org && (
              <>
                <Flex
                  w={"100%"}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={6}
                >
                  <VStack>
                    <chakra.img
                      src={org.icon}
                      w={"100px"}
                      h={"100px"}
                      objectFit={"cover"}
                      borderRadius={"50%"}
                      mr={4}
                    />
                    <Link color={"blue.300"} onClick={async () => {
                      const fl: FileList = await PopupManager.uploadFileAsync({
                        title: "Logo ändern",
                        helperText: "Wähle ein neues Logo für die Organisation aus."
                      });

                      if (fl.length === 0) return;

                      const formData = new FormData();
                      formData.append("file", fl[0]);

                      const res = await fetch("/media/upload", {
                        method: "POST",
                        body: formData
                      });

                      if (res.status === 200) {
                        const data = await res.json();

                        const orgRes = await REST.Orgs.updateOrgIcon({
                          token: AccountManager.getActiveToken(),
                          name: org.name,
                          icon: data.data.url
                        });

                        if (orgRes.status === 200) {
                          fetchOrg();
                        } else {
                          PopupManager.alertAsync({
                            title: "Fehler",
                            description: "Beim Hochladen des Logos ist ein Fehler aufgetreten: " + orgRes.payload.error
                          });
                        }
                      } else {
                        PopupManager.alertAsync({
                          title: "Fehler",
                          description: "Beim Hochladen des Logos ist ein Fehler aufgetreten: " + res.statusText
                        });
                      }
                    }}>
                      Logo ändern
                    </Link>
                  </VStack>
                  <HStack>
                    <Heading size={"xl"}>{org.name}</Heading>
                    <IconButton aria-label={"Umbennenen"} onClick={async () => {
                      const name = await PopupManager.promptAsync({
                        title: "Umbenennen",
                        helperText: "Gib den neuen Namen der Organisation ein. Der Name muss eindeutig sein."
                      });

                      if (name) {
                        const res = await REST.Orgs.renameOrg({
                          token: AccountManager.getActiveToken(),
                          oldName: org.name,
                          newName: name
                        });

                        if (res.status === 200) {
                          router.push("/orgs/" + name + "/manage");
                        } else {
                          PopupManager.alertAsync({
                            title: "Fehler",
                            description: "Beim Umbenennen ist ein Fehler aufgetreten: " + res.payload.error
                          });
                        }
                      }
                    }} icon={<FaPen />} variant={"ghost"} colorScheme={"blue"} />
                  </HStack>
                  <Stack>
                    <Text>
                      <b>Erstellt am:</b>&nbsp;
                      {new Date(org.createdAt).toLocaleString()}
                    </Text>
                    <Text>
                      <b>Abonoment:</b>&nbsp;
                      {org.subscription}
                    </Text>
                    <Text>
                      <b>Mitglieder:</b>&nbsp;
                      {org.members.length}
                    </Text>
                  </Stack>
                </Flex>
                <Divider mt={6} />
                <Box mt={6}>
                  <Heading size={"md"}>Mitglieder</Heading>
                  <InputGroup mt={4} mb={4}>
                    <InputLeftElement>
                      <FaSearch />
                    </InputLeftElement>
                    <Input
                      placeholder={"Mitglieder suchen..."}
                      value={memberQuery}
                      onChange={(e) => setMemberQuery(e.target.value)}
                    />
                  </InputGroup>
                  <TableContainer mt={2}>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Profilbild</Th>
                          <Th>Benutzername</Th>
                          <Th>Name</Th>
                          <Th>Aktion</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {
                          fetchedMembers.filter((m) => {
                            return m.username.toLowerCase().includes(memberQuery.toLowerCase())
                              || m.firstName.toLowerCase().includes(memberQuery.toLowerCase())
                              || m.lastName.toLowerCase().includes(memberQuery.toLowerCase());
                          }).map((m) => {
                            return (
                              <Tr key={m.id}>
                                <Td>
                                  <chakra.img
                                    src={m.profilePicture}
                                    w={"50px"}
                                    h={"50px"}
                                    objectFit={"cover"}
                                    borderRadius={"50%"}
                                  />
                                </Td>
                                <Td>
                                  @{m.username}
                                </Td>
                                <Td>
                                  {m.firstName + " " + m.lastName}
                                </Td>
                                <Td>
                                  <Button colorScheme={"red"} leftIcon={<FaTrash />} onClick={async () => {

                                    if(!await PopupManager.confirmAsync({
                                      title: "Mitglied entfernen",
                                      question: "Bist du sicher, dass du " + m.username + " aus der Organisation entfernen möchtest?"
                                    })) return;

                                    const res = await REST.Orgs.removeOrgMember({
                                      token: AccountManager.getActiveToken(),
                                      name: org.name,
                                      userId: m.id
                                    });

                                    if (res.status === 200) {
                                      setFetchedMembers(fetchedMembers.filter((m0) => m0.id !== m.id));
                                    } else {
                                      PopupManager.alertAsync({
                                        title: "Fehler",
                                        description: "Beim Entfernen des Mitglieds ist ein Fehler aufgetreten: " + res.payload.error
                                      });
                                    }
                                  }}>
                                    Entfernen
                                  </Button>
                                </Td>
                              </Tr>
                            );
                          })
                        }
                      </Tbody>
                      <TableCaption>
                        {
                          fetchedMembers.filter((m) => {
                            return m.username.toLowerCase().includes(memberQuery.toLowerCase())
                              || m.firstName.toLowerCase().includes(memberQuery.toLowerCase())
                              || m.lastName.toLowerCase().includes(memberQuery.toLowerCase());
                          }).length === 0 ? (
                            <Text>
                              Keine Mitglieder gefunden.
                            </Text>
                          ) : fetchedMembers.filter((m) => {
                            return m.username.toLowerCase().includes(memberQuery.toLowerCase())
                              || m.firstName.toLowerCase().includes(memberQuery.toLowerCase())
                              || m.lastName.toLowerCase().includes(memberQuery.toLowerCase());
                          }).length + " Mitglieder gefunden."
                        }
                      </TableCaption>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}
          </Box>
        </Flex>
      </OrgAdminLayout>
    </>
  );
}
