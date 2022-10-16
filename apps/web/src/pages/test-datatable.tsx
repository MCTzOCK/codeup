/**
 * apps/web/src/pages/test-datatable.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.10.22
 *
 */
import DataTable from "@codeup/components/extra/DataTable";
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import { Avatar, Box, Flex } from "@chakra-ui/react";

export default function TestDataTable() {
  const [users, setUsers] = useState([]);

  const reload = async () => {
    const x = await REST.Admin.listAccounts(
      localStorage.getItem("token") as string
    );

    if (x.status === 200) {
      setUsers(x.payload.accounts);
    } else {
      alert("Error: " + x.payload.error);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const userToRow = (user: any) => {
    return [
      () => {
        alert(user.username);
      },
      <Avatar size={"md"} src={"/api/account/" + user.username + "/picture"} />,
      user.username,
      user.email,
      user.admin ? "Ja" : "Nein",
      user.active ? "Ja" : "Nein",
      user.twoFactor ? "Ja" : "Nein",
      new Date(user.createdAt).toLocaleString(),
    ];
  };

  return (
    <>
      <Flex w={"100%"} justifyContent={"center"} mt={"2rem"}>
        <Box w={"75%"}>
          <DataTable
            columns={[
              "Profilbild",
              "Name",
              "E-Mail",
              "Admin",
              "Aktiv",
              "2FA",
              "Erstellt",
            ]}
            data={users.map(userToRow)}
            filter={(q: string, f: string, s: string) => {
              let x = users.filter((user: any) => {
                return (
                  user.username.toLowerCase().includes(q.toLowerCase()) ||
                  user.email.toLowerCase().includes(q.toLowerCase())
                );
              });

              switch (f.toLowerCase()) {
                case "alle":
                  break;
                case "admins":
                  x = x.filter((user: any) => user.admin);
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
                    if (a.username.toLowerCase() < b.username.toLowerCase()) {
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

              return x.map(userToRow);
            }}
            filterOptions={["Alle", "Admins", "Aktive", "Inaktive"]}
            sortOptions={["Alphabetisch", "Neuste zuerst", "Älteste zuerst"]}
            reload={reload}
          />
        </Box>
      </Flex>
    </>
  );
}
