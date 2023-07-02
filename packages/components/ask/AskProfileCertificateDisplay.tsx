/**
 * packages/components/ask/AskProfileCertificateDisplay.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2023
 *
 */

import * as React from "react";
import REST from "@codeup/rest/dist";
import AccountManager from "@codeup/util/dist/AccountManager";
import { Flex, Image, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export default function AskProfileCertificateDisplay(props: {
  certificates: string[];
}) {
  const [certificates, setCertificates] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      let certs: any[] = [];
      for (const c of props.certificates) {
        const res = await REST.Certificates.getObtainedCertificate(c);
        if (res.status === 200) {
          certs.push({
            cert: res.payload.obtainedCertificate,
            course: res.payload.course,
          });
        }
      }
      setCertificates(certs);
      console.log(certs);
    })();
  }, [props.certificates]);

  return (
    <>
      {certificates.length === 0 && (
        <>
          <Flex
            alignItems={"center"}
            gap={4}
            color={"red.400"}
            fontWeight={"bold"}
          >
            <FaTimes />
            <Text>Keine Zertifikate angegeben</Text>
          </Flex>
        </>
      )}
      {certificates.length > 0 && (
        <>
          <SimpleGrid columns={[1, 1, 2, 3]} spacing={4}>
            {certificates.map((c) => {
              return (
                <Link
                  key={c.cert.id}
                  isExternal={true}
                  href={"/user-cert/" + c.cert._id}
                >
                  <Flex alignItems={"center"} gap={4} fontWeight={"bold"}>
                    <Image src={c.course.splashImage} maxW={"128px"} />
                    <Stack>
                      <Text>{c.course.name}</Text>
                      <Text
                        color={
                          c.cert.percentage >= 80
                            ? "green.400"
                            : c.cert.percentage >= 50
                            ? "yellow.400"
                            : "red.400"
                        }
                      >
                        {c.cert.percentage}&nbsp;%
                      </Text>
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
