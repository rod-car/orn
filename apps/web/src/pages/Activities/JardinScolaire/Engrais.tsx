import { config } from "@base/config";
import { range } from "functions";
import { useApi } from "hooks";
import { ReactNode, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Block, Button, Input } from "ui";

export function Engrais(): ReactNode {
    const { datas: engraisData, setDatas, Client, RequestState, error } = useApi<Engrais>({
        
        
        url: '/jardin-scolaires/engrais'
    })

    const defaultEngrais: Engrais = { id: 0, name: '', unit: '', type: '' }
    const [engrais, setEngrais] = useState<Engrais>(defaultEngrais)
    const [adding, setAdding] = useState(false)
    const [editing, setEditing] = useState(false)

    async function getDatas() {
        await Client.get()
    }

    async function editItem(id: number) {
        const eng = engraisData.find(eng => eng.id === id)
        if (eng !== undefined) {
            setEngrais(eng)
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
                            setDatas(engraisData.filter(eng => eng.id !== id))
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

        if (engrais.id === 0) response = await Client.post(engrais)
        else response = await Client.patch(engrais.id, engrais)

        if (response.ok) {
            toast(engrais.id === 0 ? 'Crée' : 'Modifié', {
                position: config.toastPosition,
                type: 'success'
            })
            setEngrais(defaultEngrais)
            if (engrais.id === 0 && response.data) setDatas([...engraisData, response.data])
            else {
                setDatas(engraisData.map(e => {
                    if (e.id === engrais.id) return engrais
                    return e
                }))
                setEditing(false)
                setAdding(false)
            }
        } else {
            toast(engrais.id === 0 ? 'Echec de création' : 'Echec de mise a jour', {
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
            <h3 className="m-0">Gestion des engrais</h3>
            <Button mode={(adding || editing) ? "danger" : "primary"} onClick={(adding || editing) ? closeAdding : addItem}>{(adding || editing) ? 'Fermer' : 'Nouveau'}</Button>
        </div>

        {(adding || editing) && <Block className="mb-5">
            <h4 className="mb-5">{editing && "Editer un engrais"}{adding && "Nouveau engrais"}</h4>
            <div className="row mb-4">
                <div className="col-6">
                    <Input error={error?.data?.errors.name} label="Nom" value={engrais.name}
                        onChange={({ target }) => setEngrais({ ...engrais, name: target.value })} />
                </div>
                <div className="col-3">
                    <Input error={error?.data?.errors.unit} label="Unité" value={engrais.unit}
                        onChange={({ target }) => setEngrais({ ...engrais, unit: target.value })}
                        required={false} />
                </div>
                <div className="col-3">
                    <Input error={error?.data?.errors.type} label="Type d'engrais" value={engrais.type}
                        onChange={({ target }) => setEngrais({ ...engrais, type: target.value })}
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
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading ? range(10).map(index => <tr key={index}>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                    </tr>) : engraisData?.length === 0 && <tr><td className="text-center" colSpan={4}>Aucune données</td></tr>}
                    {engraisData && engraisData.map(eng => <tr key={eng.id}>
                        <td>{eng.name}</td>
                        <td>{eng.unit}</td>
                        <td>{eng.type}</td>
                        <td>
                            <Button mode="primary" className="me-2" size="sm" icon="edit" onClick={() => editItem(eng.id)} />
                            <Button mode="danger" size="sm" icon="trash" onClick={() => removeItem(eng.id)} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>
    </>
}