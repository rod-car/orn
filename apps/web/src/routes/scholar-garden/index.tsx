import { PrivateRoute } from "@base/components/Auth";
import { Engrais, JardinAdd, JardinEdit, JardinHome, JardinList, JardinShow, JardinStatistics, Materiel, Semence, Steps, StepsData } from "@base/pages/Activities/JardinScolaire";
import { RouteObject } from "react-router";

export const scholarGardenRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute>
            <JardinHome />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute can={['admin']}>
            <JardinAdd />
        </PrivateRoute>
    },
    {
        path: 'statistics',
        element: <PrivateRoute>
            <JardinStatistics />
        </PrivateRoute>
    },
    {
        path: 'list',
        element: <PrivateRoute can={['admin']}>
            <JardinList />
        </PrivateRoute>
    },
    {
        path: 'materiels',
        element: <PrivateRoute can={['admin']}>
            <Materiel />
        </PrivateRoute>
    },
    {
        path: 'semences',
        element: <PrivateRoute can={['admin']}>
            <Semence />
        </PrivateRoute>
    },
    {
        path: 'engrais',
        element: <PrivateRoute can={['admin']}>
            <Engrais />
        </PrivateRoute>
    },
    {
        path: 'steps',
        element: <PrivateRoute can={['admin']}>
            <Steps />
        </PrivateRoute>
    },
    {
        path: 'steps-data',
        element: <PrivateRoute can={['admin']}>
            <StepsData />
        </PrivateRoute>
    },
    {
        path: 'show/:id',
        element: <PrivateRoute>
            <JardinShow />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={['admin']}>
            <JardinEdit />
        </PrivateRoute>
    }
]