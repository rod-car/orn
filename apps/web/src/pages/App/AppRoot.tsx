/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { ErrorComponent, Footer, Header, ProgressBar } from '@base/components';
import { ErrorResponse, Outlet, useRouteError } from 'react-router-dom';
import { NotFound, Forbidden } from '@base/pages/Errors';
import { useNotFoundRoute } from '@base/hooks';

import '@base/assets';
import { useApi, useAuthStore } from 'hooks';

export function AppRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse, status: number }
    const { notFound, path } = useNotFoundRoute()
    const { refreshUser } = useAuthStore()

    const { Client } = useApi({ url: '/auth' })

    useEffect(() => {
        refreshUser(Client)
    }, [])

    return <>
        {(errorResponse === null && error === true) ? <Forbidden /> : ((notFound || errorResponse?.status === 404) ? <NotFound path={path} /> : <>
            <ProgressBar />
            <Header />
            <div className="app-wrapper" style={{ marginTop: 50 }}>
                <div className="app-content pt-3 p-md-3 p-lg-4">
                    <div className="app-container container-xl">
                        <ToastContainer />
                        {error ? <ErrorComponent error={errorResponse?.error ?? {
                            status: 500,
                            statusText: "Une erreur est survenue",
                            data: null
                        }} /> : <Outlet />}
                    </div>
                </div>
            </div>
            <Footer />
        </>)}
    </>
}
