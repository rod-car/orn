import { RouteObject } from 'react-router'
import { GuestRoute, PrivateRoute } from '@base/components/Auth'
import { AccessRequest, Account, AddUser, ForgotPassword, Login, NewPassword, Profile, Register, Users } from '@base/pages/Auth'

export const authRoute: RouteObject[] = [
    {
        path: 'access-request',
        element: <PrivateRoute can={['super-admin']}>
            <AccessRequest />
        </PrivateRoute>
    },
    {
        path: 'users',
        element: <PrivateRoute can={['super-admin']}>
            <Users />
        </PrivateRoute>
    },
    {
        path: 'add-user',
        element: <PrivateRoute can={['super-admin']}>
            <AddUser />
        </PrivateRoute>
    },
    {
        path: 'account',
        element: <PrivateRoute>
            <Account />
        </PrivateRoute>
    },
    {
        path: 'profile',
        element: <PrivateRoute>
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