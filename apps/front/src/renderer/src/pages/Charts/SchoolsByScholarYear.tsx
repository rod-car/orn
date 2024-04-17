import { useApi, usePdf } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { config, token } from '../../../config'
import { Button, Spinner } from 'ui'

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
    const { exportToPdf } = usePdf()

    const { Client: SchoolCLient, datas: schools } = useApi<School>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/schools',
        key: 'data'
    })

    const {
        Client: StateClient,
        datas: StateDatas,
        RequestState
    } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: token,
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

    const chartRef = useRef()

    const exportPdf = useCallback(() => {
        exportToPdf(chartRef, 'Effectif_par_année_scolaire.pdf')
    }, [])

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="text-muted">Effectif par année scolaire</h4>
                    <Button onClick={exportPdf} icon="file" type="button" mode="info">
                        Exporter vers PDF
                    </Button>
                </div>
                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && (
                    <div className="custom-chart" ref={chartRef}>
                        <p className="d-none text-uppercase">Effectif par année scolaire</p>
                        <Line options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}
