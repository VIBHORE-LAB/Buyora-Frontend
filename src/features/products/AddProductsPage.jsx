import { useState, useEffect } from "react"
import { ArrowLeft, Upload, X, Save, Eye } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { createProductRequest } from "./productSlice"
import { useNavigate } from "react-router-dom"


export default function AddProductsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, createSuccess } = useSelector((state) => state.products)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "electronics",
        image: null,
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)



    useEffect(() => {
        if (createSuccess) {
            alert("Product created successfully!")
            navigate("/sellerProducts");
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "electronics",
                image: null,
            })
            setIsSubmitting(false)
        }
    }, [createSuccess])

    const categories = [
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
        { value: "books", label: "Books" },
        { value: "home", label: "Home" },
        { value: "other", label: "Other" },
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))


        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required"
        } else if (formData.name.length < 3) {
            newErrors.name = "Product name must be at least 3 characters"
        } else if (formData.name.length > 120) {
            newErrors.name = "Product name must be less than 120 characters"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Product description is required"
        } else if (formData.description.length < 3) {
            newErrors.description = "Description must be at least 3 characters"
        }

        if (!formData.price) {
            newErrors.price = "Price is required"
        } else if (isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be a valid positive number"
        }

        if (!formData.category) {
            newErrors.category = "Category is required"
        }

        if (!formData.image) {
            newErrors.image = "Product image is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        console.log("Dispatching createProductRequest", formData)
        dispatch(
            createProductRequest({
                name: formData.name,
                description: formData.description,
                price: formData.price,
                category: formData.category,
                image: formData.image,
            })
        )
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }))

            if (errors.image) {
                setErrors((prev) => ({
                    ...prev,
                    image: "",
                }))
            }
        }
    }

    const formatPrice = (price) => {
        if (!price) return "₹0.00"
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(Number.parseFloat(price))
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">

                            <h1 className="text-2xl font-bold text-white">Create New Product</h1>
                        </div>
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
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
                    /* Create Form */
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.name ? "border-red-500" : "border-gray-600"
                                        }`}
                                    placeholder="Enter product name"
                                    maxLength={120}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                                <p className="mt-1 text-xs text-gray-400">{formData.name.length}/120 characters</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.description ? "border-red-500" : "border-gray-600"
                                        }`}
                                    placeholder="Describe your product in detail"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                            </div>

                            {/* Price and Category Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            max="999999"
                                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 transition-colors ${errors.price ? "border-red-500" : "border-gray-600"
                                                }`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white transition-colors ${errors.category ? "border-red-500" : "border-gray-600"
                                            }`}
                                    >
                                        {categories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Image *</label>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-400">
                                                    <span className="font-semibold">Click to upload</span>
                                                </p>
                                                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>

                                    {/* Image Preview */}
                                    {formData.image && (
                                        <div className="relative">
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Product preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end space-x-4 pt-6">
                                <button
                                    type="button"
                                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                    onClick={() => navigate("/products")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || loading}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting || loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Product
                                        </>
                                    )}
                                </button>
                            </div>
                            {error && (
                                <div className="mt-4 text-red-400">
                                    {typeof error === "string" ? error : JSON.stringify(error)}
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    /* Preview Mode */
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Product Preview</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Image */}
                            <div>
                                <img
                                    src={
                                        formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg?height=400&width=400"
                                    }
                                    alt={formData.name || "Product preview"}
                                    className="w-full h-96 object-cover rounded-lg border border-gray-600"
                                />
                            </div>
                            {/* Product Details */}
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">
                                        {formData.category}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-white">{formData.name || "Product Name"}</h1>

                                <div className="text-3xl font-bold text-white">{formatPrice(formData.price)}</div>

                                <div className="prose prose-invert">
                                    <p className="text-gray-300">{formData.description || "Product description will appear here..."}</p>
                                </div>

                                <div className="pt-4">
                                    <button

                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
