import { FormEvent, ReactNode, useState } from 'react'
import { Button, Input } from 'ui'
import { useApi } from 'hooks'
import { config, getToken } from '@renderer/config'
import { toast } from 'react-toastify'

type UnitFormProps = {
    editedUnit?: Unit
}

const defaultUnit: Unit = {
    id: 0,
    name: '',
    notation: ''
}

export function UnitForm({ editedUnit }: UnitFormProps): ReactNode {
    const [unit, setUnit] = useState(defaultUnit)
    const {
        Client,
        error,
        RequestState
    } = useApi<Unit>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/prices/units',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response = editedUnit
            ? await Client.patch(editedUnit.id, unit)
            : await Client.post(unit)

        if (response.ok) {
            const message = editedUnit ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            editedUnit === undefined && setUnit(defaultUnit)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    if (editedUnit !== undefined && unit.id === 0)
        setUnit({
            ...editedUnit,
        })

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)): void => {
        setUnit({ ...unit, [target.name]: target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }
    }

    return (
        <form action="#" onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div className="row mb-4">
                <div className="col-xl-12 mb-3">
                    <Input
                        label="Nom de l'unité"
                        value={unit.name}
                        error={error?.data?.errors?.name}
                        onChange={({ target }): void => handleChange(target)}
                        name="name"
                        placeholder="Kilaograma"
                    />
                </div>
                <div className="col-xl-12">
                    <Input
                        label="Notation"
                        value={unit.notation}
                        error={error?.data?.errors?.notation}
                        onChange={({ target }): void => handleChange(target)}
                        name="notation"
                        placeholder="Kg"
                    />
                </div>
            </div>

            <Button
                loading={RequestState.creating || RequestState.updating}
                icon="save"
                type="submit"
                mode="primary"
            >
                Enregistrer
            </Button>
        </form>
    )
}
