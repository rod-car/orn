import { useApi } from 'hooks'
import { NavLink, useParams } from 'react-router-dom'
import { Block, PageTitle } from 'ui'
import { ReactNode, useEffect, useState } from 'react'
import { PrimaryLink } from '@base/components/index.ts'

export function DetailsSchool(): ReactNode {
    const { Client } = useApi<School>({
        url: 'schools'
    })

    const [school, setSchool] = useState<School | null>(null)

    const { id } = useParams()

    const getSchool = async (id: number): Promise<void> => {
        const school = await Client.find(id)
        if (school) setSchool(school)
    }

    useEffect(() => {
        getSchool(id as unknown as number)
    }, [])

    return (
        <>
            <PageTitle title={school?.name}>
                <PrimaryLink icon='list' to="/anthropo-measure/school/list">
                   Liste des établissements
                </PrimaryLink>
            </PageTitle>

            <Block>Details de l'école</Block>
        </>
    )
}
