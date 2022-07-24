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
import {
  addContributor,
  createProject,
  deleteFile,
  deleteProject,
  duplicateProject,
  getContributors,
  getProject,
  getProjectPermissions,
  getProjects,
  overwriteContributorPermissions,
  removeContributor,
  renameProject,
  saveFile,
  publishTemplate,
  removeTemplate,
  updateTemplate,
} from "./api/IDE";
import {
  createPost,
  createProfile,
  deletePost,
  existsProfile,
  getFeed,
  getPost,
  getProfile,
  getProfileFollowers,
  getProfilePosts,
  isFollowing,
  likePost,
  search,
  toggleFollow,
  updateProfile,
} from "./api/Community";

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
  IDE: {
    getProjectPermissions,
    saveFile,
    deleteFile,
    getProject,
    addContributor,
    removeContributor,
    getContributors,
    overwriteContributorPermissions,
    renameProject,
    createProject,
    deleteProject,
    duplicateProject,
    getProjects,
    publishTemplate,
    removeTemplate,
    updateTemplate,
  },
  Community: {
    search,
    getFeed,
    existsProfile,
    createPost,
    getPost,
    likePost,
    deletePost,
    createProfile,
    getProfile,
    updateProfile,
    isFollowing,
    getProfileFollowers,
    getProfilePosts,
    toggleFollow,
  },
  Util: {
    makeRequest: makeRequest,
  },
};

export default REST;
