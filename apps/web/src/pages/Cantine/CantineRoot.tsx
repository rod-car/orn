import { ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom'
import { useApi, useAuthStore } from 'hooks'
import { config } from '@base/config'
import { DropDown, ErrorComponent, Navigation, ProgressBar, UserMenu, NotFound, Header, Footer } from '@base/components'
import { useNotFoundRoute } from '@base/hooks'

import '@base/assets'

export function CantineRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { token, user, resetUser, isAdmin } = useAuthStore()

    const { Client } = useApi<User>({
        baseUrl: config.baseUrl,
        url: '/auth'
    })

    const navigate = useNavigate()
    const { notFound, path } = useNotFoundRoute()

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
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top mb-5 p-0">
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
                                <NavLink className={`nav-link`} aria-current="page" to="/cantine">
                                    <i className="fa fa-gauge me-2"></i>Tableau de bord
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/cantine/statistics">
                                    <i className="fa fa-bar-chart me-2"></i>Statistiques
                                </NavLink>
                            </li>
                            <DropDown
                                id="student-dropdown"
                                label="Consommations"
                                base="/cantine"
                                icon="users"
                                items={[
                                    {
                                        url: '/add-conso',
                                        label: 'Ajouter un consommation',
                                        icon: 'plus',
                                        can: isAdmin
                                    },
                                    {
                                        url: '/list-conso',
                                        label: 'Liste des consommations',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/import-conso',
                                        label: 'Importer des consommations',
                                        icon: 'file',
                                        can: isAdmin
                                    }
                                ]}
                            />
                            <UserMenu />
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mb-5" style={{ marginTop: 130, minHeight: '90vh' }}>
                <ToastContainer />
                {user && <Navigation />}
                {error ? <ErrorComponent error={errorResponse.error ?? {
                    status: 500,
                    statusText: "Une erreur s'est produite",
                    data: null
                }} /> : (notFound ? <NotFound path={path} /> : <Outlet />)}
            </div>

            <Footer />
        </>
    )
}
