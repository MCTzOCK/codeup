/**
 * src/hooks/useHover.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2022
 *
 */
import { useEffect, useRef, useState } from "react";

export default function useHover() {
  const [value, setValue] = useState(false);

  const ref = useRef(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        (node as HTMLElement).addEventListener("mouseover", handleMouseOver);
        (node as HTMLElement).addEventListener("mouseout", handleMouseOut);

        return () => {
          (node as HTMLElement).removeEventListener(
            "mouseover",
            handleMouseOver
          );
          (node as HTMLElement).removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}
