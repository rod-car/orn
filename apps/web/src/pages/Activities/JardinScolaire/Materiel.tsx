import { config } from "@base/config";
import { range } from "functions";
import { useApi } from "hooks";
import { ReactNode, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Button, Block, Input, Textarea } from "ui";

export function Materiel(): ReactNode {
    const { datas: materiels, setDatas, Client, RequestState, error } = useApi<Materiel>({
        
        
        url: '/jardin-scolaires/materiels'
    })

    const defaultMateriel: Materiel = { id: 0, name: '', description: '' }
    const [materiel, setMateriel] = useState<Materiel>(defaultMateriel)
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState(false)

    async function getDatas() {
        await Client.get()
    }

    async function editItem(id: number) {
        const mat = materiels.find(mat => mat.id === id)
        if (mat !== undefined) {
            setMateriel(mat)
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
                            setDatas(materiels.filter(mat => mat.id !== id))
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

        if (materiel.id === 0) response = await Client.post(materiel)
        else response = await Client.patch(materiel.id, materiel)

        if (response.ok) {
            toast(materiel.id === 0 ? 'Crée' : 'Modifié', {
                position: config.toastPosition,
                type: 'success'
            })
            setMateriel(defaultMateriel)
            if (materiel.id === 0 && response.data) setDatas([...materiels, response.data])
            else {
                setDatas(materiels.map(e => {
                    if (e.id === materiel.id) return materiel
                    return e
                }))
                setEditing(false)
                setAdding(false)
            }
        } else {
            toast(materiel.id === 0 ? 'Echec de création' : 'Echec de mise a jour', {
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
            <h3 className="m-0">Gestion des matériels</h3>
            <Button mode={(adding || editing) ? "danger" : "primary"} onClick={(adding || editing) ? closeAdding : addItem}>{(adding || editing) ? 'Fermer' : 'Nouveau'}</Button>
        </div>

        {(adding || editing) && <Block className="mb-5">
            <h4 className="mb-5">{editing && "Editer un matériel"}{adding && "Nouveau matériel"}</h4>
            <div className="row mb-4">
                <div className="col-12 mb-3">
                    <Input error={error?.data?.errors.name} label="Nom" value={materiel.name}
                        onChange={({ target }) => setMateriel({ ...materiel, name: target.value })} />
                </div>
                <div className="col-12">
                    <Textarea error={error?.data?.errors.description} label="Description" value={materiel.description}
                        onChange={({ target }) => setMateriel({ ...materiel, description: target.value })}
                        required={false} />
                </div>
            </div>
            <Button permission="garden.create" loading={RequestState.creating || RequestState.updating} onClick={saveItem} mode="primary" icon="save">Enregistrer</Button>
        </Block>}

        <Block>
            <table className="table table-striped table-bordered table-hover text-sm">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading ? range(10).map(index => <tr key={index}>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                    </tr>) : materiels?.length === 0 && <tr><td className="text-center" colSpan={3}>Aucune données</td></tr>}
                    {materiels && materiels.map(mat => <tr key={mat.id}>
                        <td>{mat.name}</td>
                        <td>{mat.description}</td>
                        <td>
                            <Button mode="primary" className="me-2" size="sm" icon="edit" onClick={() => editItem(mat.id)} />
                            <Button mode="danger" size="sm" icon="trash" onClick={() => removeItem(mat.id)} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>
    </>
}