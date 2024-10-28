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
        element: <PrivateRoute>
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
        element: <PrivateRoute>
            <JardinList />
        </PrivateRoute>
    },
    {
        path: 'materiels',
        element: <PrivateRoute>
            <Materiel />
        </PrivateRoute>
    },
    {
        path: 'semences',
        element: <PrivateRoute>
            <Semence />
        </PrivateRoute>
    },
    {
        path: 'engrais',
        element: <PrivateRoute>
            <Engrais />
        </PrivateRoute>
    },
    {
        path: 'steps',
        element: <PrivateRoute>
            <Steps />
        </PrivateRoute>
    },
    {
        path: 'steps-data',
        element: <PrivateRoute>
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
        element: <PrivateRoute>
            <JardinEdit />
        </PrivateRoute>
    }
]