import { Stack, Typography } from "@mui/material";
import React from "react";
import { ReactComponent as ImagesIcon } from "../images/swipe.svg";

const NotFound = () => {
  return (
    <Stack flex={1} justifyContent="center" alignItems="center" height="90vh">
      <Stack justifyContent="center" alignItems="center" gap={1}>
        <ImagesIcon style={{ opacity: 0.7 }} />
        <Typography variant="body1">Route not found</Typography>
      </Stack>
    </Stack>
  );
};

export default NotFound;
