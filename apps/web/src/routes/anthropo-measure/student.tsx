import { PrivateRoute } from "@base/components/Auth";
import { AddStudent, DetailsStudent, EditStudent, ImportStudent, ImportStudentClass, StudentList, StudentsClasses } from "@base/pages/Students";
import { RouteObject } from "react-router";

export const studentRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute>
            <StudentList />
        </PrivateRoute>,
    },
    {
        path: 'add',
        element: <PrivateRoute can={["admin"]}>
            <AddStudent />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={["admin"]}>
            <EditStudent />
        </PrivateRoute>
    },
    {
        path: 'import',
        element: <PrivateRoute can={["admin"]}>
            <ImportStudent />
        </PrivateRoute>
    },
    {
        path: 'import-class',
        element: <PrivateRoute can={["admin"]}>
            <ImportStudentClass />
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
        element: <PrivateRoute can={["admin"]}>
            <StudentsClasses />
        </PrivateRoute>
    }
]