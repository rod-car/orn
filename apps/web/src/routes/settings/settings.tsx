import { PrivateRoute } from "@base/components/Auth";
import { RouteObject } from "react-router";
import { JardinScolaire, Services } from "@base/pages/Settings";

export const settingsRoute: RouteObject[] = [
    {
        path: 'jardin',
        element: <PrivateRoute can={['admin']}>
            <JardinScolaire />
        </PrivateRoute>
    },
    {
        path: 'services',
        element: <PrivateRoute can={['admin']}>
            <Services />
        </PrivateRoute>
    }
];