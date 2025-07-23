import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProductRequest } from "./productSlice";
import { addToCartRequest } from "../cart/cartSlice";
import { ShoppingCart } from "lucide-react";

function ProductDetailsPage(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { product, loading } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProductRequest(id));
    }, [dispatch, id]);

    if (loading || !product) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading product...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white mb-6 flex items-center"
                >
                    <span className="mr-2">&larr;</span> Back to Products
                </button>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 flex flex-col md:flex-row gap-8">
                    <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full md:w-80 h-80 object-contain rounded-lg border border-gray-600 bg-gray-700"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                            <div className="text-blue-400 font-semibold text-xl mb-4">₹{product.price}</div>
                            <div className="text-gray-300 mb-4">{product.description}</div>
                            <div className="text-sm text-gray-400 mb-2">
                                Category: <span className="capitalize">{product.category}</span>
                            </div>
                            {product.seller_username && (
                                <div className="text-sm text-gray-400 mb-2">
                                    Seller: <span className="font-medium">{product.seller_username}</span>
                                </div>
                            )}
                        </div>
                           <button
                                            onClick={() => dispatch(addToCartRequest({ product_id: product.id, quantity: 1 }))}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors w-4/5 mx-auto block"
                                        >
                                            Add To Cart
                                        </button>   
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;