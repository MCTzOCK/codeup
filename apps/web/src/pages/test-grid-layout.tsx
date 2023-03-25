/**
 * apps/web/src/pages/test-grid-layout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.03.2023
 *
 */

import * as React from "react";
import GridLayout from "@codeup/components/global/GridLayout";
import {
  FaClock,
  FaEye,
  FaFileImport,
  FaPen,
  FaPlus,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

export default function Test() {
  return (
    <>
      <GridLayout
        search={{
          allow: true,
          searchFields: true,
        }}
        specialEntries={[
          {
            icon: <FaPlus />,
            onClick: () => {
              alert("PLUS");
            },
          },
          {
            icon: <FaFileImport />,
            onClick: () => {
              alert("IMPORT");
            },
          },
        ]}
        entries={[
          {
            title: "3000",
            fields: [
              {
                icon: <FaClock />,
                text: "19.3.2023, 17:24:38",
              },
            ],
            buttonRows: [
              {
                buttons: [
                  {
                    text: "Löschen",
                    onClick: () => {
                      alert("DELETE");
                    },
                    colorScheme: "red",
                    icon: <FaTrash />,
                  },
                ],
              },
              {
                buttons: [
                  {
                    text: "Öffnen",
                    onClick: () => {
                      alert("OPEN");
                    },
                    colorScheme: "blue",
                    icon: <FaEye />,
                  },
                ],
              },
              {
                buttons: [
                  {
                    text: "Umbenennen",
                    onClick: () => {
                      alert("RENAME");
                    },
                    colorScheme: "green",
                    icon: <FaPen />,
                  },
                  {
                    text: "Mitwirkende",
                    onClick: () => {
                      alert("CONTRIBUTORS");
                    },
                    colorScheme: "yellow",
                    icon: <FaUsers />,
                  },
                ],
              },
            ],
          },
        ]}
      />
    </>
  );
}
