import { useApi } from 'hooks'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { config, getToken } from '@renderer/config'
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
import { generateColor } from '@renderer/utils'

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: "Courbe d'évolution (Poids / Taille)"
        }
    },
    scales: {
        y: {
            title: {
                display: true,
                text: 'Valeur'
            },
            suggestedMax: 160
        },
        x: {
            title: {
                display: true,
                text: "Phase d'enquête"
            },
            suggestedMax: 0
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

export function StudentEvolution({ student_id }: { student_id: number }): ReactNode {
    const { Client: SurveyClient, datas: surveys } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/surveys',
        key: 'data'
    })

    const {
        Client: StateClient,
        datas: StateDatas,
        RequestState
    } = useApi<Student>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/students'
    })

    const getData = useCallback(() => {
        StateClient.get({}, `/${student_id}/state/student-evolution`)
        SurveyClient.get()
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const data = useMemo(() => {
        const realData = StateDatas.data
        const headers = 'headers' in StateDatas ? (StateDatas.headers as string[]) : []

        const nS = surveys.filter((survey) => {
            const hasValue = realData[headers[0]][survey.phase]
            return hasValue !== undefined
        })

        const labels = nS.map((survey) => survey.phase + ` (${survey.date})`)

        const datasets =
            headers &&
            headers.map((header, key) => {
                return {
                    label: header,
                    data: nS.map((survey) => realData[header][survey.phase]),
                    backgroundColor: generateColor(header, key + 30)
                }
            })

        return { labels, datasets }
    }, [StateDatas, surveys])

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <h4 className="mb-4 text-muted">Courbe d'évolution (Poids / Taille)</h4>
                {RequestState.loading && <Spinner className="text-center w-100" />}
                {data && <Line options={options} data={data} />}
            </div>
        </>
    )
}
