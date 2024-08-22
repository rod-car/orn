import { PrivateRoute } from "@base/components/Auth";
import { DocumentHome, DocumentAdd, DocumentShow, DocumentEdit } from "@base/pages/Documents";
import { RouteObject } from "react-router";

export const documentRoute:RouteObject[] = [
    {
        path: "",
        element: <PrivateRoute>
            <DocumentHome />
        </PrivateRoute>
    },
    {
        path: "add",
        element: <PrivateRoute>
            <DocumentAdd />
        </PrivateRoute>
    },
    {
        path: "edit/:id",
        element: <PrivateRoute>
            <DocumentEdit />
        </PrivateRoute>
    },
    {
        path: "show/:id",
        element: <PrivateRoute>
            <DocumentShow />
        </PrivateRoute>
    }
]