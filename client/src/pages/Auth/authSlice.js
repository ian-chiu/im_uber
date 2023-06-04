import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isAuthenticated: true,
  role: "passenger",
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
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;