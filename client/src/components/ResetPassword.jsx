import React from "react";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Loader from "../shared/Loader";
import { errorToast, successToast } from "../shared/Toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as LockIcon } from "../images/lock.svg";

const ResetPassword = () => {
  document.title = "Reset Password";
  const navigate = useNavigate();
  const { id, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handelSubmit = async () => {
    if (password === confirmPassword) {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `/api/v1/user/resetPassword/${id}/${token}`,
          { password, confirmPassword }
        );
        setLoading(false);
        successToast("Password reset Successfully");
        navigate("/Login");
      } catch (error) {
        setLoading(false);
        errorToast(error?.response?.data?.message);
      }
    } else {
      errorToast("Password not match");
    }
  };

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
                  <Typography variant="body1">Set new password</Typography>
                </Stack>

                <Stack mt={2} gap={3}>
                  <Stack gap={3}>
                    <TextField
                      value={password}
                      variant="outlined"
                      size="small"
                      placeholder="New password"
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                      value={confirmPassword}
                      variant="outlined"
                      size="small"
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                      disabled={
                        password.length <= 0 || confirmPassword.length <= 0
                      }
                      variant="outlined"
                      onClick={handelSubmit}
                      style={{
                        border: "none",
                        background: "#0095F6",
                        color: "white",
                        opacity:
                          password.length <= 0 || confirmPassword.length <= 0
                            ? 0.5
                            : 1,
                      }}
                    >
                      Reset Password
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

export default ResetPassword;
