/**
 * apps/web/src/pages/discovery/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2022
 *
 */

import * as React from "react";
import REST from "@codeup/rest/src";
import ErrorComponent from "@codeup/components/dist/global/ErrorComponent";
import {
  Grid,
  GridItem,
  Heading,
  Button,
  Text,
  chakra,
  Flex,
  Image,
  Box,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { Card, CardBody, CardHeader, CardFooter } from "@chakra-ui/card";
import { useLoggedIn } from "@codeup/hooks";
import { FaCode, FaEye, FaInfo, FaUser } from "react-icons/fa";
import { useRouter } from "next/router";
import GridLayout from "@codeup/components/dist/global/GridLayout";

export default function Discovery() {
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const [projects, setProjects] = React.useState<
    {
      name: string;
      description: string;
      author: string;
      domain: string;
      id: string;
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
      {error ? (
        <>
          <ErrorComponent
            description={"Ein Fehler ist aufgetreten!"}
            title={"Fehler"}
          />
        </>
      ) : (
        <>
          <Heading
            fontSize={["3xl", "6xl"]}
            color={"white"}
            textAlign={"center"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            textShadow={"0px 10px 100px #000000"}
            m={8}
          >
            Discovery
          </Heading>
          <GridLayout
            search={{
              allow: true,
              searchFields: true,
            }}
            specialEntries={[]}
            entries={projects.map((p) => {
              return {
                title: p.name,
                fields: [
                  {
                    icon: <FaUser />,
                    text: "Autor: @" + p.author,
                  },
                  {
                    icon: <FaInfo />,
                    text:
                      "Beschreibung: " +
                      p.description.substring(0, 100) +
                      "...",
                  },
                ],
                buttonRows: [
                  {
                    buttons: [
                      {
                        text: "Ansehen",
                        icon: <FaEye />,
                        colorScheme: "green",
                        onClick: () => {
                          window.open("http://" + p.domain, "_blank");
                        },
                      },
                    ],
                  },
                ],
              };
            })}
          />
        </>
      )}
    </>
  );
}
