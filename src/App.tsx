import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Candidate Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResumeBuilder from "./pages/ResumeBuilder";
import ProfileSection from "./pages/ProfileSection";
import EducationSection from "./pages/EducationSection";
import ExperienceSection from "./pages/ExperienceSection";
import ResumeATSOptimization from "./pages/ResumeATSOptimization";
import JDMatcher from "./pages/JDMatcher";
import Interview from "./pages/Interview";
import PracticeInterview from "./pages/PracticeInterview";
import ConnectTrainers from "./pages/ConnectTrainers";
import PaymentPage from "./pages/PaymentPage";
import JobTracker from "./pages/JobTracker";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ExperienceLevelSelection from "./pages/ExperienceLevelSelection";
import FresherSection from "./pages/FresherSection";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    {/* Landing & Auth */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Profile Setup */}
                    <Route path="/experience-level" element={<ExperienceLevelSelection />} />
                    <Route path="/fresher-profile" element={<FresherSection />} />

                    {/* Resume Builder */}
                    <Route path="/resume" element={<ResumeBuilder />} />
                    <Route path="/resume/profile" element={<ProfileSection />} />
                    <Route path="/resume/education" element={<EducationSection />} />
                    <Route path="/resume/experience" element={<ExperienceSection />} />
                    <Route path="/resume/ats-optimization" element={<ResumeATSOptimization />} />

                    {/* JD Matching */}
                    <Route path="/jd-match" element={<JDMatcher />} />

                    {/* Interview Preparation */}
                    <Route path="/interview" element={<Interview />} />
                    <Route path="/interview/practice" element={<PracticeInterview />} />
                    <Route path="/interview/trainers" element={<ConnectTrainers />} />
                    <Route path="/interview/payment" element={<PaymentPage />} />

                    {/* Job Tracking */}
                    <Route path="/tracker" element={<JobTracker />} />

                    {/* Profile */}
                    <Route path="/profile" element={<Profile />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
