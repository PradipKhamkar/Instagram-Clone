import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as EmojisIcon } from "../images/emojis.svg";
import { ReactComponent as ImageIcon } from "../images/photo-heart.svg";
import { ReactComponent as UploadIcon } from "../images/upload.svg";
import { useSelector } from "react-redux";
import { successToast, errorToast } from "../shared/Toast";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const Create = () => {
  const openCreateDialog = useRef();
  const [create, setCreate] = useState("Post");

  useEffect(() => {
    openCreateDialog?.current();
  }, []);

  return (
    <>
      {create === "Post" && <AddPost />}
      {create === "Story" && <AddStory />}
      <CreateDialog openDialog={openCreateDialog} setCreate={setCreate} />
    </>
  );
};

const AddPost = () => {
  document.title = "Add Post";
  const { user } = useSelector((state) => state.authUser);
  const [postData, setPostData] = useState({
    userId: user?._id,
    postCaption: "",
    postImage: "",
  });

  const captionCharacterCountRef = useRef();
  const [previewImage, setPreviewImage] = useState("");
  const [captionCharacterCount, setCaptionCharacterCount] = useState(0);
  const [allFieldFill, setAllFieldFill] = useState(false);
  const [loading, setLoading] = useState(false);

  const handelPostSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/post/create`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      successToast("Post Created..!!");
      setPostData({ ...postData, postCaption: "", postImage: "" });
      setPreviewImage("");
    } catch (error) {
      setLoading(false);
      errorToast(error.message);
    }
  };

  const handelChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      handelPostImage(files[0]);
    } else {
      if (value?.trim()?.length <= 500) {
        setCaptionCharacterCount(value?.trim()?.length);
        setPostData({ ...postData, [id]: value });
        captionCharacterCountRef.current.style.color = "black";
      } else {
        captionCharacterCountRef.current.style.color = "red";
      }
    }
  };

  const handelPostImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 542236) {
        const reader = new FileReader();
        reader.onload = async () => {
          if (reader.readyState === 2) {
            setPostData({ ...postData, postImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
        setPreviewImage(window.URL.createObjectURL(file));
      } else {
        errorToast("Image size should be less then 550KB");
      }
    } else {
      setPostData({ ...postData, profileImage: "" });
      errorToast("Please choose image only..!!");
    }
  };

  const setButtonDisabledValue = () => {
    const postDataValues = Object.values(postData);
    const filledValue = postDataValues.filter((value, index) => {
      return value.trim() !== "";
    });
    if (filledValue.length === postDataValues.length) {
      setAllFieldFill(true);
    } else {
      setAllFieldFill(false);
    }
  };

  useEffect(() => {
    setButtonDisabledValue();
  }, [postData]);

  return (
    <Box justifyContent="center" display="flex" height="100%" pt={9} pb={10}>
      <ToastContainer />
      <Box
        display="flex"
        width={{ md: "800px", xs: "97%", xl: "800px" }}
        justifyContent="center"
      >
        <Stack
          width="inherit"
          direction={{ md: "row", xl: "row", xs: "column", sm: "row" }}
          border={{
            md: "1px solid #eee",
            xs: "none",
            xl: "1px solid #eee",
            sm: "1px solid #eee",
          }}
          p={2}
          justifyContent="center"
          gap={3}
        >
          <Stack
            maxWidth={{ md: "50%", sm: "50%", xl: "50%", xs: "100%" }}
            alignItems="center"
            justifyContent="center"
            gap={3}
            maxHeight={400}
            minWidth="50%"
            py={3}
            bgcolor="white"
            borderRadius={2}
          >
            {!previewImage && <ImageIcon style={{ opacity: 0.5 }} />}
            {previewImage && (
              <Box maxHeight={200}>
                <img src={previewImage} alt="" width="100%" height="100%" />
              </Box>
            )}

            <Stack
              gap={1}
              px={3}
              py={0.5}
              direction="row"
              alignItems="center"
              justifyContent="center"
              style={{
                backgroundColor: "#0095F6",
                color: "white",
                borderRadius: 5,
                fontSize: "0.9rem",
              }}
            >
              <UploadIcon />
              <label htmlFor="postImage">
                {previewImage ? "Another Image" : "Select Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                id="postImage"
                className="selectFile"
                style={{
                  padding: 10,
                  display: "none",
                }}
                onChange={(e) => handelChange(e)}
              />
            </Stack>
          </Stack>
          <Stack
            overflow="auto"
            gap={1}
            component="form"
            maxHeight={400}
            width={{ md: "50%", sm: "50%", xl: "50%" }}
            p={2}
            bgcolor="white"
            borderRadius={2}
          >
            {/*  */}
            <Stack>
              <Stack direction="row" gap={1} alignItems="center">
                <Avatar
                  alt="User Image"
                  src={user?.profile_url}
                  // sx={{ border: "1px solid tomato" }}
                  sx={{ width: 40, height: 40 }}
                />
                <Stack>
                  <Typography variant="body2" fontWeight="Medium">
                    {user?.userName}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              <TextField
                multiline
                id="postCaption"
                value={postData.postCaption}
                placeholder="Write a caption..."
                sx={{
                  "& fieldset": { border: "none" },
                }}
                onChange={(e) => handelChange(e)}
                inputProps={{
                  style: {
                    height: 150,
                  },
                }}
              />
              <Stack gap={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mt={1}
                  sx={{ opacity: 0.4 }}
                >
                  <EmojisIcon />
                  <Typography ref={captionCharacterCountRef}>
                    {captionCharacterCount}/500
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handelPostSubmit}
                  disabled={!allFieldFill || loading ? true : false}
                  style={{
                    border: "none",
                    background: "#0095F6",
                    color: "white",
                    opacity: allFieldFill ? 1 : 0.3,
                  }}
                >
                  {loading ? "Adding Post" : "Add Post"}
                </Button>
              </Stack>
            </Stack>
            {/*  */}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const EditPost = ({ post }) => {
  document.title = "Add Post";

  const captionCharacterCountRef = useRef();
  const { image_url, caption, createdBy, _id } = post;
  const [loading, setLoading] = useState(false);
  const [postCaption, setCaption] = useState(caption);
  const [captionCharacterCount, setCaptionCharacterCount] = useState(0);

  const handelCaption = (value) => {
    if (value?.trim()?.length <= 500) {
      setCaptionCharacterCount(value?.trim()?.length);
      setCaption(value);
      captionCharacterCountRef.current.style.color = "black";
    } else {
      captionCharacterCountRef.current.style.color = "red";
    }
  };

  const handelSubmit = async (post) => {
    if (postCaption.length >= 0) {
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/v1/post/edit`, {
          postId: _id,
          postCaption,
        });
        setLoading(false);
        successToast("Post update successfully");
      } catch (error) {
        setLoading(false);
        errorToast("Failed to update post");
      }
    } else {
      errorToast("Please enter caption");
    }
  };

  return (
    <Box justifyContent="center" display="flex" height="100%" pt={9} pb={10}>
      <ToastContainer />
      <Box
        display="flex"
        width={{ md: "800px", xs: "97%", xl: "800px" }}
        justifyContent="center"
      >
        <Stack
          width="inherit"
          direction={{ md: "row", xl: "row", xs: "column", sm: "row" }}
          border={{
            md: "1px solid #eee",
            xs: "none",
            xl: "1px solid #eee",
            sm: "1px solid #eee",
          }}
          p={2}
          justifyContent="center"
          gap={3}
        >
          <Stack
            maxWidth={{ md: "50%", sm: "50%", xl: "50%", xs: "100%" }}
            alignItems="center"
            justifyContent="center"
            gap={3}
            maxHeight={400}
            minWidth="50%"
            py={3}
            bgcolor="white"
            borderRadius={2}
          >
            <Box maxHeight={200}>
              <img src={image_url} alt="" width="100%" height="100%" />
            </Box>
          </Stack>
          <Stack
            overflow="auto"
            gap={1}
            component="form"
            maxHeight={400}
            width={{ md: "50%", sm: "50%", xl: "50%" }}
            p={2}
            bgcolor="white"
            borderRadius={2}
          >
            {/*  */}
            <Stack>
              <Stack direction="row" gap={1} alignItems="center">
                <Avatar
                  alt="User Image"
                  src={createdBy?.profile_url}
                  // sx={{ border: "1px solid tomato" }}
                  sx={{ width: 40, height: 40 }}
                />
                <Stack>
                  <Typography variant="body2" fontWeight="Medium">
                    {createdBy?.userName}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              <TextField
                multiline
                id="postCaption"
                value={postCaption}
                placeholder="Write a caption..."
                sx={{
                  "& fieldset": { border: "none" },
                }}
                onChange={(e) => handelCaption(e.target.value)}
                inputProps={{
                  style: {
                    height: 150,
                  },
                }}
              />
              <Stack gap={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mt={1}
                  sx={{ opacity: 0.4 }}
                >
                  <EmojisIcon />
                  <Typography ref={captionCharacterCountRef}>
                    {captionCharacterCount}/500
                  </Typography>
                </Stack>
                <Button
                  disabled={loading}
                  variant="contained"
                  size="medium"
                  onClick={handelSubmit}
                >
                  {loading ? "Updating Post" : "Edit Post"}
                </Button>
              </Stack>
            </Stack>
            {/*  */}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const AddStory = () => {
  document.title = "Add Story";
  const { user } = useSelector((state) => state.authUser);
  const [storyData, setStoryData] = useState({
    storyCaption: "",
    storyImage: "",
  });

  const captionCharacterCountRef = useRef();
  const [previewImage, setPreviewImage] = useState("");
  const [captionCharacterCount, setCaptionCharacterCount] = useState(0);
  const [allFieldFill, setAllFieldFill] = useState(false);
  const [loading, setLoading] = useState(false);

  const handelPostSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/story/create`, storyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      successToast("Story Created..!!");
      setStoryData({ ...storyData, storyCaption: "", storyImage: "" });
      setPreviewImage("");
    } catch (error) {
      setLoading(false);
      errorToast(error.message);
    }
  };

  const handelChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      handelPostImage(files[0]);
    } else {
      if (value?.trim()?.length <= 500) {
        setCaptionCharacterCount(value?.trim()?.length);
        setStoryData({ ...storyData, storyCaption: value });
        captionCharacterCountRef.current.style.color = "black";
      } else {
        captionCharacterCountRef.current.style.color = "red";
      }
    }
  };

  const handelPostImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 542236) {
        const reader = new FileReader();
        reader.onload = async () => {
          if (reader.readyState === 2) {
            setStoryData({ ...storyData, storyImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
        setPreviewImage(window.URL.createObjectURL(file));
      } else {
        errorToast("Image size should be less then 550KB");
      }
    } else {
      setStoryData({ ...storyData, storyImage: "" });
      errorToast("Please choose image only..!!");
    }
  };

  const setButtonDisabledValue = () => {
    const storyDataValues = Object.values(storyData);
    const filledValue = storyDataValues.filter((value, index) => {
      return value.trim() !== "";
    });
    if (filledValue.length === storyDataValues.length) {
      setAllFieldFill(true);
    } else {
      setAllFieldFill(false);
    }
  };

  useEffect(() => {
    setButtonDisabledValue();
  }, [storyData]);

  return (
    <Box justifyContent="center" display="flex" height="100%" pt={9} pb={10}>
      <ToastContainer />
      <Box
        display="flex"
        width={{ md: "800px", xs: "97%", xl: "800px" }}
        justifyContent="center"
      >
        <Stack
          width="inherit"
          direction={{ md: "row", xl: "row", xs: "column", sm: "row" }}
          border={{
            md: "1px solid #eee",
            xs: "none",
            xl: "1px solid #eee",
            sm: "1px solid #eee",
          }}
          p={2}
          justifyContent="center"
          gap={3}
        >
          <Stack
            maxWidth={{ md: "50%", sm: "50%", xl: "50%", xs: "100%" }}
            alignItems="center"
            justifyContent="center"
            gap={3}
            maxHeight={400}
            minWidth="50%"
            py={3}
            bgcolor="white"
            borderRadius={2}
          >
            {!previewImage && <ImageIcon style={{ opacity: 0.5 }} />}
            {previewImage && (
              <Box maxHeight={200}>
                <img src={previewImage} alt="" width="100%" height="100%" />
              </Box>
            )}

            <Stack
              gap={1}
              px={3}
              py={0.5}
              direction="row"
              alignItems="center"
              justifyContent="center"
              style={{
                backgroundColor: "#0095F6",
                color: "white",
                borderRadius: 5,
                fontSize: "0.9rem",
              }}
            >
              <UploadIcon />
              <label htmlFor="postImage">
                {previewImage ? "Another Image" : "Select Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                id="postImage"
                className="selectFile"
                style={{
                  padding: 10,
                  display: "none",
                }}
                onChange={(e) => handelChange(e)}
              />
            </Stack>
          </Stack>
          <Stack
            overflow="auto"
            gap={1}
            component="form"
            maxHeight={400}
            width={{ md: "50%", sm: "50%", xl: "50%" }}
            p={2}
            bgcolor="white"
            borderRadius={2}
          >
            {/*  */}
            <Stack>
              <Stack direction="row" gap={1} alignItems="center">
                <Avatar
                  alt="User Image"
                  src={user?.profile_url}
                  // sx={{ border: "1px solid tomato" }}
                  sx={{ width: 40, height: 40 }}
                />
                <Stack>
                  <Typography variant="body2" fontWeight="Medium">
                    {user?.userName}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              <TextField
                multiline
                value={storyData.storyCaption}
                placeholder="Write a caption..."
                sx={{
                  "& fieldset": { border: "none" },
                }}
                onChange={(e) => handelChange(e)}
                inputProps={{
                  style: {
                    height: 150,
                  },
                }}
              />
              <Stack gap={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mt={1}
                  sx={{ opacity: 0.4 }}
                >
                  <EmojisIcon />
                  <Typography ref={captionCharacterCountRef}>
                    {captionCharacterCount}/500
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handelPostSubmit}
                  disabled={!allFieldFill || loading ? true : false}
                  style={{
                    border: "none",
                    background: "#0095F6",
                    color: "white",
                    opacity: allFieldFill ? 1 : 0.3,
                  }}
                >
                  {loading ? "Adding Story" : "Add Story"}
                </Button>
              </Stack>
            </Stack>
            {/*  */}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const Post = () => {
  const location = useLocation();
  if (location?.state?.for === "editPost") {
    return <EditPost post={location?.state?.post} />;
  } else {
    return <Create />;
  }
};

export default Post;

// Option
const CreateDialog = ({ openDialog, setCreate }) => {
  const [open, setOpen] = React.useState(false);
  const handelChange = (create) => {
    setCreate(create);
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    openDialog.current = handleClickOpen;
  }, []);

  return (
    <div>
      <Dialog
        maxWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent
          sx={{
            padding: 0,
            maxWidth: 800,
            maxHeight: 1000,
          }}
        >
          <Stack alignItems="center" gap={1}>
            <Typography
              variant="body2"
              borderBottom="1px solid #eee"
              p={1.5}
              onClick={() => handelChange("Post")}
              sx={{ cursor: "pointer" }}
              px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
            >
              Add Post
            </Typography>
            <Typography
              onClick={() => handelChange("Story")}
              sx={{ cursor: "pointer" }}
              variant="body2"
              borderBottom="1px solid #eee"
              p={1.5}
              px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
            >
              Add Story
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};
