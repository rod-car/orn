import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { ErrorResponse, Outlet, useRouteError } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css?asset'
import 'bootstrap/dist/css/bootstrap.min.css?asset'
import '@popperjs/core/dist/esm/index.js?asset'
import 'bootstrap/dist/js/bootstrap.bundle.min.js?asset'
import '@fortawesome/fontawesome-free/js/all.min.js?asset'
import 'react-confirm-alert/src/react-confirm-alert.css?asset'
import 'react-toastify/dist/ReactToastify.css?asset'

import '@renderer/assets/icons.css?asset'
import '@renderer/assets/custom.css?asset'
import { ErrorComponent, ProgressBar } from '@renderer/components'

export function AuthRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }

    return (
        <div>
            <ToastContainer />
            <ProgressBar />
            {error ? <ErrorComponent error={errorResponse.error} /> : <Outlet />}
        </div>
    )
}
