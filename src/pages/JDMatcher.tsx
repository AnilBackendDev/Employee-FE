import { useState } from "react";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Target,
  GraduationCap,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SkillAnalysis {
  name: string;
  userProficiency: number; // 0-100
  requiredLevel: number; // 0-100
  gap: number; // difference
  status: "matched" | "partial" | "missing";
  category: "technical" | "soft" | "tools";
}

interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  skillsAddressed: string[];
  rating: number;
  url: string;
  image: string;
}

interface AnalysisResult {
  jobTitle: string;
  company: string;
  location: string;
  requiredKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  atsScore: number;
  suggestions: string[];
  summary: string;
  skillAnalysis: SkillAnalysis[];
  courseRecommendations: CourseRecommendation[];
}

// User's resume skills with proficiency levels
const userSkillsWithProficiency = [
  { name: "React", proficiency: 85, category: "technical" },
  { name: "TypeScript", proficiency: 80, category: "technical" },
  { name: "JavaScript", proficiency: 90, category: "technical" },
  { name: "Node.js", proficiency: 70, category: "technical" },
  { name: "AWS", proficiency: 45, category: "tools" },
  { name: "Git", proficiency: 85, category: "tools" },
  { name: "Agile", proficiency: 75, category: "soft" },
  { name: "CI/CD", proficiency: 55, category: "tools" },
  { name: "REST APIs", proficiency: 80, category: "technical" },
  { name: "HTML", proficiency: 95, category: "technical" },
  { name: "CSS", proficiency: 85, category: "technical" },
  { name: "Tailwind", proficiency: 80, category: "tools" },
  { name: "Communication", proficiency: 70, category: "soft" },
  { name: "Problem Solving", proficiency: 85, category: "soft" },
];

// Mock course recommendations database
const coursesDatabase: CourseRecommendation[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    provider: "AWS Training",
    duration: "6 weeks",
    level: "Intermediate",
    skillsAddressed: ["AWS", "Cloud Architecture", "DevOps"],
    rating: 4.8,
    url: "https://aws.amazon.com/training",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&fit=crop",
  },
  {
    id: "2",
    title: "Docker & Kubernetes Masterclass",
    provider: "Udemy",
    duration: "8 weeks",
    level: "Advanced",
    skillsAddressed: ["Docker", "Kubernetes", "CI/CD", "DevOps"],
    rating: 4.7,
    url: "https://udemy.com",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&fit=crop",
  },
  {
    id: "3",
    title: "Python for Data Science",
    provider: "Coursera",
    duration: "4 weeks",
    level: "Beginner",
    skillsAddressed: ["Python", "Data Science", "Machine Learning"],
    rating: 4.9,
    url: "https://coursera.org",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&fit=crop",
  },
  {
    id: "4",
    title: "Advanced React Patterns",
    provider: "Frontend Masters",
    duration: "3 weeks",
    level: "Advanced",
    skillsAddressed: ["React", "TypeScript", "Architecture"],
    rating: 4.8,
    url: "https://frontendmasters.com",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&fit=crop",
  },
  {
    id: "5",
    title: "GraphQL Complete Guide",
    provider: "LinkedIn Learning",
    duration: "5 weeks",
    level: "Intermediate",
    skillsAddressed: ["GraphQL", "API Design", "Node.js"],
    rating: 4.6,
    url: "https://linkedin.com/learning",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&fit=crop",
  },
  {
    id: "6",
    title: "System Design Interview Prep",
    provider: "Educative",
    duration: "6 weeks",
    level: "Advanced",
    skillsAddressed: ["System Design", "Architecture", "Scalability"],
    rating: 4.9,
    url: "https://educative.io",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&fit=crop",
  },
];

