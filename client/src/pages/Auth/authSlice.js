import { createSlice } from '@reduxjs/toolkit';
import axios from '~/app/axios';

const initialAuthState = {
  isAuthenticated: true,
  role: "passenger",
  username: "null"
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    setRole(state, action) {
      state.role = action.payload
    },
    setUsername(state, action) {
      state.username = action.payload
    }
  },
});

export const getUserData = (callback) => {
  return async (dispatch) => {
    axios.get("/users/name").then(res => {
      dispatch(authActions.setUsername(res.data.username))
    }).catch(err => callback(err))
  };
};

export const authActions = authSlice.actions;

export default authSlice.reducer;