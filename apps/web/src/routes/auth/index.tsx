import { RouteObject } from 'react-router'
import { GuestRoute, PrivateRoute } from '@base/components/Auth'
import { AccessRequest, Account, AddUser, EditUser, ForgotPassword, Login, NewPassword, Profile, Register, Users } from '@base/pages/Auth'

export const authRoute: RouteObject[] = [
    {
        path: 'access-request',
        element: <PrivateRoute permission={['access-request.view']}>
            <AccessRequest />
        </PrivateRoute>
    },
    {
        path: 'users',
        element: <PrivateRoute permission={['user.view']}>
            <Users />
        </PrivateRoute>
    },
    {
        path: 'add-user',
        element: <PrivateRoute permission={['user.create']}>
            <AddUser />
        </PrivateRoute>
    },
    {
        path: 'edit-user/:id',
        element: <PrivateRoute permission={['user.edit']}>
            <EditUser />
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