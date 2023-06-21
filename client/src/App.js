import { ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  EditProfile,
  Feed,
  Header,
  Login,
  Post,
  Profile,
  SignUp,
  ForgetPassword,
  ResetPassword,
  Create,
} from "./components";
import theme from "./muitheme";
import { getLoggedUser, setError } from "./store/userSlice/userAuthSlice";
import "react-toastify/dist/ReactToastify.css";
import SavedPost from "./components/SavedPost";
import Loader from "./shared/Loader";
import NotFound from "./shared/NotFound";

const App = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, error, user } = useSelector(
    (state) => state.authUser
  );

  useEffect(() => {
    //document.body.style.backgroundColor = "black";
    dispatch(getLoggedUser());
  }, []);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {isAuthenticated && <Header />}
          <Routes>
            <Route path="/" element={isAuthenticated ? <Feed /> : <Login />} />
            <Route
              path="/SignUp"
              element={isAuthenticated ? <Feed /> : <SignUp />}
            />
            <Route
              path="/Login"
              element={isAuthenticated ? <Feed /> : <Login />}
            />
            <Route
              path="/Profile/:userId"
              element={isAuthenticated ? <Profile /> : <Login />}
            />
            <Route
              path="/EditProfile"
              element={isAuthenticated ? <EditProfile /> : <Login />}
            />
            <Route
              path="/Create"
              element={isAuthenticated ? <Create /> : <Login />}
            />

            <Route
              path="/Saved"
              element={isAuthenticated ? <SavedPost /> : <Login />}
            />

            <Route
              path="/ForgetPassword"
              element={isAuthenticated ? <Feed /> : <ForgetPassword />}
            />

            <Route
              path="/ResetPassword/:id/:token"
              element={isAuthenticated ? <Feed /> : <ResetPassword />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
};

export default App;
