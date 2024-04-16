import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ApiErrorMessage, Button, Input } from 'ui'
import { config, token } from '../../../config'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export function EditLevel(): JSX.Element {
    const [level, setLevel] = useState<Niveau>({ id: 0, label: '', description: '' })
    const { Client, RequestState, error, resetError } = useApi<Niveau>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/levels'
    })

    const { id } = useParams()

    const getData = async (): Promise<void> => {
        const data = await Client.find(id as string)
        if (data) setLevel(data)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        await Client.patch(level.id, level)
        toast('Modifé', {
            closeButton: true,
            type: 'success',
            position: 'bottom-right'
        })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Éditer: {level?.label}</h2>
                <Link to="/school/levels/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des niveaux
                </Link>
            </div>

            {error && (
                <ApiErrorMessage
                    className="mb-3"
                    message={error.message}
                    onClose={(): void => {
                        resetError()
                    }}
                />
            )}

            <form className="mb-5" action="" onSubmit={handleSubmit} method="post">
                <div className="row">
                    <div className="col-6 mb-3">
                        <Input
                            label="Label"
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                setLevel({ ...level, label: e.target.value })
                            }}
                            value={level.label ?? ''}
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <Input
                            label="Description"
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                setLevel({ ...level, description: e.target.value })
                            }}
                            value={level.description ?? ''}
                            required={false}
                        />
                    </div>
                </div>
                <Button disabled={RequestState.updating} type="submit" mode="primary" icon="save">
                    Valider
                </Button>
            </form>
        </>
    )
}
