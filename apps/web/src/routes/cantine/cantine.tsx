import { PrivateRoute } from "@base/components/Auth"
import {
    AddConso,
    EditConso,
    HomeCantine,
    ImportConso,
    ListConso,
    FoodAdd,
    FoodList,
    RecapConso,
    Stock,
    StockIn,
    StockOut
} from "@base/pages/Cantine"
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
                path: 'stock',
                element: <PrivateRoute can={['admin']}>
                    <Stock />
                </PrivateRoute>
            },
            {
                path: 'statistics',
                element: <PrivateRoute>
                    <RecapConso />
                </PrivateRoute>
            },
            {
                path: 'add',
                element: <PrivateRoute can={['admin']}>
                    <AddConso />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute can={['admin']}>
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
                element: <PrivateRoute can={['admin']}>
                    <ImportConso />
                </PrivateRoute>
            },
        ]
    },
    {
        path: 'stocks',
        children: [
            {
                path: 'recap',
                element: <PrivateRoute can={['admin']}>
                    <Stock />
                </PrivateRoute>
            },
            {
                path: 'in',
                element: <PrivateRoute can={['admin']}>
                    <StockIn />
                </PrivateRoute>
            },
            {
                path: 'out',
                element: <PrivateRoute can={['admin']}>
                    <StockOut />
                </PrivateRoute>
            },
        ]
    },
    {
        path: 'foods',
        children: [
            {
                path: "add",
                element: <PrivateRoute can={['admin']}>
                    <FoodAdd />
                </PrivateRoute>
            },
            {
                path: "edit/:id",
                element: <PrivateRoute can={['admin']}>
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