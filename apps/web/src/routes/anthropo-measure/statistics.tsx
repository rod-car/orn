import { PrivateRoute } from "@base/components/Auth";
import { MetricResult, StudentRepartition, GlobalResult } from "@base/pages/Statistics";
import { RouteObject } from "react-router";

export const statisticRoute: RouteObject[] = [
    {
        path: 'student-repartition',
        element: <PrivateRoute permission="statistics.student-repartition">
            <StudentRepartition />
        </PrivateRoute>
    },
    {
        path: 'result-by-metric',
        element: <PrivateRoute permission="statistics.result-by-metric">
            <MetricResult />
        </PrivateRoute>
    },
    {
        path: 'result-global',
        element: <PrivateRoute permission="statistics.result-global">
            <GlobalResult />
        </PrivateRoute>
    }
]