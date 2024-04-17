import { FormEvent } from 'react'
import { Block, Button, Input } from 'ui'
import { Link } from '@renderer/components'
import { useApi } from 'hooks'
import { config, token } from '../../../config'
import { toast } from 'react-toastify'

export function AddSurvey(): JSX.Element {
    const { Client, RequestState } = useApi<Survey>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/surveys'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const response = await Client.post({
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
                            <Input label="Phase" name="phase" />
                        </div>
                        <div className="col-xl-6">
                            <Input label="Date" type="date" name="date" />
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
