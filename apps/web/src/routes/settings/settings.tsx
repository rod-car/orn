import { PrivateRoute } from "@base/components/Auth";
import { RouteObject } from "react-router";
import { JardinScolaire, Services } from "@base/pages/Settings";

export const settingsRoute: RouteObject[] = [
    {
        path: 'jardin',
        element: <PrivateRoute permission='garden.view'>
            <JardinScolaire />
        </PrivateRoute>
    },
    {
        path: 'services',
        element: <PrivateRoute permission="service.view">
            <Services />
        </PrivateRoute>
    }
];