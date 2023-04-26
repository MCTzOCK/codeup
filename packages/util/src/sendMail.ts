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
  if (process.env.SMTP_DISABLE) {
    console.log("SMTP is disabled");
    return;
  }

  let transport = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
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

export async function sendMailV2(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (process.env.SMTP_DISABLE) {
    console.log("SMTP is disabled");
    return;
  }

  let transport = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transport.sendMail({
    from: "Ben von CodeUp <" + process.env.SMTP_USER + ">",
    to: options.to,
    replyTo: process.env.SMTP_USER,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}
