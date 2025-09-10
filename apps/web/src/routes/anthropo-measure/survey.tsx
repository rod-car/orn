import { PrivateRoute } from "@base/components/Auth";
import { Survey, AddSurvey, EditSurvey, AddSurveyStudent, DetailsSurvey, ImportResultSurvey } from "@base/pages/Surveys";
import { RouteObject } from "react-router";

export const surveyRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute permission="anthropometry.view">
            <Survey />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute permission="anthropometry.create">
            <AddSurvey />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute permission="anthropometry.create">
            <EditSurvey />
        </PrivateRoute>
    },
    {
        path: 'details/:id',
        element: <PrivateRoute permission="anthropometry.show">
            <DetailsSurvey />
        </PrivateRoute>
    },
    {
        path: ':id/import-result',
        element: <PrivateRoute permission="anthropometry.import">
            <ImportResultSurvey />
        </PrivateRoute>
    },
    {
        path: 'add-student',
        element: <PrivateRoute permission="anthropometry.form">
            <AddSurveyStudent />
        </PrivateRoute>
    },
    {
        path: 'edit-student/:student_id/:survey_id',
        element: <PrivateRoute permission="anthropometry.form">
            <AddSurveyStudent />
        </PrivateRoute>
    }
]