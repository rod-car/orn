import { Block, PageTitle } from 'ui'
import { PrimaryLink } from '@base/components'
import { StudentForm } from './StudentForm'
import { ReactNode } from 'react'

export function AddStudent(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un étudiant">
                <PrimaryLink to="/anthropo-measure/student/list" icon="list">
                    Liste des étudiants
                </PrimaryLink>
            </PageTitle>

            <Block>
                <StudentForm />
            </Block>
        </>
    )
}
