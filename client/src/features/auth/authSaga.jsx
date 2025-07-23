import axios from '../../utils/axiosInstance';
import { call, put, takeLatest } from 'redux-saga/effects';
import { jwtDecode } from 'jwt-decode'; // Fixed import
import {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
} from './authSlice';

function* handlelogin(action) {
    try {
        const response = yield call(axios.post, '/auth/login', action.payload);
        const token = response.data.token;
        const decoded = jwtDecode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(decoded));
        localStorage.setItem('token_timestamp', Date.now());
        yield put(loginSuccess({ token, user: decoded }));

        if (decoded.role === 'Seller') {
            window.location.href = '/sellerproducts';
        } else {
            window.location.href = '/products';
        }
    }
    catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(loginFailure(errorMessage));
    }
}

function* handleregister(action) {
    try {
        const response = yield call(axios.post, '/auth/register', action.payload);
        yield put(registerSuccess(response.data));
    }
    catch (error) {
        const errorMessage = error.response?.data?.message;
        yield put(registerFailure(errorMessage));
    }
}

export default function* authSaga() {
    yield takeLatest(loginRequest.type, handlelogin);
    yield takeLatest(registerRequest.type, handleregister);
}