import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useState } from 'react'
import { ApiErrorMessage, Button, Input } from 'ui'
import { config } from '../../../config'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export function AddLevel(): JSX.Element {
    const [level, setLevel] = useState<Niveau>({ id: 0, label: '', description: '' })
    const { Client, RequestState, error, resetError } = useApi<Niveau>({
        baseUrl: config.baseUrl,
        url: '/levels'
    })

    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        setLevel({ ...level, label: e.target.value })
    }

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        setLevel({ ...level, description: e.target.value })
    }

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        await Client.post(level)
        toast('Enregistré', {
            closeButton: true,
            type: 'success',
            position: 'bottom-right'
        })
        setLevel({ id: 0, label: '', description: '' })
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Ajouter un niveau</h1>
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

            <form action="" onSubmit={handleSubmit} method="post">
                <div className="row">
                    <div className="col-6 mb-3">
                        <Input label="Label" onChange={handleLabelChange} value={level.label} />
                    </div>
                    <div className="col-6 mb-3">
                        <Input
                            label="Description"
                            onChange={handleDescriptionChange}
                            value={level.description}
                            required={false}
                        />
                    </div>
                </div>
                <Button disabled={RequestState.creating} type="submit" mode="primary" icon="save">
                    Valider
                </Button>
            </form>
        </>
    )
}
