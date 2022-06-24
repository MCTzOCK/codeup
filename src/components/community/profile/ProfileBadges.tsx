/**
 * src/components/community/profile/ProfileBadges.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2022
 *
 */

import * as React from "react";
import { Badge, Flex, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

export default function ProfileBadges(props: {
  verified: boolean;
  specialStatus: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <Flex
        direction={"row"}
        mt={".4rem"}
        marginInline={".4rem"}
        gap={"0"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {props.verified ? (
          <Tooltip label={t("community:verified")} hasArrow>
            <Badge
              ml={"1"}
              p={".2rem"}
              colorScheme="green"
              display={"block ruby"}
            >
              {t("community:verified")}
            </Badge>
          </Tooltip>
        ) : null}
        {props.specialStatus.length > 0 ? (
          <Tooltip label={props.specialStatus} hasArrow>
            <Badge
              ml={"1"}
              p={".2rem"}
              colorScheme="yellow"
              display={"block ruby"}
            >
              {t("community:special")}
            </Badge>
          </Tooltip>
        ) : null}
      </Flex>
    </>
  );
}
