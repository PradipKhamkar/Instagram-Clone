const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Please Enter Email"],
  },
  fullName: {
    type: String,
    trim: true,
    required: [true, "Please Enter fullName"],
  },

  userName: {
    type: String,
    unique: [true, "Username Already Exit"],
    trim: true,
    required: [true, "Please Enter UserName"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Please Enter Password"],
  },
  bio: {
    type: String,
    default: `
    👋 Hello
    😀 New To Instagram
    `,
  },
  tagLine: {
    type: String,
    default: `
   New to instagram
    `,
  },
  postsCount: {
    type: Number,
    trim: true,
    default: 0,
  },

  followersCount: {
    type: Number,
    trim: true,
    default: 0,
    min: 0,
  },

  followingCount: {
    type: Number,
    trim: true,
    default: 0,
    min: 0,
  },

  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  ],

  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  ],

  public_id: {
    type: String,
    required: true,
  },
  profile_url: {
    type: String,
    required: true,
  },
  savedPost: [
    {
      type: mongoose.Types.ObjectId,
      ref: "posts",
    },
  ],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
