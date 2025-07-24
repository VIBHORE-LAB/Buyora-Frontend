import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Truck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartRequest,
  removeFromCartRequest,
  increaseQuantityRequest,
  decreaseQuantityRequest,
} from "./cartSlice";

import { useNavigate } from "react-router-dom";


export default function CartPage() {

  const { cartItems, loading, error } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartRequest());
  }, [dispatch]);

  const Navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error("Cart error:", error);
    }
  }, [error]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCartRequest({ product_id: productId }));
      return;
    }
    const item = cartItems.find(item => item.product_id === productId);
    if (!item) return;
    if (newQuantity > item.quantity) {
      dispatch(increaseQuantityRequest({ id: productId }));
    } else {
      dispatch(decreaseQuantityRequest({ id: productId }));
    }
  };

  const removeItem = (productId) => {
    dispatch(removeFromCartRequest({ product_id: productId }));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      cartItems.forEach(item => dispatch(removeFromCartRequest({ product_id: item.product_id })));
    }
  };







  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;


  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);


  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const handleCheckout = async () => {
    Navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => Navigate("/products")}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mr-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </button>
              <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            </div>
            <div className="flex items-center text-gray-400">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <div className="text-white text-center mb-4">Loading cart...</div>}
        {error && (
          <div className="text-red-400 text-center mb-4">
            {typeof error === "string" ? error : "Failed to load cart"}
          </div>
        )}
        {cartItems.length === 0 && !loading ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some products to get started</p>
            <button 
              onClick={() => Navigate("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Cart Items</h2>
                    <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm transition-colors">
                      Clear Cart
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-700">
                  {cartItems
                    .slice() // make a shallow copy to avoid mutating Redux state
                    .sort((a, b) => a.product_id - b.product_id) // or sort by name: (a, b) => a.name.localeCompare(b.name)
                    .map((item) => (
                      <div key={item.product_id} className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                          />
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="capitalize">{item.category}</span>
                              <span className="mx-2">•</span>
                              <span>Sold by {item.seller_username}</span>
                            </div>
                          </div>
                          {/* Price and Controls */}
                          <div className="flex flex-col items-end space-y-3">
                            <div className="text-lg font-bold text-white">{formatPrice(item.price * item.quantity)}</div>
                            <div className="text-sm text-gray-400">{formatPrice(item.price)} each</div>
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                              >
                                <Minus className="h-4 w-4 text-white" />
                              </button>
                              <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                              >
                                <Plus className="h-4 w-4 text-white" />
                              </button>
                            </div>
                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                {/* Order Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : ""}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>{formatPrice(subtotal + shipping + tax)}</span>
                    </div>
                  </div>
                </div>
                {/* Shipping Info */}
                {subtotal < 50 && (
                  <div className="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-3 mb-6">
                    <div className="flex items-center text-blue-400 text-sm">
                      <Truck className="h-4 w-4 mr-2" />
                      Add {formatPrice(50 - subtotal)} more for free shipping
                    </div>
                  </div>
                )}
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? "Placing Order..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
