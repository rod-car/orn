/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { useParams } from 'react-router-dom'
import { ApiErrorMessage, Block, PageTitle } from 'ui'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { StudentEvolution, StudentStatus } from '@base/charts'
import { PrimaryLink } from '@base/components'

export function DetailsStudent(): ReactNode {
    const { Client, error, resetError, RequestState } = useApi<Student>({
        url: 'students'
    })

    const [student, setStudent] = useState<Student | null>(null)

    const { id } = useParams()

    const getStudent = useCallback(async (id: number) => {
        const student = await Client.find(id, { student_only: 1 })
        if (student) setStudent(student)
    }, [id])

    useEffect(() => {
        getStudent(id as unknown as number)
    }, [id])

    return (
        <>
            <PageTitle title={student && student.fullname}>
                <PrimaryLink permission="student.view" to="/anthropo-measure/student/list" icon="list">
                    Liste des étudiants
                </PrimaryLink>
            </PageTitle>

            {error && (
                <ApiErrorMessage
                    className="mb-3"
                    message={error.message}
                    onClose={(): void => {
                        resetError()
                    }}
                />
            )}

            <Block className="mb-4">
                <h6>Détails de la classe</h6>
                <hr />
                <table className="table table-striped table-bordered table-hover text-sm m-0">
                    <thead>
                        <tr>
                            <th>Classe</th>
                            <th>Année scolaire</th>
                            <th>Établissement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading && <tr><td colSpan={3} className="text-center">Chargement</td></tr>}
                        {student &&
                            student.classes?.map((classe) => {
                                const school = student.schools?.find((school) => {
                                    return school.pivot.scholar_year === classe.pivot.scholar_year
                                })

                                return (
                                    <tr key={classe.name}>
                                        <td>{classe.name}</td>
                                        <td>{classe.pivot.scholar_year}</td>
                                        <td>{school?.name}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </Block>

            {student && (
                <>
                    <div className="mb-5">
                        <StudentEvolution student_id={student.id} />
                    </div>
                    <StudentStatus student_id={student.id} />
                </>
            )}
        </>
    )
}
