import {
  Avatar,
  Box,
  Card,
  CardMedia,
  IconButton,
  Input,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useForkRef,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PostDialog from "../shared/PostDialog";
import { ReactComponent as LikeIcon } from "../images/like.svg";
import { ReactComponent as CommentIcon } from "../images/comments.svg";
import { ReactComponent as ShareIcon } from "../images/share.svg";
import { ReactComponent as SaveIcon } from "../images/save.svg";
import { ReactComponent as SaveFillIcon } from "../images/filledSvg/save.svg";
import { ReactComponent as EmojisIcon } from "../images/emojis.svg";
import { ReactComponent as OptionIcon } from "../images/options.svg";
import { ReactComponent as RedLikeIcon } from "../images/filledSvg/redLike.svg";
import { likePostAction } from "../store/postSlice/likeActionSlice";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../store/postSlice/postCommentSlice";
import { savePostAction } from "../store/postSlice/savePostActionSlice";
import OptionDialog from "../shared/OptionDailog";
import moment from "moment";
import Picker from "emoji-picker-react";

const PostCard = ({ postData, authUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelOptionDialog = useRef();
  const openPostDialog = useRef();
  const closePostDialog = useRef();

  const [selectedPost, setSelectedPost] = useState("");
  const [comment, setComment] = useState("");
  const [posts, setPost] = useState(postData);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handel Saved
  const [tempUser, setTempUser] = useState(authUser);

  const { user } = useSelector((state) => state.authUser);

  const {
    loading: likeLoading,
    success: likeSuccess,
    error: likeError,
  } = useSelector((state) => state.likePostAction);

  const {
    loading: commentLoading,
    success: commentSuccess,
    error: commentError,
  } = useSelector((state) => state.postComment);

  const {
    loading: saveLoading,
    success: saveSuccess,
    error: saveError,
  } = useSelector((state) => state.savePostAction);

  const handelPostClick = (data) => {
    setSelectedPost(data);
    openPostDialog?.current();
  };

  const handelLikeAction = (postId) => {
    const filteredPost = posts?.find((postItem) => postItem._id === postId);
    const isUserLiked = filteredPost?.likedUser.includes(user._id);
    const updatedPosts = posts?.map((post, index) => {
      if (post._id === postId) {
        const likes = post.likesCount;
        const likedUser = isUserLiked
          ? post.likedUser.filter((id) => id !== user._id)
          : [...post.likedUser, user._id];
        return {
          ...post,
          likesCount: isUserLiked ? likes - 1 : likes + 1,
          likedUser,
        };
      }
      return post;
    });
    setPost(updatedPosts);
    setSelectedPost(updatedPosts.find((post) => post._id === postId));
    dispatch(likePostAction(postId));
  };

  const handelComment = (postId) => {
    if (comment.trim().length !== 0) {
      const updatedPosts = posts?.map((post) => {
        if (post?._id === postId) {
          const comments = [
            ...post?.comments,
            {
              user: {
                _id: user._id,
                userName: user.userName,
                profile_url: user.profile_url,
              },
              comment,
            },
          ];
          return {
            ...post,
            commentsCount: post?.commentsCount + 1,
            comments,
          };
        }
        return post;
      });
      setPost(updatedPosts);
      setSelectedPost(updatedPosts.find((post) => post._id === postId));
      dispatch(addComment(postId, comment));
      setComment("");
    }
  };

  const handelSavedAction = (postId) => {
    const isPostAlreadySaved = tempUser?.savedPost?.includes(postId);
    if (isPostAlreadySaved) {
      const updatedSavedPost = tempUser?.savedPost?.filter(
        (SavedPostId) => SavedPostId !== postId
      );
      setTempUser({ ...tempUser, savedPost: updatedSavedPost });
    } else {
      const savedPosts = tempUser.savedPost;
      setTempUser({ ...tempUser, savedPost: [...savedPosts, postId] });
    }

    dispatch(savePostAction(postId));
  };

  const handelOpenOption = (post) => {
    setSelectedPost(post);
    handelOptionDialog?.current();
  };

  return (
    <>
      <OptionDialog handelDialLogFun={handelOptionDialog} post={selectedPost} />
      <Stack gap={2}>
        {posts?.map((post, index) => (
          <Card
            key={index}
            sx={{
              width: "100%",
              pb: 2,
            }}
            elevation={0}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              p={1}
            >
              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/Profile/${post?.createdBy?._id}`)}
              >
                <Avatar
                  alt="Post Image"
                  src={post?.createdBy?.profile_url}
                  // sx={{ border: "1px solid tomato" }}
                  sx={{ width: 40, height: 40 }}
                />
                <Stack direction="row" gap={0.5} alignItems="center">
                  <Typography variant="body1">
                    {post?.createdBy?.userName}
                  </Typography>
                </Stack>
              </Stack>
              <OptionIcon onClick={() => handelOpenOption(post)} />
            </Stack>
            <CardMedia
              component="img"
              width="100%"
              height="auto"
              image={post?.image_url}
              alt="Post Image"
              // sx={{ borderRadius: 1 }}
            />
            <Stack gap={1} mt={1}>
              <Stack gap={0.1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <IconButton
                      onClick={() => handelLikeAction(post._id)}
                      disabled={likeLoading || likeSuccess}
                    >
                      {post?.likedUser?.includes(user._id) ? (
                        <RedLikeIcon />
                      ) : (
                        <LikeIcon />
                      )}
                    </IconButton>
                    <IconButton component="label" htmlFor={post._id}>
                      <CommentIcon />
                    </IconButton>
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                  </Stack>
                  <Stack>
                    <IconButton
                      onClick={() => handelSavedAction(post._id)}
                      disabled={saveLoading || saveSuccess}
                    >
                      {tempUser?.savedPost?.includes(post._id) ? (
                        <SaveFillIcon />
                      ) : (
                        <SaveIcon />
                      )}
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack px={1}>
                  <Typography variant="body2" fontWeight="Medium">
                    {post?.likesCount} likes
                  </Typography>
                </Stack>
              </Stack>
              <Stack px={1}>
                <Typography variant="body2">
                  <span style={{ fontWeight: "500" }}>
                    {post?.createdBy?.userName}
                  </span>{" "}
                  {post?.caption}
                </Typography>
              </Stack>
              <Stack px={1} gap={1}>
                {post?.comments
                  ?.slice(post?.comments?.length - 2)
                  ?.map((comment, index) => (
                    <Stack
                      direction="row"
                      gap={1}
                      alignItems="center"
                      key={index}
                    >
                      <Typography fontWeight="medium" fontSize="0.8rem">
                        {comment?.user?.userName}
                      </Typography>
                      <Typography fontSize="0.8rem">
                        {comment?.comment}
                      </Typography>
                    </Stack>
                  ))}

                {post?.comments?.length !== 0 ? (
                  <Typography
                    variant="body2"
                    color="grey"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handelPostClick(post)}
                  >
                    See All {post?.commentsCount} Comments
                  </Typography>
                ) : (
                  <Typography variant="body2" color="grey">
                    No Comment Yet
                  </Typography>
                )}
                <Typography variant="caption" color="grey">
                  {moment(post?.postCreated).fromNow()}
                </Typography>
              </Stack>
              {showEmojiPicker && (
                <Stack
                  sx={{
                    width: { md: 300, xs: 300, sm: 300 },
                    height: { md: 250, xs: 230, sm: 250 },
                  }}
                >
                  <Picker
                    skinTonesDisabled={true}
                    theme="light"
                    searchDisabled={true}
                    width="100%"
                    height="100%"
                    onEmojiClick={(e) => setComment(comment + e.emoji)}
                  />
                </Stack>
              )}

              <TextField
                variant="standard"
                placeholder="Add comment"
                value={comment}
                id={post._id}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                InputProps={{
                  sx: { px: 1, fontSize: "0.9rem" },
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <EmojisIcon width={"1.2rem"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      disabled={commentLoading}
                      sx={{
                        cursor: "pointer",
                        outline: "none",
                        border: "none",
                        background: "none",
                      }}
                      component="button"
                      onClick={() => {
                        handelComment(post._id);
                      }}
                    >
                      <Typography sx={{ color: "#007BE5" }} variant="body2">
                        {commentLoading ? "Adding" : " Post"}
                      </Typography>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  style: {
                    marginTop: 7,
                    paddingTop: 8,
                    borderTop: "1px solid #eee",
                  },
                }}
              />
            </Stack>
          </Card>
        ))}
        <PostDialog
          selectedPost={selectedPost}
          openPostDialog={openPostDialog}
          closePostDialog={closePostDialog}
          savedButtonClickFun={handelSavedAction}
          likedButtonClickFun={handelLikeAction}
          commentBtnClickedFun={handelComment}
          tempUser={tempUser}
          comment={comment}
          setComment={setComment}
        />
      </Stack>
    </>
  );
};

export default PostCard;
