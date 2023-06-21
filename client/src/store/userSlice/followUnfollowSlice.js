import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const followUnFollowSlice = createSlice({
  name: "followUnfollow",
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
    clearSuccess(state, action) {
      return {
        ...state,
        success: false,
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

const { setRequest, setSuccess, setFailed, clearError, clearSuccess } =
  followUnFollowSlice.actions;

export const followUnFollow =
  (userId, setUser = null, getIsFollow = null) =>
  async (dispatch) => {
    try {
      dispatch(setRequest());
      const { data } = await axios.post(
        `/api/v1/user/followAndUnFollow?userId=${userId}`
      );
      dispatch(setSuccess(data));

      setUser !== null && setUser(data.user);
      getIsFollow !== null && getIsFollow(data);
      dispatch(clearSuccess());
    } catch (error) {
      dispatch(setFailed(error?.response?.data?.message));
    }
  };

export const feedFollowAndUnFollow = (userId) => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.post(
      `/api/v1/user/followAndUnFollow?userId=${userId}`
    );
    dispatch(setSuccess(data));
    dispatch(clearSuccess());
  } catch (error) {
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { clearError, clearSuccess };
export default followUnFollowSlice.reducer;
