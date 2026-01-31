import { FileText, MessageSquare, Briefcase, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const navItems = [
  { icon: FileText, label: "Resume", path: "/resume" },
  { icon: Briefcase, label: "Jobs", path: "/tracker" },
  { icon: MessageSquare, label: "Interview", path: "/interview" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [isResumeComplete, setIsResumeComplete] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }

    // Check if all resume sections are complete
    const checkResumeCompletion = () => {
      const profileComplete = localStorage.getItem("resumeProfileComplete") === "true";
      const educationComplete = localStorage.getItem("resumeEducationComplete") === "true";
      const experienceComplete = localStorage.getItem("resumeExperienceComplete") === "true";

      setIsResumeComplete(profileComplete && educationComplete && experienceComplete);
    };

    checkResumeCompletion();
  }, [location]); // Re-check when location changes

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter out Resume tab if resume is complete
  const visibleNavItems = isResumeComplete
    ? navItems.filter(item => item.path !== "/resume")
    : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isProfile = item.path === "/profile";

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            >
              {isProfile && user ? (
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-[10px] font-bold ${isActive ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                  {getInitials(user.name)}
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
