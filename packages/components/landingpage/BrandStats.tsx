/**
 * packages/components/landingpage/Stats.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.03.2023
 * Original: https://templateskart.com
 */

import * as React from "react";
import {
  Container,
  Text,
  SimpleGrid,
  Box,
  Center,
  Spinner,
} from "@chakra-ui/react";
import SuperText from "./SuperText";
import { ReactNode, useEffect } from "react";

interface StatData {
  id: number;
  label: string;
  score: string | ReactNode;
}

const BrandStats = () => {
  const [statData, setStatData] = React.useState<StatData[]>([]);

  useEffect(() => {
    fetch("/api/stats").then((res) => {
      res.json().then((data) => {
        setStatData([
          {
            id: 1,
            label: "Benutzer",
            score: data.users,
          },
          {
            id: 2,
            label: "Projekte",
            score: data.projects,
          },
          {
            id: 3,
            label: "Lektionen",
            score: data.lessons,
          },
          {
            id: 4,
            label: "Organisationen",
            score: data.orgs,
          },
        ]);
      });
    });
  }, []);

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Center>
        <Box textAlign="center">
          <SuperText>Entwickler vertrauen CodeUp</SuperText>
        </Box>
      </Center>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4 }}
        spacing={{ base: 2, sm: 5 }}
        mt={12}
        mb={4}
      >
        {statData.map((data) => (
          <Box key={data.id} p={{ base: 2, sm: 5 }} textAlign="center">
            <Text fontWeight="extrabold" fontSize="xx-large">
              {data.score}
            </Text>
            <Text fontSize="sm">{data.label}</Text>
          </Box>
        ))}
        {statData.length === 0 ? (
          <Center>
            <Spinner />
          </Center>
        ) : null}
      </SimpleGrid>
    </Container>
  );
};

export default BrandStats;
