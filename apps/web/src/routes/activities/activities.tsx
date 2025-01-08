import { PrivateRoute } from "@base/components/Auth";
import { RouteObject } from "react-router";
import {
    ActivityAdd, ActivityEdit, ActivityHome, ActivityList, ActivityShow,
    ActivityStatistics, AdminActivityList
} from "@base/pages/Activities";

export const activityRoute: RouteObject[] = [
    {
        path: '',
        element: <PrivateRoute>
            <ActivityHome />
        </PrivateRoute>
    },
    {
        path: 'admin/add',
        element: <PrivateRoute can={['admin']}>
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
        element: <PrivateRoute can={['admin']}>
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
        element: <PrivateRoute can={['admin']}>
            <ActivityEdit />
        </PrivateRoute>
    }
];