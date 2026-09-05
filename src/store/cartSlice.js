import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCartItem, clearRemoteCart, getCart, removeCartItem, updateCartItem } from "../api/cartApi";

function mapCart(data) {
  return data.items || [];
}

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    return mapCart(await getCart());
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addToCartAsync = createAsyncThunk("cart/add", async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    return mapCart(await addCartItem(productId, quantity));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const incrementQuantity = createAsyncThunk("cart/increment", async (item, { rejectWithValue }) => {
  try {
    return mapCart(await updateCartItem(item.id, item.quantity + 1));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const decrementQuantity = createAsyncThunk("cart/decrement", async (item, { rejectWithValue }) => {
  if (item.quantity <= 1) return item;
  try {
    return mapCart(await updateCartItem(item.id, item.quantity - 1));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (productId, { rejectWithValue }) => {
  try {
    return mapCart(await removeCartItem(productId));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const clearCartRemote = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try {
    return mapCart(await clearRemoteCart());
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = { items: [], searchTerm: "", status: "idle", error: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setSearchTerm(state, action) { state.searchTerm = action.payload; },
    resetCartError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.status = "loading"; state.error = null; };
    const success = (state, action) => { state.status = "succeeded"; if (Array.isArray(action.payload)) state.items = action.payload; };
    const failure = (state, action) => { state.status = "failed"; state.error = action.payload; };

    builder
      .addCase(fetchCart.pending, loading).addCase(fetchCart.fulfilled, success).addCase(fetchCart.rejected, failure)
      .addCase(addToCartAsync.pending, loading).addCase(addToCartAsync.fulfilled, success).addCase(addToCartAsync.rejected, failure)
      .addCase(incrementQuantity.pending, loading).addCase(incrementQuantity.fulfilled, success).addCase(incrementQuantity.rejected, failure)
      .addCase(decrementQuantity.pending, loading).addCase(decrementQuantity.fulfilled, success).addCase(decrementQuantity.rejected, failure)
      .addCase(removeFromCart.pending, loading).addCase(removeFromCart.fulfilled, success).addCase(removeFromCart.rejected, failure)
      .addCase(clearCartRemote.pending, loading).addCase(clearCartRemote.fulfilled, success).addCase(clearCartRemote.rejected, failure);
  }
});

export const { setSearchTerm, resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
