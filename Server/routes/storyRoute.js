const express = require("express");
const {
  createNewStory,
  getAllStory,
  deleteStory,
} = require("../controllers/storyController");
const isAuthUser = require("../utils/isAuthUser");

const route = express.Router();

route.post("/create", isAuthUser, createNewStory);
route.get("/stories", isAuthUser, getAllStory);
route.delete("/delete", isAuthUser, deleteStory);

module.exports = route;
