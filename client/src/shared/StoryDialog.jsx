import React, { useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { ReactComponent as OptionIcon } from "../images/options.svg";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { successToast, errorToast } from "../shared/Toast";
import { getAllPost } from "../store/postSlice/allPostSlice";
import { getLoggedUser } from "../store/userSlice/userAuthSlice";
import moment from "moment";

const StoryDialog = ({ openDialog, story }) => {
  const [open, setOpen] = React.useState(false);

  const openOptionDialog = useRef();

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
      <Dialog open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            padding: 0,
            maxWidth: 500,
          }}
          className="scroll"
        >
          <Stack>
            {/* Top Header Stack */}
            <Stack
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              p={1}
              borderBottom="1px solid #eee"
            >
              <Stack
                direction="row"
                gap={1.5}
                alignItems="center"
                justifyContent="center"
              >
                <Avatar
                  src={story?.createdBy?.profile_url}
                  sx={{ height: 45, width: 45 }}
                />
                <Stack>
                  <Typography variant="body1">
                    {story?.createdBy?.userName}
                  </Typography>
                  <Typography variant="body2" mt={-0.3} sx={{ opacity: 0.3 }}>
                    {moment(story?.storyCreated).fromNow()}
                  </Typography>
                </Stack>
              </Stack>
              <OptionIcon onClick={() => openOptionDialog.current()} />
            </Stack>
            {/* Image Stack */}
            <Stack mt={1}>
              <Box>
                <img
                  src={story?.image_url}
                  alt="story image"
                  height="100%"
                  width="100%"
                />
              </Box>
              <Typography variant="body1" p={1} textAlign="center">
                {story?.caption}
              </Typography>
            </Stack>
          </Stack>

          {/*  */}
        </DialogContent>
      </Dialog>
      <OptionDialog
        openDialog={openOptionDialog}
        story={story}
        parentClose={handleClose}
      />
    </div>
  );
};

const OptionDialog = ({ openDialog, story, parentClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.authUser);

  const [open, setOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handelDeleteStory = async () => {
    try {
      setDeleteLoading(true);
      const { data } = await axios.delete(
        `/api/v1/story/delete?storyId=${story._id}`
      );
      setDeleteLoading(false);
      successToast("Story deleted successfully");
      handleClose();
      parentClose();
      dispatch(getLoggedUser());
    } catch (error) {
      errorToast("Failed to delete story");
      setDeleteLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    openDialog.current = handleClickOpen;
  }, []);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            padding: 0,
            maxWidth: 800,
            maxHeight: 1000,
          }}
        >
          <Stack alignItems="center" gap={1}>
            {user?._id === story?.createdBy?._id && (
              <>
                <Typography
                  variant="body2"
                  color="red"
                  borderBottom="1px solid #eee"
                  p={1.5}
                  onClick={deleteLoading ? "" : handelDeleteStory}
                  sx={{ cursor: "pointer" }}
                  px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
                >
                  {deleteLoading ? "Deleting Story" : " Delete Story"}
                </Typography>
              </>
            )}

            <Typography
              sx={{ cursor: "pointer" }}
              variant="body2"
              borderBottom="1px solid #eee"
              p={1.5}
              onClick={() => navigate(`/Profile/${story?.createdBy?._id}`)}
              px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
            >
              View Profile
            </Typography>

            <Typography
              variant="body2"
              sx={{ cursor: "pointer" }}
              borderBottom="1px solid #eee"
              p={1.5}
              px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
              onClick={handleClose}
            >
              Cancel
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryDialog;
