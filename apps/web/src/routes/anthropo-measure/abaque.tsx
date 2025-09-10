import { PrivateRoute } from "@base/components/Auth";
import { AddAbaque, EditAbaque, ImportAbaque, ListAbaque } from "@base/pages/Abaques";
import { RouteObject } from "react-router";

export const abaqueRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission="abaque.view">
            <ListAbaque />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute permission="abaque.create">
            <AddAbaque />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="abaque.edit">
            <EditAbaque />
        </PrivateRoute>
    },
    {
        path: 'import',
        element: <PrivateRoute permission="abaque.import">
            <ImportAbaque />
        </PrivateRoute>
    }
]