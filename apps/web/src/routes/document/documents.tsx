import { PrivateRoute } from "@base/components/Auth";
import { DocumentHome, DocumentAdd, DocumentShow, DocumentEdit } from "@base/pages/Documents";
import { RouteObject } from "react-router";

export const documentRoute:RouteObject[] = [
    {
        path: "",
        element: <PrivateRoute permission="document.view">
            <DocumentHome />
        </PrivateRoute>
    },
    {
        path: "add",
        element: <PrivateRoute permission="document.create">
            <DocumentAdd />
        </PrivateRoute>
    },
    {
        path: "edit/:id",
        element: <PrivateRoute permission="document.edit">
            <DocumentEdit />
        </PrivateRoute>
    },
    {
        path: "show/:id",
        element: <PrivateRoute permission="document.show">
            <DocumentShow />
        </PrivateRoute>
    }
]