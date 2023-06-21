const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
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

  postCreated: {
    type: String,
    default: () => new Date(Date.now()),
    required: true,
  },

  likesCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  commentsCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  likedUser: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
      comment: {
        type: String,
      },
    },
  ],
});

const postModel = mongoose.model("posts", PostSchema);

module.exports = postModel;
