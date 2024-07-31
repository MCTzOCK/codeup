/**
 * apps/web/src/pages/admin/discovery.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import REST from "@codeup/rest/src";
import { useRouter } from "next/router";
import AdminLayout from "@codeup/components/admin/AdminLayout";
import { Box } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import { useLoggedIn } from "@codeup/hooks";
import { FaInfo, FaLink, FaStar, FaTrash, FaUser } from "react-icons/fa";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import PopupManager from "../../global/PopupManager";
import AccountManager from "@codeup/util/dist/AccountManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { sProp } from "../../global/i18nstaticProps";

export default function Discovery() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [projects, setProjects] = React.useState<
    {
      name: string;
      description: string;
      author: string;
      domain: string;
      id: string;
      stars: string[];
    }[]
  >([]);

  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    REST.Discovery.getDiscoveryProjects().then((res) => {
      if (res.status === 200) {
        setProjects(res.payload.projects);
      } else {
        setError(true);
      }
    });
  }, []);

  const router = useRouter();

  return (
    <>
      <AdminLayout>
        <GridLayoutV2
          pageTitle={"Discovery"}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[]}
          entries={projects.map((p) => {
            return {
              title: p.name,
              fields: [
                {
                  icon: <FaUser />,
                  text: "Benutzer: @" + p.author,
                },
                {
                  icon: <FaStar />,
                  text: "Sterne: " + p.stars.length,
                },
                {
                  icon: <FaLink />,
                  text: "Domain: " + p.domain,
                },
                {
                  icon: <FaInfo />,
                  text:
                    "Beschreibung: " + p.description.substring(0, 100) + "...",
                },
              ],
              buttonRows: [
                [
                  {
                    text: "Löschen",
                    leftIcon: <FaTrash />,
                    colorScheme: "red",
                    onClick: async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Entfernen",
                          question:
                            "Möchtest du das Projekt wirklich entfernen?",
                        }))
                      )
                        return;

                      const res = await REST.Admin.removeFromDiscovery({
                        token: AccountManager.getActiveToken(),
                        id: p.id,
                      });

                      if (res.status === 200) {
                        await PopupManager.alertAsync({
                          title: "Entfernt",
                          description: "Das Projekt wurde entfernt!",
                        });

                        setProjects(projects.filter((pr) => pr.id !== p.id));
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description:
                            "Ein Fehler ist aufgetreten: " + res.payload.error,
                        });
                      }
                    },
                    disabled: false,
                  },
                ],
              ],
            };
          })}
        />
      </AdminLayout>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, [])),
  };
}
