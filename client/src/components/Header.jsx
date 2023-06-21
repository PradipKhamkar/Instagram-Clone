import { Avatar, Box, InputAdornment, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { ReactComponent as ActiveHomeIcon } from "../images/Header/Home-fill.svg";
import { ReactComponent as HomeIcon } from "../images/Header/Home.svg";

import { ReactComponent as NewPostIcon } from "../images/Header/Create.svg";
import { ReactComponent as ActiveNewPostIcon } from "../images/Header/Create.svg";

import { ReactComponent as ActiveSavePostIcon } from "../images/Header/Heart-fill.svg";
import { ReactComponent as SavePostIcon } from "../images/Header/Heart.svg";

import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import SearchUserDialog from "../shared/SearchUserDrawer";
import { useRef } from "react";

const Header = () => {
  const openCreateDialog = useRef();
  const { user } = useSelector((state) => state.authUser);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const navIcon = [
    {
      icon: HomeIcon,
      name: "Home",
      path: "/",
      activeIcon: ActiveHomeIcon,
    },

    {
      icon: NewPostIcon,
      name: "Add",
      path: "/Create",
      activeIcon: ActiveNewPostIcon,
    },
    {
      icon: SavePostIcon,
      name: "Save",
      path: "/Saved",
      activeIcon: ActiveSavePostIcon,
    },
  ];

  const getSearchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/user/search?keyword=${searchKeyword}`
      );
      setLoading(false);
      setUsers(data?.users);
    } catch (error) {
      setLoading(false);
      setError("Something's Wents To Wrong..!!");
    }
  };

  const handelSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setOpenSearchDialog(true);
    getSearchUser();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="black"
      position="fixed"
      width="100%"
      sx={{ border: "1px solid #eee" }}
      bgcolor="white"
      zIndex={10}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        maxWidth={1200}
        width={{ md: "800px", sm: "80%", xs: "98%" }}
      >
        <Box>
          <img
            src={require("../images/formLogo.png")}
            alt="Frame"
            height="30px"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>
        <Box width={{ md: "24%", sm: "40%", xs: "100%" }} padding={0.9}>
          <Stack bgcolor="#eee" direction="row" padding={0.5} borderRadius={2}>
            <SearchIcon fontSize="small" sx={{ padding: 0.5 }} />
            <input
              value={searchKeyword}
              style={{
                width: "100%",
                padding: 0.5,
                paddingLeft: 2,
                paddingRight: 5,
                outline: "none",
                border: "none",
                backgroundColor: "inherit",
              }}
              onChange={(e) => handelSearchChange(e)}
              placeholder="Search"
            />
          </Stack>
        </Box>
        <Box>
          <Stack
            direction="row"
            gap={4}
            color="black"
            position={{ md: "relative", xs: "fixed", sm: "relative" }}
            bottom="0"
            top={{ xs: "92%" }}
            left="0"
            alignItems="center"
            width={{ xs: "100%", md: "auto", sm: "auto" }}
            justifyContent="space-evenly"
            bgcolor={{ xs: "white", md: "inherit", sm: "inherit" }}
            pb={{ xs: 3, md: 0, sm: 0 }}
            pt={{ xs: 3.2, md: 0, sm: 0 }}
            zIndex={100}
            sx={{ borderTop: { xs: "1px solid #eee", md: "none", sm: "none" } }}
          >
            {navIcon.map((icon, index) => (
              <Link
                key={index}
                to={icon.path}
                style={{ display: "flex", alignItems: "center" }}
              >
                {location.pathname === icon.path ? (
                  <icon.activeIcon />
                ) : (
                  <icon.icon />
                )}
              </Link>
            ))}

            <Avatar
              onClick={() => {
                navigate(`/Profile/${user._id}`);
              }}
              sx={{ cursor: "pointer", width: 30, height: 30 }}
              alt="User Profile"
              src={user.profile_url}
              // sx={{ border: "1px solid tomato" }}
            />
          </Stack>
        </Box>
      </Stack>
      <SearchUserDialog
        isOpen={openSearchDialog}
        setOpen={setOpenSearchDialog}
        loading={loading}
        users={users}
        setKeyword={setSearchKeyword}
      />
    </Box>
  );
};

export default Header;
