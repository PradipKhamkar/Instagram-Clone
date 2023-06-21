import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  Card,
  CardMedia,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser } from "../../store/userSlice/userAuthSlice";
import { errorToast, successToast } from "../../shared/Toast";
import { ToastContainer } from "react-toastify";

const EditPersonalDetails = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.authUser);

  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profile_url
  );

  const [profileData, setProfileData] = useState({
    userName: user?.userName,
    email: user?.email,
    bio: user?.bio,
    tagLine: user?.tagLine,
    profileImage: "",
  });

  const [emailValidError, setEmailValidError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handelChange = (e) => {
    const { id, value } = e.target;
    if (e.target?.files) {
      handelProfileImageChange(e);
    } else {
      if (e.target.id === "email") {
        const isEmailValid = emailRegex.test(value);
        setEmailValidError(!isEmailValid);

        setProfileData({ ...profileData, [id]: value?.trim() });
      } else {
        setProfileData({ ...profileData, [id]: value });
      }
    }
  };

  const handelProfileImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        setProfileData({ ...profileData, profileImage: reader.result });
      }
    };
    reader.readAsDataURL(file);
    setProfileImagePreview(window.URL.createObjectURL(file));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!emailValidError) {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `/api/v1/user/editProfile`,
          profileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setLoading(false);
        setSuccess(true);
        successToast("Profile Updated..!!");
        setTimeout(() => dispatch(getLoggedUser()), 4000);
      } catch (error) {
        errorToast(error?.response?.data?.message);
        setLoading(false);
        setError(error?.response?.data?.message);
      }
    }
  };

  return (
    <Stack
      bgcolor="white"
      py={1}
      maxHeight={{ md: 400, xs: "100%", sm: 330 }}
      width="100%"
      overflow="auto"
      className="scroll"
      alignItems="center"
    >
      <ToastContainer />
      <Stack gap={3} component="form" onSubmit={(e) => handelSubmit(e)}>
        <Stack alignItems="center" direction="row" gap={5}>
          <Avatar
            alt="profile pic"
            src={profileImagePreview}
            sx={{ width: 50, height: 50 }}
          />
          <Stack>
            <Typography variant="body1">{user?.userName}</Typography>
            <Typography
              component="label"
              variant="body2"
              htmlFor="update_profile"
              sx={{ color: "#3C76D2", cursor: "pointer" }}
            >
              Change Profile
            </Typography>
            <input
              type="file"
              id="update_profile"
              accept="image/*"
              onChange={(e) => handelChange(e)}
              style={{
                display: "none",
              }}
            />
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography>User Name</Typography>
          <Stack>
            <TextField
              size="small"
              id="userName"
              type="text"
              value={profileData.userName}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap={4} alignItems="center">
          <Typography>Tag Line</Typography>
          <Stack>
            <TextField
              size="small"
              id="tagLine"
              type="text"
              value={profileData.tagLine}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>
        <Stack direction="row" gap={9}>
          <Typography>Bio</Typography>
          <Stack>
            <TextField
              id="bio"
              multiline
              value={profileData.bio}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap={6.5} alignItems="center">
          <Typography>Email</Typography>
          <Stack>
            <TextField
              error={emailValidError}
              id="email"
              size="small"
              type="email"
              value={profileData.email}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Updating" : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
};

