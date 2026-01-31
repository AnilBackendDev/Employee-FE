import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Mic,
    MicOff,
    Play,
    Square,
    Volume2,
    Brain,
    Sparkles,
    CheckCircle2,
    MessageSquare,
    Trophy,
    Clock,
    Pause,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type InterviewStage = "setup" | "starting" | "interviewing" | "completed";
type MessageRole = "ai" | "candidate";

interface Message {
    id: number;
    role: MessageRole;
    text: string;
    timestamp: Date;
}

const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
];

// AI Interviewer questions bank - more conversational
const conversationalQuestions: Record<string, string[]> = {
    "Frontend Developer": [
        "Hi! Welcome to your interview. I'm excited to learn about your experience. Let's start - can you tell me about a recent project you worked on with React?",
        "That's interesting! Now, walk me through how you would optimize a slow-loading React application.",
        "Great approach! Let me ask you this - how do you handle state management in larger applications?",
        "I see you have good knowledge there. One more question - can you explain the difference between controlled and uncontrolled components?",
        "Excellent! Finally, how do you ensure your applications are accessible to all users?",
    ],
    "Backend Developer": [
        "Welcome! Let's dive right in. Tell me about your experience with API design and development.",
        "Interesting! How would you design a scalable REST API for a social media platform?",
        "Good thinking! Now, how do you handle authentication and authorization in your applications?",
        "That makes sense. What's your approach to database optimization and query performance?",
        "Great insights! Last question - how do you ensure your backend services are secure?",
    ],
    "Full Stack Developer": [
        "Hello! Great to meet you. Can you describe your experience working across both frontend and backend?",
        "Nice! How do you decide between using a monolithic vs microservices architecture?",
        "Thoughtful answer! Tell me about a challenging bug you've fixed that spanned both frontend and backend.",
        "Impressive problem-solving! How do you manage deployments and CI/CD in your projects?",
        "Excellent! Finally, what's your approach to testing full-stack applications?",
    ],
};

