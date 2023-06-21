import { Typography } from "@mui/material";
import React from "react";
import { ReactComponent as LoaderIcon } from "../images/loader.svg";

const ComponentLoader = ({ size }) => {
  return (
    <LoaderIcon className="loader" style={{ width: size, height: size }} />
  );
};

export default ComponentLoader;
