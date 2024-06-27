import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = User & {is_admin: boolean, is_super_user: boolean, is_visitor: boolean} | undefined | null;

interface AuthStore {
    isLoggedIn: boolean;
    user: AuthUser,
    isAdmin: boolean;
    isSuperuser: boolean;
    isVisitor: boolean;
    token: string | null | undefined;
    login: (Client: unknown, data: Record<string, unknown>) => Promise<any>;
    register: (Client: unknown, data: Record<string, unknown>) => Promise<any>;
    logout: (Client: unknown) => Promise<any>;
    resetUser: () => void;
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
            login: async (Client, data) => {
                await Client.get({ prefix: false, replace: 'api' }, '/sanctum/csrf-cookie')
                const response = await Client.post(data, '/login')

                if (response.ok) {
                    const user: AuthUser = response.data.user
                    set({
                        isLoggedIn: true,
                        user: user,
                        isVisitor: user?.is_visitor === true,
                        isAdmin: user?.is_admin === true,
                        isSuperuser: user?.is_super_user === true,
                        token: response.data.token,
                    });
                    return response
                } else {
                    localStorage.removeItem('token')
                    set(defaultState);
                    return response.response
                }
            },
            resetUser: () => { set(defaultState); },
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
                    if (user) {
                        set({
                            isLoggedIn: true,
                            user: user,
                            isVisitor: user?.is_visitor === true,
                            isAdmin: user?.is_admin === true,
                            isSuperuser: user?.is_super_user === true,
                            token: response.data.token
                        });
                    }
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