import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
    barColors: {
        "0": "#002496",
        "1.0": "#0d3edf"
    },
    barThickness: 5,
    shadowBlur: 2
});

export function ProgressBar(): ReactNode {
    const [loading, setLoading] = useState(false)
    const { pathname } = useLocation();

    useEffect(() => {
        setLoading(true)
        const timeoutId = setTimeout(() => {
            setLoading(false)
        }, 1000)
        return () => clearTimeout(timeoutId)
    }, [pathname]);

    return <>{loading && <TopBarProgress />}</>
}