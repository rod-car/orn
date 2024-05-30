import { config, getToken } from "@renderer/config";
import { years } from "functions";
import { useApi } from "hooks";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Block, Select, Input } from "ui";

type RelationType = 'material' | 'semence' | 'engrais'

type GardenMaterial = { material_id: number, quantity: number }
const defaultGardenMaterial = { material_id: 0, quantity: 0 }
const defaultGardenMaterials: GardenMaterial[] = [defaultGardenMaterial]

type GardenEngrais = { engrais_id: number, quantity: number }
const defaultGardenEngrais = { engrais_id: 0, quantity: 0 }
const defaultGardenEngraiss: GardenEngrais[] = [defaultGardenEngrais]

type GardenSemence = { semence_id: number, quantity: number }
const defaultGardenSemence = { semence_id: 0, quantity: 0 }
const defaultGardenSemences: GardenSemence[] = [defaultGardenSemence]

export function StepsData(): ReactNode {
    const { datas: steps, Client, RequestState, error } = useApi<Steps>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/jardin-scolaires/steps'
    })

    const { datas: schools, Client: SchoolClient, RequestState: SchoolRequestState } = useApi<School>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/schools',
        key: 'data'
    })

    const [formData, setFormData] = useState<{ school_id: number, step_id: number, year: number, files: File[] }>({ school_id: 0, step_id: 0, year: 2024, files: [] })
    const [addData, setAddData] = useState<Record<string, string | number>>()
    const [columnsData, setColumnsData] = useState<Record<string, string>>()

    const [gardenMaterials, setGardenMaterials] = useState(defaultGardenMaterials)
    const [gardenSemence, setGardenSemence] = useState(defaultGardenSemences)
    const [gardenEngrais, setGardenEngrais] = useState(defaultGardenEngraiss)

    const { Client: MaterielClient, datas: materiels } = useApi<Materiel>({ baseUrl: config.baseUrl, token: getToken(), url: '/jardin-scolaires/materiels' })
    const { Client: SemenceClient, datas: semences } = useApi<Semence>({ baseUrl: config.baseUrl, token: getToken(), url: '/jardin-scolaires/semences' })
    const { Client: EngraisClient, datas: engrais } = useApi<Engrais>({ baseUrl: config.baseUrl, token: getToken(), url: '/jardin-scolaires/engrais' })

    async function getDatas() {
        await Client.get()
        await SchoolClient.get()
    }

    useEffect(() => {
        getDatas()
        MaterielClient.get()
        SemenceClient.get()
        EngraisClient.get()
    }, [])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const data = {
            ...formData,
            ...addData,
            materials: gardenMaterials,
            semences: gardenSemence,
            engrais: gardenEngrais
        }

        const response = await Client.post(data, "/add-step", {}, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        if (response.ok) {
            toast("Enregistré", { type: "success", position: config.toastPosition })
            setFormData({ year: 2024, school_id: 0, step_id: 0, files: [] })
            setAddData({})
            setColumnsData({})
        } else {
            toast("Impossible d'enregistrer", { type: "error", position: config.toastPosition })
        }
    }

    function handleChange(target: EventTarget & (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement), add: boolean = false) {
        if (add) setAddData({ ...addData, [target.name]: target.value })
        else setFormData({ ...formData, [target.name]: target.name === 'files' ? Array.from(target.files) : target.value })

        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }

        if (target.name === 'step_id') {
            const selectedStep = steps.find(step => step.id === parseInt(target.value))
            setColumnsData(selectedStep?.columns_data)
            const addData: Record<string, string> = {}

            Object.keys(selectedStep?.columns_data ?? {}).map(key => {
                addData[key] = ''
            })

            setAddData({ ...addData })
        }
    }

    function getType(columnType: string): string {
        if (columnType === "Nombre" || columnType === "integer") return 'number'
        if (columnType === "Date" || columnType === "date") return 'date'
        if (columnType === "Texte" || columnType === "text") return 'text'
        return 'text'
    }

    const addElement = (type: RelationType) => {
        if (type === 'material') setGardenMaterials([...gardenMaterials, defaultGardenMaterial])
        if (type === 'engrais') setGardenEngrais([...gardenEngrais, defaultGardenEngrais])
        if (type === 'semence') setGardenSemence([...gardenSemence, defaultGardenSemence])
    }

    const removeElement = (index: number, type: RelationType) => {
        if (type === 'material') setGardenMaterials([...gardenMaterials.filter((_value, key) => key !== index)])
        if (type === 'semence') setGardenSemence([...gardenSemence.filter((_value, key) => key !== index)])
        if (type === 'engrais') setGardenEngrais([...gardenEngrais.filter((_value, key) => key !== index)])
    }

    const handleFieldChange = (value: string | number, index: number, key: keyof GardenMaterial | keyof GardenEngrais | keyof GardenSemence, type: RelationType) => {
        if (type === 'material') {
            gardenMaterials[index] = { ...gardenMaterials[index], [key]: value }
            setGardenMaterials([...gardenMaterials])
        }
        if (type === 'engrais') {
            gardenEngrais[index] = { ...gardenEngrais[index], [key]: value }
            setGardenEngrais([...gardenEngrais])
        }
        if (type === 'semence') {
            gardenSemence[index] = { ...gardenSemence[index], [key]: value }
            setGardenSemence([...gardenSemence])
        }
    }

    function removeFile(index: number): void {
        formData.files?.splice(index, 1)
        setFormData({ ...formData })
    }

    return <>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="m-0">Ajouter des données</h3>
        </div>

        <Block className="mb-5">
            <form onSubmit={handleSubmit} action="" method="post">
                <div className="row mb-3">
                    <div className="col-xl-6">
                        <Select
                            options={schools}
                            placeholder="Selectionner un établissement"
                            config={{ optionKey: 'id', valueKey: 'name' }}
                            label="Etablissement"
                            error={error?.data?.errors?.school_id}
                            onChange={({ target }): void => handleChange(target)}
                            name="school_id"
                            loading={SchoolRequestState.loading}
                            value={formData.school_id}
                            controlled
                        />
                    </div>
                    <div className="col-xl-3">
                        <Select
                            options={steps}
                            placeholder="Selectionner un étape"
                            config={{ optionKey: 'id', valueKey: 'title' }}
                            label="Etape"
                            error={error?.data?.errors?.step_id}
                            onChange={({ target }): void => handleChange(target)}
                            name="step_id"
                            loading={SchoolRequestState.loading}
                            value={formData.step_id}
                            controlled
                        />
                    </div>
                    <div className="col-xl-3">
                        <Select
                            options={years}
                            placeholder="Année"
                            label="Année"
                            error={error?.data?.errors?.year}
                            onChange={({ target }): void => handleChange(target)}
                            name="year"
                            value={formData.year}
                            controlled
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-xl-12">
                        <Input
                            label="Images / Vidéos"
                            type='file'
                            multiple
                            accept='image/*, video/*'
                            error={error?.data?.errors?.files}
                            onChange={({ target }): void => handleChange(target)}
                            name="files"
                            required={false}
                        />
                    </div>
                    {formData.files && formData.files.length > 0 && <div className="row mt-3">{formData.files.map((file, index) => {
                        const url = URL.createObjectURL(file)
                        return <div key={index} className="col-3 mb-3" style={{ position: 'relative' }}>
                            <Button onClick={() => removeFile(index)} style={{ position: 'absolute', top: 10, right: 20 }} icon="close" size="sm" mode="danger" />
                            <img className="w-100" src={url} />
                        </div>
                    })}</div>}
                </div>

                <div className="row mb-3">
                    {columnsData && Object.keys(columnsData).map(label => <div key={label} className="col-6 mb-3">
                        <Input value={addData[label]} onChange={({ target }) => handleChange(target, true)} name={label} type={getType(columnsData[label])} label={label} />
                    </div>)}
                </div>

                <div className="mt-5 mb-5">
                    <div className="row mb-3">
                        <div className="col-12">
                            <label htmlFor="" className="form-label text-primary fw-bold">Matériels</label>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Désignation</th>
                                        <th>Quantité</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gardenMaterials && gardenMaterials.map((element: GardenMaterial, index) => <tr key={index}>
                                        <td>
                                            <Select onChange={({ target }) => handleFieldChange(target.value, index, 'material_id', 'material')} value={element.material_id} options={materiels} config={{ optionKey: 'id', valueKey: 'name' }} controlled />
                                        </td>
                                        <td>
                                            <Input type="number" onChange={({ target }) => handleFieldChange(target.value, index, 'quantity', 'material')} value={element.quantity} />
                                        </td>
                                        <td>
                                            {index === 0 && <Button onClick={() => addElement('material')} type="button" mode="primary" icon="plus" />}
                                            {index > 0 && <Button onClick={() => removeElement(index, 'material')} type="button" mode="danger" icon="minus" />}
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <label htmlFor="" className="form-label text-primary fw-bold">Engrais</label>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Désignation</th>
                                        <th>Quantité</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gardenEngrais && gardenEngrais.map((element: GardenEngrais, index) => <tr key={index}>
                                        <td>
                                            <Select onChange={({ target }) => handleFieldChange(target.value, index, 'engrais_id', 'engrais')} value={element.engrais_id} options={engrais} config={{ optionKey: 'id', valueKey: 'name' }} controlled />
                                        </td>
                                        <td>
                                            <Input type="number" onChange={({ target }) => handleFieldChange(target.value, index, 'quantity', 'engrais')} value={element.quantity} />
                                        </td>
                                        <td>
                                            {index === 0 && <Button onClick={() => addElement('engrais')} type="button" mode="primary" icon="plus" />}
                                            {index > 0 && <Button onClick={() => removeElement(index, 'engrais')} type="button" mode="danger" icon="minus" />}
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <label htmlFor="" className="form-label text-primary fw-bold">Sémence</label>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Désignation</th>
                                        <th>Quantité</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gardenSemence && gardenSemence.map((element: GardenSemence, index) => <tr key={index}>
                                        <td>
                                            <Select onChange={({ target }) => handleFieldChange(target.value, index, 'semence_id', 'semence')} value={element.semence_id} options={semences} config={{ optionKey: 'id', valueKey: 'name' }} controlled />
                                        </td>
                                        <td>
                                            <Input type="number" onChange={({ target }) => handleFieldChange(target.value, index, 'quantity', 'semence')} value={element.quantity} />
                                        </td>
                                        <td>
                                            {index === 0 && <Button onClick={() => addElement('semence')} type="button" mode="primary" icon="plus" />}
                                            {index > 0 && <Button onClick={() => removeElement(index, 'semence')} type="button" mode="danger" icon="minus" />}
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Button type="submit" loading={RequestState.creating} mode="primary" icon="save">Enregistrer</Button>
            </form>
        </Block>
    </>
}