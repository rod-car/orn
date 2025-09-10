import { RouteObject } from "react-router"
import { PrivateRoute } from "@base/components/Auth"
import { AddConso, ListConso, Stock, StockIn, StockOut } from "@base/pages/Cantine"

export const cantineRoute: RouteObject[] = [
    {
        path: 'consommation',
        children: [
            {
                path: 'add',
                element: <PrivateRoute permission={['consommation.create']}>
                    <AddConso />
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