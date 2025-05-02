import { ReactNode } from 'react';
import { AuthRoot } from '@base/pages/Auth';
import { cantineRoute } from '@base/routes/cantine/cantine';
import { PrivateRoute } from '@base/components/Auth';
import { authRoute, userRoute } from '@base/routes/auth';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppRoot, About, HomePage } from '@base/pages/App';
import { toolsRoute } from '@base/routes/tools/tools';

const router = createBrowserRouter([
    {
        element: <AppRoot />,
        errorElement: <AppRoot error={true} />,
        children: [
            {
                path: '',
                element: (
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'about',
                element: (
                    <PrivateRoute>
                        <About />
                    </PrivateRoute>
                ),
            },
            {
                path: 'auth',
                children: authRoute,
            },
            { path: 'cantine', children: cantineRoute },
            { path: 'tools', children: toolsRoute },
        ],
    },
    {
        path: 'auth',
        element: <AuthRoot />,
        errorElement: <AuthRoot error={true} />,
        children: userRoute,
    },
    {
        path: 'forbidden',
        element: <AppRoot error={true} />,
    },
]);

export function App(): ReactNode {
    return <RouterProvider router={router} />;
}
