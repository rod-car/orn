import { useApi } from 'hooks'
import { NavLink, useParams } from 'react-router-dom'
import { Block } from 'ui'
import { config, getToken } from '../../config'
import { useEffect, useState } from 'react'

export function DetailsSchool(): JSX.Element {
    const { Client, error, resetError } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
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
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>{school?.name}</h2>
                <NavLink to="/anthropo-measure/school/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des établissements
                </NavLink>
            </div>

            <Block>Details de l'école</Block>
        </>
    )
}
