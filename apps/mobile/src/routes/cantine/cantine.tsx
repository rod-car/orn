import { PrivateRoute } from "@base/components/Auth"
import {
    AddConso,
    EditConso,
    ListConso,
    RecapConso,
    Stock,
    StockIn,
    StockOut
} from "@base/pages/Cantine"
import { RouteObject } from "react-router"

export const cantineRoute: RouteObject[] = [
    {
        path: 'consommation',
        children: [
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
            }
        ]
    },
    {
        path: 'stock',
        children: [
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
            {
                path: 'list',
                element: <PrivateRoute can={['admin']}>
                    <Stock />
                </PrivateRoute>
            },
        ]
    },
]