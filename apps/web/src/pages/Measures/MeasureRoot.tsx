/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { ErrorResponse, NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom'
import { useApi, useAuthStore } from 'hooks'
import { config } from '@base/config'
import { DropDown, ErrorComponent, Navigation, ProgressBar, UserMenu, NotFound, Header, Footer } from '@base/components'
import { useNotFoundRoute } from '@base/hooks'

import '@base/assets'

export function MeasureRoot({ error = false }: { error?: boolean }): ReactNode {
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
                                        can: isAdmin
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
                                        can: isAdmin
                                    },
                                    {
                                        url: '/students-classes',
                                        label: 'Mise à jour des classes',
                                        icon: 'users',
                                        can: isAdmin
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
                                        can: isAdmin
                                    },
                                    {
                                        url: '/list',
                                        label: 'Liste des écoles',
                                        icon: 'list'
                                    },
                                    { url: '/classes/list', label: 'Classe', icon: 'list', can: isAdmin },
                                    { url: '/levels/list', label: 'Niveau', icon: 'list', can: isAdmin }
                                ]}
                            ></DropDown>

                            {isAdmin && 
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
                                    { url: '/add', label: 'Nouvelle mesure', icon: 'plus', can: isAdmin },
                                    {
                                        url: '/list',
                                        label: 'Liste des mesures',
                                        icon: 'list'
                                    },
                                    {
                                        url: '/add-student',
                                        label: 'Mesurer un étudiant',
                                        icon: 'user-plus',
                                        can: isAdmin
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
                {error ? <ErrorComponent error={errorResponse.error ?? {
                    status: 500,
                    statusText: "Une erreur est survenue",
                    data: null
                }} /> : (notFound ? <NotFound path={path} /> : <Outlet />)}
            </div>

            <Footer />
        </>
    )
}
