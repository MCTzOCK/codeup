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
        html: `
<!DOCTYPE html>
<html lang="en">

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
                <h1 style="font-size: 1.5em; font-weight: bold;">Hi ${firstName}!</h1>
            </div>
            <div style="width: 100%; text-align: center;">
                <p style="font-size: 1em;">${content}</p>
            </div>
            <div style="width: 100%; text-align: center;">
                <p style="font-size: 1em;">
                    Best Regards,<br>
                    Ben from <a href="https://codeup.ben-siebert.de">CodeUp</a>
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`,
        text: `Hello ${firstName},\n\n
${content}\n\n
Best Regards,\n
Ben from CodeUp`
    }
}