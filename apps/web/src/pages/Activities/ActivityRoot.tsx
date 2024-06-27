import { ReactNode, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom'
import { DropDown, ErrorComponent, Navigation, UserMenu } from '@renderer/components'

import 'react-toastify/dist/ReactToastify.css?asset'
import 'bootstrap/dist/css/bootstrap.min.css?asset'
import '@popperjs/core/dist/esm/index.js?asset'
import 'bootstrap/dist/js/bootstrap.bundle.min.js?asset'
import '@fortawesome/fontawesome-free/js/all.min.js?asset'
import 'react-confirm-alert/src/react-confirm-alert.css?asset'
import 'react-toastify/dist/ReactToastify.css?asset'

import '@renderer/assets/icons.css?asset'
import '@renderer/assets/custom.css?asset'
import logo from '@renderer/assets/logo.png'

import { useApi, useAuthStore } from 'hooks'
import { config } from '@renderer/config'

export function ActivityRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { token, resetUser, user } = useAuthStore()

    const { Client } = useApi<User>({ baseUrl: config.baseUrl, url: '/auth' })
    const navigate = useNavigate()

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
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top mb-5 p-0">
                <div className="container container-fluid">
                    <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
                        <img className="w-15 me-3" src={logo} alt="Logo" />
                        <span style={{ color: '#071E78', fontFamily: 'arial' }}>ORN</span>
                    </NavLink>
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
                                <NavLink className={`nav-link`} aria-current="page" to="/activities">
                                    <i className="fa fa-home me-2"></i>Nos dérnières activités
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/activities/statistics">
                                    <i className="fa fa-chart-pie me-2"></i>Statistiques
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/activities/list">
                                    <i className="fa fa-list me-2"></i>Tous nos activités
                                </NavLink>
                            </li>
                            <DropDown
                                id="activities-dropdown"
                                label="Gérer les activités"
                                base="/activities"
                                icon="cog"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Ajouter un activité',
                                        icon: 'plus'
                                    },
                                    {
                                        url: '/manage/list',
                                        label: 'Liste des activités',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/types',
                                        label: 'Type des activités',
                                        icon: 'table-list'
                                    }
                                ]}
                            ></DropDown>

                            <UserMenu />
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mb-5" style={{ marginTop: 130, minHeight: '90vh' }}>
                <ToastContainer />
                {user && <Navigation />}
                {error ? <ErrorComponent error={errorResponse.error} /> : <Outlet />}
            </div>

            <footer className="bg-light p-4">
                <div className="d-flex justify-content-between">
                    <p className="m-0">
                        &copy; Copyleft ORN Atsinanana {new Date().toLocaleDateString()}
                    </p>
                    <p className="m-0">
                        Developpé par: <a href="#">Gislain Carino Rodrigue BOUDI</a>
                    </p>
                </div>
            </footer>
        </>
    )
}