import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { loginRequest, loginSuccess, registerRequest } from "./authSlice.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

export default function AuthPage() {
    const location = useLocation();
    const initialTab = location.state?.tab || "login";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const { loading, error, user, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        document.documentElement.classList.add("dark")
    }, [])

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


   useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        if (user.role === "Seller") {
            navigate("/sellerproducts");
        } else {
            navigate("/products");
        }
    }
}, [navigate]);


    // Login form state
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    })

    // Register form state
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role:"",
    })

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        dispatch(loginRequest(loginData));

    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        // Enhanced validation
        if (!registerData.username || !registerData.email || !registerData.password) {
            alert("Please fill in all required fields");
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (registerData.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        const payload = {
            username: registerData.username.trim(),
            email: registerData.email.trim().toLowerCase(),
            password: registerData.password,
            role: registerData.role
        };

        // Debug logging
        console.log("Sending registration payload:", payload);

        dispatch(registerRequest(payload));
    }

    // Display error if it exists
    useEffect(() => {
        if (error) {
            console.error("Auth error:", error);
            alert(`Error: ${error}`);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <User className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to E-com</h1>
                    <p className="text-gray-400">Sign in to your account or create a new one</p>
                </div>

                {/* Auth Card */}
                <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === "login"
                                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/20"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === "register"
                                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/20"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {/* Error Display */}
                        {error && activeTab === "login" && (
                            <div className="mb-2 text-red-400 text-sm font-semibold text-center">
                                {error === "Invalid username or password" || error === "Unauthorized" || error === "401"
                                    ? "Invalid username or password"
                                    : error}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
                                <p className="text-blue-400 text-sm">Processing...</p>
                            </div>
                        )}

                        {activeTab === "login" ? (
                            /* Login Form */
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={loginData.username}
                                            onChange={handleLoginChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
  <label className="block text-sm font-medium text-gray-300 mb-2">Select Role *</label>
  <div className="relative">
    <select
      name="role"
      value={registerData.role}
      onChange={handleRegisterChange}
      required
      className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
    >
      <option value="" disabled>Select role</option>
      <option value="Customer">Customer</option>
      <option value="Seller">Seller</option>
    </select>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <User className="h-5 w-5 text-gray-400" />
    </div>
  </div>
</div>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>

                                <div className="text-center">
                                    <span className="text-gray-400">Don't have an account? </span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("register")}
                                        className="text-blue-400 hover:text-blue-500 font-medium"
                                    >
                                        Sign up here
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Register Form */
                            <form onSubmit={handleRegisterSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Username *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={registerData.username}
                                            onChange={handleRegisterChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                                            placeholder="Enter your username"
                                            required
                                            minLength="3"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerData.email}
                                            onChange={handleRegisterChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                                            placeholder="Create a password"
                                            required
                                            minLength="6"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={registerData.confirmPassword}
                                            onChange={handleRegisterChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>

                                <div className="text-center">
                                    <span className="text-gray-400">Already have an account? </span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("login")}
                                        className="text-blue-400 hover:text-blue-500 font-medium"
                                    >
                                        Sign in here
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <a href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to E-com
                    </a>
                </div>
            </div>
        </div>
    )
}