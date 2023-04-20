/**
 * apps/web/src/pages/admin/ide.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.04.2023
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import {
  FaEye,
  FaFile,
  FaPen,
  FaPlus,
  FaRocket,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import { Box } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";

export default function Kids() {
  const router = useRouter();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [projects, setProjects] = React.useState<
    {
      _id: string;
      owner: string;
      name: string;
      discovery: boolean;
      discoveryDescription: string;
      discoveryLikes: string[];
      discoveryComments: any[];
      customDomain: string;
      contributors: string[];
      updated_at: string;
      created_at: string;
      __v: string;
    }[]
  >([]);

  const reload = () => {
    REST.Admin.getEditorProjects(AccountManager.getActiveToken()).then(
      (res) => {
        if (res.status !== 200) {
          setError(true);
          setLoading(false);
          return;
        }

        setLoading(false);
        setProjects(res.payload.projects);
      }
    );
  };

  React.useEffect(() => {
    reload();
  }, []);
  return (
    <>
      <AdminLayout>
        {loading ? (
          <>
            <AuthenticateLoadingIndicator text={"Lade Projekte..."} />
          </>
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={"Es ist ein Fehler aufgetreten."}
                />
              </>
            ) : (
              <>
                <Box mt={6}></Box>
                <SuperText>Projekte</SuperText>
                <GridLayout
                  search={{
                    allow: true,
                    searchFields: true,
                  }}
                  specialEntries={[]}
                  entries={projects.map((p) => ({
                    title: p.name,
                    fields: [
                      {
                        text: "Besitzer: " + p.owner,
                        icon: <FaUser />,
                      },
                      {
                        text:
                          "Veröffentlicht: " +
                          (p.customDomain.startsWith("disabled:")
                            ? "Nein"
                            : p.customDomain),
                        icon: <FaRocket />,
                      },
                      {
                        text: "Mitwirkende: " + p.contributors.length,
                        icon: <FaUsers />,
                      },
                    ],
                    buttonRows: [
                      {
                        buttons: [
                          {
                            text: "Öffnen",
                            onClick: () => {
                              router.push(`/editor/${p._id}`);
                            },
                            icon: <FaEye />,
                            colorScheme: "blue",
                            disabled: false,
                          },
                        ],
                      },
                    ],
                  }))}
                />
              </>
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
