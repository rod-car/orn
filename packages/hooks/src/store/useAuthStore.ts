import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser =
    | User
    | null
    | undefined;

interface AuthStore {
    isLoggedIn: boolean;
    user: {
        username: string;
        name: string;
        email: string;
        role: string;
        school: School | null;
    } | null;
    lastLogin?: string;
    token: string | null | undefined;
    roles: string[];
    permissions: string[];
    login: (Client: any, data: Record<string, unknown>) => Promise<any>;
    register: (Client: any, data: Record<string, unknown>) => Promise<any>;
    logout: (Client: any) => Promise<any>;
    resetUser: () => void;
    updateUser: (data: {
        username: string;
        name: string;
        email: string;
        role: string;
        school: School | null;
    }) => void;
    isAllowed: (permission?: string | string[]) => boolean;
    hasRole: (role: string) => boolean;
    isTokenValid: () => boolean;
    refreshUser: (Client: any) => void;
}

const defaultState = {
    isLoggedIn: false,
    user: null,
    token: null,
    roles: [],
    permissions: [],
};

export const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            ...defaultState,

            login: async (Client, data) => {
                await Client.get(
                    { prefix: false, replace: "api" },
                    "/sanctum/csrf-cookie"
                );
                const response = await Client.post(data, "/login");

                if (response.ok && response.data.items) {
                    const data = response.data.items;

                    const user: AuthUser = data.user;
                    const roles: string[] = data.roles ?? [];
                    const permissions: string[] = data.permissions ?? [];

                    const expirationMinutes = import.meta.env.VITE_SANCTUM_EXPIRATION_TIME ?? 1440;
                    const expirationTime = Date.now() + expirationMinutes * 60 * 1000;
                    localStorage.setItem("tokenExpiration", expirationTime.toString());

                    if (user) {
                        set({
                            ...getStoredUser(user, data.token),
                            roles,
                            permissions,
                        });
                    }
                    return response;
                } else {
                    localStorage.removeItem("token");
                    set(defaultState);
                    return response.response;
                }
            },

            register: async (Client, data) => {
                const response = await Client.post(data, "/register");
                if (response.ok) {
                    const user: AuthUser = response.data.user;
                    const roles: string[] = response.data.roles ?? [];
                    const permissions: string[] = response.data.permissions ?? [];

                    if (user) {
                        set({
                            ...getStoredUser(user, response.data.token),
                            roles,
                            permissions,
                        });
                    }
                    return response;
                } else {
                    set(defaultState);
                    return response.response;
                }
            },

            logout: async (Client) => {
                const response = await Client.post({}, "/logout");

                if (response.ok) {
                    set(defaultState);
                    localStorage.clear();
                    return response;
                } else {
                    return response.response;
                }
            },

            resetUser: () => set(defaultState),

            updateUser: (data) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        ...data,
                    },
                }));
            },

            isAllowed: (permission?: string | string[]): boolean => {
                if (!permission) return false;

                const { permissions } = useAuthStore.getState();
                if (!permissions || permissions.length === 0) return false;
                if (Array.isArray(permission)) {
                    return permission.some(p => permissions.includes(p));
                }
                return permissions.includes(permission);
            },

            hasRole: (role: string): boolean => {
                const { roles } = useAuthStore.getState();
                return roles.includes(role);
            },

            isTokenValid: () => {
                const { token } = useAuthStore.getState();
                if (!token) return false;

                const expiration = localStorage.getItem('tokenExpiration');
                const now = Date.now();

                if (!expiration || now > parseInt(expiration)) {
                    return false;
                }
                return true;
            },

            refreshUser: async (Client) => {
                try {
                    const response = await Client.get({}, '/user');
                    if (response.items) {
                        const data = response.items;
                        const user = data.user;
                        const roles = data.roles ?? [];
                        const permissions = data.permissions ?? [];

                        if (user) {
                            set({
                                user: {
                                    username: user.username,
                                    email: user.email,
                                    name: user.name,
                                    school: user.school,
                                    role: user.role,
                                },
                                roles,
                                permissions,
                                isLoggedIn: true,
                                lastLogin: new Date().toDateString(),
                            });
                        }
                    } else {
                        console.error('Utilisateur no connecte');
                        set(defaultState);
                        localStorage.removeItem('authStatus');
                    }
                } catch (error) {
                    console.error('Erreur lors du rafraîchissement de l\'utilisateur :', error);
                    set(defaultState);
                    localStorage.removeItem('authStatus');
                }
            }
        }),
        {
            name: "authStatus",
        }
    )
);

/**
 * Get vlue structure of stored user
 * @param user 
 * @param token 
 * @returns 
 */
function getStoredUser(user: AuthUser, token: string) {
    return {
        isLoggedIn: true,
        user: {
            username: user!.username,
            email: user!.email,
            name: user!.name,
            school: user!.school,
            role: user!.role
        },
        token: token,
        lastLogin: new Date().toDateString(),
    };
}