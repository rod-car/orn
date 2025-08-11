/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react'
import { AddConso } from './AddConso.tsx'
import { useApi } from 'hooks'
import { useNavigate, useParams } from 'react-router'
import { Spinner } from 'ui'

export function EditConso(): ReactNode {
    const { Client, data, RequestState } = useApi<ConsommationModel>({ url: '/consommations' })
    const { id } = useParams()
    const navigate = useNavigate()

    const getConso = async () => {
        if (!id) return navigate('/not-found')
        const response = await Client.find(parseInt(id))

        if (response === null) return navigate('/not-found')
    }

    useEffect(() => {
        getConso()
    }, [])

    return <>{RequestState.loading ? <Spinner isBorder className='text-center' /> : <AddConso editedConso={data as ConsommationModel} />}</>
}
