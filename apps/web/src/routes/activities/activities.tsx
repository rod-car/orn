import { PrivateRoute } from "@base/components/Auth";
import { RouteObject } from "react-router";
import {
    ActivityAdd, ActivityEdit, ActivityHome, ActivityList, ActivityShow,
    ActivityStatistics, AdminActivityList
} from "@base/pages/Activities";

export const activityRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute permission="activity.view">
            <ActivityHome />
        </PrivateRoute>
    },
    {
        path: 'admin/add',
        element: <PrivateRoute permission="activity.create">
            <ActivityAdd />
        </PrivateRoute>
    },
    {
        path: 'statistics',
        element: <PrivateRoute permission="activity.statistics">
            <ActivityStatistics />
        </PrivateRoute>
    },
    {
        path: 'list',
        element: <PrivateRoute permission="activity.view">
            <ActivityList />
        </PrivateRoute>
    },
    {
        path: 'admin/list',
        element: <PrivateRoute permission="activity.admin.view">
            <AdminActivityList />
        </PrivateRoute>
    },
    {
        path: 'show/:id',
        element: <PrivateRoute permission="activity.show">
            <ActivityShow />
        </PrivateRoute>
    },
    {
        path: 'admin/edit/:id',
        element: <PrivateRoute permission="activity.edit">
            <ActivityEdit />
        </PrivateRoute>
    }
];