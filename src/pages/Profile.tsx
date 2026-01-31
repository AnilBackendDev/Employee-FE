import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, GraduationCap, Briefcase, ChevronRight, ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        // Get user from localStorage
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        } else {
            // Redirect to login if no user found
            navigate("/login");
        }
    }, [navigate]);

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "candidate":
                return "Candidate";
            case "ta":
                return "Talent Acquisition";
            case "hrms":
                return "HR Manager";
            case "cto":
                return "CTO";
            case "ceo":
                return "CEO";
            default:
                return role;
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "candidate":
                return "from-blue-500 to-indigo-600";
            case "ta":
                return "from-emerald-500 to-teal-600";
            case "hrms":
                return "from-purple-500 to-violet-600";
            case "cto":
                return "from-orange-500 to-red-600";
            case "ceo":
                return "from-pink-500 to-rose-600";
            default:
                return "from-gray-500 to-gray-600";
        }
    };

    const resumeSections = [
        {
            icon: User,
            title: "Personal Information",
            description: "Update your contact details and professional summary",
            route: "/resume/profile",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-600",
        },
        {
            icon: Briefcase,
            title: "Work Experience",
            description: "Manage your work history and achievements",
            route: "/resume/experience",
            bgColor: "bg-purple-500/10",
            iconColor: "text-purple-600",
        },
        {
            icon: GraduationCap,
            title: "Education",
            description: "Add or edit your educational background",
            route: "/resume/education",
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-600",
        },
    ];

    if (!user) {
        return null;
    }

    return (
        <AppLayout showHeader={false}>
            <div className="page-container">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-primary via-violet-500 to-purple-600 pb-16 pt-4 px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl font-bold text-white">My Profile</h1>
                    <p className="text-white/80 text-sm mt-1">Manage your account and resume</p>
                </div>

                {/* Content */}
                <div className="px-4 -mt-8 pb-24 space-y-4">
                    {/* Profile Card */}
                    <div className="card-elevated p-6 text-center">
                        {/* Avatar */}
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white text-xl font-bold shadow-lg mb-3`}>
                            {getInitials(user.name)}
                        </div>

                        {/* Name and Role */}
                        <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                        <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary text-xs font-medium border border-primary/20">
                            {getRoleLabel(user.role)}
                        </span>
                    </div>

                    {/* Resume Management Section */}
                    <div className="card-elevated overflow-hidden">
                        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
                            <h3 className="font-semibold text-foreground">Resume Management</h3>
                            <p className="text-xs text-muted-foreground mt-1">Edit your resume sections below</p>
                        </div>
                        <div className="p-3 space-y-2">
                            {resumeSections.map((section, index) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.title}
                                        onClick={() => navigate(section.route)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all group animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-5 h-5 ${section.iconColor}`} />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <p className="font-medium text-foreground text-sm">{section.title}</p>
                                            <p className="text-xs text-muted-foreground">{section.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;
