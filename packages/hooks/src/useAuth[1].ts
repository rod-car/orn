import { useApi } from './useApi'

export function useAuth<T>({ baseUrl }: { baseUrl: string }) {
    const userData = JSON.parse(localStorage.getItem('user') ?? '[]')

    const { Client, RequestState } = useApi<T>({
        baseUrl: baseUrl,
        url: '/auth',
        token: userData.token
    })

    const user = (): User | null => {
        const storedUser = JSON.parse(localStorage.getItem('user') ?? '{}')
        if (storedUser !== null) return storedUser.user
        return null
    }

    const login = async (data: Partial<T>): Promise<any> => {
        await Client.get({ prefix: false, replace: 'api' }, '/sanctum/csrf-cookie')
        const response = await Client.post(data, '/login')

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(response.data))
            return response
        } else {
            localStorage.removeItem('user')
            return response.response
        }
    }

    const register = async (data: Partial<T>): Promise<any> => {
        const response = await Client.post(data, '/register')
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(response.data))
            return response
        } else {
            localStorage.removeItem('user')
            return response.response
        }
    }

    const logout = async (): Promise<any> => {
        const response = await Client.post({}, '/logout')

        if (response.ok) {
            localStorage.removeItem('user')
            return response
        } else {
            return response.response
        }
    }

    return { user, login, loading: RequestState.creating, register, logout }
}