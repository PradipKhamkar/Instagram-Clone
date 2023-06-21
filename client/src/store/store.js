import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./userSlice/userAuthSlice";
import getAllUsersReducer from "./userSlice/allUserSlice";
import getUserDetailsReducer from "./userSlice/userDetailsSlice";
import userPostReducer from "./postSlice/userPostSlice";
import followAndUnFollowReducer from "./userSlice/followUnfollowSlice";
import getAllPostsReducer from "./postSlice/allPostSlice";
import likePostActionReducer from "./postSlice/likeActionSlice";
import postCommentReducer from "./postSlice/postCommentSlice";
import savePostActionReducer from "./postSlice/savePostActionSlice";
import DeletePostReducer from "./postSlice/DeletePostSlice";

const store = configureStore({
  reducer: {
    authUser: userAuthReducer,
    allUsers: getAllUsersReducer,
    userDetails: getUserDetailsReducer,
    userPosts: userPostReducer,
    allPosts: getAllPostsReducer,
    followUnFollow: followAndUnFollowReducer,
    likePostAction: likePostActionReducer,
    postComment: postCommentReducer,
    savePostAction: savePostActionReducer,
    deletePost: DeletePostReducer,
  },
});

export default store;
