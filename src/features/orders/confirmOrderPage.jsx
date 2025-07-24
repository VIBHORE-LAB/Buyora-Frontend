import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Truck, MapPin, Calendar, Shield, Check } from "lucide-react";
import { createOrderRequest } from "./orderSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCartRequest } from "../cart/cartSlice";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const singleProduct = location.state?.product;
    const cartItems = useSelector((state) => state.cart.cartItems);
    const orderState = useSelector((state) => state.orders);

    const [orderStep, setOrderStep] = useState("checkout");
    const [shippingAddress, setShippingAddress] = useState({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const countries = ["India", "United States", "United Kingdom"];

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!shippingAddress.address.trim()) newErrors.address = "Address is required";
        if (!shippingAddress.city.trim()) newErrors.city = "City is required";
        if (!shippingAddress.state.trim()) newErrors.state = "State is required";
        if (!shippingAddress.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Only product cost
    const subtotal = singleProduct
        ? singleProduct.price * singleProduct.quantity
        : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price);
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsProcessing(true);

        // Join address fields into a single string
        const addressString = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}, ${shippingAddress.country}`;

        const items = singleProduct
            ? [{
                product_id: singleProduct.product_id || singleProduct.id,
                quantity: singleProduct.quantity
            }]
            : cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

        dispatch(
            createOrderRequest({
                items,
                address: addressString,
                subtotal,
                total,
            })
        );

        dispatch(clearCartRequest());
        setOrderStep("confirmation");
        setIsProcessing(false);
    };

    if (orderStep === "confirmation" || orderState.createOrderSuccess) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="text-sm text-gray-400 mb-1">Order Placed</div>
                        <div className="text-lg font-bold text-white">{new Date().toLocaleString()}</div>
                    </div>
                    <div className="space-y-3 text-sm text-gray-400 mb-6">
                        <div className="flex items-center justify-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Expected delivery: 3-5 business days
                        </div>
                        <div className="flex items-center justify-center">
                            <Truck className="h-4 w-4 mr-2" />
                            Shipping to: {shippingAddress.city}, {shippingAddress.state}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
                            onClick={() => navigate("/orders")}
                        >
                            Track Your Order
                        </button>
                        <button
                            className="w-full border border-gray-600 text-gray-300 hover:bg-gray-700 py-3 px-4 rounded-lg transition-colors"
                            onClick={() => navigate("/products")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mr-6"
                                onClick={() => navigate("/cart")}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Cart
                            </button>
                            <h1 className="text-2xl font-bold text-white">Checkout</h1>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Shield className="h-5 w-5 mr-2" />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shipping Address */}
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingAddress.address}
                                            onChange={handleAddressChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${errors.address ? "border-red-500" : "border-gray-600"
                                                }`}
                                            placeholder="123 Main Street, Apt 4B"
                                        />
                                        {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleAddressChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${errors.city ? "border-red-500" : "border-gray-600"
                                                }`}
                                            placeholder="New York"
                                        />
                                        {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleAddressChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${errors.state ? "border-red-500" : "border-gray-600"
                                                }`}
                                            placeholder="NY"
                                        />
                                        {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code *</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingAddress.zipCode}
                                            onChange={handleAddressChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${errors.zipCode ? "border-red-500" : "border-gray-600"
                                                }`}
                                            placeholder="10001"
                                        />
                                        {errors.zipCode && <p className="mt-1 text-sm text-red-400">{errors.zipCode}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                                        <select
                                            name="country"
                                            value={shippingAddress.country}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                                        >
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-8">
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {singleProduct ? (
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={singleProduct.image_url || "/placeholder.svg"}
                                                alt={singleProduct.name}
                                                className="w-12 h-12 object-cover rounded border border-gray-600"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white text-sm font-medium truncate">
                                                    {singleProduct.name}
                                                </div>
                                                <div className="text-gray-400 text-xs">Qty: {singleProduct.quantity}</div>
                                            </div>
                                            <div className="text-white font-medium">
                                                {formatPrice(singleProduct.price * singleProduct.quantity)}
                                            </div>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3">
                                                <img
                                                    src={item.image_url || "/placeholder.svg"}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded border border-gray-600"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white text-sm font-medium truncate">{item.name}</div>
                                                    <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                                                </div>
                                                <div className="text-white font-medium">{formatPrice(item.price * item.quantity)}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {/* Order Totals */}
                                <div className="space-y-3 mb-6 border-t border-gray-700 pt-4">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="border-t border-gray-600 pt-3">
                                        <div className="flex justify-between text-xl font-bold text-white">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing Order...
                                        </>
                                    ) : (
                                        `Place Order - ${formatPrice(total)}`
                                    )}
                                </button>
                                {orderState.error && (
                                    <p className="text-xs text-red-400 text-center mt-3">
                                        {typeof orderState.error === "string"
                                            ? orderState.error
                                            : JSON.stringify(orderState.error)}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    By placing your order, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}