/**
 * packages/components/emails/Newsletter.tsx
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

export default function NewsletterEmail(props: { firstName: string; content: string }) {
  return (
    <Html>
      <Head />
      <Preview>Neuer Newsletter von CodeUp</Preview>
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
              <strong>Newsletter</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hallo, {props.firstName}!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {props.content}
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
