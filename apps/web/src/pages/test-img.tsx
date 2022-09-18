/**
 * apps/web/src/pages/test-img.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.09.2022
 *
 */

import * as React from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import { useEffect, useState } from "react";

export default function Component() {
  const [data, setData] = useState("");

  useEffect(() => x, []);

  const x = () => {
    const RANDOM_STRING =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const svg = createAvatar(style, {
      seed: RANDOM_STRING,
      colorful: true,
    });

    setData("data:image/svg+xml;base64," + Buffer.from(svg).toString("base64"));
  };

  return (
    <>
      <img src={data} width={256} height={256} onClick={x} />{" "}
    </>
  );
}
