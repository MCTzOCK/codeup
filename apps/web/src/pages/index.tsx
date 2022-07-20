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
      const res = await REST.Account.deleteAccount(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDgzZGUxYjFkNGJjZjg0ZTAyYzAyYSIsImVtYWlsIjoibm8tcmVwbHlAY29kZXVwLnNwYWNlIiwiZmlyc3ROYW1lIjoiU3VwZXIiLCJsYXN0TmFtZSI6Ik1hbiIsIl8yZmEiOmZhbHNlLCJ1c2VybmFtZSI6Im15dXNlcm5hbWUiLCJpYXQiOjE2NTgzMzk4MDEsImV4cCI6MTY2MDkzMTgwMX0.h5RKQeLfBameAj5nHIdezjyC_GPFDBulOWQ0uMj8GXE"
      );
      console.log(res);
    })();
  }, []);
  return <></>;
}
