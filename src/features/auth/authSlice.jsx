import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    user: null,
    token: null,
    loading: null,
    error: null,


};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        loginRequest:(state) =>{
            state.loading = true;
            state.error = null;

        },

        loginSuccess:(state,action) =>{
            state.loading = false;
            state.user = action.payload.user,
            state.token = action.payload.token,
            state.error = null;
        },

        loginFailure:(state,action) =>{
            state.loading = false;
            state.user = null;
            state.error = action.payload;

        },

        registerRequest:(state) =>{
            state.loading = true;
            state.error = null;
        },

        registerSuccess:(state,action) =>{
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },

        registerFailure:(state,action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        logout:(state) =>{
            state.user = null;
            state.loading = false;
            state.error = null;
            state.token = null;
        },




    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer;


