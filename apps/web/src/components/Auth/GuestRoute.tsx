import { PropsWithChildren, ReactNode } from 'react'
import { useAuthStore } from 'hooks'

export function GuestRoute({ children }: PropsWithChildren): ReactNode {
    const { isTokenValid } = useAuthStore()

    if (isTokenValid()) {
        setTimeout(() => window.location.href = "/", 1000)
    }
    return children;
}
