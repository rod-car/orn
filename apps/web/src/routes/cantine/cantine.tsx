import { PrivateRoute } from "@base/components/Auth"
import {
    AddConso,
    EditConso,
    ImportConso,
    ListConso,
    FoodAdd,
    FoodList,
    RecapConso,
    Stock,
    StockIn,
    StockOut,
    StockDashboard
} from "@base/pages/Cantine"
import { RouteObject } from "react-router"

export const cantineRoute: RouteObject[] = [
    {
        path: 'consommation',
        children: [
            {
                path: 'stock',
                element: <PrivateRoute permission={['stock.recap']}>
                    <Stock />
                </PrivateRoute>
            },
            {
                path: 'statistics',
                element: <PrivateRoute permission={["consommation.statistics"]}>
                    <RecapConso />
                </PrivateRoute>
            },
            {
                path: 'add',
                element: <PrivateRoute permission={['consommation.create']}>
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
            },
            {
                path: 'import',
                element: <PrivateRoute permission={['consommation.import']}>
                    <ImportConso />
                </PrivateRoute>
            },
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
            {
                path: 'dashboard',
                element: <PrivateRoute permission={['stock.recap']}>
                    <StockDashboard />
                </PrivateRoute>
            },
        ]
    },
    {
        path: 'foods',
        children: [
            {
                path: "add",
                element: <PrivateRoute permission={['food.create']}>
                    <FoodAdd />
                </PrivateRoute>
            },
            {
                path: "edit/:id",
                element: <PrivateRoute permission={['food.edit']}>
                    <FoodAdd />
                </PrivateRoute>
            },
            {
                path: "list",
                element: <PrivateRoute permission={["food.view"]}>
                    <FoodList />
                </PrivateRoute>
            }
        ]
    }
]