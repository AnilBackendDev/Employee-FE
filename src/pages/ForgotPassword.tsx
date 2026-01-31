import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Phone, ArrowLeft, CheckCircle, Lock, Eye, EyeOff, Shield } from "lucide-react";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Enter Phone, 2: Verify OTP, 3: Reset Password
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phone.match(/^\d{10}$/)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock OTP verification (use 123456)
        if (enteredOtp === "123456") {
            setStep(3);
            setError("");
        } else {
            setError("Invalid OTP. Please try again. (Demo: 123456)");
        }
        setIsLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Success - redirect to login
        navigate("/login", { state: { message: "Password reset successfully! Please login with your new password." } });
    };

    const resendOTP = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setIsLoading(false);
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Forgot Password?";
            case 2: return "Verify OTP";
            case 3: return "Reset Password";
            default: return "";
        }
    };

    const getStepSubtitle = () => {
        switch (step) {
            case 1: return "Enter your registered mobile number to receive OTP";
            case 2: return `Enter the 6-digit code sent to +91 ${phone}`;
            case 3: return "Create a new secure password for your account";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />

                    <div className="relative">
                        {/* Back Button */}
                        <Link
                            to={step === 1 ? "/login" : "#"}
                            onClick={(e) => {
                                if (step > 1) {
                                    e.preventDefault();
                                    setStep(step - 1);
                                    setError("");
                                }
                            }}
                            className="absolute -top-2 left-0 flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back</span>
                        </Link>

                        {/* Progress Indicator */}
                        <div className="flex justify-center mb-6 mt-4">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${s === step
                                                ? "w-8 bg-gradient-to-r from-blue-500 to-indigo-500"
                                                : s < step
                                                    ? "bg-green-500"
                                                    : "bg-slate-200"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Logo */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30 transform hover:scale-105 transition-transform">
                                {step === 3 ? (
                                    <Shield className="w-8 h-8 text-white" />
                                ) : (
                                    <Phone className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                {getStepTitle()}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 text-center max-w-xs">
                                {getStepSubtitle()}
                            </p>
                        </div>

                        {/* Step 1: Enter Phone */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                {/* Phone Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Registered Mobile Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <div className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-slate-500 border-r border-slate-200 pr-2">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                                                setError("");
                                            }}
                                            placeholder="9876543210"
                                            maxLength={10}
                                            className="w-full pl-24 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Send OTP Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || phone.length !== 10}
                                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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
                                        "Send OTP"
                                    )}
                                </button>

                                {/* Back to Login */}
                                <p className="text-center text-sm text-slate-500">
                                    Remember your password?{" "}
                                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        )}

                        {/* Step 2: Verify OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
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
                                            Verify OTP
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

                        {/* Step 3: Reset Password */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setError("");
                                            }}
                                            placeholder="Create new password"
                                            className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setError("");
                                            }}
                                            placeholder="Confirm new password"
                                            className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
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

                                {/* Password Requirements */}
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</p>
                                    <ul className="text-xs text-blue-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <span className={newPassword.length >= 6 ? "text-green-600" : "text-slate-400"}>
                                                {newPassword.length >= 6 ? "✓" : "○"}
                                            </span>
                                            At least 6 characters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={newPassword === confirmPassword && newPassword.length > 0 ? "text-green-600" : "text-slate-400"}>
                                                {newPassword === confirmPassword && newPassword.length > 0 ? "✓" : "○"}
                                            </span>
                                            Passwords match
                                        </li>
                                    </ul>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Reset Button */}
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
                                            Resetting Password...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Shield className="w-5 h-5" />
                                            Reset Password
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
