/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Block, PageTitle, Select } from 'ui'
import { PrimaryLink } from '@base/components'
import { Col, Row } from '@base/components/Bootstrap'
import { useApi } from 'hooks'
import { months, formatNumber } from 'functions'

export function RecapConso() {
    const [selectedMonth, setSelectedMonth] = useState<number>(0)
    const [scholarYearId, setScholarYearId] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    const { Client, datas: consommation, RequestState } = useApi<unknown>({
        url: '/consommations/recap',
        key: 'data'
    })

    const { Client: ScholarYearClient, datas: scholarYears, RequestState: ScholarYearRequestState } = useApi<ScholarYear>({
        url: '/scholar-years'
    })

    const fetchRecap = async (params?: Record<string, string>) => {
        await Client.get(params)
    }

    useEffect(() => {
        ScholarYearClient.get()
    }, [])

    useEffect(() => {
        // Charger les données initiales avec l'année scolaire courante si disponible
        if (scholarYears && scholarYears.length > 0) {
            const currentScholarYear = scholarYears.at(0)
            if (currentScholarYear && scholarYearId === 0) {
                setScholarYearId(currentScholarYear.id as unknown as number)
            }
        }
    }, [scholarYears])

    useEffect(() => {
        if (scholarYearId > 0) {
            const params: Record<string, string> = {
                scholar_year_id: scholarYearId.toString()
            }

            if (selectedMonth > 0) {
                params.month = selectedMonth.toString()
            }

            fetchRecap(params)
        }
    }, [selectedMonth, scholarYearId])

    const handleDateChange = (name: 'start_date' | 'end_date', value: string) => {
        if (name === 'start_date') setStartDate(value)
        else setEndDate(value)

        // Réinitialiser les autres filtres
        setSelectedMonth(0)
        setScholarYearId(0)

        const params: Record<string, string> = {}
        if (name === 'start_date' && value) params.start_date = value
        if (name === 'end_date' && value) params.end_date = value
        if (name === 'start_date' && endDate) params.end_date = endDate
        if (name === 'end_date' && startDate) params.start_date = startDate

        if (params.start_date || params.end_date) {
            fetchRecap(params)
        }
    }

    const changeScholarYearId = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(target.value)
        setScholarYearId(value)

        // Réinitialiser les dates personnalisées
        setStartDate("")
        setEndDate("")
    }

    const getDisplayPeriod = () => {
        if (selectedMonth > 0 && scholarYearId > 0) {
            const scholarYear = scholarYears?.find((sy: ScholarYear) => sy.id as unknown as number === scholarYearId)
            const monthLabel = months.find(m => m.id === selectedMonth)?.label
            return `${monthLabel} - ${scholarYear?.label || ''}`
        }
        
        if (scholarYearId > 0) {
            const scholarYear = scholarYears?.find((sy: ScholarYear) => sy.id as unknown as number === scholarYearId)
            return scholarYear?.label || 'Année scolaire'
        }
        
        if (startDate && endDate) {
            return `${startDate} → ${endDate}`
        }
        
        return "Période : Tous"
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
                            disabled={!scholarYearId || scholarYearId === 0}
                        />
                    </Col>
                    <Col n={3}>
                        <Select
                            controlled
                            value={scholarYearId}
                            options={scholarYears}
                            label="Année scolaire"
                            placeholder="Sélectionner une année"
                            onChange={changeScholarYearId}
                            loading={ScholarYearRequestState.loading}
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
                            disabled={scholarYearId > 0}
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
                            disabled={scholarYearId > 0}
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
                                        {getDisplayPeriod()}
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