import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const deletePostSlice = createSlice({
  name: "deletePost",
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
      };
    },
    clearSuccess(state, action) {
      return {
        ...state,
        success: false,
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
        error: null,
        error_message: null,
      };
    },
  },
});

const { setRequest, setSuccess, setFailed, clearError, clearSuccess } =
  deletePostSlice.actions;

export const deletePost = (postId) => async (dispatch) => {
  console.log(postId);
  try {
    dispatch(setRequest());
    const { data } = await axios.delete(`/api/v1/post/delete?postId=${postId}`);
    dispatch(setSuccess(data));
  } catch (error) {
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { clearError, clearSuccess };
export default deletePostSlice.reducer;
