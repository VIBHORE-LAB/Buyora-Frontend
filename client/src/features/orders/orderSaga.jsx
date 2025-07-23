import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from '../../utils/axiosInstance';
import {
    fetchOrdersRequest, fetchOrdersSuccess, fetchOrdersFailure,
    fetchOrderRequest, fetchOrderSuccess, fetchOrderFailure,
    createOrderRequest, createOrderSuccess, createOrderFailure,
    cancelOrderRequest, cancelOrderSuccess, cancelOrderFailure
} from './orderSlice';

function* handleFetchOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = yield call(
            axios.get,
            '/orders',
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        yield put(fetchOrdersSuccess(response.data.orders || []));
    } catch (error) {
        yield put(fetchOrdersFailure(error.response?.data || 'Error fetching orders'));
    }
}

function* handleFetchOrder(action) {
    try {
        const token = localStorage.getItem('token');
        const response = yield call(
            axios.get,
            `/orders/${action.payload}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        yield put(fetchOrderSuccess(response.data.order));
    } catch (error) {
        yield put(fetchOrderFailure(error.response?.data || 'Error fetching order'));
    }
}


function* handleCreateOrder(action) {
    try {
        const token = localStorage.getItem('token');
        const response = yield call(
            axios.post,
            '/orders/create',
            action.payload,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        yield put(createOrderSuccess(response.data.order));
    } catch (error) {
        yield put(createOrderFailure(error.response?.data || 'Error creating order'));
    }
}


function* handleCancelOrder(action) {
    try {
        const token = localStorage.getItem('token');
        const response = yield call(
            axios.delete,
            `/orders/cancel/${action.payload}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        alert('Order cancelled successfully');

        yield put(cancelOrderSuccess({ id: action.payload }));
    } catch (error) {
        yield put(cancelOrderFailure(error.response?.data || 'Error cancelling order'));
    }
}

export default function* orderSaga() {
    yield all([
        takeLatest(fetchOrdersRequest.type, handleFetchOrders),
        takeLatest(fetchOrderRequest.type, handleFetchOrder),
        takeLatest(createOrderRequest.type, handleCreateOrder),
        takeLatest(cancelOrderRequest.type, handleCancelOrder),
    ]);
}