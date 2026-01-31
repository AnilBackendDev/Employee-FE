import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ExperienceLevelSelection = () => {
    const navigate = useNavigate();

    const handleSelection = (level: 'experienced' | 'fresher') => {
        // Store experience level in localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.experienceLevel = level;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        toast.success(`Profile set as ${level === 'experienced' ? 'Experienced Professional' : 'Fresher'}!`);

        // Navigate to appropriate section
        if (level === 'experienced') {
            navigate('/resume/experience');
        } else {
            navigate('/fresher-profile');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-lg">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Let's Build Your Profile
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choose your experience level to customize your profile
                    </p>
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {/* Experienced Option */}
                    <button
                        onClick={() => handleSelection('experienced')}
                        className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                <Briefcase className="w-7 h-7 text-white" />
                            </div>

                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                I'm Experienced
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                I have professional work experience
                            </p>

                            <div className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-semibold">
                                Continue
                            </div>
                        </div>
                    </button>

                    {/* Fresher Option */}
                    <button
                        onClick={() => handleSelection('fresher')}
                        className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-200 text-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>

                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                I'm a Fresher
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                I'm new to the professional world
                            </p>

                            <div className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg text-sm font-semibold">
                                Continue
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        💡 Don't worry, you can always update this later in your profile settings
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExperienceLevelSelection;
