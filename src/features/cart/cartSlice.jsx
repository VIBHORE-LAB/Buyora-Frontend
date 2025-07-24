import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
    totalPrice: 0,
    addToCartSuccess: false,
    removeFromCartSuccess: false,
    increaseQuantitySuccess: false,
    decreaseQuantitySuccess: false,
    clearCartSuccess: false

}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        fetchCartRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCartSuccess: (state, action) => {
            state.loading = false;
            state.cartItems = action.payload;
            state.error = null;
            state.totalPrice = action.payload.reduce((total, item) => total + item.price * item.quantity, 0);

        },

        fetchCartFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;

        },

        addToCartRequest: (state) => {
            state.loading = true;
            state.error = null;

        },

        addToCartSuccess: (state, action) => {
            state.loading = false;
            state.addToCartSuccess = true;
            state.cartItems.push(action.payload);
            state.totalPrice += action.payload.price * action.payload.quantity;
            state.error = null;

        },

        addToCartFailure: (state, action) => {
            state.loading = false;
            state.addToCartSuccess = false;
            state.error = action.payload;
        },

        removeFromCartRequest: (state) => {
            state.loading = true;
            state.error = null;

        },

        removeFromCartSuccess: (state, action) => {
            state.loading = false;
            state.removeFromCartSuccess = true;
            state.error = null;
            const itemIndex = state.cartItems.findIndex(item => item.product_id === action.payload.product_id);
            if (itemIndex !== -1) {
                state.totalPrice -= state.cartItems[itemIndex].price * state.cartItems[itemIndex].quantity;
                state.cartItems.splice(itemIndex, 1);
            } else {
                state.removeFromCartSuccess = false;
                state.error = "Item not found in cart";
            }
        },

        removeFromCartFailure: (state, action) => {
            state.loading = false;
            state.removeFromCartSuccess = false
            state.error = action.payload;
        },

        increaseQuantityRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        increaseQuantitySuccess: (state, action) => {
            state.loading = false;
            state.increaseQuantitySuccess = true;
            state.error = null;
            const itemIndex = state.cartItems.findIndex(item => item.product_id === action.payload.product_id);
            if (itemIndex !== -1) {
                state.cartItems[itemIndex].quantity += 1;
                state.totalPrice += state.cartItems[itemIndex].price;
            } else {
                state.increaseQuantitySuccess = false;
                state.error = "Item not found in cart";
            }
        },

        increaseQuantityFailure: (state, action) => {
            state.loading = false;
            state.increaseQuantitySuccess = false;
            state.error = action.payload;
        },

        decreaseQuantityRequest: (state) => {
            state.loading = true;
            state.error = null;

        },

        decreaseQuantitySuccess: (state, action) => {
            state.loading = false;
            state.decreaseQuantitySuccess = true;
            state.error = null;
            const itemIndex = state.cartItems.findIndex(item => item.product_id === action.payload.product_id);
            if (itemIndex !== -1) {
                if (state.cartItems[itemIndex].quantity > 1) {
                    state.cartItems[itemIndex].quantity -= 1;
                    state.totalPrice -= state.cartItems[itemIndex].price;
                } else {
                    state.removeFromCartSuccess = true;
                    state.totalPrice -= state.cartItems[itemIndex].price;
                    state.cartItems.splice(itemIndex, 1);
                }
            } else {
                state.decreaseQuantitySuccess = false;
                state.error = "Item not found in cart";
            }
        },

        decreaseQuantityFailure: (state, action) => {
            state.loading = false;
            state.decreaseQuantitySuccess = false;
            state.error = action.payload;
        },

        resetAddToCartSuccess: (state) => {
            state.addToCartSuccess = false;
        },
        clearCartRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        clearCartSuccess: (state) => {
            state.loading = false;
            state.cartItems = [];
            state.totalPrice = 0;
            state.error = null;
        },
        clearCartFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchCartRequest,
    fetchCartSuccess,
    fetchCartFailure,
    addToCartRequest,
    addToCartSuccess,
    addToCartFailure,
    removeFromCartRequest,
    removeFromCartSuccess,
    removeFromCartFailure,
    increaseQuantityRequest,
    increaseQuantitySuccess,
    increaseQuantityFailure,
    decreaseQuantityRequest,
    decreaseQuantitySuccess,
    decreaseQuantityFailure,
    resetAddToCartSuccess,
    clearCartRequest,
    clearCartSuccess,
    clearCartFailure,
} = cartSlice.actions;

export default cartSlice.reducer;