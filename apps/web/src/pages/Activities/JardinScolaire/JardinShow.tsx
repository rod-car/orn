import { Link } from "@base/components";
import { capitalize } from "functions";
import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Block } from "ui";

export function JardinShow(): ReactNode {
    const { id } = useParams()
    const { Client, data } = useApi<Garden>({  url: "/jardin-scolaires" })

    function getData() {
        Client.find(parseInt(id as string))
    }

    useEffect(() => {
        getData()
    }, [])

    return <>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h3>Détails: {data?.school?.name} - {data?.year}</h3>
            <Link to="/scholar-garden/list" className="btn btn-primary">
                <i className="bi bi-list me-2"></i>Liste des jardins
            </Link>
        </div>

        <Block>
            <div className="mb-4">
                <h3 className="mb-4">Distribution</h3>
                <hr />
                <Block className="row">
                    <div className="col-4 border p-2 rounded">
                        <h5>Matériels</h5>
                        <ul>
                            {data?.materials?.map(materiel => <li key={materiel.id}>
                                <b>{materiel.name}: {materiel.pivot.quantity}</b>
                            </li>)}
                        </ul>
                    </div>
                    <div className="col-4 border p-2 rounded">
                        <h5>Sémences</h5>
                        <ul>
                            {data?.semences?.map(semence => <li key={semence.id}>
                                <b>{semence.name}: {semence.pivot.quantity}</b>
                            </li>)}
                        </ul>
                    </div>
                    <div className="col-4 border p-2 rounded">
                        <h5>Engrais</h5>
                        <ul>
                            {data?.engrais?.map(engrai => <li key={engrai.id}>
                                <b>{engrai.name}: {engrai.pivot.quantity}</b>
                            </li>)}
                        </ul>
                    </div>
                </Block>
            </div>

            <div className="mb-4">
                <h3>Les étapes du jardin</h3>
                <hr />
                {data && data.steps && Object.keys(data.steps).map(title => {
                    const step = data.steps[title]
                    if (step !== null) return <Block key={title} className="row mb-3">
                        <div className="col-6">
                            <h5 className="mb-3 text-primary">{title}</h5>
                            {step && Object.keys(step).map(key => {
                                const removeKeys = ['id', 'jardin_id', 'materiels', 'semences', 'engrais', 'images']
                                return (removeKeys.includes(key) === false) && <h6 className="mb-2"><b>{capitalize(key)}:</b> {step[key]}</h6>
                            })}

                            <hr />
                            <h6 className="mt-3 fw-bold mb-3">Matériels utilisés</h6>
                            {step.materiels && <ul>
                                {step.materiels.map((materiel: Materiel) => <li key={materiel.materiel_id}>{materiel.name}: {materiel.quantity}</li>)}
                            </ul>}

                            <h6 className="mt-3 fw-bold mb-3">Engrais utilisés</h6>
                            {step.engrais && <ul>
                                {step.engrais.map((engrais: Engrais) => <li key={engrais.engrais_id}>{engrais.name}: {engrais.quantity}</li>)}
                            </ul>}

                            <h6 className="mt-3 fw-bold mb-3">Sémences utilisés</h6>
                            {step.semences && <ul>
                                {step.semences.map((semence: Semence) => <li key={semence.semence_id}>{semence.name}: {semence.quantity}</li>)}
                            </ul>}
                        </div>
                        <div className="col-6">
                            <div className="row">
                                {step.images && step.images.map(image => <div className="col-6 mb-3">
                                    <img className="img-fluid" src={image.full_path} alt="" />
                                </div>)}
                            </div>
                        </div>
                    </Block>
                })}
            </div>

            <div className="row mb-4">
                <h3>Les détails</h3>
                <hr />
                <div className="row">
                    <div className="col-6 mb-3">
                        <h5>Problèmes rencontré</h5>
                        <p>{data?.problem ?? 'Aucune données'}</p>
                    </div>
                    <div className="col-6 mb-3">
                        <h5>Solution</h5>
                        <p>{data?.solution ?? 'Aucune données'}</p>
                    </div>
                    <div className="col-6 mb-3">
                        <h5>Perspectives</h5>
                        <p>{data?.perspective ?? 'Aucune données'}</p>
                    </div>
                    <div className="col-6 mb-3">
                        <h5>Annexe</h5>
                        <p>{data?.annex ?? 'Aucune données'}</p>
                    </div>
                </div>
            </div>
        </Block>
    </>
}