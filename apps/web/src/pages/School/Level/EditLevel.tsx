/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Block, Button, Input, PageTitle } from 'ui'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { PrimaryLink } from '@base/components'

export function EditLevel(): ReactNode {
    const [level, setLevel] = useState<Niveau>({ id: 0, label: '', description: '' })
    const { Client, RequestState, error } = useApi<Niveau>({
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
            <PageTitle title={`Éditer un niveau: ${level?.label}`}>
                <PrimaryLink to="/anthropo-measure/school/levels/list" icon="list">
                    Liste des niveaux
                </PrimaryLink>
            </PageTitle>

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
