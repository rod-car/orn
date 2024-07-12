import { useApi } from 'hooks'
import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Block, Spinner } from 'ui'
import { config } from '@base/config'
import { SchoolForm } from './SchoolForm'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function EditSchool(): JSX.Element {
    const { Client, data: school } = useApi<School>({
        baseUrl: config.baseUrl,
        
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
            <div className="d-flex justify-content-between align-items-center mb-5">
                {school ? (
                    <h3 className="m-0">{school.name}</h3>
                ) : (
                    <Skeleton count={1} style={{ height: 40 }} containerClassName="w-50" />
                )}
                <NavLink to="/anthropo-measure/school/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des établissements
                </NavLink>
            </div>

            <Block className="mb-5">
                {school ? (
                    <SchoolForm editedSchool={school} />
                ) : (
                    <Skeleton style={{ height: 40 }} count={4} />
                )}
            </Block>
        </>
    )
}
