import {FormEvent, ReactNode, useCallback, useState} from "react";
import {Block, Input, PageTitle, PrimaryButton, Select} from "ui";
import {Col, Row} from "@base/components/Bootstrap";
import { ageFull, ageMonth, gender } from "functions"
import {PrimaryLink, Z} from "@base/components";
import {useApi} from "hooks"
import {toast} from "react-toastify";
import {config} from "@base/config";

const defaultFormData = {
    lastname: '',
    firstname: '',
    birth_date: '',
    age: '',
    gender: 'Fille',
    parents: '',
    height: 0,
    weight: 0
}

export function ZCalculator(): ReactNode {
    const [result, setResult] = useState<Person>()
    const [formData, setFormData] = useState(defaultFormData)

    const {Client, RequestState} = useApi<typeof formData>({
        url: '/tools'
    })

    const handleChange = useCallback(({target}: InputChange) => {
        const {name, value} = target

        if (name === 'birth_date') {
            const age = ageFull(value)
            const month = ageMonth(value)

            setFormData({...formData, birth_date: value, age: `${age} ${month > 12 ? `(${month}M)` : ''}`})
        } else {
            setFormData({...formData, [name]: value})
        }
    }, [formData])

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        const response = await Client.post(formData, '/z-calculator')

        if (response.ok) {
            toast("Enregistre avec succe", {
                position: config.toastPosition,
                type: "success"
            })

            setFormData({...defaultFormData})
            response.data && setResult((response.data as unknown as {person: Person}).person as unknown as Person)
        } else {
            toast("Erreur d'enregistrement", {
                position: config.toastPosition,
                type: "error"
            })
        }

    }, [formData])

    return <>
        <PageTitle title="Calculateur de Z (2 ans a 18 ans)">
            <PrimaryLink to="/tools/z-history" icon="list">Historique de calcul</PrimaryLink>
        </PageTitle>
        <Row>
            <Col n={8}>
                <Block title="Information de l'enfant">
                    <form method="post" onSubmit={handleSubmit}>
                        <Row>
                            <Col n={6}>
                                <Input
                                    label="Nom"
                                    placeholder="Nom"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col n={6}>
                                <Input
                                    label="Prenoms"
                                    placeholder="Prenoms"
                                    required={false}
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col n={3}>
                                <Input
                                    label="Date de naissance"
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col n={3}>
                                <Input
                                    auto
                                    label="Age"
                                    placeholder="Age ici"
                                    value={formData.age}
                                />
                            </Col>
                            <Col n={6}>
                                <Select
                                    label="Sexe"
                                    name="gender"
                                    placeholder={null}
                                    options={gender}
                                    value={formData.gender}
                                    onChange={handleChange}
                                    controlled
                                />
                            </Col>
                            <Col n={6}>
                                <Input
                                    type="number"
                                    label="Taille"
                                    placeholder="Taille"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col n={6}>
                                <Input
                                    type="number"
                                    label="Poids"
                                    placeholder="Poids"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <PrimaryButton type={"submit"} loading={RequestState.creating} icon="save">Voir le resultat</PrimaryButton>
                    </form>
                </Block>
            </Col>
            <Col n={4}>
                <Block title="Resultats de la mesure">
                    {result && <>
                        <h5 className="fw-bold">
                            <span className="text-uppercase">{result.lastname}</span>
                            {result.firstname}
                        </h5>
                        <ul>
                            <li><b>Code</b>: {result.id}</li>
                            <li><b>Age</b>: {ageFull(result.birth_date)} ({ageMonth(result.birth_date)} mois)</li>
                            <li><b>Taille</b>: {parseFloat(result.height.toString())} Cm</li>
                            <li><b>Poids</b>: {parseFloat(result.weight.toString())} Kg</li>
                        </ul>

                        <p className="fw-bold">Valeurs de Z</p>
                        <ul>
                            <li>Taille pour l'age: <Z value={result.z_ha} normal={[25, 75]}/></li>
                            <li>Poids pour l'age: <Z value={result.z_wa} normal={[25, 75]}/></li>
                            <li>Taille pour poids: <Z value={result.z_hw} normal={[-1.5, 0]}/></li>
                            <li>IMC pour age: <Z value={result.z_ia} normal={[-1, 2]}/></li>
                        </ul>
                    </>}
                </Block>
            </Col>
        </Row>
    </>
}