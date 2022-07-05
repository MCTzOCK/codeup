/**
 * src/util/sendMail.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */
import * as nodemailer from "nodemailer";
import generateMail from "./generateMail";

export default async function sendMail(
  to: string,
  subject: string,
  content: string,
  firstName: string
) {
  let transport = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const tmp = generateMail(firstName, content);

  await transport.sendMail({
    from: "Ben von CodeUp <" + process.env.SMTP_USER + ">",
    to: to,
    replyTo: process.env.SMTP_USER,
    subject: subject,
    text: tmp.text,
    html: tmp.html,
  });
}
