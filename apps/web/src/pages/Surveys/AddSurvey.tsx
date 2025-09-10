/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FormEvent, ReactNode, useCallback, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton } from 'ui'
import { PrimaryLink, ScholarYearSelectorServer } from '@base/components'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'

type SurveyFormState = {
    phase: string;
    date: string;
}

export function AddSurvey(): ReactNode {
    const [survey, setSurvey] = useState<SurveyFormState>({ phase: '', date: '' })
    const [scholarYear, setScholarYear] = useState<string | number>(0);

    const { Client, RequestState, error } = useApi<Survey>({
        
        url: '/surveys'
    })

    const handleInputChange = useCallback(({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
        setSurvey(prevState => ({
            ...prevState,
            [name]: value
        }))
    }, [])

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault()

        const response = await Client.post({
            phase: parseInt(survey.phase, 10),
            date: survey.date,
            scholar_year_id: scholarYear
        })

        if (response.ok) {
            toast('Enregistré', {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            setSurvey({ phase: '', date: '' })
        } else {
            toast('Formulaire invalide', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }, [Client, survey])

    return (
        <>
            <PageTitle title="Nouvelle mesure">
                <PrimaryLink permission="anthropometry.view" icon="list" to="/anthropo-measure/survey/list">
                    Liste des mesures
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form onSubmit={handleSubmit} method="post">
                    <div className="row mb-4">
                        <div className="col-xl-4">
                            <Input
                                onChange={handleInputChange}
                                value={survey.phase}
                                error={error?.data?.errors?.phase}
                                label="Phase"
                                name="phase"
                                type="number"
                            />
                        </div>
                        <div className="col-xl-4">
                            <Input
                                onChange={handleInputChange}
                                value={survey.date}
                                error={error?.data?.errors?.date}
                                label="Date de début"
                                name="date"
                                type="date"
                            />
                        </div>
                        <div className="col-xl-4">
                            <ScholarYearSelectorServer scholarYear={scholarYear} setScholarYear={setScholarYear} />
                        </div>
                    </div>

                    <PrimaryButton
                        permission="anthropometry.create"
                        loading={RequestState.creating}
                        icon="save"
                        type="submit"
                    >
                        Enregistrer
                    </PrimaryButton>
                </form>
            </Block>
        </>
    )
}