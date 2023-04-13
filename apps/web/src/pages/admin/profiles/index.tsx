/**
 * apps/web/src/pages/admin/profiles/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.22
 *
 */
import AdminLayout from "@codeup/components/admin/AdminLayout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import router from "next/router";
import { FaHome, FaPlus } from "react-icons/fa";
import REST from "@codeup/rest";
import { useEffect, useState } from "react";
import DataTable from "@codeup/components/extra/DataTable";
import AdminProfileViewer from "@codeup/components/admin/AdminProfileViewer";
import Head from "next/head";
import * as React from "react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);

  const [loaded, setLoaded] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentProfile, setCurrentProfile] = useState<any>(null);

  const reload = () => {
    REST.Admin.listForumProfiles(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setProfiles(res.payload.profiles);
          setLoaded(true);
        } else {
          setError("Profile konnten nicht geladen werden.");
          setLoaded(true);
        }
      }
    );
  };
  useEffect(() => {
    reload();
  }, []);

  const profileToRow = (profile: any) => {
    return [
      () => {
        setCurrentProfile(profile);
        onOpen();
      },
      <Avatar
        size={"md"}
        src={"/api/account/" + profile.username + "/picture"}
      />,
      profile.username,
      profile.displayName,
      profile.verified ? "Ja" : "Nein",
      profile.bio,
      profile.website,
      profile.location,
      new Date(profile.createdAt).toLocaleString(),
    ];
  };

  return (
    <>
      <Head>
        <title>Profile - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <Flex w={"100%"} minH={"100vh"} h="fit-content" direction={"column"}>
          <Box mt={8}></Box>
          <SuperText>Profile</SuperText>
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
              <DataTable
                columns={[
                  "Profilbild",
                  "Benutzername",
                  "Anzeigename",
                  "Verifiziert",
                  "Biography",
                  "Webseite",
                  "Ort",
                  "Erstellt",
                ]}
                data={profiles.map(profileToRow)}
                filter={(q: string, f: string, s: string) => {
                  let x = profiles.filter((profile: any) => {
                    return (
                      profile.username
                        .toLowerCase()
                        .includes(q.toLowerCase()) ||
                      profile.displayName
                        .toLowerCase()
                        .includes(q.toLowerCase()) ||
                      profile.bio.toLowerCase().includes(q.toLowerCase()) ||
                      profile.website.toLowerCase().includes(q.toLowerCase()) ||
                      profile.location.toLowerCase().includes(q.toLowerCase())
                    );
                  });

                  switch (f.toLowerCase()) {
                    case "alle":
                      break;
                    case "verifizierte":
                      x = x.filter((profile: any) => profile.verified);
                      break;
                    default:
                      break;
                  }

                  switch (s.toLowerCase()) {
                    case "alphabetisch":
                      x = x.sort((a: any, b: any) => {
                        if (
                          a.username.toLowerCase() < b.username.toLowerCase()
                        ) {
                          return -1;
                        } else if (
                          a.username.toLowerCase() > b.username.toLowerCase()
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

                  return x.map(profileToRow);
                }}
                filterOptions={["Alle", "Verifizierte"]}
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
        <AdminProfileViewer
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
          profile={currentProfile}
          setCurrentProfile={setCurrentProfile}
          setProfiles={setProfiles}
          profiles={profiles}
        />
      </AdminLayout>
    </>
  );
}
