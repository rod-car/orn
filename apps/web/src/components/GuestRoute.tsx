// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PropsWithChildren, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from 'hooks'
import { config } from '@renderer/config'

export function GuestRoute({ children }: PropsWithChildren): ReactNode {
    const { user } = useAuth<User>({
        baseUrl: config.baseUrl
    })

    const userData = user()

    if (userData) {
        return <Navigate to="/" replace />
    }

    return children
}
