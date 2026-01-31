import { MessageSquare, Play, Users, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const interviewModules = [
  {
    icon: Play,
    title: "Practice Interview",
    description: "AI-powered mock interviews tailored to your target role.",
    action: "Start Practice",
    route: "/interview/practice",
    isPremium: false,
  },
  {
    icon: Users,
    title: "Expert Career Support",
    description: "Get 1-on-1 role-specific coaching & mentorship from industry professionals.",
    action: "Find Your Coach",
    route: "/interview/trainers",
    isPremium: true,
  },
  {
    icon: MessageSquare,
    title: "AI Coach",
    description: "Chat with our AI coach for personalized interview tips.",
    action: "Start Chat",
    route: null,
    isPremium: false,
  },
];

const Interview = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="text-xl font-bold text-foreground">Interview Prep</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-muted-foreground">
            Prepare for your next interview with AI-powered tools and practice sessions.
          </p>

          <div className="space-y-3">
            {interviewModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  className={`card-elevated p-4 animate-fade-in ${module.isPremium ? "relative bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-2 border-amber-500/20" : ""
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {module.isPremium && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md">
                        <Crown className="w-3 h-3" />
                        PREMIUM
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${module.isPremium ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20" : "bg-primary/10"}`}>
                      <Icon className={`w-5 h-5 ${module.isPremium ? "text-amber-600" : "text-primary"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                      <button
                        onClick={() => module.route && navigate(module.route)}
                        className={`mt-3 text-sm font-medium hover:underline ${module.route
                          ? module.isPremium
                            ? "text-amber-600 cursor-pointer"
                            : "text-primary cursor-pointer"
                          : "text-muted-foreground cursor-not-allowed"
                          }`}
                        disabled={!module.route}
                      >
                        {module.action} {module.route && "→"}
                        {!module.route && " (Coming Soon)"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="card-elevated p-4 text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Practice Sessions</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-2xl font-bold text-primary">85%</p>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Interview;
