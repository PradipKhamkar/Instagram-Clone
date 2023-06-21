const postModel = require("../models/postModel");
const coludinary = require("cloudinary");
const { sendSuccess, sendError } = require("../utils/SendResponses");

const createNewPost = async (req, res) => {
  try {
    const { postImage, postCaption, userId } = req.body;
    if (postImage) {
      const result = await coludinary.v2.uploader.upload(postImage, {
        folder: "postImages",
      });
      await postModel.create({
        createdBy: userId,
        caption: postCaption,
        public_id: result.public_id,
        image_url: result.url,
      });
      sendSuccess(res, 201, { message: "Post Created" });
    } else {
      sendError(res, 400, "Please Select Image");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const getAllPost = async (req, res) => {
  try {
    const allPost = await postModel
      .find()
      .populate("comments.user", "userName profile_url")
      .populate("createdBy", "profile_url _id userName")
      .find({ accountType: "public" })
      .sort({ _id: -1 });
    sendSuccess(res, 200, { allPost });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const getUserPost = async (req, res) => {
  try {
    const { userId } = req.query;
    const isPostExit = await postModel
      .find({
        createdBy: userId,
      })
      .populate("createdBy", "profile_url _id userName");

    if (isPostExit) {
      sendSuccess(res, 200, { posts: isPostExit });
    } else {
      sendError(res, 400, "Post Is Not Associated With Id's");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const editPost = async (req, res) => {
  try {
    const userId = req.user;
    const { postId, postCaption } = req.body;
    const isPostExit = await postModel.findOne({
      $and: [{ createdBy: userId }, { _id: postId }],
    });
    if (isPostExit) {
      isPostExit.caption = postCaption;
      await isPostExit.save();
      sendSuccess(res, 200, "Post Updated");
    } else {
      sendError(res, 400, "Post Is Not Associated With Id's");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.query;

    const isPostExit = await postModel.findOne({
      $and: [{ createdBy: userId }, { _id: postId }],
    });
    if (isPostExit) {
      await postModel.findByIdAndDelete(postId);
      sendSuccess(res, 200, "Post Deleted");
    } else {
      sendError(res, 400, "Post Is Not Associated With Id's");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const likeAction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.query;
    // console.log(userId, postId);
    if (postId && userId) {
      const post = await postModel.findById(postId);
      if (post != {}) {
        const isUserAlreadyLike = post?.likedUser?.includes(userId);
        if (isUserAlreadyLike) {
          //dislike code
          const likedUserIndex = post?.likedUser?.indexOf(userId);
          post?.likedUser.splice(likedUserIndex, 1);
          post.likesCount--;
          await post.save();
          sendSuccess(res, 200, { message: "Post Disliked" });
        } else {
          //like code
          post?.likedUser?.push(userId);
          post.likesCount++;
          await post.save();
          sendSuccess(res, 200, { message: "Post Liked" });
        }
      } else {
        sendError(res, 400, "Post Not Found");
      }
    } else {
      sendError(res, 400, "PostIds Or UserId Not Found");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.query;
    const { comment } = req.body;

    if (userId && postId && comment) {
      const isPostExit = await postModel.findById(postId);
      if (isPostExit !== {}) {
        isPostExit.comments.push({ user: userId, comment });
        isPostExit.commentsCount++;
        await isPostExit.save();
        sendSuccess(res, 201, { message: "Comment Added" });
      } else {
        sendError(res, 400, { message: "Post Not Exit With This PostId..!!" });
      }
    } else {
      sendError(res, 400, { message: "Required Values Missing..!!" });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

module.exports = {
  createNewPost,
  getAllPost,
  getUserPost,
  editPost,
  deletePost,
  likeAction,
  addComment,
};
