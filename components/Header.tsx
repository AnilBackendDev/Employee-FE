import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
    title?: string;
    showProfile?: boolean;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
}

const Header = ({ title, showProfile = true }: HeaderProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<UserData | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get user from localStorage
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out",
        });
        navigate("/login");
    };

    const handleProfile = () => {
        setShowDropdown(false);
        navigate("/profile");
    };

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

    if (!showProfile || !user) {
        return title ? (
            <div className="bg-card border-b border-border py-4 px-4">
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>
        ) : null;
    }

    return (
        <div className="bg-card border-b border-border sticky top-0 z-40">
            <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
                {/* Title or Logo */}
                <div>
                    {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                    >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {getInitials(user.name)}
                        </div>
                        {/* Name and Role */}
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{getRoleLabel(user.role)}</p>
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-lg border border-border overflow-hidden animate-fade-in">
                            {/* User Info */}
                            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-purple-600/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-base font-bold">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <button
                                    onClick={handleProfile}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">My Profile</p>
                                        <p className="text-xs text-muted-foreground">View and edit profile</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate("/settings");
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                        <Settings className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">Settings</p>
                                        <p className="text-xs text-muted-foreground">App preferences</p>
                                    </div>
                                </button>

                                <div className="my-2 border-t border-border"></div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                        <LogOut className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-600">Logout</p>
                                        <p className="text-xs text-red-500/70">Sign out of your account</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
