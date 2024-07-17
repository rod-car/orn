import { ReactNode } from "react";
import { State } from '@base/pages/State';
import { GuestRoute, PrivateRoute } from '@base/components/Auth';
import {  } from '@base/components/Auth/PrivateRoute';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppRoot, About, Contributors, HomePage } from '@base/pages/App';
import { HomeCantine, AddConso, ListConso, EditConso, ImportConso } from '@base/pages/Cantine';
import { School, Levels, AddClass, AddLevel, AddSchool, DetailsSchool, Classes, EditClass, EditLevel, EditSchool } from '@base/pages/School';
import { Login, Register, AuthRoot, AccessRequest, Users, AddUser } from '@base/pages/Auth';
import { AddStudent, DetailsStudent, EditStudent, ImportStudent, Student, StudentsClasses } from '@base/pages/Students';
import { AddSurvey, AddSurveyStudent, DetailsSurvey, ImportResultSurvey, EditSurvey, Survey } from '@base/pages/Surveys';
import { ActivityHome, ActivityAdd, ActivityList, ActivityEdit, AdminActivityList, ActivityTypeList, ActivityTypeEdit, ActivityTypeAdd, ActivityStatistics } from '@base/pages/Activities';
import { ListAbaque, AddAbaque, EditAbaque, ImportAbaque } from '@base/pages/Abaques';
import { ArticleAdd, ArticleEdit, ArticleList, ArticleShow, PriceAdd, PriceHome, PriceList, SiteAdd, SiteEdit, SiteList, UnitAdd, UnitEdit, UnitList } from '@base/pages/Prices';
import { JardinAdd, JardinHome, JardinList, JardinStatistics, Engrais, Semence, Materiel, Steps, StepsData, JardinEdit, JardinShow } from '@base/pages/Activities/JardinScolaire';

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
                element: <PrivateRoute>
                    <AccessRequest />
                </PrivateRoute>
            },
            {
                path: '/auth/users',
                element: <PrivateRoute>
                    <Users />
                </PrivateRoute>
            },
            {
                path: '/auth/add-user',
                element: <PrivateRoute>
                    <AddUser />
                </PrivateRoute>
            },
            {
                path: '/anthropo-measure',
                children: [
                    {
                        path: 'statistics',
                        element: <PrivateRoute>
                            <State />
                        </PrivateRoute>
                    },
                    {
                        path: 'student/',
                        children: [
                            {
                                path: 'list',
                                element: <PrivateRoute>
                                    <Student />
                                </PrivateRoute>
                            },
                            {
                                path: 'add',
                                element: <PrivateRoute>
                                    <AddStudent />
                                </PrivateRoute>
                            },
                            {
                                path: 'edit/:id',
                                element: <PrivateRoute>
                                    <EditStudent />
                                </PrivateRoute>
                            },
                            {
                                path: 'import',
                                element: <PrivateRoute>
                                    <ImportStudent />
                                </PrivateRoute>
                            },
                            {
                                path: 'details/:id',
                                element: <PrivateRoute>
                                    <DetailsStudent />
                                </PrivateRoute>
                            },
                            {
                                path: 'students-classes',
                                element: <PrivateRoute>
                                    <StudentsClasses />
                                </PrivateRoute>
                            }
                        ]
                    },
                    {
                        path: 'abaques/',
                        children: [
                            {
                                path: 'list',
                                element: <PrivateRoute>
                                    <ListAbaque />
                                </PrivateRoute>
                            },
                            {
                                path: 'add',
                                element: <PrivateRoute>
                                    <AddAbaque />
                                </PrivateRoute>
                            },
                            {
                                path: 'edit/:id',
                                element: <PrivateRoute>
                                    <EditAbaque />
                                </PrivateRoute>
                            },
                            {
                                path: 'import',
                                element: <PrivateRoute>
                                    <ImportAbaque />
                                </PrivateRoute>
                            }
                        ]
                    },
                    {
                        path: 'school',
                        children: [
                            {
                                path: 'list',
                                element: <PrivateRoute>
                                    <School />
                                </PrivateRoute>
                            },
                            {
                                path: 'add',
                                element: <PrivateRoute>
                                    <AddSchool />
                                </PrivateRoute>
                            },
                            {
                                path: 'edit/:id',
                                element: <PrivateRoute>
                                    <EditSchool />
                                </PrivateRoute>
                            },
                            {
                                path: 'details/:id',
                                element: <PrivateRoute>
                                    <DetailsSchool />
                                </PrivateRoute>
                            },
                            {
                                path: 'classes',
                                children: [
                                    {
                                        path: 'list',
                                        element: <PrivateRoute>
                                            <Classes />
                                        </PrivateRoute>
                                    },
                                    {
                                        path: 'add',
                                        element: <PrivateRoute>
                                            <AddClass />
                                        </PrivateRoute>
                                    },
                                    {
                                        path: 'edit/:id',
                                        element: <PrivateRoute>
                                            <EditClass />
                                        </PrivateRoute>
                                    }
                                ]
                            },
                            {
                                path: 'levels',
                                children: [
                                    {
                                        path: 'list',
                                        element: <PrivateRoute>
                                            <Levels />
                                        </PrivateRoute>
                                    },
                                    {
                                        path: 'add',
                                        element: <PrivateRoute>
                                            <AddLevel />
                                        </PrivateRoute>
                                    },
                                    {
                                        path: 'edit/:id',
                                        element: <PrivateRoute>
                                            <EditLevel />
                                        </PrivateRoute>
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
                                element: <PrivateRoute>
                                    <Survey />
                                </PrivateRoute>
                            },
                            {
                                path: 'add',
                                element: <PrivateRoute>
                                    <AddSurvey />
                                </PrivateRoute>
                            },
                            {
                                path: 'edit/:id',
                                element: <PrivateRoute>
                                    <EditSurvey />
                                </PrivateRoute>
                            },
                            {
                                path: 'details/:id',
                                element: <PrivateRoute>
                                    <DetailsSurvey />
                                </PrivateRoute>
                            },
                            {
                                path: ':id/import-result',
                                element: <PrivateRoute>
                                    <ImportResultSurvey />
                                </PrivateRoute>
                            },
                            {
                                path: 'add-student',
                                element: <PrivateRoute>
                                    <AddSurveyStudent />
                                </PrivateRoute>
                            },
                            {
                                path: 'edit-student/:student_id/:survey_id',
                                element: <PrivateRoute>
                                    <AddSurveyStudent />
                                </PrivateRoute>
                            }
                        ]
                    }
                ]
            },
            {
                path: '/cantine',
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
                children: [
                    {
                        path: 'manage',
                        element: <PriceHome />
                    },
                    {
                        path: 'manage/add',
                        element: <PriceAdd />
                    },
                    {
                        path: 'manage/list',
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

])

export function App(): ReactNode {
    return <RouterProvider router={router} />
}