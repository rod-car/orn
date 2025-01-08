import { PrimaryLink } from "@base/components";
import { ReactNode } from "react";
import { PageTitle } from "ui";
import { SchoolBySchoolYearClass } from "./SchoolBySchoolYearClass.tsx";

export function StudentRepartition(): ReactNode {
    return <>
        <PageTitle title="Repartition des étudiants">
            <PrimaryLink to="/" icon="speedometer">Tableau de bord</PrimaryLink>
        </PageTitle>

        <SchoolBySchoolYearClass />
    </>
}