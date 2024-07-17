import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { config } from '@base/config'
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

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: 'EFFECTIF PAR ANNEE SCOLAIRE',
            font: {
                size: 14
            }
        }
    },
    scales: {
        y: {
            title: {
                display: true,
                text: "Nombre d'étudiants"
            },
            ticks: {
                font: {
                    weight: 'bold',
                    size: 13
                }
            },
            suggestedMin: 0
        },
        x: {
            ticks: {
                font: {
                    weight: 'bold',
                    size: 13
                }
            }
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

export function SchoolsByScholarYearChart(): ReactNode {
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

    const generateColor = (notation: string, seed: number): string => {
        const hash = (notation + seed).split('').reduce((acc, char) => {
            const chr = char.charCodeAt(0)
            acc = (acc << 5) - acc + chr
            return acc & acc
        }, 0)

        const red = (hash & 0xff0000) >> 16
        const green = (hash & 0x00ff00) >> 8
        const blue = hash & 0x0000ff

        return `rgba(${red}, ${green}, ${blue}, 0.8)`
    }

    const data = useMemo(() => {
        const realData = StateDatas.data
        const labels = schools.map((school) => school.name)
        const headers = 'headers' in StateDatas ? (StateDatas.headers as string[]) : []

        const datasets =
            headers &&
            headers.map((scholar_year) => {
                return {
                    label: scholar_year,
                    data: schools.map((school) => realData[school.name][scholar_year]),
                    backgroundColor: generateColor(
                        scholar_year,
                        parseInt(scholar_year.split('-')[0]) - 2000
                    )
                }
            })

        return { labels, datasets }
    }, [StateDatas, schools])

    const chartRef = useRef()

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="text-muted">Effectif par année scolaire</h4>
                </div>
                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && (
                    <div className="custom-chart" ref={chartRef}>
                        <Line options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}
