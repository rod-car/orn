/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { config } from '@base/config'
import { Block, Spinner } from 'ui'
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
import { generateColor } from '@base/utils'

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: "Courbe d'évolution (Malnutrition / Insufisance pondérale / Chronique)"
        }
    },
    scales: {
        y: {
            title: {
                display: true,
                text: 'Valeur de Z'
            },
            suggestedMin: -4
        },
        x: {
            title: {
                display: true,
                text: "Phase d'enquête"
            },
            suggestedMin: 0
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

export function StudentStatus({ student_id }: { student_id: number }): ReactNode {
    const { Client: SurveyClient, datas: surveys } = useApi<Survey>({
        
        url: '/surveys',
        key: 'data'
    })

    const { Client: StateClient, datas: StateDatas, RequestState } = useApi<Student>({
        
        url: '/students'
    })

    const getData = useCallback(() => {
        StateClient.get({ type: 'ma' }, `/${student_id}/state/student-evolution`)
        SurveyClient.get()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const data = useMemo(() => {
        const realData = StateDatas.data
        if (realData) {
            const headers = 'headers' in StateDatas ? (StateDatas.headers as string[]) : []
    
            const nS = surveys.filter((survey) => {
                const hasValue = realData[headers[0]][survey.id]
                return hasValue !== undefined
            })
    
            const labels = nS.map((survey) => survey.phase + ` (${survey.date})`)
    
            const datasets =
                headers &&
                headers.map((header, key) => {
                    return {
                        label: header,
                        data: nS.map((survey) => realData[header][survey.id]),
                        backgroundColor: generateColor(header, key + 50)
                    }
                })
            return { labels, datasets }
        }
    }, [StateDatas, surveys])

    return (
        <>
            <Block>
                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && <Line options={options} data={data} />}
            </Block>
        </>
    )
}
