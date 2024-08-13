import { useCallback, useEffect } from 'react'
import { Block, PageTitle } from 'ui'
import { useParams } from 'react-router-dom'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { Link, StudentFormLoading } from '@base/components'
import { StudentForm } from './StudentForm'
import Skeleton from 'react-loading-skeleton'
import { Flex } from '@base/components';

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
            {student === null ? <Flex className="mb-3" alignItems="center" justifyContent="between">
                <Skeleton style={{ height: 30 }} containerClassName='w-50' />
            </Flex> : 
            <PageTitle title={student?.fullname}>
                <Link to="/anthropo-measure/student/list" className="btn primary-link">
                    <i className="bi bi-list me-2"></i>Liste des étudiants
                </Link>
            </PageTitle>}

            <Block>{student ? <StudentForm editedStudent={student} /> : <StudentFormLoading />}</Block>
        </>
    )
}
