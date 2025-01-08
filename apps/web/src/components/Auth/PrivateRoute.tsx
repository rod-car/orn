import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from 'hooks'

export function PrivateRoute({ children, can = []}: {can?: string[]} & PropsWithChildren): ReactNode {
    const { token, resetUser, isSuperuser, isAdmin } = useAuthStore()

    const isAuthorized = useMemo(() => {
        return can.length === 0 ||
        (can.includes("admin") && isAdmin) ||
        (can.includes("super-admin") && isSuperuser)
    }, [can])

    if (!token) {
        resetUser()
        return <Navigate to="/orn/auth/login" replace />
    }

    if (!isAuthorized) return <Navigate to="/orn/forbidden" replace />
    return children
}