const JDMatcher = () => {
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("skills");
  const { toast } = useToast();

  // Simulated AI analysis function (replaces the API call for demo)
  const performLocalAnalysis = (jdText: string): AnalysisResult => {
    const jdLower = jdText.toLowerCase();

    // Extract potential skills from JD
    const allPossibleSkills = [
      { name: "React", required: 85, category: "technical" as const },
      { name: "TypeScript", required: 80, category: "technical" as const },
      { name: "JavaScript", required: 90, category: "technical" as const },
      { name: "Node.js", required: 75, category: "technical" as const },
      { name: "Python", required: 70, category: "technical" as const },
      { name: "AWS", required: 80, category: "tools" as const },
      { name: "Docker", required: 70, category: "tools" as const },
      { name: "Kubernetes", required: 65, category: "tools" as const },
      { name: "GraphQL", required: 60, category: "technical" as const },
      { name: "SQL", required: 75, category: "technical" as const },
      { name: "MongoDB", required: 60, category: "tools" as const },
      { name: "Git", required: 80, category: "tools" as const },
      { name: "CI/CD", required: 75, category: "tools" as const },
      { name: "Agile", required: 70, category: "soft" as const },
      { name: "Communication", required: 80, category: "soft" as const },
      { name: "Leadership", required: 65, category: "soft" as const },
      { name: "Problem Solving", required: 85, category: "soft" as const },
      { name: "System Design", required: 80, category: "technical" as const },
      { name: "REST APIs", required: 85, category: "technical" as const },
      { name: "HTML", required: 70, category: "technical" as const },
      { name: "CSS", required: 70, category: "technical" as const },
      { name: "Tailwind", required: 60, category: "tools" as const },
    ];

    // Find skills mentioned in JD
    const requiredSkills = allPossibleSkills.filter(skill =>
      jdLower.includes(skill.name.toLowerCase())
    );

    // If no skills found, add some common ones based on keywords
    if (requiredSkills.length < 5) {
      if (jdLower.includes("frontend") || jdLower.includes("front-end")) {
        requiredSkills.push(
          { name: "React", required: 85, category: "technical" },
          { name: "TypeScript", required: 80, category: "technical" },
          { name: "CSS", required: 75, category: "technical" }
        );
      }
      if (jdLower.includes("backend") || jdLower.includes("back-end")) {
        requiredSkills.push(
          { name: "Node.js", required: 80, category: "technical" },
          { name: "SQL", required: 75, category: "technical" },
          { name: "REST APIs", required: 85, category: "technical" }
        );
      }
      if (jdLower.includes("fullstack") || jdLower.includes("full-stack") || jdLower.includes("full stack")) {
        requiredSkills.push(
          { name: "React", required: 85, category: "technical" },
          { name: "Node.js", required: 80, category: "technical" },
          { name: "TypeScript", required: 75, category: "technical" },
          { name: "AWS", required: 70, category: "tools" }
        );
      }
      if (jdLower.includes("cloud") || jdLower.includes("devops")) {
        requiredSkills.push(
          { name: "AWS", required: 85, category: "tools" },
          { name: "Docker", required: 75, category: "tools" },
          { name: "CI/CD", required: 80, category: "tools" }
        );
      }
    }

    // Remove duplicates
    const uniqueRequiredSkills = Array.from(
      new Map(requiredSkills.map(skill => [skill.name, skill])).values()
    );

    // Analyze skills
    const skillAnalysis: SkillAnalysis[] = uniqueRequiredSkills.map(reqSkill => {
      const userSkill = userSkillsWithProficiency.find(
        us => us.name.toLowerCase() === reqSkill.name.toLowerCase()
      );

      const userProficiency = userSkill?.proficiency || 0;
      const gap = Math.max(0, reqSkill.required - userProficiency);

      let status: SkillAnalysis["status"];
      if (userProficiency >= reqSkill.required) {
        status = "matched";
      } else if (userProficiency >= reqSkill.required * 0.6) {
        status = "partial";
      } else {
        status = "missing";
      }

      return {
        name: reqSkill.name,
        userProficiency,
        requiredLevel: reqSkill.required,
        gap,
        status,
        category: reqSkill.category,
      };
    });

    // Get matched and missing keywords
    const matchedKeywords = skillAnalysis
      .filter(s => s.status === "matched")
      .map(s => s.name);

    const missingKeywords = skillAnalysis
      .filter(s => s.status === "missing")
      .map(s => s.name);

    // Find relevant courses for gaps
    const gapSkills = skillAnalysis
      .filter(s => s.status !== "matched")
      .map(s => s.name.toLowerCase());

    const courseRecommendations = coursesDatabase.filter(course =>
      course.skillsAddressed.some(skill =>
        gapSkills.includes(skill.toLowerCase())
      )
    ).slice(0, 4);

    // Calculate ATS score
    const totalSkills = skillAnalysis.length;
    const matchedCount = skillAnalysis.filter(s => s.status === "matched").length;
    const partialCount = skillAnalysis.filter(s => s.status === "partial").length;
    const atsScore = Math.round(
      ((matchedCount * 1 + partialCount * 0.5) / totalSkills) * 100
    );

    // Generate suggestions
    const suggestions: string[] = [];
    const missingTechnical = skillAnalysis.filter(s => s.status === "missing" && s.category === "technical");
    const partialSkills = skillAnalysis.filter(s => s.status === "partial");

    if (missingTechnical.length > 0) {
      suggestions.push(`Consider learning ${missingTechnical.slice(0, 2).map(s => s.name).join(" and ")} to match the technical requirements.`);
    }
    if (partialSkills.length > 0) {
      suggestions.push(`Strengthen your ${partialSkills[0].name} skills to reach the required proficiency level.`);
    }
    suggestions.push("Highlight your strongest matching skills prominently in your resume summary.");
    suggestions.push("Include quantifiable achievements that demonstrate your expertise in matched skills.");

    // Extract job info from JD
    const lines = jdText.split("\n").filter(l => l.trim());
    let jobTitle = "Software Engineer";
    let company = "Company";
    let location = "Remote";

    for (const line of lines.slice(0, 5)) {
      if (line.toLowerCase().includes("engineer") || line.toLowerCase().includes("developer")) {
        jobTitle = line.trim().substring(0, 50);
      }
      if (line.toLowerCase().includes("location:")) {
        location = line.replace(/location:/i, "").trim();
      }
    }

    return {
      jobTitle,
      company,
      location,
      requiredKeywords: skillAnalysis.map(s => s.name),
      matchedKeywords,
      missingKeywords,
      atsScore: Math.min(100, Math.max(0, atsScore)),
      suggestions,
      summary: atsScore >= 70
        ? "Great match! Your skills align well with this position."
        : atsScore >= 50
          ? "Good potential! Some skill gaps can be addressed with targeted learning."
          : "There are significant skill gaps. Consider the recommended courses below.",
      skillAnalysis,
      courseRecommendations,
    };
  };

  const handleAnalyze = async () => {
    if (!jobDescriptionText.trim()) {
      toast({
        title: "No job description",
        description: "Please paste a job description to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = performLocalAnalysis(jobDescriptionText);
      setAnalysis(result);

      toast({
        title: "Analysis complete!",
        description: `Your JD match score is ${result.atsScore}%`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const circumference = 2 * Math.PI * 45;
  const score = analysis?.atsScore ?? 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusColor = (status: SkillAnalysis["status"]) => {
    switch (status) {
      case "matched":
        return "text-emerald-500";
      case "partial":
        return "text-amber-500";
      case "missing":
        return "text-red-500";
    }
  };

  const getStatusBg = (status: SkillAnalysis["status"]) => {
    switch (status) {
      case "matched":
        return "bg-emerald-500";
      case "partial":
        return "bg-amber-500";
      case "missing":
        return "bg-red-500";
    }
  };

  const getProgressBarColor = (proficiency: number, required: number) => {
    const ratio = proficiency / required;
    if (ratio >= 1) return "bg-gradient-to-r from-emerald-400 to-emerald-500";
    if (ratio >= 0.6) return "bg-gradient-to-r from-amber-400 to-amber-500";
    return "bg-gradient-to-r from-red-400 to-red-500";
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
              <Target className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">JD Matcher</h1>
              <p className="text-xs text-muted-foreground">AI-powered skill gap analysis</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Job Description Input */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Job Description</h2>
              <button className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <Textarea
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[150px] resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescriptionText.trim()}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Skills...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze & Match Skills
                </>
              )}
            </button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Job Info Card */}
              <div className="card-elevated p-4 animate-fade-in bg-gradient-to-br from-primary/5 to-violet-500/5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{analysis.jobTitle}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {analysis.company} • {analysis.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* ATS Match Score */}
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="card-elevated p-6 bg-gradient-to-br from-card to-primary/5">
                  <h2 className="font-semibold text-foreground mb-4 text-center">Overall Match Score</h2>
                  <div className="flex flex-col items-center">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          className="text-secondary"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          className={`transition-all duration-1000 ease-out ${score >= 70 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500"
                            }`}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${score >= 70 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500"
                          }`}>
                          {score}%
                        </span>
                        <span className="text-xs text-muted-foreground">Match</span>
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground mt-4 max-w-xs text-sm">
                      {analysis.summary}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex gap-6 mt-6 pt-4 border-t border-border w-full justify-center">
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-foreground">
                            {analysis.skillAnalysis.filter(s => s.status === "matched").length}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Matched</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <TrendingUp className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-foreground">
                            {analysis.skillAnalysis.filter(s => s.status === "partial").length}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Partial</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="font-bold text-foreground">
                            {analysis.skillAnalysis.filter(s => s.status === "missing").length}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Gaps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Proficiency Analysis */}
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <button
                  onClick={() => toggleSection("skills")}
                  className="w-full flex items-center justify-between p-4 card-elevated hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h2 className="font-semibold text-foreground">Skill Proficiency Analysis</h2>
                      <p className="text-xs text-muted-foreground">
                        {analysis.skillAnalysis.length} skills analyzed
                      </p>
                    </div>
                  </div>
                  {expandedSection === "skills" ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {expandedSection === "skills" && (
                  <div className="mt-3 space-y-3 animate-fade-in">
                    {analysis.skillAnalysis.map((skill, index) => (
                      <div
                        key={skill.name}
                        className="card-elevated p-4"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{skill.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${skill.status === "matched"
                                ? "bg-emerald-100 text-emerald-700"
                                : skill.status === "partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                              {skill.status === "matched" ? "Match" : skill.status === "partial" ? "Partial" : "Gap"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-foreground">
                              {skill.userProficiency}%
                            </span>
                            <span className="text-xs text-muted-foreground"> / {skill.requiredLevel}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                          {/* Required level indicator */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10"
                            style={{ left: `${skill.requiredLevel}%` }}
                          />
                          {/* User proficiency bar */}
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(skill.userProficiency, skill.requiredLevel)}`}
                            style={{ width: `${skill.userProficiency}%` }}
                          />
                        </div>

                        {skill.gap > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Need to improve by {skill.gap}% to match requirement
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Recommendations */}
              {analysis.courseRecommendations.length > 0 && (
                <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <button
                    onClick={() => toggleSection("courses")}
                    className="w-full flex items-center justify-between p-4 card-elevated hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                        <GraduationCap className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="text-left">
                        <h2 className="font-semibold text-foreground">Recommended Courses</h2>
                        <p className="text-xs text-muted-foreground">
                          Close your skill gaps with these courses
                        </p>
                      </div>
                    </div>
                    {expandedSection === "courses" ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedSection === "courses" && (
                    <div className="mt-3 space-y-3 animate-fade-in">
                      {analysis.courseRecommendations.map((course, index) => (
                        <div
                          key={course.id}
                          className="card-elevated overflow-hidden hover:shadow-lg transition-all"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-24 h-24 object-cover"
                            />
                            <div className="p-3 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-medium text-foreground text-sm line-clamp-2">
                                  {course.title}
                                </h3>
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
                                >
                                  <ExternalLink className="w-4 h-4 text-primary" />
                                </a>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {course.provider} • {course.duration}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-amber-500" />
                                  <span className="text-xs font-medium text-foreground">
                                    {course.rating}
                                  </span>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {course.level}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {course.skillsAddressed.slice(0, 2).map(skill => (
                                  <span
                                    key={skill}
                                    className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Improvement Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <button
                    onClick={() => toggleSection("suggestions")}
                    className="w-full flex items-center justify-between p-4 card-elevated hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <h2 className="font-semibold text-foreground">Improvement Tips</h2>
                        <p className="text-xs text-muted-foreground">
                          {analysis.suggestions.length} suggestions to boost your match
                        </p>
                      </div>
                    </div>
                    {expandedSection === "suggestions" ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedSection === "suggestions" && (
                    <div className="mt-3 card-elevated p-4 space-y-3 animate-fade-in">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-1 rounded-full bg-primary/10 mt-0.5">
                            <Sparkles className="w-3 h-3 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Matched & Missing Keywords Summary */}
              <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-foreground text-sm">Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.slice(0, 5).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-foreground text-sm">Gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.slice(0, 5).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!analysis && !isAnalyzing && (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <Target className="w-10 h-10 text-violet-600 opacity-70" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Analyze Your Skill Match</h3>
              <p className="text-sm max-w-xs mx-auto">
                Paste a job description above to discover your skill proficiency, identify gaps, and get personalized course recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

// Missing import fix
const Briefcase = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default JDMatcher;
