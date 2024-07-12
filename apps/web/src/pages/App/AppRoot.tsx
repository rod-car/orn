/* eslint-disable react-hooks/exhaustive-deps */
import { config } from '@base/config'
import { useApi, useAuthStore } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { ErrorComponent, Footer, Header, ProgressBar } from '@base/components'
import { ErrorResponse, Outlet, useNavigate, useRouteError } from 'react-router-dom'

import '@base/assets'

export function AppRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { token, resetUser } = useAuthStore()
    const navigate = useNavigate()

    const { Client } = useApi<User>({
        baseUrl: config.baseUrl,
        url: '/auth'
    })

    useEffect(() => {
        const getUser = async (): Promise<void> => {
            const users = await Client.get({}, '/user')
            if (users.length === 0) {
                resetUser()
                navigate('/auth/login')
            }
        }
        getUser()
    }, [token])

    return (
        <>
            <ProgressBar />
            <Header />
            <div className="app-wrapper" style={{ marginTop: 50 }}>
                <div className="app-content pt-3 p-md-3 p-lg-4">
                    <div className="container-xl">
                        <ToastContainer />
                        {/*<Navigation />*/}
                        {error ? <ErrorComponent error={errorResponse.error} /> : <Outlet />}
                    </div>
                </div>
            </div>
            <Footer />
            {/*<nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top mb-5 p-0">
                <div className="container container-fluid">
                    <Header />
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/">
                                    <i className="fa fa-home me-2"></i>Accueil
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/anthropo-measure">
                                    <i className="fa fa-ruler me-2"></i>Mésure anthropo
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/cantine">
                                    <i className="fa fa-bowl-food me-2"></i>Cantine scolaire
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/activities">
                                    <i className="fa fa-cog me-2"></i>Activités
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/scholar-garden">
                                    <i className="fa fa-cog me-2"></i>Activités
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/prices">
                                    <i className="fa fa-money-bill me-2"></i>Prix sur le marché
                                </NavLink>
                            </li>
                            <UserMenu />
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mb-5" style={{ marginTop: 130, minHeight: '90vh' }}>
                <ToastContainer />
                <Navigation />
                {error ? <ErrorComponent error={errorResponse.error} /> : <Outlet />}
            </div>

            <Footer />*/}
        </>
    )
}
