import {
  Avatar,
  Box,
  Stack,
  Typography,
  Card,
  CardMedia,
  Button,
  CardActions,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import CustomizedDialogs from "../../shared/PostDialog";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as PostGridIcon } from "../../images/Frame.svg";
import { ReactComponent as LikeIcon } from "../../images/filledSvg/like.svg";
import { ReactComponent as CommentIcon } from "../../images/filledSvg/comments.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserDetails } from "../../store/userSlice/userDetailsSlice";
import Loader from "../../shared/Loader";
import { getUserPosts } from "../../store/postSlice/userPostSlice";
import ComponentLoader from "../../shared/ComponentLoader";
import { followUnFollow } from "../../store/userSlice/followUnfollowSlice";
import { useRef } from "react";
import ShowUserDialog from "../../shared/ShowUserDialog";
import { likePostAction } from "../../store/postSlice/likeActionSlice";
import { addComment } from "../../store/postSlice/postCommentSlice";
import { savePostAction } from "../../store/postSlice/savePostActionSlice";
import Error from "../../shared/Error";

const Profile = () => {
  document.title = "Profile";
  const { userId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user: authUser,
    loading: authUserLoading,
  } = useSelector((state) => state.authUser);

  const { loading, success, error } = useSelector((state) => state.userDetails);

  // store users
  const [user, setUser] = useState({});
  const [tempUser, setTempUser] = useState(authUser);

  const {
    loading: postLoading,
    posts,
    success: postSuccess,
    error: postError,
  } = useSelector((state) => state.userPosts);

  const {
    loading: followActionLoading,
    success: followActionSuccess,
    error: FollowActionError,
  } = useSelector((state) => state.followUnFollow);

  //Handel User Dialog i.e - view all followers users & following user
  const showUserDialogFun = useRef();
  const [showUserDialogAction, setShowUserDialogAction] = useState(null);

  const handelUserDialog = (action) => {
    setShowUserDialogAction(action);
    showUserDialogFun.current();
  };

  const openPostDialog = React.useRef(null);
  const closePostDialog = useRef();

  const [selectedPost, setSelectedPost] = useState("");
  const [comment, setComment] = useState("");
  // Handel Follow And UnFollow
  const [followerCount, setFollowersCount] = useState(0);
  const [isFollow, setIsFollow] = useState();

  const handelFollow = () =>
    dispatch(followUnFollow(userId, setUser, getIsFollow));

  // Handel Show Post Like And Comment On Mouse Hover
  const [hoverState, setHoverState] = useState(
    Array(posts?.length).fill(false)
  );

  const handleCardMouseEnter = (index) => {
    setHoverState((prevHoverState) => {
      const newState = [...prevHoverState];
      newState[index] = true;
      return newState;
    });
  };

  const handleCardMouseLeave = (index) => {
    setHoverState((prevHoverState) => {
      const newState = [...prevHoverState];
      newState[index] = false;
      return newState;
    });
  };

  const handelPostClick = (data) => {
    setSelectedPost(data);
    openPostDialog?.current();
  };

  const getIsFollow = (data) => {
    setIsFollow(
      data?.user?.followers?.find((followers) => {
        return followers._id === authUser._id;
      })
    );
  };

  const handelLikeAction = () => {
    const isUserLiked = selectedPost?.likedUser?.includes(tempUser._id);
    if (isUserLiked) {
      const updatedLikedUser = selectedPost?.likedUser?.filter(
        (user) => user != tempUser._id
      );
      // console.log("UpdatedLikesUser", updatedLikedUser);
      const likesCount = selectedPost.likesCount;
      setSelectedPost({
        ...selectedPost,
        likedUser: updatedLikedUser,
        likesCount: likesCount - 1,
      });
    } else {
      setSelectedPost({
        ...selectedPost,
        likedUser: [...selectedPost?.likedUser, tempUser._id],
        likesCount: selectedPost?.likesCount + 1,
      });
    }
    dispatch(likePostAction(selectedPost?._id));
  };

  const handelComment = () => {
    setSelectedPost({
      ...selectedPost,
      comments: [
        ...selectedPost.comments,
        {
          user: user._id,
          comment: comment,
        },
      ],
    });
    dispatch(addComment(selectedPost?._id, comment));
    setComment("");
  };

  const handelSavePost = () => {
    const isPostAlreadySaved = tempUser?.savedPost?.includes(selectedPost._id);
    if (isPostAlreadySaved) {
      const updatedSavedPost = tempUser?.savedPost?.filter(
        (postId) => postId !== selectedPost._id
      );
      setTempUser({ ...tempUser, savedPost: updatedSavedPost });
    } else {
      setTempUser({
        ...tempUser,
        savedPost: [...tempUser?.savedPost, selectedPost._id],
      });
    }
    dispatch(savePostAction(selectedPost._id));
  };

  // Format Bio
  const formatBio = (bio) => {
    const line = bio.split(/\r?\n|\r/);
  };

  useEffect(() => {
    if (userId) {
      dispatch(getUserDetails(userId, setUser, getIsFollow));
      dispatch(getUserPosts(userId));
    }
  }, [userId]);

  return (
    <>
      {loading || authUserLoading ? (
        <Loader />
      ) : (
        <>
          {error ? (
            <Error />
          ) : (
            success && (
              <Box
                justifyContent="center"
                display="flex"
                height="100%"
                pt={9}
                pb={10}
              >
                <CustomizedDialogs
                  openPostDialog={openPostDialog}
                  closePostDialog={closePostDialog}
                  likedButtonClickFun={handelLikeAction}
                  commentBtnClickedFun={handelComment}
                  savedButtonClickFun={handelSavePost}
                  tempUser={tempUser}
                  selectedPost={selectedPost}
                  comment={comment}
                  setComment={setComment}
                />
                <ShowUserDialog
                  handelDialLogFun={showUserDialogFun}
                  state={{
                    setUser,
                    userId,
                    isFollow,
                    getIsFollow,
                    showUserDialogAction,
                    user,
                  }}
                  users={
                    showUserDialogAction === "followers"
                      ? user?.followers
                      : showUserDialogAction === "following"
                      ? user?.following
                      : []
                  }
                />
                <Stack
                  maxWidth={1200}
                  display="flex"
                  width={{ md: "800px", xs: "97%", xl: "800px" }}
                  justifyContent="center"
                  p={1}
                >
                  <Stack gap={5}>
                    <Stack
                      direction={{
                        md: "row",
                        xs: "column",
                        xl: "row",
                        sm: "row",
                      }}
                      gap={{ md: 8, sm: 10, xs: 2, xl: 8 }}
                      justifyContent="center"
                      alignItems={{
                        xs: "center",
                        md: "flex-start",
                        sm: "flex-start",
                      }}
                    >
                      <Avatar
                        alt="Profile Picture"
                        src={user?.profile_url}
                        sx={{
                          width: { md: 150, sm: 120, xs: 150, xl: 150 },
                          height: { md: 150, sm: 120, xs: 150, xl: 150 },
                        }}
                      />
                      <Stack pt={0} gap={3}>
                        <Stack
                          direction={{
                            md: "row",
                            xs: "column",
                            xl: "row",
                            sm: "row",
                          }}
                          gap={{ md: 3, sm: 3, xs: 2, xl: 3 }}
                          alignItems="center"
                        >
                          <Typography fontWeight="medium" variant="h6">
                            {user?.userName}
                          </Typography>
                          {authUser?.userName === user?.userName ? (
                            <button
                              style={{
                                // border: "1px solid #eee",
                                outline: "none",
                                padding: 5,
                                fontSize: "1rem",
                                background: "#579BF6",
                                cursor: "pointer",
                                color: "white",
                                border: "none",
                                borderRadius: 2,
                              }}
                              onClick={() => {
                                navigate(`/EditProfile`, {
                                  state: user,
                                });
                              }}
                            >
                              Edit Profile
                            </button>
                          ) : (
                            <button
                              disabled={
                                followActionLoading || followActionSuccess
                              }
                              style={{
                                // border: "1px solid #eee",
                                outline: "none",
                                padding: 5,
                                fontSize: "1rem",
                                background: "#579BF6",
                                cursor: "pointer",
                                color: "white",
                                border: "none",
                                borderRadius: 2,
                              }}
                              onClick={handelFollow}
                            >
                              {followActionLoading
                                ? "Updating"
                                : isFollow
                                ? "Unfollow"
                                : "Follow"}
                            </button>
                          )}
                        </Stack>
                        {/* Start Second Stack */}
                        <Stack
                          direction="row"
                          gap={5}
                          justifyContent={{
                            xs: "center",
                            md: "flex-start",
                            sm: "flex-start",
                          }}
                        >
                          <Stack
                            direction={{
                              md: "row",
                              xs: "column",
                              xl: "row",
                              sm: "row",
                            }}
                            gap={{ md: 1, sm: 1, xs: 0, xl: 1 }}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography fontWeight="medium" variant="body1">
                              {posts ? posts?.length : "0"}
                            </Typography>
                            <Typography variant="body1">Posts</Typography>
                          </Stack>
                          <Stack
                            direction={{
                              md: "row",
                              xs: "column",
                              xl: "row",
                              sm: "row",
                            }}
                            sx={{ cursor: "pointer" }}
                            justifyContent="center"
                            alignItems="center"
                            gap={{ md: 1, sm: 1, xs: 0, xl: 1 }}
                            onClick={() =>
                              user?.followersCount <= 0
                                ? ""
                                : handelUserDialog("followers")
                            }
                          >
                            <Typography fontWeight="medium" variant="body1">
                              {/* {user?.followersCount} */}
                              {user?.followersCount}
                            </Typography>
                            <Typography variant="body1">Follower</Typography>
                          </Stack>
                          <Stack
                            direction={{
                              md: "row",
                              xs: "column",
                              xl: "row",
                              sm: "row",
                            }}
                            gap={{ md: 1, sm: 1, xs: 0, xl: 1 }}
                            justifyContent="center"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              user?.followingCount <= 0
                                ? ""
                                : handelUserDialog("following")
                            }
                          >
                            <Typography fontWeight="medium" variant="body1">
                              {user?.followingCount}
                            </Typography>
                            <Typography variant="body1">Following</Typography>
                          </Stack>
                        </Stack>
                        {/* End Second Stack */}

                        {/* Third Bio Stack */}
                        <Stack
                          gap={1}
                          textAlign={{
                            xs: "center",
                            md: "left",
                            sm: "left",
                          }}
                        >
                          <Typography fontWeight="medium" variant="body1">
                            {user?.tagLine}
                          </Typography>
                          <Typography
                            variant="body1"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {user?.bio?.trim()}
                          </Typography>
                        </Stack>
                        {/* Third Bio Stack End*/}
                      </Stack>
                    </Stack>

                    {/* Post Section Start */}
                    <Stack gap={3}>
                      <Stack
                        alignItems="center"
                        borderTop="0.5px solid #eee"
                        direction="row"
                        justifyContent="center"
                      >
                        <Stack
                          borderTop="2px solid black"
                          alignItems="center"
                          direction="row"
                          gap={0.5}
                          pt={2}
                        >
                          <Typography>
                            <PostGridIcon width={"1rem"} height="0.9rem" />
                          </Typography>
                          <Typography variant="body2">POSTS</Typography>
                        </Stack>
                      </Stack>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={2}
                        width="100%"
                        justifyContent="center"
                        // bgcolor="red"
                      >
                        {postLoading ? (
                          <ComponentLoader />
                        ) : postError ? (
                          "ERROR"
                        ) : posts?.length === 0 ? (
                          <Typography textAlign="center">
                            Not Post Yet
                          </Typography>
                        ) : (
                          posts &&
                          posts?.map((post, index) => (
                            <Card
                              key={index}
                              elevation={0}
                              sx={{ position: "relative", borderRadius: 0 }}
                              onMouseEnter={() => handleCardMouseEnter(index)}
                              onMouseLeave={() => handleCardMouseLeave(index)}
                              onClick={() => handelPostClick(post)}
                            >
                              <CardMedia
                                image={post?.image_url}
                                sx={{
                                  width: {
                                    md: 180,
                                    sm: 180,
                                    xs: 150,
                                    xl: 200,
                                  },
                                  height: {
                                    md: 180,
                                    sm: 180,
                                    xs: 150,
                                    xl: 200,
                                  },
                                  borderRadius: 0,
                                }}
                              />
                              <Box
                                position="absolute"
                                top={0}
                                left={hoverState[index] ? 0 : -200}
                                height="100%"
                                width="100%"
                                bgcolor="rgba(0, 0, 0, 0.5)"
                                cursor="pointer"
                              >
                                <Stack
                                  height="100%"
                                  direction="row"
                                  gap={2}
                                  justifyContent="center"
                                  alignItems="center"
                                  color="white"
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                    color="white"
                                  >
                                    <LikeIcon background="red" />
                                    <Typography
                                      fontWeight="Medium"
                                      variant="body2"
                                    >
                                      {post?.likesCount}
                                    </Typography>
                                  </Stack>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <CommentIcon />
                                    <Typography
                                      fontWeight="Medium"
                                      variant="body2"
                                    >
                                      {post?.commentsCount}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Box>
                            </Card>
                          ))
                        )}
                      </Stack>
                    </Stack>
                    {/* Post Section End */}
                  </Stack>
                </Stack>
              </Box>
            )
          )}
        </>
      )}
    </>
  );
};

export default Profile;
