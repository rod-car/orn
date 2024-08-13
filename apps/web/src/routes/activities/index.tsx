import { PrivateRoute } from "@base/components/Auth";
import { ActivityAdd, ActivityEdit, ActivityHome, ActivityList, ActivityStatistics, ActivityTypeAdd, ActivityTypeEdit, ActivityTypeList, AdminActivityList } from "@base/pages/Activities";
import { RouteObject } from "react-router";

export const activityRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute>
            <ActivityHome />
        </PrivateRoute>
    },
    {
        path: 'add',
        element: <PrivateRoute>
            <ActivityAdd />
        </PrivateRoute>
    },
    {
        path: 'statistics',
        element: <PrivateRoute>
            <ActivityStatistics />
        </PrivateRoute>
    },
    {
        path: 'list',
        element: <PrivateRoute>
            <ActivityList />
        </PrivateRoute>
    },
    {
        path: 'types',
        children: [
            {
                path: '',
                element: <PrivateRoute>
                    <ActivityTypeList />
                </PrivateRoute>
            },
            {
                path: 'add',
                element: <PrivateRoute>
                    <ActivityTypeAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute>
                    <ActivityTypeEdit />
                </PrivateRoute>
            },
        ],
    },
    {
        path: 'manage/list',
        element: <PrivateRoute>
            <AdminActivityList />
        </PrivateRoute>
    },
    {
        path: 'show/:id',
        element: <PrivateRoute>
            <h1>Modifier un activité</h1>
        </PrivateRoute>
    },
    {
        path: 'edit/:id',
        element: <PrivateRoute>
            <ActivityEdit />
        </PrivateRoute>
    }
];