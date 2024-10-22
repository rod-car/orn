import { PrivateRoute } from "@base/components/Auth"
import { AddConso, EditConso, HomeCantine, ImportConso, ListConso, FoodAdd, FoodList } from "@base/pages/Cantine"
import { RouteObject } from "react-router"

export const cantineRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute>
            <HomeCantine />
        </PrivateRoute>
    },
    {
        path: 'consommation',
        children: [
            {
                path: 'statistics',
                element: <PrivateRoute>
                    <h1>Je suis la statistique</h1>
                </PrivateRoute>
            },
            {
                path: 'add',
                element: <PrivateRoute>
                    <AddConso />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute>
                    <EditConso />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute>
                    <ListConso />
                </PrivateRoute>
            },
            {
                path: 'import',
                element: <PrivateRoute>
                    <ImportConso />
                </PrivateRoute>
            },
        ]
    },
    {
        path: 'foods',
        children: [
            {
                path: "add",
                element: <PrivateRoute>
                    <FoodAdd />
                </PrivateRoute>
            },
            {
                path: "edit/:id",
                element: <PrivateRoute>
                    <FoodAdd />
                </PrivateRoute>
            },
            {
                path: "list",
                element: <PrivateRoute>
                    <FoodList />
                </PrivateRoute>
            }
        ]
    }
]