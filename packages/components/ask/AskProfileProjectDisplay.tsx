/**
 * packages/components/ask/AskProfileProjectDisplay.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2023
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import { Flex, Image, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export default function AskProfileProjectDisplay(props: {
  projects: string[];
}) {
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      const pro: any[] = [];
      for (const p of props.projects) {
        const res = await REST.Editor.getDomainById(p);
        if (res.status === 200) {
          pro.push(res.payload.project);
        }
      }
      setProjects(pro);
    })();
  }, [props.projects]);

  return (
    <>
      {projects.length === 0 && (
        <>
          <Flex
            alignItems={"center"}
            gap={4}
            color={"red.400"}
            fontWeight={"bold"}
          >
            <FaTimes />
            <Text>Keine Projekte angegeben</Text>
          </Flex>
        </>
      )}
      {projects.length > 0 && (
        <>
          <SimpleGrid columns={[3, 3, 4, 5]} spacing={4}>
            {projects.map((p) => {
              return (
                <Link key={p._id} isExternal={true} href={"http://" + p.domain}>
                  <Flex alignItems={"center"} gap={4} fontWeight={"bold"}>
                    <Stack>
                      <Text>{p.name}</Text>
                    </Stack>
                  </Flex>
                </Link>
              );
            })}
          </SimpleGrid>
        </>
      )}
    </>
  );
}
