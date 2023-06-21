import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getAllPostSlice = createSlice({
  name: "allPosts",
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
        posts: action?.payload?.allPost,
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
  getAllPostSlice.actions;

export const getAllPost = (userId) => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.get("/api/v1/post/all");
    dispatch(setSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { clearError };
export default getAllPostSlice.reducer;
