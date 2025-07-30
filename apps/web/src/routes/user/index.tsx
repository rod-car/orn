import { RouteObject } from 'react-router';
import { PrivateRoute } from '@base/components/Auth';
import { CreateUser, ListUser, EditUser, ViewUser } from '@base/pages/Users';
import { CreateRole, EditRole, ListRole } from '@base/pages/Roles';
import { CreatePermission, EditPermission, ListPermission } from '@base/pages/permissions';

export const securityRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission={['user.view']}>
            <ListUser />
        </PrivateRoute>
    },
    {
        path: 'create',
        element: <PrivateRoute permission={['user.create']}>
            <CreateUser />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission={['user.edit']}>
            <EditUser />
        </PrivateRoute>
    },
    {
        path: 'show/:id',
        element: <PrivateRoute permission={['user.show']}>
            <ViewUser />
        </PrivateRoute>
    },
    {
        path: 'role',
        element: <PrivateRoute permission={['role.view']}>
            <ListRole />
        </PrivateRoute>
    },
    {
        path: 'role/create',
        element: <PrivateRoute permission={['role.create']}>
            <CreateRole />
        </PrivateRoute>
    },
    {
        path: 'role/edit/:id',
        element: <PrivateRoute permission={['role.edit']}>
            <EditRole />
        </PrivateRoute>
    },
    {
        path: 'permission',
        element: <PrivateRoute permission={['permission.view']}>
            <ListPermission />
        </PrivateRoute>
    },
    {
        path: 'permission/create',
        element: <PrivateRoute permission={['permission.create']}>
            <CreatePermission />
        </PrivateRoute>
    },
    {
        path: 'permission/edit/:id',
        element: <PrivateRoute permission={['permission.edit']}>
            <EditPermission />
        </PrivateRoute>
    },
]