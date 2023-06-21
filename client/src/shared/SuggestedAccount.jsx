import { Avatar, Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { feedFollowAndUnFollow } from "../store/userSlice/followUnfollowSlice";

const SuggestedAccount = ({ usersData, seeAllSuggestedAccount, authUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToProfile = (id) => {
    navigate(`/Profile/${id}`);
  };

  const {
    loading: followActionLoading,
    success: followActionSuccess,
    error: FollowActionError,
  } = useSelector((state) => state.followUnFollow);

  // Handel Follow And UnFollow
  const [isFollow, setIsFollow] = useState(false);
  const [authUserFollowing, setAuthUserFollowing] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);

  const setFilteredData = () => {
    setAuthUserFollowing(authUser?.following);
    setFilteredUserData(usersData?.filter((user) => user._id !== authUser._id));
  };

  const handelFollow = (userId) => {
    const isUserFollowing = authUserFollowing?.includes(userId);
    if (isUserFollowing) {
      setAuthUserFollowing(() =>
        authUserFollowing?.filter((followingUserId) => {
          return followingUserId !== userId;
        })
      );
    } else {
      setAuthUserFollowing([...authUserFollowing, userId]);
    }
    dispatch(feedFollowAndUnFollow(userId));
  };

  useEffect(() => {
    if (authUser && usersData) {
      setFilteredData();
    }
  }, []);

  const accountToSeeCount = seeAllSuggestedAccount ? usersData?.length : 2;

  return (
    <>
      {filteredUserData?.slice(0, accountToSeeCount)?.map((data, index) => (
        <Stack
          key={index}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          borderRadius={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            component="div"
            onClick={() => goToProfile(data?._id)}
            sx={{ cursor: "pointer" }}
          >
            <Avatar alt="Profile Image" src={data?.profile_url} />
            <Box lineHeight={1}>
              <Typography variant="body2">{data.userName}</Typography>
              <Typography variant="caption" color="grey">
                New To Instagram
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Typography
              component="button"
              disabled={followActionLoading || followActionSuccess}
              variant="body2"
              color="#5BA2F7"
              sx={{
                cursor: "pointer",
                fontWeight: "500",
                outline: "none",
                border: "none",
                background: "none",
              }}
              onClick={() => handelFollow(data?._id)}
            >
              {authUserFollowing?.includes(data?._id) ? "Unfollow" : "Follow"}
            </Typography>
          </Box>
        </Stack>
      ))}
    </>
  );
};

export default SuggestedAccount;
