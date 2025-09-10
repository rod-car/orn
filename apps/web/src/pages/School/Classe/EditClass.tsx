import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { Button, Input, PageTitle, Select } from 'ui'
import { config } from '@base/config'
import { useApi } from 'hooks'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { PrimaryLink } from '@base/components'

export function EditClass(): ReactNode {
    const [classes, setClasses] = useState<Classes>({ id: 0, name: '', level_id: 0, notation: '' })
    const { id } = useParams()
    const { Client, datas } = useApi<Niveau>({
        url: '/levels',
        key: 'data'
    })

    const {
        Client: ClassClient,
        RequestState,
        error
    } = useApi<Classes>({
        url: '/classes'
    })

    const resetError = (name: string, value: string): void => {
        if (value.length > 0 && error) error.data.errors[name] = []
    }

    const handleChange = (target: EventTarget & (HTMLInputElement | HTMLSelectElement)): void => {
        const name = target.name
        const value = target.value

        if (name === 'level_id') setClasses({ ...classes, level_id: parseInt(value) })
        if (name === 'name') setClasses({ ...classes, name: value })
        if (name === 'notation') setClasses({ ...classes, notation: value })

        resetError(name, value)
    }

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response = await ClassClient.patch(id as unknown as number, classes)
        if (response.ok) {
            toast('Enregistré', {
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

    useEffect(() => {
        const getClass = async (): Promise<void> => {
            const classe = await ClassClient.find(id as unknown as number)

            if (classe)
                setClasses({
                    id: classe.id,
                    name: classe.name,
                    notation: classe.notation,
                    level_id: classe.level?.id
                })
        }

        Client.get()
        getClass()
    }, [])

    return (
        <>
            <PageTitle title={`Éditer: ${classes.name}`}>
                <PrimaryLink permission="class.view" icon='list' to="/anthropo-measure/school/classes/list">
                    Liste des classes
                </PrimaryLink>
            </PageTitle>

            <form className="mb-5" action="" onSubmit={handleSubmit} method="post">
                <div className="row mb-3">
                    <div className="col-xl-6">
                        <Input
                            onChange={({ target }): void => handleChange(target)}
                            label="Nom de la classe"
                            value={classes.name}
                            name="name"
                            error={error?.data?.errors?.name}
                        />
                    </div>
                    <div className="col-xl-6">
                        <Input
                            onChange={({ target }): void => handleChange(target)}
                            label="Notation"
                            value={classes.notation}
                            name="notation"
                            error={error?.data?.errors?.notation}
                            required={false}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <Select
                        label="Niveau"
                        value={classes.level_id}
                        onChange={({ target }): void => handleChange(target)}
                        options={datas}
                        controlled
                        name="level_id"
                        error={error?.data?.errors?.level_id}
                    />
                </div>

                <Button permission="class.create" loading={RequestState.updating} icon="save" mode="primary" type="submit">
                    Enregistrer
                </Button>
            </form>
        </>
    )
}
