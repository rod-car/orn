import { PrivateRoute } from "@base/components/Auth"
import { AddConso, EditConso, HomeCantine, ImportConso, ListConso } from "@base/pages/Cantine"
import { RouteObject } from "react-router"

export const cantineRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute>
            <HomeCantine />
        </PrivateRoute>
    },
    {
        path: 'statistics',
        element: <PrivateRoute>
            <h1>Je suis la statistique</h1>
        </PrivateRoute>
    },
    {
        path: 'add-conso',
        element: <PrivateRoute>
            <AddConso />
        </PrivateRoute>
    },
    {
        path: 'edit-conso/:id',
        element: <PrivateRoute>
            <EditConso />
        </PrivateRoute>
    },
    {
        path: 'list-conso',
        element: <PrivateRoute>
            <ListConso />
        </PrivateRoute>
    },
    {
        path: 'import-conso',
        element: <PrivateRoute>
            <ImportConso />
        </PrivateRoute>
    }
]