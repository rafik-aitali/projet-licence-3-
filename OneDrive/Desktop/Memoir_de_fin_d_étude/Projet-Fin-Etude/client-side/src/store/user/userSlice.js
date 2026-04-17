import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      console.log(action.payload.data);
      state.currentUser = action.payload.data;
      state.loading = false;
      state.error = null;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.error = action.payload.message;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload.data;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload.message;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.token = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload.message;
      state.loading = false;
    },
    logOutUserStart: (state) => {
      state.loading = true;
    },
    logOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.token = null;
    },
    logOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  logOutUserFailure,
  logOutUserSuccess,
  logOutUserStart,
} = userSlice.actions;

export default userSlice.reducer;
