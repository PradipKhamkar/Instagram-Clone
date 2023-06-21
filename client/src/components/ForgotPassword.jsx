import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../shared/Loader";
import { errorToast, successToast } from "../shared/Toast";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LockIcon } from "../images/lock.svg";

const ForgotPassword = () => {
  document.title = "Reset Password";
  const navigate = useNavigate();
  const { loading: userLoading } = useSelector((state) => state.authUser);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailIsValid] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
  };

  const handelSubmit = async () => {
    if (isEmailValid) {
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/v1/user/forgotPassword`, {
          email,
        });
        setLoading(false);
        setSuccess(true);
      } catch (error) {
        setLoading(false);
        setError(error?.response?.data?.message);
      }
    } else {
      errorToast("Please enter valid email");
    }
  };
  if (error) {
    errorToast(error);
    setError(null);
  }

  if (success) {
    successToast(`Password reset link send to your ${email} Id`);
    setSuccess(false);
    setEmail("");
  }

  return (
    <>
      {loading || userLoading ? (
        <Loader />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100vh"
        >
          <Box
            maxWidth={1200}
            display="flex"
            width={{ md: "800px", xs: "100%", xl: "800px" }}
            justifyContent="center"
          >
            <ToastContainer />
            <Box
              border="1px solid #eee"
              width={{ md: 350, sm: 350, xs: "90%", xl: 260 }}
            >
              <Box p={5}>
                <Stack alignItems="center" gap={2}>
                  <LockIcon
                    style={{
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="body1">Trouble logging in?</Typography>
                  <Typography variant="body2" textAlign="center">
                    Enter your email, phone, or username and we'll send you a
                    link to get back into your account.
                  </Typography>
                </Stack>

                <Stack mt={2} gap={3}>
                  <Stack gap={3}>
                    <TextField
                      value={email}
                      variant="outlined"
                      size="small"
                      placeholder="Enter email"
                      onChange={(e) => handleChange(e)}
                    />
                    <Button
                      disabled={email.length <= 0}
                      size="small"
                      variant="body1"
                      style={{
                        border: "none",
                        background: "#0095F6",
                        color: "white",
                        opacity: email.length <= 0 ? 0.5 : 1,
                      }}
                      onClick={handelSubmit}
                    >
                      Send link
                    </Button>
                  </Stack>
                  <Stack alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      color="#0095F6"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate("/SignUp")}
                    >
                      Don't have an account ?
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              <Stack bgcolor="#eeee" width="100%">
                <Button
                  onClick={() => navigate("/Login")}
                  variant="outlined"
                  style={{
                    border: "none",
                    background: "none",
                    color: "black",
                  }}
                >
                  Back to login
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ForgotPassword;
