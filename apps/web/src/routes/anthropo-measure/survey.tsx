import { PrivateRoute } from "@base/components/Auth";
import { Survey, AddSurvey, EditSurvey, AddSurveyStudent, DetailsSurvey, ImportResultSurvey } from "@base/pages/Surveys";
import { RouteObject } from "react-router";

export const surveyRoute: RouteObject[] = [
    {
        path: 'list',
        element: <PrivateRoute>
            <Survey />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute>
            <AddSurvey />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute>
            <EditSurvey />
        </PrivateRoute>
    },
    {
        path: 'details/:id',
        element: <PrivateRoute>
            <DetailsSurvey />
        </PrivateRoute>
    },
    {
        path: ':id/import-result',
        element: <PrivateRoute>
            <ImportResultSurvey />
        </PrivateRoute>
    },
    {
        path: 'add-student',
        element: <PrivateRoute>
            <AddSurveyStudent />
        </PrivateRoute>
    },
    {
        path: 'edit-student/:student_id/:survey_id',
        element: <PrivateRoute>
            <AddSurveyStudent />
        </PrivateRoute>
    }
]