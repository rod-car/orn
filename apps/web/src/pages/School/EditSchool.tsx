/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Block, PageTitle,  } from 'ui'
import { SchoolForm } from './SchoolForm'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { PrimaryLink } from '@base/components'

export function EditSchool(): ReactNode {
    const { Client, data: school } = useApi<School>({
        url: '/schools'
    })

    const { id } = useParams()

    const getSchool = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getSchool(id as unknown as number)
    }, [])

    return (
        <>
            <PageTitle title="Editer un école">
                <PrimaryLink icon="list" to="/anthropo-measure/school/list">Liste des établissements</PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                {school ? <SchoolForm editedSchool={school} /> : <Skeleton style={{ height: 40 }} count={4} />}
            </Block>
        </>
    )
}
