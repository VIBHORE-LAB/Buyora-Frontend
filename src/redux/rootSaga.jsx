import { all } from "redux-saga/effects";
import authSaga from "../features/auth/authSaga";
import productSaga from "../features/products/productSaga";
import cartSaga from "../features/cart/cartSaga"; 
import orderSaga from "../features/orders/orderSaga";

export default function* rootSaga() {
    yield all([authSaga(), productSaga(), cartSaga(), orderSaga()]);
}