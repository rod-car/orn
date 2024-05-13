import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
    AddClass,
    AddLevel,
    AddSchool,
    AddStudent,
    AddSurvey,
    AddSurveyStudent,
    Classes,
    DetailsSchool,
    DetailsStudent,
    DetailsSurvey,
    ImportResultSurvey,
    EditClass,
    EditLevel,
    EditSchool,
    EditStudent,
    EditSurvey,
    ImportStudent,
    Levels,
    School,
    State,
    Student,
    Survey
} from './pages'
import { PrivateRoute } from './components/PrivateRoute'
import { GuestRoute } from './components/GuestRoute'
import { ActivityRoot, ActivityHome, ActivityAdd, ActivityList, ActivityEdit, AdminActivityList, ActivityTypeList, ActivityTypeEdit, ActivityTypeAdd, ActivityStatistics } from '@renderer/pages/Activities'
import { MeasureRoot, ListMeasure, AddMeasure, EditMeasure, ImportMeasure, DetailsMeasure, HomeMeasure } from '@renderer/pages/Measures'
import { Login, Register, AuthRoot } from '@renderer/pages/Auth'
import { AppRoot, About, Contributors, HomePage } from '@renderer/pages/App'
import { ArticleAdd, ArticleEdit, ArticleList, ArticleShow, PriceAdd, PriceEdit, PriceHome, PriceList, PriceRoot, UnitAdd, UnitEdit, UnitList } from '@renderer/pages/Prices'

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppRoot />,
        errorElement: <AppRoot error={true} />,
        children: [
            {
                path: '',
                element: <PrivateRoute>
                    <HomePage />
                </PrivateRoute>
            },
            {
                path: 'about',
                element: <PrivateRoute>
                    <About />
                </PrivateRoute>
            },
            {
                path: 'contributors',
                element: <PrivateRoute>
                    <Contributors />
                </PrivateRoute>
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthRoot />,
        errorElement: <AuthRoot error={true} />,
        children: [
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
        ]
    },
    {
        path: '/anthropo-measure',
        element: <MeasureRoot />,
        errorElement: <MeasureRoot error={true} />,
        children: [
            {
                path: '',
                element: (
                    <PrivateRoute>
                        <HomeMeasure />
                    </PrivateRoute>
                )
            },
            {
                path: 'statistics',
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
    },
    {
        path: '/activities',
        element: <ActivityRoot />,
        errorElement: <ActivityRoot error={true} />,
        children: [
            {
                path: '',
                element: <ActivityHome />
            },
            {
                path: 'add',
                element: <ActivityAdd />
            },
            {
                path: 'statistics',
                element: <ActivityStatistics />
            },
            {
                path: 'list',
                element: <ActivityList />
            },
            {
                path: 'types',
                children: [
                    {
                        path: '',
                        element: <ActivityTypeList />
                    },
                    {
                        path: 'add',
                        element: <ActivityTypeAdd />
                    },
                    {
                        path: 'edit/:id',
                        element: <ActivityTypeEdit />
                    },
                ],
            },
            {
                path: 'manage/list',
                element: <AdminActivityList />
            },
            {
                path: 'show/:id',
                element: <h1>Modifier un activité</h1>
            },
            {
                path: 'edit/:id',
                element: <ActivityEdit />
            }
        ]
    },
    {
        path: '/prices',
        element: <PriceRoot />,
        errorElement: <PriceRoot error={true} />,
        children: [
            {
                path: '',
                element: <PriceHome />
            },
            {
                path: 'add',
                element: <PriceAdd />
            },
            {
                path: 'list',
                element: <PriceList />
            },
            {
                path: 'show/:id',
                element: <h1>Modifier un activité</h1>
            },
            {
                path: 'edit/:id',
                element: <PriceEdit />
            },
            {
                path: 'articles',
                children: [
                    {
                        path: 'add',
                        element: <ArticleAdd />
                    },
                    {
                        path: 'edit/:id',
                        element: <ArticleEdit />
                    },
                    {
                        path: 'show/:id',
                        element: <ArticleShow />
                    },
                    {
                        path: 'list',
                        element: <ArticleList />
                    }
                ]
            },
            {
                path: 'units',
                children: [
                    {
                        path: 'add',
                        element: <UnitAdd />
                    },
                    {
                        path: 'edit/:id',
                        element: <UnitEdit />
                    },
                    {
                        path: 'list',
                        element: <UnitList />
                    }
                ]
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
