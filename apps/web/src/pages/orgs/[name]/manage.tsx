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
import { Box, chakra, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import REST from "@codeup/rest";
import AccountManager from "@codeup/util/dist/AccountManager";

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
    joinMode: "INVITE" | "PUBLIC";
    _id: string;
  } | null>();

  React.useEffect(() => {
    if (!router || !router.query || !router.query.name) return;
    if (loaded && !loggedIn) {
      router.push("/#login");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    } else {
      REST.Orgs.getOrg({
        token: AccountManager.getActiveToken(),
        name: router.query.name as string,
      }).then((r) => {
        if (r.status === 200) {
          setOrg(r.payload.org);
        }
      });
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
                  <chakra.img
                    src={org.icon}
                    w={"100px"}
                    h={"100px"}
                    borderRadius={"50%"}
                    mr={4}
                  />
                  <Heading size={"xl"}>{org.name}</Heading>
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
