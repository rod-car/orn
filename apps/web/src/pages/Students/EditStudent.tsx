/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useCallback, useEffect } from 'react'
import { Block, PageTitle } from 'ui'
import { useParams } from 'react-router-dom'
import { useApi } from 'hooks'
import { Link, PrimaryLink, StudentFormLoading } from '@base/components'
import { StudentForm } from './StudentForm'
import Skeleton from 'react-loading-skeleton'
import { Flex } from '@base/components';

export function EditStudent(): ReactNode {
    const { id } = useParams()

    const { Client: StudentClient, data: student } = useApi<Student>({
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
                <PrimaryLink to="/anthropo-measure/student/list" icon="list">
                    Liste des étudiants
                </PrimaryLink>
            </PageTitle>}

            <Block>{student ? <StudentForm editedStudent={student} /> : <StudentFormLoading />}</Block>
        </>
    )
}
