import { useApi } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { config } from '../../../config'
import { Spinner } from 'ui'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: 'Effectif par ecole et par classe'
        }
    }
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
)

export function SchoolsByClasses(): JSX.Element {
    /* const [data, setData] = useState<{
        labels: string[]
        datasets: {
            label: string
            data: number[]
            backgroundColor: string
        }[]
    }>() */

    const { Client: SchoolCLient, datas: schools } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassCLient, datas: classes } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const {
        Client: StateClient,
        datas: StateDatas,
        RequestState
    } = useApi<StudentState>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    const getData = useCallback(() => {
        StateClient.get({}, '/state/school-class')
        SchoolCLient.get()
        ClassCLient.get()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const data = useMemo(() => {
        const realData = StateDatas.data
        const labels = schools.map((school) => school.name)
        const datasets = classes.map((classe) => {
            const red = Math.floor(Math.random() * 255)
            const green = Math.floor(Math.random() * 255)
            const blue = Math.floor(Math.random() * 255)
            const data = realData['2023-2024']
            return {
                label: classe.notation,
                data: schools.map((school) => (data ? data[school.name][classe.notation] : 0)),
                backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.5)`
            }
        })
        return {
            labels,
            datasets
        }
    }, [classes, schools, StateDatas])

    return (
        <>
            {RequestState.loading && <Spinner className="text-center w-100" />}
            {data && <Bar options={options} data={data} />}
        </>
    )
}
