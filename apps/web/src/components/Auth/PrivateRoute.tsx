import { PropsWithChildren, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from 'hooks'

export function PrivateRoute({ children }: PropsWithChildren): ReactNode {
    const { token, resetUser } = useAuthStore()
    if (!token) {
        resetUser()
        return <Navigate to="/auth/login" replace />
    }
    return children
}
