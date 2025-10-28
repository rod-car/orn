import { PrivateRoute } from "@base/components/Auth";
import { JustificativeHome, JustificativeAdd, JustificativeShow, JustificativeEdit } from "@base/pages/Justificatives";
import { RouteObject } from "react-router";

export const justificativeRoute: RouteObject[] = [
    {
        path: "",
        element: <PrivateRoute permission="justificative.view">
            <JustificativeHome />
        </PrivateRoute>
    },
    {
        path: "add",
        element: <PrivateRoute permission="justificative.create">
            <JustificativeAdd />
        </PrivateRoute>
    },
    {
        path: "edit/:id",
        element: <PrivateRoute permission="justificative.edit">
            <JustificativeEdit />
        </PrivateRoute>
    },
    {
        path: "show/:id",
        element: <PrivateRoute permission="justificative.show">
            <JustificativeShow />
        </PrivateRoute>
    }
]