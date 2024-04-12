// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { PropsWithChildren, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from 'hooks'
import { config } from '../config'

export function PrivateRoute({ children }: PropsWithChildren): ReactNode {
    const { user } = useAuth<User>({
        baseUrl: config.baseUrl
    })

    const userData = user()

    if (!userData) {
        window.electron.ipcRenderer.send('logged-out', true)
        return <Navigate to="/login" replace />
    }

    return children
}