const UpdatePassword = ({ userData }) => {
  const { user } = useSelector((state) => state.authUser);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isPasswordMatch, setPasswordMatch] = useState(true);
  const [isAllFieldFill, setAllFieldFill] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handelChange = async (e) => {
    const { value, id } = e.target;
    setPasswordData({ ...passwordData, [id]: value });
  };

  const matchPassword = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const setSubmitBtnDisabled = () => {
    const passwordDataValues = Object.values(passwordData);
    const filledValue = passwordDataValues.filter((value, index) => {
      return value.trim() !== "";
    });
    if (filledValue.length === passwordDataValues.length) {
      setAllFieldFill(true);
    } else {
      setAllFieldFill(false);
    }
  };

  useEffect(() => {
    matchPassword();
    setSubmitBtnDisabled();
  }, [passwordData]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (isPasswordMatch) {
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/v1/user/updatePassword`, {
          passwordData,
        });
        setLoading(false);
        setSuccess(true);
        successToast("Password Updated..!!");
      } catch (error) {
        errorToast(error.response?.data?.message);
        setLoading(false);
        setError(error.response?.data?.message);
      }
    } else {
      errorToast("Confirm Not Password Match");
    }
  };

  return (
    <Stack bgcolor="white" py={2} width="100%" alignItems="center">
      <Stack gap={3} component="form" onSubmit={(e) => handelSubmit(e)}>
        <Stack alignItems="center" direction="row" gap={8}>
          <Avatar
            alt="Profile Pic"
            src={userData?.profile_url}
            sx={{ width: 50, height: 50 }}
          />
          <Stack>
            <Typography variant="body1">{user?.userName}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Box>
            <Typography>Old </Typography>
            <Typography>Password</Typography>
          </Box>

          <Stack>
            <TextField
              id="oldPassword"
              size="small"
              type="text"
              value={passwordData.oldPassword}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap={3} alignItems="center">
          <Box>
            <Typography>New </Typography>
            <Typography>Password</Typography>
          </Box>
          <Stack>
            <TextField
              id="newPassword"
              size="small"
              type="text"
              value={passwordData.newPassword}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap={3} alignItems="center">
          <Box>
            <Typography>Confirm </Typography>
            <Typography>Password</Typography>
          </Box>
          <Stack>
            <TextField
              error={!isPasswordMatch}
              id="confirmPassword"
              size="small"
              type="text"
              value={passwordData.confirmPassword}
              onChange={(e) => handelChange(e)}
            />
          </Stack>
        </Stack>

        <Button
          variant="contained"
          type="submit"
          disabled={!isAllFieldFill || loading}
        >
          {loading ? "Updating Password" : "Update Password"}
        </Button>
      </Stack>
    </Stack>
  );
};

const EditProfile = () => {
  document.title = "Update Profile";
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = location?.state;

  const [currentTabOpen, setCurrentTabOpen] = useState({
    openTab: "EditPersonalDetails",
    component: <EditPersonalDetails userData={userData} />,
  });

  const [logOutLoading, setLogOutLoading] = useState(false);

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

  const menuItem = [
    {
      value: "EditPersonalDetails",
      name: "Edit Profile",
    },
    {
      value: "UpdatePassword",
      name: "Update Password",
    },
  ];

  const handelTab = (tabName) => {
    switch (tabName) {
      case "EditPersonalDetails":
        setCurrentTabOpen({
          openTab: "EditPersonalDetails",
          component: <EditPersonalDetails userData={userData} />,
        });
        break;
      case "UpdatePassword":
        setCurrentTabOpen({
          openTab: "UpdatePassword",
          component: <UpdatePassword userData={userData} />,
        });
        break;
      default:
        return null;
    }
  };

  const activeTabOpenStyle = {
    color: "#3C76D2",
    fontWeight: "medium",
  };

  return (
    <>
      <Box display="flex" pt={9} pb={10} justifyContent="center" width="100%">
        <ToastContainer />
        <Box
          maxWidth={1200}
          display="flex"
          width={{ md: "800px", xs: "100%", xl: "800px", sm: "700px" }}
          border={{
            md: "1px solid #eee",
            xs: "none",
            xl: "1px solid #eee",
            sm: "1px solid #eee",
          }}
        >
          <Stack
            direction={{ md: "row", sm: "row", xs: "column", xl: "row" }}
            gap={2}
            justifyContent="space-between"
            width="100%"
          >
            <Stack
              direction={{
                md: "column",
                sm: "column",
                xs: "row",
                xl: "column",
              }}
              gap={1}
              p={2}
              width={{ md: 300, xs: "97%", sm: 300, xl: 400 }}
              overflow="auto"
              textAlign="center"
              borderRight={{
                md: "1px solid #eee",
                xs: "none",
                xl: "1px solid #eee",
                sm: "1px solid #eee",
              }}
              justifyContent={{
                md: "flex-start",
                xs: "center",
                sm: "flex-start",
              }}
            >
              {menuItem.map((item, index) => (
                <Stack direction="row" key={index}>
                  <Typography
                    variant="body1"
                    p={0.1}
                    {...(currentTabOpen?.openTab === item.value &&
                      activeTabOpenStyle)}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handelTab(item.value)}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              ))}
              <Typography
                textAlign="left"
                sx={{ cursor: "pointer" }}
                onClick={logOutLoading ? "" : logOutUser}
              >
                Logout
              </Typography>
            </Stack>
            {/* Form Stack */}
            {currentTabOpen.component}
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default EditProfile;
