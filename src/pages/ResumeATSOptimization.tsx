import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Target,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileSearch,
    Sparkles,
    TrendingUp,
    Lightbulb,
    Copy,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Zap,
    Award,
    FileText,
    Search,
    Shield,
    Upload,
    Crown,
    Lock,
    Check,
    Star,
    Wand2,
    X,
    FileUp,
    BarChart2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface KeywordMatch {
    keyword: string;
    found: boolean;
    count: number;
    importance: "high" | "medium" | "low";
}

interface FormattingCheck {
    id: string;
    label: string;
    status: "pass" | "fail" | "warning";
    description: string;
    fix?: string;
}

interface Suggestion {
    id: string;
    category: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    actionText: string;
    isPremium?: boolean;
}

interface UploadedResume {
    name: string;
    size: number;
    uploadedAt: Date;
}

const ATSOptimization = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(["score", "keywords", "formatting"]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Premium Plan State
    const [isPremium] = useState(false); // Toggle this to test premium vs free
    const [modificationsUsed] = useState(23);
    const [modificationsLimit] = useState(50);
    const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Mock ATS Score Data
    const [atsScore] = useState(72);
    const [keywordMatches] = useState<KeywordMatch[]>([
        { keyword: "React", found: true, count: 5, importance: "high" },
        { keyword: "TypeScript", found: true, count: 3, importance: "high" },
        { keyword: "Node.js", found: true, count: 2, importance: "high" },
        { keyword: "AWS", found: false, count: 0, importance: "high" },
        { keyword: "CI/CD", found: false, count: 0, importance: "medium" },
        { keyword: "Agile", found: true, count: 1, importance: "medium" },
        { keyword: "REST API", found: true, count: 2, importance: "medium" },
        { keyword: "Docker", found: false, count: 0, importance: "medium" },
        { keyword: "Git", found: true, count: 1, importance: "low" },
        { keyword: "Problem Solving", found: true, count: 1, importance: "low" },
    ]);

    const [formattingChecks] = useState<FormattingCheck[]>([
        {
            id: "1",
            label: "Standard File Format",
            status: "pass",
            description: "Resume is in a parseable format (PDF/DOCX)",
        },
        {
            id: "2",
            label: "No Tables or Columns",
            status: "pass",
            description: "Content is in single-column format for easy parsing",
        },
        {
            id: "3",
            label: "Standard Section Headers",
            status: "pass",
            description: "Using recognizable headers like 'Experience', 'Education'",
        },
        {
            id: "4",
            label: "Contact Information",
            status: "pass",
            description: "Email and phone number are properly formatted",
        },
        {
            id: "5",
            label: "No Graphics or Images",
            status: "warning",
            description: "Profile photo detected - some ATS may skip images",
            fix: "Consider removing or placing photo in header",
        },
        {
            id: "6",
            label: "Font Compatibility",
            status: "pass",
            description: "Using ATS-friendly fonts (Arial, Calibri, etc.)",
        },
        {
            id: "7",
            label: "Bullet Point Format",
            status: "warning",
            description: "Some special characters detected in bullet points",
            fix: "Use standard bullet points (•) instead of custom symbols",
        },
        {
            id: "8",
            label: "Date Format Consistency",
            status: "fail",
            description: "Inconsistent date formats found (MM/YYYY vs Month YYYY)",
            fix: "Standardize all dates to 'Month YYYY' format",
        },
    ]);

    const [suggestions] = useState<Suggestion[]>([
        {
            id: "1",
            category: "Keywords",
            title: "Add Missing High-Priority Keywords",
            description: "Include 'AWS' and 'Docker' in your skills or experience sections to match job requirements.",
            impact: "high",
            actionText: "Add to Skills",
        },
        {
            id: "2",
            category: "AI Auto-Match",
            title: "Auto-Inject Missing Keywords",
            description: "Let AI automatically add missing keywords to relevant sections of your resume.",
            impact: "high",
            actionText: "Auto-Fix with AI",
            isPremium: true,
        },
        {
            id: "3",
            category: "Experience",
            title: "Quantify Your Achievements",
            description: "Add metrics to your accomplishments. E.g., 'Improved performance by 40%' instead of 'Improved performance'.",
            impact: "high",
            actionText: "Edit Experience",
        },
        {
            id: "4",
            category: "AI Rewrite",
            title: "AI-Powered Content Enhancement",
            description: "Automatically rewrite your experience bullets using action verbs and quantified metrics.",
            impact: "high",
            actionText: "Enhance with AI",
            isPremium: true,
        },
        {
            id: "5",
            category: "Format",
            title: "Standardize Date Formats",
            description: "Change all dates to consistent 'Month YYYY' format for better ATS parsing.",
            impact: "medium",
            actionText: "Fix Dates",
        },
        {
            id: "6",
            category: "Skills",
            title: "Add CI/CD Experience",
            description: "Mention any experience with Jenkins, GitHub Actions, or other CI/CD tools.",
            impact: "medium",
            actionText: "Add to Skills",
        },
    ]);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) =>
            prev.includes(section)
                ? prev.filter((s) => s !== section)
                : [...prev, section]
        );
    };

    const handleResumeUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a PDF or Word document (.doc, .docx)",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please upload a file smaller than 5MB",
                variant: "destructive",
            });
            return;
        }

        setUploadedResume({
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
        });

        toast({
            title: "Resume Uploaded",
            description: "Your resume has been uploaded successfully.",
        });
    };

    const handleRemoveResume = () => {
        setUploadedResume(null);
        setHasAnalyzed(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAnalyze = () => {
        if (!uploadedResume) {
            toast({
                title: "Resume Required",
                description: "Please upload your resume to analyze.",
                variant: "destructive",
            });
            return;
        }

        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setHasAnalyzed(true);
            toast({
                title: "Analysis Complete",
                description: "Your resume has been analyzed for ATS compatibility.",
            });
        }, 2500);
    };

    const handlePremiumAction = (action: string) => {
        if (!isPremium) {
            setShowPremiumModal(true);
            return;
        }

        if (modificationsUsed >= modificationsLimit) {
            toast({
                title: "Monthly Limit Reached",
                description: "You've used all 50 AI modifications this month. Limit resets on the 1st.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "AI Processing",
            description: `${action} - This would use 1 of your ${modificationsLimit - modificationsUsed} remaining modifications.`,
        });
    };

    const handleCopyKeywords = () => {
        const missingKeywords = keywordMatches
            .filter((k) => !k.found)
            .map((k) => k.keyword)
            .join(", ");
        navigator.clipboard.writeText(missingKeywords);
        toast({
            title: "Copied to Clipboard",
            description: "Missing keywords have been copied.",
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-amber-500";
        return "text-red-500";
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return "from-green-500 to-emerald-600";
        if (score >= 60) return "from-amber-500 to-orange-600";
        return "from-red-500 to-rose-600";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Needs Improvement";
        return "Poor";
    };

    const getImpactBadge = (impact: string) => {
        switch (impact) {
            case "high":
                return "bg-red-100 text-red-700 border-red-200";
            case "medium":
                return "bg-amber-100 text-amber-700 border-amber-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const passedChecks = formattingChecks.filter((c) => c.status === "pass").length;
    const matchedKeywords = keywordMatches.filter((k) => k.found).length;
    const usagePercentage = (modificationsUsed / modificationsLimit) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/resume")}
                            className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Resume Optimization
                            </h1>
                            <p className="text-xs text-slate-500">AI-powered ATS score booster</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isPremium ? (
                            <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                                <Crown className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs font-semibold text-white">Premium</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowPremiumModal(true)}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center gap-1.5 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs font-semibold text-white">Upgrade</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
                {/* Usage Limit Card - Premium Only */}
                {isPremium && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-4 animate-fade-in">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-600" />
                                <span className="font-semibold text-slate-800">AI Modifications</span>
                            </div>
                            <span className="text-sm font-medium text-slate-600">
                                {modificationsUsed}/{modificationsLimit} used this month
                            </span>
                        </div>
                        <Progress value={usagePercentage} className="h-2.5 bg-amber-100" />
                        <p className="text-xs text-slate-500 mt-2">
                            Resets on 1st of each month • {modificationsLimit - modificationsUsed} modifications remaining
                        </p>
                    </div>
                )}

                {/* Resume Upload Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 p-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                            <FileUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Upload Your Resume</h3>
                            <p className="text-sm text-slate-500">PDF or Word document (Max 5MB)</p>
                        </div>
                    </div>

                    {uploadedResume ? (
                        <div className="border-2 border-green-200 bg-green-50/50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 truncate max-w-[200px]">
                                            {uploadedResume.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {formatFileSize(uploadedResume.size)} • Uploaded just now
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveResume}
                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add("border-indigo-500", "bg-indigo-50");
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");
                                handleResumeUpload(e.dataTransfer.files);
                            }}
                            className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={(e) => handleResumeUpload(e.target.files)}
                            />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-indigo-100 rounded-full">
                                    <Upload className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-700">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        PDF, DOC, DOCX (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Description - Optional */}
                    <div className="mt-5">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                            <FileSearch className="w-4 h-4" />
                            Target Job Description
                            <span className="text-xs text-slate-400">(Optional - for better matching)</span>
                        </Label>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description to get personalized keyword optimization..."
                            className="min-h-[100px] border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl resize-none"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !uploadedResume}
                        className="mt-4 w-full py-3.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Analyzing Resume...
                            </>
                        ) : (
                            <>
                                <BarChart2 className="w-5 h-5" />
                                Analyze ATS Score
                            </>
                        )}
                    </button>
                </div>

                {hasAnalyzed && (
                    <>
                        {/* ATS Score Card */}
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <button
                                onClick={() => toggleSection("score")}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-800">ATS Compatibility Score</h3>
                                        <p className="text-sm text-slate-500">Overall resume optimization rating</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
                                        {atsScore}%
                                    </div>
                                    {expandedSections.includes("score") ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </button>

                            {expandedSections.includes("score") && (
                                <div className="px-6 pb-6 space-y-6 border-t border-slate-100">
                                    {/* Circular Score Display */}
                                    <div className="flex items-center justify-center pt-6">
                                        <div className="relative w-44 h-44">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="88"
                                                    cy="88"
                                                    r="78"
                                                    fill="none"
                                                    stroke="#e2e8f0"
                                                    strokeWidth="12"
                                                />
                                                <circle
                                                    cx="88"
                                                    cy="88"
                                                    r="78"
                                                    fill="none"
                                                    stroke="url(#scoreGradient)"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(atsScore / 100) * 490} 490`}
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                                <defs>
                                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor={atsScore >= 60 ? "#8b5cf6" : "#ef4444"} />
                                                        <stop offset="100%" stopColor={atsScore >= 60 ? "#a855f7" : "#f87171"} />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
                                                    {atsScore}
                                                </span>
                                                <span className="text-sm text-slate-500 font-medium">out of 100</span>
                                                <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${getScoreGradient(atsScore)} text-white`}>
                                                    {getScoreLabel(atsScore)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Breakdown */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                                            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="text-2xl font-bold text-green-600">{matchedKeywords}</div>
                                            <div className="text-xs text-slate-600">Keywords Found</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
                                            <div className="w-10 h-10 mx-auto mb-2 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div className="text-2xl font-bold text-indigo-600">{passedChecks}/{formattingChecks.length}</div>
                                            <div className="text-xs text-slate-600">Format Checks</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                                            <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                                                <Lightbulb className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="text-2xl font-bold text-amber-600">{suggestions.length}</div>
                                            <div className="text-xs text-slate-600">Suggestions</div>
                                        </div>
                                    </div>

                                    {/* AI Auto-Fix Button - Premium */}
                                    <button
                                        onClick={() => handlePremiumAction("Auto-fix all issues")}
                                        className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isPremium
                                            ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/30"
                                            : "bg-slate-100 text-slate-600 border-2 border-dashed border-slate-300"
                                            }`}
                                    >
                                        {isPremium ? (
                                            <>
                                                <Wand2 className="w-5 h-5" />
                                                Auto-Fix All Issues with AI
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                Unlock AI Auto-Fix (Premium)
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Keyword Analysis */}
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-in"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <button
                                onClick={() => toggleSection("keywords")}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                                        <Search className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-800">Keyword Analysis</h3>
                                        <p className="text-sm text-slate-500">{matchedKeywords} of {keywordMatches.length} keywords matched</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Progress value={(matchedKeywords / keywordMatches.length) * 100} className="w-20 h-2" />
                                    {expandedSections.includes("keywords") ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </button>

                            {expandedSections.includes("keywords") && (
                                <div className="px-6 pb-6 space-y-4 border-t border-slate-100">
                                    {/* Found Keywords */}
                                    <div className="pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="text-sm font-medium text-green-700 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Found in Resume ({keywordMatches.filter(k => k.found).length})
                                            </Label>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {keywordMatches
                                                .filter((k) => k.found)
                                                .map((keyword) => (
                                                    <span
                                                        key={keyword.keyword}
                                                        className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200 flex items-center gap-1.5"
                                                    >
                                                        {keyword.keyword}
                                                        <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full">
                                                            ×{keyword.count}
                                                        </span>
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Missing Keywords */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="text-sm font-medium text-red-700 flex items-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Missing Keywords ({keywordMatches.filter(k => !k.found).length})
                                            </Label>
                                            <button
                                                onClick={handleCopyKeywords}
                                                className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Copy All
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {keywordMatches
                                                .filter((k) => !k.found)
                                                .map((keyword) => (
                                                    <span
                                                        key={keyword.keyword}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-1.5 ${keyword.importance === "high"
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : keyword.importance === "medium"
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-slate-50 text-slate-600 border-slate-200"
                                                            }`}
                                                    >
                                                        {keyword.keyword}
                                                        {keyword.importance === "high" && (
                                                            <Zap className="w-3 h-3" />
                                                        )}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    {/* AI Auto Add Keywords - Premium */}
                                    <button
                                        onClick={() => handlePremiumAction("Auto-add missing keywords")}
                                        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isPremium
                                            ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg"
                                            : "bg-slate-100 text-slate-500 border border-slate-200"
                                            }`}
                                    >
                                        {isPremium ? (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                AI Auto-Add Missing Keywords
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                AI Auto-Add (Premium Only)
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Formatting Checks */}
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <button
                                onClick={() => toggleSection("formatting")}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-500/20">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-800">ATS Formatting Checks</h3>
                                        <p className="text-sm text-slate-500">{passedChecks} of {formattingChecks.length} checks passed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-1">
                                        {formattingChecks.slice(0, 5).map((check) => (
                                            <div
                                                key={check.id}
                                                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${check.status === "pass"
                                                    ? "bg-green-100"
                                                    : check.status === "warning"
                                                        ? "bg-amber-100"
                                                        : "bg-red-100"
                                                    }`}
                                            >
                                                {check.status === "pass" ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                                ) : check.status === "warning" ? (
                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                                ) : (
                                                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {expandedSections.includes("formatting") ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </button>

                            {expandedSections.includes("formatting") && (
                                <div className="px-6 pb-6 space-y-3 border-t border-slate-100 pt-4">
                                    {formattingChecks.map((check) => (
                                        <div
                                            key={check.id}
                                            className={`p-4 rounded-xl border ${check.status === "pass"
                                                ? "bg-green-50/50 border-green-200/50"
                                                : check.status === "warning"
                                                    ? "bg-amber-50/50 border-amber-200/50"
                                                    : "bg-red-50/50 border-red-200/50"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`p-1.5 rounded-lg ${check.status === "pass"
                                                        ? "bg-green-100"
                                                        : check.status === "warning"
                                                            ? "bg-amber-100"
                                                            : "bg-red-100"
                                                        }`}
                                                >
                                                    {check.status === "pass" ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    ) : check.status === "warning" ? (
                                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-slate-800">{check.label}</h4>
                                                        <span
                                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${check.status === "pass"
                                                                ? "bg-green-100 text-green-700"
                                                                : check.status === "warning"
                                                                    ? "bg-amber-100 text-amber-700"
                                                                    : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {check.status === "pass" ? "Passed" : check.status === "warning" ? "Warning" : "Failed"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-1">{check.description}</p>
                                                    {check.fix && (
                                                        <div className="mt-2 p-2 bg-white/70 rounded-lg border border-slate-200">
                                                            <p className="text-xs text-slate-700">
                                                                <strong>💡 Fix:</strong> {check.fix}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Improvement Suggestions */}
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 overflow-hidden animate-fade-in"
                            style={{ animationDelay: "0.4s" }}
                        >
                            <button
                                onClick={() => toggleSection("suggestions")}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
                                        <Lightbulb className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-800">Improvement Suggestions</h3>
                                        <p className="text-sm text-slate-500">{suggestions.filter(s => s.impact === 'high').length} high-impact improvements</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                        {suggestions.length} Tips
                                    </span>
                                    {expandedSections.includes("suggestions") ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </button>

                            {expandedSections.includes("suggestions") && (
                                <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={suggestion.id}
                                            className={`p-4 rounded-xl border transition-shadow ${suggestion.isPremium && !isPremium
                                                ? "bg-gradient-to-br from-violet-50/50 to-purple-50/50 border-violet-200/50"
                                                : "bg-gradient-to-br from-slate-50 to-white border-slate-200/50 hover:shadow-md"
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md ${suggestion.isPremium
                                                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                                    : "bg-gradient-to-br from-violet-500 to-purple-600"
                                                    }`}>
                                                    {suggestion.isPremium ? <Crown className="w-4 h-4" /> : index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                                                    {suggestion.category}
                                                                </span>
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getImpactBadge(suggestion.impact)}`}>
                                                                    {suggestion.impact === "high" ? "⚡ High Impact" : suggestion.impact === "medium" ? "Medium" : "Low"}
                                                                </span>
                                                                {suggestion.isPremium && (
                                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                                                                        ✨ Premium
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="font-semibold text-slate-800">{suggestion.title}</h4>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-2">{suggestion.description}</p>
                                                    <button
                                                        onClick={() => {
                                                            if (suggestion.isPremium) {
                                                                handlePremiumAction(suggestion.actionText);
                                                            } else {
                                                                if (suggestion.category === "Keywords" || suggestion.category === "Skills") {
                                                                    navigate("/resume/skills");
                                                                } else if (suggestion.category === "Experience") {
                                                                    navigate("/resume/experience");
                                                                } else if (suggestion.category === "Summary") {
                                                                    navigate("/resume/profile");
                                                                }
                                                            }
                                                        }}
                                                        className={`mt-3 text-sm font-medium flex items-center gap-1 hover:underline ${suggestion.isPremium && !isPremium
                                                            ? "text-amber-600"
                                                            : "text-violet-600"
                                                            }`}
                                                    >
                                                        {suggestion.isPremium && !isPremium ? (
                                                            <>
                                                                <Lock className="w-3.5 h-3.5" />
                                                                Unlock Feature
                                                            </>
                                                        ) : (
                                                            <>
                                                                {suggestion.actionText}
                                                                <TrendingUp className="w-3.5 h-3.5" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Pro Tips Card */}
                <div
                    className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/25 animate-fade-in"
                    style={{ animationDelay: "0.5s" }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg">Pro Tips for ATS Success</h3>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold">1</span>
                            </div>
                            <p className="text-sm text-white/90">
                                <strong>Mirror job description language</strong> - Use the exact phrases from the job posting
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold">2</span>
                            </div>
                            <p className="text-sm text-white/90">
                                <strong>Include acronyms and full forms</strong> - E.g., "Search Engine Optimization (SEO)"
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold">3</span>
                            </div>
                            <p className="text-sm text-white/90">
                                <strong>Avoid fancy formatting</strong> - Use simple, single-column layouts
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Premium Modal */}
            {showPremiumModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Upgrade to Premium</h2>
                            <p className="text-slate-500 mt-2">Unlock AI-powered resume optimization</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                                <Check className="w-5 h-5 text-violet-600" />
                                <span className="text-sm text-slate-700">AI Auto-Keyword Matcher</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                                <Check className="w-5 h-5 text-violet-600" />
                                <span className="text-sm text-slate-700">50 AI Modifications per month</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                                <Check className="w-5 h-5 text-violet-600" />
                                <span className="text-sm text-slate-700">One-click ATS optimization</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                                <Check className="w-5 h-5 text-violet-600" />
                                <span className="text-sm text-slate-700">AI content rewriting & enhancement</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                                <Check className="w-5 h-5 text-violet-600" />
                                <span className="text-sm text-slate-700">Priority job matching</span>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-slate-800">₹499</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Cancel anytime</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setShowPremiumModal(false);
                                    toast({
                                        title: "Coming Soon!",
                                        description: "Premium subscriptions will be available soon.",
                                    });
                                }}
                                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Star className="w-5 h-5" />
                                Upgrade Now
                            </button>
                            <button
                                onClick={() => setShowPremiumModal(false)}
                                className="w-full py-3 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ATSOptimization;
