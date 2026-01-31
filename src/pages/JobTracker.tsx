import { useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  Star,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Building2,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles,
  Zap,
  Users,
  GraduationCap,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Send,
  Eye,
  Calendar,
  Edit2,
  X,
  Plus,
  Check,
  Video,
  Mic,
  FileText,
  Bell,
  RefreshCw,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: "remote" | "hybrid" | "onsite";
  salary: string;
  experience: string;
  postedDate: string;
  matchScore: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  logo: string;
  isBookmarked: boolean;
  applicants: number;
  companySize: string;
  daysPosted: number;
  fillingSpeed: "hot" | "fast" | "normal" | "slow";
}

interface AppliedJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  appliedDate: string;
  status: "applied" | "viewed" | "shortlisted" | "interview" | "rejected";
  lastUpdate: string;
  salary: string;
  // Interview-specific fields
  interviewSchedule?: {
    date: string;
    time: string;
    mode: "video" | "phone" | "in-person";
    meetingLink?: string;
    interviewer?: string;
  };
  jobDescription?: string;
  hasRecording?: boolean;
  recordingId?: string;
}

// Candidate profile interface
interface CandidateProfile {
  location: string;
  experience: number;
  skills: string[];
}

// Initial candidate profile - in real app, this would come from user data
const initialCandidateProfile: CandidateProfile = {
  location: "Bangalore, India",
  experience: 5,
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "AWS",
    "Git",
    "REST APIs",
    "HTML",
    "CSS",
    "Tailwind",
    "MongoDB",
    "Problem Solving",
    "Communication",
  ],
};

// Mock job postings database
const allJobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp India",
    location: "Bangalore, India",
    locationType: "hybrid",
    salary: "₹25-35 LPA",
    experience: "4-6 years",
    postedDate: "2 days ago",
    matchScore: 92,
    requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
    matchedSkills: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
    missingSkills: [],
    description: "Join our team to build cutting-edge web applications using React and TypeScript.",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&fit=crop",
    isBookmarked: false,
    applicants: 45,
    companySize: "500-1000",
    daysPosted: 2,
    fillingSpeed: "hot",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Bangalore, India",
    locationType: "remote",
    salary: "₹20-30 LPA",
    experience: "3-5 years",
    postedDate: "1 day ago",
    matchScore: 88,
    requiredSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
    matchedSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    missingSkills: ["Docker"],
    description: "Looking for a versatile full-stack developer to help scale our product.",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&fit=crop",
    isBookmarked: true,
    applicants: 78,
    companySize: "50-200",
    daysPosted: 1,
    fillingSpeed: "fast",
  },
  {
    id: "3",
    title: "React Developer",
    company: "FinTech Solutions",
    location: "Mumbai, India",
    locationType: "hybrid",
    salary: "₹18-28 LPA",
    experience: "3-5 years",
    postedDate: "3 days ago",
    matchScore: 85,
    requiredSkills: ["React", "JavaScript", "Redux", "REST APIs", "Git"],
    matchedSkills: ["React", "JavaScript", "REST APIs", "Git"],
    missingSkills: ["Redux"],
    description: "Build financial products that impact millions of users.",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&fit=crop",
    isBookmarked: false,
    applicants: 120,
    companySize: "1000+",
    daysPosted: 3,
    fillingSpeed: "hot",
  },
  {
    id: "4",
    title: "Frontend Architect",
    company: "Global Tech",
    location: "Bangalore, India",
    locationType: "onsite",
    salary: "₹35-50 LPA",
    experience: "6-8 years",
    postedDate: "5 days ago",
    matchScore: 75,
    requiredSkills: ["React", "TypeScript", "System Design", "AWS", "Leadership", "Micro-frontends"],
    matchedSkills: ["React", "TypeScript", "AWS"],
    missingSkills: ["System Design", "Leadership", "Micro-frontends"],
    description: "Lead the frontend architecture for our enterprise applications.",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&fit=crop",
    isBookmarked: false,
    applicants: 32,
    companySize: "5000+",
    daysPosted: 5,
    fillingSpeed: "normal",
  },
  {
    id: "5",
    title: "JavaScript Developer",
    company: "EdTech Startup",
    location: "Hyderabad, India",
    locationType: "remote",
    salary: "₹12-18 LPA",
    experience: "2-4 years",
    postedDate: "1 week ago",
    matchScore: 90,
    requiredSkills: ["JavaScript", "React", "HTML", "CSS", "Node.js"],
    matchedSkills: ["JavaScript", "React", "HTML", "CSS", "Node.js"],
    missingSkills: [],
    description: "Help us revolutionize online education with interactive learning experiences.",
    logo: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=100&fit=crop",
    isBookmarked: false,
    applicants: 156,
    companySize: "10-50",
    daysPosted: 7,
    fillingSpeed: "fast",
  },
  {
    id: "6",
    title: "Senior Software Engineer",
    company: "Cloud Giants",
    location: "Bangalore, India",
    locationType: "hybrid",
    salary: "₹28-40 LPA",
    experience: "5-7 years",
    postedDate: "4 days ago",
    matchScore: 82,
    requiredSkills: ["React", "TypeScript", "AWS", "Kubernetes", "CI/CD", "Python"],
    matchedSkills: ["React", "TypeScript", "AWS"],
    missingSkills: ["Kubernetes", "CI/CD", "Python"],
    description: "Work on cloud-native applications serving millions of requests.",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&fit=crop",
    isBookmarked: true,
    applicants: 89,
    companySize: "1000+",
    daysPosted: 4,
    fillingSpeed: "slow",
  },
];

