const mongoose = require("mongoose");

const StorySchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  caption: {
    type: String,
  },
  image_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  storyCreated: {
    type: String,
    default: () => new Date(Date.now()),
    required: true,
  },
});

const storyModel = mongoose.model("story", StorySchema);

module.exports = storyModel;
