import { PrivateRoute } from "@base/components/Auth";
import { MetricResult, StudentRepartition, GlobalResult } from "@base/pages/Statistics";
import { RouteObject } from "react-router";

export const statisticRoute: RouteObject[] = [
    {
        path: 'student-repartition',
        element: <PrivateRoute>
            <StudentRepartition />
        </PrivateRoute>
    },
    {
        path: 'result-by-metric',
        element: <PrivateRoute>
            <MetricResult />
        </PrivateRoute>
    },
    {
        path: 'result-global',
        element: <PrivateRoute>
            <GlobalResult />
        </PrivateRoute>
    }
]