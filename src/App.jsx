import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { fetchCartRequest } from './features/cart/cartSlice';
import ProductDetailsPage from './features/products/ProductDetailsPage.jsx';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage.jsx';
import AuthPage from './features/auth/authPage.jsx';
import { loginSuccess } from './features/auth/authSlice'; // <-- Import loginSuccess action
import ProductsPage from './features/products/ProductsPage.jsx';
import CreateProductPage from './features/products/AddProductsPage.jsx';
import CartPage from './features/cart/cartPage.jsx';
import OrdersPage from './features/orders/orderPage.jsx';
import CheckoutPage from './features/orders/confirmOrderPage.jsx';
import LogOut from './components/LogOut.jsx';
import SellerProduct from './features/products/sellerProduct.jsx';
import UpdateProductPage from './features/products/UpdateProductPage.jsx';




function App() {
  const dispatch = useDispatch(); // <-- Add this line

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const tokenTimestamp = localStorage.getItem('token_timestamp');

    // 1 hour = 3600000 ms
    if (token && user && tokenTimestamp) {
      const now = Date.now();
      if (now - Number(tokenTimestamp) < 3600000) {
        dispatch(loginSuccess({ token, user }));
      } else {
        // Token expired: remove from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCartRequest());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path='/orders' element={<OrdersPage />} />
        <Route path ='/checkout' element={<CheckoutPage />} />
        <Route path='/logout' element={<LogOut />} />
        <Route path='/sellerproducts' element={<SellerProduct />} />
       <Route path="/sellerproducts/update/:productId" element={<UpdateProductPage />} />


      </Routes>

    </Router>
  )
}

export default App
