import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Mail, Lock, Phone, Eye, EyeOff, Github, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MockOAuthService } from "@/lib/mockOAuth";

// Mock user database - in real app this comes from backend
const mockUserDatabase: Record<string, { password: string; name: string; role: string; email: string; experienceLevel?: string }> = {
  // Candidates - Experienced
  "candidate@email.com": { password: "password123", name: "Alex Johnson", role: "candidate", email: "candidate@email.com", experienceLevel: "experienced" },
  "9876543210": { password: "password123", name: "Alex Johnson", role: "candidate", email: "candidate@email.com", experienceLevel: "experienced" },

  // Candidates - Fresher
  "fresher@email.com": { password: "password123", name: "Sarah Williams", role: "candidate", email: "fresher@email.com", experienceLevel: "fresher" },
  "9876543220": { password: "password123", name: "Sarah Williams", role: "candidate", email: "fresher@email.com", experienceLevel: "fresher" },

  // Recruiters
  "recruiter@company.com": { password: "recruiter123", name: "John Recruiter", role: "recruiter", email: "recruiter@company.com" },
  "9876543213": { password: "recruiter123", name: "John Recruiter", role: "recruiter", email: "recruiter@company.com" },
  "sarah.recruiter@company.com": { password: "recruiter123", name: "Sarah Recruiter", role: "recruiter", email: "sarah.recruiter@company.com" },

  // TAs (Talent Acquisition)
  "john@company.com": { password: "ta123", name: "John Doe", role: "ta", email: "john@company.com" },
  "9876543211": { password: "ta123", name: "John Doe", role: "ta", email: "john@company.com" },
  "sarah@company.com": { password: "ta123", name: "Sarah Smith", role: "ta", email: "sarah@company.com" },

  // HR Manager
  "hr@company.com": { password: "hr123", name: "HR Manager", role: "hrms", email: "hr@company.com" },
  "9876543212": { password: "hr123", name: "HR Manager", role: "hrms", email: "hr@company.com" },

  // CTO
  "cto@company.com": { password: "cto123", name: "Tech Leader", role: "cto", email: "cto@company.com" },

  // CEO
  "ceo@company.com": { password: "ceo123", name: "Company CEO", role: "ceo", email: "ceo@company.com" },
};

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // All app logins are for candidates
        const role = 'candidate';

        // Store user data
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
          email: session.user.email || '',
          role: role,
          avatar: session.user.app_metadata.avatar_url,
          provider: session.user.app_metadata.provider
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));

        toast.success(`Welcome ${userData.name}!`);

        // For OAuth users, ask them to select experience level (first time)
        // Since we don't have their experience level from registration
        navigate("/experience-level");
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Look up user in mock database
    const user = mockUserDatabase[identifier.toLowerCase().trim()];

    if (!user) {
      setError("Account not found. Please check your email/phone.");
      setIsLoading(false);
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: identifier,
      name: user.name,
      email: user.email,
      role: user.role,
      experienceLevel: user.experienceLevel || 'experienced' // Default to experienced if not set
    }));

    toast.success(`Welcome back, ${user.name}!`);

    // Navigate based on role
    if (user.role === 'recruiter') {
      navigate("/recruiter/dashboard");
    } else if (user.role === 'candidate') {
      // Both fresher and experienced users go to the same /resume flow
      // The individual sections will show different content based on experienceLevel
      navigate("/resume");
    } else {
      navigate("/resume");
    }

    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        toast.error(`Failed to login with ${provider}: ${error.message}`);
        console.error('OAuth Error:', error);
      }
    } catch (err) {
      toast.error('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login that bypasses Supabase - for testing when Supabase is unavailable
  const handleDemoLogin = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    try {
      setIsLoading(true);
      toast.info(`Logging in with ${provider} (Demo Mode)...`);

      const { data, error: mockError } = await MockOAuthService.signInWithOAuth(provider);

      if (mockError || !data.user) {
        throw new Error('Demo login failed');
      }

      // Store user data
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'candidate',
        avatar: data.user.avatar,
        provider: data.user.provider
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));

      toast.success(`Welcome ${userData.name}! (Demo Mode)`);

      // Navigate to candidate dashboard
      navigate("/resume");
    } catch (err) {
      toast.error('Demo login failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />

          <div className="relative">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">QuickOnboard AI</h1>
              <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email/Phone Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {identifier.match(/^\d+$/) ? (
                      <Phone className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Mail className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="email@company.com or 9876543210"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-blue-600 text-sm font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons with Demo Options */}
            <div className="space-y-3">
              {/* Google */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDemoLogin('google')}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-700">Google</span>
                </button>
              </div>

              {/* LinkedIn */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDemoLogin('linkedin_oidc')}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  <span className="text-sm font-semibold text-blue-700">LinkedIn</span>
                </button>
              </div>

              {/* GitHub */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDemoLogin('github')}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Github className="w-5 h-5 text-slate-800" />
                  <span className="text-sm font-semibold text-gray-700">GitHub</span>
                </button>
              </div>


            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
