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
                element: <PrivateRoute permission={["consommation.statistics"]}>
                    <RecapConso />
                </PrivateRoute>
            },
            {
                path: 'add',
                element: <PrivateRoute permission={['consommation.add']}>
                    <AddConso />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute permission={['consommation.edit']}>
                    <EditConso />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute permission={["consommation.view"]}>
                    <ListConso />
                </PrivateRoute>
            }
        ]
    },
    {
        path: 'stocks',
        children: [
            {
                path: 'in',
                element: <PrivateRoute permission={['stock.in']}>
                    <StockIn />
                </PrivateRoute>
            },
            {
                path: 'out',
                element: <PrivateRoute permission={['stock.out']}>
                    <StockOut />
                </PrivateRoute>
            },
            {
                path: 'recap',
                element: <PrivateRoute permission={['stock.recap']}>
                    <Stock />
                </PrivateRoute>
            },
        ]
    },
]