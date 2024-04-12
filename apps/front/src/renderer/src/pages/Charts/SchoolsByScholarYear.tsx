import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
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
import { Line } from 'react-chartjs-2'

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: 'Effectif par annee scolaire'
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

export function SchoolsByScholarYear(): ReactNode {
    const { Client: SchoolCLient, datas: schools } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const {
        Client: StateClient,
        datas: StateDatas,
        RequestState
    } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    const getData = useCallback(() => {
        StateClient.get({}, '/state/school-scholar-year')
        SchoolCLient.get()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const data = useMemo(() => {
        const realData = StateDatas.data
        const labels = schools.map((school) => school.name)
        const headers = 'headers' in StateDatas ? (StateDatas.headers as string[]) : []

        const datasets =
            headers &&
            headers.map((scholar_year) => {
                const red = Math.floor(Math.random() * 255)
                const green = Math.floor(Math.random() * 255)
                const blue = Math.floor(Math.random() * 255)

                return {
                    label: scholar_year,
                    data: schools.map((school) => realData[school.name][scholar_year]),
                    backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.5)`
                }
            })

        return { labels, datasets }
    }, [StateDatas, schools])

    return (
        <>
            {RequestState.loading && <Spinner className="text-center w-100" />}
            {data && <Line options={options} data={data} />}
        </>
    )
}
