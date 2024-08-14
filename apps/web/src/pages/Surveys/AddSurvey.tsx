import { FormEvent, ReactNode, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton } from 'ui'
import { PrimaryLink } from '@base/components'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'

export function AddSurvey(): ReactNode {
    const [survey, setSurvey] = useState<{ phase: string; date: string }>({
        phase: '',
        date: ''
    })
    const { Client, RequestState, error } = useApi<Survey>({
        baseUrl: config.baseUrl,
        url: '/surveys'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const response = await Client.post({
            phase: parseInt(survey.phase),
            date: survey.date
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
    }

    return (
        <>
            <PageTitle title="Nouvelle mésure">
                <PrimaryLink icon="list" to="/anthropo-measure/survey/list">
                    Liste des mésures
                </PrimaryLink>
            </PageTitle>

            <Block>
                <form action="" onSubmit={handleSubmit} method="post">
                    <div className="row mb-4">
                        <div className="col-xl-6">
                            <Input
                                onChange={({ target }): void => {
                                    const phase = target.value
                                    setSurvey({ ...survey, phase: phase })
                                    if (phase.length > 0 && error?.data.errors.phase) {
                                        error.data.errors.phase = null
                                    }
                                }}
                                value={survey.phase}
                                error={error?.data?.errors?.phase}
                                label="Phase"
                                name="phase"
                                type="number"
                            />
                        </div>
                        <div className="col-xl-6">
                            <Input
                                onChange={({ target }): void => {
                                    const date = target.value
                                    setSurvey({ ...survey, date: date })
                                    if (date.length > 0 && error?.data.errors.date) {
                                        error.data.errors.date = null
                                    }
                                }}
                                value={survey.date}
                                error={error?.data?.errors?.date}
                                label="Date"
                                type="date"
                                name="date"
                            />
                        </div>
                    </div>

                    <PrimaryButton
                        loading={RequestState.creating}
                        icon="save"
                        type="submit"
                    >Enregistrer</PrimaryButton>
                </form>
            </Block>
        </>
    )
}
