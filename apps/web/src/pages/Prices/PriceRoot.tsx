import { ReactNode, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom'
import { DropDown, ErrorComponent, Navigation } from '@renderer/components'

import 'react-toastify/dist/ReactToastify.css?asset'
import 'bootstrap/dist/css/bootstrap.min.css?asset'
import '@popperjs/core/dist/esm/index.js?asset'
import 'bootstrap/dist/js/bootstrap.bundle.min.js?asset'
import '@fortawesome/fontawesome-free/js/all.min.js?asset'
import 'react-confirm-alert/src/react-confirm-alert.css?asset'
import 'react-toastify/dist/ReactToastify.css?asset'

import '../../assets/icons.css?asset'
import '../../assets/custom.css?asset'
import logo from '../../assets/logo.png'

import { useApi, useAuth } from 'hooks'
import { config, getToken } from '../../config'
import { Button } from 'ui'

export function PriceRoot({ error = false }: { error?: boolean }): ReactNode {
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

    const handleLogout = async (): Promise<void> => {
        toast('Deconnexion en cours', {
            type: 'info',
            isLoading: loading,
            position: config.toastPosition
        })
        const response = await logout()
        if (response.ok) {
            toast('Deconnecté', {
                type: 'success',
                position: config.toastPosition
            })
        } else {
            toast(response.statusText, {
                type: 'error',
                position: config.toastPosition
            })
        }
        navigate('/auth/login')
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
                            <li className="nav-item">
                                <NavLink className={`nav-link`} aria-current="page" to="/prices">
                                    <i className="fa fa-chart-pie me-2"></i>Statistiques
                                </NavLink>
                            </li>

                            <DropDown
                                id="articles-dropdown"
                                label="Articles"
                                base="/prices/articles"
                                icon="list"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Ajouter un article',
                                        icon: 'plus'
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des articles',
                                        icon: 'list'
                                    }
                                ]}
                            ></DropDown>

                            <DropDown
                                id="units-dropdown"
                                label="Unités"
                                base="/prices/units"
                                icon="scale-balanced"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Nouveau unité',
                                        icon: 'plus'
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des unités',
                                        icon: 'list'
                                    }
                                ]}
                            ></DropDown>

                            <DropDown
                                id="prices-dropdown"
                                label="Gestion des prix"
                                base="/prices"
                                icon="money-bill"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Ajouter un prix d\'article',
                                        icon: 'plus'
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des prix d\'articles',
                                        icon: 'list'
                                    }
                                ]}
                            ></DropDown>

                            <DropDown
                                id="sites-dropdown"
                                label="Sites"
                                base="/prices/sites"
                                icon="home"
                                items={[
                                    {
                                        url: '/add',
                                        label: 'Nouveau site',
                                        icon: 'plus'
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des sites',
                                        icon: 'list'
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
                                    {userData?.name}
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