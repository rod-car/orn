import { PrivateRoute } from "@base/components/Auth";
import { RouteObject } from "react-router";
import { ImportKoboData } from "@base/pages/Actions";

export const actionsRoute: RouteObject[] = [
    {
        path: 'kobo-import',
        element: <PrivateRoute permission="action.import-kobo-data">
            <ImportKoboData />
        </PrivateRoute>
    },
];