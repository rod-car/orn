import { ReactNode } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom'
import { Navigation } from '../components'

import 'react-toastify/dist/ReactToastify.css?asset'
import 'bootstrap/dist/css/bootstrap.min.css?asset'
import '@popperjs/core/dist/esm/index.js?asset'
import 'bootstrap/dist/js/bootstrap.bundle.min.js?asset'
import '@fortawesome/fontawesome-free/js/all.min.js?asset'
import 'react-confirm-alert/src/react-confirm-alert.css?asset'
import 'react-toastify/dist/ReactToastify.css?asset'

import '../assets/icons.css?asset'
import '../assets/custom.css?asset'
import logo from '../assets/logo.png'

import { useAuth } from 'hooks'
import { config } from '../../config'
import { Button } from 'ui'

export function Root({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { user, logout, loading } = useAuth({ baseUrl: config.baseUrl })
    const userData = user()
    const navigate = useNavigate()

    const handleLogout = async (): Promise<void> => {
        toast('Deconnexion en cours', {
            type: 'info',
            isLoading: loading,
            position: 'bottom-right'
        })
        const response = await logout()
        if (response.ok) {
            toast('Deconnecté', {
                type: 'success',
                position: 'bottom-right'
            })
        } else {
            toast(response.statusText, {
                type: 'error',
                position: 'bottom-right'
            })
        }
        navigate('/login')
    }

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
                            {userData === null && (
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            className={`nav-link`}
                                            aria-current="page"
                                            to="/login"
                                        >
                                            <i className="fa fa-right-to-bracket me-2"></i>
                                            Connexion
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            className={`nav-link`}
                                            aria-current="page"
                                            to="/register"
                                        >
                                            <i className="fa fa-right-to-bracket me-2"></i>
                                            Inscription
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {userData && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className={`nav-link`} aria-current="page" to="/">
                                            <i className="fa fa-gauge me-2"></i>Tableau de bord
                                        </NavLink>
                                    </li>
                                    <DropDown
                                        id="student-dropdown"
                                        label="Étudiants"
                                        base="/student"
                                        icon="users"
                                        items={[
                                            {
                                                url: '/add',
                                                label: 'Ajouter un étudiant',
                                                icon: 'plus'
                                            },
                                            {
                                                url: '/list',
                                                label: 'Liste des étudiants',
                                                icon: 'list'
                                            },
                                            {
                                                url: '/import',
                                                label: 'Importer une liste',
                                                icon: 'file'
                                            }
                                        ]}
                                    ></DropDown>

                                    <DropDown
                                        id="school-dropdown"
                                        label="Écoles"
                                        base="/school"
                                        icon="school"
                                        items={[
                                            {
                                                url: '/add',
                                                label: 'Ajouter un école',
                                                icon: 'plus'
                                            },
                                            {
                                                url: '/list',
                                                label: 'Liste des écoles',
                                                icon: 'list'
                                            },
                                            { url: '/classes/list', label: 'Classe', icon: 'list' },
                                            { url: '/levels/list', label: 'Niveau', icon: 'list' }
                                        ]}
                                    ></DropDown>

                                    <DropDown
                                        id="abaques"
                                        label="Abaques"
                                        base="/measure"
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

                                    <DropDown
                                        id="anthropo-measure"
                                        label="Mesure antropo"
                                        base="/survey"
                                        icon="ruler"
                                        items={[
                                            { url: '/add', label: 'Nouvelle mesure', icon: 'plus' },
                                            {
                                                url: '/list',
                                                label: 'Liste des mesures',
                                                icon: 'list'
                                            },
                                            {
                                                url: '/add-student',
                                                label: 'Mesurer un étudiant',
                                                icon: 'user-plus'
                                            }
                                        ]}
                                    ></DropDown>

                                    <li className="nav-item dropdown ms-3">
                                        <NavLink
                                            className="nav-link dropdown-toggle"
                                            to="/user"
                                            id="user-dropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="fa fa-user me-2"></i>
                                            {userData.user.name}
                                        </NavLink>
                                        <ul
                                            className="dropdown-menu"
                                            aria-labelledby="user-dropdown"
                                        >
                                            <li>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/user/account"
                                                >
                                                    <i className="fa fa-user me-2"></i> Mon compte
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/user/account"
                                                >
                                                    <i className="fa fa-cog me-2"></i> Paramètres
                                                </NavLink>
                                            </li>
                                            <li>
                                                <Button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="dropdown-item shadow-none"
                                                    icon="sign-out"
                                                >
                                                    Se deconnecter
                                                </Button>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mb-5" style={{ marginTop: 130, minHeight: '90vh' }}>
                <ToastContainer />
                {userData !== null && <Navigation />}
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

const DropDown = ({
    id,
    items,
    label,
    base,
    icon
}: {
    id: string
    label: string
    base: string
    icon: string
    items: Array<{ url: string; label: string; icon?: string }>
}): JSX.Element => {
    return (
        <li className="nav-item dropdown">
            <NavLink
                className="nav-link dropdown-toggle"
                to={base}
                id={id}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {icon && <span className={`fa fa-${icon} me-2`}></span>}
                {label}
            </NavLink>
            <ul className="dropdown-menu" aria-labelledby={id}>
                {items.map((item) => (
                    <li key={item.url}>
                        <NavLink className="dropdown-item" to={base + item.url}>
                            {item.icon && <i className={`fa fa-${item.icon} me-2`}></i>}
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </li>
    )
}

const ErrorComponent = ({ error }: { error: ErrorResponse }): JSX.Element => {
    return (
        <>
            <div className="text-center">
                <h1>{error?.statusText}</h1>
                <h1>{error?.status}</h1>
            </div>
        </>
    )
}
