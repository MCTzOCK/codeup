/**
 * src/hooks/useLoggedIn.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import REST from "@codeup/rest";
import { useEffect, useState } from "react";

export function useLoggedIn(): boolean {
  const [loggedIn, setLoggedIn] = useState(false);

  // check every 10 ms if the token has changed

  useEffect(() => {
    let token: string | null = null;
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== null) {
        if (newToken !== token) {
          REST.Account.verify(newToken).then((res) => {
            if (res.status === 200) {
              token = newToken;
              setLoggedIn(true);
            } else {
              token = null;
              setLoggedIn(false);
              localStorage.removeItem("token");
            }
          });
        }
      } else {
        token = null;
        setLoggedIn(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return loggedIn;
}
