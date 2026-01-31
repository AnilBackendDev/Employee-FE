import React, { createContext, useContext, useState, ReactNode } from 'react';

// User roles
export type UserRole = 'ta' | 'hrms' | 'cto' | 'ceo' | 'candidate';

// User interface
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

// Mock users for demo
export const mockUsers: Record<string, User> = {
    'ta1': { id: 'ta1', name: 'John Doe', email: 'john@company.com', role: 'ta' },
    'ta2': { id: 'ta2', name: 'Sarah Smith', email: 'sarah@company.com', role: 'ta' },
    'ta3': { id: 'ta3', name: 'Mike Johnson', email: 'mike@company.com', role: 'ta' },
    'hrms': { id: 'hrms', name: 'HR Manager', email: 'hr@company.com', role: 'hrms' },
    'cto': { id: 'cto', name: 'Tech Leader', email: 'cto@company.com', role: 'cto' },
    'ceo': { id: 'ceo', name: 'Company CEO', email: 'ceo@company.com', role: 'ceo' },
};

// Context type
interface UserContextType {
    user: User | null;
    login: (userId: string) => void;
    logout: () => void;
    isAdmin: () => boolean;
    isTA: () => boolean;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Check localStorage for existing session
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    });

    const login = (userId: string) => {
        const foundUser = mockUsers[userId];
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const isAdmin = () => {
        return user?.role === 'hrms' || user?.role === 'cto' || user?.role === 'ceo';
    };

    const isTA = () => {
        return user?.role === 'ta';
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isAdmin, isTA }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Role-based access helper
export const canAccess = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(userRole);
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
        case 'ta':
            return 'Talent Acquisition';
        case 'hrms':
            return 'HR Manager';
        case 'cto':
            return 'CTO';
        case 'ceo':
            return 'CEO';
        case 'candidate':
            return 'Candidate';
        default:
            return 'Unknown';
    }
};
