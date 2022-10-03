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
    html0: `
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>

<body>
    <div style="width: 100%; max-width: 600px; margin: 0 auto;">
        <div style="width: 100%; background-color: #fafafa; padding: 20px;">
            
            <div style="width: 100%; text-align: center;">
                <img src="https://static.content.ben-siebert.de/api/public/dl/GMODqV3y" alt="Ben Siebert" style="width: 100%; max-width: 200px;">
            </div> 
            
            <div style="width: 100%; text-align: center;">
                <h1 style="font-size: 1.5em; font-weight: bold;">Moin ${firstName}!</h1>
            </div>
            <div style="width: 100%; text-align: center;">
                <p style="font-size: 1em;">${content}</p>
            </div>
            <div style="width: 100%; text-align: center;">
                <p style="font-size: 1em;">
                    Beste Grüße aus Hattingen,<br>
                    Ben von <a href="https://codeup.space">CodeUp</a>
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`,
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
    <div style="width: 100%; max-width: 600px; margin: 0 auto;">
      <div style="
          width: 100%;
          background-color: #323232;
          padding: 20px;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
          border-radius: 10px;">
          
        <div style="width: 100%; text-align: center; display: flex; flex-direction: column; gap: 1rem; align-items: center; justify-content: center;">
          <img width="64" src="https://codeup.space/codeup.png" alt="Ben Siebert" style="width: 100%; max-width: 200px;">
          
        </div>
        
        <div style="width: 100%; text-align: center;">
          <h1 style="font-size: 2.5rem; font-weight: bold; color: #fff;">Moin ${firstName}!</h1>
        </div>
        
        <div style="width: 100%; text-align: center;">
          <p style="font-size: 1.5rem; color: #fff;">${content}</p>
          <p style="font-size: 1.5rem; color: #fff;">
            Beste Grüße aus Hattingen,<br>
            Ben von <a href="https://codeup.space">CodeUp</a>
          </p>
          <p style="font-size: 1.5rem; color: #fff;">
            <a href="https://codeup.space">codeup.space</a> | <a href="https://ben-siebert.de">ben-siebert.de</a>
          </p>
        </div>

      </div>
    </div>
  </body>
</html>

    `,
  };
}
