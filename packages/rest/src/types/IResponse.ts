/**
 * packages/rest/src/types/IResponse.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */

export interface IResponse {
  status: number;
  payload: {
    [key: string]: any;
  };
}
