import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducre from "../features/products/productSlice"; 
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducre,
    cart: cartReducer,
    orders: orderReducer,
});

export default rootReducer;