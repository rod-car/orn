import { ReactNode, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom'

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

import { useApi, useAuth } from 'hooks'
import { config, getToken } from '@renderer/config'
import { DropDown, ErrorComponent, Navigation, UserMenu } from '@renderer/components'

export function MeasureRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { user, logout, loading } = useAuth({ baseUrl: config.baseUrl })
    const token = getToken()

    const localUser = user()
    const userData = localUser && localUser.name ? localUser : null

    const { Client } = useApi<User>({
        baseUrl: config.baseUrl,
        url: '/auth',
        token: token
    })

    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async (): Promise<void> => {
            const users = await Client.get({}, '/user')
            if (users.length === 0) {
                localStorage.removeItem('user')
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
                                <NavLink className={`nav-link`} aria-current="page" to="/anthropo-measure">
                                    <i className="fa fa-gauge me-2"></i>Tableau de bord
                                </NavLink>
                            </li>
                            <DropDown
                                id="student-dropdown"
                                label="Étudiants"
                                base="/anthropo-measure/student"
                                icon="users"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Ajouter un étudiant',
                                        icon: 'plus',
                                        can: userData?.role !== 0
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des étudiants',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/import',
                                        label: 'Importer une liste',
                                        icon: 'file',
                                        can: userData?.role !== 0
                                    }
                                ]}
                            ></DropDown>

                            <DropDown
                                id="school-dropdown"
                                label="Écoles"
                                base="/anthropo-measure/school"
                                icon="school"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Ajouter un école',
                                        icon: 'plus',
                                        can: userData?.role !== 0
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des écoles',
                                        icon: 'list'
                                    },
                                    { url: '/classes/list', label: 'Classe', icon: 'list', can: userData?.role !== 0 },
                                    { url: '/levels/list', label: 'Niveau', icon: 'list', can: userData?.role !== 0 }
                                ]}
                            ></DropDown>

                            {userData?.role !== 0 && 
                                <DropDown
                                    id="abaques"
                                    label="Abaques"
                                    base="/anthropo-measure/measure"
                                    icon="database"
                                    items={[
                                        { url: '/add', label: 'Ajouter', icon: 'plus' },
                                        { url: '/list', label: 'Liste', icon: 'list' },
                                        {
                                            url: '/import',
                                            label: 'Importer une liste',
                                            icon: 'file'
                                        }
                                    ]}
                                ></DropDown>
                            }

                            <DropDown
                                id="anthropo-measure"
                                label="Mesure antropo"
                                base="/anthropo-measure/survey"
                                icon="ruler"
                                items={[
                                    { url: '/add', label: 'Nouvelle mesure', icon: 'plus', can: userData?.role !== 0 },
                                    {
                                        url: '/list',
                                        label: 'Liste des mesures',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/add-student',
                                        label: 'Mesurer un étudiant',
                                        icon: 'user-plus',
                                        can: userData?.role !== 0
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
                {userData !== null && <Navigation />}
                {error ? <ErrorComponent error={errorResponse.error ?? {
                    status: 500,
                    statusText: "Une erreur est survenue",
                    data: null
                }} /> : <Outlet />}
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
