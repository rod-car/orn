import { PrivateRoute } from "@base/components/Auth";
import { AddClass, AddLevel, AddSchool, Classes, DetailsSchool, EditClass, EditLevel, EditSchool, Levels, School } from "@base/pages/School";
import { RouteObject } from "react-router";

const classRoute: RouteObject[] = [
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

const levelRoute: RouteObject[] = [
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

export const schoolRoute: RouteObject[] = [
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
        children: classRoute
    },
    {
        path: 'levels',
        children: levelRoute
    }
]