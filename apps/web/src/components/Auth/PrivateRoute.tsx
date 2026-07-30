import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from 'hooks';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
    permission?: string | string[];
    children: ReactNode;
};

export function PrivateRoute({ permission = [], children }: PrivateRouteProps): ReactNode {
    const { isTokenValid, isAllowed } = useAuthStore();

    // On attend que Zustand ait fini de relire les données sauvegardées
    // (localStorage) avant de décider si l'utilisateur est connecté ou non.
    // Sans ça, juste après un rechargement complet de page, il y a un court
    // instant où le token semble absent alors qu'il ne l'est pas -> redirection
    // vers /auth/login à tort.
    const [hasHydrated, setHasHydrated] = useState(useAuthStore.persist.hasHydrated());

    useEffect(() => {
        // Au cas où l'hydratation était déjà terminée avant le montage du composant
        setHasHydrated(useAuthStore.persist.hasHydrated());

        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            setHasHydrated(true);
        });

        return unsubscribe;
    }, []);

    if (!hasHydrated) {
        return <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>;
    }

    if (!isTokenValid()) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!isAllowed(permission)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
}
