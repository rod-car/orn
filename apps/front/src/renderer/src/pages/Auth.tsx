import { ReactNode, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useRouteError } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css?asset'
import 'bootstrap/dist/css/bootstrap.min.css?asset'
import '@popperjs/core/dist/esm/index.js?asset'
import 'bootstrap/dist/js/bootstrap.bundle.min.js?asset'
import '@fortawesome/fontawesome-free/js/all.min.js?asset'
import '../assets/icons.css?asset'
import '../assets/custom.css?asset'
import logo from '../assets/logo.png'
import { useAuth } from 'hooks'
import { config } from '../../config'

export function Auth({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }
    const { user } = useAuth({ baseUrl: config.baseUrl })
    const userData = user()

    useEffect(() => {
        if (userData !== null) window.electron.ipcRenderer.send('logged-in', true)
    }, [])

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top p-0">
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
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/">
                                    Connexion
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/register">
                                    Inscription
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div style={{ marginTop: 60 }}>
                <ToastContainer />
                {error ? <ErrorComponent error={errorResponse.error} /> : <Outlet />}
            </div>
        </>
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
