/**
 * apps/web/src/pages/projects/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.05.2024
 *
 */

import * as React from "react";
import { Box } from "@chakra-ui/react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import { IProject } from "../../types/IProject";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import PopupManager from "../../global/PopupManager";
import GridLayoutV2 from "@codeup/components/dist/global/GridLayoutV2";
import { FaPlus } from "react-icons/fa";

export default function Projects() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });

  const [projects, setProjects] = React.useState<IProject[]>([]);

  const reload = async () => {
    const res = await REST.Projects.myProjects(AccountManager.getActiveToken());

    if (res.status === 200) {
      setProjects(res.payload.data);
    } else {
      await PopupManager.alertAsync({
        title: "Fehler",
        description: res.payload.error,
      });
    }
  };

  React.useEffect(() => {
    reload();
  }, []);

  return (
    <>
      <Box minH={"100vh"} h={"fit-content"} bg={"#000"}>
        <GridLayoutV2
          pageTitle={"Projekte"}
          search={{
            show: true,
            fields: true,
          }}
          topButtons={[
            {
              text: "Neu",
              leftIcon: <FaPlus />,
              onClick: async () => {},
              variant: "brand",
            },
          ]}
          entries={[]}
        />
      </Box>
    </>
  );
}
