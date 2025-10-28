import { PrivateRoute } from "@base/components/Auth";
import { AddStudent, DetailsStudent, EditStudent, ImportStudent, ImportStudentClass, StudentList, StudentsClasses, StudentEvolutions, StudentListDuplicates } from "@base/pages/Students";
import { RouteObject } from "react-router";

export const studentRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission="student.view">
            <StudentList />
        </PrivateRoute>,
    },
    {
        path: 'list-duplicates',
        element: <PrivateRoute permission="student.view">
            <StudentListDuplicates />
        </PrivateRoute>,
    },
    {
        path: 'evolutions',
        element: <PrivateRoute permission="student.view">
            <StudentEvolutions />
        </PrivateRoute>,
    },
    {
        path: 'add',
        element: <PrivateRoute permission="student.create">
            <AddStudent />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="student.edit">
            <EditStudent />
        </PrivateRoute>
    },
    {
        path: 'import',
        element: <PrivateRoute permission="student.import">
            <ImportStudent />
        </PrivateRoute>
    },
    {
        path: 'import-class',
        element: <PrivateRoute permission="student.import-class">
            <ImportStudentClass />
        </PrivateRoute>
    },
    {
        path: 'details/:id',
        element: <PrivateRoute permission="student.show">
            <DetailsStudent />
        </PrivateRoute>
    },
    {
        path: 'students-classes',
        element: <PrivateRoute permission="student.update-class">
            <StudentsClasses />
        </PrivateRoute>
    }
]