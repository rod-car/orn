import { PropsWithChildren, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from 'hooks'

export function GuestRoute({ children }: PropsWithChildren): ReactNode {
    const { token } = useAuthStore()
    if (token) {
        return <Navigate to="/" replace />
    }
    return children
}
