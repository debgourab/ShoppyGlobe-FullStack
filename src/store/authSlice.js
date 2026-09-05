import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, registerUser } from "../api/authApi";

const storedToken = localStorage.getItem("shoppyglobe_token");
const storedUser = JSON.parse(localStorage.getItem("shoppyglobe_user") || "null");

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginUser(credentials);
    localStorage.setItem("shoppyglobe_token", data.token);
    localStorage.setItem("shoppyglobe_user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const data = await registerUser(payload);
    localStorage.setItem("shoppyglobe_token", data.token);
    localStorage.setItem("shoppyglobe_user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const data = await getCurrentUser();
    localStorage.setItem("shoppyglobe_user", JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    localStorage.removeItem("shoppyglobe_token");
    localStorage.removeItem("shoppyglobe_user");
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken,
    user: storedUser,
    status: storedToken ? "authenticated" : "idle",
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("shoppyglobe_token");
      localStorage.removeItem("shoppyglobe_user");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => { state.status = "idle"; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => { state.status = "idle"; state.error = action.payload; })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "idle";
        state.token = null;
        state.user = null;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
