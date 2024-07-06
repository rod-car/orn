import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AddClass, AddLevel, AddSchool, AddStudent, AddSurvey, AddSurveyStudent, Classes,
    DetailsSchool, DetailsStudent, DetailsSurvey, ImportResultSurvey, EditClass, EditLevel,
    EditSchool, EditStudent, EditSurvey, ImportStudent, Levels, School, State, Student, Survey, StudentsClasses
} from '@renderer/pages'
import { PrivateRoute } from '@renderer/components/PrivateRoute'
import { GuestRoute } from '@renderer/components/GuestRoute'
import { ActivityRoot, ActivityHome, ActivityAdd, ActivityList, ActivityEdit, AdminActivityList, ActivityTypeList, ActivityTypeEdit, ActivityTypeAdd, ActivityStatistics } from '@renderer/pages/Activities'
import { MeasureRoot, ListMeasure, AddMeasure, EditMeasure, ImportMeasure, DetailsMeasure, HomeMeasure } from '@renderer/pages/Measures'
import { Login, Register, AuthRoot, AccessRequest, Users, AddUser } from '@renderer/pages/Auth'
import { AppRoot, About, Contributors, HomePage } from '@renderer/pages/App'
import { ArticleAdd, ArticleEdit, ArticleList, ArticleShow, PriceAdd, PriceHome, PriceList, PriceRoot, SiteAdd, SiteEdit, SiteList, UnitAdd, UnitEdit, UnitList } from '@renderer/pages/Prices'
import { JardinAdd, JardinHome, JardinList, JardinRoot, JardinStatistics, Engrais, Semence, Materiel, Steps, StepsData, JardinEdit, JardinShow } from '@renderer/pages/Activities/JardinScolaire'
import { HomeCantine, CantineRoot, AddConso, ListConso, EditConso, ImportConso } from '@renderer/pages'
import { StrictMode } from 'react'

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
            },
            {
                path: '/auth/access-request',
                element: <PrivateRoute><AccessRequest /></PrivateRoute>
            },
            {
                path: '/auth/users',
                element: <PrivateRoute><Users /></PrivateRoute>
            },
            {
                path: '/auth/add-user',
                element: <PrivateRoute><AddUser /></PrivateRoute>
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
                    },
                    {
                        path: 'students-classes',
                        element: <PrivateRoute><StudentsClasses /></PrivateRoute>
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
        path: '/cantine',
        element: <CantineRoot />,
        errorElement: <CantineRoot error={true} />,
        children: [
            {
                path: '',
                element: <PrivateRoute>
                    <HomeCantine />
                </PrivateRoute>
            },
            {
                path: 'statistics',
                element: <PrivateRoute>
                    <h1>Je suis la statistique</h1>
                </PrivateRoute>
            },
            {
                path: 'add-conso',
                element: <PrivateRoute>
                    <AddConso />
                </PrivateRoute>
            },
            {
                path: 'edit-conso/:id',
                element: <PrivateRoute>
                    <EditConso />
                </PrivateRoute>
            },
            {
                path: 'list-conso',
                element: <PrivateRoute>
                    <ListConso />
                </PrivateRoute>
            },
            {
                path: 'import-conso',
                element: <PrivateRoute>
                    <ImportConso />
                </PrivateRoute>
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
        path: '/scholar-garden',
        element: <JardinRoot />,
        errorElement: <JardinRoot error={true} />,
        children: [
            {
                path: '',
                element: <JardinHome />
            },
            {
                path: 'add',
                element: <JardinAdd />
            },
            {
                path: 'statistics',
                element: <JardinStatistics />
            },
            {
                path: 'list',
                element: <JardinList />
            },
            {
                path: 'materiels',
                element: <Materiel />
            },
            {
                path: 'semences',
                element: <Semence />
            },
            {
                path: 'engrais',
                element: <Engrais />
            },
            {
                path: 'steps',
                element: <Steps />
            },
            {
                path: 'steps-data',
                element: <StepsData />
            },
            {
                path: 'show/:id',
                element: <JardinShow />
            },
            {
                path: 'edit/:id',
                element: <JardinEdit />
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
            },
            {
                path: 'sites',
                children: [
                    {
                        path: 'add',
                        element: <SiteAdd />
                    },
                    {
                        path: 'edit/:id',
                        element: <SiteEdit />
                    },
                    {
                        path: 'list',
                        element: <SiteList />
                    }
                ]
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(<StrictMode>
    <RouterProvider router={router} />
</StrictMode>)
