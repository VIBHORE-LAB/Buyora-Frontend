import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    sellerProducts: [],

};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProductsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
            state.error = null;
        },

        fetchProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        fetchProductRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchProductSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload;
            state.error = null;
        },

        fetchProductFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        createProductRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.createSuccess = false;
        },

        createProductSuccess: (state, action) => {
            state.loading = false;
            state.createSuccess = true;
            state.products.push(action.payload);
            state.error = null;
        },

        createProductFailure: (state, action) => {
            state.loading = false;
            state.createSuccess = false;
            state.error = action.payload;
        },

        updateProductRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.updateSuccess = false;
        },

        updateProductSuccess: (state, action) => {
            state.loading = false;
            state.updateSuccess = true;
            state.product = action.payload;
            state.error = null;
        },
        updateProductFailure: (state, action) => {
            state.loading = false;
            state.updateSuccess = false;
            state.error = action.payload;

        },
        resetCreateState: (state) => {
            state.createSuccess = false;
            state.error = null;
        },


        resetUpdateState: (state) => {
            state.updateSuccess = false;
            state.error = null;
        },

        deleteProductRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.deleteSuccess = false;

        },

        deleteProductSuccess: (state, action) => {
            state.loading = false;
            state.deleteSuccess = true;
            state.products = state.products.filter(p => p.id !== action.payload);
            state.error = null;
        },

        deleteProductFailure: (state, action) => {
            state.loading = false;
            state.deleteSuccess = false;
            state.error = action.payload;
        },

        fetchSellerProductsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        fetchSellerProductsSuccess: (state, action) => {
            state.loading = false;
            state.sellerProducts = action.payload;
            state.error = null;
        },
        fetchSellerProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetDeleteProductSuccess: (state) => {
            state.deleteProductSuccess = false;
        }


    }
});

export const {
    fetchProductsRequest, fetchProductsSuccess, fetchProductsFailure,
    fetchProductRequest, fetchProductSuccess, fetchProductFailure,
    createProductRequest, createProductSuccess, createProductFailure,
    updateProductRequest, updateProductSuccess, updateProductFailure,
    deleteProductRequest, deleteProductSuccess, deleteProductFailure,
    fetchSellerProductsRequest, fetchSellerProductsFailure, fetchSellerProductsSuccess, resetCreateState, resetUpdateState, resetDeleteProductSuccess
} = productSlice.actions;

export default productSlice.reducer;