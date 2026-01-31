import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Linkedin, Globe, Camera, Save, FileText, Upload, X, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
    panCard: File | null;
}

const ProfileSection = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(true);

    const [formData, setFormData] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
        summary: "",
        panCard: null,
    });

    const [savedData, setSavedData] = useState<ProfileData>(formData);

    // Load saved data from localStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem("resumeProfile");
        if (savedProfile) {
            try {
                const parsedProfile = JSON.parse(savedProfile);
                setFormData(parsedProfile);
                setSavedData(parsedProfile);
                setIsEditing(false);
            } catch (error) {
                console.error("Error loading saved profile:", error);
            }
        }
    }, []);

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleFileUpload = (file: File | null) => {
        setFormData((prev) => ({ ...prev, panCard: file }));
    };

    const handleRemoveFile = () => {
        setFormData((prev) => ({ ...prev, panCard: null }));
    };

    // Custom comparison for hasChanges that handles File objects
    const hasChanges = (() => {
        const formDataCopy = { ...formData };
        const savedDataCopy = { ...savedData };

        // Compare panCard separately
        const panCardChanged = formData.panCard !== savedData.panCard;

        // Remove panCard for JSON comparison
        const { panCard: _, ...formDataWithoutFile } = formDataCopy;
        const { panCard: __, ...savedDataWithoutFile } = savedDataCopy;

        return panCardChanged || JSON.stringify(formDataWithoutFile) !== JSON.stringify(savedDataWithoutFile);
    })();

    const handleBack = () => {
        if (hasChanges) {
            // Could show a discard changes dialog here
            navigate("/resume");
        } else {
            navigate("/resume");
        }
    };

    const handleSaveClick = () => {
        // Validate that PAN card is uploaded
        if (!formData.panCard) {
            toast({
                title: "PAN Card Required",
                description: "Please upload your PAN card before saving the profile.",
                variant: "destructive",
            });
            return;
        }

        if (hasChanges) {
            setShowConfirm(true);
        }
    };


    const handleConfirmSave = () => {
        setSavedData(formData);
        setIsEditing(false);
        setShowConfirm(false);

        // Save to localStorage
        localStorage.setItem("resumeProfile", JSON.stringify(formData));
        localStorage.setItem("resumeProfileComplete", "true");

        toast({
            title: "Profile Saved",
            description: "Your profile information has been updated successfully.",
        });
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
                        <h1 className="text-xl font-bold text-foreground">Profile</h1>
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
            <div className="p-4 space-y-6 pb-8">
                {/* Profile Photo */}
                <div className="flex flex-col items-center animate-fade-in">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-2 border-dashed border-primary/30">
                            <User className="w-10 h-10 text-primary/50" />
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                        {isEditing ? "Tap to upload photo" : "Profile Photo"}
                    </p>
                </div>

                {/* Personal Info Card */}
                <div className="card-elevated p-5 space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm text-muted-foreground">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder="John"
                                disabled={!isEditing}
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm text-muted-foreground">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                placeholder="Doe"
                                disabled={!isEditing}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="john.doe@example.com"
                            disabled={!isEditing}
                            className="input-field"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4" /> Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            disabled={!isEditing}
                            className="input-field"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location
                        </Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="San Francisco, CA"
                            disabled={!isEditing}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Online Presence Card */}
                <div className="card-elevated p-5 space-y-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <Globe className="w-4 h-4 text-primary" />
                        </div>
                        Online Presence
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-sm text-muted-foreground flex items-center gap-2">
                            <Linkedin className="w-4 h-4" /> LinkedIn Profile
                        </Label>
                        <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            placeholder="linkedin.com/in/johndoe"
                            disabled={!isEditing}
                            className="input-field"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm text-muted-foreground flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Personal Website
                        </Label>
                        <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            placeholder="johndoe.com"
                            disabled={!isEditing}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Professional Summary Card */}
                <div className="card-elevated p-5 space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <h3 className="font-semibold text-foreground">Professional Summary</h3>
                    <Textarea
                        value={formData.summary}
                        onChange={(e) => handleInputChange("summary", e.target.value)}
                        placeholder="Write a compelling summary that highlights your key skills, experience, and career goals..."
                        disabled={!isEditing}
                        className="input-field min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        Tip: Keep your summary between 2-4 sentences for maximum impact.
                    </p>
                </div>

                {/* PAN Card Upload Section */}
                <div className="card-elevated p-5 space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg">
                            <FileText className="w-4 h-4 text-amber-500" />
                        </div>
                        PAN Card Upload
                        <span className="text-xs text-destructive font-normal ml-1">*Required</span>
                    </h3>

                    {formData.panCard ? (
                        // File uploaded state
                        <div className="relative border-2 border-green-500/30 bg-green-500/5 rounded-xl p-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">
                                        {formData.panCard.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {(formData.panCard.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={handleRemoveFile}
                                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                                        title="Remove file"
                                    >
                                        <X className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Upload area
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${isEditing
                                ? "border-primary/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                                : "border-muted cursor-not-allowed opacity-60"
                                }`}
                            onClick={() => {
                                if (isEditing) {
                                    document.getElementById("pancard-upload")?.click();
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                if (isEditing) {
                                    e.currentTarget.classList.add("border-primary", "bg-primary/10");
                                }
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove("border-primary", "bg-primary/10");
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove("border-primary", "bg-primary/10");
                                if (isEditing && e.dataTransfer.files[0]) {
                                    const file = e.dataTransfer.files[0];
                                    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
                                        handleFileUpload(file);
                                    } else {
                                        toast({
                                            title: "Invalid File Type",
                                            description: "Please upload a PDF or image file.",
                                            variant: "destructive",
                                        });
                                    }
                                }
                            }}
                        >
                            <input
                                type="file"
                                id="pancard-upload"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                disabled={!isEditing}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleFileUpload(file);
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        {isEditing ? "Click to upload or drag and drop" : "Upload disabled"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        PDF, JPG, or PNG (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Your PAN card is required for identity verification. The document will be securely stored and processed.
                    </p>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Save Profile Changes"
                description="Are you sure you want to save your profile information? This will update your resume."
                onConfirm={handleConfirmSave}
            />
        </div>
    );
};

export default ProfileSection;
