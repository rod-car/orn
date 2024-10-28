import { ReactNode, useEffect, useState } from "react";
import { Block, Button, Input } from "ui";
import { config } from '@base/config'
import { useApi } from "hooks";
import { range } from "functions";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

export function Semence(): ReactNode {
    const { datas: semences, setDatas, Client, RequestState, error } = useApi<Semence>({
        baseUrl: config.baseUrl,
        
        url: '/jardin-scolaires/semences'
    })

    const defaultSemence: Semence = { id: 0, name: '', unit: '' }
    const [semence, setSemence] = useState<Semence>(defaultSemence)
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState(false)

    async function getDatas() {
        await Client.get()
    }

    async function editItem(id: number) {
        const semence = semences.find(semence => semence.id === id)
        if (semence !== undefined) {
            setSemence(semence)
            setEditing(true)
        }
    }

    async function removeItem(id: number) {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async (): Promise<void> => {
                        const response = await Client.destroy(id)
                        if (response.ok) {
                            toast('Supprimé', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                            setDatas(semences.filter(semence => semence.id !== id))
                        } else {
                            toast('Erreur de suppréssion', {
                                closeButton: true,
                                type: 'error',
                                position: config.toastPosition
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'error',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }

    function addItem() {
        setAdding(true)
    }

    async function saveItem() {
        let response = undefined

        if (semence.id === 0) response = await Client.post(semence)
        else response = await Client.patch(semence.id, semence)

        if (response.ok) {
            toast(semence.id === 0 ? 'Crée' : 'Modifié', {
                position: config.toastPosition,
                type: 'success'
            })
            setSemence(defaultSemence)
            if (semence.id === 0 && response.data) setDatas([...semences, response.data])
            else {
                setDatas(semences.map(s => {
                    if (s.id === semence.id) return semence
                    return s
                }))
                setEditing(false)
                setAdding(false)
            }
        } else {
            toast(semence.id === 0 ? 'Echec de création' : 'Echec de mise a jour', {
                position: config.toastPosition,
                type: 'error'
            })
        }
    }

    function closeAdding() {
        setAdding(false)
        setEditing(false)
    }

    useEffect(() => {
        getDatas()
    }, [])

    return <>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="m-0">Gestion des sémences</h3>
            <Button mode={(adding || editing) ? "danger" : "primary"} onClick={(adding || editing) ? closeAdding : addItem}>{(adding || editing) ? 'Fermer' : 'Nouveau'}</Button>
        </div>

        {(adding || editing) && <Block className="mb-5">
            <h4 className="mb-5">{editing && "Editer un séménce"}{adding && "Nouveau sémence"}</h4>
            <div className="row mb-4">
                <div className="col-6">
                    <Input error={error?.data?.errors.name} label="Nom" value={semence.name}
                        onChange={({ target }) => setSemence({ ...semence, name: target.value })} />
                </div>
                <div className="col-6">
                    <Input error={error?.data?.errors.unit} label="Unité" value={semence.unit}
                        onChange={({ target }) => setSemence({ ...semence, unit: target.value })}
                        required={false} />
                </div>
            </div>
            <Button loading={RequestState.creating || RequestState.updating} onClick={saveItem} mode="primary" icon="save">Enregistrer</Button>
        </Block>}

        <Block>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Unité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading ? range(10).map(index => <tr key={index}>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                    </tr>) : semences?.length === 0 && <tr><td className="text-center" colSpan={3}>Aucune données</td></tr>}
                    {semences && semences.map(semence => <tr key={semence.id}>
                        <td>{semence.name}</td>
                        <td>{semence.unit}</td>
                        <td>
                            <Button mode="primary" className="me-2" size="sm" icon="edit" onClick={() => editItem(semence.id)} />
                            <Button mode="danger" size="sm" icon="trash" onClick={() => removeItem(semence.id)} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>
    </>
}