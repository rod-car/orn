import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from 'hooks';

type PrivateRouteProps = {
    permission?: string[];
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