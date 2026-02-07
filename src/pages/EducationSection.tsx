import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, Plus, Trash2, Save, Calendar, Building, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { candidateService, CandidateProfile, Education as ApiEducation } from "@/services/candidateApi";


interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa: string;
    achievements: string;
}

const createEmptyEducation = (): Education => ({
    id: Date.now().toString(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
    achievements: "",
});

const EducationSection = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(true);

    const [educations, setEducations] = useState<Education[]>([createEmptyEducation()]);
    const [fullProfile, setFullProfile] = useState<CandidateProfile | null>(null);
    const [savedEducations, setSavedEducations] = useState<Education[]>(educations);

    // Load data from API on mount
    useEffect(() => {
        const loadEducations = async () => {
            const userJson = localStorage.getItem("currentUser");
            if (!userJson) return;

            try {
                const user = JSON.parse(userJson);
                const profile = await candidateService.getProfile(user.email);

                if (profile) {
                    setFullProfile(profile);
                    if (profile.educations && profile.educations.length > 0) {
                        const mappedEducations: Education[] = profile.educations.map(apiEdu => ({
                            id: apiEdu.id?.toString() || Math.random().toString(),
                            institution: apiEdu.institution || "",
                            degree: apiEdu.degree || "",
                            field: "", // Field isn't in backend yet
                            startDate: "",
                            endDate: apiEdu.graduationYear ? `${apiEdu.graduationYear}-05` : "",
                            current: false,
                            gpa: "",
                            achievements: ""
                        }));
                        setEducations(mappedEducations);
                        setSavedEducations(mappedEducations);
                        setIsEditing(false);
                    }
                }
            } catch (error) {
                console.error("Error loading educations from API:", error);
                const saved = localStorage.getItem("resumeEducation");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setEducations(parsed);
                    setSavedEducations(parsed);
                    setIsEditing(false);
                }
            }
        };
        loadEducations();
    }, []);

    const handleInputChange = (id: string, field: keyof Education, value: string | boolean) => {
        setEducations((prev) =>
            prev.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        );
    };

    const handleAddEducation = () => {
        setEducations((prev) => [...prev, createEmptyEducation()]);
    };

    const handleRemoveEducation = (id: string) => {
        if (educations.length > 1) {
            setEducations((prev) => prev.filter((edu) => edu.id !== id));
        }
    };

    const hasChanges = JSON.stringify(educations) !== JSON.stringify(savedEducations);

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
            // Map frontend educations to API format
            const apiEducations: ApiEducation[] = educations.map(edu => ({
                id: isNaN(parseInt(edu.id)) ? undefined : parseInt(edu.id),
                degree: edu.degree,
                institution: edu.institution,
                graduationYear: parseInt(edu.endDate.split("-")[0]) || 2024
            }));

            // Prepare payload
            const updatePayload: CandidateProfile = {
                ...(fullProfile || {
                    email: JSON.parse(localStorage.getItem("currentUser") || "{}").email || "",
                    firstName: "", lastName: "", mobile: "", summary: "", linkedin: "", website: "",
                    location: "", totalExperience: 0, currentCtc: 0, expectedCtc: 0, experiences: []
                }),
                educations: apiEducations
            };

            await candidateService.updateProfile(updatePayload);

            setSavedEducations(educations);
            setIsEditing(false);
            setShowConfirm(false);

            // Save to localStorage
            localStorage.setItem("resumeEducation", JSON.stringify(educations));
            localStorage.setItem("resumeEducationComplete", "true");

            toast({
                title: "Education Saved",
                description: "Your education history has been synced with the backend.",
            });
        } catch (error) {
            console.error("Failed to save educations:", error);
            toast({
                title: "Save Failed",
                description: "Failed to sync with backend. Saved locally instead.",
                variant: "destructive",
            });

            setSavedEducations(educations);
            setIsEditing(false);
            setShowConfirm(false);
            localStorage.setItem("resumeEducation", JSON.stringify(educations));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <h1 className="text-xl font-bold text-foreground">Education</h1>
                    </div>
                    {isEditing ? (
                        <button
                            onClick={handleSaveClick}
                            disabled={!hasChanges}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${hasChanges
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 pb-24">
                {educations.map((education, index) => (
                    <div
                        key={education.id}
                        className="card-elevated p-5 space-y-5 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                    <GraduationCap className="w-4 h-4 text-primary" />
                                </div>
                                Education {index + 1}
                            </h3>
                            {isEditing && educations.length > 1 && (
                                <button
                                    onClick={() => handleRemoveEducation(education.id)}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Institution */}
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                <Building className="w-4 h-4" /> Institution Name
                            </Label>
                            <Input
                                value={education.institution}
                                onChange={(e) => handleInputChange(education.id, "institution", e.target.value)}
                                placeholder="Stanford University"
                                disabled={!isEditing}
                                className="input-field"
                            />
                        </div>

                        {/* Degree & Field */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                    Degree
                                </Label>
                                <Input
                                    value={education.degree}
                                    onChange={(e) => handleInputChange(education.id, "degree", e.target.value)}
                                    placeholder="Bachelor's"
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                    Field of Study
                                </Label>
                                <Input
                                    value={education.field}
                                    onChange={(e) => handleInputChange(education.id, "field", e.target.value)}
                                    placeholder="Computer Science"
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Start Date
                                    </Label>
                                    <Input
                                        type="month"
                                        value={education.startDate}
                                        onChange={(e) => handleInputChange(education.id, "startDate", e.target.value)}
                                        disabled={!isEditing}
                                        className="input-field"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> End Date
                                    </Label>
                                    <Input
                                        type="month"
                                        value={education.endDate}
                                        onChange={(e) => handleInputChange(education.id, "endDate", e.target.value)}
                                        disabled={!isEditing || education.current}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={education.current}
                                    onCheckedChange={(checked) => handleInputChange(education.id, "current", checked)}
                                    disabled={!isEditing}
                                />
                                <Label className="text-sm text-muted-foreground">
                                    Currently studying here
                                </Label>
                            </div>
                        </div>

                        {/* GPA */}
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                <Award className="w-4 h-4" /> GPA (Optional)
                            </Label>
                            <Input
                                value={education.gpa}
                                onChange={(e) => handleInputChange(education.id, "gpa", e.target.value)}
                                placeholder="3.8 / 4.0"
                                disabled={!isEditing}
                                className="input-field"
                            />
                        </div>

                        {/* Achievements */}
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                                Achievements & Activities (Optional)
                            </Label>
                            <Textarea
                                value={education.achievements}
                                onChange={(e) => handleInputChange(education.id, "achievements", e.target.value)}
                                placeholder="Dean's List, Student Council President, Research Assistant..."
                                disabled={!isEditing}
                                className="input-field min-h-[80px] resize-none"
                            />
                        </div>
                    </div>
                ))}

                {/* Add Education Button */}
                {isEditing && (
                    <button
                        onClick={handleAddEducation}
                        className="w-full py-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors animate-fade-in"
                    >
                        <Plus className="w-5 h-5" />
                        Add Another Education
                    </button>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Save Education Changes"
                description="Are you sure you want to save your education history? This will update your resume."
                onConfirm={handleConfirmSave}
            />
        </div>
    );
};

export default EducationSection;
