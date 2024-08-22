import { config } from "@base/config";
import { range } from "functions";
import { useApi } from "hooks";
import { ReactNode, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Button, Block, Input, Textarea, Select } from "ui";

type StepsDetails = { label: string, dataType: string, unit: string, referenceColumn?: string, referenceType?: string }
const defaultStepsDetail: StepsDetails = { label: "", dataType: "", unit: "", referenceColumn: "", referenceType: "" }
const defaultStepsDetails: StepsDetails[] = [defaultStepsDetail]

type Steps = {
    id: number
    title: string
    description?: string
    details?: StepsDetails[]
    columns_data?: Record<string, string>
}

export function Steps(): ReactNode {
    const { datas, setDatas, Client, RequestState, error } = useApi<Steps>({
        baseUrl: config.baseUrl,
        
        url: '/jardin-scolaires/steps'
    })

    const defaultSteps: Steps = { id: 0, title: '', description: '' }
    const [step, setStep] = useState<Steps>(defaultSteps)
    const [adding, setAdding] = useState(true)
    const [editing, setEditing] = useState(false)
    const [stepDetails, setStepDetails] = useState(defaultStepsDetails)

    async function getDatas() {
        await Client.get()
    }

    async function editItem(id: number) {
        const step = datas.find(step => step.id === id)
        if (step !== undefined) {
            setStep(step)
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
                            setDatas(datas.filter(step => step.id !== id))
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

        if (step.id === 0) response = await Client.post({ ...step, details: stepDetails })
        else response = await Client.patch(step.id, step)

        if (response.ok) {
            toast(step.id === 0 ? 'Crée' : 'Modifié', {
                position: config.toastPosition,
                type: 'success'
            })
            setStep(defaultSteps)
            if (step.id === 0 && response.data) setDatas([...datas, response.data])
            else {
                setDatas(datas.map(s => {
                    if (s.id === step.id) return step
                    return s
                }))
                setEditing(false)
                setAdding(false)
            }
        } else {
            toast(step.id === 0 ? 'Echec de création' : 'Echec de mise a jour', {
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

    const addElement = () => {
        setStepDetails([...stepDetails, defaultStepsDetail])
    }

    const removeElement = (index: number) => {
        setStepDetails([...stepDetails.filter((_value, key) => key !== index)])
    }

    const handleFieldChange = (value: string | number, index: number, key: keyof StepsDetails) => {
        stepDetails[index] = { ...stepDetails[index], [key]: value }
        setStepDetails([...stepDetails])
    }

    return <>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="m-0">Gestion des étapes</h3>
            <Button mode={(adding || editing) ? "danger" : "primary"} onClick={(adding || editing) ? closeAdding : addItem}>{(adding || editing) ? 'Fermer' : 'Nouveau'}</Button>
        </div>

        {(adding || editing) && <Block className="mb-5">
            <h4 className="mb-4">{editing && "Editer un étape"}{adding && "Nouvelle étape"}</h4>
            <div className="row mb-3">
                <div className="col-12 mb-3">
                    <Input error={error?.data?.errors?.title} label="Titre du sous-activité" value={step.title}
                        onChange={({ target }) => setStep({ ...step, title: target.value })}
                        placeholder="Preparation du sol, Récolte" />
                </div>
                <div className="col-12">
                    <Textarea error={error?.data?.errors?.description} label="Description du sous-activité" value={step.description}
                        onChange={({ target }) => setStep({ ...step, description: target.value })}
                        required={false}
                        rows={2} />
                </div>
            </div>
            <div className="mb-4">
                <label className="form-label text-primary fw-bold">Détails</label>
                <table className="table table-bordered w-100">
                    <thead>
                        <tr>
                            <th>Libellé</th>
                            <th>Type de données</th>
                            <th>Unité</th>
                            <th>Référence</th>
                            <th>Type de référence</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stepDetails && stepDetails.map((element: StepsDetails, index) => <tr key={index}>
                            <td><Input onChange={({ target }) => handleFieldChange(target.value, index, 'label')} value={element.label} placeholder="Détails" /></td>
                            <td><Select onChange={({ target }) => handleFieldChange(target.value, index, 'dataType')} value={element.dataType} options={["Texte", "Date", "Heure", "Nombre"]} controlled /></td>
                            <td><Select onChange={({ target }) => handleFieldChange(target.value, index, 'unit')} value={element.unit} options={["Fotony", "Mètre carré", "Pièce"]} controlled /></td>
                            <td><Select onChange={({ target }) => handleFieldChange(target.value, index, 'referenceColumn')} value={element.referenceColumn} options={["Nombre de plantes prevu"]} controlled /></td>
                            <td><Select onChange={({ target }) => handleFieldChange(target.value, index, 'referenceType')} value={element.referenceType} options={["Pourcentage", "Différence"]} controlled /></td>
                            <td>
                                {index === 0 && <Button onClick={() => addElement()} type="button" mode="primary" icon="plus" />}
                                {index > 0 && <Button onClick={() => removeElement(index)} type="button" mode="danger" icon="minus" />}
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <Button
                loading={RequestState.creating || RequestState.updating}
                onClick={saveItem} mode="primary" icon="save"
            >Enregistrer</Button>
        </Block>}

        <Block>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Données</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading ? range(10).map(index => <tr key={index}>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                        <td><Skeleton style={{ height: 30 }} /></td>
                    </tr>) : datas?.length === 0 && <tr><td className="text-center" colSpan={4}>Aucune données</td></tr>}
                    {datas && datas.map(step => <tr key={step.id}>
                        <td className="text-uppercase">{step.title}</td>
                        <td>{step.description}</td>
                        <td>{step.columns_data && <ul>
                            {Object.keys(step.columns_data).map(index => <li key={index}>{index}: {step.columns_data && step.columns_data[index]}</li>)}
                        </ul>}</td>
                        <td>
                            <Button mode="primary" className="me-2" size="sm" icon="edit" onClick={() => editItem(step.id)} />
                            <Button mode="danger" size="sm" icon="trash" onClick={() => removeItem(step.id)} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>
    </>
}