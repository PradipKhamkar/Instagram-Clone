const coludinary = require("cloudinary");
const { sendSuccess, sendError } = require("../utils/SendResponses");
const storyModel = require("../models/storyModel");

const createNewStory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { storyImage, storyCaption } = req.body;
    if (storyImage) {
      const result = await coludinary.v2.uploader.upload(storyImage, {
        folder: "postImages",
      });
      await storyModel.create({
        createdBy: userId,
        caption: storyCaption,
        public_id: result.public_id,
        image_url: result.url,
      });
      sendSuccess(res, 201, { message: "Story Created" });
    } else {
      sendError(res, 400, "Please Select Image");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const getAllStory = async (req, res) => {
  try {
    const allStory = await storyModel
      .find()
      .populate("createdBy", "profile_url _id userName")
      .sort({ _id: -1 });
    sendSuccess(res, 200, { allStory });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const deleteStory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { storyId } = req.query;
    console.log(storyId);
    const story = await storyModel.findOne({
      $and: [{ createdBy: userId }, { _id: storyId }],
    });
    if (story) {
      await storyModel.findByIdAndDelete(storyId);
      sendSuccess(res, 200, "Story Deleted");
    } else {
      sendError(res, 400, "Story Is Not Associated With Id's");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

module.exports = {
  createNewStory,
  getAllStory,
  deleteStory,
};
