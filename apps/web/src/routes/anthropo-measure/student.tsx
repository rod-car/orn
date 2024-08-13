import { PrivateRoute } from "@base/components/Auth";
import { AddStudent, DetailsStudent, EditStudent, ImportStudent, Student, StudentsClasses } from "@base/pages/Students";
import { RouteObject } from "react-router";

export const studentRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute>
            <Student />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute>
            <AddStudent />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute>
            <EditStudent />
        </PrivateRoute>
    },
    {
        path: 'import',
        element: <PrivateRoute>
            <ImportStudent />
        </PrivateRoute>
    },
    {
        path: 'details/:id',
        element: <PrivateRoute>
            <DetailsStudent />
        </PrivateRoute>
    },
    {
        path: 'students-classes',
        element: <PrivateRoute>
            <StudentsClasses />
        </PrivateRoute>
    }
]