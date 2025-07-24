import { useState, useEffect } from "react"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Calendar, MapPin, RotateCcw } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrdersRequest } from './orderSlice';
import { cancelOrderRequest } from "./orderSlice";
import { useNavigate } from "react-router-dom";
export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("pending")
    const ordersState = useSelector(state => state.orders) || {};
    const { orders = [], loading, error } = ordersState;
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchOrdersRequest());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            console.error("Error fetching orders:", error);
        }
    }, [error]);

   
    const formatAddress = (str) => {
        return str
            .split(/[\s,]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .replace(/\s,/g, ',')
            .replace(/,\s/g, ', ');
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Package className="h-5 w-5 text-yellow-400" />
            case "shipped":
                return <Truck className="h-5 w-5 text-blue-400" />

            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-400" />
            default:
                return <Package className="h-5 w-5 text-gray-400" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-400 bg-yellow-900 bg-opacity-20"
            case "shipped":
                return "text-blue-400 bg-blue-900 bg-opacity-20"

            case "cancelled":
                return "text-red-400 bg-red-900 bg-opacity-20"
            default:
                return "text-gray-400 bg-gray-900 bg-opacity-20"
        }
    }




    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price)
    }

    console.log("Orders:", orders);
    const filteredOrders = (orders || []).filter((order) => {
        if (activeTab === "pending") {
            return order.status === "pending"
        }

        if (activeTab === "cancelled") {
            return order.status === "cancelled"
        }
        return true
    })


    const handleCancelOrder = (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            dispatch(cancelOrderRequest(orderId));
        }
    }

    useEffect(() => {
        if (ordersState.cancelOrderSuccess) {
            dispatch(fetchOrdersRequest());

        }
    }, [ordersState.cancelOrderSuccess, dispatch]);



    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => Navigate('/products')}
                                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mr-6">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </button>
                            <h1 className="text-2xl font-bold text-white">My Orders</h1>
                        </div>
                        <div className="text-gray-400">
                            {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8">
                    <div className="flex border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === "pending"
                                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/20"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            Pending Orders
                        </button>

                        <button
                            onClick={() => setActiveTab("cancelled")}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === "cancelled"
                                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/20"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                            <p className="text-gray-400">You don't have any {activeTab} orders yet.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(order.status)}
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                                                <p className="text-gray-400 text-sm">Placed on {formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">
                                                {formatPrice(order.items.reduce((sum, item) => sum + item.price, 0))}
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        {/* Expected/Actual Delivery */}
                                        <div className="flex items-center text-gray-400">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>Expected by {formatDate(order.expected_delivery)}</span>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="flex items-center text-gray-400">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{formatAddress(order.address)}</span>

                                        </div>


                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h4 className="text-white font-medium mb-4">Items ({order.items.length})</h4>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4">
                                                <img
                                                    src={item.product?.image_url || "/placeholder.svg"}
                                                    alt={item.product?.name || "Product"}
                                                    className="w-16 h-16 object-cover rounded border border-gray-600"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-white font-medium truncate">{item.product?.name || "Product"}</h5>
                                                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-white font-medium">{formatPrice(item.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-3">
                                            {order.status === "pending" && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}


                                        </div>
                                        <button className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
