const userModel = require("../models/userModel");
const { sendError, sendSuccess } = require("../utils/SendResponses");
const bcrypt = require("bcrypt");
const coludinary = require("cloudinary");
const { setToken, setCookie } = require("../utils/setToken");
const postModel = require("../models/postModel");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const createUserController = async (req, res) => {
  const { email, userName, profileImage, password } = req.body;
  try {
    const isEmailExit = await userModel.findOne({ email });
    if (!isEmailExit) {
      const isUserName = await userModel.findOne({ userName });
      if (!isUserName) {
        const result = await coludinary.v2.uploader.upload(profileImage, {
          folder: "InstaUserProfile",
        });

        const newUser = await userModel.create({
          ...req.body,
          public_id: result.public_id,
          profile_url: result.url,
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        await newUser.save();
        userLogin({ body: { userNameOrEmail: email, password } }, res);
        // sendSuccess(res, 201, { message: "User Registered..!!" });
      } else {
        sendError(res, 400, "User Name Already Exit..!!");
      }
    } else {
      sendError(res, 400, "Email Already Exit..!!");
    }
  } catch (error) {
    console.log(error);
    sendError(res, 400, error.message);
  }
};

const userLogin = async (req, res) => {
  const { userNameOrEmail, password } = req.body;
  try {
    if (userNameOrEmail && password) {
      const isUserExit = await userModel.findOne({
        $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }],
      });

      if (isUserExit) {
        const isPasswordMatch = await bcrypt.compare(
          password,
          isUserExit.password
        );

        if (isPasswordMatch) {
          const token = await setToken(isUserExit._id);
          await setCookie(
            res,
            200,
            token,
            isUserExit,
            "User Login SuccessFully..!!"
          );
        } else {
          sendError(res, 500, "Invalid Credential..!!");
        }
      } else {
        sendError(res, 500, "Invalid Credential..!!");
      }
    } else {
      sendError(res, 404, "All Field Required..!!");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

//Get Logged User Data
const getLoggedUser = async (req, res) => {
  sendSuccess(res, 200, { userData: req.user });
};

const getAllUser = async (req, res) => {
  try {
    const getAllUser = await userModel.find(
      {},
      "userName profile_url following"
    );
    const filterUser = getAllUser?.filter((user) => {
      return user._id !== req.user._id;
    });
    sendSuccess(res, 200, { allUsers: filterUser });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.query.userId)
      .populate("followers following", "userName profile_url")
      .select("-password");
    sendSuccess(res, 200, { user });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const searchUserByUserName = async (req, res) => {
  try {
    const keyword = req.query?.keyword;
    const users = await userModel
      .find(
        {
          userName: {
            $regex: keyword,
            $options: "i",
          },
        },
        "profile_url userName tagLine"
      )
      .select("-password");

    sendSuccess(res, 200, { users: users });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const saveAndRemovePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.query;
    if (userId && postId) {
      const post = await postModel.findById(postId);
      const user = await userModel.findById(userId);
      if (post !== {} && user !== {}) {
        const isPostAlreadySaved = user.savedPost.includes(postId);
        if (isPostAlreadySaved) {
          // Remove Post From Saved
          const updatedSavedPost = user.savedPost.filter((SavedPostId) => {
            return SavedPostId !== postId;
          });
          const postIdIndex = user.savedPost.indexOf(postId);
          user.savedPost.splice(postIdIndex, 1);
          await user.save();
          sendSuccess(res, 200, { message: "Remove From Saved Post" });
        } else {
          // Add Post To Save
          user.savedPost.push(postId);
          await user.save();
          sendSuccess(res, 201, { message: "Added To Saved Post" });
        }
      } else {
        sendError(res, 400, { message: "Post Or User Not Exit With This Id" });
      }
    } else {
      sendError(res, 400, { message: "UserId Or PostId Not Found" });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const userData = await userModel.findById(userId);
    const savedPostIds = userData?.savedPost;
    const posts = await postModel
      .find({ _id: { $in: savedPostIds } })
      .populate("createdBy comments.user")
      .select("-password");
    sendSuccess(res, 200, { posts });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    let isProfileDataIsValid = null;
    const userId = req.user._id;
    const { profileImage, userName, tagLine, bio, email } = req.body;
    const user = await userModel.findById(userId);
    if (user.userName === userName) {
      isProfileDataIsValid = true;
    } else {
      const isUserNameAlreadyExit = await userModel.findOne({
        userName: userName,
      });

      if (isUserNameAlreadyExit === null) {
        isProfileDataIsValid = true;
      } else {
        isProfileDataIsValid = null;
        sendError(res, 400, "Username Not Available ");
      }
    }
    if (isProfileDataIsValid != null) {
      user.userName = userName;
      user.email = email;
      user.bio = bio;
      user.tagLine = tagLine;
      if (profileImage !== "") {
        const result = await coludinary.v2.uploader.upload(profileImage, {
          folder: "InstaUserProfile",
        });
        user.public_id = result.public_id;
        user.profile_url = result.url;
      }
      await user.save();
      sendSuccess(res, 200, { message: "Profile Updated..!!" });
    }
  } catch (error) {
    // console.log(Object.values(error));
    if (error.name === "ValidationError") {
      const values = Object.values(error.errors);
      sendError(res, 400, values[0]?.message);
    } else {
      sendError(res, 400, `Somethings Went's To Wrong`);
    }
  }
};

const updateAccountType = async (req, res) => {
  try {
    const userId = req.user._id;
    const { accountStatus } = req.body;
    const user = await userModel.findById(userId);
    if (accountStatus?.trim().length <= 0) {
      sendError(res, 400, { message: "Invalid Account Type" });
    } else {
      user.accountType = accountStatus;
      await user.save();
      sendSuccess(res, 200, { message: "Account Type Updated..!!" });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } =
      req.body?.passwordData;
    const user = await userModel.findById(userId);
    if (newPassword === confirmPassword) {
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (isPasswordMatch) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        sendSuccess(res, 200, "Password Updated..!!");
      } else {
        sendError(res, 400, "Old Password Is Invalid ");
      }
    } else {
      sendError(res, 400, "Password Field Not Match");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const followAndUnFollow = async (req, res) => {
  try {
    const authUserId = req?.user?._id;
    const { userId } = req.query;
    const authUserData = await userModel
      .findById(authUserId)
      .select("-password");
    const userData = await userModel
      .findById(userId)
      .populate("followers following")
      .select("-password")
      .select("-email");

    if (userData && authUserData) {
      const isUserFollow = userData.followers.find((follower) => {
        return follower._id.toString() === authUserId.toString();
      });

      if (isUserFollow) {
        // UNFOLLOW

        const followerIndex = userData?.followers?.indexOf(authUserId);
        userData.followers?.splice(followerIndex, 1);
        userData.followersCount--;
        await userData.save();
        // await updatedUserData.save();

        //Remove Following From AuthUser
        const followingIndex = authUserData?.followers?.indexOf(userId);
        authUserData.following?.splice(followingIndex, 1);
        authUserData.followingCount--;
        await authUserData.save();

        const updatedData = await userModel
          .findById(userId)
          .populate("followers following", "_id userName profile_url")
          .select("-password");

        //Send Response
        sendSuccess(res, 200, {
          message: "UnFollow Success",
          user: updatedData,
        });
      } else if (isUserFollow === undefined) {
        // FOLLOW
        userData?.followers?.push(authUserId);
        userData.followersCount = userData.followersCount + 1;
        await userData.save();

        //Add Following In AuthUser
        authUserData?.following?.push(userId);
        authUserData.followingCount++;
        await authUserData.save();

        const updatedData = await userModel
          .findById(userId)
          .populate("followers following", "_id userName profile_url")
          .select("-password");

        // Send Response
        sendSuccess(res, 200, {
          message: "Follow Success",
          user: updatedData,
        });
      } else {
        sendError(res, 400, "Somethings Is Wrong");
      }
    } else {
      sendError(res, 400, "User Not Found..!!");
    }
  } catch (error) {
    console.log(error.message);
    sendError(res, 400, error.message);
  }
};

const removeFollowing = async (req, res) => {
  try {
    const authUserId = req?.user?._id;
    const { userId } = req.query;
    const authUserData = await userModel
      .findById(authUserId)
      .populate("followers following", "userName _id profile_url");

    if (authUserData !== {} && userId) {
      const isUserFollow = authUserData.following.find((following) => {
        console.log(following);
        return following._id.toString() === userId.toString();
      });

      if (isUserFollow) {
        const followerIndex = authUserData?.following?.indexOf(userId);
        authUserData.following?.splice(followerIndex, 1);
        authUserData.followingCount--;
        await authUserData.save();
        sendSuccess(res, 200, { user: authUserData });
      } else {
        sendError(res, 400, { message: "You Not Following This User..!!" });
      }
    } else {
      sendError(res, 400, { message: "User Not Exit..!!" });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const removeFollowers = async (req, res) => {
  try {
    const authUserId = req?.user?._id;
    const { userId } = req.query;
    const authUserData = await userModel
      .findById(authUserId)
      .populate("followers following", "userName _id profile_url");
    console.log(userId);
    if (authUserData !== {} && userId) {
      const isUserFollow = authUserData.followers.find((follower) => {
        return follower._id.toString() === userId.toString();
      });
      if (isUserFollow) {
        const followerIndex = authUserData?.followers?.indexOf(userId);
        authUserData.followers?.splice(followerIndex, 1);
        authUserData.followersCount--;
        await authUserData.save();
        sendSuccess(res, 200, { user: authUserData });
      } else {
        sendError(res, 400, { message: "User Not Following You..!!" });
      }
    } else {
      sendError(res, 400, { message: "User Not Exit..!!" });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

//LogOut User
const userLogOut = async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  sendSuccess(res, 200, { message: "User LoggedOut..!!" });
};

const passwordResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await userModel.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "5m",
          }
        );
        const transporter = nodeMailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
          },
        });

        const link = `${req.protocol}://${req.get("host")}/ResetPassword/${
          user._id
        }/${token}`;

        // const link = `${req.protocol}://localhost:3000/ResetPassword/${user._id}/${token}`;

        await transporter.sendMail({
          from: process.env.SMPT_MAIL,
          to: user.email,
          subject: "Instagram Password Reset",
          html: `<h2>Hello ${user?.userName}</h2><br>
              <center>
              <h5>Your Password Reset Link is <a href=${link}>Click Here To Reset Password</a> </h5>
              </center>     `,
        });
        sendSuccess(res, 200, { message: "Password Reset Link Sent..!!" });
      } else {
        sendError(res, 400, { message: "User Not Found...!!" });
      }
    } else {
      sendError(res, 400, { message: "Please Enter Email..!!" });
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { confirmPassword, password } = req.body;

    const { id, token } = req.params;

    if (confirmPassword === password) {
      await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await userModel.findById(id);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      sendSuccess(res, 200, "Password Update Successfully..!!");
    } else {
      sendError(res, 400, "Both password not matched");
    }
  } catch (error) {
    sendError(
      res,
      400,
      error.message === "jwt expired" ? "Token expired" : error.message
    );
  }
};

module.exports = {
  createUserController,
  userLogin,
  getLoggedUser,
  getAllUser,
  getUserDetails,
  searchUserByUserName,
  saveAndRemovePost,
  getSavedPosts,
  saveAndRemovePost,
  followAndUnFollow,
  removeFollowing,
  removeFollowers,
  updateProfile,
  updateAccountType,
  updatePassword,
  userLogOut,
  passwordResetLink,
  resetPassword,
};
