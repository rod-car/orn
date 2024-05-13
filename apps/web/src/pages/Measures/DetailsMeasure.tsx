import { useApi } from 'hooks'
import { useParams } from 'react-router-dom'
import { ApiErrorMessage, Block } from 'ui'
import { config, getToken } from '../../config'
import { useEffect, useState } from 'react'
import { Link } from '@renderer/components'

export function DetailsMeasure(): JSX.Element {
    const { Client, error, resetError } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
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
                <h2>Détails: {student && student[0]?.student?.lastname}</h2>
                <Link to="/student/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <Block>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Classe</th>
                            <th>Annee scolaire</th>
                            <th>Etablissement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student &&
                            student.map((st) => (
                                <tr key={st.id}>
                                    <td>{st.classe.name}</td>
                                    <td>{st.scholar_year}</td>
                                    <td>{st.school.name}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Block>
        </>
    )
}
