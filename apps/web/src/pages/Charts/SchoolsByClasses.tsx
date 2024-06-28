import { useApi, usePdf } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { config } from '@renderer/config'
import { Button, Select, Spinner } from 'ui'
import { generateColor } from '@renderer/utils'

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
import { scholar_years } from 'functions'

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

export function SchoolsByClasses(): ReactNode {
    const [scholarYear, setScholarYear] = useState<string>(scholar_years().at(1) as string)
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

    const { Client: StateClient, datas: StateDatas, RequestState } = useApi<StudentState>({
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

    const chartRef = useRef()

    const data = useMemo(() => {
        const realData = StateDatas.data
        const labels = schools.map((school) => school.name)

        const datasets = classes.map((classe, key) => {
            const data = realData && realData[scholarYear]

            return {
                label: classe.notation,
                data: schools.map((school) => (data ? data[school.name][classe.notation] : 0)),
                backgroundColor: generateColor(classe.notation ?? '', key)
            }
        })
        return {
            labels,
            datasets
        }
    }, [classes, schools, StateDatas, scholarYear])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: `EFFECTIF PAR ECOLE ET PAR CLASSE (${scholarYear})`,
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
                suggestedMax: 5
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

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h4 className="text-muted">Effectif par école et par classe</h4>
                </div>
                <div className="mb-4">
                    <Select
                        controlled
                        label="Année scolaire"
                        value={scholarYear}
                        options={scholar_years()}
                        onChange={({ target }): void => setScholarYear(target.value)}
                    />
                </div>
                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && (
                    <div className="custom-chart" ref={chartRef}>
                        <Bar options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}
