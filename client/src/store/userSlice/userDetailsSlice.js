import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userDetailsSlice = createSlice({
  name: "userDetailsSlice",
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
        user: action?.payload?.user,
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
  userDetailsSlice.actions;

export const getUserDetails =
  (userId, setUser = null, getIsFollow = null) =>
  async (dispatch) => {
    try {
      dispatch(setRequest());
      const { data } = await axios.get(`/api/v1/user/user?userId=${userId}`);
      dispatch(setSuccess(data));
      setUser !== null && setUser(data?.user);
      getIsFollow !== null && getIsFollow(data);
    } catch (error) {
      dispatch(setFailed(error?.response?.data?.message));
    }
  };

export { clearError };
export default userDetailsSlice.reducer;
