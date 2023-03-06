/**
 * apps/web/src/pages/orgs/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.03.2023
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { useLoggedIn } from "@codeup/hooks";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/src/AccountManager";
import PopupManager from "../../global/PopupManager";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text
} from "@chakra-ui/react";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";

export default function Index() {

  const { loggedIn, loaded, userInfo } = useLoggedIn();
  const [query, setQuery] = React.useState<string>("");
  const router = useRouter();

  const [orgs, setOrgs] = React.useState<{
    owner: string;
    name: string;
    members: string[];
    icon: string;
    subscription: string;
    createdAt: string;
  }[]>([]);

  useEffect(() => {
    if (loaded && loggedIn) {
      REST.Orgs.getOrgs(
        AccountManager.getActiveToken()
      ).then((r) => {
        if (r.status === 200) {
          setOrgs(r.payload.orgs);
        } else {
          PopupManager.alert({
            title: "Fehler",
            description: "Organisationen konnten nicht geladen werden: " + r.payload.error
          });
        }
      });
    } else if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [loaded]);


  if (!loaded) return <><AuthenticateLoadingIndicator /></>;

  return (
    <>
      <Flex
        w={"100%"}
        h={"fit-content"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        mt={4}
      >
        <Heading>Organisationen</Heading>
        <Box
          w={["100%", "75%", "50%"]}
          h={"100%"}
          p={4}
          mt={4}
          overflow={"auto"}
        >
          <Flex w={"100%"} direction={"row"} gap={4}>
            <InputGroup w={"100%"}>
              <InputLeftElement>
                <FaSearch />
              </InputLeftElement>
              <Input placeholder={"Suche nach Organisationen"} onChange={(e) => {
                setQuery(e.target.value.trim());
              }} />
            </InputGroup>
            <Button
              colorScheme={"blue"}
              onClick={async () => {
                const name = await PopupManager.promptAsync({
                  title: "Neue Organisation",
                  helperText: "Gib den Namen der Organisation ein."
                });

                const res = await REST.Orgs.createOrg({
                  token: AccountManager.getActiveToken(),
                  name: name
                });

                if (res.status === 200) {
                  PopupManager.alert({
                    title: "Erfolg",
                    description: "Die Organisation wurde erfolgreich erstellt."
                  });
                  setOrgs([...orgs, res.payload.org]);
                } else {
                  PopupManager.alert({
                    title: "Fehler",
                    description: "Die Organisation konnte nicht erstellt werden: " + res.payload.error
                  });
                }

              }}
            >Neu</Button>
          </Flex>
          {orgs
            .filter((org) => org.name.toLowerCase().includes(query.toLowerCase()))
            .map((org, i) => (
              <Flex
                key={i}
                w={"100%"}
                h={"100%"}
                p={4}
                mt={4}
                overflow={"auto"}
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDirection={["column", "row"]}
                bg={"black"}
                borderRadius={"md"}
                shadow={"xl"}
                onClick={() => {
                  if (org.owner !== userInfo?.id) {
                    router.push("/orgs/" + org.name + "/dashboard");
                  }
                }}
                cursor={
                  org.owner !== userInfo?.id ? "pointer" : "default"
                }

              >
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                >
                  <chakra.img
                    src={org.icon}
                    w={"50px"}
                    h={"50px"}
                    borderRadius={"50%"}
                    mr={4}
                  />
                  <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                  >
                    <Heading size={"md"}>{org.name}</Heading>
                  </Flex>
                </Flex>
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  gap={2}
                >
                  {
                    org.owner === userInfo?.id ? (
                      <>
                        <Text color={"red.300"}>Von dir verwaltet</Text>
                        <IconButton aria-label={"Verwalten"}
                                    icon={<FaExternalLinkAlt />}
                                    onClick={() => {
                                      router.push("/orgs/" + org.name + "/dashboard");
                                    }}
                                    variant={"ghost"}
                                    colorScheme={"red"}
                        />
                      </>
                    ) : null
                  }
                </Flex>
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  <Text mr={4}><b>Mitglieder:</b> {org.members.length}</Text>
                  <Text mr={4}><b>Abonnement:</b> {org.subscription}</Text>
                  <Text mr={4}><b>Erstellt am:</b> {new Date(org.createdAt).toLocaleString()}</Text>
                </Flex>
              </Flex>
            ))}
          {orgs
            .filter((org) => org.name.toLowerCase().includes(query.toLowerCase()))
            .length === 0 ? (
            <>
              <Text color={"red.300"} mt={4}>Keine Organisationen gefunden</Text>
            </>
          ) : null}
        </Box>
      </Flex>
    </>
  );
}