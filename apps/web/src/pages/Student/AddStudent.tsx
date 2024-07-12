import { Block } from 'ui'
import { Link } from '@base/components'
import { StudentForm } from './StudentForm'

export function AddStudent(): JSX.Element {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-muted">Ajouter un étudiant</h2>
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <Block>
                <StudentForm />
            </Block>
        </>
    )
}
