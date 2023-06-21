import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearSuccess, deletePost } from "../store/postSlice/DeletePostSlice";
import { getLoggedUser } from "../store/userSlice/userAuthSlice";
import { useNavigate } from "react-router-dom";

const OptionDialog = ({ handelDialLogFun, post, create }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: userLoading,
    user,
    success: authUserSuccess,
    error: loadUserError,
  } = useSelector((state) => state.authUser);

  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useSelector((state) => state.deletePost);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handelDeletePost = () => {
    dispatch(deletePost(post?._id));
  };

  if (deleteSuccess) {
    handleClose();
    dispatch(getLoggedUser());
    dispatch(clearSuccess());
  }

  useEffect(() => {
    handelDialLogFun.current = handleClickOpen;
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
            {user?._id === post?.createdBy?._id && (
              <>
                <Typography
                  variant="body2"
                  color="red"
                  borderBottom="1px solid #eee"
                  p={1.5}
                  onClick={deleteLoading ? "" : handelDeletePost}
                  sx={{ cursor: "pointer" }}
                  px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
                >
                  {deleteLoading ? "Deleting Post" : " Delete Post"}
                </Typography>
                <Typography
                  onClick={() =>
                    navigate("/Create", { state: { for: "editPost", post } })
                  }
                  sx={{ cursor: "pointer" }}
                  variant="body2"
                  borderBottom="1px solid #eee"
                  p={1.5}
                  px={{ md: 20, xs: 10, xl: 20, sm: 20 }}
                >
                  Edit Post
                </Typography>
              </>
            )}

            <Typography
              sx={{ cursor: "pointer" }}
              variant="body2"
              borderBottom="1px solid #eee"
              p={1.5}
              onClick={() => navigate(`/Profile/${post?.createdBy?._id}`)}
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

export default OptionDialog;
