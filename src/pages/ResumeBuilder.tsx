import { User, Briefcase, GraduationCap, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const sections = [
  {
    icon: User,
    title: "Profile",
    description: "Basic information, contact details, and professional summary.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    route: "/resume/profile",
  },
  {
    icon: Briefcase,
    title: "Experience",
    description: "Work history, roles, responsibilities, and achievements.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    route: "/resume/experience",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Academic background, degrees, certifications, and courses.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    route: "/resume/education",
  },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();

  const handleSectionClick = (route: string) => {
    navigate(route);
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="text-xl font-bold text-foreground">Resume Builder</h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={section.title}
                onClick={() => handleSectionClick(section.route)}
                className="section-card w-full animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            );
          })}

          {/* ATS Optimization */}
          <button
            onClick={() => navigate("/resume/ats-optimization")}
            className="card-elevated p-4 mt-6 animate-fade-in w-full text-left hover:shadow-lg transition-all"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Resume ATS Optimization</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    AI-powered score booster • Upload & optimize
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeBuilder;
