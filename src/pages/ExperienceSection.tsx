import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Plus, Trash2, Save, Calendar, Building, MapPin, Upload, FileText, X, CheckCircle, Info, AlertCircle, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { candidateService, CandidateProfile, Experience as ApiExperience } from "@/services/candidateApi";


interface DocumentFile {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: Date;
}

interface Experience {
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
    payslips: DocumentFile[];
    bankStatements: DocumentFile[];
}

const createEmptyExperience = (): Experience => ({
    id: Date.now().toString(),
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [""],
    payslips: [],
    bankStatements: [],
});

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const ExperienceSection = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const payslipInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const bankInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const [experiences, setExperiences] = useState<Experience[]>([createEmptyExperience()]);
    const [fullProfile, setFullProfile] = useState<CandidateProfile | null>(null);
    const [savedExperiences, setSavedExperiences] = useState<Experience[]>(experiences);

    // Load data from API on mount
    useEffect(() => {
        const loadExperiences = async () => {
            const userJson = localStorage.getItem("currentUser");
            if (!userJson) return;

            try {
                const user = JSON.parse(userJson);
                const profile = await candidateService.getProfile(user.email);

                if (profile) {
                    setFullProfile(profile);
                    if (profile.experiences && profile.experiences.length > 0) {
                        const mappedExperiences: Experience[] = profile.experiences.map(apiExp => ({
                            id: apiExp.id?.toString() || Math.random().toString(),
                            company: apiExp.companyName || "",
                            title: apiExp.designation || "",
                            location: "",
                            startDate: apiExp.fromDate || "",
                            endDate: apiExp.toDate || "",
                            current: !apiExp.toDate,
                            description: "",
                            achievements: [],
                            payslips: [],
                            bankStatements: []
                        }));
                        setExperiences(mappedExperiences);
                        setSavedExperiences(mappedExperiences);
                        setIsEditing(false);
                    }
                }
            } catch (error) {
                console.error("Error loading experiences from API:", error);
                const saved = localStorage.getItem("resumeExperience");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setExperiences(parsed);
                    setSavedExperiences(parsed);
                    setIsEditing(false);
                }
            }
        };
        loadExperiences();
    }, []);

    // Get user's experience level to customize labels
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isFresher = currentUser.experienceLevel === 'fresher';

    // Dynamic labels based on experience level
    const labels = {
        pageTitle: isFresher ? 'Achievements & Projects' : 'Work Experience',
        itemTitle: isFresher ? 'Achievement' : 'Experience',
        companyLabel: isFresher ? 'Organization / Project Name' : 'Company Name',
        companyPlaceholder: isFresher ? 'Personal Project, College, Organization...' : 'Google, Microsoft, etc.',
        titleLabel: isFresher ? 'Role / Achievement Title' : 'Job Title',
        titlePlaceholder: isFresher ? 'Team Lead, Winner, Developer...' : 'Senior Software Engineer',
        descriptionLabel: isFresher ? 'Description' : 'Job Description',
        descriptionPlaceholder: isFresher ? 'Describe your achievement or project...' : 'Briefly describe your role and main responsibilities...',
        achievementsLabel: isFresher ? 'Key Highlights' : 'Key Achievements & Accomplishments',
        addButtonText: isFresher ? 'Add Another Achievement' : 'Add Another Experience',
    };

    const handleInputChange = (id: string, field: keyof Experience, value: string | boolean | string[]) => {
        setExperiences((prev) =>
            prev.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        );
    };

    const handleAchievementChange = (expId: string, achIndex: number, value: string) => {
        setExperiences((prev) =>
            prev.map((exp) => {
                if (exp.id === expId) {
                    const newAchievements = [...exp.achievements];
                    newAchievements[achIndex] = value;
                    return { ...exp, achievements: newAchievements };
                }
                return exp;
            })
        );
    };

    const handleAddAchievement = (expId: string) => {
        setExperiences((prev) =>
            prev.map((exp) => {
                if (exp.id === expId) {
                    return { ...exp, achievements: [...exp.achievements, ""] };
                }
                return exp;
            })
        );
    };

    const handleRemoveAchievement = (expId: string, achIndex: number) => {
        setExperiences((prev) =>
            prev.map((exp) => {
                if (exp.id === expId && exp.achievements.length > 1) {
                    const newAchievements = exp.achievements.filter((_, i) => i !== achIndex);
                    return { ...exp, achievements: newAchievements };
                }
                return exp;
            })
        );
    };

    const handleAddExperience = () => {
        setExperiences((prev) => [...prev, createEmptyExperience()]);
    };

    const handleRemoveExperience = (id: string) => {
        if (experiences.length > 1) {
            setExperiences((prev) => prev.filter((exp) => exp.id !== id));
        }
    };

    // Document upload handlers
    const handleFileUpload = (expId: string, type: 'payslips' | 'bankStatements', files: FileList | null) => {
        if (!files) return;

        const newFiles: DocumentFile[] = Array.from(files).map(file => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
        }));

        setExperiences((prev) =>
            prev.map((exp) => {
                if (exp.id === expId) {
                    const existingFiles = type === 'payslips' ? exp.payslips : exp.bankStatements;
                    const totalFiles = existingFiles.length + newFiles.length;

                    if (type === 'payslips' && totalFiles > 3) {
                        toast({
                            title: "Upload Limit",
                            description: "You can only upload up to 3 payslips per experience.",
                            variant: "destructive",
                        });
                        return exp;
                    }

                    return {
                        ...exp,
                        [type]: [...existingFiles, ...newFiles].slice(0, type === 'payslips' ? 3 : 6),
                    };
                }
                return exp;
            })
        );

        toast({
            title: "Files Uploaded",
            description: `${newFiles.length} file(s) uploaded successfully.`,
        });
    };

    const handleRemoveFile = (expId: string, type: 'payslips' | 'bankStatements', fileId: string) => {
        setExperiences((prev) =>
            prev.map((exp) => {
                if (exp.id === expId) {
                    return {
                        ...exp,
                        [type]: exp[type].filter((f) => f.id !== fileId),
                    };
                }
                return exp;
            })
        );
    };

    const hasChanges = JSON.stringify(experiences) !== JSON.stringify(savedExperiences);

    const handleBack = () => {
        navigate("/resume");
    };

    const handleSaveClick = () => {
        if (hasChanges) {
            setShowConfirm(true);
        }
    };

    const handleConfirmSave = async () => {
        try {
            // Map frontend experiences to API format
            const apiExperiences: ApiExperience[] = experiences.map(exp => ({
                id: isNaN(parseInt(exp.id)) ? undefined : parseInt(exp.id),
                companyName: exp.company,
                designation: exp.title,
                fromDate: exp.startDate,
                toDate: exp.endDate || ""
            }));

            // Prepare payload
            const updatePayload: CandidateProfile = {
                ...(fullProfile || {
                    email: JSON.parse(localStorage.getItem("currentUser") || "{}").email || "",
                    firstName: "", lastName: "", mobile: "", summary: "", linkedin: "", website: "",
                    location: "", totalExperience: 0, currentCtc: 0, expectedCtc: 0, educations: []
                }),
                experiences: apiExperiences
            };

            await candidateService.updateProfile(updatePayload);

            setSavedExperiences(experiences);
            setIsEditing(false);
            setShowConfirm(false);

            // Save to localStorage
            localStorage.setItem("resumeExperience", JSON.stringify(experiences));
            localStorage.setItem("resumeExperienceComplete", "true");

            toast({
                title: "Experience Saved",
                description: "Your work history has been synced with the backend.",
            });
        } catch (error) {
            console.error("Failed to save experiences:", error);
            toast({
                title: "Save Failed",
                description: "Failed to sync with backend. Saved locally instead.",
                variant: "destructive",
            });

            setSavedExperiences(experiences);
            setIsEditing(false);
            setShowConfirm(false);
            localStorage.setItem("resumeExperience", JSON.stringify(experiences));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{labels.pageTitle}</h1>
                    </div>
                    {isEditing ? (
                        <button
                            onClick={handleSaveClick}
                            disabled={!hasChanges}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${hasChanges
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Onboarding Info Banner */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-5 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">📋 Why We Need Employment Documents</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                To ensure a smooth onboarding experience with your new company, employers typically require verification of your previous employment. These documents help:
                            </p>
                            <ul className="text-sm text-slate-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Payslips:</strong> Verify your salary history for accurate compensation benchmarking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Bank Statements:</strong> Confirm employment duration and regular salary credits</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Faster Onboarding:</strong> Pre-uploading documents reduces offer-to-joining time by 40%</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-700">
                                    <strong>Privacy Assured:</strong> Your documents are encrypted and only shared with employers you authorize. You can redact sensitive information if needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 pb-24 space-y-6">
                {experiences.map((experience, index) => (
                    <div
                        key={experience.id}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 p-6 space-y-6 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                                    <Briefcase className="w-4 h-4 text-white" />
                                </div>
                                {labels.itemTitle} {index + 1}
                            </h3>
                            {isEditing && experiences.length > 1 && (
                                <button
                                    onClick={() => handleRemoveExperience(experience.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                            <Label className="text-sm text-slate-600 flex items-center gap-2">
                                <Building className="w-4 h-4" /> {labels.companyLabel}
                            </Label>
                            <Input
                                value={experience.company}
                                onChange={(e) => handleInputChange(experience.id, "company", e.target.value)}
                                placeholder={labels.companyPlaceholder}
                                disabled={!isEditing}
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                            />
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <Label className="text-sm text-slate-600 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {labels.titleLabel}
                            </Label>
                            <Input
                                value={experience.title}
                                onChange={(e) => handleInputChange(experience.id, "title", e.target.value)}
                                placeholder={labels.titlePlaceholder}
                                disabled={!isEditing}
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label className="text-sm text-slate-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Location
                            </Label>
                            <Input
                                value={experience.location}
                                onChange={(e) => handleInputChange(experience.id, "location", e.target.value)}
                                placeholder="San Francisco, CA or Remote"
                                disabled={!isEditing}
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                            />
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Start Date
                                    </Label>
                                    <Input
                                        type="month"
                                        value={experience.startDate}
                                        onChange={(e) => handleInputChange(experience.id, "startDate", e.target.value)}
                                        disabled={!isEditing}
                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> End Date
                                    </Label>
                                    <Input
                                        type="month"
                                        value={experience.endDate}
                                        onChange={(e) => handleInputChange(experience.id, "endDate", e.target.value)}
                                        disabled={!isEditing || experience.current}
                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={experience.current}
                                    onCheckedChange={(checked) => handleInputChange(experience.id, "current", checked)}
                                    disabled={!isEditing}
                                />
                                <Label className="text-sm text-slate-600">
                                    I currently work here
                                </Label>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <Label className="text-sm text-slate-600">
                                {labels.descriptionLabel}
                            </Label>
                            <Textarea
                                value={experience.description}
                                onChange={(e) => handleInputChange(experience.id, "description", e.target.value)}
                                placeholder={labels.descriptionPlaceholder}
                                disabled={!isEditing}
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl min-h-[80px] resize-none"
                            />
                        </div>

                        {/* Key Achievements */}
                        <div className="space-y-3">
                            <Label className="text-sm text-slate-600">
                                {labels.achievementsLabel}
                            </Label>
                            {experience.achievements.map((achievement, achIndex) => (
                                <div key={achIndex} className="flex gap-2">
                                    <div className="mt-3 text-slate-400">•</div>
                                    <Input
                                        value={achievement}
                                        onChange={(e) => handleAchievementChange(experience.id, achIndex, e.target.value)}
                                        placeholder="Use action verbs: Led, Increased, Developed..."
                                        disabled={!isEditing}
                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl flex-1"
                                    />
                                    {isEditing && experience.achievements.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveAchievement(experience.id, achIndex)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {isEditing && (
                                <button
                                    onClick={() => handleAddAchievement(experience.id)}
                                    className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Achievement
                                </button>
                            )}
                        </div>

                        {/* Document Upload Section */}
                        <div className="border-t border-slate-200 pt-6 space-y-5">
                            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Employment Verification Documents
                            </h4>

                            {/* Payslips Upload */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm text-slate-600 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-green-600" />
                                        Last 3 Months Payslips
                                        <span className="text-xs text-slate-400">(PDF, JPG, PNG - Max 5MB each)</span>
                                    </Label>
                                    <span className="text-xs text-slate-500">
                                        {experience.payslips.length}/3 uploaded
                                    </span>
                                </div>

                                {/* Uploaded Payslips */}
                                {experience.payslips.length > 0 && (
                                    <div className="space-y-2">
                                        {experience.payslips.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <FileText className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleRemoveFile(experience.id, 'payslips', file.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {isEditing && experience.payslips.length < 3 && (
                                    <>
                                        <input
                                            type="file"
                                            ref={(el) => payslipInputRefs.current[experience.id] = el}
                                            onChange={(e) => handleFileUpload(experience.id, 'payslips', e.target.files)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            multiple
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => payslipInputRefs.current[experience.id]?.click()}
                                            className="w-full py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 font-medium flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload Payslip
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Bank Statements Upload */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm text-slate-600 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-purple-600" />
                                        Bank Statement (Last 3-6 Months)
                                        <span className="text-xs text-slate-400">(PDF only - Max 10MB)</span>
                                    </Label>
                                    <span className="text-xs text-slate-500">
                                        {experience.bankStatements.length}/2 uploaded
                                    </span>
                                </div>

                                {/* Uploaded Bank Statements */}
                                {experience.bankStatements.length > 0 && (
                                    <div className="space-y-2">
                                        {experience.bankStatements.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <FileText className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleRemoveFile(experience.id, 'bankStatements', file.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {isEditing && experience.bankStatements.length < 2 && (
                                    <>
                                        <input
                                            type="file"
                                            ref={(el) => bankInputRefs.current[experience.id] = el}
                                            onChange={(e) => handleFileUpload(experience.id, 'bankStatements', e.target.files)}
                                            accept=".pdf"
                                            multiple
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => bankInputRefs.current[experience.id]?.click()}
                                            className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-medium flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload Bank Statement
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Document Tips */}
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    💡 <strong>Tips:</strong> Ensure payslips clearly show company name, your name, salary details, and month/year.
                                    For bank statements, salary credit entries should be visible. You may redact other transactions for privacy.
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Experience Button */}
                {isEditing && (
                    <button
                        onClick={handleAddExperience}
                        className="w-full py-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors bg-white/50"
                    >
                        <Plus className="w-5 h-5" />
                        {labels.addButtonText}
                    </button>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Save Experience Changes"
                description="Are you sure you want to save your work experience? This will update your resume and uploaded documents."
                onConfirm={handleConfirmSave}
            />
        </div>
    );
};

export default ExperienceSection;

