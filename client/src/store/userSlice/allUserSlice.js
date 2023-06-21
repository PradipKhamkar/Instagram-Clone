import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getAllUserSlice = createSlice({
  name: "allUser",
  initialState: { users: [] },
  reducers: {
    setRequest(state, action) {
      return {
        loading: true,
      };
    },
    setSuccess(state, action) {
      return {
        loading: false,
        users: action?.payload?.allUsers,
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
  getAllUserSlice.actions;

export const getAllUser = () => async (dispatch) => {
  try {
    dispatch(setRequest());
    const { data } = await axios.get("/api/v1/user/allUser");
    dispatch(setSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(setFailed(error?.response?.data?.message));
  }
};

export { clearError };
export default getAllUserSlice.reducer;
