/**
 * packages/rest/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import { register } from "./api/Account";
import makeRequest from "./makeRequest";

const REST = {
  Account: {
    register: register,
  },
  Util: {
    makeRequest: makeRequest,
  },
};

export default REST;
