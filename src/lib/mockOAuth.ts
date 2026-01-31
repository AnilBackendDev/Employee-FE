// Mock OAuth Service for Development/Testing
// This simulates social media login when Supabase is not available

export interface MockOAuthUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    provider: 'google' | 'linkedin_oidc' | 'github';
}

export class MockOAuthService {
    private static simulateOAuthFlow(provider: 'google' | 'linkedin_oidc' | 'github'): Promise<MockOAuthUser> {
        return new Promise((resolve) => {
            // Simulate OAuth redirect delay
            setTimeout(() => {
                const mockUsers = {
                    google: {
                        id: 'google_' + Date.now(),
                        name: 'John Doe',
                        email: 'john.doe@gmail.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
                        provider: 'google' as const
                    },
                    linkedin_oidc: {
                        id: 'linkedin_' + Date.now(),
                        name: 'Jane Smith',
                        email: 'jane.smith@linkedin.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
                        provider: 'linkedin_oidc' as const
                    },
                    github: {
                        id: 'github_' + Date.now(),
                        name: 'Dev Developer',
                        email: 'dev@github.com',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev',
                        provider: 'github' as const
                    }
                };

                resolve(mockUsers[provider]);
            }, 1000); // Simulate 1 second OAuth flow
        });
    }

    static async signInWithOAuth(provider: 'google' | 'linkedin_oidc' | 'github'): Promise<{ data: { user: MockOAuthUser | null }, error: Error | null }> {
        try {
            const user = await this.simulateOAuthFlow(provider);
            return {
                data: { user },
                error: null
            };
        } catch (error) {
            return {
                data: { user: null },
                error: error as Error
            };
        }
    }

    static async getSession(): Promise<{ data: { session: { user: MockOAuthUser } | null } }> {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.provider && ['google', 'linkedin_oidc', 'github'].includes(user.provider)) {
                return {
                    data: {
                        session: { user }
                    }
                };
            }
        }
        return {
            data: { session: null }
        };
    }
}
