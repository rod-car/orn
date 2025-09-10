/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, PageTitle } from 'ui'
import { useParams } from 'react-router-dom'
import { useApi, useAuthStore } from 'hooks'
import { PrimaryLink, StudentFormLoading } from '@base/components'
import { StudentForm } from './StudentForm'
import Skeleton from 'react-loading-skeleton'
import { Flex } from '@base/components';
import { Forbidden } from '@base/pages/Errors';

export function EditStudent(): ReactNode {
    const { id } = useParams()
    const { user, isAllowed } = useAuthStore()
    const [forbidden, setForbidden] = useState(false)

    const { Client: StudentClient, data: student } = useApi<Student>({
        url: '/students'
    })

    const getStudent = useCallback(async () => {
        const studentData = await StudentClient.find(parseInt(id ?? ''), {
            student_only: 1
        })

        if (!isAllowed("user.create") && (studentData?.schools?.at(0) && studentData.schools.at(0)?.id !== user?.school?.id)) setForbidden(true)
    }, [])

    useEffect(() => {
        getStudent()
    }, [])

    return (
        <>
            {forbidden ? <Forbidden /> : <>
                {student === null ? <Flex className="mb-3" alignItems="center" justifyContent="between">
                    <Skeleton style={{ height: 30 }} containerClassName='w-50' />
                </Flex> : 
                <PageTitle title={student?.fullname}>
                    <PrimaryLink permission="student.view" to="/anthropo-measure/student/list" icon="list">
                        Liste des étudiants
                    </PrimaryLink>
                </PageTitle>}

                <Block>{(student && !forbidden) ? <StudentForm editedStudent={student} /> : <StudentFormLoading />}</Block>
            </>}
        </>
    )
}
