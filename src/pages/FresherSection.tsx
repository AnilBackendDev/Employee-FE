import { Award, Github, ExternalLink, Plus, X, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Certification {
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    url: string;
    technologies: string[];
}

const FresherSection = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [showCertModal, setShowCertModal] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);

    // Certification form state
    const [certForm, setCertForm] = useState({ title: "", issuer: "", date: "", credentialUrl: "" });

    // Achievement form state
    const [achievementForm, setAchievementForm] = useState({ title: "", description: "", date: "" });

    // Project form state
    const [projectForm, setProjectForm] = useState({ name: "", description: "", url: "", technologies: "" });

    const handleAddCertification = () => {
        if (!certForm.title || !certForm.issuer || !certForm.date) {
            toast.error("Please fill all required fields");
            return;
        }

        const newCert: Certification = {
            id: Date.now().toString(),
            ...certForm
        };

        setCertifications([...certifications, newCert]);
        setCertForm({ title: "", issuer: "", date: "", credentialUrl: "" });
        setShowCertModal(false);
        toast.success("Certification added!");
    };

    const handleAddAchievement = () => {
        if (!achievementForm.title || !achievementForm.description) {
            toast.error("Please fill all required fields");
            return;
        }

        const newAchievement: Achievement = {
            id: Date.now().toString(),
            ...achievementForm
        };

        setAchievements([...achievements, newAchievement]);
        setAchievementForm({ title: "", description: "", date: "" });
        setShowAchievementModal(false);
        toast.success("Achievement added!");
    };

    const handleAddProject = () => {
        if (!projectForm.name || !projectForm.url) {
            toast.error("Please fill all required fields");
            return;
        }

        const newProject: Project = {
            id: Date.now().toString(),
            name: projectForm.name,
            description: projectForm.description,
            url: projectForm.url,
            technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
        };

        setProjects([...projects, newProject]);
        setProjectForm({ name: "", description: "", url: "", technologies: "" });
        setShowProjectModal(false);
        toast.success("Project added!");
    };

    const removeCertification = (id: string) => {
        setCertifications(certifications.filter(c => c.id !== id));
        toast.success("Certification removed");
    };

    const removeAchievement = (id: string) => {
        setAchievements(achievements.filter(a => a.id !== id));
        toast.success("Achievement removed");
    };

    const removeProject = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
        toast.success("Project removed");
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-gray-900">Fresher Profile</h1>
                <p className="text-gray-600 text-sm mt-1">Showcase your skills, certifications, and projects</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Certifications Section */}
                <div className="card-elevated p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                                <p className="text-sm text-gray-500">Add your professional certifications</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCertModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Certification
                        </button>
                    </div>

                    {certifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No certifications added yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                                        <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                                        {cert.credentialUrl && (
                                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                                View Credential <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <button onClick={() => removeCertification(cert.id)} className="text-red-500 hover:text-red-700">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Achievements Section */}
                <div className="card-elevated p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
                                <p className="text-sm text-gray-500">Highlight your accomplishments</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAchievementModal(true)}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Achievement
                        </button>
                    </div>

                    {achievements.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No achievements added yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                        {achievement.date && <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>}
                                    </div>
                                    <button onClick={() => removeAchievement(achievement.id)} className="text-red-500 hover:text-red-700">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Projects/GitHub Section */}
                <div className="card-elevated p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                <Github className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Projects & GitHub Repositories</h2>
                                <p className="text-sm text-gray-500">Showcase your coding projects</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Project
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Github className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No projects added yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {projects.map((project) => (
                                <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                {project.name}
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                            {project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {project.technologies.map((tech, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => removeProject(project.id)} className="text-red-500 hover:text-red-700">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Certification Modal */}
            {showCertModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add Certification</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Certification Title *</label>
                                <input
                                    type="text"
                                    value={certForm.title}
                                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., AWS Certified Developer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                                <input
                                    type="text"
                                    value={certForm.issuer}
                                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Amazon Web Services"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Issue Date *</label>
                                <input
                                    type="month"
                                    value={certForm.date}
                                    onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Credential URL (Optional)</label>
                                <input
                                    type="url"
                                    value={certForm.credentialUrl}
                                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleAddCertification} className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    Add
                                </button>
                                <button onClick={() => setShowCertModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievement Modal */}
            {showAchievementModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add Achievement</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Achievement Title *</label>
                                <input
                                    type="text"
                                    value={achievementForm.title}
                                    onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Hackathon Winner"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    value={achievementForm.description}
                                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                    placeholder="Describe your achievement..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Date (Optional)</label>
                                <input
                                    type="month"
                                    value={achievementForm.date}
                                    onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleAddAchievement} className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                                    Add
                                </button>
                                <button onClick={() => setShowAchievementModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add Project</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Project Name *</label>
                                <input
                                    type="text"
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                                    placeholder="e.g., Portfolio Website"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                                    rows={3}
                                    placeholder="Brief description of the project..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Project/GitHub URL *</label>
                                <input
                                    type="url"
                                    value={projectForm.url}
                                    onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                                    placeholder="https://github.com/username/project"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                                <input
                                    type="text"
                                    value={projectForm.technologies}
                                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                                    placeholder="React, Node.js, MongoDB"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleAddProject} className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                                    Add
                                </button>
                                <button onClick={() => setShowProjectModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FresherSection;
