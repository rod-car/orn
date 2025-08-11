import { ReactNode } from 'react';
import { AuthRoot } from '@base/pages/Auth';
import { PrivateRoute } from '@base/components/Auth';
import { toolsRoute } from '@base/routes/tools/tools';
import { authRoute, userRoute } from '@base/routes/auth';
import { AppRoot, About, HomePage } from '@base/pages/App';
import { cantineRoute } from '@base/routes/cantine/cantine';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    {
        element: <AppRoot />,
        errorElement: <AppRoot error={true} />,
        children: [
            {
                path: '',
                element: (
                    <PrivateRoute permission={["dashboard.view"]}>
                        <HomePage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'about',
                element: (
                    <PrivateRoute permission={["app.about"]}>
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
