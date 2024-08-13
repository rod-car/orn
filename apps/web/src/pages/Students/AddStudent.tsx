import { Block, PageTitle } from 'ui'
import { Link } from '@base/components'
import { StudentForm } from './StudentForm'

export function AddStudent(): JSX.Element {
    return (
        <>
            <PageTitle title="Ajouter un étudiant">
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </PageTitle>

            <Block>
                <StudentForm />
            </Block>
        </>
    )
}
