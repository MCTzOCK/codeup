/**
 * apps/web/src/pages/test-gridlayout-v2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.05.2024
 *
 */

import * as React from "react";

import GridLayoutV2 from "@codeup/components/global/GridLayoutV2";
import { FaInfo, FaPlus } from "react-icons/fa";
import { Box } from "@chakra-ui/react";

export default function TestGridlayoutV2() {
  return (
    <Box bg={"#000"} h={"fit-content"} minH={"100vh"}>
      <GridLayoutV2
        pageTitle={"Test GridLayoutV2"}
        search={{
          fields: true,
          show: true,
        }}
        entries={[
          {
            title: "Test4567",
            buttonRows: [
              [
                {
                  text: "Bearbeiten",
                  onClick: () => {
                    alert("Bearbeiten");
                  },
                  variant: "brand",
                },
              ],
            ],
            fields: [
              {
                text: "Test123",
                icon: <FaInfo />,
              },
            ],
          },

          {
            title: "Test789",
            buttonRows: [
              [
                {
                  text: "Bearbeiten",
                  onClick: () => {
                    alert("Bearbeiten");
                  },
                  variant: "brand",
                },
                {
                  text: "Bearbeiten",
                  onClick: () => {
                    alert("Bearbeiten");
                  },
                  variant: "brand",
                },
              ],
              [
                {
                  text: "Bearbeiten",
                  onClick: () => {
                    alert("Bearbeiten");
                  },
                  variant: "brand",
                },
                {
                  text: "Bearbeiten",
                  onClick: () => {
                    alert("Bearbeiten");
                  },
                  variant: "brand",
                },
              ],
            ],
            fields: [
              {
                text: "Test9080",
                icon: <FaInfo />,
              },
            ],
          },
        ]}
        topButtons={[
          {
            variant: "brand",
            text: "Neu",
            leftIcon: <FaPlus />,
            onClick: () => {
              alert("Neu");
            },
          },
        ]}
      />
    </Box>
  );
}
