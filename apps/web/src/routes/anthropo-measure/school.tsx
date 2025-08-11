import { PrivateRoute } from "@base/components/Auth";
import { AddClass, AddLevel, AddSchool, Classes, EditClass, EditLevel, EditSchool, Levels, SchoolList } from "@base/pages/School";
import { RouteObject } from "react-router";

const classRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission="class.view">
            <Classes />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute permission="class.create">
            <AddClass />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="class.edit">
            <EditClass />
        </PrivateRoute>
    }
]

const levelRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission="level.view">
            <Levels />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute permission="level.create">
            <AddLevel />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="level.edit">
            <EditLevel />
        </PrivateRoute>
    }
]

export const schoolRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission="school.view">
            <SchoolList />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute permission="school.create">
            <AddSchool />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="school.edit">
            <EditSchool />
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