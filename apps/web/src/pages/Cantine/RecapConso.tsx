/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useState } from 'react'
import { Block, PageTitle, Select } from 'ui'
import { PrimaryLink, ScholarYearSelectorServer } from '@base/components'
import { useApi } from 'hooks'
import { Col, Row } from '@base/components/Bootstrap'

export function RecapConso(): ReactNode {
    const [scholarYear, setScholarYear] = useState<string|number>(0)
    const [schoolId, setSchoolId] = useState<number>(0)
    const [foodId, setFoodId] = useState<number>(0)

    const { Client } = useApi<ConsommationModel>({ url: '/consommations' })

    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: FoodClient, datas: foods, RequestState: FoodRequestState } = useApi<Food>({
        url: '/foods'
    })

    useEffect(() => {
        SchoolClient.get()
        FoodClient.get()
        Client.get()
    }, [])

    return (
        <>
            <PageTitle title="Recapitulatifs">
                <PrimaryLink icon="list" to="/cantine/consommation/list">
                    Historique des consommations
                </PrimaryLink>
            </PageTitle>

            <Block>
                <Row className="mb-6">
                    <Col n={4} className="mb-3">
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
                    <Col n={4} className="mb-3">
                        <ScholarYearSelectorServer
                            label="Année scolaire"
                            scholarYear={scholarYear}
                            setScholarYear={setScholarYear}
                        />
                    </Col>
                    <Col n={4} className="mb-3">
                        <Select
                            label="Collation"
                            options={foods}
                            config={{optionKey: 'id', valueKey: 'label'}}
                            loading={FoodRequestState.loading}
                            value={foodId}
                            onChange={({target}) => setFoodId(parseInt(target.value, 10))}
                            controlled
                        />
                    </Col>
                </Row>

                <h6 className="text-primary mt-4">Recapitulatifs</h6>
                <hr />

                <p>Ici le recapitulatifs global des consommations</p>
            </Block>
        </>
    )
}