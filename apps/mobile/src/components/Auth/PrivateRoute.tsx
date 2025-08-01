import { ReactNode } from 'react';
import { useAuthStore } from 'hooks';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
    permission?: string|string[];
    children: ReactNode;
};

export function PrivateRoute({ permission = [], children }: PrivateRouteProps): ReactNode {
    const { isTokenValid, isAllowed } = useAuthStore();

    if (!isTokenValid()) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!isAllowed(permission)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
}