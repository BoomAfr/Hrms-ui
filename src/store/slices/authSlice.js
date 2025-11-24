import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/authServices';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data; 
    } catch (error) {
      console.log(error.response?.data?.detail || error.message, 'Login Error');
      
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        'Login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: localStorage.getItem('hrms_access_token'),
    refreshToken: localStorage.getItem('hrms_refresh_token'),
    isAuthenticated: !!localStorage.getItem('hrms_access_token'),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('hrms_access_token');
      localStorage.removeItem('hrms_refresh_token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
      localStorage.setItem('hrms_access_token', action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem('hrms_refresh_token', action.payload.refresh);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        localStorage.setItem('hrms_access_token', action.payload.access);
        localStorage.setItem('hrms_refresh_token', action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, updateTokens } = authSlice.actions;
export default authSlice.reducer;