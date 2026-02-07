const API_BASE_URL = 'http://localhost:8082/api/v1/candidate';

export interface Education {
    id?: number;
    degree: string;
    institution: string;
    graduationYear: number;
}

export interface Experience {
    id?: number;
    companyName: string;
    designation: string;
    fromDate: string;
    toDate: string;
}

export interface CandidateProfile {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    summary: string;
    linkedin: string;
    website: string;
    totalExperience: number;
    currentCtc: number;
    expectedCtc: number;
    location: string;
    educations: Education[];
    experiences: Experience[];
}

export const candidateService = {
    getProfile: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/profile?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json() as CandidateProfile;
    },

    updateProfile: async (profile: CandidateProfile) => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return await response.json() as CandidateProfile;
    },
};
