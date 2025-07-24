import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateProductRequest, fetchProductRequest, resetUpdateState } from "./productSlice"; // example actions
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProductPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();
    console.log(productId);
    const { loading, error, updateSuccess, product } = useSelector(
        (state) => state.products
    );

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "electronics",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // For image preview URL cleanup
    const imagePreviewUrlRef = useRef(null);

    useEffect(() => {
        if (!productId) return;
        dispatch(fetchProductRequest(productId));
    }, [dispatch, productId]);


    
    useEffect(() => {
        if (updateSuccess) {
            dispatch(resetUpdateState());
        }
    }, [updateSuccess]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "", // convert to string for input
                category: product.category || "electronics",
                image: null,
            });
        }
    }, [product]);

    useEffect(() => {
        if (updateSuccess) {
            alert("Product updated successfully!");
            navigate("/sellerProducts");
            setIsSubmitting(false);
        }
    }, [updateSuccess, navigate]);

    // Clean up the object URL when image changes or component unmounts
    useEffect(() => {
        return () => {
            if (imagePreviewUrlRef.current) {
                URL.revokeObjectURL(imagePreviewUrlRef.current);
            }
        };
    }, []);

    const categories = [
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
        { value: "books", label: "Books" },
        { value: "home", label: "Home" },
        { value: "other", label: "Other" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
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

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Product name must be at least 3 characters";
        } else if (formData.name.length > 120) {
            newErrors.name = "Product name must be less than 120 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Product description is required";
        } else if (formData.description.length < 3) {
            newErrors.description = "Description must be at least 3 characters";
        }

        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be a valid positive number";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading || isSubmitting) return; // prevent multiple submits

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            id: productId,
            data: {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                image: formData.image, // file or null
            },
        };

        dispatch(updateProductRequest(payload));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke previous URL if any
            if (imagePreviewUrlRef.current) {
                URL.revokeObjectURL(imagePreviewUrlRef.current);
            }
            const previewUrl = URL.createObjectURL(file);
            imagePreviewUrlRef.current = previewUrl;

            setFormData((prev) => ({
                ...prev,
                image: file,
                previewUrl,
            }));

            if (errors.image) {
                setErrors((prev) => ({
                    ...prev,
                    image: "",
                }));
            }
        }
    };

    const formatPrice = (price) => {
        if (!price) return "₹0.00";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(Number.parseFloat(price));
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate("/sellerProducts")}
                            className="text-gray-300 hover:text-white mr-4 flex items-center"
                            aria-label="Back to products"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-white">Update Product</h1>
                        <button
                            onClick={() => setPreviewMode((prev) => !prev)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            {previewMode ? "Edit" : "Preview"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!previewMode ? (
                    /* Update Form */
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.name ? "border-red-500" : "border-gray-600"
                                        }`}
                                    placeholder="Enter product name"
                                    maxLength={120}
                                    autoComplete="off"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-400">
                                    {formData.name.length}/120 characters
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.description ? "border-red-500" : "border-gray-600"
                                        }`}
                                    placeholder="Describe your product in detail"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                                )}
                            </div>

                            {/* Price and Category Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Price *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={`w-full pl-7 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.price ? "border-red-500" : "border-gray-600"
                                                }`}
                                            placeholder="Enter price"
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.category ? "border-red-500" : "border-gray-600"
                                            }`}
                                    >
                                        {categories.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="text-gray-400"
                                />
                                {formData.previewUrl && (
                                    <img
                                        src={formData.previewUrl}
                                        alt="Preview"
                                        className="mt-4 h-48 object-contain rounded-lg border border-gray-600"
                                    />
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/sellerProducts")}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                    disabled={loading || isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
                                    disabled={loading || isSubmitting}
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    {loading || isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Preview Mode */
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Preview Product
                        </h2>
                        <div className="mb-4">
                            <strong className="text-gray-400">Name: </strong>
                            <span className="text-white">{formData.name || "(empty)"}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-gray-400">Description: </strong>
                            <span className="text-white">{formData.description || "(empty)"}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-gray-400">Price: </strong>
                            <span className="text-white">{formatPrice(formData.price)}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-gray-400">Category: </strong>
                            <span className="text-white">
                                {categories.find((c) => c.value === formData.category)?.label || "(empty)"}
                            </span>
                        </div>
                        <div>
                            <strong className="text-gray-400">Image Preview: </strong>
                            <div className="mt-2">
                                {formData.previewUrl ? (
                                    <img
                                        src={formData.previewUrl}
                                        alt="Preview"
                                        className="h-64 object-contain rounded-lg border border-gray-600"
                                    />
                                ) : product?.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt="Current product"
                                        className="h-64 object-contain rounded-lg border border-gray-600"
                                    />
                                ) : (
                                    <p className="text-gray-500">No image available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
