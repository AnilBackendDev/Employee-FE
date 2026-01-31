import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Mail, Lock, Phone, Eye, EyeOff, User, ArrowLeft, CheckCircle } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: Verify OTP
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        experienceLevel: "experienced" as 'experienced' | 'fresher'
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError("Please enter your full name");
            return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!formData.phone.match(/^\d{10}$/)) {
            setError("Please enter a valid 10-digit phone number");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOtpSent(true);
        setStep(2);
        setIsLoading(false);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setIsLoading(true);
        // Simulate API verification (mock OTP: 123456)
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (enteredOtp === "123456") {
            // Store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                id: formData.email,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: "candidate",
                experienceLevel: formData.experienceLevel
            }));

            // Navigate both user types to the same resume builder flow
            navigate("/resume");
        } else {
            setError("Invalid OTP. Please try again. (Demo: 123456)");
        }
        setIsLoading(false);
    };

    const handleGoogleSignUp = () => {
        // Placeholder for Google OAuth
        console.log("Google Sign Up clicked");
        // In real implementation, integrate with Supabase/Firebase Auth
    };

    const resendOTP = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setIsLoading(false);
        // Show toast or message that OTP was resent
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Registration Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />

                    <div className="relative">
                        {/* Back Button */}
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="absolute -top-2 left-0 flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Back</span>
                            </button>
                        )}

                        {/* Logo */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
                                <Briefcase className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                {step === 1 ? "Create Account" : "Verify Your Phone"}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 text-center">
                                {step === 1
                                    ? "Join QuickOnboard AI and accelerate your career"
                                    : `Enter the 6-digit code sent to +91 ${formData.phone}`
                                }
                            </p>
                        </div>

                        {/* Step 1: Registration Form */}
                        {step === 1 && (
                            <>
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your@email.com"
                                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Mobile Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <div className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-slate-500 border-r border-slate-200 pr-2">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="9876543210"
                                                maxLength={10}
                                                className="w-full pl-24 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Experience Level Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Experience Level
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, experienceLevel: "experienced" })}
                                                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${formData.experienceLevel === "experienced"
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                                    }`}
                                            >
                                                💼 Experienced
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, experienceLevel: "fresher" })}
                                                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${formData.experienceLevel === "fresher"
                                                    ? "border-purple-500 bg-purple-50 text-purple-700"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                                    }`}
                                            >
                                                🎓 Fresher
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Create a password"
                                                className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm your password"
                                                className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
                                            {error}
                                        </div>
                                    )}

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending OTP...
                                            </span>
                                        ) : (
                                            "Continue"
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-4 text-sm text-slate-500">or sign up with</span>
                                    </div>
                                </div>

                                {/* Google Sign Up */}
                                <button
                                    onClick={handleGoogleSignUp}
                                    className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:shadow-md"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-600">Continue with Google</span>
                                </button>

                                {/* Login Link */}
                                <p className="text-center text-sm text-slate-500 mt-6">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                {/* OTP Illustration */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-10 h-10 text-green-600" />
                                    </div>
                                </div>

                                {/* OTP Input */}
                                <div className="flex justify-center gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                        />
                                    ))}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Verify & Create Account
                                        </span>
                                    )}
                                </button>

                                {/* Resend OTP */}
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 mb-2">Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        onClick={resendOTP}
                                        disabled={isLoading}
                                        className="text-blue-600 font-medium text-sm hover:underline disabled:opacity-50"
                                    >
                                        Resend OTP
                                    </button>
                                </div>

                                {/* Demo Hint */}
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm text-center">
                                    💡 Demo OTP: <span className="font-mono font-bold">123456</span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
