import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { ReactComponent as ImagesIcon } from "../images/swipe.svg";

const Empty = () => {
  return (
    <Stack flex={1} justifyContent="center" alignItems="center" height="70vh">
      <Stack justifyContent="center" alignItems="center" gap={1}>
        <ImagesIcon style={{ opacity: 0.7 }} />
        <Typography variant="body1">Nothing's to shows</Typography>
      </Stack>
    </Stack>
  );
};

export default Empty;
