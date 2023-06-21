import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { ReactComponent as ShowPasswordIcon } from "../../images/eye.svg";
import { ReactComponent as HidePasswordIcon } from "../../images/eye-off.svg";
import { useNavigate } from "react-router-dom";
import { loginUser, setError } from "../../store/userSlice/userAuthSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../shared/Loader";
import { errorToast, successToast } from "../../shared/Toast";
import { ToastContainer } from "react-toastify";

const Login = () => {
  document.title = "Login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, error_message, success } = useSelector(
    (state) => state.authUser
  );

  if (error) {
    errorToast(error_message);
    dispatch(setError());
  }

  const [loginData, setLoginData] = useState({
    password: "",
    userNameOrEmail: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [allFieldFill, setAllFieldFill] = useState(false);

  const handelChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const setLoginButtonDisabledValue = () => {
    const userDataValues = Object.values(loginData);
    const filledValue = userDataValues.filter((value, index) => {
      return value.trim() !== "";
    });
    if (filledValue.length === userDataValues.length) {
      setAllFieldFill(true);
    } else {
      setAllFieldFill(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handelLoginSubmit = () => {
    dispatch(loginUser(loginData));
  };

  if (error) {
    errorToast(error_message);
    dispatch(setError());
  }

  useEffect(() => {
    setLoginButtonDisabledValue();
  }, [loginData]);

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
            width={{ md: "800px", xs: "100%", xl: "800px" }}
            justifyContent="center"
          >
            <Stack
              direction={{ md: "row", sm: "row", xs: "column", xl: "row" }}
            >
              <Stack
                display={{ md: "flex", sm: "flex", xs: "none", xl: "flex" }}
                width={{ md: 320, sm: 250, xl: 350 }}
              >
                <img
                  src={require("../../images/LoginForm.png")}
                  alt="Frame"
                  height="auto"
                />
              </Stack>
              <Stack
                gap={2}
                width={{ md: 350, sm: "70%", xs: "100%", xl: 350 }}
              >
                {/* Form Stack Start */}
                <Stack bgcolor="white" p={4} gap={3}>
                  <Stack justifyContent="center" alignItems="center">
                    <img
                      src={require("../../images/formLogo.png")}
                      alt="Logo"
                      width={150}
                      height={40}
                    />
                    <Typography
                      variant="body1"
                      textAlign="center"
                      color="#8E8E8E"
                      fontSize="1rem"
                    >
                      Welcome back !
                    </Typography>
                  </Stack>
                  <Stack gap={2}>
                    <Stack gap={2}>
                      <TextField
                        type="text"
                        id="userNameOrEmail"
                        fullWidth={true}
                        placeholder="User Name Or Email"
                        size="medium"
                        variant="outlined"
                        value={loginData.userNameOrEmail}
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
                        type={showPassword ? "text" : "password"}
                        fullWidth={true}
                        id="password"
                        placeholder="Password"
                        size="medium"
                        variant="outlined"
                        value={loginData.password}
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
                    </Stack>
                    <Stack gap={2}>
                      <Button
                        disabled={allFieldFill ? false : true}
                        variant="outlined"
                        onClick={handelLoginSubmit}
                        style={{
                          border: "none",
                          background: "#0095F6",
                          color: "white",
                          opacity: allFieldFill ? 1 : 0.3,
                        }}
                      >
                        Login
                      </Button>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        color="#0095F6"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/ForgetPassword")}
                      >
                        You forgot the password?
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                {/* Form Stack End */}
                {/* Bottom Stack Start */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.3}
                  bgcolor="white"
                  p={2}
                  justifyContent="center"
                >
                  <Typography variant="body1">
                    You don't have an account?
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="#3c76d2"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/SignUp")}
                  >
                    Sign up
                  </Typography>
                </Stack>
                {/* Bottom Stack End */}
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Login;
