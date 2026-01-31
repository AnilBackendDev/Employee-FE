import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    Users,
    Crown,
    Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Trainer {
    id: string;
    name: string;
    title: string;
    avatar: string;
    rating: number;
    reviews: number;
    students: number;
    pricePerMonth: number;
    skills: string[];
    specialization: string;
    isPremium: boolean;
}

// Mock trainers data
const trainersData: Trainer[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        title: "Senior Frontend Architect",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop",
        rating: 4.9,
        reviews: 127,
        students: 340,
        pricePerMonth: 15000,
        skills: ["React", "TypeScript", "Next.js"],
        specialization: "Frontend Development",
        isPremium: true,
    },
    {
        id: "2",
        name: "Michael Chen",
        title: "Full Stack Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop",
        rating: 4.8,
        reviews: 95,
        students: 280,
        pricePerMonth: 12000,
        skills: ["React", "Node.js", "MongoDB"],
        specialization: "Full Stack Development",
        isPremium: false,
    },
    {
        id: "3",
        name: "Emily Rodriguez",
        title: "React & TypeScript Expert",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop",
        rating: 5.0,
        reviews: 203,
        students: 520,
        pricePerMonth: 18000,
        skills: ["React", "TypeScript", "Testing"],
        specialization: "Advanced React",
        isPremium: true,
    },
    {
        id: "4",
        name: "David Kumar",
        title: "JavaScript Specialist",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop",
        rating: 4.7,
        reviews: 82,
        students: 210,
        pricePerMonth: 10000,
        skills: ["JavaScript", "Performance", "Web APIs"],
        specialization: "JavaScript & Performance",
        isPremium: false,
    },
];

const ConnectTrainers = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTrainers = trainersData.filter((trainer) =>
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSelectTrainer = (trainer: Trainer) => {
        navigate("/interview/payment", { state: { trainer } });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-lg mx-auto">
                {/* Clean Header */}
                <div className="sticky top-0 z-10 bg-background border-b border-border">
                    <div className="flex items-center gap-3 px-4 py-4">
                        <button
                            onClick={() => navigate("/interview")}
                            className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-foreground">Expert Trainers</h1>
                            <p className="text-xs text-muted-foreground">1-on-1 coaching & mentorship</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 pb-24">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or skills..."
                            className="pl-10"
                        />
                    </div>

                    {/* Trainers Grid */}
                    <div className="space-y-3">
                        {filteredTrainers.map((trainer, index) => (
                            <div
                                key={trainer.id}
                                className="card-elevated p-4 hover:shadow-lg transition-all cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => handleSelectTrainer(trainer)}
                            >
                                {/* Header */}
                                <div className="flex gap-3 mb-3">
                                    <img
                                        src={trainer.avatar}
                                        alt={trainer.name}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                                    {trainer.name}
                                                    {trainer.isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">{trainer.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                <span className="text-sm font-semibold">{trainer.rating}</span>
                                                <span className="text-xs text-muted-foreground">({trainer.reviews})</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Users className="w-3.5 h-3.5" />
                                                <span className="text-xs">{trainer.students} students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {trainer.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monthly</p>
                                        <p className="text-lg font-bold text-foreground">₹{(trainer.pricePerMonth / 1000).toFixed(0)}k</p>
                                    </div>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${trainer.isPremium
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                                                : "bg-primary text-primary-foreground"
                                            }`}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTrainers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No trainers found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectTrainers;
