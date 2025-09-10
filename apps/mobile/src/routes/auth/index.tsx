import { RouteObject } from 'react-router'
import { GuestRoute, PrivateRoute } from '@base/components/Auth'
import { ForgotPassword, Login, NewPassword, Profile } from '@base/pages/Auth'

export const authRoute: RouteObject[] = [
    {
        path: 'profile',
        element: <PrivateRoute permission={["user.show"]}>
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
    }
];