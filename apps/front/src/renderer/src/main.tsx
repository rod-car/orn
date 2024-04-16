import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import {
    AddClass,
    AddLevel,
    AddMeasure,
    AddSchool,
    AddStudent,
    AddSurvey,
    AddSurveyStudent,
    Classes,
    DetailsMeasure,
    DetailsSchool,
    DetailsStudent,
    DetailsSurvey,
    ImportResultSurvey,
    EditClass,
    EditLevel,
    EditMeasure,
    EditSchool,
    EditStudent,
    EditSurvey,
    Home,
    ImportMeasure,
    ImportStudent,
    Levels,
    ListMeasure,
    Root,
    School,
    State,
    Student,
    Survey,
    Login,
    Register
} from './pages'
import { PrivateRoute } from './components/PrivateRoute'
import { GuestRoute } from './components/GuestRoute'

const router = createHashRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Root error={true} />,
        children: [
            {
                path: '',
                element: (
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                )
            },
            {
                path: 'login',
                element: (
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                )
            },
            {
                path: 'register',
                element: (
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                )
            },
            {
                path: 'states',
                element: <State />
            },
            {
                path: 'student/',
                children: [
                    {
                        path: 'list',
                        element: <Student />
                    },
                    {
                        path: 'add',
                        element: <AddStudent />
                    },
                    {
                        path: 'edit/:id',
                        element: <EditStudent />
                    },
                    {
                        path: 'import',
                        element: <ImportStudent />
                    },
                    {
                        path: 'details/:id',
                        element: <DetailsStudent />
                    }
                ]
            },
            {
                path: 'measure/',
                children: [
                    {
                        path: 'list',
                        element: <ListMeasure />
                    },
                    {
                        path: 'add',
                        element: <AddMeasure />
                    },
                    {
                        path: 'edit/:id',
                        element: <EditMeasure />
                    },
                    {
                        path: 'import',
                        element: <ImportMeasure />
                    },
                    {
                        path: 'details/:id',
                        element: <DetailsMeasure />
                    }
                ]
            },
            {
                path: 'school',
                children: [
                    {
                        path: 'list',
                        element: <School />
                    },
                    {
                        path: 'add',
                        element: <AddSchool />
                    },
                    {
                        path: 'edit/:id',
                        element: <EditSchool />
                    },
                    {
                        path: 'details/:id',
                        element: <DetailsSchool />
                    },
                    {
                        path: 'classes',
                        children: [
                            {
                                path: 'list',
                                element: <Classes />
                            },
                            {
                                path: 'add',
                                element: <AddClass />
                            },
                            {
                                path: 'edit/:id',
                                element: <EditClass />
                            }
                        ]
                    },
                    {
                        path: 'levels',
                        children: [
                            {
                                path: 'list',
                                element: <Levels />
                            },
                            {
                                path: 'add',
                                element: <AddLevel />
                            },
                            {
                                path: 'edit/:id',
                                element: <EditLevel />
                            }
                        ]
                    }
                ]
            },
            {
                path: 'survey/',
                children: [
                    {
                        path: 'list',
                        element: <Survey />
                    },
                    {
                        path: 'add',
                        element: <AddSurvey />
                    },
                    {
                        path: 'edit/:id',
                        element: <EditSurvey />
                    },
                    {
                        path: 'details/:id',
                        element: <DetailsSurvey />
                    },
                    {
                        path: ':id/import-result',
                        element: <ImportResultSurvey />
                    },
                    {
                        path: 'add-student',
                        element: <AddSurveyStudent />
                    },
                    {
                        path: 'edit-student/:student_id/:survey_id',
                        element: <AddSurveyStudent />
                    }
                ]
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
