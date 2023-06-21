import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Avatar, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowUserDialog = ({ handelDialLogFun, state, users }) => {
  const navigate = useNavigate();
  const { setUser, userId, isFollow, getIsFollow, showUserDialogAction, user } =
    state;

  const { user: authUser } = useSelector((state) => state.authUser);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handelRemoveFollowing = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/v1/user/removeFollowing?userId=${userId}`
      );
      setLoading(false);
      setSuccess(true);
      setUser(data.user);
      getIsFollow(data);
    } catch (error) {
      setLoading(false);
      setError(error?.data?.response?.message);
    }
  };

  const handelRemoveFollowers = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/v1/user/removeFollowers?userId=${userId}`
      );
      setLoading(false);
      setSuccess(true);
      setUser(data.user);
      getIsFollow(data);
    } catch (error) {
      setLoading(false);
      setError(error?.data?.response?.message);
    }
  };

  useEffect(() => {
    handelDialLogFun.current = handleClickOpen;
    if (users?.length <= 0) {
      handleClose();
    }
  }, [users]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DialogContent
          sx={{
            padding: 0,
            width: { md: 300, sm: 300, xs: 260, xl: 300 },
          }}
        >
          <Stack px={1}>
            {users &&
              users.map((userDetail, index) => (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                >
                  <Stack
                    direction="row"
                    gap={1.2}
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/profile/${userDetail._id}`)}
                  >
                    <Avatar src={userDetail?.profile_url} />{" "}
                    <Typography variant="body2">
                      {userDetail?.userName}
                    </Typography>
                  </Stack>
                  {user._id === authUser._id ? (
                    <Stack sx={{ cursor: "pointer" }} variant="body2">
                      {showUserDialogAction === "following" ? (
                        <Typography
                          variant="body2"
                          onClick={() =>
                            loading
                              ? ""
                              : handelRemoveFollowing(userDetail?._id)
                          }
                        >
                          {loading ? "Updating" : "   Unfollow"}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          onClick={() =>
                            loading
                              ? ""
                              : handelRemoveFollowers(userDetail?._id)
                          }
                        >
                          {loading ? "Removing" : "Remove"}
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/profile/${userDetail._id}`)}
                    >
                      View Profile
                    </Typography>
                  )}
                </Stack>
              ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowUserDialog;
