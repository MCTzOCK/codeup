/**
 * packages/hooks/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.07.2022
 *
 */

import { useCourseProgress } from "./hooks/useCourseProgress";
import useCourseRedirect from "./hooks/useCourseRedirect";
import useHasProfile from "./hooks/useHasProfile";
import useHover from "./hooks/useHover";
import useUserInfo from "./hooks/useUserInfo";
import useUserLoggedIn from "./hooks/useUserLoggedIn";
import useUserLoggedInRedirect from "./hooks/useUserLoggedInRedirect";

export {
  useCourseRedirect,
  useCourseProgress,
  useHasProfile,
  useHover,
  useUserInfo,
  useUserLoggedInRedirect,
  useUserLoggedIn,
};
