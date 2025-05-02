/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useAuthStore } from 'hooks';
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { ErrorComponent, Footer, Header, ProgressBar } from '@base/components';
import { ErrorResponse, Outlet, useNavigate, useRouteError } from 'react-router-dom';
import { NotFound, Forbidden } from '@base/pages/Errors';
import { useNotFoundRoute } from '@base/hooks';

import '@base/assets';

export function AppRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse, status: number }
    const { token, resetUser } = useAuthStore()
    const { Client } = useApi<User>({ url: '/auth' })

    useEffect(() => {
        /*const getUser = async (): Promise<void> => {
            const users = await Client.get({}, '/user')
            if (users.length === 0) {
                resetUser()
                window.location.href = '/auth/login'
            }
        }
        getUser()*/
    }, [token])

    const { notFound, path } = useNotFoundRoute()

    return <>
        {(errorResponse === null && error === true) ? <Forbidden /> : ((notFound || errorResponse?.status === 404) ? <NotFound path={path} /> : <>
            <ProgressBar />
            <Header />
            <div className="app-wrapper" style={{ marginTop: 50 }}>
                <div className="app-content pt-3 p-md-3 p-lg-4">
                    <div className="container-xl">
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
