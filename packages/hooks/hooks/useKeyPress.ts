// DISCLAIMER START

/* Original: https://usehooks.com/useKeyPress/ */
/* The original code has been modified */

// DISCLAIMER END

/**
 * @codeup/hooks/hooks/useKeyPress.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.07.2022
 *
 */

import { useEffect, useState } from "react";

export default function useKeyPress(
  targetKey: string,
  ctrlKey: boolean = false
): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(ev: KeyboardEvent): void {
    let ctrlCon = ctrlKey ? ev.ctrlKey : true;
    if (ev.key === targetKey && ctrlCon) {
      ev.preventDefault();
      setKeyPressed(true);
    }
  }

  const upHandler = (ev: KeyboardEvent): void => {
    if (ev.key === targetKey) {
      ev.preventDefault();
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
  return keyPressed;
}
