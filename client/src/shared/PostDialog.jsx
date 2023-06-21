import React, { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import moment from "moment";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { ReactComponent as LikeIcon } from "../images/like.svg";
import { ReactComponent as CommentIcon } from "../images/comments.svg";
import { ReactComponent as ShareIcon } from "../images/share.svg";
import { ReactComponent as SaveIcon } from "../images/save.svg";
import { ReactComponent as SaveFillIcon } from "../images/filledSvg/save.svg";
import { ReactComponent as EmojisIcon } from "../images/emojis.svg";
import { ReactComponent as OptionIcon } from "../images/options.svg";
import { ReactComponent as RedLikeIcon } from "../images/filledSvg/redLike.svg";
import OptionDialog from "./OptionDailog";
import { useDispatch, useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import { useState } from "react";

const PostDialog = ({
  openPostDialog,
  closePostDialog,
  likedButtonClickFun,
  commentBtnClickedFun,
  savedButtonClickFun,
  selectedPost,
  comment,
  setComment,
  tempUser,
}) => {
  const handelOptionDialog = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    loading: likeLoading,
    success: likeSuccess,
    error: likeError,
  } = useSelector((state) => state.likePostAction);

  const {
    loading: saveLoading,
    success: saveSuccess,
    error: saveError,
  } = useSelector((state) => state.savePostAction);

  const {
    createdBy,
    image_url,
    likesCount,
    caption,
    postCreated,
    comments,
    _id: postId,
  } = selectedPost;

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handelEmojiPicker = () => {};

  useEffect(() => {
    openPostDialog.current = handleClickOpen;
    closePostDialog.current = handleClose;
  }, []);

  return (
    <div>
      <OptionDialog handelDialLogFun={handelOptionDialog} post={selectedPost} />
      <Dialog open={open} onClose={handleClose} maxWidth>
        <DialogContent
          sx={{
            padding: 0,
            width: { md: 1000, sm: "100%", xs: "100%" },
          }}
        >
          <Stack direction={{ sm: "row", xs: "column", md: "row", xl: "row" }}>
            <Box
              sx={{
                width: { md: 750, sm: "100%", xl: "50%", xs: "100%" },
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={{ xs: "100%", md: 500, sm: 500, xl: 500 }}
              >
                <img
                  src={image_url}
                  alt="post_image"
                  style={{ height: "100%", width: "100%" }}
                />
              </Box>
            </Box>
            {/* Second Stack Start */}

            <Stack width={{ md: "100%", sm: "100%", xl: "50%", xs: "100%" }}>
              {/* Header Stack Start */}
              <Stack
                p={1}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #eee"
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Avatar
                    alt="User Image"
                    src={createdBy?.profile_url}
                    // sx={{ border: "1px solid tomato" }}
                    sx={{ width: 35, height: 35 }}
                  />
                  <Typography variant="body2">{createdBy?.userName}</Typography>
                </Stack>
                <OptionIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => handelOptionDialog?.current()}
                />
              </Stack>
              {/* Header Stack End */}
              {/* Comment Stack Start */}
              <Stack overflow="auto" px={2} pt={1} gap={2} height={265}>
                <Stack direction="row" gap={1}>
                  <Avatar
                    alt="User Image"
                    src={createdBy?.profile_url}
                    // sx={{ border: "1px solid tomato" }}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Stack>
                    <Typography variant="body2" fontWeight="Medium">
                      {createdBy?.userName}
                    </Typography>
                    <Typography variant="body2">{caption}</Typography>
                  </Stack>
                </Stack>
                {/* User Comment */}
                <Stack gap={2} pb={2}>
                  {comments?.length === 0 && (
                    <Typography textAlign="center" variant="body2">
                      Not Comment Yet
                    </Typography>
                  )}
                  {comments?.map((comment, index) => (
                    <Stack direction="row" gap={1} key={index}>
                      <Avatar
                        alt="User Image"
                        src={comment?.user?.profile_url}
                        // sx={{ border: "1px solid tomato" }}
                        sx={{ width: 25, height: 25 }}
                      />
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography fontSize={"0.8rem"} fontWeight="Medium">
                          {comment?.user?.userName}
                        </Typography>
                        <Typography fontSize={"0.8rem"}>
                          {comment?.comment}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
                {/* User Comment End */}
              </Stack>
              {/* Comment Stack End */}
              {/* Option Icon */}
              <Stack>
                <Stack p={1} gap={1} pt={2}>
                  <Stack justifyContent="space-between" direction="row">
                    <Stack direction="row" gap={1}>
                      {/* <LikeIcon /> */}
                      <IconButton
                        onClick={() => likedButtonClickFun(postId)}
                        disabled={likeLoading}
                      >
                        {selectedPost?.likedUser?.includes(tempUser._id) ? (
                          <RedLikeIcon />
                        ) : (
                          <LikeIcon />
                        )}
                      </IconButton>
                      <IconButton component="label" htmlFor="comment">
                        <CommentIcon />
                      </IconButton>
                      <IconButton>
                        <ShareIcon />
                      </IconButton>
                    </Stack>
                    <IconButton
                      onClick={() => savedButtonClickFun(postId)}
                      disabled={saveLoading || saveSuccess}
                    >
                      {tempUser ? (
                        tempUser?.savedPost?.includes(postId) ? (
                          <SaveFillIcon />
                        ) : (
                          <SaveIcon />
                        )
                      ) : (
                        <SaveFillIcon />
                      )}
                    </IconButton>
                  </Stack>
                  <Typography variant="body2">{likesCount} likes</Typography>
                </Stack>
                {/* End Option Icon */}
                <Stack p={1}>
                  <Typography variant="caption" color="grey">
                    {moment(postCreated).fromNow()}
                  </Typography>
                </Stack>
                {/* Input Stack */}
                <Stack
                  sx={{
                    position: "absolute",
                    top: { md: "24%", xs: "19%", sm: "24%" },
                    width: { md: 400, xs: 250, sm: 250 },
                    height: { md: 320, xs: 320 },
                  }}
                >
                  {showEmojiPicker && (
                    <Picker
                      skinTonesDisabled={true}
                      theme="light"
                      searchDisabled={true}
                      width="100%"
                      height="100%"
                      onEmojiClick={(e) => setComment(comment + e.emoji)}
                    />
                  )}
                </Stack>
                <Stack>
                  <TextField
                    variant="standard"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add comment"
                    InputProps={{
                      sx: { px: 1 },
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
                          sx={{ cursor: "pointer" }}
                          onClick={() => commentBtnClickedFun(postId)}
                        >
                          <Typography sx={{ color: "#007BE5" }} variant="body2">
                            Post
                          </Typography>
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                      style: {
                        marginTop: 7,
                        paddingTop: 8,
                        paddingBottom: 6,
                        borderTop: "1px solid #eee",
                      },
                    }}
                  />
                </Stack>
                {/* End Input Stack */}
              </Stack>
            </Stack>

            {/* Second Stack End */}
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDialog;
