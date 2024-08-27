import { PrivateRoute } from "@base/components/Auth";
import { ActivityAdd, ActivityEdit, ActivityHome, ActivityList, ActivityShow, ActivityStatistics, AdminActivityList } from "@base/pages/Activities";
import { RouteObject } from "react-router";

export const activityRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute>
            <ActivityHome />
        </PrivateRoute>
    },
    {
        path: 'admin/add',
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
        path: 'admin/list',
        element: <PrivateRoute>
            <AdminActivityList />
        </PrivateRoute>
    },
    {
        path: 'show/:id',
        element: <PrivateRoute>
            <ActivityShow />
        </PrivateRoute>
    },
    {
        path: 'admin/edit/:id',
        element: <PrivateRoute>
            <ActivityEdit />
        </PrivateRoute>
    }
];