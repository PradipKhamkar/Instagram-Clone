import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import PostCard from "./PostCard";
import SuggestedAccount from "../shared/SuggestedAccount";
import Story from "./Story";
import LinkedIn from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUser } from "../store/userSlice/allUserSlice";
import Loader from "../shared/Loader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPost } from "../store/postSlice/allPostSlice";
import { getLoggedUser, logOut } from "../store/userSlice/userAuthSlice";
import SearchUserDrawer from "../shared/SearchUserDrawer";
import axios from "axios";
import { errorToast, successToast } from "../shared/Toast";
import { ToastContainer } from "react-toastify";
import Error from "../shared/Error";

const Feed = () => {
  document.title = "Feed";
  const navigate = useNavigate();
  const [storiesLoad, setStoriesLoad] = useState(false);
  const [stories, setStories] = useState([]);
  const [storiesError, setStoriesError] = useState(null);

  const [allSuggestedAccount, setAllSuggestedAccount] = useState(false);
  const dispatch = useDispatch();

  const {
    loading: userLoading,
    user,
    success: authUserSuccess,
    error: loadUserError,
  } = useSelector((state) => state.authUser);

  const {
    loading: allUserLoading,
    users,
    success: allUserSuccess,
    error: allUserError,
  } = useSelector((state) => state.allUsers);

  const {
    loading: allPostLoading,
    posts,
    success: allPostSuccess,
    error: allPostError,
  } = useSelector((state) => state.allPosts);

  const [authUser, setAuthUser] = useState();
  const [logOutLoading, setLogOutLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthUser = () => {
    const authUser = users?.filter((users) => {
      return users._id === user._id;
    });
    setAuthUser(...authUser);
  };

  const logOutUser = async () => {
    try {
      setLogOutLoading(true);
      const { data } = await axios.get(`/api/v1/user/logOut`);
      dispatch(getLoggedUser());
      setLogOutLoading(false);
      successToast("Logged Out Successfully..!!");
    } catch (error) {
      errorToast("Failed To Logout..!!");
    }
  };

  const getAllStory = async () => {
    try {
      setStoriesLoad(true);
      const { data } = await axios.get(`/api/v1/story/stories`);
      setStoriesLoad(false);
      setStories(data?.allStory);
    } catch (error) {
      setStoriesLoad(false);
      setStoriesError(true);
    }
  };

  useEffect(() => {
    getAllStory();
    dispatch(getAllUser());
    dispatch(getAllPost());
  }, []);

  return (
    <>
      {userLoading ||
      allUserLoading ||
      allPostLoading ||
      logOutLoading ||
      storiesLoad ? (
        <Loader />
      ) : (
        <>
          {loadUserError || allUserError || allPostError || storiesError ? (
            <Error />
          ) : (
            <>
              {authUserSuccess && allUserSuccess && allPostSuccess ? (
                <Box
                  justifyContent="center"
                  display="flex"
                  height="100%"
                  pb={10}
                >
                  <ToastContainer />
                  <Box
                    maxWidth={1200}
                    display="flex"
                    width={{ md: "800px", xs: "97%", xl: "800px" }}
                    justifyContent="center"
                    p={1}
                  >
                    <Box
                      position="fixed"
                      justifyContent="center"
                      display="flex"
                      zIndex={9}
                      pt={6}
                      bgcolor="white"
                      maxWidth={800}
                      width={{ md: "800px", xs: "97%", sm: "97%" }}
                    >
                      <Stack
                        direction="row"
                        gap={4}
                        overflow="auto"
                        bgcolor="white"
                        className="scroll"
                        alignItems="center"
                        p={0.5}
                        borderRadius={1}
                      >
                        <Story stories={stories} />
                      </Stack>
                    </Box>

                    <Stack width="100%" direction="row" mt={17}>
                      <Box
                        width={{ md: "49%", xs: "100%", sm: "48%", xl: "40%" }}
                      >
                        <PostCard postData={posts} authUser={user} />
                      </Box>
                      <Box
                        position="fixed"
                        display={{ xs: "none", sm: "block" }}
                        width={{
                          md: "400px",
                          xs: "97%",
                          xl: "400px",
                          sm: "49%",
                        }}
                        left={{ md: "50%", xl: "49%", sm: "49%" }}
                        borderRadius={1}
                        justifyContent="center"
                      >
                        <Box
                          bgcolor="white"
                          padding={2}
                          overflow="auto"
                          maxHeight={{
                            md: "450px",
                            xs: "97%",
                            xl: "400px",
                            sm: "auto",
                          }}
                        >
                          <Stack direction="column" mb="15px" gap={3}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              borderRadius={1}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={2}
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/Profile/${user?._id}`)
                                }
                              >
                                <Avatar
                                  alt="Profile Pic"
                                  src={user?.profile_url}
                                />
                                <Box lineHeight={1}>
                                  <Typography variant="body2">
                                    {user?.userName}
                                  </Typography>
                                  <Typography variant="caption" color="grey">
                                    {user?.tagLine}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="#5BA2F7"
                                  fontWeight="Medium"
                                  sx={{ cursor: "pointer" }}
                                  onClick={logOutUser}
                                >
                                  Logout
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack
                              justifyContent="space-between"
                              direction="row"
                            >
                              <Typography color="grey" variant="body2">
                                Suggestion For You
                              </Typography>
                              <Typography
                                color="black"
                                variant="body2"
                                sx={{ cursor: "pointer" }}
                                fontWeight="Medium"
                                onClick={() =>
                                  setAllSuggestedAccount(!allSuggestedAccount)
                                }
                              >
                                {allSuggestedAccount ? "See Less" : "See More"}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack
                            gap={2}
                            maxHeight={{ md: 200, sm: 100 }}
                            overflow="auto"
                            className="scroll"
                          >
                            <SuggestedAccount
                              usersData={users}
                              seeAllSuggestedAccount={allSuggestedAccount}
                              authUser={users?.find(
                                (users) => users._id === user._id
                              )}
                            />
                          </Stack>

                          <Box
                            height={1.1}
                            bgcolor="grey"
                            sx={{ opacity: 0.1 }}
                            mt={2}
                            mb={2}
                          />

                          <Typography
                            textAlign="center"
                            variant="body2"
                            sx={{ opacity: 0.5 }}
                            mb={1}
                          >
                            {" "}
                            Made By Pradip 😎
                          </Typography>
                          <Stack
                            direction="row"
                            gap={3}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Stack
                              onClick={() =>
                                window.open(
                                  "https://www.linkedin.com/in/pradip-khamkar-9a5b88259/",
                                  "_blank"
                                )
                              }
                              direction="row"
                              alignItems="center"
                              gap={0.5}
                              sx={{
                                opacity: 0.5,
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <LinkedIn fontSize="5px" />
                              <Typography variant="caption">
                                Linkedin
                              </Typography>
                            </Stack>
                            <Stack
                              onClick={() =>
                                window.open(
                                  "https://github.com/PradipKhamkar",
                                  "_blank"
                                )
                              }
                              direction="row"
                              alignItems="center"
                              gap={0.5}
                              sx={{
                                opacity: 0.5,
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <GitHubIcon fontSize="5px" />{" "}
                              <Typography variant="caption">Github</Typography>
                            </Stack>
                            <Stack
                              onClick={() =>
                                window.open(
                                  "https://khamkarpradip.netlify.app/",
                                  "_blank"
                                )
                              }
                              direction="row"
                              alignItems="center"
                              gap={0.5}
                              sx={{
                                opacity: 0.5,
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <LanguageIcon fontSize="5px" />{" "}
                              <Typography variant="caption">
                                {" "}
                                Portfolio
                              </Typography>
                            </Stack>
                          </Stack>
                          {/*  */}
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              ) : (
                "Failed To Load Data"
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Feed;
