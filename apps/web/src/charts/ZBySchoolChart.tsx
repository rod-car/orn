/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Block, Select, Spinner } from 'ui'
import { generateColor } from '@base/utils'

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

const types = {
    MA: 'ÉMACIATION',
    IP: 'INSUFFISANCE PONDÉRALE',
    CH: 'RETARD DE CROISSANCE'
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

export function ZBySchoolChart(): ReactNode {
    const [surveyId, setSurveyId] = useState(1)

    const { Client: SchoolCLient, datas: schools } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const {
        Client: StateClient,
        datas: StateDatas,
        RequestState
    } = useApi<SurveySchoolZ>({
        url: '/students'
    })

    useEffect(() => {
        const fetchState = async (): Promise<void> => {
            await StateClient.get({}, `/state/student-school-z/${surveyId}`)
        }
        fetchState()
    }, [surveyId])

    const getData = useCallback(async () => {
        await SchoolCLient.get()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const data = useCallback(
        (stateType: string) => {
            const realData = StateDatas.datas as SchoolZ
            if (realData === undefined) return []

            const stateTypes = ['Global', 'Modéré', 'Sévère']

            const labels = schools.map((school) => school.name)
            const datasets = stateTypes.map((type, key) => {
                const data = realData[surveyId]
                return {
                    label: type,
                    data: schools.map((school) =>
                        data ? data[school.name][stateType][type]['value'] : 0
                    ),
                    backgroundColor: generateColor(type, key + 5)
                }
            })

            return {
                labels,
                datasets
            }
        },
        [schools, StateDatas, surveyId]
    )

    return (
        <Block>
            <div className="row mb-4">
                <div className="col-12">
                    <Select
                        controlled
                        placeholder={null}
                        label="Mesure d'enquête"
                        value={surveyId}
                        options={[1, 2, 3]}
                        onChange={({ target }): void => setSurveyId(parseInt(target.value))}
                    />
                </div>
            </div>

            {RequestState.loading && <Spinner className="text-center w-100" />}

            {Object.keys(types).map((type) => {
                const options = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top' as const
                        },
                        title: {
                            display: true,
                            text: `${types[type]} (Mesure ${surveyId})`,
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
                const datas = data(type)
                return (
                    datas &&
                    datas.labels &&
                    datas.labels.length > 0 && (
                        <div key={type} className="custom-chart m-charts mb-5">
                            <Bar options={options} data={datas} />
                        </div>
                    )
                )
            })}
        </Block>
    )
}
