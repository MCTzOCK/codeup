/**
 * src/pages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.06.2022
 *
 */

import * as React from "react";
import { Player } from "@remotion/player";
import REST from "@codeup/rest";

export default function Home() {
  React.useEffect(() => {
    (async () => {
      const res = await REST.Account.register({
        firstName: "Super",
        email: "no-reply@codeup.space",
        lastName: "Man",
        username: "myusername",
        password: "Ben_2007!",
      });
      console.log(res);
    })();
  });
  return <></>;
}