const PracticeInterview = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Setup state
    const [stage, setStage] = useState<InterviewStage>("setup");
    const [selectedRole, setSelectedRole] = useState<string>("");

    // Interview state
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
    const [currentTranscript, setCurrentTranscript] = useState("");
    const [isPaused, setIsPaused] = useState(false);
    const [sessionScore, setSessionScore] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Recording timer
    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRecording, isPaused]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStartInterview = () => {
        if (!selectedRole) {
            toast({
                title: "Select a Role",
                description: "Please select your target role first",
                variant: "destructive",
            });
            return;
        }

        setStage("starting");
        setInterviewStartTime(new Date());

        // Show welcome message
        setTimeout(() => {
            setStage("interviewing");
            const questions = conversationalQuestions[selectedRole] || conversationalQuestions["Frontend Developer"];

            // AI introduces itself
            addMessage("ai", "Hello! I'm your AI interviewer today. This is a safe space to practice - don't worry about making mistakes. I'm here to help you improve! Ready to begin?");

            setTimeout(() => {
                addMessage("ai", questions[0]);
            }, 2000);
        }, 2000);
    };

    const addMessage = (role: MessageRole, text: string) => {
        const newMessage: Message = {
            id: Date.now(),
            role,
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);

        // Speak AI messages (optional - can be implemented with Web Speech API)
        if (role === "ai" && "speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const audioChunks: Blob[] = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                // Here you would send audioBlob to your AI service for transcription
                console.log("Audio recorded:", audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            toast({
                title: "Recording Started",
                description: "Speak your answer clearly. Tap stop when done.",
            });

            // Simulate speech recognition (in real app, use Web Speech API or backend service)
            simulateSpeechRecognition();

        } catch (error) {
            toast({
                title: "Microphone Error",
                description: "Please allow microphone access to record your answer",
                variant: "destructive",
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setRecordingTime(0);

            if (currentTranscript) {
                submitAnswer(currentTranscript);
                setCurrentTranscript("");
            }
        }
    };

    const simulateSpeechRecognition = () => {
        // Simulated transcript - in real app, use speech-to-text API
        setTimeout(() => {
            setCurrentTranscript("I have worked on several React projects...");
        }, 3000);
    };

    const submitAnswer = (answer: string) => {
        // Add candidate's answer
        addMessage("candidate", answer);

        // AI gives encouraging feedback
        setTimeout(() => {
            const encouragements = [
                "Good answer! I like your approach.",
                "Interesting perspective! Let me follow up on that.",
                "Great! I can see you've thought about this.",
                "Nice explanation! That shows good understanding.",
            ];
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            addMessage("ai", randomEncouragement);

            // Calculate simple score
            const score = Math.floor(60 + Math.random() * 35); // 60-95
            setSessionScore((prev) => prev + score);

            // Move to next question or complete
            setTimeout(() => {
                const questions = conversationalQuestions[selectedRole] || conversationalQuestions["Frontend Developer"];
                const nextIndex = currentQuestionIndex + 1;

                if (nextIndex < questions.length) {
                    setCurrentQuestionIndex(nextIndex);
                    addMessage("ai", questions[nextIndex]);
                } else {
                    // Interview complete
                    addMessage("ai", "That concludes our interview! You did a great job. Let me prepare your feedback report...");
                    setTimeout(() => {
                        setStage("completed");
                    }, 3000);
                }
            }, 2000);
        }, 1500);
    };

    const handleQuickSubmit = () => {
        if (!currentTranscript) {
            toast({
                title: "No Response",
                description: "Please record your answer or type a response",
                variant: "destructive",
            });
            return;
        }
        submitAnswer(currentTranscript);
        setCurrentTranscript("");
    };

    // Setup Stage
    if (stage === "setup") {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-lg mx-auto">
                    <div className="sticky top-0 z-10 bg-background border-b border-border">
                        <div className="flex items-center gap-3 px-4 py-4">
                            <button
                                onClick={() => navigate("/interview")}
                                className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <h1 className="text-xl font-bold text-foreground">AI Mock Interview</h1>
                        </div>
                    </div>

                    <div className="p-4 space-y-6 pb-8">
                        {/* Hero */}
                        <div className="card-elevated p-6 text-center bg-gradient-to-br from-primary/10 to-purple-500/10">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-foreground mb-2">Conversational AI Interview</h2>
                            <p className="text-sm text-muted-foreground">
                                Practice with a supportive AI interviewer. Record your voice, get real-time feedback, and build confidence!
                            </p>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Select Your Target Role</label>
                            <div className="grid grid-cols-2 gap-2">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={`p-3 rounded-xl text-sm font-medium transition-all ${selectedRole === role
                                                ? "bg-primary text-primary-foreground shadow-md scale-105"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">What to Expect:</p>
                            {[
                                "🎙️ Voice recording for natural responses",
                                "💬 Conversational AI interviewer",
                                "📊 Real-time feedback & encouragement",
                                "🏆 Performance score after interview",
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartInterview}
                            disabled={!selectedRole}
                            className={`w-full p-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${selectedRole
                                    ? "bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 shadow-lg"
                                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            <Play className="w-5 h-5" />
                            Start AI Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Starting Stage
    if (stage === "starting") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-6 animate-pulse">
                        <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">Preparing Your Interview...</h2>
                    <p className="text-muted-foreground">
                        Your AI interviewer is getting ready. Take a deep breath and relax!
                    </p>
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Interviewing Stage
    if (stage === "interviewing") {
        const questions = conversationalQuestions[selectedRole] || conversationalQuestions["Frontend Developer"];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-lg mx-auto flex flex-col h-screen">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-background border-b border-border">
                        <div className="px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-sm font-medium text-foreground">Live Interview</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {interviewStartTime && formatTime(Math.floor((new Date().getTime() - interviewStartTime.getTime()) / 1000))}
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 animate-fade-in ${message.role === "ai" ? "justify-start" : "justify-end"
                                    }`}
                            >
                                {message.role === "ai" && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Brain className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] p-3 rounded-2xl ${message.role === "ai"
                                            ? "bg-secondary text-foreground rounded-tl-sm"
                                            : "bg-primary text-primary-foreground rounded-tr-sm"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                </div>
                                {message.role === "candidate" && (
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-border bg-background p-4 space-y-3">
                        {/* Recording Status */}
                        {isRecording && (
                            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-600">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
                            </div>
                        )}

                        {/* Transcript Preview */}
                        {currentTranscript && (
                            <div className="p-3 rounded-lg bg-secondary border border-border">
                                <p className="text-xs text-muted-foreground mb-1">Your answer:</p>
                                <p className="text-sm text-foreground">{currentTranscript}</p>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`flex-1 p-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${isRecording
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                    }`}
                            >
                                {isRecording ? (
                                    <>
                                        <Square className="w-4 h-4" />
                                        Stop Recording
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-4 h-4" />
                                        Record Answer
                                    </>
                                )}
                            </button>

                            {currentTranscript && (
                                <button
                                    onClick={handleQuickSubmit}
                                    className="px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                                >
                                    Submit
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-center text-muted-foreground">
                            Tap record, speak your answer, then tap stop to submit
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Completed Stage
    const averageScore = messages.filter(m => m.role === "candidate").length > 0
        ? Math.round(sessionScore / messages.filter(m => m.role === "candidate").length)
        : 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-lg mx-auto">
                <div className="sticky top-0 z-10 bg-background border-b border-border">
                    <div className="flex items-center gap-3 px-4 py-4">
                        <button
                            onClick={() => navigate("/interview")}
                            className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <h1 className="text-xl font-bold text-foreground">Interview Complete!</h1>
                    </div>
                </div>

                <div className="p-4 space-y-4 pb-8">
                    {/* Score Card */}
                    <div className="card-elevated p-6 text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                        <Trophy className="w-16 h-16 mx-auto text-emerald-500 mb-3" />
                        <h2 className="text-lg font-bold text-foreground mb-2">Great Job!</h2>
                        <div className="text-5xl font-bold text-emerald-500 mb-2">{averageScore}%</div>
                        <p className="text-sm text-muted-foreground">Average Performance Score</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="card-elevated p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{messages.filter(m => m.role === "candidate").length}</p>
                            <p className="text-xs text-muted-foreground">Answers</p>
                        </div>
                        <div className="card-elevated p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{messages.filter(m => m.role === "ai").length}</p>
                            <p className="text-xs text-muted-foreground">Questions</p>
                        </div>
                        <div className="card-elevated p-3 text-center">
                            <p className="text-2xl font-bold text-primary">
                                {interviewStartTime && Math.floor((new Date().getTime() - interviewStartTime.getTime()) / 60000)}m
                            </p>
                            <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="card-elevated p-4">
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            AI Feedback
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                                ✅ You showed good technical knowledge and communicated clearly
                            </p>
                            <p className="text-muted-foreground">
                                ✅ Your responses were well-structured and easy to follow
                            </p>
                            <p className="text-muted-foreground">
                                💡 Keep practicing to build even more confidence!
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                setStage("setup");
                                setMessages([]);
                                setCurrentQuestionIndex(0);
                                setSessionScore(0);
                                setCurrentTranscript("");
                            }}
                            className="p-3 rounded-xl font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate("/interview")}
                            className="p-3 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Back to Prep
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeInterview;
