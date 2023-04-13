/**
 * src/util/generateMail.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.06.2022
 *
 */

export default function generateMail(firstName: string, content: string) {
  return {
    text: `Moin ${firstName}!,\n\n
${content}\n\n
Beste Grüße aus Hattingen,\n
Ben von CodeUp`,
    html: `
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
  </head>
  <body>
    <div style="
          width: 100vw;
          min-height: 100vh;
          height: fit-content; margin: 0 auto;
          ">
      <div style="
          background-color: #000000;
          padding: 20px;
          width: 100vw;
          min-height: 100vh;
          height: fit-content;
          ">
          
        <div style="width: 100%; text-align: center; display: flex; flex-direction: column; gap: 1rem; align-items: center; justify-content: center;">
          <img src="https://codeup.space/codeup-splash-github.jpg" alt="Ben Siebert" style="width: 100%; min-width: 100%;">
        </div>
        
        <div style="width: 100%; text-align: center;">
          <h1 style="font-size: 2.5rem; font-weight: bold; color: #fff;">Moin ${firstName}!</h1>
        </div>
        
        <div style="width: 100%; text-align: center;">
          <p style="font-size: 1.5rem; color: #fff;">${content}</p>
          <p style="font-size: 1.5rem; color: #fff;">
            Beste Grüße aus Hattingen,<br>
            Ben von <a href="https://codeup.space" style="color: deeppink">CodeUp</a>
          </p>
          <p style="font-size: 1.5rem; color: #fff;">
            <a href="https://codeup.space" style="color: deeppink">codeup.space</a> | <a href="https://ben-siebert.de" style="color: deeppink">ben-siebert.de</a>
          </p>
        </div>

      </div>
    </div>
  </body>
</html>
    `,
  };
}
