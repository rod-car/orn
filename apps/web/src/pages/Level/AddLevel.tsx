import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Block, Button, Input } from 'ui'
import { config, getToken } from '../../config'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'

export function AddLevel(): JSX.Element {
    const [level, setLevel] = useState<Niveau>({ id: 0, label: '', description: '' })
    const { Client, RequestState, error } = useApi<Niveau>({
        baseUrl: config.baseUrl,
        token: getToken(),
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

        const response = await Client.post(level)
        if (response.ok) {
            toast('Enregistré', {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            setLevel({ id: 0, label: '', description: '' })
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Ajouter un niveau</h2>
                <Link to="/anthropo-measure/school/levels/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des niveaux
                </Link>
            </div>

            <Block>
                <form action="" onSubmit={handleSubmit} method="post">
                    <div className="row">
                        <div className="col-6 mb-3">
                            <Input
                                label="Label"
                                onChange={handleLabelChange}
                                value={level.label}
                                error={error?.data?.errors?.label}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <Input
                                label="Description"
                                onChange={handleDescriptionChange}
                                value={level.description}
                                error={error?.data?.errors?.description}
                                required={false}
                            />
                        </div>
                    </div>
                    <Button
                        loading={RequestState.creating}
                        type="submit"
                        mode="primary"
                        icon="save"
                    >
                        Valider
                    </Button>
                </form>
            </Block>
        </>
    )
}
