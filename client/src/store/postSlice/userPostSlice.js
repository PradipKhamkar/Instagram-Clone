import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getUserPostSlice = createSlice({
  name: "userPost",
  initialState: { posts: [] },
  reducers: {
    setRequest(state, action) {
      return {
        loading: true,
      };
    },
    setSuccess(state, action) {
      return {
        loading: false,
        posts: action?.payload?.posts,
        success: true,
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
    clearError(state, action) {
      return {
        ...state,
        error: false,
        error_message: null,
      };
    },
  },
});

const { setRequest, setSuccess, setFailed, clearError } =
  getUserPostSlice.actions;

export const getUserPosts = (userId) => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.get(`/api/v1/post/userPost?userId=${userId}`);
    dispatch(setSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { clearError };
export default getUserPostSlice.reducer;
