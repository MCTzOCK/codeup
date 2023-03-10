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
import { Box, chakra, Flex, Heading, HStack, IconButton, Link, Stack, Text, VStack } from "@chakra-ui/react";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/src/AccountManager";
import { FaPen } from "react-icons/fa";
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

  const fetchOrg = () => {
    REST.Orgs.getOrg({
      token: AccountManager.getActiveToken(),
      name: router.query.name as string
    }).then((r) => {
      if (r.status === 200) {
        setOrg(r.payload.org);
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

                      if(fl.length === 0) return;

                      const formData = new FormData();
                      formData.append("file", fl[0]);

                      const res = await fetch("/media/upload", {
                        method: "POST",
                        body: formData,
                      });

                      if(res.status === 200) {
                        const data = await res.json();

                        const orgRes = await REST.Orgs.updateOrgIcon({
                          token: AccountManager.getActiveToken(),
                          name: org.name,
                          icon: data.data.url
                        });

                        if(orgRes.status === 200) {
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
                        helperText: "Gib den neuen Namen der Organisation ein. Der Name muss eindeutig sein.",
                      });

                      if(name) {
                        const res = await REST.Orgs.renameOrg({
                          token: AccountManager.getActiveToken(),
                          oldName: org.name,
                          newName: name
                        });

                        if(res.status === 200) {
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
              </>
            )}
          </Box>
        </Flex>
      </OrgAdminLayout>
    </>
  );
}
