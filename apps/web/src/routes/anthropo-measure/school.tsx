import { PrivateRoute } from "@base/components/Auth";
import { AddClass, AddLevel, AddSchool, Classes, DetailsSchool, EditClass, EditLevel, EditSchool, Levels, SchoolList } from "@base/pages/School";
import { RouteObject } from "react-router";

const classRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute can={['admin']}>
            <Classes />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute can={['admin']}>
            <AddClass />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={['admin']}>
            <EditClass />
        </PrivateRoute>
    }
]

const levelRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute can={['admin']}>
            <Levels />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute can={['admin']}>
            <AddLevel />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={['admin']}>
            <EditLevel />
        </PrivateRoute>
    }
]

export const schoolRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute>
            <SchoolList />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute can={['admin']}>
            <AddSchool />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={['admin']}>
            <EditSchool />
        </PrivateRoute>
    },
    {
        path: 'details/:id',
        element: <PrivateRoute can={['admin']}>
            <DetailsSchool />
        </PrivateRoute>
    },
    {
        path: 'classes',
        children: classRoute
    },
    {
        path: 'levels',
        children: levelRoute
    }
]