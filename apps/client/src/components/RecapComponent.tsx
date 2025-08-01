import { ordinalLetters, round } from "functions";
import React from "react";

export function RecapComponent({ recap }: { recap: any }) {
    const headers = recap.headers as string[];
    const realData = recap.datas;
    const types = ['Global', 'Modéré', 'Sévère'];

    if (!realData || Object.keys(realData).length === 0) {
        return undefined;
    }

    const createSafeData = (data: any) => {
        return headers.reduce((acc: any, school: string) => {
            const schoolData = data?.[school];
            acc[school] = schoolData
                ? {
                    T: schoolData.T ?? 0,
                    MA: {
                        Global: schoolData.MA?.Global ?? { value: 0, percent: 0 },
                        Modéré: schoolData.MA?.Modéré ?? { value: 0, percent: 0 },
                        Sévère: schoolData.MA?.Sévère ?? { value: 0, percent: 0 },
                    },
                    IP: {
                        Global: schoolData.IP?.Global ?? { value: 0, percent: 0 },
                        Modéré: schoolData.IP?.Modéré ?? { value: 0, percent: 0 },
                        Sévère: schoolData.IP?.Sévère ?? { value: 0, percent: 0 },
                    },
                    CH: {
                        Global: schoolData.CH?.Global ?? { value: 0, percent: 0 },
                        Modéré: schoolData.CH?.Modéré ?? { value: 0, percent: 0 },
                        Sévère: schoolData.CH?.Sévère ?? { value: 0, percent: 0 },
                    },
                }
                : {
                    T: 0,
                    MA: {
                        Global: { value: 0, percent: 0 },
                        Modéré: { value: 0, percent: 0 },
                        Sévère: { value: 0, percent: 0 },
                    },
                    IP: {
                        Global: { value: 0, percent: 0 },
                        Modéré: { value: 0, percent: 0 },
                        Sévère: { value: 0, percent: 0 },
                    },
                    CH: {
                        Global: { value: 0, percent: 0 },
                        Modéré: { value: 0, percent: 0 },
                        Sévère: { value: 0, percent: 0 },
                    },
                };
            return acc;
        }, {});
    };

    return (
        <>
            {Object.entries(realData).map(([surveyDetails, data]: [string, any]) => {
                const safeData = createSafeData(data);
                const parts = surveyDetails.split("/") as [string, string, string];

                return (
                    <div key={parts[0]} className="mb-5">
                        <div className="mb-5">
                            <h5 className="text-primary text-center text-uppercase text-bold m-0">
                                Recap de la {ordinalLetters(parseInt(parts[1]), 'F')} mesure pour l'année scolaire {parts[2]}
                            </h5>
                        </div>
                        <div className="table-responsive" style={{ border: '1px solid silver' }}>
                            <table className="table table-striped table-bordered table-hover text-sm bg-white mb-0">
                                <thead>
                                    <tr className="text-nowrap">
                                        <th className="bg-white"></th>
                                        {headers.map((header: string) => (
                                            <th key={header} className="bg-white text-right">
                                                <span className="vertical-text">{header}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-nowrap text-uppercase bg-info text-white text-bold align-middle">
                                            Nombre d'élève
                                        </td>
                                        <Td headers={headers} keyOne="T" schoolZ={safeData} />
                                    </tr>
                                    {[
                                        { title: "Mal nutrition aiguë", keyOne: "MA" },
                                        { title: "Insuffisance pondérale", keyOne: "IP" },
                                        { title: "Malnutrition Chronique", keyOne: "CH" },
                                    ].map((section) => (
                                        <React.Fragment key={section.keyOne}>
                                            <tr>
                                                <td className="text-uppercase text-bold bg-white" colSpan={headers.length + 1}>
                                                    {section.title}
                                                </td>
                                            </tr>
                                            {types.map((type) => (
                                                <tr key={`${section.keyOne}-${type}`}>
                                                    <td className="text-nowrap text-uppercase bg-info text-white text-bold align-middle">
                                                        {type} {type === 'Global' ? '(M + S)' : ''}
                                                    </td>
                                                    <Td headers={headers} keyOne={section.keyOne} keyTwo={type} schoolZ={safeData} />
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
            <hr />
        </>
    );
}


type TdProps = {
    headers: string[]
    keyOne: string
    keyTwo?: string
    schoolZ: any
}

const Td = ({ headers, keyOne, keyTwo, schoolZ }: TdProps) => {
    return (
        <>
            {headers.map((school: string) => {
                const schoolZSchool = schoolZ[school];
                const schoolTab = schoolZSchool ? schoolZSchool[keyOne] : null;
                const value = schoolTab && keyTwo && typeof schoolTab === 'object' ? schoolTab[keyTwo]['value'] : schoolTab;
                const total = keyTwo === 'Global' ? schoolZSchool?.['T'] : null;
                const percent = schoolTab && keyTwo && typeof schoolTab === 'object' && schoolTab[keyTwo]['value'] > 0 && school !== 'TOTAL'
                    ? round(schoolTab[keyTwo]['percent'])
                    : null;
                const totalPercent = keyTwo === 'Global' && school === 'TOTAL'
                    ? round((schoolTab[keyTwo]['value'] / schoolZSchool['T']) * 100, 2)
                    : null;

                return (
                    <td key={school} className='text-end text-nowrap' style={{ verticalAlign: 'middle' }}>
                        <div className="d-flex flex-column align-items-end">
                            <span className={school === 'TOTAL' ? 'text-bold py-2' : ''}>
                                {value} {total ? '/' + total : ''}
                            </span>
                            {percent && <span className="text-primary">({percent}%)</span>}
                            {totalPercent && <span className="text-primary">({totalPercent}%)</span>}
                        </div>
                    </td>
                );
            })}
        </>
    );
};