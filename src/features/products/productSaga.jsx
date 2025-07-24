import {call,put,takeLatest,all} from 'redux-saga/effects';
import axios from '../../utils/axiosInstance';

import {
    fetchProductsRequest, fetchProductsSuccess, fetchProductsFailure,
    fetchProductRequest, fetchProductSuccess, fetchProductFailure,
    createProductRequest, createProductSuccess, createProductFailure,
    updateProductRequest, updateProductSuccess, updateProductFailure,
    deleteProductRequest, deleteProductSuccess, deleteProductFailure,
    fetchSellerProductsRequest, fetchSellerProductsSuccess, fetchSellerProductsFailure,
} from './productSlice';


function* handleFetchProducts(action) {
    try{
        let url = '/products';
        if (action.payload && action.payload.name){
            url += `?name=${encodeURIComponent(action.payload.name)}`;
        }
        const response = yield call(axios.get,url);
        yield put(fetchProductsSuccess(response.data));
    }

    catch(error){
        yield put(fetchProductsFailure(error.response ? error.response.data : 'Network Error'));
    }

}

function* handleFetchProduct(action) {
    try{
        const response = yield call(axios.get, `/products/${action.payload}`);
        yield put(fetchProductSuccess(response.data));
    }
    catch(error){
        yield put(fetchProductFailure(error.response?.data?.error || error.message ));
    }
}

function* handleCreateProduct(action){
    try{
        const { name, description, price, image, category } = action.payload;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);
        formData.append('category', category); 
        if(image) {
            formData.append('image', image);
        }

        const response = yield call(axios.post,'/products/create', formData, {
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        yield put(createProductSuccess(response.data));

    }
    catch(error){
        yield put(createProductFailure(error.response?.data?.error || error.message));
}
}

function* handleUpdateProduct(action) {
  try {
    const { id, data } = action.payload;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const response = yield call(axios.put, `/products/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    yield put(updateProductSuccess(response.data));
  } catch (error) {
    yield put(updateProductFailure(error.response?.data?.error || error.message));
  }
}


function* handleDeleteProduct(action) {
    try{
        yield call(axios.delete, `/products/delete/${action.payload}`);
        yield put(deleteProductSuccess(action.payload));
    }
    catch(error){
        yield put(deleteProductFailure(error.response?.data?.error || error.message));

}

}

function* handleFetchSellerProducts(action) {
    try {
        const token = localStorage.getItem('token');
        let url = '/products/sellerProducts';

        if (action.payload && action.payload.name) {
            const query = new URLSearchParams({ name: action.payload.name }).toString();
            url += `?${query}`;
        }

        const response = yield call(axios.get, url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        yield put(fetchSellerProductsSuccess(response.data));
    } catch (error) {
        yield put(fetchSellerProductsFailure(error.response?.data?.error || error.message));
    }
}


export default function* productSaga() {
    yield all([
        takeLatest(fetchProductsRequest.type, handleFetchProducts),
        takeLatest(fetchProductRequest.type, handleFetchProduct),
        takeLatest(createProductRequest.type, handleCreateProduct),
        takeLatest(updateProductRequest.type, handleUpdateProduct),
        takeLatest(deleteProductRequest.type, handleDeleteProduct),
        takeLatest(fetchSellerProductsRequest.type, handleFetchSellerProducts),
        takeLatest(fetchSellerProductsRequest.type, handleFetchSellerProducts), 
    ]);
}

