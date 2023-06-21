const express = require("express");
const {
  createUserController,
  userLogin,
  getLoggedUser,
  getAllUser,
  getUserDetails,
  followAndUnFollow,
  saveAndRemovePost,
  updateProfile,
  updateAccountType,
  updatePassword,
  removeFollowing,
  removeFollowers,
  getSavedPosts,
  searchUserByUserName,
  userLogOut,
  passwordResetLink,
  resetPassword,
} = require("../controllers/userController");

const isAuthUser = require("../utils/isAuthUser");
const route = express.Router();

route.post("/register", createUserController);
route.post("/login", userLogin);
route.get("/logged", isAuthUser, getLoggedUser);
route.get("/allUser", isAuthUser, getAllUser);
route.get("/user", isAuthUser, getUserDetails);
route.get("/search", isAuthUser, searchUserByUserName);
route.post("/editProfile", isAuthUser, updateProfile);
route.post("/updateAccount", isAuthUser, updateAccountType);
route.post("/updatePassword", isAuthUser, updatePassword);
route.post("/followAndUnFollow", isAuthUser, followAndUnFollow);
route.post("/removeFollowing", isAuthUser, removeFollowing);
route.post("/removeFollowers", isAuthUser, removeFollowers);
route.post("/saveAndRemove", isAuthUser, saveAndRemovePost);
route.get("/savedPost", isAuthUser, getSavedPosts);
route.get("/logOut", isAuthUser, userLogOut);
route.post("/forgotPassword", passwordResetLink);
route.post("/resetPassword/:id/:token", resetPassword);

module.exports = route;
