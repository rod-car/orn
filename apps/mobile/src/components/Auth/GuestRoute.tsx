import { PropsWithChildren, ReactNode } from 'react'
import { useAuthStore } from 'hooks'

export function GuestRoute({ children }: PropsWithChildren): ReactNode {
    /*const { token } = useAuthStore()
    if (token) {
        setTimeout(() => window.location.href = "/", 1000)
    }*/
    return children
}
