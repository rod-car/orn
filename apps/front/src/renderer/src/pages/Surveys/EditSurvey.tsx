import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Block, Button, Input } from 'ui'
import { useParams } from 'react-router-dom'
import { useApi } from 'hooks'
import { config, token } from '../../../config'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'

export function EditSurvey(): JSX.Element {
    const [survey, setSurvey] = useState<Partial<Survey>>({ id: 0, phase: 0, date: '' })
    const { id } = useParams()
    const { Client, RequestState } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/surveys'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const response = await Client.patch(id as unknown as number, {
            phase: parseInt(formData.get('phase') as string),
            date: formData.get('date') as string
        })

        if (response.ok) {
            toast('Enregistré', {
                closeButton: true,
                type: 'success',
                position: 'bottom-right'
            })
            form.reset()
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    const getSurvey = useCallback(async () => {
        const data = await Client.find(id as unknown as number)
        if (data) setSurvey(data)
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.name === 'phase')
            setSurvey({ ...survey, phase: e.target.value as unknown as number })
        if (e.target.name === 'date') setSurvey({ ...survey, date: e.target.value })
    }

    useEffect(() => {
        getSurvey()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Modifier la mésure phase: {survey.phase}</h2>
                <Link to="/survey/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des mésures
                </Link>
            </div>

            <Block className="mb-5">
                <form action="" onSubmit={handleSubmit} method="post">
                    <div className="row mb-4">
                        <div className="col-xl-6">
                            <Input
                                onChange={handleChange}
                                value={survey.phase}
                                label="Phase"
                                name="phase"
                            />
                        </div>
                        <div className="col-xl-6">
                            <Input
                                onChange={handleChange}
                                value={survey.date}
                                label="Date"
                                type="date"
                                name="date"
                            />
                        </div>
                    </div>

                    <Button loading={RequestState.creating} icon="save" type="submit" mode="primary">
                        Enregistrer
                    </Button>
                </form>
            </Block>
        </>
    )
}