const express = require("express");
const {
  createNewPost,
  getAllPost,
  getUserPost,
  editPost,
  deletePost,
  likeAction,
  addComment,
} = require("../controllers/postController");
const isAuthUser = require("../utils/isAuthUser");
const route = express.Router();

route.post("/create", isAuthUser, createNewPost);
route.post("/edit", isAuthUser, editPost);
route.delete("/delete", isAuthUser, deletePost);
route.get("/all", isAuthUser, getAllPost);
route.get("/userPost", isAuthUser, getUserPost);
route.post("/likeAction", isAuthUser, likeAction);
route.post("/addComment", isAuthUser, addComment);

module.exports = route;
