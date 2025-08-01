/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { Block, Input, PageTitle, PrimaryButton, Select } from 'ui'
import { config } from '@base/config'
import { useApi } from 'hooks'
import { toast } from 'react-toastify'
import { PrimaryLink } from '@base/components'

export function AddClass(): ReactNode {
    const [classes, setClasses] = useState<Classes>({ id: 0, name: '', level_id: 0, notation: '' })
    const { Client, datas } = useApi<Niveau>({
        url: '/levels',
        key: 'data'
    })

    const { Client: ClassClient, RequestState, error } = useApi<Classes>({
        url: '/classes'
    })

    const resetError = (name: string, value: string): void => {
        if (value.length > 0) error.data.errors[name] = null
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

        const response = await ClassClient.post(classes)
        if (response.ok) {
            toast('Enregistré', {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            setClasses({ id: 0, name: '', notation: '', level_id: 0 })
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    useEffect(() => {
        Client.get()
    }, [])

    return (
        <>
            <PageTitle title="Ajouter une classe">
                <PrimaryLink permission="class.view" icon="list" to="/anthropo-measure/school/classes/list">
                    Liste des classes
                </PrimaryLink>
            </PageTitle>

            <Block className="mb-5">
                <form action="" onSubmit={handleSubmit} method="post">
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
                                error={error?.data?.errors?.notation}
                                required={false}
                                name="notation"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <Select
                            label="Niveau"
                            value={classes.level_id}
                            onChange={({ target }): void => handleChange(target)}
                            options={datas}
                            error={error?.data?.errors?.level_id}
                            name="level_id"
                            controlled
                        />
                    </div>

                    <PrimaryButton
                        permission="class.create"
                        loading={RequestState.creating}
                        icon="save"
                        type="submit"
                    >Enregistrer</PrimaryButton>
                </form>
            </Block>
        </>
    )
}
