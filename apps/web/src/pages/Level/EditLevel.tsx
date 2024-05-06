import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Block, Button, Input } from 'ui'
import { config, getToken } from '../../../config'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'

export function EditLevel(): JSX.Element {
    const [level, setLevel] = useState<Niveau>({ id: 0, label: '', description: '' })
    const { Client, RequestState, error } = useApi<Niveau>({
        baseUrl: config.baseUrl,
        token: getToken(),
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
        const response = await Client.patch(level.id, level)
        if (response.ok) {
            toast('Mis à jour', {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
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
                <h2>Éditer: {level?.label}</h2>
                <Link to="/school/levels/list" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des niveaux
                </Link>
            </div>

            <Block className="mb-5">
                <form action="" onSubmit={handleSubmit} method="post">
                    <div className="row">
                        <div className="col-6 mb-3">
                            <Input
                                label="Label"
                                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                    setLevel({ ...level, label: e.target.value })
                                }}
                                value={level.label ?? ''}
                                error={error?.data?.errors?.label}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <Input
                                label="Description"
                                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                    setLevel({ ...level, description: e.target.value })
                                }}
                                value={level.description ?? ''}
                                error={error?.data?.errors?.description}
                                required={false}
                            />
                        </div>
                    </div>
                    <Button
                        loading={RequestState.updating}
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
