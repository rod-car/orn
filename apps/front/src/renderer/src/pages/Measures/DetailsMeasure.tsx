import { useApi } from 'hooks'
import { NavLink, useParams } from 'react-router-dom'
import { ApiErrorMessage } from 'ui'
import { config } from '../../../config'
import { useEffect, useState } from 'react'

export function DetailsMeasure(): JSX.Element {
    const { Client, error, resetError } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: 'students'
    })

    const [student, setStudent] = useState<Student | null>(null)

    const { id } = useParams()

    const getStudent = async (id: number): Promise<void> => {
        const student = await Client.find(id)
        if (student) setStudent(student)
    }

    useEffect(() => {
        getStudent(id as unknown as number)
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Détails: {student && student[0]?.student?.lastname}</h1>
                <NavLink to="/student/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </NavLink>
            </div>

            {error && (
                <ApiErrorMessage
                    className="mb-3"
                    message={error.message}
                    onClose={(): void => {
                        resetError()
                    }}
                />
            )}

            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Classe</th>
                        <th>Annee scolaire</th>
                        <th>Etablissement</th>
                    </tr>
                </thead>
                <tbody>
                    {student && student.map(st => <tr key={st.id}>
                        <td>{st.classe.name}</td>
                        <td>{st.scholar_year}</td>
                        <td>{st.school.name}</td>
                    </tr>)}
                </tbody>
            </table>
        </>
    )
}
