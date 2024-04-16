import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ApiErrorMessage, Button, Input, Select } from 'ui'
import { config, token } from '../../../config'
import { useApi } from 'hooks'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'

export function EditClass(): JSX.Element {
    const [classes, setClasses] = useState<Classes>({ id: 0, name: '', level_id: 0, notation: '' })
    const { id } = useParams()
    const { Client, datas } = useApi<Niveau>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/levels',
        key: 'data'
    })

    const {
        Client: ClassClient,
        RequestState,
        error,
        resetError
    } = useApi<Classes>({
        baseUrl: config.baseUrl,
        token: token,
        url: '/classes'
    })

    const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        e.preventDefault()
        setClasses({ ...classes, level_id: parseInt(e.target.value) })
    }

    const handleLabelCHange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        setClasses({ ...classes, name: e.target.value })
    }

    const handleNotationChange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        setClasses({ ...classes, notation: e.target.value })
    }

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        await ClassClient.patch(id as unknown as number, classes)
        toast('Enregistré', {
            closeButton: true,
            type: 'success',
            position: 'bottom-right'
        })
    }

    useEffect(() => {
        const getClass = async () => {
            const classe = await ClassClient.find(id as unknown as number)

            if (classe) setClasses({
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
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Ajouter une classe</h1>
                <Link to="/school/classes/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des classes
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
                <div className="row mb-3">
                    <div className="col-xl-6">
                        <Input
                            onChange={handleLabelCHange}
                            label="Nom de la classe"
                            value={classes.name}
                        />
                    </div>
                    <div className="col-xl-6">
                        <Input
                            onChange={handleNotationChange}
                            label="Notation"
                            value={classes.notation}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <Select
                        label="Niveau"
                        value={classes.level_id}
                        onChange={handleLevelChange}
                        options={datas}
                        controlled
                    />
                </div>

                <Button loading={RequestState.updating} icon="save" mode="primary" type="submit">
                    Enregistrer
                </Button>
            </form>
        </>
    )
}