// Mock applied jobs
const appliedJobsData: AppliedJob[] = [
  {
    id: "a1",
    jobId: "101",
    title: "React Native Developer",
    company: "MobileFirst Tech",
    location: "Bangalore, India",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&fit=crop",
    appliedDate: "Jan 10, 2026",
    status: "shortlisted",
    lastUpdate: "2 hours ago",
    salary: "₹22-32 LPA",
  },
  {
    id: "a2",
    jobId: "102",
    title: "Frontend Lead",
    company: "InnovateTech",
    location: "Mumbai, India",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&fit=crop",
    appliedDate: "Jan 8, 2026",
    status: "viewed",
    lastUpdate: "1 day ago",
    salary: "₹30-45 LPA",
  },
  {
    id: "a3",
    jobId: "103",
    title: "Senior UI Engineer",
    company: "DesignHub",
    location: "Hyderabad, India",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&fit=crop",
    appliedDate: "Jan 5, 2026",
    status: "interview",
    lastUpdate: "Today",
    salary: "₹25-35 LPA",
    interviewSchedule: {
      date: "Jan 18, 2026",
      time: "3:00 PM - 4:00 PM",
      mode: "video",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      interviewer: "Sarah Johnson, Engineering Manager",
    },
    jobDescription: "We're looking for a Senior UI Engineer to lead our design system and component library. You'll work closely with designers to create beautiful, accessible interfaces and mentor junior developers in best practices.",
    hasRecording: false,
  },
  {
    id: "a4",
    jobId: "104",
    title: "JavaScript Developer",
    company: "WebScale Inc",
    location: "Chennai, India",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&fit=crop",
    appliedDate: "Jan 3, 2026",
    status: "applied",
    lastUpdate: "4 days ago",
    salary: "₹15-22 LPA",
  },
  {
    id: "a5",
    jobId: "105",
    title: "React Developer",
    company: "TechVista Solutions",
    location: "Pune, India",
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&fit=crop",
    appliedDate: "Jan 12, 2026",
    status: "interview",
    lastUpdate: "6 hours ago",
    salary: "₹18-28 LPA",
    interviewSchedule: {
      date: "Jan 20, 2026",
      time: "10:00 AM - 11:00 AM",
      mode: "video",
      meetingLink: "https://zoom.us/j/123456789",
      interviewer: "Rajesh Kumar, Tech Lead",
    },
    jobDescription: "Join our team to build cutting-edge React applications. Work on modern web technologies and collaborate with a talented team of developers.",
    hasRecording: false,
  },
  {
    id: "a6",
    jobId: "106",
    title: "Full Stack Engineer",
    company: "CloudWorks",
    location: "Bangalore, India",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&fit=crop",
    appliedDate: "Jan 14, 2026",
    status: "interview",
    lastUpdate: "3 hours ago",
    salary: "₹30-42 LPA",
    interviewSchedule: {
      date: "Jan 17, 2026",
      time: "2:30 PM - 3:30 PM",
      mode: "video",
      meetingLink: "https://meet.google.com/xyz-abcd-efg",
      interviewer: "Priya Sharma, Senior Developer",
    },
    jobDescription: "Looking for a Full Stack Engineer to work on scalable cloud-based applications. Experience with React, Node.js, and AWS is essential.",
    hasRecording: false,
  },
];

