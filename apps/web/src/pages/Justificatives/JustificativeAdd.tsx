/* eslint-disable react-hooks/exhaustive-deps */
import { PrimaryLink } from "@base/components";
import { ReactNode } from "react";
import { PageTitle } from "ui";
import { JustificativeForm } from "@base/pages/Justificatives";

export function JustificativeAdd(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter une piece justificative">
                <PrimaryLink icon="list" to="/justificatives" permission="justificative.view">
                    Liste des pieces justificatives
                </PrimaryLink>
            </PageTitle>
            <JustificativeForm />
        </>
    );
}