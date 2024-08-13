import { PrivateRoute } from "@base/components/Auth";
import { AddAbaque, EditAbaque, ImportAbaque, ListAbaque } from "@base/pages/Abaques";
import { RouteObject } from "react-router";

export const abaqueRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute>
            <ListAbaque />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute>
            <AddAbaque />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute>
            <EditAbaque />
        </PrivateRoute>
    },
    {
        path: 'import',
        element: <PrivateRoute>
            <ImportAbaque />
        </PrivateRoute>
    }
]