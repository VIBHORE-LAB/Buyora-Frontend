import { useState } from "react"
import { Star, ShoppingCart, Truck, Shield, RefreshCw, Heart, Menu, X } from "lucide-react"
import hero1 from "../assets/hero1.jpg"
import headphones from "../assets/headphones.jpg"
import smartwatch from "../assets/smartwatch.jpg"
import shirt from "../assets/shirt.jpg"
import pen from "../assets/pen.jpg"
import { useNavigate } from "react-router-dom"
export default function EcommerceLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const Navigate = useNavigate();
    const featuredProducts = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 2199.99,
            originalPrice: 2599.99,
            image: headphones,
            rating: 4.8,
            reviews: 124,
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 2399.99,
            originalPrice: 2599.99,
            image: smartwatch,
            rating: 4.9,
            reviews: 89,
        },
        {
            id: 3,
            name: "Pen",
            price: 79.99,
            originalPrice: 99.99,
            image: pen,
            rating: 4.7,
            reviews: 156,
        },
        {
            id: 4,
            name: "Shirt",
            price: 499.99,
            originalPrice: 699.99,
            image: shirt,
            rating: 4.6,
            reviews: 203,
        },
    ]

    const testimonials = [
        {
            name: "Sarah Johnson",
            text: "Amazing quality products and fast shipping. I'm a customer for life!",
            rating: 5,
        },
        {
            name: "Mike Chen",
            text: "Best prices I've found online. The customer service is outstanding.",
            rating: 5,
        },
        {
            name: "Emily Davis",
            text: "Love the variety of products. Everything arrived exactly as described.",
            rating: 5,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-900 transition-colors dark">
            {/* Header */}
            <header className="bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-white">E-com</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a href="#" className="text-gray-300 hover:text-white">
                                Home
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                Products
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                About
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white">
                                Contact
                            </a>
                        </nav>



                        {/* Mobile menu button */}
                        <button className="md:hidden text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
                                <a href="#" className="block px-3 py-2 text-gray-300">
                                    Home
                                </a>
                                <a href="#" className="block px-3 py-2 text-gray-300">
                                    Products
                                </a>
                                <a href="#" className="block px-3 py-2 text-gray-300">
                                    About
                                </a>
                                <a href="#" className="block px-3 py-2 text-gray-300">
                                    Contact
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-800 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold mb-6">Latest Products at Unbeatable Prices</h2>
                            <p className="text-xl mb-8 text-blue-200">
                                Discover our exclusive range of electronics, fashion, and more. Shop now and enjoy
                                amazing discounts!
                            </p>
                            <div href="/register" className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => Navigate("/auth", { state: { tab: "register" } })}
                                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                    Join Now
                                </button>
                                <button
                                    onClick={() => Navigate("/auth", { state: { tab: "login" } })}
                                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                                    Log-in
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src={hero1}
                                alt="Hero Product"
                                className="w-full h-auto rounded-lg shadow-2xl"
                            />
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                50% OFF
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Free Shipping</h3>
                            <p className="text-gray-300">
                                Free delivery on orders over ₹2000. Fast and reliable shipping worldwide.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Secure Payment</h3>
                            <p className="text-gray-300">
                                Your payment information is safe with our encrypted checkout process.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Easy Returns</h3>
                            <p className="text-gray-300">
                                30-day return policy. No questions asked, hassle-free returns.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
                        <p className="text-xl text-gray-300">Discover our most popular items</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-700"
                            >
                                <div className="relative">
                                    <img
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        className="w-full h-64 object-cover hover:scale-105 transition-transform"
                                    />
                                    <button className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-colors">
                                        <ShoppingCart className="h-5 w-5 text-gray-300" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400 ml-2">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-white">₹{product.price}</span>
                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                ₹{product.originalPrice}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-gray-300">Join thousands of satisfied customers</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border dark:border-gray-600"
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                                <p className="font-semibold text-gray-900 dark:text-white">- {testimonial.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16 bg-blue-600 dark:bg-blue-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
                    <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
                        Get the latest deals and product updates delivered to your inbox
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
                        />
                        <button className="bg-white dark:bg-gray-200 text-blue-600 dark:text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
    )
}
