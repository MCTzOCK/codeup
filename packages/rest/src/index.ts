/**
 * packages/rest/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.07.2022
 *
 */
import {
  checkResetToken,
  checkUsername,
  deleteAccount,
  login,
  register,
  reset,
  resetConfirm,
  update,
} from "./api/Account";
import makeRequest from "./makeRequest";
import {
  createList,
  createTask,
  deleteList,
  deleteTask,
  getList,
  getMyLists,
} from "./api/ToDo";

const REST = {
  Account: {
    register,
    login,
    checkUsername,
    checkResetToken,
    deleteAccount,
    reset,
    resetConfirm,
    update,
  },
  ToDo: {
    getMyLists,
    createList,
    deleteList,
    getList,
    createTask,
    deleteTask,
  },
  Util: {
    makeRequest: makeRequest,
  },
};

export default REST;
