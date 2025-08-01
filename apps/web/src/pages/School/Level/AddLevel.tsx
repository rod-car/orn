import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, ReactNode, useState } from 'react'
import { Block, PrimaryButton, Input, PageTitle } from 'ui'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { PrimaryLink } from '@base/components'

export function AddLevel(): ReactNode {
    const [level, setLevel] = useState<Niveau>({ id: 0, label: '', description: '' })
    const { Client, RequestState, error } = useApi<Niveau>({
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
            <PageTitle title="Ajouter un niveau">
                <PrimaryLink permission="level.view" to="/anthropo-measure/school/levels/list" icon="list">
                    Liste des niveaux
                </PrimaryLink>
            </PageTitle>

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
                    <PrimaryButton
                        permission="level.create"
                        loading={RequestState.creating}
                        type="submit"
                        icon="save"
                    >Valider</PrimaryButton>
                </form>
            </Block>
        </>
    )
}
