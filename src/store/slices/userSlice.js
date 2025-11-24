import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userProfileAPI } from '../../services/userProfileServices';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.accessToken;
      
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await userProfileAPI.getProfile(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.accessToken;
      
      const response = await userProfileAPI.updateProfile(userData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user profile'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateError = null;
    },
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
        state.updateError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  }
});

export const { clearUserError, clearUserProfile, updateProfileLocally } = userSlice.actions;
export default userSlice.reducer;