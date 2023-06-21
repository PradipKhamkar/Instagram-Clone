import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const likedActionSlice = createSlice({
  name: "likedAction",
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
    clearSuccess(state, action) {
      return {
        ...state,
        success: false,
      };
    },
  },
});

const { setRequest, setSuccess, setFailed, clearError, clearSuccess } =
  likedActionSlice.actions;

export const likePostAction = (postId) => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.post(
      `/api/v1/post/likeAction?postId=${postId}`
    );
    dispatch(setSuccess(data));
    dispatch(clearSuccess());
  } catch (error) {
    console.log(error);
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { clearError };
export default likedActionSlice.reducer;
