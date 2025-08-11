'use client'

import { config } from "@/utils/config"
import { format, months, years } from "functions"
import { ChangeEvent, useEffect, useState } from "react"

export function RecapConso() {
    const [consommation, setConsommation] = useState<{ data: unknown[], headers: string[] } | undefined>(undefined)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYear, setSelectedYear] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [params, setParams] = useState<Record<string, string>>()

    async function fetchData(params?: Record<string, string>) {
        try {
            setLoading(true);g
            let url = `${config.apiUrl}/consommations/recap`;
            if (params) url += "?" + new URLSearchParams(params).toString()
            const response = await fetch(url, { cache: "no-store" });

            if (!response.ok) {
                console.error('Failed to fetch data');
            }

            const jsonData = (await response.json()).data;
            setConsommation(jsonData)
            setError(false);
        } catch (e) {
            console.error("Client error", e);
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    const handleMonthChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = target.value
        setSelectedMonth(parseInt(value));
        const temp = { ...params, month: value }

        setParams(temp)
        fetchData(temp)
    }

    const handleYearChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const value = target.value
        setSelectedYear(parseInt(value));
        const temp = { ...params, year: value }

        setParams(temp)
        fetchData(temp)
    }

    const handleStartDateChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const value = target.value
        setStartDate(value);
        const temp = { ...params, start_date: value, selectedMonth: "0", selectedYear: "0" }

        setSelectedMonth(0)
        setSelectedYear(0)
        setParams(temp)
        fetchData(temp)
    }

    const handleEndDateChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const value = target.value
        setEndDate(value);
        const temp = { ...params, end_date: value, selectedMonth: "0", selectedYear: "0" }

        setSelectedMonth(0)
        setSelectedYear(0)
        setParams(temp)
        fetchData(temp)
    }

    useEffect(() => {
        fetchData({year: selectedYear.toString()});
    }, []);

    useEffect(() => {
        if (selectedMonth > 0 && selectedYear) {
            const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
            const lastDay = new Date(selectedYear, selectedMonth, 0);

            setStartDate(format(firstDay.toDateString(), "y-MM-dd"));
            setEndDate(format(lastDay.toDateString(), "y-MM-dd"));
        } else {
            setStartDate("")
            setEndDate("")
        }
    }, [selectedMonth, selectedYear]);

    if (error) {
        return <div className="alert alert-danger">Impossible de récupérer les donnees. <a href={window.location.pathname}>Recharger</a></div>;
    }

    if (loading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status"></div>
        </div>;
    }

    if (!consommation) return <div className="alert alert-danger">Aucune donees.</div>;

    return <>
        <div className="mb-5">
            <div className="mb-5">
                <h5 className="text-primary text-center text-uppercase text-bold">
                    Recap consommation
                </h5>
            </div>

            <table className="table table-bordered table-hover bg-white text-left mb-5 table-padding-large shadow text-sm">
                <thead>
                    <tr>
                        <th>Mois</th>
                        <th>Année</th>
                        <th>Date debut</th>
                        <th>Date fin</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select
                                className="form-select"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                            >
                                <option value={0}>Tous</option>
                                {months.map(month => (
                                    <option key={month.id} value={month.id}>{month.label}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select
                                className="form-select"
                                value={selectedYear}
                                onChange={handleYearChange}
                            >
                                <option value="0">Tous</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={handleStartDateChange}
                                max={endDate}
                            />
                        </td>
                        <td>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={handleEndDateChange}
                                min={startDate}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="table-responsive mb-3 shadow">
                <table className="table table-bordered table-hover bg-white text-left m-0 table-padding-large text-sm">
                    <thead>
                        <tr>
                            <th className="bg-info text-white">ECOLE</th>
                            {Object.keys(consommation.data).map((product) => (
                                <th className="bg-info text-white" key={product}>
                                    {product}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {consommation.headers.map((school) => (
                            <tr key={school}>
                                <td className={school === "TOTAL" ? "text-bold text-white bg-dark" : ""}>{school}</td>
                                {Object.values(consommation.data).map((product: any, index) => <td className={school === "TOTAL" ? "text-bold text-white bg-dark" : ""} key={index}>
                                    {product[school as unknown as number] || "-"}
                                </td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
}