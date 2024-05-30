import { ReactNode } from "react";

export function Contributors(): ReactNode {
    return <>
        <h3 className="mb-4">Contributeurs</h3>
        <ContributorInfo names={['Gislain Carino Rodrigue BOUDI']} role="Dévéloppeur" />
        <ContributorInfo names={['Prisca', 'Franco', 'Toky']} role="Agent de Saisie" />
    </>
}

function ContributorInfo({ names, role }: { names: string[], role: string }) {
    return <div className="mb-5">
        <h5 className="fw-bold">{role}</h5>
        <hr />
        <h5>{names.join(', ')}</h5>
    </div>
}