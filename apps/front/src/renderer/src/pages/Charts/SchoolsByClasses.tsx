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
import { scholar_years } from 'functions'

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

export function SchoolsByClasses(): JSX.Element {
    const [scholarYear, setScholarYear] = useState<string>(scholar_years().at(1) as string)
    const { exportToPdf } = usePdf()

    const { Client: SchoolCLient, datas: schools } = useApi<School>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClassCLient, datas: classes } = useApi<Classes>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/classes',
        key: 'data'
    })

    const {
        Client: StateClient,
        datas: StateDatas,
        RequestState
    } = useApi<StudentState>({
        baseUrl: config.baseUrl,
        token: token,
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
        const datasets = classes.map((classe) => {
            const red = Math.floor(Math.random() * 255)
            const green = Math.floor(Math.random() * 255)
            const blue = Math.floor(Math.random() * 255)
            const data = realData[scholarYear]
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
    }, [classes, schools, StateDatas, scholarYear])

    const exportPdf = useCallback(() => {
        exportToPdf(chartRef, { filename: 'Effectif_par_école_par_classe_année_scolaire.pdf' })
    }, [])

    return (
        <>
            <div className="shadow-lg rounded p-4">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h4 className="text-muted">Effectif par école et par classe</h4>
                    <Button onClick={exportPdf} icon="file" type="button" mode="info">
                        Exporter vers PDF
                    </Button>
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
                        <p className="d-none text-uppercase">
                            Effectif par école et par classe: {scholarYear}
                        </p>
                        <Bar options={options} data={data} />
                    </div>
                )}
            </div>
        </>
    )
}