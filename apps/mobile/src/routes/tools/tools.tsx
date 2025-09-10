import { PrivateRoute } from "@base/components/Auth";
import {ZCalculator, ZCalculatorHistory, ValueRepartition} from "@base/pages/Tools";
import { RouteObject } from "react-router";

export const toolsRoute:RouteObject[] = [
    {
        path: "z-calculator",
        element: <PrivateRoute permission={["tools.z-calculator"]}>
            <ZCalculator />
        </PrivateRoute>
    },
    {
        path: "z-history",
        element: <PrivateRoute permission={["tools.z-calculator"]}>
            <ZCalculatorHistory />
        </PrivateRoute>
    },
    {
        path: "value-repartition",
        element: <PrivateRoute permission={["value-repartition"]}>
            <ValueRepartition />
        </PrivateRoute>
    }
]