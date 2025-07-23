import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsRequest } from './productSlice';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';
import { addToCartRequest, resetAddToCartSuccess } from "../cart/cartSlice";
import { ShoppingCart } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { createOrderRequest } from '../orders/orderSlice';
import { fetchCartRequest } from '../cart/cartSlice';

const categories = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
    { value: "home", label: "Home" },
    { value: "other", label: "Other" },
];





function ProductsPage() {
    const [role, setRole] = useState("");


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRole(decoded.role);
            }
            catch (error) {
                console.error("Failed to decode token:", error);
                setRole("");
            }
        }
    }, []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { products, loading, error } = useSelector(state => state.products);
    const { addToCartSuccess } = useSelector(state => state.cart);
    const cartItems = useSelector(state => state.cart.cartItems);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [urlParam, setUrlParam] = useState("");
  useEffect(() => {
    dispatch(fetchCartRequest());
  }, [dispatch]);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const name = params.get('name') || "";
        setUrlParam(name);
        if (name) {
            dispatch(fetchProductsRequest({ name }));
        } else {
            dispatch(fetchProductsRequest());
        }
    }, [dispatch, location.search]);

    useEffect(() => {
        if (addToCartSuccess) {
            alert("Product added to cart successfully");
            dispatch(resetAddToCartSuccess());
        }
    }, [addToCartSuccess, dispatch]);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    const handleSearch = (e) => {
        e.preventDefault();
        if (urlParam.trim()) {
            navigate({
                pathname: '/products',
                search: createSearchParams({ name: urlParam.trim() }).toString(),
            });
        } else {
            navigate('/products');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center text-gray-400 relative">
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative  mr-2"
                                style={{ background: "none", border: "none", padding: 0 }}
                            >
                                <ShoppingCart className="h-5 w-5 text-gray-400" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full px-1 py-0.5">
                                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                            <span className='px-6'>
                                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Products</h1>
                        <div className="flex gap-4">
                            {role === "Customer" && (
                                <button
                                    onClick={() => navigate('/orders')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    My Orders
                                </button>
                            )}

                            {role === "Seller" && (
                                <button
                                    onClick={() => navigate('/products/create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Create Product
                                </button>
                            )
                            }

                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Category Filter */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="w-full md:w-2/3 flex">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={urlParam}
                            onChange={e => setUrlParam(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-semibold transition-colors"
                        >
                            Search
                        </button>
                    </form>
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white px-4 py-2 hover:bg-gray-900 rounded-lg w-full md:w-64"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {loading && <div className="text-white">Loading products...</div>}
                {error && <div className="text-red-400">{error}</div>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filteredProducts.length === 0 ? (
                            <div className="text-gray-400">No products found.</div>
                        ) : (
                            filteredProducts.map(product => (
                                <div key={product.id} className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                                    <img
                                        src={product.image_url || "/placeholder.svg"}
                                        alt={product.name}
                                        className="w-full h-48 hover:scale-105 transition-transform object-contain rounded mb-4 bg-gray-700"
                                    />
                                    <a href={`/products/${product.id}`} className="text-white hover:underline">
                                        <h2 className="text-lg font-bold text-white mb-2">{product.name}</h2>
                                    </a>

                                    <p className="text-gray-300 mb-2">{product.description}</p>
                                    <div className="text-blue-400 font-semibold mb-2">₹{product.price}</div>
                                    <div className="text-s text-gray-200 font-semibold">
                                        {categories.find(cat => cat.value === product.category)?.label || product.category}
                                    </div>
                                    <div className='py-4 w-full flex flex-col gap-2'>
                                        {cartItems.some(item => item.product_id === product.id) ? (
                                            <button
                                                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold w-4/5 mx-auto block cursor-not-allowed"
                                                disabled
                                            >
                                                In Cart
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => dispatch(addToCartRequest({ product_id: product.id, quantity: 1 }))}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-4/5 mx-auto block"
                                            >
                                                Add To Cart
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate('/checkout', { state: { product: { ...product, product_id: product.id, quantity: 1 } } })}
                                            className="bg-gray-100 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors w-4/5 mx-auto block"
                                        >
                                            Buy Now
                                        </button>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
                        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">E-com</h3>
                            <p className="text-gray-400 dark:text-gray-500">
                                Your trusted partner for online shopping.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        Products
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        Contact
                                    </a>
                                </li>
                                   <li>
                                    <a href="/logout" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        LogOut
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        Shipping Info
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        Returns
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">
                                        Support
                                    </a>
                                </li>
                             
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                            <div className="text-gray-400 dark:text-gray-500 space-y-2">
                                <p>Email: support@techstore.com</p>
                                <p>Phone: (555) 123-4567</p>
                                <p>Address: 123 Tech Street, Digital City, DC 12345</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-400 dark:text-gray-500">&copy; 2024 TechStore. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default ProductsPage;