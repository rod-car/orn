import { RouteObject } from 'react-router'
import { GuestRoute, PrivateRoute } from '@base/components/Auth'
import { AccessRequest, Account, ForgotPassword, Login, NewPassword, Profile, Register } from '@base/pages/Auth'

export const authRoute: RouteObject[] = [
    {
        path: 'access-request',
        element: <PrivateRoute permission={['access-request.view']}>
            <AccessRequest />
        </PrivateRoute>
    },
    {
        path: 'account',
        element: <PrivateRoute permission={["user.show"]}>
            <Account />
        </PrivateRoute>
    },
    {
        path: 'profile',
        element: <PrivateRoute permission={["user.profile"]}>
            <Profile />
        </PrivateRoute>
    }
]

export const userRoute: RouteObject[] = [
    {
        path: 'login',
        element: <GuestRoute>
            <Login />
        </GuestRoute>
    },
    {
        path: 'forgot-password',
        element: <GuestRoute>
            <ForgotPassword />
        </GuestRoute>
    },
    {
        path: 'new-password/:token',
        element: <GuestRoute>
            <NewPassword />
        </GuestRoute>
    },
    {
        path: 'register',
        element: <GuestRoute>
            <Register />
        </GuestRoute>
    },
];