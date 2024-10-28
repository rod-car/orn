import { Block, PageTitle } from 'ui'
import { SchoolForm } from './SchoolForm'
import { PrimaryLink } from '@base/components'
import { ReactNode } from 'react'

export function AddSchool(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un établissement">
                <PrimaryLink icon="list" to="/anthropo-measure/school/list">Liste des écoles</PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <SchoolForm />
            </Block>
        </>
    )
}
