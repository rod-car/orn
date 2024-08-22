import { ReactNode } from 'react';
import { Statistics } from '@base/pages/Statistics';
import { AuthRoot } from '@base/pages/Auth';
import { priceRoute } from '@base/routes/prices';
import { cantineRoute } from '@base/routes/cantine';
import { PrivateRoute } from '@base/components/Auth';
import { activityRoute } from '@base/routes/activities';
import { authRoute, userRoute } from '@base/routes/auth';
import { scholarGardenRoute } from '@base/routes/scholar-garden/';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppRoot, About, Contributors, HomePage } from '@base/pages/App';
import { studentRoute, abaqueRoute, schoolRoute, surveyRoute } from '@base/routes/anthropo-measure';
import { documentRoute } from '@base/routes/document/documents';

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
                path: '/auth',
                children: authRoute
            },
            {
                path: '/anthropo-measure',
                children: [
                    {
                        path: 'statistics',
                        element: <PrivateRoute>
                            <Statistics />
                        </PrivateRoute>
                    },
                    {
                        path: 'student/',
                        children: studentRoute
                    },
                    {
                        path: 'abaques/',
                        children: abaqueRoute
                    },
                    {
                        path: 'school',
                        children: schoolRoute
                    },
                    {
                        path: 'survey/',
                        children: surveyRoute
                    }
                ]
            },
            {
                path: '/cantine',
                children: cantineRoute
            },
            {
                path: '/activities',
                children: activityRoute
            },
            {
                path: '/scholar-garden',
                children: scholarGardenRoute
            },
            {
                path: '/prices',
                children: priceRoute
            },
            {
                path: '/documents',
                children: documentRoute
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthRoot />,
        errorElement: <AuthRoot error={true} />,
        children: userRoute
    }
])

export function App(): ReactNode {
    return <RouterProvider router={router} />
}