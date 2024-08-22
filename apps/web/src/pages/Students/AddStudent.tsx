import { Block, PageTitle } from 'ui'
import { Link } from '@base/components'
import { StudentForm } from './StudentForm'
import { ReactNode } from 'react'

export function AddStudent(): ReactNode {
    return (
        <>
            <PageTitle title="Ajouter un étudiant">
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="bi bi-list me-2"></i>Liste des étudiants
                </Link>
            </PageTitle>

            <Block>
                <StudentForm />
            </Block>
        </>
    )
}
