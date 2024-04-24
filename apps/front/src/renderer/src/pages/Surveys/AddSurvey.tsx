import { FormEvent, useState } from 'react'
import { Block, Button, Input } from 'ui'
import { Link } from '@renderer/components'
import { useApi } from 'hooks'
import { config, getToken } from '../../../config'
import { toast } from 'react-toastify'

export function AddSurvey(): JSX.Element {
    const [survey, setSurvey] = useState<{ phase: string; date: string }>({
        phase: '',
        date: ''
    })
    const { Client, RequestState, error } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: getToken(),
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
                position: 'bottom-right'
            })
            setSurvey({ phase: '', date: '' })
        } else {
            toast('Formulaire invalide', {
                closeButton: true,
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Nouvelle mésure</h2>
                <Link to="/survey/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des mésures
                </Link>
            </div>

            <Block className="mb-5">
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

                    <Button
                        loading={RequestState.creating}
                        icon="save"
                        type="submit"
                        mode="primary"
                    >
                        Enregistrer
                    </Button>
                </form>
            </Block>
        </>
    )
}
