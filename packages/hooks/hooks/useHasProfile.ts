/**
 * src/hooks/hasProfile.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.06.2022
 *
 */
import { useEffect, useState } from "react";
import REST from "@codeup/rest";
import { useLoggedIn } from "./useLoggedIn";

export default function useHasProfile(): {
  hasProfile: boolean;
  tried: boolean;
} {
  const [hasProfile, setHasProfile] = useState({
    hasProfile: false,
    tried: false,
  });

  const { loggedIn, userInfo } = useLoggedIn();

  useEffect(() => {
    if (loggedIn) {
      REST.Community.existsProfile(userInfo.id).then((res) => {
        if (res.status === 200) {
          setHasProfile({
            hasProfile: true,
            tried: true,
          });
        } else {
          setHasProfile({
            hasProfile: false,
            tried: true,
          });
        }
      });
    }
  }, [userInfo, loggedIn]);

  return hasProfile;
}
