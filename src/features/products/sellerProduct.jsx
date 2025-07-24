import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSellerProductsRequest, deleteProductRequest, deleteProductSuccess,resetDeleteProductSuccess } from '../products/productSlice';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home' },
    { value: 'other', label: 'Other' },
];

function SellerProductsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();


const { sellerProducts: products, loading, error, deleteProductSuccess } = useSelector(state => state.products);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [urlParam, setUrlParam] = useState('');

    const [alertShown, setAlertShown] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const name = params.get('name') || '';
        setUrlParam(name);
        if (name) {
            dispatch(fetchSellerProductsRequest({ name }));
        } else {
            dispatch(fetchSellerProductsRequest());
        }
    }, [dispatch, location.search]);

    useEffect(() => {
  if (deleteProductSuccess && !alertShown) {
    alert('Product deleted successfully!');
    dispatch(fetchSellerProductsRequest());
    setAlertShown(true);
    dispatch(resetDeleteProductSuccess());
  }
}, [deleteProductSuccess, alertShown, dispatch]);

    useEffect(() => {
        if (error && error.toLowerCase().includes('already been ordered') && !alertShown) {
            alert(error);
            setAlertShown(true);
            dispatch(fetchSellerProductsRequest());
        }

        if (!error) {
            setAlertShown(false);
        }
    }, [error, alertShown]);

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    const handleSearch = e => {
        e.preventDefault();
        if (urlParam.trim()) {
            navigate({
                pathname: '/sellerProducts',
                search: createSearchParams({ name: urlParam.trim() }).toString(),
            });
        } else {
            navigate('/products');
        }
    };

    const handleDelete = id => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            dispatch(deleteProductRequest(id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center text-gray-400 relative"></div>
                        <h1 className="text-2xl font-bold text-white">Products</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/products/create')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Create Product
                            </button>
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
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <div className="text-white">Loading products...</div>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filteredProducts.length === 0 ? (
                            <div className="text-gray-400">No products found.</div>
                        ) : (
                            filteredProducts.map(product => (
                                <div key={product.id} className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                                    <img
                                        src={product.image_url || '/placeholder.svg'}
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
                                    <div className="py-4 w-full flex flex-col gap-2">
                                        <button
                                            onClick={() => navigate(`/sellerproducts/update/${product.id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-4/5 mx-auto block"
                                        >
                                            Update Product
                                        </button>


                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-4/5 mx-auto block"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                {error && !error.toLowerCase().includes('already been ordered') && (
                    <div className="text-red-400 mt-4">{error}</div>
                )}
            </div>
        </div>
    );
}

export default SellerProductsPage;
