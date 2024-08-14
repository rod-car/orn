import { useExcelReader } from 'hooks'
import { ChangeEvent } from 'react'
import { Link } from '@base/components'
import { Block, Button, Input, Spinner } from 'ui'

export function ImportConso(): ReactNode {
    const { json, importing, toJSON } = useExcelReader()

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        toJSON(e.target)
    }

    async function save() {

    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>Importer une consommation</h2>
                <Link to="/cantine/list-conso" className="btn primary-link">
                    <i className="bi bi-list me-2"></i>Liste des consommation
                </Link>
            </div>

            <Block className="mb-5">
                <form action="" encType="multipart/form-data">
                    <Input
                        type="file"
                        required={true}
                        label="Selectionner un fichier"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileChange}
                    />
                </form>
            </Block>

            <Block className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h4 className="text-primary">Affichage temporaire des données</h4>
                    {json.length > 0 && (
                        <Button
                            loading={true}
                            icon="save"
                            type="button"
                            mode="primary"
                            onClick={save}
                        >Enregistrer</Button>
                    )}
                </div>
                <hr />
                <div className="table-responsive mb-5">
                    
                </div>

                {importing && <Spinner />}
            </Block>
        </>
    )
}
