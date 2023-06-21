import { Box, Card, CardMedia, Stack } from "@mui/material";
import Loader from "../shared/Loader";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import PostDialog from "../shared/PostDialog";
import { savePostAction } from "../store/postSlice/savePostActionSlice";
import { useDispatch, useSelector } from "react-redux";
import { likePostAction } from "../store/postSlice/likeActionSlice";
import { addComment } from "../store/postSlice/postCommentSlice";
import SearchUserDrawer from "../shared/SearchUserDrawer";
import Empty from "../shared/Empty";

const SavedPost = () => {
  document.title = "Saved Post";
  const { user } = useSelector((state) => state.authUser);

  const openPostDialog = useRef();
  const closePostDialog = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState();
  const [selectedPost, setSelectedPost] = useState({});
  const [comment, setComment] = useState("");
  const [tempUser, setTempUser] = useState(user);

  const getSavedPost = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/user/savedPost`);
      setLoading(false);
      setPosts(data.posts);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const handelPostClick = (post) => {
    setSelectedPost(post);
    openPostDialog?.current();
  };

  const handelLikeAction = (postId) => {
    const isUserLiked = selectedPost?.likedUser.includes(user._id);
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
    setPosts(updatedPosts);
    setSelectedPost(updatedPosts.find((post) => post._id === postId));
    dispatch(likePostAction(postId));
  };

  const removeSave = () => {
    const updatedPosts = posts.filter((post) => post._id !== selectedPost._id);
    setPosts(updatedPosts);
    closePostDialog?.current();
    dispatch(savePostAction(selectedPost._id));
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
      setPosts(updatedPosts);
      setSelectedPost(updatedPosts.find((post) => post._id === postId));
      dispatch(addComment(postId, comment));
      setComment("");
    }
  };

  useEffect(() => {
    getSavedPost();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        "Error"
      ) : (
        <Box
          justifyContent="center"
          display="flex"
          height="100%"
          pt={9}
          pb={10}
        >
          <PostDialog
            postData={selectedPost}
            openPostDialog={openPostDialog}
            closePostDialog={closePostDialog}
            savedButtonClickFun={removeSave}
            likedButtonClickFun={handelLikeAction}
            commentBtnClickedFun={handelComment}
            selectedPost={selectedPost}
            comment={comment}
            setComment={setComment}
            tempUser={tempUser}
          />

          <Stack
            maxWidth={1200}
            display="flex"
            width={{ md: "800px", xs: "97%", xl: "800px" }}
            justifyContent="center"
            p={1}
            direction="row"
            gap={2}
            flexWrap={"wrap"}
          >
            {posts?.length <= 0 ? (
              <Empty />
            ) : (
              posts &&
              posts.map((post) => (
                <Card
                  sx={{
                    width: {
                      md: 200,
                      sm: 200,
                      xs: 150,
                      xl: 200,
                    },
                    height: {
                      md: 200,
                      sm: 200,
                      xs: 150,
                      xl: 200,
                    },
                    borderRadius: 0,
                  }}
                  key={post._id}
                  elevation={0}
                  onClick={() => handelPostClick(post)}
                >
                  <CardMedia
                    component="img"
                    src={post?.image_url}
                    alt="Post Image"
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Card>
              ))
            )}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default SavedPost;
