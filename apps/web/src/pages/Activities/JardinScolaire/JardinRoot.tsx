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

export function JardinRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { token, resetUser, user } = useAuthStore()

    const { Client } = useApi<User>({
        baseUrl: config.baseUrl,
        url: '/auth'
    })

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
                                <NavLink className={`nav-link`} aria-current="page" to="/scholar-garden">
                                    <i className="fa fa-home me-2"></i>Accueil
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/scholar-garden/engrais">
                                    <i className="fa fa-cheese me-2"></i>Engrais
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/scholar-garden/semences">
                                    <i className="fa fa-seedling me-2"></i>Sémences
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/scholar-garden/materiels">
                                    <i className="fa fa-screwdriver-wrench me-2"></i>Matériels
                                </NavLink>
                            </li>
                            <DropDown
                                id="activities-dropdown"
                                label="Gérer les jardins"
                                base="/scholar-garden"
                                icon="cog"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Nouveau jardin',
                                        icon: 'plus'
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des jardins',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/steps',
                                        label: 'Etapes',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/steps-data',
                                        label: 'Ajouter des données',
                                        icon: 'list'
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