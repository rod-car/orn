import { useApi, usePdf } from 'hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { config, token } from '../../../config'
import { Button, Select, Spinner } from 'ui'

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

export function ZBySchool(): JSX.Element {
    const [surveyId, setSurveyId] = useState(1)
    const [stateType, setStateType] = useState('MA')
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
    } = useApi<SurveySchoolZ>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/students'
    })

    useEffect(() => {
        StateClient.get({}, `/state/student-school-z/${surveyId}`)
    }, [surveyId])

    const getData = useCallback(async () => {
        SchoolCLient.get()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const data = useMemo(() => {
        const realData = StateDatas.datas as SchoolZ
        if (realData === undefined) return []

        const stateTypes = ['G', 'M', 'S']

        const labels = schools.map((school) => school.name)
        const datasets = stateTypes.map((type) => {
            const red = Math.floor(Math.random() * 255)
            const green = Math.floor(Math.random() * 255)
            const blue = Math.floor(Math.random() * 255)
            const data = realData[surveyId]
            return {
                label: type,
                data: schools.map((school) =>
                    data ? data[school.name][stateType][type]['value'] : 0
                ),
                backgroundColor: `rgba(${red}, ${green}, ${blue}, 0.5)`
            }
        })

        return {
            labels,
            datasets
        }
    }, [schools, StateDatas, surveyId, stateType])

    const chartRef = useRef()
    const exportPdf = useCallback(() => {
        exportToPdf(chartRef, { filename: 'Effectif_de_mal_nutrition.pdf' })
    }, [])

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h4 className="text-muted">Statistique de malnutrition</h4>
                    <Button onClick={exportPdf} icon="file" type="button" mode="info">
                        Exporter vers PDF
                    </Button>
                </div>

                <div className="row mb-4">
                    <div className="col-6">
                        <Select
                            controlled
                            placeholder={null}
                            label="Phase d'enquête"
                            value={surveyId}
                            options={[1, 2, 3]}
                            onChange={({ target }): void => setSurveyId(parseInt(target.value))}
                        />
                    </div>
                    <div className="col-6">
                        <Select
                            controlled
                            placeholder={null}
                            label="Type d'état"
                            value={stateType}
                            options={['MA', 'IP', 'CH']}
                            onChange={({ target }): void => setStateType(target.value)}
                        />
                    </div>
                </div>
                {RequestState.loading && <Spinner className="text-center w-100" />}

                {data && data.labels && data.labels.length > 0 && (
                    <div className="custom-chart" ref={chartRef}>
                        <p className="d-none text-uppercase">
                            Statistique de malnutrition {stateType} phase: {surveyId}
                        </p>
                        <Bar options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}
