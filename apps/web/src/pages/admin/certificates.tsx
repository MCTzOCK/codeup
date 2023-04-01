/**
 * apps/web/src/pages/admin/certificates.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.12.2022
 *
 */

import AdminLayout from "@codeup/components/admin/AdminLayout";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import router from "next/router";
import { FaHome, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import REST from "@codeup/rest";
import { useEffect, useState } from "react";
import DataTable from "@codeup/components/extra/DataTable";
import AdminProfileViewer from "@codeup/components/admin/AdminProfileViewer";
import Head from "next/head";
import * as React from "react";

export default function Certificates() {
  const [certificates, setCertificates] = useState<any[]>([]);

  const [loaded, setLoaded] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const reload = () => {
    REST.Admin.getAllObtainedCertificates(
      localStorage.getItem("token") as string
    ).then((res) => {
      if (res.status === 200) {
        setCertificates(res.payload.certificates);
        setLoaded(true);
      } else {
        setError("Profile konnten nicht geladen werden.");
        setLoaded(true);
      }
    });
  };
  useEffect(() => {
    reload();
  }, []);

  const certToRow = (cert: any) => {
    return [
      (e: any) => {
        if (e.target.tagName === "TD") {
          router.push("/user-cert/" + cert._id);
        }
      },
      <Avatar size={"md"} src={"/api/account/" + cert.username + "/picture"} />,
      cert.username,
      cert.name,
      cert.course,
      cert.percentage + "%",
      new Date(cert.date).toLocaleString(),
      <>
        <IconButton
          colorScheme={"red"}
          aria-label={"delete"}
          variant={"ghost"}
          icon={<FaTrash />}
          onClick={() => {
            REST.Admin.deleteObtainedCertificate({
              token: localStorage.getItem("token") as string,
              id: cert._id,
            }).then(() => {
              reload();
            });
          }}
        />
      </>,
    ];
  };

  return (
    <>
      <Head>
        <title>Zertifikate - Admin - CodeUp</title>
      </Head>
      <AdminLayout>
        <Flex w={"100%"} minH={"100vh"} h="fit-content" direction={"column"}>
          <Flex
            w={"100%"}
            direction={"row"}
            justify={"space-between"}
            alignItems={"center"}
            p={"2rem"}
          >
            <Heading textAlign={"center"} size={"lg"} mt={4} flex={"100%"}>
              Zertifikatverwaltung
            </Heading>
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
              <DataTable
                columns={[
                  "Profilbild",
                  "Benutzername",
                  "Anzeigename",
                  "Kurs",
                  "Erfolg",
                  "Datum",
                  "Aktion",
                ]}
                data={certificates.map(certToRow)}
                filter={(q: string, f: string, s: string) => {
                  let x = certificates.filter((certificate: any) => {
                    return (
                      certificate.username
                        .toLowerCase()
                        .includes(q.toLowerCase()) ||
                      certificate.name
                        .toLowerCase()
                        .includes(q.toLowerCase()) ||
                      certificate.course.toLowerCase().includes(q.toLowerCase())
                    );
                  });

                  switch (f.toLowerCase()) {
                    case "alle":
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
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                        );
                      });
                      break;
                    case "älteste zuerst":
                      x = x.sort((a: any, b: any) => {
                        return (
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                        );
                      });
                      break;
                    default:
                      break;
                  }

                  return x.map(certToRow);
                }}
                filterOptions={["Alle"]}
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
      </AdminLayout>
    </>
  );
}
