import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userAuthSlice = createSlice({
  name: "userAuthentication",
  initialState: {},
  reducers: {
    setRequest(state, action) {
      return {
        loading: true,
      };
    },
    setSuccess(state, action) {
      return {
        loading: false,
        success: true,
        user: action?.payload?.userData,
        isAuthenticated: true,
      };
    },
    setFailed(state, action) {
      return {
        ...state,
        loading: false,
        error: true,
        error_message: action?.payload,
      };
    },
    setError(state, action) {
      return {
        ...state,
        error: null,
        error_message: null,
      };
    },
  },
});

const { setRequest, setSuccess, setFailed, setError } = userAuthSlice.actions;

//register user
export const registerUser = (userData) => {
  return async function registerUserThunk(dispatch) {
    try {
      dispatch(setRequest());
      const { data } = await axios.post(`/api/v1/user/register`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setSuccess(data));
    } catch (error) {
      dispatch(setFailed(error?.response?.data?.message));
    }
  };
};

//Login User
export const loginUser = (loginCredential) => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.post("/api/v1/user/login", loginCredential);
    dispatch(setSuccess(data));
  } catch (error) {
    dispatch(setFailed(error?.response?.data?.message));
  }
};

//Getting Logged User
export const getLoggedUser = () => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.get("/api/v1/user/logged");
    dispatch(setSuccess(data));
  } catch (error) {
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export const logOut = () => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.get("/api/v1/user/logOut");
    dispatch(setSuccess(data));
  } catch (error) {
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { setError };
export default userAuthSlice.reducer;
