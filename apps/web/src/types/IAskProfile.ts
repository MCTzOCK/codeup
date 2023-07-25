/**
 * apps/web/src/types/IAskProfile.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.06.23
 *
 */

export interface IAskProfile {
  user: string;
  username: string;
  banner: string;
  website: string;
  bio: string;
  badges: string[];
  certificates: string[];
  projects: string[];
}
