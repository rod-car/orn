/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "@base/components";
import { ReactNode } from "react";
import { PageTitle } from "ui";
import { DocumentForm } from "@base/pages/Documents";

export function DocumentAdd(): ReactNode {
    return <>
        <PageTitle title="Ajouter un document">
            <Link className="btn btn-primary" to="/documents"><i className="fa fa-list me-2"></i>Les derniers documents</Link>
        </PageTitle>
        <DocumentForm />
    </>
}