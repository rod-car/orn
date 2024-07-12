import { useCallback, useEffect } from 'react'
import { Block } from 'ui'
import { useParams } from 'react-router-dom'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { Link, StudentFormLoading } from '@base/components'
import { StudentForm } from './StudentForm'
import Skeleton from 'react-loading-skeleton'

export function EditStudent(): JSX.Element {
    const { id } = useParams()

    const { Client: StudentClient, data: student } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const getStudent = useCallback(async () => {
        await StudentClient.find(parseInt(id ?? ''), {
            student_only: 1
        })
    }, [])

    useEffect(() => {
        getStudent()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                {student === null ? <Skeleton style={{ height: 30 }} containerClassName='w-50' /> : <h2>{student?.fullname}</h2>}
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>

            <Block>{student ? <StudentForm editedStudent={student} /> : <StudentFormLoading />}</Block>
        </>
    )
}
