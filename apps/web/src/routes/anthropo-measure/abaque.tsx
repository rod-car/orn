import { PrivateRoute } from "@base/components/Auth";
import { AddAbaque, EditAbaque, ImportAbaque, ListAbaque } from "@base/pages/Abaques";
import { RouteObject } from "react-router";

export const abaqueRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute can={['admin']}>
            <ListAbaque />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute can={['admin']}>
            <AddAbaque />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={['admin']}>
            <EditAbaque />
        </PrivateRoute>
    },
    {
        path: 'import',
        element: <PrivateRoute can={['admin']}>
            <ImportAbaque />
        </PrivateRoute>
    }
]