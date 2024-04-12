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
import { useApi } from 'hooks'
import React, { useCallback, useEffect } from 'react'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'
import { config } from '../../config'
import { Spinner } from 'ui'

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

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart'
        }
    }
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => Math.random() * 1000),
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => Math.random() * 1000),
            backgroundColor: 'rgba(53, 162, 235, 0.5)'
        }
    ]
}

export const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
    ]
}

export const dognutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
    ]
}

export function Home(): React.ReactElement {
    const { Client: StudentClient, datas: studentCount } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students',
        key: 'data'
    })

    const { Client: SchoolClient, datas: schoolCount } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const getStudentsCount = useCallback(async () => {
        await StudentClient.get({
            count: 1
        })
    }, [])

    const getSchoolsCount = useCallback(async () => {
        await SchoolClient.get({
            count: 1
        })
    }, [])

    useEffect(() => {
        getStudentsCount()
        getSchoolsCount()
    }, [])

    return (
        <>
            <h1 className="mb-5">Dashboard</h1>
            <div className="row mb-5">
                <div className="col-xl-4 col-lg-4">
                    <div className="card card-stats mb-4 mb-xl-0 shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <h5 className="card-title text-uppercase text-muted mb-0">
                                        Étudiants
                                    </h5>
                                    <span className="h2 font-weight-bold mb-0">{'count' in studentCount ? studentCount.count : <Spinner />}</span>
                                </div>
                                <div className="col-auto">
                                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                        <i className="fa fa-users"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 mb-0 text-muted text-sm">
                                <span className="text-success me-2">
                                    <i className="fa fa-arrow-up"></i> 3.48%
                                </span>
                                <span className="text-nowrap">Since last month</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-4">
                    <div className="card card-stats mb-4 mb-xl-0 shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <h5 className="card-title text-uppercase text-muted mb-0">
                                        Écoles
                                    </h5>
                                    <span className="h2 font-weight-bold mb-0">{'count' in schoolCount ? schoolCount.count : <Spinner />}</span>
                                </div>
                                <div className="col-auto">
                                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                        <i className="fa fa-home"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 mb-0 text-muted text-sm">
                                <span className="text-success me-2">
                                    <i className="fa fa-arrow-up"></i> 3.48%
                                </span>
                                <span className="text-nowrap">Since last month</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-4">
                    <div className="card card-stats mb-4 mb-xl-0 shadow">
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <h5 className="card-title text-uppercase text-muted mb-0">
                                        Enquête
                                    </h5>
                                    <span className="h2 font-weight-bold mb-0">350,897</span>
                                </div>
                                <div className="col-auto">
                                    <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                                        <i className="fa fa-chart-bar"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 mb-0 text-muted text-sm">
                                <span className="text-success me-2">
                                    <i className="fa fa-arrow-up"></i> 3.48%
                                </span>
                                <span className="text-nowrap">Since last month</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-6">
                    <Bar options={options} data={data} />
                </div>
                <div className="col-6">
                    <Line options={options} data={data} />
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-6">
                    <Pie options={options} data={pieData} />
                </div>
                <div className="col-6">
                    <Doughnut options={options} data={dognutData} />
                </div>
            </div>
        </>
    )
}
