import { useApi } from 'hooks'
import { ReactNode, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Block } from 'ui'
import { config } from '@base/config'
import { UnitForm } from '@base/pages/Prices'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function UnitEdit(): ReactNode {
    const { Client, data: unit } = useApi<Unit>({
        baseUrl: config.baseUrl,
        
        url: '/prices/units'
    })

    const { id } = useParams()

    const getUnit = async (id: number): Promise<void> => {
        await Client.find(id)
    }

    useEffect(() => {
        getUnit(parseInt(id as string))
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                {unit ? (
                    <h3 className="m-0">{unit.name}</h3>
                ) : (
                    <Skeleton count={1} style={{ height: 40 }} containerClassName="w-50" />
                )}
                <NavLink to="/prices/units/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des unités
                </NavLink>
            </div>

            <Block className="mb-5">
                {unit ? (
                    <UnitForm editedUnit={unit} />
                ) : (
                    <Skeleton style={{ height: 40 }} count={4} />
                )}
            </Block>
        </>
    )
}
