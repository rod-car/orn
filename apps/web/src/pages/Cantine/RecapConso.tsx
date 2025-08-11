/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Block, PageTitle, Select } from 'ui'
import { PrimaryLink } from '@base/components'
import { Col, Row } from '@base/components/Bootstrap'
import { useApi } from 'hooks'
import { months, years, format, formatNumber } from 'functions'

export function RecapConso() {
    const [selectedMonth, setSelectedMonth] = useState<number>(0)
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    const { Client, datas: consommation, RequestState } = useApi<unknown>({
        url: '/consommations/recap',
        key: 'data'
    })

    const fetchRecap = async (params?: Record<string, string>) => {
        await Client.get(params)
    }

    useEffect(() => {
        fetchRecap({ year: selectedYear.toString() })
    }, [])

    useEffect(() => {
        if (selectedMonth > 0 && selectedYear) {
            const firstDay = new Date(selectedYear, selectedMonth - 1, 1)
            const lastDay = new Date(selectedYear, selectedMonth, 0)

            setStartDate(format(firstDay.toDateString(), "y-MM-dd"))
            setEndDate(format(lastDay.toDateString(), "y-MM-dd"))

            fetchRecap({
                year: selectedYear.toString(),
                month: selectedMonth.toString()
            })
        } else {
            fetchRecap({ year: selectedYear.toString() })
            setStartDate("")
            setEndDate("")
        }
    }, [selectedMonth, selectedYear])

    const handleDateChange = (name: 'start_date' | 'end_date', value: string) => {
        if (name === 'start_date') setStartDate(value)
        else setEndDate(value)

        setSelectedMonth(0)
        setSelectedYear(0)
        fetchRecap({ start_date: name === 'start_date' ? value : startDate, end_date: name === 'end_date' ? value : endDate })
    }

    return (
        <>
            <PageTitle title="Recapitulatifs">
                <PrimaryLink permission="consommation.view" icon="list" to="/cantine/consommation/list">
                    Historique des consommations
                </PrimaryLink>
            </PageTitle>

            <Block>
                <Row className="mb-6">
                    <Col n={3}>
                        <Select
                            label="Mois"
                            placeholder={null}
                            options={[{id: 0, label: "Tous"}, ...months]}
                            config={{ optionKey: 'id', valueKey: 'label' }}
                            value={selectedMonth}
                            onChange={({ target }) => setSelectedMonth(parseInt(target.value))}
                            controlled
                        />
                    </Col>
                    <Col n={3}>
                        <Select
                            label="Année"
                            placeholder={null}
                            options={years.map(y => ({ id: y, label: y }))}
                            config={{ optionKey: 'id', valueKey: 'label' }}
                            value={selectedYear}
                            onChange={({ target }) => setSelectedYear(parseInt(target.value))}
                            controlled
                        />
                    </Col>
                    <Col n={3}>
                        <label className="form-label">Date de début</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            max={endDate}
                            onChange={({ target }) => handleDateChange('start_date', target.value)}
                        />
                    </Col>
                    <Col n={3}>
                        <label className="form-label">Date de fin</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            min={startDate}
                            onChange={({ target }) => handleDateChange('end_date', target.value)}
                        />
                    </Col>
                </Row>

                {RequestState.loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : consommation && consommation.data && (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped bg-white text-left table-hover text-sm">
                        <thead>
                                <tr>
                                    <th className="bg-success text-white">
                                        {selectedMonth > 0 && selectedYear
                                            ? `${months.find(m => m.id === selectedMonth)?.label} ${selectedYear}`
                                            : startDate && endDate
                                                ? `${startDate} → ${endDate}`
                                                : "Période : Tous"}
                                    </th>
                                    {Object.keys(consommation.data).map((collation) => (
                                        <th colSpan={consommation.details_count} className="bg-primary text-white text-center text-nowrap" key={collation}>{collation}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th className="bg-info text-white">ÉTABLISSEMENT</th>
                                    {Object.keys(consommation.data).map((collation) => {
                                        const data = consommation.data[collation]
                                        return Object.keys(data).map(type => <th className="bg-info text-white text-end text-nowrap" key={type}>{type}</th>)
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {consommation.headers && consommation.headers.map((school: string) => (
                                    <tr key={school}>
                                        <td className={school === "TOTAL" ? "fw-bold text-white bg-dark text-nowrap" : "fw-bold text-nowrap"}>{school}</td>
                                        {Object.entries(consommation.data).flatMap(([collation, product]) => (
                                            Object.keys(product).map((type) => (
                                                <td
                                                    className={`${school === "TOTAL" ? "fw-bold text-white bg-dark" : ""} text-end`}
                                                    key={`${school}-${collation}-${type}`}
                                                >
                                                    {formatNumber(product[type]?.[school]) ?? "-"}
                                                </td>
                                            ))
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {Object.keys(consommation.data ?? {}).length === 0 && (
                            <div className="alert alert-warning mt-4">Aucune consommation disponible pour cette période.</div>
                        )}
                    </div>
                )}
            </Block>
        </>
    )
}
