import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = User & {is_admin: boolean, is_super_user: boolean, is_visitor: boolean} | undefined | null;

interface AuthStore {
    isLoggedIn: boolean;
    user: { username: string, name: string, email: string, role: string, school: School | null } | null,
    isAdmin: boolean;
    isSuperuser: boolean;
    isVisitor: boolean;
    lastLogin?: string;
    token: string | null | undefined;
    login: (Client: unknown, data: Record<string, unknown>) => Promise<any>;
    register: (Client: unknown, data: Record<string, unknown>) => Promise<any>;
    logout: (Client: unknown) => Promise<any>;
    resetUser: () => void;
    updateUser: (data: { username: string, name: string, email: string, role: string, school: School | null }) => void;
}

const defaultState = { isLoggedIn: false, user: null, token: null, isAdmin: false, isSuperuser: false, isVisitor: false }

export const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            isLoggedIn: false,
            user: null,
            token: null,
            isAdmin: false,
            isSuperuser: false,
            isVisitor: false,
            lastLogin: undefined,
            login: async (Client, data) => {
                await Client.get({ prefix: false, replace: 'api' }, '/sanctum/csrf-cookie')
                const response = await Client.post(data, '/login')

                if (response.ok) {
                    const user: AuthUser = response.data.user

                    if (user) set(getStoredUser(user, response.data.token))
                    return response
                } else {
                    localStorage.removeItem('token')
                    set(defaultState);
                    return response.response
                }
            },
            resetUser: () => { set(defaultState); },
            updateUser: (data) => { set({user: data}) },
            logout: async (Client) => {
                const response = await Client.post({}, '/logout')

                if (response.ok) {
                    set(defaultState);
                    localStorage.clear();
                    return response
                } else {
                    return response.response
                }
            },
            register: async (Client, data): Promise<any> => {
                const response = await Client.post(data, '/register')
                if (response.ok) {
                    const user: AuthUser | undefined | null = response.data.user
                    if (user) set(getStoredUser(user, response.data.token))
                    return response
                } else {
                    set(defaultState);
                    return response.response
                }
            }
        }),
        {
            name: 'authStatus',
        }
    )
);

function getStoredUser(user: AuthUser, token: string) {
    return {
        isLoggedIn: true,
        user: {
            username: user!.username,
            email: user!.email,
            name: user!.name,
            school: user!.school,
            role: user?.is_super_user ? "SAdmin" : (user?.is_admin ? "Admin" : "Invité")
        },
        isVisitor: user?.is_visitor === true,
        isAdmin: user?.is_admin === true,
        isSuperuser: user?.is_super_user === true,
        token: token,
        lastLogin: new Date().toDateString()
    }
}