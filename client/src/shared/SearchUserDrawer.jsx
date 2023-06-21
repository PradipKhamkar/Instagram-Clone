import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ComponentLoader from "./ComponentLoader";

const SearchUserDialog = ({ isOpen, setOpen, loading, users, setKeyword }) => {
  const navigate = useNavigate();
  const handelUserClick = (userId) => {
    setKeyword("");
    navigate(`/profile/${userId}`);
  };
  return (
    <Stack
      position="absolute"
      width="99.8%"
      display={isOpen ? "flex" : "none"}
      zIndex={1000}
      alignItems="center"
      overflow="auto"
      className="scroll"
      height="100vh"
      top="3.3rem"
      bgcolor="rgba(0, 0, 0, 0.5)"
      onClick={() => setOpen(false)}
    >
      <Stack
        alignItems="center"
        width={{ xs: "80%", md: "30%" }}
        maxHeight={{ md: 500, xs: "50%" }}
        overflow="auto"
        gap={2}
        bgcolor="white"
        py={1}
        className="scroll"
        sx={{
          borderEndEndRadius: 5,
          borderEndStartRadius: 5,
        }}
      >
        {loading ? (
          <ComponentLoader size={"1.5rem"} />
        ) : users?.length <= 0 ? (
          <Typography variant="body2">No User</Typography>
        ) : (
          users?.length !== 0 &&
          users?.map((user, index) => (
            <Stack
              key={index}
              direction="row"
              gap={3}
              alignItems="center"
              justifyContent="space-evenly"
              sx={{ cursor: "pointer" }}
              width="100%"
              p={0.5}
              onClick={() => handelUserClick(user?._id)}
            >
              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                sx={{ cursor: "pointer" }}
              >
                <Avatar src={user?.profile_url} />
                <Stack spacing={-1} direction="column">
                  <Typography sx={{ mb: 0.5 }} variant="body1">
                    {user?.userName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem" }}>
                    {user?.tagLine}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="body2" color="#4D96F6">
                View Profile
              </Typography>
              {/*  */}
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default SearchUserDialog;
