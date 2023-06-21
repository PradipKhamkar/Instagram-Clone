import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ShowPasswordIcon } from "../../images/eye.svg";
import { ReactComponent as HidePasswordIcon } from "../../images/eye-off.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setError } from "../../store/userSlice/userAuthSlice";
import Loader from "../../shared/Loader";
import { ToastContainer } from "react-toastify";
import { errorToast } from "../../shared/Toast";

const SignUp = () => {
  document.title = "Sign Up";
  document.body.style.background = "#eee";
  const dispatch = useDispatch();
  const { loading, error, error_message, success } = useSelector(
    (state) => state.authUser
  );

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    fullName: "",
    userName: "",
    password: "",
    profileImage: "",
  });

  const [profilePreview, setProfilePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [allFieldFill, setAllFieldFill] = useState(false);

  const handelRegisterSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(userData.email)) {
      if (userData.profileImage !== "") {
        dispatch(registerUser(userData));
      }
    } else {
      errorToast("Please enter valid email..!!");
    }
  };

  const handelChange = (e) => {
    const { id, value } = e.target;
    if (e.target.type === "file") {
      handelProfileImage(e);
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [id]: value,
      }));
    }
  };

  const setButtonDisabledValue = () => {
    const userDataValues = Object.values(userData);
    const filledValue = userDataValues.filter((value, index) => {
      return value.trim() !== "";
    });
    if (filledValue.length === userDataValues.length) {
      setAllFieldFill(true);
    } else {
      setAllFieldFill(false);
    }
  };

  const handelProfileImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 542236) {
        const reader = new FileReader();
        reader.onload = async () => {
          if (reader.readyState === 2) {
            setUserData({ ...userData, profileImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
        setProfilePreview(window.URL.createObjectURL(file));
      } else {
        errorToast("Image size should be less then 550KB");
      }
    } else {
      setUserData({ ...userData, profileImage: "" });
      errorToast("Please choose image only..!!");
    }
  };

  if (error && error_message) {
    alert(error_message);
    dispatch(setError());
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setButtonDisabledValue();
  }, [userData, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100vh"
        >
          <ToastContainer />
          <Box
            maxWidth={1200}
            display="flex"
            width={{ md: "800px", xs: "95%", xl: "800px" }}
            justifyContent="center"
          >
            {/* Main Stack */}
            <Stack width={{ md: 350, xs: "100%", sm: 300, xl: 400 }} gap={2}>
              {/* Top Stack start*/}
              <Stack
                p={4}
                justifyContent="center"
                gap={2}
                bgcolor="white"
                py={1.5}
              >
                <Stack gap={0.5} justifyContent="center" alignItems="center">
                  <img
                    src={require("../../images/formLogo.png")}
                    alt="Logo"
                    width={"auto"}
                    height={40}
                  />
                  <Typography
                    variant="body1"
                    textAlign="center"
                    color="#8E8E8E"
                    fontSize="1rem"
                  >
                    Sign up to see photos and videos of your friends.
                  </Typography>
                </Stack>
                {/* From Stack Start */}
                <Stack gap={2}>
                  <Stack gap={1.5}>
                    <TextField
                      type="email"
                      fullWidth={true}
                      placeholder="Email"
                      size="medium"
                      variant="outlined"
                      value={userData.email}
                      id="email"
                      onChange={(e) => handelChange(e)}
                      InputProps={{
                        sx: {
                          bgcolor: "#E5E5E5",
                          height: 43,
                          border: "none",
                          "& fieldset": { border: "none" },
                        },
                      }}
                    />
                    <TextField
                      type="text"
                      fullWidth={true}
                      placeholder="Full Name"
                      size="medium"
                      variant="outlined"
                      value={userData.fullName}
                      id="fullName"
                      onChange={(e) => handelChange(e)}
                      InputProps={{
                        sx: {
                          bgcolor: "#E5E5E5",
                          height: 43,
                          border: "none",
                          "& fieldset": { border: "none" },
                        },
                      }}
                    />
                    <TextField
                      type="text"
                      fullWidth={true}
                      placeholder="User Name"
                      size="medium"
                      value={userData.userName}
                      id="userName"
                      onChange={(e) => handelChange(e)}
                      variant="outlined"
                      InputProps={{
                        sx: {
                          bgcolor: "#E5E5E5",
                          height: 43,
                          border: "none",
                          "& fieldset": { border: "none" },
                        },
                      }}
                    />
                    <TextField
                      type={showPassword ? "text" : "password"}
                      fullWidth={true}
                      placeholder="Password"
                      size="medium"
                      variant="outlined"
                      value={userData.password}
                      id="password"
                      onChange={(e) => handelChange(e)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={toggleShowPassword}
                            sx={{ opacity: 0.5, cursor: "pointer" }}
                          >
                            {showPassword ? (
                              <HidePasswordIcon />
                            ) : (
                              <ShowPasswordIcon />
                            )}
                          </InputAdornment>
                        ),
                        sx: {
                          bgcolor: "#E5E5E5",
                          height: 43,
                          border: "none",
                          "& fieldset": { border: "none" },
                        },
                      }}
                    />

                    <Stack
                      direction="row"
                      alignItems="center"
                      bgcolor="#E5E5E5"
                      borderRadius={2}
                      px={1.2}
                      py={0.1}
                    >
                      <Avatar
                        sx={{ width: 35, height: 35 }}
                        src={profilePreview}
                      />
                      <TextField
                        type="file"
                        fullWidth={true}
                        placeholder="Profile Picture"
                        size="medium"
                        variant="outlined"
                        onChange={(e) => handelChange(e)}
                        InputProps={{
                          sx: {
                            height: 43,
                            border: "none",
                            "& fieldset": { border: "none" },
                            pb: 1.5,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Button
                    type="submit"
                    disabled={allFieldFill ? false : true}
                    variant="outlined"
                    onClick={handelRegisterSubmit}
                    style={{
                      border: "none",
                      background: "#0095F6",
                      color: "white",
                      opacity: allFieldFill ? 1 : 0.3,
                    }}
                  >
                    Sign Up
                  </Button>
                  <Typography variant="caption" textAlign="center">
                    By signing up, you agree to our Terms, Data Policy and
                    Cookies Policy.
                  </Typography>
                </Stack>
                {/* Form Stack End */}
              </Stack>
              {/* Top Stack End */}

              {/* Bottom Stack Start */}
              <Stack
                direction="row"
                alignItems="center"
                gap={0.1}
                bgcolor="white"
                justifyContent="center"
                p={1.5}
              >
                <Stack direction="row" alignItems="center" gap={0.3}>
                  <Typography variant="body1">You have an account?</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="#3c76d2"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/Login")}
                  >
                    Login
                  </Typography>
                </Stack>
              </Stack>
              {/* Bottom Stack End */}
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SignUp;
