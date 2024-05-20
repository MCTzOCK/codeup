/**
 * apps/web/src/pages/admin/orgs/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.04.2023
 *
 */

import * as React from "react";
import AdminLayout from "@codeup/components/dist/admin/AdminLayout";
import AuthenticateLoadingIndicator from "@codeup/components/dist/admin/AuthenticateLoadingIndicator";
import REST from "@codeup/rest/src";
import AccountManager from "@codeup/util/dist/AccountManager";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import { Box } from "@chakra-ui/react";
import SuperText from "@codeup/components/dist/landingpage/SuperText";
import GridLayout from "@codeup/components/dist/global/GridLayout";
import {
  FaClock,
  FaEye,
  FaInfo,
  FaMoneyBill,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useRouter } from "next/router";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";

export default function Index() {
  const router = useRouter();
  const [orgs, setOrgs] = React.useState<
    {
      _id: string;
      owner: {
        username: string;
      };
      name: string;
      members: string[];
      icon: string;
      subscription: string;
      createdAt: string;
      __v: number;
    }[]
  >([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    REST.Admin.getOrgs(AccountManager.getActiveToken()).then((res) => {
      if (res.status === 200) {
        setOrgs(res.payload.orgs);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      <AdminLayout>
        {loading ? (
          <>
            <AuthenticateLoadingIndicator text={"Laden..."} />
          </>
        ) : (
          <>
            {error ? (
              <>
                <ErrorComponent
                  description={"Es ist ein Fehler aufgetreten!"}
                  title={"Fehler"}
                />
              </>
            ) : (
              <>
                <GridLayoutV2
                  pageTitle={"Organisationen"}
                  search={{
                    show: true,
                    fields: true,
                  }}
                  topButtons={[]}
                  entries={orgs.map((org) => {
                    return {
                      title: org.name,
                      buttonRows: [
                        [
                          {
                            text: "Anzeigen",
                            leftIcon: <FaEye />,
                            disabled: false,
                            variant: "brand",
                            onClick: () => {
                              router.push("/orgs/" + org.name + "/manage");
                            },
                          },
                        ],
                      ],
                      fields: [
                        {
                          text: "ID: " + org._id,
                          icon: <FaInfo />,
                        },
                        {
                          text: "Mitglieder: " + org.members.length,
                          icon: <FaUsers />,
                        },
                        {
                          text:
                            "Erstellt am: " +
                            new Date(org.createdAt).toLocaleString(),
                          icon: <FaClock />,
                        },
                        {
                          text: "Abonnement: " + org.subscription,
                          icon: <FaMoneyBill />,
                        },
                        {
                          text: "Besitzer: " + org.owner.username,
                          icon: <FaUser />,
                        },
                      ],
                    };
                  })}
                />
              </>
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
