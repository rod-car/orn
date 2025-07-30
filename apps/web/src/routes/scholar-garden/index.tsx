import { PrivateRoute } from "@base/components/Auth";
import { Engrais, JardinAdd, JardinEdit, JardinList, JardinShow, JardinStatistics, Materiel, Semence, Steps, StepsData } from "@base/pages/Activities/JardinScolaire";
import { RouteObject } from "react-router";

export const scholarGardenRoute: RouteObject[] = [
    {
        path: 'add',
        element: <PrivateRoute permission="garden.create">
            <JardinAdd />
        </PrivateRoute>
    },
    {
        path: 'statistics',
        element: <PrivateRoute permission="garden.statistics">
            <JardinStatistics />
        </PrivateRoute>
    },
    {
        path: 'list',
        element: <PrivateRoute permission="garden.view">
            <JardinList />
        </PrivateRoute>
    },
    {
        path: 'materiels',
        element: <PrivateRoute permission="garden.view">
            <Materiel />
        </PrivateRoute>
    },
    {
        path: 'semences',
        element: <PrivateRoute permission="garden.view">
            <Semence />
        </PrivateRoute>
    },
    {
        path: 'engrais',
        element: <PrivateRoute permission="garden.view">
            <Engrais />
        </PrivateRoute>
    },
    {
        path: 'steps',
        element: <PrivateRoute permission="garden.view">
            <Steps />
        </PrivateRoute>
    },
    {
        path: 'steps-data',
        element: <PrivateRoute permission="garden.view">
            <StepsData />
        </PrivateRoute>
    },
    {
        path: 'show/:id',
        element: <PrivateRoute permission="garden.view">
            <JardinShow />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="garden.view">
            <JardinEdit />
        </PrivateRoute>
    }
]