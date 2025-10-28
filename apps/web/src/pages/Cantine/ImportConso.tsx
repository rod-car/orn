/* eslint-disable react-hooks/exhaustive-deps */
import {ChangeEvent, CSSProperties, ReactNode, useCallback, useEffect, useState} from 'react'
import {useApi, useExcelReader} from 'hooks'
import {PrimaryLink, ScholarYearSelectorServer} from '@base/components'
import {Block, Input, PageTitle, PrimaryButton, Select, Spinner} from 'ui'
import {Col, Row} from "@base/components/Bootstrap";
import {toast} from "react-toastify";
import {config} from "@base/config";
import { isDate } from 'functions';

export function ImportConso(): ReactNode {
    const [scholarYear, setScholarYear] = useState<string|number>(0)
    const [schoolId, setSchoolId] = useState<number>(0)
    const [foodId, setFoodId] = useState<number>(0)

    const { json, importing, toJSON, resetJSON } = useExcelReader()
    const { Client, datas: classes, RequestState } = useApi<Classes>({
        url: '/classes',
        key: 'data'
    });

    const { Client: ConsommationClient, RequestState: ConsommationRequestState } = useApi<ConsommationModel>({ url: '/consommations' })
    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: FoodClient, datas: foods, RequestState: FoodRequestState } = useApi<Food>({
        url: '/foods'
    })

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        await toJSON(e.target)
    }
    
    const getClasses = useCallback(async () => {
        await Client.get()
    }, [])
    
    useEffect(() => {
        SchoolClient.get()
        FoodClient.get()
        getClasses()
    }, [])


    const save = useCallback(async () => {
        toast('Importation en cours', {
            type: 'info',
            closeButton: false,
            isLoading: RequestState.creating
        })

        const data = json.map(d => {
            const key = 'Date'
            return {
                ...d,
                [key]: isDate(d[key]) ? d[key].toLocaleDateString() : d[key]
            }
        })

        const response = await ConsommationClient.post({
            consommations: data as unknown as Consommation[],
            scholar_year_id: scholarYear,
            school_id: schoolId,
            food_id: foodId
        }, '/import')

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success'
            })

            setSchoolId(0)
            setScholarYear(0)
            setFoodId(0)
            resetJSON()
        } else {
            toast(response.message, {
                closeButton: true,
                type: 'error'
            })
        }
    }, [json, foodId, schoolId, scholarYear])

    return (
        <>
            <PageTitle title='Importer une consommation'>
                <PrimaryLink permission="consommation.view" icon='list' to="/cantine/list-conso">
                    Liste des consommation
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <form encType="multipart/form-data">
                    <Row className="mb-6">
                        <Col n={3} className="mb-3">
                            <Select
                                label="Établissement"
                                options={schools}
                                config={{optionKey: 'id', valueKey: 'name'}}
                                loading={SchoolRequestState.loading}
                                value={schoolId}
                                onChange={({target}) => setSchoolId(parseInt(target.value, 10))}
                                controlled
                            />
                        </Col>
                        <Col n={3} className="mb-3">
                            <ScholarYearSelectorServer
                                label="Année scolaire"
                                scholarYear={scholarYear}
                                setScholarYear={setScholarYear}
                            />
                        </Col>
                        <Col n={3} className="mb-3">
                            <Select
                                label="Collation"
                                options={foods}
                                loading={FoodRequestState.loading}
                                value={foodId}
                                onChange={({target}) => setFoodId(parseInt(target.value, 10))}
                                controlled
                            />
                        </Col>
                        <Col n={3}>
                            <Input
                                type="file"
                                required
                                label="Selectionner un fichier"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                        </Col>
                    </Row>
                </form>
            </Block>

            <Block>
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary">Affichage temporaire des données</h6>
                    {json.length > 0 && <PrimaryButton permission="consommation.import" loading={importing || RequestState.loading || ConsommationRequestState.creating} icon="save" onClick={save}>
                        Enregistrer
                    </PrimaryButton>}
                </div>
                <hr />

                <div className="table-responsive">
                    {classes.length > 0 && json.length > 0 ? <table className="table table-bordered table-striped table-hover text-sm">
                        <thead>
                        <tr>
                            <th style={styles.head}>#</th>
                            <th style={styles.head}>Jour</th>
                            <th style={styles.head}>Date</th>
                            {classes.map((classe, index) => <th style={styles.head} key={index}>{classe.notation}</th>)}
                            <th style={styles.head}>Ens</th>
                            <th style={styles.head}>Cui</th>
                        </tr>
                        </thead>
                        <tbody>
                        {json.map((data: Record<string, unknown>, index: number) => <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data['Jour'] as string}</td>
                            <td>{(data['Date'] as Date).toLocaleDateString()}</td>
                            {classes.map((classe, index) => <td key={index}>{data[classe.notation as string] as string}</td>)}
                            <td>{data['Ens'] as number}</td>
                            <td>{data['Cui'] as number}</td>
                        </tr>)}
                        </tbody>
                    </table> : <p className="text-center fw-bold">Aucune donnees</p>}
                </div>

                {importing && <Spinner isBorder className="text-center" />}
            </Block>
        </>
    )
}


const styles = {
    head: {
        backgroundColor: 'silver',
        color: 'black'
    } as CSSProperties
}