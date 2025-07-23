import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    createOrderSuccess: false,
    fetchOrdersSuccess: false,
    fetchOrderSuccess: false,
    cancelOrderSuccess: false,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        fetchOrdersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchOrdersSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
            state.error = null;
        },

        fetchOrdersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        createOrderRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        createOrderSuccess: (state, action) => {
            state.loading = false;
            state.createOrderSuccess = true;
            state.orders.push(action.payload);
            state.error = null;
        },

        createOrderFailure: (state, action) => {
            state.loading = false;
            state.createOrderSuccess = false;
            state.error = action.payload;
        },

        fetchOrderRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchOrderSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.error = null;
            state.fetchOrderSuccess = true;
        },
        fetchOrderFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.fetchOrderSuccess = false;
        },

        cancelOrderRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        cancelOrderSuccess: (state, action) => {
            state.loading = false;
            state.cancelOrderSuccess = true;
            state.orders = state.orders.filter(order => order.id !== action.payload.id);

            state.error = null;
        },

        cancelOrderFailure: (state, action) => {
            state.loading = false;
            state.cancelOrderSuccess = false;
            state.error = action.payload;
        }
    }
});

export const {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    createOrderRequest,
    createOrderSuccess,
    createOrderFailure,
    fetchOrderRequest,
    fetchOrderSuccess,
    fetchOrderFailure,
    cancelOrderRequest,
    cancelOrderSuccess,
    cancelOrderFailure,
} = orderSlice.actions;

export default orderSlice.reducer;

