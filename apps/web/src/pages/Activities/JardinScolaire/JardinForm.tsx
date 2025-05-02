import { FormEvent, useEffect, useState } from 'react'
import { Button, Input, Select, Textarea } from 'ui'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { years } from 'functions'

type GardenFormProps = {
    editedGarden?: Garden
}

const defaultGarden: Garden = {
    id: 0,
    school_id: 0,
    problem: '',
    perspective: '',
    annex: '',
    solution: '',
    year: 2024
}

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

export function JardinForm({ editedGarden }: GardenFormProps): ReactNode {
    const [garden, setGarden] = useState(defaultGarden)
    const [gardenMaterials, setGardenMaterials] = useState(defaultGardenMaterials)
    const [gardenSemence, setGardenSemence] = useState(defaultGardenSemences)
    const [gardenEngrais, setGardenEngrais] = useState(defaultGardenEngraiss)

    const { Client, error, RequestState } = useApi<Garden>({   url: '/jardin-scolaires', key: 'data' })
    const { Client: SchoolClient, datas: schools, RequestState: SchoolRequestState } = useApi<School>({   url: '/schools', key: 'data' })
    const { Client: MaterielClient, datas: materiels } = useApi<Materiel>({   url: '/jardin-scolaires/materiels' })
    const { Client: SemenceClient, datas: semences } = useApi<Semence>({   url: '/jardin-scolaires/semences' })
    const { Client: EngraisClient, datas: engrais } = useApi<Engrais>({   url: '/jardin-scolaires/engrais' })

    useEffect(() => {
        SchoolClient.get()
        MaterielClient.get()
        EngraisClient.get()
        SemenceClient.get()
    }, [])

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const data = {
            ...garden,
            materials: gardenMaterials,
            semences: gardenSemence,
            engrais: gardenEngrais
        }

        const response = editedGarden
            ? await Client.patch(editedGarden.id, data)
            : await Client.post(data)

        if (response.ok) {
            const message = editedGarden ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            if (editedGarden === undefined) {
                setGarden(defaultGarden)
                setGardenEngrais(defaultGardenEngraiss)
                setGardenMaterials(defaultGardenMaterials)
                setGardenSemence(defaultGardenSemences)
            }
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    if (editedGarden !== undefined && garden.id === 0) {
        setGarden({
            ...editedGarden,
        })
        const gdEngrais = editedGarden.engrais.map(gdEngrais => {
            return {
                engrais_id: gdEngrais.id,
                quantity: gdEngrais.pivot.quantity
            }
        })
        const gdSemence = editedGarden.semences.map(gdSemence => {
            return {
                semence_id: gdSemence.id,
                quantity: gdSemence.pivot.quantity
            }
        })
        const gdMateriel = editedGarden.materials.map(gdMaterial => {
            return {
                material_id: gdMaterial.id,
                quantity: gdMaterial.pivot.quantity
            }
        })
        setGardenEngrais(gdEngrais)
        setGardenMaterials(gdMateriel)
        setGardenSemence(gdSemence)
    }

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)): void => {
        setGarden({ ...garden, [target.name]: target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }
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

    return (
        <form action="#" onSubmit={handleSubmit} method="post">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Select
                        options={schools}
                        placeholder="Selectionner un établissement"
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        label="Etablissement"
                        value={garden.school_id}
                        error={error?.data?.errors?.school_id}
                        onChange={({ target }): void => handleChange(target)}
                        name="school_id"
                        loading={SchoolRequestState.loading}
                        controlled
                    />
                </div>
                <div className="col-xl-6">
                    <Select
                        label="Année"
                        placeholder="Selectionner une année"
                        options={years}
                        value={garden.year}
                        error={error?.data?.errors?.year}
                        onChange={({ target }): void => handleChange(target)}
                        name="year"
                        controlled
                    />
                </div>
            </div>

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

            <div className="row mb-3">
                <div className="col-xl-6">
                    <Textarea
                        required={false}
                        label="Problème"
                        value={garden.problem}
                        error={error?.data?.errors?.problem}
                        onChange={({ target }): void => handleChange(target)}
                        name="problem"
                    />
                </div>
                <div className="col-xl-6">
                    <Textarea
                        required={false}
                        label="Solution"
                        value={garden.solution}
                        error={error?.data?.errors?.solution}
                        onChange={({ target }): void => handleChange(target)}
                        name="solution"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-xl-6">
                    <Textarea
                        required={false}
                        label="Perspective"
                        value={garden.perspective}
                        error={error?.data?.errors?.perspective}
                        onChange={({ target }): void => handleChange(target)}
                        name="perspective"
                    />
                </div>
                <div className="col-xl-6">
                    <Textarea
                        required={false}
                        label="Annexe"
                        value={garden.annex}
                        error={error?.data?.errors?.annex}
                        onChange={({ target }): void => handleChange(target)}
                        name="annex"
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
