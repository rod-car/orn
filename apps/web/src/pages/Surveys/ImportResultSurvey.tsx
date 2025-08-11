/* eslint-disable react-hooks/exhaustive-deps */
import { useApi, useExcelReader } from 'hooks'
import { useParams } from 'react-router-dom'
import { Block, Button, Input, PageTitle, Spinner } from 'ui'
import { config } from '@base/config'
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { PrimaryLink, SchoolSelector } from '@base/components'
import { format, isDate } from 'functions'
import { Row, Col } from '@base/components/Bootstrap'

export function ImportResultSurvey(): ReactNode {
    const [date, setDate] = useState('')
    const [schoolId, setSchoolId] = useState(0)
    const { json, importing, toJSON, resetJSON } = useExcelReader()

    const { Client: SchoolClient, RequestState: SchoolRs, datas: schools } = useApi<School>({
        
        url: 'schools',
        key: 'data'
    })

    const { Client, RequestState, data: survey } = useApi<Survey | {date: string, school_id: number, data: Survey}>({
        
        url: 'surveys'
    })

    const { id } = useParams()

    const handleDateChange = (e: InputChange) => {
        setDate(e.target.value)
    }

    const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()

        toast('Importation des donnees', {
            type: 'info',
            position: config.toastPosition
        })

        toJSON(event.target, undefined, true)
    }, [toJSON])

    const counts = useCallback((sheetsData: MultiSheet): { totalStudents: number, totalClasses: number } => {
        let totalStudents = 0;
        const totalClasses = Object.keys(sheetsData).length; // Number of sheets is the number of classes

        for (const sheetName in sheetsData) {
            totalStudents += sheetsData[sheetName].length; // Count rows (students) for each class
        }
        return { totalStudents, totalClasses };
    }, []);

    const countStudent = useCallback((sheetsData: MultiSheet): string => {
        const { totalStudents, totalClasses } = counts(sheetsData);
        return `${totalStudents} Étudiant(s) dans ${totalClasses} Classe(s)`
    }, []);

    const save = async (): Promise<void> => {
        toast('Enregistrement en cours', {
            type: 'info',
            isLoading: RequestState.creating,
            position: config.toastPosition
        })

        Object.keys(json as MultiSheet).map(async sheetName => {
            const jsonData = json[sheetName]
            
            const data = jsonData.map(d => {
                const key = 'Date de naissance'
                return {
                    ...d,
                    [key]: isDate(d[key]) ? d[key].toLocaleDateString() : d[key]
                }
            })

            const response = await Client.post({
                date: date,
                school_id: schoolId,
                data: data as unknown as Survey
            }, `/${id}/import-result`)
    
            if (response.ok) {
                toast(response.message + ' ' + sheetName, {
                    closeButton: true,
                    type: 'success',
                    position: config.toastPosition
                })
                resetJSON()
                setSchoolId(0)
                setDate('')
            } else {
                toast(response.message + ' ' + sheetName, {
                    closeButton: true,
                    type: 'error',
                    position: config.toastPosition
                })
            }
        })
    }

    useEffect(() => {
        async function getSurvey() {
            Client.find(id as unknown as number)
        }
        getSurvey()
        SchoolClient.get()
    }, [])

    return (
        <>
            <PageTitle title={`Importer des résultats (${survey?.label ?? '-'})`}>
                <PrimaryLink permission="anthropometry.show" to={`/anthropo-measure/survey/details/${id}`} icon="folder">
                    Details de la mesure
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <form action="" encType="multipart/form-data">
                    <Row>
                        <Col n={3}>
                            <SchoolSelector
                                datas={schools}
                                schoolId={schoolId}
                                setSchoolId={setSchoolId}
                                loading={SchoolRs.loading}
                            />
                        </Col>
                        <Col n={3}>
                            <Input
                                type="date"
                                value={date}
                                required={false}
                                label="Date de pesée"
                                onChange={handleDateChange}
                            />
                        </Col>
                        <Col n={6}>
                            <Input
                                type="file"
                                required={true}
                                label="Sélectionner un fichier (EXCEL)"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                        </Col>
                    </Row>
                </form>
            </Block>

            {counts(json as MultiSheet).totalStudents > 0 && <Block className="mb-5">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary">
                        Affichage des données{' '}
                        {counts(json as MultiSheet).totalStudents > 0 && `(${countStudent(json as MultiSheet)})`}
                    </h6>
                    {Object.keys(json as MultiSheet).length > 0 && (
                        <Button
                            permission="survey.create"
                            loading={RequestState.creating}
                            icon="save"
                            type="button"
                            mode="primary"
                            onClick={save}
                        >
                            Enregistrer
                        </Button>
                    )}
                </div>
                <hr />

                {Object.keys(json as MultiSheet).map((sheetName, index) => {
                    const jsonData = json[sheetName] as OneSheet
                    return <div key={index + 1} className="table-responsive mb-4">
                        <h6 className="fw-bold text-danger mb-3">{sheetName} - {jsonData.length} Étudiant(s)</h6>
                        <table className="table table-striped table-bordered table-hover text-sm">
                            <thead>
                                <tr className="bg-danger">
                                    <th className="text-nowrap">Code</th>
                                    <th className="text-nowrap">Nom et prénoms</th>
                                    <th className="text-nowrap">Date de pesée</th>
                                    <th className="text-nowrap text-end">Taille (cm)</th>
                                    <th className="text-nowrap text-end">Poids (Kg)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData.length <= 0 && (
                                    <tr>
                                        <td className="text-center" colSpan={5}>
                                            Aucune données
                                        </td>
                                    </tr>
                                )}
                                {jsonData.map((data, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold">{data['Code']}</td>
                                        <td>{data['Nom et prénoms']}</td>
                                        <td>
                                            {isDate(data['Date'])
                                                ? data['Date'].toLocaleDateString()
                                                : data['Date'] ?? format(date)}
                                        </td>
                                        <td className='text-end fw-bold'>{data['Taille'] ?? '-'}</td>
                                        <td className='text-end fw-bold'>{data['Poids'] ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                })}

                {importing && <Spinner />}

                {Object.keys(json).length > 0 && (
                    <Button
                        permission="survey.create"
                        loading={RequestState.creating}
                        icon="save"
                        type="button"
                        mode="primary"
                        onClick={save}
                        className="mb-5"
                    >
                        Enregistrer
                    </Button>
                )}
            </Block>}
        </>
    )
}

