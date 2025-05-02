import { PrivateRoute } from "@base/components/Auth";
import {ZCalculator, ZCalculatorHistory, ValueRepartition} from "@base/pages/Tools";
import { RouteObject } from "react-router";

export const toolsRoute:RouteObject[] = [
    {
        path: "z-calculator",
        element: <PrivateRoute>
            <ZCalculator />
        </PrivateRoute>
    },
    {
        path: "z-history",
        element: <PrivateRoute>
            <ZCalculatorHistory />
        </PrivateRoute>
    },
    {
        path: "value-repartition",
        element: <PrivateRoute>
            <ValueRepartition />
        </PrivateRoute>
    }
]