type LocationFilter = "all" | "remote" | "hybrid" | "onsite";
type SortOption = "match" | "date" | "salary";
type TabType = "posted" | "applied";
type AppliedJobStatusFilter = "applied" | "viewed" | "shortlisted" | "interview" | "rejected";

const JobTracker = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState(allJobPostings);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("posted");
  const [appliedJobs] = useState(appliedJobsData);
  const [appliedJobsStatusFilter, setAppliedJobsStatusFilter] = useState<AppliedJobStatusFilter>("applied");

  // Editable profile state
  const [candidateProfile, setCandidateProfile] = useState(initialCandidateProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedLocation, setEditedLocation] = useState("");
  const [editedSkills, setEditedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesLocation =
        locationFilter === "all" || job.locationType === locationFilter;
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.matchScore - a.matchScore;
        case "date":
          // Simple sort by posted date text
          return a.postedDate.localeCompare(b.postedDate);
        case "salary":
          // Extract numeric value from salary for sorting
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, ""));
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, ""));
          return salaryB - salaryA;
        default:
          return 0;
      }
    });

  const handleBookmark = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
    const job = jobs.find((j) => j.id === jobId);
    toast({
      title: job?.isBookmarked ? "Removed from saved" : "Job saved!",
      description: job?.isBookmarked
        ? "Job removed from your saved list"
        : "You can find this job in your saved section",
    });
  };

  const handleApply = (job: JobPosting) => {
    toast({
      title: "Application Started!",
      description: `Redirecting to apply for ${job.title} at ${job.company}`,
    });
  };

  const handleEditProfile = () => {
    setEditedLocation(candidateProfile.location);
    setEditedSkills([...candidateProfile.skills]);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!editedLocation.trim()) {
      toast({
        title: "Error",
        description: "Location cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setCandidateProfile({
      ...candidateProfile,
      location: editedLocation,
      skills: editedSkills,
    });
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated!",
      description: "Your profile has been updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setNewSkill("");
  };

  const handleAddSkill = () => {
    const skillToAdd = newSkill.trim();
    if (!skillToAdd) return;

    if (editedSkills.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      toast({
        title: "Duplicate Skill",
        description: "This skill is already in your list",
        variant: "destructive",
      });
      return;
    }

    setEditedSkills([...editedSkills, skillToAdd]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditedSkills(editedSkills.filter(skill => skill !== skillToRemove));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-orange-500";
  };

  const getFillingSpeedInfo = (speed: JobPosting["fillingSpeed"], applicants: number, daysPosted: number) => {
    const rate = Math.round(applicants / Math.max(daysPosted, 1));
    switch (speed) {
      case "hot":
        return {
          icon: Flame,
          label: "Filling Fast!",
          sublabel: `${rate}+ applicants/day`,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
        };
      case "fast":
        return {
          icon: TrendingUp,
          label: "High Interest",
          sublabel: `${rate} applicants/day`,
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
        };
      case "normal":
        return {
          icon: Clock,
          label: "Steady",
          sublabel: `${rate} applicants/day`,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
        };
      case "slow":
        return {
          icon: CheckCircle2,
          label: "Less Competition",
          sublabel: `${rate} applicants/day`,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/30",
        };
    }
  };

  const getStatusInfo = (status: AppliedJob["status"]) => {
    switch (status) {
      case "applied":
        return { icon: Send, label: "Applied", color: "text-blue-500", bgColor: "bg-blue-500/10" };
      case "viewed":
        return { icon: Eye, label: "Viewed", color: "text-purple-500", bgColor: "bg-purple-500/10" };
      case "shortlisted":
        return { icon: Star, label: "Shortlisted", color: "text-amber-500", bgColor: "bg-amber-500/10" };
      case "interview":
        return { icon: Calendar, label: "Interview", color: "text-emerald-500", bgColor: "bg-emerald-500/10" };
      case "rejected":
        return { icon: AlertTriangle, label: "Not Selected", color: "text-red-500", bgColor: "bg-red-500/10" };
    }
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-orange-500";
  };

  const getLocationTypeIcon = (type: JobPosting["locationType"]) => {
    switch (type) {
      case "remote":
        return "🏠";
      case "hybrid":
        return "🔄";
      case "onsite":
        return "🏢";
    }
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Jobs Tracker</h1>
              <p className="text-xs text-muted-foreground">
                {filteredJobs.length} jobs matching your profile
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Candidate Profile Summary - Compact & Editable */}
          <div className="card-elevated overflow-hidden animate-fade-in">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary via-violet-500 to-purple-600 p-3 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                    <span className="text-base font-bold text-white">JD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">John Doe</h3>
                    <p className="text-xs text-white/80">Frontend Developer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-white/90">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-medium">Score</span>
                    </div>
                    <p className="text-xl font-bold text-white">87%</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="px-3 -mt-3">
              <div className="grid grid-cols-3 gap-2">
                {/* Location - Editable */}
                <div className="bg-card rounded-lg p-2 shadow-md border border-border text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  {isEditingProfile ? (
                    <Input
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="text-xs font-semibold text-center h-6 px-1 mb-1"
                      placeholder="Location"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-foreground">{candidateProfile.location.split(",")[0]}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground">Location</p>
                </div>
                <div className="bg-card rounded-lg p-2 shadow-md border border-border text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{candidateProfile.experience} Years</p>
                  <p className="text-[10px] text-muted-foreground">Experience</p>
                </div>
                <div className="bg-card rounded-lg p-2 shadow-md border border-border text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-1">
                    <Zap className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    {isEditingProfile ? editedSkills.length : candidateProfile.skills.length} Skills
                  </p>
                  <p className="text-[10px] text-muted-foreground">Matched</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="p-3 pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {isEditingProfile ? "Edit Skills" : "Top Skills"}
                </span>
                {!isEditingProfile && (
                  <button className="text-xs text-primary font-medium hover:underline">View All</button>
                )}
              </div>

              {/* View Mode - Skills Display */}
              {!isEditingProfile && (
                <div className="flex flex-wrap gap-1.5">
                  {candidateProfile.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 text-primary font-medium border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidateProfile.skills.length > 6 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground font-medium">
                      +{candidateProfile.skills.length - 6} more
                    </span>
                  )}
                </div>
              )}

              {/* Edit Mode - Skills Management */}
              {isEditingProfile && (
                <div className="space-y-2">
                  {/* Add New Skill */}
                  <div className="flex gap-1.5">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Add new skill..."
                      className="text-xs h-8 flex-1"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3 h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Add</span>
                    </button>
                  </div>

                  {/* Skills List with Remove */}
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {editedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 text-primary font-medium border border-primary/20 flex items-center gap-1 group"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Mode Action Buttons */}
              {isEditingProfile && (
                <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <button
              onClick={() => setActiveTab("posted")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === "posted"
                ? "bg-white dark:bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Briefcase className="w-4 h-4" />
              Posted Jobs
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === "posted" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                {filteredJobs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("applied")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === "applied"
                ? "bg-white dark:bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Send className="w-4 h-4" />
              Applied Jobs
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === "applied" ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-muted-foreground"
                }`}>
                {appliedJobs.length}
              </span>
            </button>
          </div>

          {/* Posted Jobs Tab Content */}
          {activeTab === "posted" && (
            <>
              {/* Search & Filter Bar */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs, companies, or skills..."
                    className="input-field pl-12 pr-12"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                      }`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="card-elevated p-4 space-y-4 animate-fade-in">
                    {/* Location Type */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Work Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(["all", "remote", "hybrid", "onsite"] as LocationFilter[]).map(
                          (type) => (
                            <button
                              key={type}
                              onClick={() => setLocationFilter(type)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${locationFilter === type
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                            >
                              {type === "all"
                                ? "All"
                                : type === "remote"
                                  ? "🏠 Remote"
                                  : type === "hybrid"
                                    ? "🔄 Hybrid"
                                    : "🏢 Onsite"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Sort By
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "match" as SortOption, label: "Best Match", icon: Star },
                          { value: "date" as SortOption, label: "Most Recent", icon: Clock },
                          { value: "salary" as SortOption, label: "Salary", icon: DollarSign },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === option.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                              }`}
                          >
                            <option.icon className="w-3 h-3" />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Listings */}
              <div className="space-y-3">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="card-elevated overflow-hidden animate-fade-in hover:shadow-lg transition-all"
                    style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                  >
                    {/* Main Job Card */}
                    <div className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-14 h-14 rounded-xl object-cover shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground line-clamp-1">
                                {job.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {job.company}
                              </p>
                            </div>
                            <button
                              onClick={() => handleBookmark(job.id)}
                              className={`p-1.5 rounded-lg transition-colors ${job.isBookmarked
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:bg-secondary"
                                }`}
                            >
                              {job.isBookmarked ? (
                                <BookmarkCheck className="w-5 h-5" />
                              ) : (
                                <Bookmark className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-secondary">
                              {getLocationTypeIcon(job.locationType)} {job.locationType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {job.postedDate}
                            </span>
                          </div>

                          {/* Filling Speed Indicator */}
                          {(() => {
                            const speedInfo = getFillingSpeedInfo(job.fillingSpeed, job.applicants, job.daysPosted);
                            const SpeedIcon = speedInfo.icon;
                            return (
                              <div className={`flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg border ${speedInfo.bgColor} ${speedInfo.borderColor}`}>
                                <SpeedIcon className={`w-3.5 h-3.5 ${speedInfo.color}`} />
                                <div className="flex-1">
                                  <span className={`text-xs font-medium ${speedInfo.color}`}>{speedInfo.label}</span>
                                  <span className="text-xs text-muted-foreground ml-1">· {speedInfo.sublabel}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{job.applicants} applied</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Match Score & Salary */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-4">
                          {/* Match Score */}
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${getMatchScoreBg(
                                job.matchScore
                              )}`}
                            >
                              <span className="text-sm font-bold text-white">
                                {job.matchScore}%
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">Match</p>
                              <p className="text-xs text-muted-foreground">
                                {job.matchedSkills.length}/{job.requiredSkills.length} skills
                              </p>
                            </div>
                          </div>

                          {/* Salary */}
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-medium text-foreground">
                              {job.salary}
                            </span>
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Experience</p>
                          <p className="text-sm font-medium text-foreground">{job.experience}</p>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() =>
                          setExpandedJobId(expandedJobId === job.id ? null : job.id)
                        }
                        className="w-full flex items-center justify-center gap-1 mt-3 pt-3 border-t border-border text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {expandedJobId === job.id ? (
                          <>
                            Hide Details <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View Skills Match <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedJobId === job.id && (
                      <div className="px-4 pb-4 pt-0 animate-fade-in">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4">
                          {job.description}
                        </p>

                        {/* Skills Match */}
                        <div className="space-y-3">
                          {/* Matched Skills */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-medium text-foreground">
                                Matched Skills ({job.matchedSkills.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {job.matchedSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Missing Skills */}
                          {job.missingSkills.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium text-foreground">
                                  Skills to Develop ({job.missingSkills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {job.missingSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Company Info */}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {job.companySize} employees
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {job.applicants} applicants
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleApply(job)}
                            className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            Quick Apply
                          </button>
                          <button className="btn-secondary flex-none py-2.5 px-4">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground animate-fade-in">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Briefcase className="w-10 h-10 text-emerald-600 opacity-70" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">No Jobs Found</h3>
                  <p className="text-sm max-w-xs mx-auto">
                    Try adjusting your search or filters to find more matching opportunities.
                  </p>
                </div>
              )}

              {/* Stats Footer */}
              <div className="card-elevated p-4 mt-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {activeTab === "posted"
                        ? "Jobs are matched based on your skills, location, and experience"
                        : "Track your application progress in real-time"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Applied Jobs Tab Content */}
          {activeTab === "applied" && (
            <>
              {/* Applied Jobs Summary - Now Clickable Filters */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-foreground">Application Status</h3>
                  <p className="text-xs text-muted-foreground">Click to view by status</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { status: "applied" as const, count: appliedJobs.filter(j => j.status === "applied").length },
                    { status: "viewed" as const, count: appliedJobs.filter(j => j.status === "viewed").length },
                    { status: "shortlisted" as const, count: appliedJobs.filter(j => j.status === "shortlisted").length },
                    { status: "interview" as const, count: appliedJobs.filter(j => j.status === "interview").length },
                  ].map((item) => {
                    const info = getStatusInfo(item.status);
                    const StatusIcon = info.icon;
                    const isActive = appliedJobsStatusFilter === item.status;
                    return (
                      <button
                        key={item.status}
                        onClick={() => setAppliedJobsStatusFilter(item.status)}
                        className={`p-3 rounded-xl text-center transition-all ${isActive
                          ? `${info.bgColor} ring-2 ring-offset-2 ring-${info.color.replace('text-', '')} scale-105`
                          : `${info.bgColor} hover:scale-105`
                          }`}
                      >
                        <StatusIcon className={`w-4 h-4 mx-auto ${info.color}`} />
                        <p className={`text-lg font-bold mt-1 ${isActive ? info.color : 'text-foreground'}`}>
                          {item.count}
                        </p>
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Applied Jobs List */}
              <div className="space-y-3">
                {appliedJobs
                  .filter(job => job.status === appliedJobsStatusFilter)
                  .sort((a, b) => {
                    // Sort interviews by date/time
                    if (a.status === "interview" && b.status === "interview" && a.interviewSchedule && b.interviewSchedule) {
                      return new Date(a.interviewSchedule.date).getTime() - new Date(b.interviewSchedule.date).getTime();
                    }
                    return 0;
                  })
                  .map((job, index) => {
                    const statusInfo = getStatusInfo(job.status);
                    const StatusIcon = statusInfo.icon;
                    const isInterview = job.status === "interview" && job.interviewSchedule;
                    const isExpanded = expandedJobId === job.id;

                    return (
                      <div
                        key={job.id}
                        className="card-elevated p-4 animate-fade-in hover:shadow-lg transition-all"
                        style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                      >
                        <div className="flex gap-3">
                          <img
                            src={job.logo}
                            alt={job.company}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-foreground line-clamp-1">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.company}
                                </p>
                              </div>
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusInfo.bgColor}`}>
                                <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                                <span className={`text-xs font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {job.salary}
                              </span>
                            </div>

                            {/* Minimal interview info when collapsed */}
                            {isInterview && !isExpanded && (
                              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-primary" />
                                  {job.interviewSchedule.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-primary" />
                                  {job.interviewSchedule.time}
                                </span>
                              </div>
                            )}

                            {/* Interview Schedule Details - Only show when expanded */}
                            {isInterview && isExpanded && (
                              <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-600">Interview Scheduled</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <p className="text-muted-foreground mb-1">Date & Time</p>
                                    <p className="font-medium text-foreground">{job.interviewSchedule.date}</p>
                                    <p className="font-medium text-foreground">{job.interviewSchedule.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Mode</p>
                                    <div className="flex items-center gap-1">
                                      <Video className="w-3 h-3 text-primary" />
                                      <span className="font-medium text-foreground capitalize">{job.interviewSchedule.mode}</span>
                                    </div>
                                  </div>
                                </div>

                                {job.interviewSchedule.interviewer && (
                                  <div className="text-xs pt-2 border-t border-blue-500/20">
                                    <p className="text-muted-foreground">Interviewer</p>
                                    <p className="font-medium text-foreground">{job.interviewSchedule.interviewer}</p>
                                  </div>
                                )}

                                {job.interviewSchedule.meetingLink && (
                                  <a
                                    href={job.interviewSchedule.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 mt-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-xs font-medium"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    Join Meeting
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Job Description for Interview - Only when expanded */}
                            {isInterview && isExpanded && job.jobDescription && (
                              <div className="mt-3 p-3 rounded-lg bg-secondary/50 space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-xs font-semibold text-foreground">Job Overview</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                  {job.jobDescription}
                                </p>
                              </div>
                            )}

                            {/* Recording Section - Only when expanded */}
                            {isInterview && isExpanded && (
                              <>
                                <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Mic className="w-4 h-4 text-amber-600" />
                                      <span className="text-xs font-semibold text-amber-600">Interview Recording</span>
                                    </div>
                                    {job.hasRecording ? (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                                        Recorded
                                      </span>
                                    ) : (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                        Not Started
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {job.hasRecording
                                      ? "Your interview was recorded and sent to the recruiter for review."
                                      : "Interview will be automatically recorded when you join the meeting. Recording will be shared with the recruiter."}
                                  </p>
                                </div>

                                {/* Reminder and Reschedule buttons */}
                                <div className="flex items-center gap-2 mt-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast({
                                        title: "Reminder Set!",
                                        description: `You'll be notified 30 mins before the interview with ${job.company}`,
                                      });
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors text-xs font-medium"
                                  >
                                    <Bell className="w-3.5 h-3.5" />
                                    Set Reminder
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast({
                                        title: "Reschedule Request Sent",
                                        description: `The recruiter at ${job.company} will receive your request and contact you soon.`,
                                      });
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors text-xs font-medium"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Request Reschedule
                                  </button>
                                </div>
                              </>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Send className="w-3 h-3" />
                                  Applied {job.appliedDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Updated {job.lastUpdate}
                                </span>
                              </div>
                              <button
                                onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                                className="text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
                              >
                                {isExpanded ? "Hide Details" : "View Details"}
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Empty State for Filtered Results */}
                {appliedJobs.filter(job => job.status === appliedJobsStatusFilter).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Send className="w-10 h-10 text-blue-600 opacity-70" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">No Jobs Found</h3>
                    <p className="text-sm max-w-xs mx-auto">
                      No applications found with "{getStatusInfo(appliedJobsStatusFilter).label}" status.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click another status tab to view different applications
                    </p>
                  </div>
                )}
              </div>

              {/* Applied Jobs Footer */}
              <div className="card-elevated p-4 mt-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {`Showing ${appliedJobs.filter(j => j.status === appliedJobsStatusFilter).length} ${getStatusInfo(appliedJobsStatusFilter).label.toLowerCase()} application${appliedJobs.filter(j => j.status === appliedJobsStatusFilter).length !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default JobTracker;
