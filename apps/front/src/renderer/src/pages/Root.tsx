import { ReactNode } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useRouteError } from 'react-router-dom'

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
        window.electron.ipcRenderer.send('logged-out', true)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top mb-5 p-0">
                <div className="container container-fluid">
                    <NavLink className="navbar-brand fw-bold text-muted" to="/">
                        <img className="w-15 me-3" src={logo} alt="Logo" />
                        <span>ORN DC</span>
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
                                            Connexion
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            className={`nav-link`}
                                            aria-current="page"
                                            to="/register"
                                        >
                                            Inscription
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {userData && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className={`nav-link`} aria-current="page" to="/">
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            className={`nav-link`}
                                            aria-current="page"
                                            to="/states"
                                        >
                                            Etats
                                        </NavLink>
                                    </li>
                                    <DropDown
                                        id="student-dropdown"
                                        label="Étudiants"
                                        base="/student"
                                        items={[
                                            { url: '/add', label: 'Ajouter un étudiant' },
                                            { url: '/list', label: 'Liste des étudiants' },
                                            { url: '/import', label: 'Importer une liste' }
                                        ]}
                                    ></DropDown>
                                    <DropDown
                                        id="anthropo-measure"
                                        label="Mésures anthropo"
                                        base="/measure"
                                        items={[
                                            { url: '/add', label: 'Ajouter un mésure' },
                                            { url: '/list', label: 'Liste des mésures' },
                                            { url: '/import', label: 'Importer une liste' }
                                        ]}
                                    ></DropDown>
                                    <DropDown
                                        id="school-dropdown"
                                        label="Établissements"
                                        base="/school"
                                        items={[
                                            { url: '/add', label: 'Ajouter un établissement' },
                                            { url: '/list', label: 'Liste des établissements' },
                                            { url: '/classes/list', label: 'Classe' },
                                            { url: '/levels/list', label: 'Niveau' }
                                        ]}
                                    ></DropDown>
                                    <DropDown
                                        id="survey-dropdown"
                                        label="Enquête"
                                        base="/survey"
                                        items={[
                                            { url: '/add', label: 'Nouvelle enquête' },
                                            { url: '/list', label: 'Liste des enquêtes' },
                                            { url: '/add-student', label: 'Ajouter un étudiant' }
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
                                            <i className="fa fa-user me-2"></i> {userData.user.name}
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
    base
}: {
    id: string
    label: string
    base: string
    items: Array<{ url: string; label: string }>
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
                {label}
            </NavLink>
            <ul className="dropdown-menu" aria-labelledby={id}>
                {items.map((item) => (
                    <li key={item.url}>
                        <NavLink className="dropdown-item" to={base + item.url}>
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
