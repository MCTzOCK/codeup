/**
 * apps/web/src/pages/api/creator/certificates/test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.11.2022
 *
 */

import { NextApiRequest, NextApiResponse } from "next";
import Certificate from "@codeup/util/src/models/Certificate";
import {
  CertificateBuilder,
  CodeCheckBuilder,
  CodeCompareBuilder,
  MultipleChoiceBuilder,
  TextBuilder,
} from "@codeup/util/src/certificates/CertificateBuilder";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const certificate = new CertificateBuilder()
    .setCourse("637bd532f84a739ebb66ea54")
    .setMinPercentage(50)
    .addStep(
      new MultipleChoiceBuilder()
        .setTitle("Beantworte die Frage")
        .setQuestion("Frage 1")
        .addAnswer("Antwort 1", true)
        .addAnswer("Antwort 2", false)
        .addAnswer("Antwort 3", false)
        .build()
    )
    .addStep(
      new MultipleChoiceBuilder()
        .setTitle("Beantworte die Frage")
        .setQuestion("Frage 2")
        .addAnswer("Antwort 1", true)
        .addAnswer("Antwort 2", false)
        .addAnswer("Antwort 3", false)
        .build()
    )
    .addStep(
      new TextBuilder()
        .setTitle("Der Knopf soll den Text 'Klick mich' anzeigen")
        .addText("<button>")
        .addInput("Klick mich")
        .addText("</button>")
        .build()
    )
    .addStep(
      new TextBuilder()
        .setTitle("Der Link soll zu 'https://codeup.space' führen")
        .addText("<a href='")
        .addInput("https://codeup.space")
        .addText("'>")
        .addInput("Klick mich")
        .addText("</a>")
        .build()
    )
    .addStep(
      new CodeCompareBuilder()
        .setTitle("Der Code soll die Ausgabe 'Hallo Welt' haben")
        .setCodeA("console.log('Hallo Welt')", true)
        .setCodeB("log('Hallo Welt')", false)
        .build()
    )
    .addStep(
      new CodeCheckBuilder()
        .setTitle("Welcher Code ist richtig?")
        .setCodeA("console.log('Hallo Welt')", true)
        .setCodeB("console::log('Hallo Welt')", false)
        .build()
    )
    .build();

  const cert = await Certificate.create(certificate);

  res.status(200).json({ mongo: cert, json: certificate });

  return;
}
