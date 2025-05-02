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
        element: <PrivateRoute can={['admin']}>
            <AddSurvey />
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute can={['admin']}>
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
        element: <PrivateRoute can={['admin']}>
            <ImportResultSurvey />
        </PrivateRoute>
    },
    {
        path: 'add-student',
        element: <PrivateRoute can={['admin']}>
            <AddSurveyStudent />
        </PrivateRoute>
    },
    {
        path: 'edit-student/:student_id/:survey_id',
        element: <PrivateRoute can={['admin']}>
            <AddSurveyStudent />
        </PrivateRoute>
    }
]