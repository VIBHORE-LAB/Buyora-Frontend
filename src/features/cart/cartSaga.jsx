import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from '../../utils/axiosInstance';
import {
    fetchCartRequest, fetchCartSuccess, fetchCartFailure,
    addToCartRequest, addToCartSuccess, addToCartFailure,
    removeFromCartRequest, removeFromCartSuccess, removeFromCartFailure,
    increaseQuantityFailure, increaseQuantityRequest, increaseQuantitySuccess,
    decreaseQuantitySuccess, decreaseQuantityRequest, decreaseQuantityFailure,
    clearCartRequest, clearCartSuccess, clearCartFailure
} from './cartSlice';

function* handleFetchCart() {
    try {
        const token = localStorage.getItem('token');
        const response = yield call(
            axios.get,
            '/cart',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        yield put(fetchCartSuccess(response.data.cart || []));
    }
    catch (error) {
        console.error("Fetch cart saga error:", error);
        yield put(fetchCartFailure(error.response ? error.response.data : 'Network Error'));
    }
}

function* handleAddToCart(action) {
    try {
        const token = localStorage.getItem('token');
        const { product_id, quantity } = action.payload;
        const response = yield call(
            axios.post,
            '/cart/add',
            { product_id, quantity },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        yield put(addToCartSuccess(response.data));
        yield put(fetchCartRequest());
    } catch (error) {
        yield put(addToCartFailure(error.response?.data?.error || "Failed to add to cart"));
    }
}

function* handleRemoveFromCart(action) {
    try {
        const token = localStorage.getItem('token');
        const product_id = action.payload.product_id;
        const response = yield call(
            axios.delete,
            `/cart/${product_id}/remove`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        yield put(removeFromCartSuccess(response.data));
        yield put(fetchCartRequest());
    }
    catch (error) {
        yield put(removeFromCartFailure(error.response ? error.response.data : 'Network Error'));
    }
}

function* handleIncreaseQuantity(action) {
    try {
        const token = localStorage.getItem('token');
        const { id } = action.payload;
        const response = yield call(
            axios.put,
            `/cart/${id}/increase`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        yield put(increaseQuantitySuccess(response.data));
        yield put(fetchCartRequest());
    } catch (error) {
        yield put(increaseQuantityFailure(error.response ? error.response.data : 'Network Error'));
    }
}

function* handleDecreaseQuantity(action) {
    try {
        const token = localStorage.getItem('token');
        const { id } = action.payload; // 
        const response = yield call(
            axios.put,
            `/cart/${id}/decrease`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        yield put(decreaseQuantitySuccess(response.data));
        yield put(fetchCartRequest());
    } catch (error) {
        yield put(decreaseQuantityFailure(error.response ? error.response.data : 'Network Error'));
    }
}

function* handleClearCart() {
    try {
        const token = localStorage.getItem('token');
        yield call(
            axios.delete,
            '/cart/clear',

            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        yield put(clearCartSuccess());
    } catch (error) {
        yield put(clearCartFailure(error.response ? error.response.data : 'Network Error'));
    }
}

export default function* cartSaga() {
    yield all([
        takeLatest(fetchCartRequest.type, handleFetchCart),
        takeLatest(addToCartRequest.type, handleAddToCart),
        takeLatest(removeFromCartRequest.type, handleRemoveFromCart),
        takeLatest(increaseQuantityRequest.type, handleIncreaseQuantity),
        takeLatest(decreaseQuantityRequest.type, handleDecreaseQuantity),
        takeLatest(clearCartRequest.type, handleClearCart),
    ]);
}