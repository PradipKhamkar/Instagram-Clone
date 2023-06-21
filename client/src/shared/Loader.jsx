import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { ReactComponent as LoaderIcon } from "../images/loader.svg";
const Loader = () => {
  return (
    <Stack flex={1} justifyContent="center" alignItems="center" height="100vh">
      <Box>
        <LoaderIcon className="loader" />
      </Box>
    </Stack>
  );
};

export default Loader;
