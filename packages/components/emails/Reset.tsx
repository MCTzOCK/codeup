/**
 * packages/components/emails/Reset.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.04.23
 *
 */

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = "https://codeup.space";

export default function ResetEmail(props: { firstName: string; link: string }) {
  return (
    <Html>
      <Head />
      <Preview>Passwort zurücksetzen</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/codeup.svg`}
                alt="CodeUp"
                width={60}
                height={57}
                className="my-0 mx-auto max-w-full max-h-full"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Passwort <strong>zurücksetzen</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hallo, {props.firstName}!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Klicke auf den Knopf unten, um dein Passwort zurückzusetzen.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={props.link}
              >
                Abschließen
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              Sollte der Knopf nicht funktionieren, kopiere bitte folgenden Link
              in deinen Browser:
              <br />
              <Link
                className="text-[#0070f3] hover:underline"
                href={props.link}
              >
                {props.link}
              </Link>
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              Liebe Grüße aus Hattingen,
              <br />
              Ben von CodeUp
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
