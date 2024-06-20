import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useRouteError } from 'react-router-dom'

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
import { ErrorComponent } from '@renderer/components'

export function AuthRoot({ error = false }: { error?: boolean }): ReactNode {
    const err = useRouteError()
    const errorResponse = err as { error: ErrorResponse }

    return (
        <>
            {/*<nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top mb-5 p-0">
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
                                <NavLink
                                    className={`nav-link`}
                                    aria-current="page"
                                    to="/auth/login"
                                >
                                    <i className="fa fa-right-to-bracket me-2"></i>
                                    Connexion
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className={`nav-link`}
                                    aria-current="page"
                                    to="/auth/register"
                                >
                                    <i className="fa fa-right-to-bracket me-2"></i>
                                    Demande d'accès
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>*/}

            <div>
                <ToastContainer />
                {error ? <ErrorComponent error={errorResponse.error} /> : <Outlet />}
            </div>

            {/*<footer className="bg-light p-4">
                <div className="d-flex justify-content-between">
                    <p className="m-0">
                        &copy; Copyleft ORN Atsinanana {new Date().toLocaleDateString()}
                    </p>
                    <p className="m-0">
                        Developpé par: <a target="_blank" href="http://rod-car.lovestoblog.com">Gislain Carino Rodrigue BOUDI</a>
                    </p>
                </div>
            </footer>*/}
        </>
    )
}
